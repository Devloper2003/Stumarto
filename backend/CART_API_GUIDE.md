# Cart API Guide

## Overview

Cart APIs for managing user shopping carts. Only `platform_sell` products can be added to cart.

## Business Rules

1. **Only platform_sell products** can be added to cart
2. **direct_sell products are rejected** with error message
3. Products must be **approved** before adding to cart
4. **Stock validation** - Cannot add more than available stock
5. All cart operations require **authentication**

## API Endpoints

### 1. Add Product to Cart
```
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-id-here",
  "quantity": 2
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": {
    "cart": {
      "_id": "...",
      "userId": "...",
      "products": [
        {
          "productId": {
            "_id": "...",
            "title": "School Uniform Set",
            "price": 500,
            "images": ["url1"],
            "category": "uniforms",
            "productType": "platform_sell",
            "approved": true,
            "stock": 10
          },
          "quantity": 2
        }
      ],
      "createdAt": "..."
    }
  }
}
```

**Error Responses:**

**Direct Sell Product:**
```json
{
  "success": false,
  "message": "Only platform_sell products can be added to cart. This product is for direct selling."
}
```

**Unapproved Product:**
```json
{
  "success": false,
  "message": "Product is not approved and cannot be added to cart"
}
```

**Insufficient Stock:**
```json
{
  "success": false,
  "message": "Insufficient stock. Only 5 item(s) available."
}
```

**Product Not Found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 2. Get User Cart
```
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "_id": "...",
      "userId": "...",
      "products": [
        {
          "productId": {
            "_id": "...",
            "title": "School Uniform Set",
            "description": "...",
            "price": 500,
            "images": ["url1"],
            "category": "uniforms",
            "productType": "platform_sell",
            "approved": true,
            "stock": 10,
            "condition": "new",
            "sellerId": {
              "_id": "...",
              "name": "John Doe",
              "email": "john@example.com",
              "location": "New York"
            }
          },
          "quantity": 2
        }
      ],
      "createdAt": "...",
      "updatedAt": "..."
    },
    "summary": {
      "totalItems": 2,
      "totalAmount": "1000.00",
      "itemCount": 1
    }
  }
}
```

**Summary Fields:**
- `totalItems`: Total quantity of all items in cart
- `totalAmount`: Total price of all items (formatted to 2 decimal places)
- `itemCount`: Number of different products in cart

---

### 3. Remove Product from Cart
```
DELETE /api/cart/:productId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product removed from cart successfully",
  "data": {
    "cart": {
      "_id": "...",
      "products": [...],
      ...
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Product not found in cart"
}
```

---

### 4. Update Product Quantity in Cart
```
PATCH /api/cart/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "data": {
    "cart": {
      "_id": "...",
      "products": [
        {
          "productId": {...},
          "quantity": 3
        }
      ],
      ...
    }
  }
}
```

**Error Responses:**

**Invalid Quantity:**
```json
{
  "success": false,
  "message": "Quantity must be at least 1"
}
```

**Insufficient Stock:**
```json
{
  "success": false,
  "message": "Insufficient stock. Only 5 item(s) available."
}
```

---

### 5. Clear Entire Cart
```
DELETE /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "cart": {
      "_id": "...",
      "products": [],
      ...
    }
  }
}
```

## Validation Rules

### Adding to Cart
1. ✅ Product must exist
2. ✅ Product must be approved
3. ✅ Product must be `platform_sell` type (NOT `direct_sell`)
4. ✅ Product must have sufficient stock
5. ✅ Quantity must be at least 1

### Updating Cart
1. ✅ Product must exist in cart
2. ✅ New quantity must be at least 1
3. ✅ Product must have sufficient stock

## Error Codes

- **400 Bad Request**: Invalid input, insufficient stock, direct_sell product, unapproved product
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Product not found, cart not found, product not in cart
- **500 Internal Server Error**: Server error

## Testing Examples

### 1. Add Product to Cart
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product-id-here",
    "quantity": 2
  }'
```

### 2. Get Cart
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer <token>"
```

### 3. Update Quantity
```bash
curl -X PATCH http://localhost:5000/api/cart/product-id-here \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

### 4. Remove Product
```bash
curl -X DELETE http://localhost:5000/api/cart/product-id-here \
  -H "Authorization: Bearer <token>"
```

### 5. Clear Cart
```bash
curl -X DELETE http://localhost:5000/api/cart \
  -H "Authorization: Bearer <token>"
```

## Frontend Integration Notes

### 1. Add to Cart Button
```javascript
// Only show "Add to Cart" button for platform_sell products
if (product.productType === 'platform_sell' && product.approved) {
  // Show add to cart button
} else if (product.productType === 'direct_sell') {
  // Show "Contact Seller" button instead
}
```

### 2. Handle Direct Sell Error
```javascript
try {
  await addToCart(productId, quantity);
} catch (error) {
  if (error.message.includes('direct selling')) {
    // Show message: "This product is for direct selling. Please contact the seller."
  }
}
```

### 3. Cart Display
```javascript
// Use the summary object for cart totals
const { totalItems, totalAmount, itemCount } = cartData.summary;

// Display cart items
cartData.cart.products.forEach(item => {
  const { productId, quantity } = item;
  // Render cart item
});
```

### 4. Stock Validation
```javascript
// Before adding to cart, check stock
if (product.stock < quantity) {
  alert(`Only ${product.stock} item(s) available`);
  return;
}
```

## Important Notes

1. **Cart is created automatically** when first item is added
2. **One cart per user** - Each user has a unique cart
3. **Products are populated** with full details in cart responses
4. **Stock is checked** on every add/update operation
5. **Only approved products** can be added to cart
6. **Direct sell products** are explicitly rejected with clear error message

## Workflow

1. User browses products
2. User clicks "Add to Cart" on a `platform_sell` product
3. Backend validates:
   - Product exists
   - Product is approved
   - Product is `platform_sell` (not `direct_sell`)
   - Sufficient stock available
4. Product is added to cart
5. User can view cart, update quantities, or remove items
6. Cart is ready for checkout (next step: Order APIs)
