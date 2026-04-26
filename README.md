<p align="center">
  <img src="frontend/assets/images/favicon.svg" alt="Bike Marketplace Logo" width="100">
</p>

<h1 align="center">🚲 Bike Marketplace</h1>

<p align="center">
  <strong>Nền Tảng Mua Bán Xe Đạp Thể Thao Chuyên Nghiệp</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PHP-7.4%2B-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

## 🎯 Giới thiệu

**Bike Marketplace** là giải pháp kết nối cộng đồng yêu xe đạp thể thao. Chúng tôi tập trung vào việc tạo ra một môi trường giao dịch minh bạch, nơi người mua có thể tìm thấy những chiếc xe chất lượng với thông số kỹ thuật chi tiết nhất, và người bán có thể tiếp cận đúng đối tượng khách hàng.

### ✨ Tính năng nổi bật

- 🔍 **Tìm kiếm thông minh**: Lọc xe theo thương hiệu, loại xe, tình trạng và khu vực.
- 📊 **Thông số chuyên sâu**: Cung cấp chi tiết về Group-set, khung xe, kích thước bánh và phanh.
- 📸 **Thư viện hình ảnh**: Hỗ trợ nhiều góc chụp giúp đánh giá chính xác tình trạng xe.
- 📩 **Thương lượng trực tiếp**: Hệ thống "Buy Request" giúp người mua và người bán dễ dàng trao đổi giá.
- ✅ **Xác minh uy tín**: Hệ thống tích xanh và đánh giá giúp tăng độ tin cậy.

---

## 🏗️ Kiến trúc hệ thống

Dưới đây là sơ đồ luồng hoạt động của hệ thống:

```mermaid
graph TD
    User((Người dùng)) -->|Truy cập| FE[Frontend - PHP/HTML/JS]
    FE -->|API Call| BE[Backend - PHP RESTful API]
    BE -->|Query| DB[(MySQL Database)]
    BE -->|Lưu trữ| Storage[Physical File Storage]
    
    subgraph "Core Components"
        BE
        DB
        Storage
    end
```

---

## 🗄️ Thiết kế Cơ sở dữ liệu

Hệ thống được thiết kế chuẩn hóa để tối ưu hóa việc quản lý dữ liệu xe đạp:

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : "đăng bán"
    USERS ||--o{ FAVORITES : "yêu thích"
    USERS ||--o{ BUY_REQUESTS : "gửi yêu cầu"
    CATEGORIES ||--o{ PRODUCTS : "phân loại"
    BRANDS ||--o{ PRODUCTS : "thuộc thương hiệu"
    PRODUCTS ||--o{ PRODUCT_IMAGES : "có nhiều ảnh"
    PRODUCTS ||--o{ FAVORITES : "được lưu bởi"
    PRODUCTS ||--o{ BUY_REQUESTS : "nhận yêu cầu"

    USERS {
        int id PK
        string username
        string email
        string full_name
        boolean is_verified
        float rating
    }
    PRODUCTS {
        int id PK
        string title
        decimal price
        string condition_state
        string frame_material
        string groupset
    }
```

---

## 🛠️ Công nghệ sử dụng

| Layer | Technologies |
| --- | --- |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| **Backend** | ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white) (RESTful API) |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Compose](https://img.shields.io/badge/Docker--Compose-2496ED?style=flat-square&logo=docker&logoColor=white) |

---

## 🚀 Hướng dẫn khởi chạy

### 1. Sử dụng Docker (Khuyên dùng)
Yêu cầu: Đã cài đặt Docker & Docker Compose.
```bash
docker-compose up -d --build
```
Hệ thống sẽ tự động khởi tạo:
- **Web App**: `http://localhost:8080`
- **Database**: Cổng `3306`

### 2. Cài đặt thủ công (XAMPP)
Vui lòng tham khảo file chi tiết: [📄 SETUP.md](file:///c:/Users/ntlxx/OneDrive/Desktop/Web/bike-marketplace/SETUP.md)

---

## 👥 Đội ngũ phát triển

| Role | Thành viên |
| --- | --- |
| **Frontend** | Huỳnh Văn Khánh, Nguyễn Hoàng Phương |
| **Backend** | Vạn Tường Ceasar, Nguyễn Duy Ngọc, Nguyễn Thành Luân |
| **Database & DevOps** | Phạm Văn Hưng |

---

## 📂 Cấu trúc thư mục

```text
.
├── backend/            # PHP API & Business Logic
├── frontend/           # Giao diện người dùng & Assets
├── database/           # SQL scripts & Schema
├── docker/             # Docker configuration files
└── docker-compose.yml  # File điều phối container
```

---

<p align="center">
  Made with ❤️ for the Bike Community
</p>
