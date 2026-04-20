# 💻 Backend Structure (PHP)

## 📁 Cấu trúc

backend/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── uploads/ (Nơi chứa ảnh upload vật lý)
└── index.php

---

## 🛑 Quy tắc
- Không viết code thao tác DB (SQL) trực tiếp trong controller.
- Luôn gọi qua Model (các file trong thư mục `models/`).
- Trả về JSON đúng chuẩn qua hàm `jsonResponse()`.

---

## 📦 Response format

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```