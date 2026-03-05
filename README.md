# Stumarto Backend - School Marketplace API

A complete backend API for Stumarto, a school marketplace platform combining OLX-style direct selling with structured e-commerce checkout functionality.

## 🚀 Features

- **User Authentication**: JWT-based authentication for users, sellers, and admins
- **Product Management**: Two product types (direct_sell and platform_sell)
- **Location-based Filtering**: Filter products by city, state, and pincode
- **Shopping Cart**: Cart functionality for platform_sell products only
- **Order Management**: Complete order lifecycle management
- **Payment Integration**: Razorpay payment gateway (test mode)
- **Admin Panel**: Product approval and user management
- **Role-based Access Control**: User, Seller, and Admin roles

## 📋 Prerequisites

Before running the backend, ensure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **VS Code** (or any code editor)
- **Postman** or **Thunder Client** (for API testing)

## 🛠️ Installation & Setup

### Step 1: Install Dependencies

Open terminal in VS Code (`Ctrl + ~`) and run:

```bash
npm install
```

### Step 2: Configure Environment Variables

1. Create a `.env` file in the root directory
2. Copy the contents from `.env.example`:

```bash
cp .env.example .env
```

3. Edit `.env` and update the following values:

```env
# MongoDB URI (use your local MongoDB or Atlas connection string)
MONGODB_URI=mongodb://localhost:27017/stumarto

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Razorpay Keys (get from Razorpay Dashboard - Test Mode)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is running on your system
- Default connection: `mongodb://localhost:27017/stumarto`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env`

### Step 4: Run the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 Environment: development
```

## 📁 Project Structure

```
backend/
├── models/              # Mongoose models
│   ├── User.js         # User/Seller/Admin model
│   ├── Product.js      # Product model
│   ├── Cart.js         # Shopping cart model
│   └── Order.js        # Order model
├── controllers/        # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── paymentController.js
│   └── adminController.js
├── routes/             # API routes
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   ├── payments.js
│   └── admin.js
├── middleware/         # Custom middleware
│   ├── auth.js        # JWT authentication & authorization
│   └── errorHandler.js
├── server.js           # Entry point
├── package.json
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user/seller | No |
| POST | `/login` | Login user/seller | No |
| PATCH | `/auth/upgrade` | Upgrade current account to seller | Yes (authenticated user) |
| GET | `/profile` | Get current user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products (with filters) | No |
| GET | `/:id` | Get single product | No |
| POST | `/` | Create product | Seller/Admin |
| GET | `/seller/my-products` | Get seller's products | Seller/Admin |
| PUT | `/:id` | Update product | Seller/Admin |
| DELETE | `/:id` | Delete product | Seller/Admin |

**Query Parameters for GET `/`:**
- `category`: uniform, book, bag, shoe, stationery
- `productType`: direct_sell, platform_sell
- `city`, `state`, `pincode`: Location filters
- `minPrice`, `maxPrice`: Price range
- `condition`: new, like_new, good, fair, poor
- `search`: Search in title/description/brand
- `page`, `limit`: Pagination

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's cart | Yes |
| POST | `/add` | Add item to cart | Yes |
| PUT | `/item/:itemId` | Update item quantity | Yes |
| DELETE | `/item/:itemId` | Remove item from cart | Yes |
| DELETE | `/clear` | Clear entire cart | Yes |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create order from cart | Yes |
| GET | `/` | Get user's orders | Yes |
| GET | `/:id` | Get single order | Yes |
| PUT | `/:id/cancel` | Cancel order | Yes |

### Payments (`/api/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create-order` | Create Razorpay order | Yes |
| POST | `/verify` | Verify payment | Yes |
| GET | `/status/:orderId` | Get payment status | Yes |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products/pending` | Get pending products | Admin |
| PUT | `/products/:id/approve` | Approve product | Admin |
| PUT | `/products/:id/reject` | Reject product | Admin |
| GET | `/users` | Get all users | Admin |
| GET | `/orders` | Get all orders | Admin |
| GET | `/dashboard/stats` | Get dashboard stats | Admin |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Example API Requests

### 1. User Signup

```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "role": "user"
}
```

### 2. Seller Signup

```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Jane Seller",
  "email": "jane@example.com",
  "password": "password123",
  "role": "seller"
}
```

### 3. Create Product (Platform Sell)

```bash
POST http://localhost:5000/api/products
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "title": "School Uniform Set",
  "description": "Complete school uniform in excellent condition",
  "category": "uniform",
  "productType": "platform_sell",
  "price": 500,
  "condition": "like_new",
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "images": ["https://example.com/image1.jpg"],
  "size": "Medium",
  "color": "Blue",
  "schoolName": "ABC School"
}
```

### 4. Create Product (Direct Sell)

```bash
POST http://localhost:5000/api/products
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "title": "Used School Books",
  "description": "Class 10 textbooks",
  "category": "book",
  "productType": "direct_sell",
  "condition": "good",
  "location": {
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001"
  },
  "author": "NCERT",
  "class": "10"
}
```

### 5. Add to Cart

```bash
POST http://localhost:5000/api/cart/add
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 1
}
```

### 6. Create Order

```bash
POST http://localhost:5000/api/orders
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

## 🧪 Testing in VS Code

### Using Thunder Client Extension

1. Install **Thunder Client** extension in VS Code
2. Create a new request
3. Set method, URL, headers, and body
4. Save requests in collections for easy testing

### Using Postman

1. Import the API endpoints
2. Set up environment variables for base URL
3. Create a collection with all endpoints

## 🔧 Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Dashboard → Settings → API Keys
3. Generate **Test Keys** (for development)
4. Copy `Key ID` and `Key Secret` to `.env`

**Note:** Use test mode keys during development. Switch to live keys in production.

## 👤 Creating Admin User

To create an admin user, you can either:

1. **Using MongoDB Compass/Shell:**
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Using API after signup:**
   - Sign up as regular user
   - Manually update role in database to "admin"

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env`
- Check firewall settings

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Or kill the process using port 5000

### JWT Token Errors
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration
- Verify token format: `Bearer <token>`

### Razorpay Errors
- Verify test keys are correct
- Check if order amount is in paise (multiply by 100)
- Ensure payment verification signature matches

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **razorpay**: Payment gateway
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

## 🚀 Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Use MongoDB Atlas or secure MongoDB instance
4. Use Razorpay **Live Keys**
5. Enable HTTPS
6. Set up proper CORS origins
7. Add rate limiting
8. Enable logging and monitoring

## 📄 License

ISC

## 👨‍💻 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🎉**
