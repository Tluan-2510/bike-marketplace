<?php

require_once __DIR__ . "/../models/Category.php";

class CategoryController {
    private $categoryModel;

    public function __construct() {
        $this->categoryModel = new Category();
    }

    public function index() {
        $categories = $this->categoryModel->getAll();
        
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "data" => $categories
        ]);
        exit();
    }
}
