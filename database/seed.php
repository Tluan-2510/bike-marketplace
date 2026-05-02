<?php

require_once __DIR__ . '/../backend/config/database.php';

/**
 * Script Seed dữ liệu mẫu cho Bike Marketplace
 */
class Seeder {
    private \PDO $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function run() {
        echo "Bắt đầu Seed dữ liệu...\n";

        // 1. Tạo thêm User mẫu nếu chưa có
        $this->seedUsers();

        // 2. Lấy danh sách ID cần thiết
        $userIds = $this->conn->query("SELECT id FROM users WHERE role = 'user'")->fetchAll(PDO::FETCH_COLUMN);
        $categoryIds = $this->conn->query("SELECT id FROM categories")->fetchAll(PDO::FETCH_COLUMN);
        $brandIds = $this->conn->query("SELECT id FROM brands")->fetchAll(PDO::FETCH_COLUMN);

        if (empty($userIds) || empty($categoryIds) || empty($brandIds)) {
            echo "Lỗi: Cần có Users, Categories và Brands trong DB trước khi seed Products.\n";
            return;
        }

        // 3. Tạo 50+ sản phẩm
        $this->seedProducts($userIds, $categoryIds, $brandIds);

        echo "Seed dữ liệu hoàn tất!\n";
    }

    private function seedUsers() {
        $users = [
            ['username' => 'user1', 'email' => 'user1@example.com', 'password' => password_hash('123456', PASSWORD_BCRYPT), 'full_name' => 'Nguyễn Văn A'],
            ['username' => 'user2', 'email' => 'user2@example.com', 'password' => password_hash('123456', PASSWORD_BCRYPT), 'full_name' => 'Trần Thị B'],
            ['username' => 'user3', 'email' => 'user3@example.com', 'password' => password_hash('123456', PASSWORD_BCRYPT), 'full_name' => 'Lê Văn C'],
        ];

        foreach ($users as $u) {
            $stmt = $this->conn->prepare("INSERT IGNORE INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, 'user')");
            $stmt->execute([$u['username'], $u['email'], $u['password'], $u['full_name']]);
        }
    }

    private function seedProducts($userIds, $categoryIds, $brandIds) {
        $titles = [
            'Xe đạp {brand} {cat} - Mới 99%',
            'Cần bán gấp {brand} {cat} giá rẻ',
            '{brand} {cat} phiên bản giới hạn',
            'Xe đạp thể thao {brand} {cat} siêu bền',
            'Thanh lý {brand} {cat} cho anh em'
        ];

        $locations = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
        $conditions = ['Mới', 'Như mới', 'Sử dụng tốt', 'Có hao mòn'];
        
        for ($i = 1; $i <= 55; $i++) {
            $userId = $userIds[array_rand($userIds)];
            $categoryId = $categoryIds[array_rand($categoryIds)];
            $brandId = $brandIds[array_rand($brandIds)];
            
            $brandName = $this->conn->query("SELECT name FROM brands WHERE id = $brandId")->fetchColumn();
            $categoryName = $this->conn->query("SELECT name FROM categories WHERE id = $categoryId")->fetchColumn();
            
            $titleTemplate = $titles[array_rand($titles)];
            $title = str_replace(['{brand}', '{cat}'], [$brandName, $categoryName], $titleTemplate);
            
            $price = rand(2, 50) * 500000; // 1tr -> 25tr
            $is_approved = (rand(1, 10) > 2) ? 1 : 0; // 80% đã duyệt
            $status = (rand(1, 10) > 8) ? 'sold' : 'available'; // 20% đã bán

            $stmt = $this->conn->prepare("
                INSERT INTO products 
                (seller_id, category_id, brand_id, title, description, price, condition_state, location, is_approved, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $userId,
                $categoryId,
                $brandId,
                $title,
                "Đây là mô tả mẫu cho chiếc $title. Xe còn rất tốt, bảo dưỡng định kỳ.",
                $price,
                $conditions[array_rand($conditions)],
                $locations[array_rand($locations)],
                $is_approved,
                $status
            ]);
            
            $productId = $this->conn->lastInsertId();
            
            // Thêm ảnh mẫu (placeholder)
            $stmtImg = $this->conn->prepare("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)");
            $stmtImg->execute([$productId, "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800"]);
        }
    }
}

$seeder = new Seeder();
$seeder->run();
