# 🔐 Authentication System - Complete Guide

## What's Fixed

### 1. **Auto Admin Creation** ✅
- Admin user automatically created on server startup
- Works with **both MongoDB and Supabase**
- Credentials from environment variables: `ADMIN_EMAIL` & `ADMIN_PASSWORD`
- Safe password hashing with bcrypt (10 salt rounds)

### 2. **Password Reset System** ✅
- **Forgot Password** - Request reset token
- **Reset Password** - Reset with token
- Token expires after 1 hour
- Secure token generation with crypto

### 3. **Security Improvements** ✅
- All passwords now bcrypt hashed (including mock users)
- Email validation on register & forgot-password
- Min 6 character password requirement
- Password change endpoint for authenticated users
- No plain-text password comparisons

### 4. **Error Handling** ✅
- Better validation messages
- Graceful fallback between DB types
- Development vs Production error details

---

## API Endpoints

### **Public Endpoints**

#### 1. Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",           # optional: user, seller, admin
  "location": "Delhi"       # optional
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { _id, name, email, role, location },
    "token": "jwt_token"
  }
}
```

#### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { _id, name, email, role, location },
    "token": "jwt_token"
  }
}
```

#### 3. Forgot Password
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "message": "Password reset instructions sent",
  "token": "reset_token"  # Development only!
}
```

#### 4. Reset Password
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_forgot_password",
  "newPassword": "newPassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successful"
}
```

### **Protected Endpoints** (Require Bearer Token)

#### 5. Get Current User
```bash
GET /api/auth/me
Authorization: Bearer your_jwt_token

Response:
{
  "success": true,
  "data": {
    "user": { _id, name, email, role, location, createdAt }
  }
}
```

#### 6. Change Password
```bash
POST /api/auth/change-password
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Admin Account Setup

### Automatic Creation
When backend starts with env vars:
```env
ADMIN_EMAIL=admin@stumarto.com
ADMIN_PASSWORD=YourSecurePassword123
JWT_SECRET=your-secret-key
```

Admin user automatically created if doesn't exist:
- **Email**: admin@stumarto.com
- **Password**: YourSecurePassword123
- **Role**: admin
- **Location**: Headquarters

### Test Admin (Development)
```
Email: admin@stumarto.com
Password: admin@stumarto2024
```

---

## Production Password Reset (Email)

### Currently (Development)
- Token returned in response (dev only!)
- You can test reset immediately

### For Production
Update `backend/controllers/auth.controller.js` `forgotPassword()`:

```javascript
// Send email with reset link
const resetLink = `https://stumarto.in/reset-password?token=${resetToken}`;
await sendEmail(email, 'Password Reset', `
  Click here to reset: ${resetLink}
  Link expires in 1 hour
`);

// Remove from response:
// ...(process.env.NODE_ENV === 'development' && { token: resetToken })
```

---

## Database Support

### MongoDB
- Auto seeds admin on connection
- Uses User model with pre-save password hashing
- Password comparison with `comparePassword()` method

### Supabase (PostgreSQL)
- Auto seeds admin on startup
- Uses supabaseService for CRUD
- Password hashed before storing
- Works exactly like MongoDB API

### Graceful Degradation
If both fail → Mock users with bcrypt hashed passwords:
- admin@stumarto.com / admin123
- seller@stumarto.com / seller123
- user@stumarto.com / user123

---

## Testing

### 1. Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Test Password Reset Flow
```bash
# Step 1: Request reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Copy token from response

# Step 2: Reset password
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "copied_token_here",
    "newPassword": "newTest123"
  }'

# Step 3: Login with new password
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "newTest123"
  }'
```

### 4. Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer your_jwt_token_here"
```

---

## Environment Variables

Required for production:
```env
# Auth
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@stumarto.com
ADMIN_PASSWORD=YourSecurePassword123

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# Or MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Node
NODE_ENV=production
PORT=5000
```

---

## File Structure

```
backend/
├── controllers/
│   └── auth.controller.js      # All auth endpoints
├── routes/
│   └── auth.routes.js          # Auth routes
├── middleware/
│   └── auth.middleware.js      # JWT verification
├── models/
│   └── User.js                 # MongoDB schema with password hashing
├── utils/
│   └── seedAdmin.js            # Auto admin creation for MongoDB & Supabase
├── supabaseService.js          # Supabase database operations
└── server.js                   # Server startup with auto-seeding
```

---

## Security Checklist

- ✅ Passwords bcrypt hashed (10 rounds)
- ✅ JWT tokens with expiry (7 days default)
- ✅ Email validation on register
- ✅ Password minimum 6 characters
- ✅ Reset tokens expire (1 hour)
- ✅ No plain-text passwords in responses
- ✅ Protected routes with `protect` middleware
- ✅ Role-based access with `authorize` middleware
- ✅ CORS configured for allowed origins
- ✅ Development vs Production error handling

---

## Troubleshooting

### "Invalid email or password" on login
- Check email exists in database
- Verify password is correct
- Check database connectivity
- Check mock users if DB is down

### "Password reset endpoint not working"
- Verify reset token is valid
- Check token hasn't expired (1 hour limit)
- Ensure newPassword is min 6 chars
- Check JWT_SECRET is set

### Admin not created automatically
- Check ADMIN_EMAIL & ADMIN_PASSWORD are set
- Check JWT_SECRET is set
- Check database connection (MongoDB or Supabase)
- Check server logs for seed errors

### "Cannot find module crypto" 
- Node.js built-in module
- Should work without npm install
- Update Node if issue persists

---

## Next Steps

1. **Deploy Backend**: Push to Render/Railway
2. **Create Supabase Tables**: Run `backend/init_supabase.sql`
3. **Test Password Reset**: Test full flow before production
4. **Setup Email Service**: Implement email sending for reset links
5. **Add Frontend**: Update login form to use new endpoints
