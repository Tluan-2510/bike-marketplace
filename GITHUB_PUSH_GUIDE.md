# 📤 Hướng Dẫn Push Lên GitHub Đúng Cách

## 📋 Tóm Tắt

Để person khác `clone` về vẫn chạy được, bạn cần:
- ✅ **Push**: Tất cả source code, config files, Docker setup
- ❌ **Không push**: `.env` (sensitive), `vendor/`, `node_modules/`, uploads

---

## ✅ File/Folder NÊN PUSH

### **Root Directory**
```
✅ .gitignore              (Quy tắc ignore files)
✅ docker-compose.yml      (Docker setup)
✅ Dockerfile              (PHP container config)
✅ README.md               (Project info)
✅ QUICK_START.md          (Setup guide)
✅ BACKEND_SETUP.md        (API documentation)
✅ PROJECT_STRUCTURE.md    (Architecture)
✅ VERIFICATION_CHECKLIST.md
✅ COMPLETION_SUMMARY.md
✅ API_TESTER.html         (Test UI)
```

### **Backend**
```bash
✅ backend/.env.example      (Template - người khác copy thành .env)
✅ backend/.htaccess         (Apache routing)
✅ backend/public/           (Tất cả - chứa index.php API)
✅ backend/app/              (Tất cả)
✅ backend/config/           (Config files)
✅ backend/routes/           (Route definitions)
✅ backend/database/         (Migrations, seeders)
✅ backend/src/              (Source code)
✅ backend/bootstrap/        (Bootstrap files)
✅ backend/composer.json     (Dependencies list - CÓ push)
❌ backend/composer.lock     (Ignore - auto-generated)
❌ backend/vendor/           (Ignore - run composer install)
❌ backend/.env              (Ignore - sensitive!)
❌ backend/uploads/*         (Ignore - user files)
```

### **Docker**
```bash
✅ docker/apache/000-default.conf    (Apache config)
✅ docker/mysql/init.sql             (Database init)
✅ docker/entrypoint.sh              (Startup script)
```

### **Database**
```bash
✅ database/                 (Tất cả - nếu có migrations)
```

### **Frontend**
```bash
✅ frontend/                 (Tất cả source code)
❌ frontend/node_modules/    (Ignore)
```

---

## ❌ File/Folder KHÔNG NÊN PUSH

| File/Folder | Lý Do |
|---|---|
| `.env` | Chứa password, JWT secret (sensitive data) |
| `composer.lock` | Auto-generated, chạy `composer install` sẽ tạo lại |
| `vendor/` | PHP dependencies, quá nặng (~50MB+) |
| `node_modules/` | JS dependencies, quá nặng |
| `uploads/*` | User files, thay đổi theo thời gian |
| `mysql_data/` | Database volume data |
| `*.log` | Temporary log files |
| `.vscode/` | IDE settings (personal) |
| `.idea/` | IDE settings (personal) |
| `test-api.sh` | Local test script (optional) |

---

## 🚀 WORKFLOW PUSH (Chi Tiết)

### **Bước 1: Kiểm tra .gitignore đã đúng**

```powershell
# Xem những file sắp push
git status
```

Kiểm tra xem `.env` có hiện trong danh sách không:
- ❌ Nếu `.env` hiện → không tốt, cần remove
- ✅ Nếu `.env` không hiện → OK

### **Bước 2: Nếu loại bỏ .env**

```powershell
# Nếu .env đã bị push trước đó, xóa khỏi git
git rm --cached backend/.env

# Commit change này
git add .gitignore
git commit -m "Remove .env from tracking"
```

### **Bước 3: Create .env.example (nếu chưa có)**

```powershell
# Copy .env thành .env.example
cp backend/.env backend/.env.example
```

**Chỉnh sửa** `backend/.env.example`:
- Thay tất cả sensitive values bằng placeholders
- Ví dụ:
  ```
  DB_PASSWORD=bike_password          # OK (default cho dev)
  JWT_SECRET=your-secret-key-here    # OK (placeholder)
  ```

### **Bước 4: Staging files**

