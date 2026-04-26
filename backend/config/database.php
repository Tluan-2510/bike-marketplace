<?php
class Database {
    private $host = "localhost";
    private $db_name = "bike_db";
    private $username = "root";
    private $password = "";

    public function connect() {
        $conn = new mysqli(
            $this->host,
            $this->username,
            $this->password,
            $this->db_name
        );

        if ($conn->connect_error) {
            die("Lỗi kết nối cơ sở dữ liệu");
        }

        $conn->set_charset("utf8mb4");

        return $conn;
    }
}
?>
