-- Create Database
CREATE DATABASE IF NOT EXISTS electricity_billing;
USE electricity_billing;

-- Create Consumer Table
CREATE TABLE IF NOT EXISTS consumer (
    consumer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Billing Table
CREATE TABLE IF NOT EXISTS billing (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    consumer_id INT NOT NULL,
    units_consumed INT NOT NULL,
    bill_amount DECIMAL(10,2) NOT NULL,
    bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consumer_id) REFERENCES consumer(consumer_id)
);

-- Insert Sample Data
INSERT INTO consumer (name, address, phone) VALUES
('John Doe', '123 Main St, City', '9876543210'),
('Jane Smith', '456 Park Ave, Town', '8765432109');