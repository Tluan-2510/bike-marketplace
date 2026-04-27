<?php

require_once __DIR__ . "/../config/database.php";

class Brand {
    private \PDO $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function getAll(): array {
        $query = "SELECT * FROM brands";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll();
    }
}
