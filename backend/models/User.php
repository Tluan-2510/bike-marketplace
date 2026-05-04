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
            "SELECT id, username, email, password_hash as password, full_name, phone_number, avatar_url, role, created_at FROM users WHERE email = ? LIMIT 1"
        );
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    /**
     * Tìm user theo ID.
     */
    public function findById(int $id): array|false {
        $stmt = $this->conn->prepare(
            "SELECT id, username, email, full_name, phone_number, avatar_url, role, created_at FROM users WHERE id = ? LIMIT 1"
        );
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    /**
     * Tạo user mới. Password phải đã được hash bằng password_hash() trước khi gọi.
     * Trả về ID mới hoặc false nếu thất bại.
     */
    public function create(string $username, string $email, string $hashedPassword, string $role = 'user', ?string $fullName = null, ?string $phoneNumber = null): int|false {
        $username = filter_var(trim($username), FILTER_SANITIZE_SPECIAL_CHARS);
        $email    = filter_var(trim($email),    FILTER_SANITIZE_EMAIL);
        $role     = in_array($role, ['user', 'admin']) ? $role : 'user';

        $stmt = $this->conn->prepare(
            "INSERT INTO users (username, email, password_hash, role, full_name, phone_number) VALUES (?, ?, ?, ?, ?, ?)"
        );

        if ($stmt->execute([$username, $email, $hashedPassword, $role, $fullName, $phoneNumber])) {
            return (int)$this->conn->lastInsertId();
        }
        return false;
    }

    /**
     * Cập nhật thông tin user.
     */
    public function update(int $id, array $data): bool {
        $fields = [];
        $params = [];

        if (isset($data['full_name'])) {
            $fields[] = "full_name = ?";
            $params[] = $data['full_name'];
        }
        if (isset($data['phone_number'])) {
            $fields[] = "phone_number = ?";
            $params[] = $data['phone_number'];
        }
        if (isset($data['avatar_url'])) {
            $fields[] = "avatar_url = ?";
            $params[] = $data['avatar_url'];
        }

        if (empty($fields)) return false;

        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
        $params[] = $id;

        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($params);
    }
}
