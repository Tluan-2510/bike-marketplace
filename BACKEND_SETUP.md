# 🚴 Bike Marketplace - Backend Setup Guide

## Tổng Quan

Backend của Bike Marketplace được xây dựng với **PHP**, **Laravel Framework**, **MySQL**, và **JWT Authentication**.

### Stack Công Nghệ
- **Framework**: Laravel 10 (Framework PHP modern)
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens) - 15 phút expiration
- **Docker**: Apache + PHP 8.1 + MySQL
- **Dependency Manager**: Composer

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống
- Docker & Docker Compose
- Git (tùy chọn)

### Khởi Động Ứng Dụng

1. **Khởi động Docker containers:**
   ```bash
   docker-compose up -d
   ```

2. **Chờ MySQL sẵn sàng** (khoảng 10-15 giây)

3. **Setup database** (tự động qua entrypoint):
   - Script `setup.php` sẽ tự chạy
   - Tạo bảng `users`, `password_reset_tokens`, `refresh_tokens`

4. **Kiểm tra API:**
   ```bash
   curl http://localhost/api/auth/me
   ```

---

## 📡 API Endpoints

### 🔐 Authentication APIs (Public - No Auth Required)

#### 1. **Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "0123456789",
  "role": "user"  // user | seller | admin (default: user)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "random-64-char-string",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "is_active": true
    }
  }
}
```

#### 2. **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "random-64-char-string",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

#### 3. **Refresh Access Token**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "random-64-char-string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "new-jwt-token",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

#### 4. **Forgot Password**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If the email exists, you will receive a password reset link"
}
```

#### 5. **Reset Password**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "token": "reset-token-from-email",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "access_token": "new-jwt-token",
    "refresh_token": "new-refresh-token",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### 🔒 Protected APIs (Requires Authorization Header)

#### 6. **Get Current User**
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "role": "user",
    "avatar_url": null,
    "bio": null,
    "address": null,
    "is_active": true,
    "last_login_at": "2024-04-02T10:30:00Z"
  }
}
```

#### 7. **Logout**
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🛡️ Authentication Flow

### JWT Token Structure
- **Expiration**: 15 phút
- **Algorithm**: HS256
- **Claims**: `sub` (user_id), `email`, `role`, `name`, `iat`, `exp`

### Middleware Check
- Kiểm tra header `Authorization: Bearer <token>`
- Verify JWT signature
- Validate token expiration
- Check user status (is_active)

### Refresh Token
- **Expiration**: 10080 phút (7 ngày)
- Được lưu trong database
- Có thể revoke (logout)
- Một user chỉ có một refresh token hợp lệ tại một thời điểm

---

## 📦 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) NULLABLE,
  password VARCHAR(255),
  role ENUM('user', 'seller', 'admin') DEFAULT 'user',
  avatar_url VARCHAR(255) NULLABLE,
  bio LONGTEXT NULLABLE,
  address VARCHAR(255) NULLABLE,
  is_active BOOLEAN DEFAULT 1,
  email_verified_at TIMESTAMP NULLABLE,
  last_login_at TIMESTAMP NULLABLE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (email),
  INDEX (role)
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  revoked_at TIMESTAMP NULLABLE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (user_id),
  INDEX (token)
);
```

### Password Reset Tokens Table
```sql
CREATE TABLE password_reset_tokens (
  email VARCHAR(255) PRIMARY KEY,
  token VARCHAR(255),
  created_at TIMESTAMP NULLABLE,
  INDEX (email)
);
```

---

## ⚙️ Cấu Hình

### Environment Variables (.env)
```env
# App
APP_NAME="Bike Marketplace"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Database
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=bike_marketplace
DB_USERNAME=bike_user
DB_PASSWORD=bike_password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION_TIME=15

# Refresh Token (minutes)
REFRESH_TOKEN_EXPIRATION_TIME=10080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🧪 Testing APIs

### Sử dụng cURL
```bash
# Register
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get Current User
curl -X GET http://localhost/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

### Sử dụng Postman
1. Import collection từ `docs/postman-collection.json` (sẽ được tạo)
2. Set environment variables
3. Test các endpoints

---

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f php

# Access MySQL
docker-compose exec mysql mysql -u root -proot_password

# Access PHP container
docker-compose exec php bash
```

---

## 📝 Folder Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API Controllers
│   │   ├── Middleware/      # Auth & Role Middleware
│   │   ├── Router.php       # Custom Router
│   │   └── Request.php      # Request Handler
│   ├── Models/              # Eloquent Models
│   ├── Services/            # Business Logic (Auth, JWT)
│   ├── helpers/             # Helper Functions
│   └── Container.php        # DI Container
├── bootstrap/
│   └── app.php             # Application Bootstrap
├── config/
│   └── database.php        # Database Config
├── database/
│   ├── migrations/         # Database Migrations
│   └── Migrator.php        # Migration Runner
├── public/
│   └── index.php          # Entry Point
├── routes/
│   └── api.php            # API Routes
├── uploads/               # File Uploads
├── composer.json          # Dependencies
├── .env                   # Environment Variables
└── setup.php             # Database Setup Script
```

---

## 🔄 Integration dengan Frontend

### Headers untuk Authenticated Requests
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`
};

fetch('/api/auth/me', { headers })
```

### Handling Token Expiration
```javascript
// Khi nhận 401 response
if (response.status === 401) {
  // Refresh token
  const result = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  if (result.ok) {
    // Lưu access token mới
    const data = await result.json();
    localStorage.setItem('token', data.data.access_token);
  } else {
    // Redirect to login
    window.location.href = '/login';
  }
}
```

---

## 🚨 Lỗi Common

| Error | Nguyên Nhân | Giải Pháp |
|-------|-----------|----------|
| `Connection refused:3306` | MySQL chưa sẵn sàng | Chờ 10-15 giây sau `docker-compose up` |
| `Invalid token` | JWT signature không đúng | Kiểm tra JWT_SECRET |
| `User not found` | User đã bị xóa | Register user mới |
| `CORS error` | Frontend không được phép | Cập nhật CORS_ALLOWED_ORIGINS |

---

##  Tiếp Theo

Để phát triển thêm các features khác (Bike listings, Orders, Reviews):
1. Tạo models cho Bike, Order, Review
2. Tạo migrations
3. Tạo controllers và services
4. Thêm routes
5. Dùng **RoleMiddleware** để kiểm tra quyền

---

## 📞 Support

Nếu có lỗi, kiểm tra:
1. Docker logs: `docker-compose logs -f php`
2. MySQL connection:  `docker-compose exec mysql mysql -u bike_user -pbike_password bike_marketplace`
3. File permissions: `docker-compose exec php ls -la /var/www/html`

---

**Happy coding! 🚀**
