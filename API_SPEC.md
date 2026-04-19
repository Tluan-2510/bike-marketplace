

```md id="md3"
# 📡 API Specification

## 🔐 AUTH

### POST /api/auth/register
Body:
{
  "username": "abc",
  "email": "abc@gmail.com",
  "password": "123456"
}

---

### POST /api/auth/login
Body:
{
  "email": "abc@gmail.com",
  "password": "123456"
}

---

## 🚴 PRODUCT

### GET /api/products

### GET /api/products/:id

### POST /api/products
Form-data:
- name
- price
- category
- condition_text
- delivery_type
- location
- image

---

## ❤️ FAVORITE

### POST /api/favorites
{
  "user_id": 1,
  "product_id": 2
}

---

## 📩 ORDER (REQUEST)

### POST /api/orders
{
  "buyer_id": 1,
  "seller_id": 2,
  "product_id": 3
}