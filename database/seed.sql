-- Standard Seed for Bike Marketplace
SET NAMES utf8mb4;

-- Clean existing data to ensure clean state
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE users;
TRUNCATE TABLE products;
TRUNCATE TABLE product_images;
TRUNCATE TABLE favorites;
TRUNCATE TABLE buy_requests;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Admin Account
-- Email: admin@gmail.com
-- Password: admin123
INSERT INTO users (username, email, password_hash, full_name, role) 
VALUES ('admin', 'admin@gmail.com', '$2y$10$KpCs4hYgEg6DeEzEbgPKY.q4m34/0YZjgO1I7CdwUlVWPBiCGZpIq', 'System Administrator', 'admin');
