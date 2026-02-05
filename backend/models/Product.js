const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['uniforms', 'books', 'bags', 'shoes', 'stationery', 'other'],
    lowercase: true
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(images) {
        return images.length <= 10; // Maximum 10 images
      },
      message: 'Cannot have more than 10 images'
    }
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['direct_sell', 'platform_sell'],
    default: 'direct_sell'
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID is required']
  },
  approved: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 1,
    min: [0, 'Stock cannot be negative']
  },
  condition: {
    type: String,
    enum: ['new', 'like_new', 'good', 'fair'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ approved: 1 });
productSchema.index({ productType: 1 });

module.exports = mongoose.model('Product', productSchema);
