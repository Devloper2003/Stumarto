const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  title: {
    type: String,
    required: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  products: {
    type: [orderItemSchema],
    required: [true, 'Products are required'],
    validate: {
      validator: function(products) {
        return products.length > 0;
      },
      message: 'Order must have at least one product'
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    type: String,
    trim: true,
    default: ''
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'online', 'wallet'],
    default: 'cash_on_delivery'
  },
  transactionId: {
    type: String,
    trim: true,
    default: ''
  },
  razorpayOrderId: {
    type: String,
    trim: true,
    default: ''
  },
  razorpayPaymentId: {
    type: String,
    trim: true,
    default: ''
  },
  razorpaySignature: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ userId: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Method to calculate total amount (if needed to recalculate)
orderSchema.methods.calculateTotal = function() {
  return this.products.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

module.exports = mongoose.model('Order', orderSchema);
