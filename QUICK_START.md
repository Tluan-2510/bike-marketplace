# 🚀 Quick Start - Bike Marketplace Backend

## 5 Bước Khởi Động

### 1️⃣ Clone/Download Project
```bash
cd d:/Web/bike-marketplace_PHP
```

### 2️⃣ Khởi Động Docker
```bash
docker-compose up -d
```
Chờ ~10-15 giây để MySQL sẵn sàng và database setup tự động.

### 3️⃣ Kiểm Tra API
```bash
curl http://localhost/api/auth/me
```
Kết quả: `401 Unauthorized` = OK ✓

### 4️⃣ Test APIs
**Option A: Sử dụng cURL**
```bash
# Register
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "pass123",
    "password_confirmation": "pass123"
  }'
```

**Option B: Sử dụng Bash Script**
```bash
chmod +x test-api.sh
./test-api.sh
```

**Option C: Sử dụng Postman/Insomnia**
- Import requests từ [BACKEND_SETUP.md](BACKEND_SETUP.md)

### 5️⃣ Dừng Docker
```bash
docker-compose down
```

---

## 🎯 Các Endpoints Chính

| Method | Endpoint | Auth | Mô Tả |
|--------|----------|------|-------|
| POST | `/api/auth/register` | ❌ | Tạo tài khoản mới |
| POST | `/api/auth/login` | ❌ | Đăng nhập |
| GET | `/api/auth/me` | ✅ | Lấy info user hiện tại |
| POST | `/api/auth/logout` | ✅ | Đăng xuất |
| POST | `/api/auth/refresh` | ❌ | Lấy access token mới |
| POST | `/api/auth/forgot-password` | ❌ | Yêu cầu reset password |
| POST | `/api/auth/reset-password` | ❌ | Reset password |

---

## 🔐 JWT Token

- **Lifetime**: 15 phút
- **Refresh Token**: 7 ngày
- **Format**: `Bearer <token>`

```bash
# Sử dụng token trong requests
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost/api/auth/me
```

---

## 📝 User Roles

```
- user (default): Người dùng thường - có thể mua xe
- seller: Người bán - có thể đăng bán xe
- admin: Quản trị viên - quản lý toàn bộ hệ thống
```

**Tạo seller account:**
```json
{
  "name": "Shop Owner",
  "email": "seller@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "seller"
}
```

---

## 🐳 Docker Commands Cơ Bản

```bash
# Xem logs
docker-compose logs -f php

# Access PHP container
docker-compose exec php bash

# Access MySQL
docker-compose exec mysql mysql -u bike_user -pbike_password bike_marketplace

# View MySQL data
docker-compose exec mysql mysql -u bike_user -pbike_password -e "USE bike_marketplace; SELECT * FROM users;"

# Restart services
docker-compose restart php mysql
```

---

## ⚙️ Cấu Hình

### Thay đổi JWT Secret
```bash
# Edit .env
backend/.env

# Tìm dòng
JWT_SECRET=your-secret-key

# Thay thế bằng
JWT_SECRET=$(openssl rand -base64 32)

# Restart containers
docker-compose restart
```

### Thay đổi Database Password
Chỉnh sửa `docker-compose.yml` và rebuild:
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🆘 Troubleshooting

### "Connection refused"
```bash
# Kiểm tra MySQL status
docker-compose exec mysql mysql -u root -proot_password -e "SELECT 1;"

# Xem logs
docker-compose logs mysql
```

### "Table already exists"
```bash
# Database sẽ tự tạo, nếu lỗi:
docker-compose exec php php setup.php
```

### "Permission denied"
```bash
# Fix permissions
docker-compose exec php chown -R www-data:www-data /var/www/html
```

---

## 🔄 Next Steps

1. ✅ Setup Backend - **DONE**
2. 🔄 Frontend Development (React/Vue/Next.js)
3. 🔄 Bike Listing APIs
4. 🔄 Order Management
5. 🔄 Review System

---

## 📚 Tài Liệu Chi Tiết
Xem [BACKEND_SETUP.md](BACKEND_SETUP.md) để:
- Database schema đầy đủ
- Tất cả API endpoints
- Integration với Frontend
- Error handling

---

**Thiết lập xong! 🎉 Bây giờ hãy bắt đầu phát triển!**
