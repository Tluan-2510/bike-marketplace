# 👥 TASK ASSIGNMENT

---

# 🎯 QUY TẮC CHUNG (BẮT BUỘC)

## 🌿 Git Workflow

Mỗi người PHẢI làm trên 1 branch riêng:

| Role | Branch          |
| ---- | --------------- |
| FE1  | FE1-Home        |
| FE2  | FE2-Form-detail |
| BE1  | BE1-Auth        |
| BE2  | BE2-Product     |
| BE3  | BE3-Order       |
| BE4  | BE4-Database    |

---

## 🔥 Quy trình làm việc

1. Pull code mới nhất
2. Checkout branch của mình
3. Code
4. Commit
5. Push
6. Tạo Pull Request

---

<!-- ===================================================================== -->

# Task

## 🟢 FE1 – TRANG CHỦ (Homepage + Product List)

### 🎯 Mục tiêu

- Hiển thị danh sách sản phẩm từ API

### 📦 Task phải làm: UI hiển thị sản phẩm

Hiển thị mỗi sản phẩm gồm:
ảnh
tên
giá
icon ❤️

3. Gọi API
   fetch("/api/products")
4. Render dữ liệu
   function renderProducts(data) {
   // loop và hiển thị HTML
   }
5. Search
   tạo input tìm kiếm
   gọi API: /api/products?keyword=abc
6. Filter
   theo category
   theo giá min/max
7. Pagination (optional)

### ⚠️ Yêu cầu

    không hardcode data
    phải render bằng JS
    UI responsive

<!-- ===================================================================== -->

## 🟡 FE2 – FORM & DETAIL

### 🎯 Mục tiêu

    Xây dựng form + chi tiết sản phẩm + favorite

### 📦 Task phải làm

1. Login Page
   tạo login.html
   gọi API: POST /api/auth/login
2. Register Page
   POST /api/auth/register
3. Create Product Page
   Tạo form gồm: - name - price - category - condition (input + datalist) - delivery_type (radio) - location (chỉ hiện khi chọn gặp trực tiếp) - image upload
4. Submit form
   POST /api/products
5. Product Detail
   trang chi tiết sản phẩm
   GET /api/products/:id
6. Favorite
   click ❤️
   POST /api/favorites

### ⚠️ Yêu cầu

    validate form
    preview ảnh
    UI rõ ràng

<!-- ===================================================================== -->

## 🔵 BE1 – AUTH

### 🎯 Mục tiêu

Xử lý đăng ký và đăng nhập

### 📦 Task phải làm

1. Tạo file
   backend/controllers/AuthController.php
2. API
   POST /api/auth/register
   POST /api/auth/login
3. Logic
   dùng password_hash()
   dùng password_verify()
4. Response
   {
   "success": true,
   "data": {}
   }

### ⚠️ Yêu cầu

    không trả password
    không lỗi login

<!-- ===================================================================== -->

### 🔴 BE2 – PRODUCT

🎯 Mục tiêu
CRUD sản phẩm + search

### 📦 Task phải làm

1. File
   ProductController.php
2. API
   GET /api/products
   GET /api/products/:id
   POST /api/products
   PUT /api/products/:id
   DELETE /api/products/:id
3. Upload ảnh
   dùng $\_FILES
   lưu uploads/
4. Search + Filter
   WHERE name LIKE '%keyword%'
   AND category = ?
   AND price BETWEEN ? AND ?

### ⚠️ Yêu cầu

    validate input
    không crash server

<!-- ===================================================================== -->

## 🟣 BE3 – ORDER (REQUEST)

### 🎯 Mục tiêu

    Tạo request liên hệ (không phải mua thật)

### 📦 Task phải làm

1. File
   OrderController.php
2. API
   POST /api/orders
   GET /api/orders
3. Logic
   Lưu: - buyer_id - seller_id - product_id
4. Status
   pending → contacted → done

### ⚠️ Yêu cầu

    đơn giản
    đúng logic marketplace

<!-- ===================================================================== -->

🟤 BE4 – DATABASE + DOCKER
🎯 Mục tiêu

Setup nền tảng hệ thống

📦 Task phải làm

1. Database
   Tạo bảng: - users - products - favorites - orders
2. File
   config/database.php
   database/schema.sql
3. Hỗ trợ team
   fix lỗi DB
   hỗ trợ query

### ⚠️ Yêu cầu

    DB chạy ổn định
    không lỗi kết nối
