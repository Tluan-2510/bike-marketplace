<?php

// Load .env từ vendor phpdotenv nếu có
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value);
        if (!array_key_exists($key, $_ENV)) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

class Database {
    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private string $charset;
    private ?\PDO $connection = null;

    public function __construct() {
        $this->host     = getenv('DB_HOST')    ?: 'db';
        $this->db_name  = getenv('DB_NAME')    ?: 'bike_db';
        $this->username = getenv('DB_USER')    ?: 'root';
        // Hỗ trợ cả DB_PASSWORD (trong .env) lẫn DB_PASS (legacy)
        $this->password = getenv('DB_PASSWORD') ?: (getenv('DB_PASS') ?: 'root');
        $this->charset  = getenv('DB_CHARSET') ?: 'utf8mb4';
    }

    public function connect(): \PDO {
        if ($this->connection !== null) {
            return $this->connection;
        }

        $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
        $options = [
            \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            \PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->connection = new \PDO($dsn, $this->username, $this->password, $options);
            $this->connection->exec("SET NAMES utf8mb4");
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database connection failed']);
            exit();
        }

        return $this->connection;
    }
}