# 🛠️ SETUP PROJECT - BIKE MARKETPLACE

---

# 🎯 MỤC TIÊU

Hướng dẫn cài đặt và chạy project trên máy local.

---

# 💻 YÊU CẦU

Cài đặt trước:
- XAMPP hoặc Laragon
- PHP >= 7.4
- MySQL
- Trình duyệt (Chrome/Edge/Firefox)

---

# 📁 CẤU TRÚC PROJECT

bike-marketplace/
├── frontend/
├── backend/
└── database/

---

# 🗄️ BƯỚC 1: SETUP DATABASE

## 1. Mở phpMyAdmin
http://localhost/phpmyadmin

## 2. Tạo database
Tên: `bike_db`
Collation: `utf8mb4_unicode_ci`

## 3. Import database
- Vào tab Import
- Chọn file: `database/schema.sql`
- Click Go

<!-- ===================================================================== -->

# ⚙️ BƯỚC 2: CONFIG DATABASE

- Mở file: `backend/config/database.php`
- Đảm bảo cấu hình khớp với máy bạn:
  ```php
  private $host = "localhost"; // hoặc "db" nếu dùng docker
  private $db_name = "bike_db";
  private $username = "root";
  private $password = ""; // XAMPP thường để trống
  ```

<!-- ===================================================================== -->

# 🚀 BƯỚC 3: CHẠY BACKEND

- Đặt project vào: `htdocs/` (XAMPP) hoặc `www/` (Laragon)
- Đảm bảo thư mục là `bike-marketplace`
- API sẽ chạy ở: `http://localhost/bike-marketplace/backend/api/...`

<!-- ===================================================================== -->

# 🧪 BƯỚC 4: TEST API

- Mở trình duyệt: `http://localhost/bike-marketplace/backend/api/products`
- Nếu thấy JSON trả về mảng sản phẩm (hoặc mảng rỗng) => OK!

<!-- ===================================================================== -->

# 🎨 BƯỚC 5: CHẠY FRONTEND

- Mở file: `frontend/pages/index.html` trực tiếp trên trình duyệt hoặc dùng Live Server (VS Code).
- **Lưu ý**: Nếu API không chạy, hãy kiểm tra lại URL fetch trong các file JS (vd: `http://localhost/bike-marketplace/backend/api/...`)
