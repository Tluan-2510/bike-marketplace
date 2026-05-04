<?php

require_once __DIR__ . '/../backend/config/database.php';

/**
 * System Reset Script
 * Deletes all data and creates a new admin account.
 */
class SystemResetter {
    private \PDO $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function run() {
        echo "Bắt đầu dọn dẹp hệ thống...\n";

        try {
            $this->conn->exec("SET FOREIGN_KEY_CHECKS = 0;");

            // Danh sách các bảng cần xóa trắng
            $tables = [
                'product_images',
                'favorites',
                'buy_requests',
                'products',
                'users',
                'categories',
                'brands'
            ];

            foreach ($tables as $table) {
                echo "Đang xóa bảng: $table...\n";
                $this->conn->exec("TRUNCATE TABLE $table;");
            }

            $this->conn->exec("SET FOREIGN_KEY_CHECKS = 1;");

            echo "Dữ liệu đã được xóa sạch.\n";

            // 1. Tạo lại Categories
            echo "Đang khởi tạo lại danh mục...\n";
            $categories = [
                ['Xe đạp địa hình (MTB)', 'mtb'],
                ['Xe đạp đua (Road)', 'road'],
                ['Xe đạp Touring', 'touring'],
                ['Xe đạp Fixed Gear', 'fixed-gear'],
                ['Xe đạp BMX', 'bmx'],
                ['Khác', 'khac']
            ];
            $stmtCat = $this->conn->prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
            foreach ($categories as $cat) {
                $stmtCat->execute($cat);
            }

            // 2. Tạo lại Brands
            echo "Đang khởi tạo lại thương hiệu...\n";
            $brands = ['Giant', 'Trek', 'Specialized', 'Trinx', 'Asama', 'Galaxy', 'Maruishi', 'Khác'];
            $stmtBrand = $this->conn->prepare("INSERT INTO brands (name) VALUES (?)");
            foreach ($brands as $brand) {
                $stmtBrand->execute([$brand]);
            }

            // 3. Tạo tài khoản Admin mới
            echo "Đang tạo tài khoản Admin mới...\n";
            $adminUsername = 'admin_market';
            $adminPassword = 'AdminPassword123';
            $adminEmail = 'admin@bikemarket.vn';
            
            $stmtAdmin = $this->conn->prepare("
                INSERT INTO users (username, email, password_hash, full_name, role) 
                VALUES (?, ?, ?, ?, 'admin')
            ");
            $stmtAdmin->execute([
                $adminUsername,
                $adminEmail,
                password_hash($adminPassword, PASSWORD_BCRYPT),
                'Quản trị viên Hệ thống'
            ]);

            echo "------------------------------------------\n";
            echo "RESET HỆ THỐNG THÀNH CÔNG!\n";
            echo "Tài khoản Admin mới:\n";
            echo "Username: $adminUsername\n";
            echo "Password: $adminPassword\n";
            echo "Email: $adminEmail\n";
            echo "------------------------------------------\n";

        } catch (\Exception $e) {
            echo "LỖI: " . $e->getMessage() . "\n";
        }
    }
}

$resetter = new SystemResetter();
$resetter->run();
