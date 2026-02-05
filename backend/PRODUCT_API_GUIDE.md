# Product API Guide

## Overview

Product APIs for the School Marketplace with seller creation, admin approval, and filtering capabilities.

## Business Rules

1. **Seller can add products** - Only sellers (and admins) can create products
2. **Admin must approve products** - All products start as unapproved (`approved: false`)
3. **productType logic**:
   - `direct_sell`: No cart, no payment - direct contact between buyer and seller
   - `platform_sell`: Cart and checkout allowed - platform handles the transaction

## API Endpoints

### 1. Add Product (Seller Only)
```
POST /api/products
Authorization: Bearer <seller-token>
Content-Type: application/json

{
  "title": "School Uniform Set",
  "description": "Complete school uniform set in excellent condition",
  "price": 500,
  "category": "uniforms",
  "images": ["url1", "url2"],
  "location": "New York",
  "productType": "direct_sell",
  "stock": 1,
  "condition": "like_new"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully. Waiting for admin approval.",
  "data": {
    "product": {
      "_id": "...",
      "title": "School Uniform Set",
      "description": "...",
      "price": 500,
      "category": "uniforms",
      "productType": "direct_sell",
      "approved": false,
      "sellerId": {...},
      "createdAt": "..."
    }
  }
}
```

**Required Fields:**
- `title` (string, 3-200 chars)
- `description` (string, 10-2000 chars)
- `price` (number, >= 0)
- `category` (enum: uniforms, books, bags, shoes, stationery, other)
- `productType` (enum: direct_sell, platform_sell)

**Optional Fields:**
- `images` (array of strings, max 10)
- `location` (string)
- `stock` (number, default: 1)
- `condition` (enum: new, like_new, good, fair, default: new)

---

### 2. Get Approved Products (Public)
```
GET /api/products?category=uniforms&location=New York&productType=platform_sell&page=1&limit=20
```

**Query Parameters:**
- `category` (optional) - Filter by category: uniforms, books, bags, shoes, stationery, other
- `location` (optional) - Filter by location (case-insensitive partial match)
- `productType` (optional) - Filter by type: direct_sell, platform_sell
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 20) - Items per page
- `sort` (optional, default: -createdAt) - Sort order

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 3,
  "data": {
    "products": [
      {
        "_id": "...",
        "title": "School Uniform Set",
        "description": "...",
        "price": 500,
        "category": "uniforms",
        "productType": "platform_sell",
        "approved": true,
        "sellerId": {
          "_id": "...",
          "name": "John Doe",
          "email": "john@example.com",
          "location": "New York"
        },
        "createdAt": "..."
      }
    ]
  }
}
```

**Examples:**
```bash
# Get all approved products
GET /api/products

# Filter by category
GET /api/products?category=books

# Filter by location
GET /api/products?location=New York

# Filter by productType
GET /api/products?productType=platform_sell

# Combine filters
GET /api/products?category=uniforms&location=New York&productType=direct_sell

# Pagination
GET /api/products?page=2&limit=10
```

---

### 3. Get Single Product by ID (Public)
```
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "...",
      "title": "School Uniform Set",
      "description": "...",
      "price": 500,
      "category": "uniforms",
      "productType": "platform_sell",
      "approved": true,
      "sellerId": {...},
      "createdAt": "..."
    }
  }
}
```

**Note:** Only approved products are visible to public. Sellers can see their own unapproved products, and admins can see all products.

---

### 4. Admin Approve Product (Admin Only)
```
PATCH /api/products/:id/approve
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product approved successfully",
  "data": {
    "product": {
      "_id": "...",
      "title": "School Uniform Set",
      "approved": true,
      ...
    }
  }
}
```

---

### 5. Get Seller's Own Products (Seller Only)
```
GET /api/products/seller/my-products?approved=true&page=1&limit=20
Authorization: Bearer <seller-token>
```

**Query Parameters:**
- `approved` (optional) - Filter by approval status: true, false
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 10,
  "page": 1,
  "pages": 1,
  "data": {
    "products": [...]
  }
}
```

---

### 6. Get Pending Products (Admin Only)
```
GET /api/products/admin/pending?page=1&limit=20
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 15,
  "page": 1,
  "pages": 2,
  "data": {
    "products": [
      {
        "_id": "...",
        "title": "School Uniform Set",
        "approved": false,
        "sellerId": {...},
        ...
      }
    ]
  }
}
```

## Product Type Logic

### direct_sell
- Products marked as `direct_sell` are for direct contact between buyer and seller
- **No cart functionality** - Users cannot add these to cart
- **No payment processing** - No checkout flow
- Buyer contacts seller directly (via contact info or messaging)

### platform_sell
- Products marked as `platform_sell` go through the platform
- **Cart functionality** - Users can add to cart
- **Checkout allowed** - Full e-commerce checkout flow
- Platform handles payment and order processing

## Categories

- `uniforms` - School uniforms
- `books` - Textbooks, notebooks, study materials
- `bags` - School bags, backpacks
- `shoes` - School shoes, sports shoes
- `stationery` - Pens, pencils, notebooks, etc.
- `other` - Other school-related items

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide title, description, price, category, and productType"
}
```

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
  "message": "User role 'user' is not authorized to access this route. Required roles: seller, admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

## Testing Examples

### 1. Seller adds a product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <seller-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Math Textbook Class 10",
    "description": "NCERT Math textbook in excellent condition",
    "price": 300,
    "category": "books",
    "productType": "platform_sell",
    "location": "Delhi"
  }'
```

### 2. Get approved products
```bash
curl http://localhost:5000/api/products?category=books&location=Delhi
```

### 3. Admin approves product
```bash
curl -X PATCH http://localhost:5000/api/products/<product-id>/approve \
  -H "Authorization: Bearer <admin-token>"
```

## Frontend Integration Notes

1. **Product Listing**: Use `GET /api/products` with filters for the marketplace page
2. **Product Details**: Use `GET /api/products/:id` for product detail page
3. **Add to Cart**: Only allow for `productType: "platform_sell"` products
4. **Direct Contact**: Show contact button for `productType: "direct_sell"` products
5. **Seller Dashboard**: Use `GET /api/products/seller/my-products` to show seller's products
6. **Admin Panel**: Use `GET /api/products/admin/pending` to show products awaiting approval
