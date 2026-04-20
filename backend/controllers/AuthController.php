<?php

require_once __DIR__ . "/../models/User.php";

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    private function jsonResponse($success, $data = null, $message = "") {
        header('Content-Type: application/json');
        echo json_encode([
            "success" => $success,
            "data" => $data,
            "message" => $message
        ]);
        exit();
    }

    public function register() {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        if (!$input) {
            $this->jsonResponse(false, null, "Invalid input data");
        }

        $username = $input['username'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $phone_number = $input['phone_number'] ?? '';
        $full_name = $input['full_name'] ?? '';

        if (empty($username) || empty($email) || empty($password) || empty($phone_number)) {
            $this->jsonResponse(false, null, "Missing required fields");
        }

        $existingUser = $this->userModel->findByEmail($email);
        if ($existingUser) {
            $this->jsonResponse(false, null, "Email already exists");
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $userId = $this->userModel->create($username, $email, $password_hash, $phone_number, $full_name);

        if ($userId) {
            $data = [
                "user_id" => $userId,
                "username" => $username,
                "email" => $email,
                "phone_number" => $phone_number,
                "full_name" => $full_name
            ];
            $this->jsonResponse(true, $data);
        } else {
            $this->jsonResponse(false, null, "Failed to register user");
        }
    }

    public function login() {
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);

        if (!$input) {
            $this->jsonResponse(false, null, "Invalid input data");
        }

        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            $this->jsonResponse(false, null, "Missing email or password");
        }

        $user = $this->userModel->findByEmail($email);

        if ($user && password_verify($password, $user['password_hash'])) {
            unset($user['password_hash']); // Don't return hash to client
            $this->jsonResponse(true, $user);
        } else {
            $this->jsonResponse(false, null, "Invalid email or password");
        }
    }
}
