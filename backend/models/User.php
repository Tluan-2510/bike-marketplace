<?php

require_once __DIR__ . '/../config/database.php';

class User {
    private \PDO $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    /**
     * Tìm user theo email. Dùng Prepared Statement (PDO).
     */
    public function findByEmail(string $email): array|false {
        $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
        $stmt = $this->conn->prepare(
            "SELECT id, username, email, password_hash as password, role, created_at FROM users WHERE email = ? LIMIT 1"
        );
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    /**
     * Tìm user theo ID.
     */
    public function findById(int $id): array|false {
        $stmt = $this->conn->prepare(
            "SELECT id, username, email, role, created_at FROM users WHERE id = ? LIMIT 1"
        );
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    /**
     * Tạo user mới. Password phải đã được hash bằng password_hash() trước khi gọi.
     * Trả về ID mới hoặc false nếu thất bại.
     */
    public function create(string $username, string $email, string $hashedPassword, string $role = 'user'): int|false {
        $username = filter_var(trim($username), FILTER_SANITIZE_SPECIAL_CHARS);
        $email    = filter_var(trim($email),    FILTER_SANITIZE_EMAIL);
        $role     = in_array($role, ['user', 'admin']) ? $role : 'user';

        $stmt = $this->conn->prepare(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)"
        );

        if ($stmt->execute([$username, $email, $hashedPassword, $role])) {
            return (int)$this->conn->lastInsertId();
        }
        return false;
    }
}
