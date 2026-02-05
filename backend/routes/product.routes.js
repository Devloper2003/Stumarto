const express = require('express');
const router = express.Router();
const {
  addProduct,
  getApprovedProducts,
  getProductById,
  approveProduct,
  getMyProducts,
  getPendingProducts
} = require('../controllers/product.controller');
const { protect, isAdmin, isSeller } = require('../middleware/auth.middleware');

// Public routes
// @route   GET /api/products
// @desc    Get approved products with filters (category, location, productType)
// @access  Public
router.get('/', getApprovedProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// Seller routes
// @route   POST /api/products
// @desc    Add a new product
// @access  Private (Seller only)
router.post('/', protect, isSeller, addProduct);

// @route   GET /api/products/seller/my-products
// @desc    Get seller's own products
// @access  Private (Seller only)
router.get('/seller/my-products', protect, isSeller, getMyProducts);

// Admin routes
// @route   PATCH /api/products/:id/approve
// @desc    Admin approve product
// @access  Private (Admin only)
router.patch('/:id/approve', protect, isAdmin, approveProduct);

// @route   PATCH /api/products/:id
// @desc    Admin update product
// @access  Private (Admin only)
router.patch('/:id', protect, isAdmin, require('../controllers/product.controller').updateProduct);

// @route   DELETE /api/products/:id
// @desc    Admin delete product
// @access  Private (Admin only)
router.delete('/:id', protect, isAdmin, require('../controllers/product.controller').deleteProduct);

// @route   GET /api/products/admin/pending
// @desc    Get all pending products for approval
// @access  Private (Admin only)
router.get('/admin/pending', protect, isAdmin, getPendingProducts);

module.exports = router;
