# 🛠️ SETUP PROJECT - BIKE MARKETPLACE (DOCKER)

---

# 🎯 MỤC TIÊU

Hướng dẫn cài đặt và chạy project nhanh nhất bằng Docker.

---

# 💻 YÊU CẦU

Cài đặt trước:
- **Docker Desktop** (Đã bật và đang chạy)
- Trình duyệt (Chrome/Edge/Firefox)

---

# 🚀 CÁC BƯỚC THỰC HIỆN

## Bước 1: Chuẩn bị môi trường
1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```
2. (Tùy chọn) Chỉnh sửa các thông số trong `.env` nếu cần thiết.

## Bước 2: Khởi động hệ thống
Mở Terminal tại thư mục gốc và chạy lệnh:
```bash
docker-compose down
docker-compose up -d --build
```
*Lưu ý: Lệnh này sẽ tự động tải các Image, cài đặt PHP Extensions và khởi tạo Database.*

## Bước 3: Kiểm tra Database
Hệ thống đã tự động chạy các file `database/schema.sql` và `database/seed.sql` khi khởi tạo container `db`. Bạn không cần import thủ công.

## Bước 4: Truy cập hệ thống
- **Frontend:** `http://localhost:8888/frontend/pages/index.html`
- **Backend API:** `http://localhost:8888/backend/index.php`

---

# 📁 CẤU TRÚC PROJECT (DOCKER)

- `app`: PHP 8.2-FPM (Xử lý logic backend)
- `web`: Nginx (Cổng **8888** - Điều hướng request)
- `db`: MySQL 8.0 (Cổng 3306 nội bộ - Lưu trữ dữ liệu)

---

# 🧪 TEST KẾT NỐI
Thử truy cập: `http://localhost:8888/backend/index.php`
Nếu thấy phản hồi từ server => Hệ thống đã sẵn sàng!
