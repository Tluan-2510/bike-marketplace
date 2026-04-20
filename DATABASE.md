# 🗄️ Database Design (Bike Marketplace)

Cơ sở dữ liệu được thiết kế chuyên biệt cho một nền tảng mua bán xe đạp thể thao cũ, cung cấp các thuộc tính kỹ thuật chi tiết nhằm tăng tính minh bạch và độ tin cậy của giao dịch.

## 🧱 Bảng (Tables)

### `users`
Lưu trữ thông tin người dùng (người mua và người bán).
- `id` (PK)
- `username` (UNIQUE)
- `email` (UNIQUE)
- `password_hash`
- `phone_number`: Số điện thoại liên hệ
- `full_name`
- `avatar_url`
- `role`: 'user', 'admin'
- `created_at`

---

### `categories`
Danh mục loại xe đạp.
- `id` (PK)
- `name` (VD: Xe đạp địa hình, Xe đạp đua...)
- `slug`

---

### `brands`
Thương hiệu xe đạp.
- `id` (PK)
- `name` (VD: Giant, Trek...)

---

### `products`
Thông tin chi tiết về xe đạp được đăng bán. Bao gồm các thông số kỹ thuật chuyên ngành.
- `id` (PK)
- `seller_id` (FK -> users)
- `category_id` (FK -> categories)
- `brand_id` (FK -> brands)
- `title`
- `description`
- `price`
- `condition_state`: 'Mới', 'Như mới', 'Sử dụng tốt', 'Có hao mòn'
- `frame_material`: Chất liệu khung (Carbon, Nhôm, Thép...)
- `wheel_size`: Kích cỡ bánh (26", 27.5", 700c...)
- `groupset`: Bộ truyền động (Shimano 105, Tourney...)
- `brake_type`: Loại phanh (Phanh đĩa, Phanh cơ...)
- `location`: Tỉnh/Thành phố
- `delivery_type`
- `status`: 'available', 'sold', 'hidden'
- `created_at`
- `updated_at`

---

### `product_images`
Nhiều hình ảnh cho một xe đạp (khung, xích líp, bộ đề...).
- `id` (PK)
- `product_id` (FK -> products)
- `image_url`
- `is_primary`: Hình đại diện chính
- `created_at`

---

### `favorites`
Danh sách xe đạp được người dùng yêu thích/lưu lại.
- `id` (PK)
- `user_id` (FK -> users)
- `product_id` (FK -> products)
- `created_at`

---

### `buy_requests`
Yêu cầu mua/thương lượng thay vì giỏ hàng/đơn hàng trực tiếp.
- `id` (PK)
- `buyer_id` (FK -> users)
- `product_id` (FK -> products)
- `message`: Lời nhắn cho người bán
- `status`: 'pending', 'accepted', 'rejected', 'completed'
- `created_at`

---

## 🔗 Quan hệ (Relationships)

- **1-N**:
  - `categories` → `products`: Một danh mục có nhiều xe đạp.
  - `brands` → `products`: Một thương hiệu có nhiều xe đạp.
  - `users` (Seller) → `products`: Một người bán có thể đăng nhiều xe.
  - `products` → `product_images`: Một xe đạp có thể có nhiều hình ảnh.
  - `users` (Buyer) → `buy_requests`: Một người mua có thể tạo nhiều yêu cầu mua.
  - `products` → `buy_requests`: Một xe đạp có thể nhận nhiều yêu cầu mua.

- **N-N**:
  - `users` ↔ `products` (thông qua bảng `favorites`): Người dùng có thể yêu thích nhiều xe và một xe có thể được nhiều người yêu thích.