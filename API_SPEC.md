# 📡 API Specification

## 🔐 AUTH

### POST /api/auth/register
Body (JSON):
```json
{
  "username": "nguyenvana",
  "email": "abc@gmail.com",
  "password": "123456",
  "phone_number": "0987654321",
  "full_name": "Nguyễn Văn A"
}
```

### POST /api/auth/login
Body (JSON):
```json
{
  "email": "abc@gmail.com",
  "password": "123456"
}
```

---

## 🏷️ CATEGORIES & BRANDS

### GET /api/categories
Trả về danh sách danh mục (MTB, Road, Touring, ...).

### GET /api/brands
Trả về danh sách thương hiệu (Giant, Trek, Specialized, ...).

---

## 🚴 PRODUCT

### GET /api/products
Lấy danh sách tất cả sản phẩm.

### GET /api/products?id={id}
Lấy chi tiết 1 sản phẩm kèm theo danh sách tất cả hình ảnh.

### POST /api/products
Đăng tin bán xe đạp mới (Hỗ trợ upload ảnh vật lý).
**Body (FormData):**
- `seller_id` (int)
- `category_id` (int)
- `brand_id` (int)
- `title` (string)
- `description` (text)
- `price` (decimal)
- `condition_state` (enum: 'Mới', 'Như mới', 'Sử dụng tốt', 'Có hao mòn')
- `frame_material` (string)
- `wheel_size` (string)
- `groupset` (string)
- `brake_type` (string)
- `location` (string)
- `delivery_type` (string)
- `images[]` (file, multiple)

---

## ❤️ FAVORITE

### GET /api/favorites?user_id={user_id}
Lấy danh sách xe đã lưu/yêu thích của user.

### POST /api/favorites
Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích.
Body (JSON):
```json
{
  "user_id": 1,
  "product_id": 2,
  "action": "add" // hoặc "remove"
}
```

---

## 📩 BUY REQUESTS (Yêu cầu mua/Thương lượng)

### GET /api/buy-requests?user_id={user_id}
Lấy danh sách các yêu cầu mua mà user này đã gửi.

### POST /api/buy-requests
Gửi yêu cầu mua/thương lượng tới người bán.
Body (JSON):
```json
{
  "buyer_id": 1,
  "product_id": 3,
  "message": "Tôi muốn mua chiếc xe này, có fix thêm không?"
}
```