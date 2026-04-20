# 🗄️ Database Design

## 🧱 Tables

### users
- user_id
- username
- email
- password

---

### products
- product_id
- user_id
- name
- price
- category
- condition_text
- delivery_type
- location

---

### favorites
- user_id
- product_id

---

### orders
- buyer_id
- seller_id
- product_id
- status

---

## 🔗 Relationships

- user → product (1-N)
- user ↔ product (favorite)
- order = request (NOT real order)