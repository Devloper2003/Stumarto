# Authentication System Guide

## Overview

The authentication system uses JWT (JSON Web Tokens) for secure user authentication and authorization.

## Features

- ✅ User registration
- ✅ User login
- ✅ Password hashing with bcrypt
- ✅ JWT token generation
- ✅ Role-based access control (user, seller, admin)
- ✅ Protected route middleware

## API Endpoints

### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",  // optional: "user", "seller", "admin" (default: "user")
  "location": "New York"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "location": "New York",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "location": "New York"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User Profile
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "location": "New York"
    }
  }
}
```

## Using Authentication Middleware

### Protect Routes (Require Authentication)

```javascript
const { protect } = require('./middleware/auth.middleware');

// Protect a route - requires valid JWT token
router.get('/protected-route', protect, (req, res) => {
  // req.user.userId contains the user ID from token
  res.json({ message: 'This is a protected route', userId: req.user.userId });
});
```

### Role-Based Authorization

```javascript
const { protect, authorize, isAdmin, isSeller } = require('./middleware/auth.middleware');

// Only admin can access
router.get('/admin-only', protect, isAdmin, (req, res) => {
  res.json({ message: 'Admin only route' });
});

// Seller or admin can access
router.get('/seller-route', protect, isSeller, (req, res) => {
  res.json({ message: 'Seller route' });
});

// Custom role authorization
router.get('/custom-role', protect, authorize('seller', 'admin'), (req, res) => {
  res.json({ message: 'Custom role route' });
});
```

## Client-Side Usage

### Storing Token
After login/registration, store the token:
```javascript
localStorage.setItem('token', response.data.token);
```

### Sending Token with Requests
```javascript
// Using fetch
fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Using axios
axios.get('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

## Environment Variables

Make sure your `.env` file includes:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please provide a token."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route. Required roles: admin"
}
```

## Security Notes

- Passwords are automatically hashed using bcrypt before saving
- JWT tokens expire after 7 days (configurable via JWT_EXPIRES_IN)
- Always use HTTPS in production
- Store JWT_SECRET securely and never commit it to version control
- Tokens should be stored securely on the client side (consider httpOnly cookies for better security)
