# Razorpay Payment Integration Guide

## Overview

Razorpay payment gateway integration for School Marketplace. Only `platform_sell` products can be ordered and paid for through the platform.

## Setup

### 1. Get Razorpay Test Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Generate **Test Keys** (for development)
4. Copy **Key ID** and **Key Secret**

### 2. Configure Environment Variables

Add to your `.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
PAYMENT_MODE=razorpay
```

### No Razorpay account right now? (Mock payments)

If you don’t have a Razorpay account/keys yet, set:

```env
PAYMENT_MODE=mock
```

In **mock mode**:
- `POST /api/orders` will return a **mock** `razorpayOrder` object.
- You can complete the flow by calling `POST /api/orders/verify-payment` with:

```json
{
  "orderId": "<db-order-id>",
  "mockPaymentId": "mock_pay_123"
}
```

The backend will mark the order as **paid**, update stock, and clear cart (same as real flow).

### 3. Install Dependencies

```bash
cd backend
npm install
```

## Business Rules

1. ✅ **Only platform_sell products** can be ordered
2. ✅ Products must be **approved** before ordering
3. ✅ **Stock validation** before order creation
4. ✅ Payment verification using **Razorpay signature**
5. ✅ **Stock updated** after successful payment
6. ✅ **Cart cleared** after successful payment

## API Endpoints

