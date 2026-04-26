<?php
class Database {
    private $host = "db";
    private $db_name = "bike_db";
    private $username = "root";
    private $password = "root";

    public function connect() {
        $conn = new mysqli(
            $this->host,
            $this->username,
            $this->password,
            $this->db_name
        );

        if ($conn->connect_error) {
            die("Database error");
        }

        $conn->set_charset("utf8");

        return $conn;
    }
}
?>