CREATE DATABASE IF NOT EXISTS electricity_billing;
USE electricity_billing;

CREATE TABLE IF NOT EXISTS consumer (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS billing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  consumer_id INT NOT NULL,
  units_consumed INT NOT NULL,
  bill_amount DECIMAL(10,2) NOT NULL,
  billing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consumer_id) REFERENCES consumer(id)
);

-- Insert some sample data
INSERT INTO consumer (name, address, phone) VALUES
('John Doe', '123 Main St', '9876543210'),
('Jane Smith', '456 Park Ave', '8765432109');