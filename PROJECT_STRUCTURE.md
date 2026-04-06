# 📦 Project Structure Guide

## Full Directory Tree

```
d:/Web/bike-marketplace_PHP/
│
├── 📄 README.md                    # Main project documentation
├── 📄 QUICK_START.md              # 5-minute quick start guide
├── 📄 BACKEND_SETUP.md            # Detailed backend documentation
├── 📄 .gitignore                  # Git ignore file
├── docker-compose.yml             # Docker Compose configuration
├── Dockerfile                     # PHP/Apache Docker image
│
├── 🐳 docker/                     # Docker configuration files
│   ├── apache/
│   │   ├── 000-default.conf      # Apache virtual host config
│   │   └── php.ini               # PHP configuration
│   ├── mysql/
│   │   └── init.sql              # MySQL initialization
│   └── entrypoint.sh             # Container startup script
│
├── 📱 frontend/                   # (Future) Frontend application
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   └── pages/
│
├── 💾 database/                   # Database backups & seeds
│
├── 🚀 backend/                    # Laravel PHP Application
│   ├── 🔒 app/                    # Application logic
│   │   ├── Http/                  # HTTP layer
│   │   │   ├── Controllers/       # API controllers
│   │   │   │   └── AuthController.php
│   │   │   ├── Middleware/        # Request middleware
│   │   │   │   ├── AuthMiddleware.php
│   │   │   │   └── RoleMiddleware.php
│   │   │   ├── Router.php         # Custom router
│   │   │   ├── Request.php        # Request handler
│   │   │   └── Response.php       # Response factory
│   │   ├── Models/                # Eloquent ORM models
│   │   │   ├── User.php
│   │   │   └── RefreshToken.php
│   │   ├── Services/              # Business logic services
│   │   │   ├── JwtService.php     # JWT token handling
│   │   │   └── AuthService.php    # Authentication logic
│   │   ├── helpers/               # Helper functions
│   │   │   └── functions.php
│   │   └── Container.php          # Dependency injection container
│   │
│   ├── ⚙️ bootstrap/              # Application initialization
│   │   └── app.php
│   │
│   ├── ⚙️ config/                 # Configuration files
│   │   └── database.php
│   │
│   ├── 📊 database/               # Database related files
│   │   ├── migrations/            # Schema migrations
│   │   │   ├── 2024_01_01_000000_create_users_table.php
│   │   │   ├── 2024_01_02_000000_create_password_reset_tokens_table.php
│   │   │   └── 2024_01_03_000000_create_refresh_tokens_table.php
│   │   ├── Migrator.php           # Migration runner
│   │   └── BaseModel.php          # Base model class
│   │
│   ├── 📂 public/                 # Web root directory
│   │   └── index.php              # Application entry point
│   │
│   ├── 🛣️ routes/                 # Route definitions
│   │   └── api.php                # API routes
│   │
│   ├── 📁 uploads/                # User file storage
│   │   └── .gitkeep              # Keep folder in git
│   │
│   ├── 📄 composer.json           # PHP dependencies
│   ├── 📄 .env                    # Environment variables
│   ├── 📄 .env.example            # Environment template
│   ├── 📄 .htaccess               # Apache rewrite rules
│   ├── 📄 setup.php               # Database setup script
│   ├── 📄 API.md                  # API reference
│   └── 📄 test-api.sh             # API testing script
│
└── 📋 PROJECT_STRUCTURE.md        # This file
```

---

## Layer Architecture

### Request Flow
```
HTTP Request
    ↓
public/index.php (Entry Point)
    ↓
bootstrap/app.php (Initialize app)
    ↓
App/Http/Router.php (Route matching)
    ↓
Middleware Stack
    ├─ AuthMiddleware (Check JWT token)
    └─ RoleMiddleware (Check permissions)
    ↓
Controller (App/Http/Controllers/)
    ↓
Service Layer (App/Services/)
    ├─ AuthService (Business logic)
    ├─ JwtService (Token handling)
    └─ ...Other services
    ↓
Model Layer (App/Models/)
    ├─ User
    ├─ RefreshToken
    └─ ...Other models
    ↓
Database (MySQL)
    ↓
Response JSON
```

---

## Key Files Overview

### Authentication Flow
1. **Routes** (`routes/api.php`)
   - Defines all API endpoints
   - Attaches middleware to protected routes

