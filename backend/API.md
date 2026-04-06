# 🚴 Bike Marketplace - API Documentation

## Overview
Complete API endpoints for Bike Marketplace authentication system.

## Base URL
```
http://localhost/api
```

## Authentication
Use JWT Bearer token in header:
```
Authorization: Bearer <access_token>
```

## Response Format
All endpoints return JSON:
```json
{
  "success": boolean,
  "message": string,
  "data": object|null
}
```

## Auth Endpoints

### Register
```
POST /auth/register
```
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "0123456789",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "user": {...}
  }
}
```

### Login
```
POST /auth/login
```
**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

### Logout
```
POST /auth/logout
Authorization: Bearer <token>
```

### Refresh Token
```
POST /auth/refresh
```
**Request:**
```json
{
  "refresh_token": "..."
}
```

### Forgot Password
```
POST /auth/forgot-password
```
**Request:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
```
POST /auth/reset-password
```
**Request:**
```json
{
  "email": "john@example.com",
  "token": "reset-token",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}
```

---

## Error Responses

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

See [BACKEND_SETUP.md](../BACKEND_SETUP.md) for detailed documentation.
