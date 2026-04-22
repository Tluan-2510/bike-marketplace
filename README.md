# 🚲 Bike Marketplace - Nền Tảng Mua Bán Xe Đạp Thể Thao

## 🎯 Giới thiệu

Website kết nối mua bán xe đạp thể thao cũ (Specialized Bike Marketplace), giúp người mua và người bán giao dịch dễ dàng, minh bạch. Hệ thống cung cấp các thông số kỹ thuật chuyên sâu về xe đạp (như chất liệu khung, kích thước bánh, bộ truyền động, loại phanh) giúp người mua dễ dàng đánh giá tình trạng xe.

---

## 🏗️ Kiến trúc hệ thống

- **Frontend**: PHP (Includes) / HTML / CSS / JavaScript (Giao diện hiện đại, Tái sử dụng Component)
- **Backend**: PHP thuần (RESTful API, Upload ảnh vật lý)
- **Database**: MySQL (Thiết kế chuẩn hóa chuyên biệt cho xe đạp)

---

## 👥 Phân công

| Role | Thành viên | Nhiệm vụ |
| --- | --- | --- |
| FE1 | Huỳnh Văn Khánh | Trang chủ + Danh sách xe + Đổi Cấu trúc PHP Includes |
| FE2 | Nguyễn Hoàng Phương | Form đăng xe + Trang Chi tiết + Mock Login & Yêu thích |
| BE1 | Vạn Tường Ceasar | Auth (Xác thực, Phân quyền User) & Favorites |
| BE2 | Nguyễn Duy Ngọc | Product (Xử lý thông số xe, Upload ảnh, Lọc xe theo seller_id) |
| BE3 | Nguyễn Thành Luân | Buy Requests (Hệ thống yêu cầu mua/Thương lượng) |
| BE4 | Phạm Văn Hưng | Database (Thiết kế schema, tối ưu hóa) & Setup Deployment |

---

## 🚀 Cách chạy (Docker)

```bash
docker-compose up -d --build
```
Hoặc cài đặt thủ công qua XAMPP (xem chi tiết trong `SETUP.md`).