2. **Controllers** (`app/Http/Controllers/AuthController.php`)
   - Handles HTTP requests
   - Validates input
   - Calls service layer

3. **Services** (`app/Services/`)
   - **AuthService**: Login, Register, Token refresh, Password reset
   - **JwtService**: Token creation, verification

4. **Models** (`app/Models/`)
   - **User**: User data and relationships
   - **RefreshToken**: Token management

5. **Middleware** (`app/Http/Middleware/`)
   - **AuthMiddleware**: Verify JWT tokens
   - **RoleMiddleware**: Check user role permissions

6. **Migrations** (`database/migrations/`)
   - Create users table
   - Create password_reset_tokens table
   - Create refresh_tokens table

---

## Configuration Hierarchy

```
Environment Variables (.env)
    ↓
bootstrap/app.php (Load .env)
    ↓
app/Services/ (Use env values)
    ↓
Database & Auth Logic
```

### Key Environment Variables
```
# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION_TIME=15
REFRESH_TOKEN_EXPIRATION_TIME=10080

# Database
DB_HOST=mysql
DB_DATABASE=bike_marketplace
DB_USERNAME=bike_user
DB_PASSWORD=bike_password
```

---

## Database Schema

### Users
```
id → name, email, password, phone, role, avatar_url, bio, address, is_active, ...
```

### Refresh Tokens
```
id → user_id (FK), token, expires_at, revoked_at, ...
```

### Password Reset Tokens
```
email (PK) → token, created_at
```

---

## Adding New Features

### Example: Add Bike Listing API

1. **Create Model**
   ```bash
   # backend/app/Models/Bike.php
   class Bike extends Model { ... }
   ```

2. **Create Migration**
   ```bash
   # database/migrations/xxxx_create_bikes_table.php
   Schema::create('bikes', function(Blueprint $table) { ... })
   ```

3. **Create Service**
   ```bash
   # app/Services/BikeService.php
   class BikeService { ... }
   ```

4. **Create Controller**
   ```bash
   # app/Http/Controllers/BikeController.php
   class BikeController extends Controller { ... }
   ```

5. **Add Routes**
   ```bash
   # routes/api.php
   route('GET /bikes', [BikeController::class, 'index']);
   route('POST /bikes', [BikeController::class, 'store'])->middleware('auth');
   ```

6. **Update Database**
   ```php
   // database/Migrator.php
   // Add bike table creation
   ```

---

## Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Classes | PascalCase | `UserController`, `AuthService` |
| Methods | camelCase | `getUserById()`, `createToken()` |
| Variables | camelCase | `$accessToken`, `$userData` |
| Constants | UPPER_SNAKE_CASE | `JWT_EXPIRATION`, `DB_HOST` |
| Files | PascalCase for class files | `AuthController.php` |
| Migrations | timestamp_snake_case | `2024_01_01_000000_create_users_table` |
| Tables | snake_case plural | `users`, `refresh_tokens` |
| Columns | snake_case | `user_id`, `created_at` |

---

## Development Tips

### 1. Debug API Requests
```bash
# View logs
docker-compose logs -f php

# Test endpoints
curl -H "Authorization: Bearer TOKEN" http://localhost/api/auth/me
```

### 2. Database Operations
```bash
# Access MySQL
docker-compose exec mysql mysql -u bike_user -pbike_password bike_marketplace

# View tables
SHOW TABLES;
SELECT * FROM users;
```

### 3. Code Organization
- Keep models focused on data
- Put business logic in services
- Keep controllers thin (just delegate)
- Use middleware for cross-cutting concerns

### 4. Error Handling
```php
try {
    // Do something
} catch (\Exception $e) {
    return response()->json([
        'success' => false,
        'message' => $e->getMessage()
    ], $e->getCode() ?: 400);
}
```

---

## Next Steps

1. ✅ **Backend Setup** → COMPLETED
2. 📱 **Frontend Development** → Start React/Vue setup
3. 🚴 **Bike Listing APIs** → Create CRUD endpoints
4. 🛒 **Order System** → Implement ordering
5. ⭐ **Review System** → Add user reviews
6. 📊 **Admin Dashboard** → Create admin panel
7. 🧪 **Testing** → Add unit & integration tests
8. 🚀 **Deployment** → Deploy to production

---

**Happy Coding! 🎉**
