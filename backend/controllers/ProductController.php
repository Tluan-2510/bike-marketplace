<?php

require_once __DIR__ . "/../models/Product.php";

class ProductController {
    private $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    private function jsonResponse($success, $data = null, $message = "") {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            "success" => $success,
            "data" => $data,
            "message" => $message
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    public function index() {
        if (isset($_GET['id'])) {
            $product = $this->productModel->findById($_GET['id']);
            if ($product) {
                $this->jsonResponse(true, $product);
            } else {
                http_response_code(404);
                $this->jsonResponse(false, null, "Không tìm thấy sản phẩm");
            }
        } else {
            $products = $this->productModel->getAll();
            $this->jsonResponse(true, $products);
        }
    }

    public function store() {
        // Physical File Upload logic
        // We expect form-data (not raw JSON) because of file uploads
        
        $seller_id = $_POST['seller_id'] ?? null;
        $category_id = $_POST['category_id'] ?? null;
        $brand_id = $_POST['brand_id'] ?? null;
        $title = $_POST['title'] ?? ($_POST['name'] ?? '');
        $description = $_POST['description'] ?? '';
        $price = $_POST['price'] ?? 0;
        $condition_state = $_POST['condition_state'] ?? 'Sử dụng tốt';
        $frame_material = $_POST['frame_material'] ?? null;
        $wheel_size = $_POST['wheel_size'] ?? null;
        $groupset = $_POST['groupset'] ?? null;
        $brake_type = $_POST['brake_type'] ?? null;
        $location = $_POST['location'] ?? '';
        $delivery_type = $_POST['delivery_type'] ?? '';

        if (!$seller_id || empty($title) || empty($price)) {
            $this->jsonResponse(false, null, "Thiếu thông tin bắt buộc");
        }

        $product_id = $this->productModel->create(
            $seller_id, $category_id, $brand_id, $title, $description, $price, 
            $condition_state, $frame_material, $wheel_size, $groupset, 
            $brake_type, $location, $delivery_type
        );

        if ($product_id) {
            // Handle images upload
            $upload_dir = __DIR__ . '/../uploads/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            if (isset($_FILES['images'])) {
                $files = $_FILES['images'];
                $total_files = count($files['name']);
                
                for ($i = 0; $i < $total_files; $i++) {
                    if ($files['error'][$i] === UPLOAD_ERR_OK) {
                        $tmp_name = $files['tmp_name'][$i];
                        $original_name = basename($files['name'][$i]);
                        $ext = pathinfo($original_name, PATHINFO_EXTENSION);
                        
                        // Generate a unique filename
                        $new_name = uniqid('bike_') . '_' . time() . '.' . $ext;
                        $destination = $upload_dir . $new_name;

                        if (move_uploaded_file($tmp_name, $destination)) {
                            // First image is primary
                            $is_primary = ($i === 0) ? 1 : 0;
                            // Store relative URL: e.g., /backend/uploads/filename.jpg
                            $image_url = '/backend/uploads/' . $new_name;
                            $this->productModel->addImage($product_id, $image_url, $is_primary);
                        }
                    }
                }
            }
            
            $this->jsonResponse(true, ["product_id" => $product_id], "Tạo sản phẩm thành công");
        } else {
            $this->jsonResponse(false, null, "Không thể tạo sản phẩm");
        }
    }
}
