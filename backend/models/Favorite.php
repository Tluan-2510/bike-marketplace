<?php

require_once __DIR__ . '/../config/database.php';

class Favorite {
    private \PDO $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    /**
     * Kiểm tra sản phẩm đã có trong danh sách yêu thích chưa.
     */
    public function exists(int $userId, int $productId): bool {
        $stmt = $this->conn->prepare(
            "SELECT id FROM favorites WHERE user_id = ? AND product_id = ? LIMIT 1"
        );
        $stmt->execute([$userId, $productId]);
        return $stmt->fetch() !== false;
    }

    /**
     * Thêm sản phẩm vào danh sách yêu thích.
     * Trả về true nếu thành công.
     */
    public function add(int $userId, int $productId): bool {
        $stmt = $this->conn->prepare(
            "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)"
        );
        return $stmt->execute([$userId, $productId]);
    }

    /**
     * Xóa sản phẩm khỏi danh sách yêu thích.
     * Trả về true nếu thành công.
     */
    public function remove(int $userId, int $productId): bool {
        $stmt = $this->conn->prepare(
            "DELETE FROM favorites WHERE user_id = ? AND product_id = ?"
        );
        return $stmt->execute([$userId, $productId]);
    }

    /**
     * Lấy danh sách yêu thích của user, JOIN với bảng products để lấy đầy đủ thông tin xe.
     * Trả về array danh sách sản phẩm đã yêu thích.
     */
    public function getByUserId(int $userId): array {
        $stmt = $this->conn->prepare(
            "SELECT 
                f.id              AS favorite_id,
                f.created_at      AS favorited_at,
                p.id              AS product_id,
                p.title           AS name,
                p.price,
                p.condition_state,
                p.delivery_type,
                p.location,
                p.seller_id,
                p.category_id,
                p.brand_id,
                p.status,
                (
                    SELECT pi.image_url
                    FROM product_images pi
                    WHERE pi.product_id = p.id AND pi.is_primary = 1
                    LIMIT 1
                ) AS image_url,
                c.name            AS category_name,
                b.name            AS brand_name
             FROM favorites f
             INNER JOIN products p ON f.product_id = p.id
             LEFT JOIN categories c ON p.category_id = c.id
             LEFT JOIN brands b ON p.brand_id = b.id
             WHERE f.user_id = ?
             ORDER BY f.created_at DESC"
        );
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }
}
