<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers for API
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection parameters - modify these as needed
$host = "localhost";
$username = "root";  // Change this to your MySQL username
$password = "root";      // Change this to your MySQL password
$database = "electricity_billing";

try {
    // Create database connection with error handling
    $conn = new mysqli($host, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Handle OPTIONS request (for CORS preflight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
    
    // Handle GET request for consumers list
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getConsumers') {
        $sql = "SELECT * FROM consumer";
        $result = $conn->query($sql);
        
        if (!$result) {
            throw new Exception("Database query error: " . $conn->error);
        }
        
        $consumers = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $consumers[] = $row;
            }
        }
        
        echo json_encode(["status" => "success", "data" => $consumers]);
        exit;
    }

    // Handle POST request for bill calculation
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get JSON data
        $jsonInput = file_get_contents("php://input");
        
        // Check if JSON input exists
        if (empty($jsonInput)) {
            // If no JSON, try form data
            if (empty($_POST)) {
                throw new Exception("No input data received");
            }
            $data = $_POST;
        } else {
            // Decode JSON with error checking
            $data = json_decode($jsonInput, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Invalid JSON: " . json_last_error_msg());
            }
        }
        
        // Validate input
        if (!isset($data['units']) || !is_numeric($data['units']) || $data['units'] < 0) {
            throw new Exception("Invalid units value");
        }
        
        $units = (int)$data['units'];
        $consumerId = isset($data['consumer_id']) ? (int)$data['consumer_id'] : null;
        
        // Calculate bill amount based on the given conditions
        $billAmount = calculateBill($units);
        
        // Save to database if consumer_id is provided
        if ($consumerId) {
            // Check if consumer exists
            $checkSql = "SELECT consumer_id FROM consumer WHERE consumer_id = ?";
            $checkStmt = $conn->prepare($checkSql);
            
            if (!$checkStmt) {
                throw new Exception("Prepare statement error: " . $conn->error);
            }
            
            $checkStmt->bind_param("i", $consumerId);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows === 0) {
                throw new Exception("Consumer with ID $consumerId not found");
            }
            
            $checkStmt->close();
            
            // Insert billing record
            $sql = "INSERT INTO billing (consumer_id, units_consumed, bill_amount) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql);
            
            if (!$stmt) {
                throw new Exception("Prepare statement error: " . $conn->error);
            }
            
            $stmt->bind_param("iid", $consumerId, $units, $billAmount);
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to save bill: " . $stmt->error);
            }
            
            $billId = $conn->insert_id;
            echo json_encode([
                "status" => "success", 
                "message" => "Bill saved successfully",
                "data" => [
                    "bill_id" => $billId,
                    "consumer_id" => $consumerId,
                    "units_consumed" => $units,
                    "bill_amount" => $billAmount
                ]
            ]);
            
            $stmt->close();
        } else {
            // Just return the calculated amount without saving
            echo json_encode([
                "status" => "success", 
                "data" => [
                    "units_consumed" => $units,
                    "bill_amount" => $billAmount
                ]
            ]);
        }
        
        exit;
    }

    // If we get here, it means an invalid request method
    throw new Exception("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    
} catch (Exception $e) {
    // Return error response
    header("HTTP/1.1 400 Bad Request");
    echo json_encode([
        "status" => "error", 
        "message" => $e->getMessage(),
        "details" => "Error occurred at line " . $e->getLine() . " in " . $e->getFile()
    ]);
} finally {
    // Close the connection if it exists
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}

// Function to calculate electricity bill based on units consumed
function calculateBill($units) {
    $total = 0;
    
    // First 50 units - Rs. 3.50/unit
    if ($units <= 50) {
        $total = $units * 3.50;
    } 
    // Next 100 units - Rs. 4.00/unit (up to 150 units)
    else if ($units <= 150) {
        $total = (50 * 3.50) + (($units - 50) * 4.00);
    } 
    // Next 100 units - Rs. 5.20/unit (up to 250 units)
    else if ($units <= 250) {
        $total = (50 * 3.50) + (100 * 4.00) + (($units - 150) * 5.20);
    } 
    // Units above 250 - Rs. 6.50/unit
    else {
        $total = (50 * 3.50) + (100 * 4.00) + (100 * 5.20) + (($units - 250) * 6.50);
    }
    
    return round($total, 2);
}
?>