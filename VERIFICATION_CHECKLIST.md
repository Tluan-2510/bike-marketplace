# ✅ Verification Checklist

## Setup Verification

### File Structure
- [ ] `docker-compose.yml` exists
- [ ] `Dockerfile` exists  
- [ ] `backend/.env` exists
- [ ] `backend/composer.json` exists
- [ ] `backend/public/index.php` exists
- [ ] `backend/bootstrap/app.php` exists

### Backend Structure
- [ ] `app/Http/Controllers/AuthController.php`
- [ ] `app/Http/Middleware/AuthMiddleware.php`
- [ ] `app/Services/JwtService.php`
- [ ] `app/Services/AuthService.php`
- [ ] `app/Models/User.php`
- [ ] `routes/api.php`
- [ ] `database/migrations/` folder has 3 migration files

### Docker Files
- [ ] `docker/apache/000-default.conf`
- [ ] `docker/apache/php.ini`
- [ ] `docker/mysql/init.sql`
- [ ] `docker/entrypoint.sh`

### Documentation
- [ ] `QUICK_START.md`
- [ ] `BACKEND_SETUP.md`
- [ ] `PROJECT_STRUCTURE.md`
- [ ] `test-api.sh`

---

## Runtime Verification

### 1. Docker Containers
```bash
docker-compose ps

# Expected:
# - bike_marketplace_php (Up)
# - bike_marketplace_mysql (Up)
# - bike_marketplace_phpmyadmin (Up)
```

### 2. Database Connection
```bash
# Check MySQL
docker-compose exec mysql mysql -u bike_user -pbike_password -e "USE bike_marketplace; SHOW TABLES;"

# Expected tables:
# - users
# - password_reset_tokens
# - refresh_tokens
```

### 3. API Test
```bash
# Test 1: Register user
RESPONSE=$(curl -s -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }')

echo $RESPONSE | jq .

# Expected: 201 status, success=true, has tokens

# Test 2: Get current user (without auth - should fail)
curl http://localhost/api/auth/me
# Expected: 401 Unauthorized

# Test 3: Extract token and test auth
TOKEN=$(echo $RESPONSE | jq -r '.data.access_token')
curl -H "Authorization: Bearer $TOKEN" http://localhost/api/auth/me
# Expected: 200 status, user data
```

### 4. Database Verification
```sql
-- Check users table
SELECT id, name, email, role, is_active FROM users;

-- Check refresh_tokens
SELECT user_id, token, expires_at FROM refresh_tokens;

-- Check if tokens are valid
SELECT * FROM refresh_tokens WHERE revoked_at IS NULL AND expires_at > NOW();
```

---

## Configuration Verification

### .env File
Check `backend/.env` contains:
```
✓ APP_NAME=Bike Marketplace
✓ APP_ENV=local
✓ APP_DEBUG=true
✓ DB_HOST=mysql
✓ DB_DATABASE=bike_marketplace
✓ DB_USERNAME=bike_user
✓ DB_PASSWORD=bike_password
✓ JWT_SECRET=your-secret-key
✓ JWT_EXPIRATION_TIME=15
✓ REFRESH_TOKEN_EXPIRATION_TIME=10080
```

### Docker Compose
Check `docker-compose.yml` contains:
```
✓ php service with Apache
✓ mysql service with port 3306
✓ phpmyadmin service with port 8080
✓ Same network for all services
✓ Volume mapping for mysql_data
```

---

## Security Verification

### JWT Secret
- [ ] JWT_SECRET is unique (not default)
- [ ] JWT_SECRET is at least 32 characters long
- [ ] In production, use: `openssl rand -base64 32`

### Password Handling
- [ ] Passwords are hashed with bcrypt
- [ ] Raw passwords never logged
- [ ] Password reset tokens expire in 1 hour

### Database Security
- [ ] MySQL root password is set
- [ ] Database user has limited privileges
- [ ] Connection only from PHP container

---

## Troubleshooting Checklist

### Servers not starting
- [ ] Docker is running
- [ ] Ports 80, 3306, 8080 are available
- [ ] `.env` file exists with correct values
- [ ] Check logs: `docker-compose logs -f`

### Database connection errors
- [ ] MySQL container is running
- [ ] Wait 15 seconds after `docker-compose up`
- [ ] Check MySQL password matches in `docker-compose.yml` and `.env`
- [ ] Check DB_HOST=mysql (not localhost)

### API 404 errors
- [ ] Routes registered in `routes/api.php`
- [ ] Check Apache is serving `/public` directory
- [ ] Verify `.htaccess` rewrite rules
- [ ] Check controller file names match

### 401 Unauthorized errors
- [ ] Token is in Authorization header
- [ ] Token format: `Bearer <token>`
- [ ] Token is not expired
- [ ] User exists and is_active=1

---

## Performance Checks

### Database Indexes
```sql
-- Check if indexes exist
SHOW INDEX FROM users;
-- Should have indexes on: email, role

SHOW INDEX FROM refresh_tokens;
-- Should have indexes on: user_id, token
```

### Query Performance
```sql
-- Should be instant
EXPLAIN SELECT * FROM users WHERE email='test@example.com';
```

---

## Deployment Pre-Checks

Before deploying to production:

### Security
- [ ] Change JWT_SECRET to random 32-char string
- [ ] Set APP_ENV=production
- [ ] Set APP_DEBUG=false
- [ ] Update CORS_ALLOWED_ORIGINS
- [ ] Use strong MySQL passwords
- [ ] Enable HTTPS
- [ ] Review env variables, no secrets in code

### Performance
- [ ] Verify database indexes exist
- [ ] Check query performance
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Test under load

### Monitoring
- [ ] Setup error logging
- [ ] Monitor disk space
- [ ] Setup health checks
- [ ] Configure alerts

---

## Quick Health Check Script

```bash
#!/bin/bash

echo "🏥 Bike Marketplace Health Check"
echo "================================\n"

# Check Docker
echo "1. Docker Status:"
docker-compose ps

# Check API
echo "\n2. API Health:"
curl -s http://localhost/api/auth/me | jq '.success'

# Check Database
echo "\n3. Database Tables:"
docker-compose exec mysql mysql -u bike_user -pbike_password -e "USE bike_marketplace; SHOW TABLES;" 2>/dev/null | wc -l

echo "\n✅ Health check complete!"
```

---

**Save this checklist and verify regularly!**
