# ⚙️ SETUP PROJECT – BIKE MARKETPLACE

---

# 🎯 MỤC TIÊU

Hướng dẫn cài đặt và chạy project trên máy local  

---

# 🧱 YÊU CẦU

Cài đặt trước:

- XAMPP hoặc Laragon
- PHP >= 7.4
- MySQL
- Trình duyệt (Chrome)

---

# 📁 CẤU TRÚC PROJECT

bike-marketplace/
├── frontend/
├── backend/
└── database/

---

# 🗄️ BƯỚC 1: SETUP DATABASE

## 1. Mở phpMyAdmin

id="setup02"
http://localhost/phpmyadmin

## 2. Tạo database

Tên: bike_db

## 3. Import database

- vào tab Import
- chọn file: /database/schema.sql
- click Go

<!-- ===================================================================== -->

# 🔌 BƯỚC 2: CONFIG DATABASE

- Mở file: backend/config/database.php
- Cấu hình:
  private $host = "localhost";
  private $db_name = "bike_db";
  private $username = "root";
  private $password = "";

<!-- ===================================================================== -->

# 🚀 BƯỚC 3: CHẠY BACKEND

- Đặt project vào: htdocs/ (XAMPP) hoặc www/ (Laragon)
- Truy cập: http://localhost/bike-marketplace/backend

<!-- ===================================================================== -->

# 🔍 BƯỚC 4: TEST API

- Mở trình duyệt: http://localhost/bike-marketplace/backend/api/products

👉 Nếu thấy JSON → OK

<!-- ===================================================================== -->

# 🌐 BƯỚC 5: CHẠY FRONTEND

- Mở file: frontend/pages/index.html

<!-- ===================================================================== -->

# ⚠️ Lưu ý

- Nếu API không chạy:
  👉 sửa URL trong JS: fetch("http://localhost/bike-marketplace/backend/api/products")

# 🧪 TEST

- Test API
  /api/products
  /api/auth/login
- Test UI
  hiển thị sản phẩm
  không lỗi console
