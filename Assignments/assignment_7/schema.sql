-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS billing;
DROP TABLE IF EXISTS consumer;

-- Create consumer table
CREATE TABLE consumer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create billing table
CREATE TABLE billing (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    consumer_id BIGINT NOT NULL,
    units_consumed INT NOT NULL,
    bill_amount DECIMAL(10,2) NOT NULL,
    billing_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consumer FOREIGN KEY (consumer_id) REFERENCES consumer(id)
);

-- Insert sample data for testing
INSERT INTO consumer (name, address, phone) VALUES
('John Doe', '123 Main St, City', '9876543210'),
('Jane Smith', '456 Park Ave, Town', '8765432109'),
('Robert Johnson', '789 Broadway, Village', '7654321098'),
('Emily Wilson', '321 Oak St, County', '6543210987');

-- Insert some billing records
-- John Doe's bills
INSERT INTO billing (consumer_id, units_consumed, bill_amount, billing_date) VALUES
(1, 45, 157.50, DATE_SUB(NOW(), INTERVAL 3 MONTH)),
(1, 62, 217.00, DATE_SUB(NOW(), INTERVAL 2 MONTH)),
(1, 58, 203.00, DATE_SUB(NOW(), INTERVAL 1 MONTH));

-- Jane Smith's bills
INSERT INTO billing (consumer_id, units_consumed, bill_amount, billing_date) VALUES
(2, 130, 455.00, DATE_SUB(NOW(), INTERVAL 3 MONTH)),
(2, 145, 507.50, DATE_SUB(NOW(), INTERVAL 2 MONTH)),
(2, 110, 385.00, DATE_SUB(NOW(), INTERVAL 1 MONTH));

-- Robert Johnson's bills
INSERT INTO billing (consumer_id, units_consumed, bill_amount, billing_date) VALUES
(3, 210, 735.00, DATE_SUB(NOW(), INTERVAL 3 MONTH)),
(3, 240, 840.00, DATE_SUB(NOW(), INTERVAL 2 MONTH)),
(3, 195, 682.50, DATE_SUB(NOW(), INTERVAL 1 MONTH));

-- Emily Wilson's bills
INSERT INTO billing (consumer_id, units_consumed, bill_amount, billing_date) VALUES
(4, 80, 280.00, DATE_SUB(NOW(), INTERVAL 3 MONTH)),
(4, 95, 332.50, DATE_SUB(NOW(), INTERVAL 2 MONTH)),
(4, 105, 367.50, DATE_SUB(NOW(), INTERVAL 1 MONTH));