### 1. Create Order from Cart
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": "123 Main St, City, State, PIN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully. Please proceed with payment.",
  "data": {
    "order": {
      "_id": "order-id",
      "totalAmount": 1500,
      "paymentStatus": "pending",
      "orderStatus": "pending",
      "products": [...],
      "createdAt": "..."
    },
    "razorpayOrder": {
      "id": "order_xxxxxxxxxxxxx",
      "amount": 150000,
      "currency": "INR",
      "receipt": "order_order-id"
    },
    "key": "rzp_test_xxxxxxxxxxxxx"
  }
}
```

**Error Responses:**

**Direct Sell Product:**
```json
{
  "success": false,
  "message": "Product \"Product Name\" is a direct_sell product and cannot be ordered through the platform."
}
```

**Empty Cart:**
```json
{
  "success": false,
  "message": "Cart is empty. Add products to cart before creating order."
}
```

**Insufficient Stock:**
```json
{
  "success": false,
  "message": "Insufficient stock for \"Product Name\". Only 5 item(s) available."
}
```

---

### 2. Verify Payment
```
POST /api/orders/verify-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order-id-from-database",
  "razorpayOrderId": "order_xxxxxxxxxxxxx",
  "razorpayPaymentId": "pay_xxxxxxxxxxxxx",
  "razorpaySignature": "signature-from-razorpay"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "order": {
      "_id": "...",
      "totalAmount": 1500,
      "paymentStatus": "paid",
      "orderStatus": "processing",
      "razorpayOrderId": "order_xxxxxxxxxxxxx",
      "razorpayPaymentId": "pay_xxxxxxxxxxxxx",
      "transactionId": "pay_xxxxxxxxxxxxx",
      "products": [...],
      "createdAt": "..."
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Payment verification failed. Invalid signature."
}
```

---

### 3. Get User Orders
```
GET /api/orders?paymentStatus=paid&orderStatus=processing&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `paymentStatus` (optional) - Filter by: pending, paid, failed, refunded
- `orderStatus` (optional) - Filter by: pending, processing, shipped, delivered, cancelled
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
    "orders": [
      {
        "_id": "...",
        "totalAmount": 1500,
        "paymentStatus": "paid",
        "orderStatus": "processing",
        "products": [...],
        "createdAt": "..."
      }
    ]
  }
}
```

---

### 4. Get Single Order
```
GET /api/orders/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "...",
      "totalAmount": 1500,
      "paymentStatus": "paid",
      "orderStatus": "processing",
      "products": [...],
      "shippingAddress": "...",
      "razorpayOrderId": "...",
      "razorpayPaymentId": "...",
      "transactionId": "...",
      "createdAt": "..."
    }
  }
}
```

## Frontend Integration

### Step 1: Install Razorpay Checkout

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 2: Create Order

```javascript
// Create order from cart
const createOrder = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shippingAddress: '123 Main St, City, State, PIN'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Open Razorpay checkout
      openRazorpayCheckout(data.data);
    }
  } catch (error) {
    console.error('Error creating order:', error);
  }
};
```

### Step 3: Open Razorpay Checkout

```javascript
const openRazorpayCheckout = (orderData) => {
  const options = {
    key: orderData.key, // Razorpay Key ID from backend
    amount: orderData.razorpayOrder.amount, // Amount in paise
    currency: orderData.razorpayOrder.currency,
    name: 'School Marketplace',
    description: 'Order Payment',
    order_id: orderData.razorpayOrder.id, // Razorpay Order ID
    handler: function (response) {
      // Payment successful - verify payment
      verifyPayment({
        orderId: orderData.order._id,
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      });
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone || ''
    },
    theme: {
      color: '#3399cc'
    },
    modal: {
      ondismiss: function() {
        // User closed the checkout without payment
        console.log('Payment cancelled');
      }
    }
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
  razorpay.on('payment.failed', function (response) {
    // Payment failed
    handlePaymentFailure(response);
  });
};
```

### Step 4: Verify Payment

```javascript
const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch('http://localhost:5000/api/orders/verify-payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    
    if (data.success) {
      // Payment verified successfully
      alert('Payment successful!');
      // Redirect to order confirmation page
      window.location.href = `/orders/${data.data.order._id}`;
    } else {
      // Payment verification failed
      alert('Payment verification failed. Please contact support.');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    alert('Error verifying payment. Please contact support.');
  }
};
```

### Step 5: Handle Payment Failure

```javascript
const handlePaymentFailure = (response) => {
  console.error('Payment failed:', response);
  alert('Payment failed. Please try again.');
  // Optionally update order status
};
```

## Complete Frontend Flow

```javascript
// Complete checkout flow
const checkout = async () => {
  try {
    // Step 1: Create order
    const orderResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shippingAddress: shippingAddress
      })
    });

    const orderData = await orderResponse.json();

    if (!orderData.success) {
      alert(orderData.message);
      return;
    }

    // Step 2: Open Razorpay checkout
    const options = {
      key: orderData.data.key,
      amount: orderData.data.razorpayOrder.amount,
      currency: 'INR',
      name: 'School Marketplace',
      description: 'Order Payment',
      order_id: orderData.data.razorpayOrder.id,
      handler: async function (response) {
        // Step 3: Verify payment
        const verifyResponse = await fetch('http://localhost:5000/api/orders/verify-payment', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: orderData.data.order._id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })
        });

        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
          alert('Payment successful!');
          window.location.href = `/orders/${verifyData.data.order._id}`;
        } else {
          alert('Payment verification failed.');
        }
      },
      prefill: {
        name: user.name,
        email: user.email
      },
      theme: {
        color: '#3399cc'
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
    
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Error processing checkout. Please try again.');
  }
};
```

## Payment Status Flow

1. **Order Created** → `paymentStatus: "pending"`
2. **Payment Initiated** → User opens Razorpay checkout
3. **Payment Success** → Razorpay returns payment details
4. **Payment Verified** → Backend verifies signature → `paymentStatus: "paid"`
5. **Stock Updated** → Product stock reduced
6. **Cart Cleared** → User's cart is emptied
7. **Order Processing** → `orderStatus: "processing"`

## Test Cards (Razorpay Test Mode)

Use these test cards for testing:

| Card Number | CVV | Expiry | Result |
|------------|-----|--------|--------|
| 4111 1111 1111 1111 | Any | Any future date | Success |
| 5555 5555 5555 4444 | Any | Any future date | Success |
| 5104 0600 0000 0008 | Any | Any future date | Success |
| 4000 0000 0000 0002 | Any | Any future date | Failure |

## Security Notes

1. ✅ **Signature Verification** - Always verify Razorpay signature on backend
2. ✅ **Never trust frontend** - All payment verification happens on backend
3. ✅ **Store transaction IDs** - Save Razorpay payment IDs for reference
4. ✅ **Handle failures** - Update order status if payment fails
5. ✅ **Test mode** - Use test keys during development
6. ✅ **Production keys** - Switch to live keys in production

## Error Handling

### Common Errors

1. **Invalid Signature**
   - Check if `RAZORPAY_KEY_SECRET` is correct
   - Verify signature generation matches Razorpay's method

2. **Order Not Found**
   - Ensure order ID is correct
   - Check if order belongs to the user

3. **Insufficient Stock**
   - Stock is checked before order creation
   - Stock is updated after payment verification

4. **Direct Sell Product**
   - Only `platform_sell` products can be ordered
   - `direct_sell` products are rejected with error message

## Testing Checklist

- [ ] Create order from cart
- [ ] Verify only platform_sell products can be ordered
- [ ] Test Razorpay checkout opens correctly
- [ ] Test payment with test card
- [ ] Verify payment signature
- [ ] Check order status updates to "paid"
- [ ] Verify stock is reduced after payment
- [ ] Verify cart is cleared after payment
- [ ] Test payment failure handling
- [ ] Test invalid signature rejection

## Next Steps

After payment integration:
1. Order management (seller view)
2. Order tracking
3. Refund handling (if needed)
4. Email notifications
5. Invoice generation
