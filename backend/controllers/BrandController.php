<?php

require_once __DIR__ . "/../models/Brand.php";

class BrandController {
    private $brandModel;

    public function __construct() {
        $this->brandModel = new Brand();
    }

    public function index() {
        $brands = $this->brandModel->getAll();
        
        header('Content-Type: application/json');
        echo json_encode([
            "success" => true,
            "data" => $brands
        ]);
        exit();
    }
}
