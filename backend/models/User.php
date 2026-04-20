<?php

require_once __DIR__ . "/../config/database.php";

class User {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function findByEmail($email) {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function create($username, $email, $password_hash, $phone_number, $full_name) {
        $stmt = $this->conn->prepare("INSERT INTO users (username, email, password_hash, phone_number, full_name) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $username, $email, $password_hash, $phone_number, $full_name);
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        return false;
    }
}
