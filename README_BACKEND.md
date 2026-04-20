

```md id="md2"
# 🧠 Backend Structure (PHP)

## 📁 Cấu trúc

backend/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── uploads/
└── index.php

---

## ⚙️ Quy tắc

- Không code DB trong controller
- Luôn dùng Database class
- Luôn dùng response()

---

## 📦 Response format

```json
{
  "success": true,
  "data": {}
}