```powershell
# Add tất cả files (respects .gitignore)
git add .

# Hoặc add từng file cụ thể
git add docker-compose.yml
git add Dockerfile
git add backend/public/
git add backend/.env.example
git add README.md
git add QUICK_START.md
```

### **Bước 5: Commit with good message**

```powershell
git commit -m "Initial authentication system with Docker setup

- Implement Register, Login, JWT auth APIs
- Add Docker Compose with PHP, MySQL, PhpMyAdmin
- Include API tester HTML page
- Add comprehensive documentation
- Setup CORS and error handling"
```

### **Bước 6: Push to GitHub**

```powershell
git push origin main
```

---

## ✅ CHECKLIST Trước Khi Push

- [ ] `.env` không được push (check `git status`)
- [ ] `.env.example` có tất cả config template
- [ ] `composer.json` được push (nhưng không `composer.lock`)
- [ ] `.gitignore` bao gồm `/vendor/` và `uploads/`
- [ ] `docker-compose.yml` và `Dockerfile` có
- [ ] `README.md` có hướng dẫn cài đặt
- [ ] Không push `node_modules/` hoặc `php_sessions/`
- [ ] Commit message rõ ràng và chi tiết

---

## 👥 Khi Người Khác Clone Về

### **Họ sẽ làm:**

```bash
# 1. Clone project
git clone https://github.com/yourusername/bike-marketplace.git
cd bike-marketplace

# 2. Copy env template
cp backend/.env.example backend/.env

# 3. Edit .env với settings riêng của họ (nếu cần)
# vim backend/.env

# 4. Start Docker
docker-compose up -d

# 5. Install PHP dependencies (nếu cần)
docker-compose exec php composer install

# 6. Test API
# Mở http://localhost/api/auth/register
```

### **Điều kiện để họ chạy được:**

1. ✅ Docker & Docker Compose cài sẵn
2. ✅ Project có tất cả source code
3. ✅ Project có `.env.example` template
4. ✅ Project có `docker-compose.yml` & `Dockerfile`
5. ✅ README có hướng dẫn setup rõ ràng

---

## 🔐 SECURITY BEST PRACTICES

### **Nếu .env bị push nhầm:**

```powershell
# Remove khỏi git history (nguy hiểm - cần thay secret)
git filter-branch --tree-filter 'rm -f backend/.env' HEAD

# Regenerate JWT_SECRET trong production
# (vì đã bị expose trước đó)
```

### **Production .env**

```
# Không bao giờ commit production .env
# Dùng environment variables trực tiếp:
# - Heroku: Config Vars
# - AWS: Secrets Manager
# - Docker: Environment file (không push)
```

---

## 📝 Ví Dụ PUSH HOÀN CHỈNH

```powershell
# 1. Check status
git status
# Thấy:
# Changes not staged for commit:
#   modified:   .gitignore
#   new file:   API_TESTER.html
#   (KHÔNG thấy .env hoặc vendor/)

# 2. Add files
git add .

# 3. Commit
git commit -m "Add complete authentication system with HTML test page"

# 4. Push
git push origin main

# 5. Verify on GitHub
# Mở https://github.com/yourusername/bike-marketplace
# Kiểm tra: không thấy .env, vendor/, uploads/
```

---

## 🎯 FINAL CHECKLIST

Trước khi push, chạy:

```powershell
# 1. Xem file sắp push
git status

# 2. Xem diff trước khi commit
git diff --cached

# 3. Check .env không có trong danh sách
git ls-files | grep -i ".env"
# Kết quả: Chỉ thấy `.env.example`, không thấy `.env`

# 4. Tất cả OK, push!
git push origin main
```

---

## ❓ QA

**Q: Nếu quên push `.env.example` thì sao?**  
A: Người khác tạo tay hoặc push `.env.example` sau lần đầu

**Q: Có nên push `composer.lock` không?**  
A: Không - để người khác dùng `composer install` lấy latest compatible versions

**Q: .env.example có giống .env không?**  
A: Không - .env.example là template, không có real credentials

**Q: Uploads folder có nên ignore?**  
A: Có - nó chứa user files, tạo .gitkeep để keep folder

---

✅ **Làm xong các bước trên, project của bạn sẽ ready để GitHub!**
