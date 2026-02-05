const express = require('express');
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

// All cart routes require authentication
router.use(protect);

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', getCart);

// @route   POST /api/cart
// @desc    Add product to cart
// @access  Private
router.post('/', addToCart);

// @route   PATCH /api/cart/:productId
// @desc    Update product quantity in cart
// @access  Private
router.patch('/:productId', updateCartItem);

// @route   DELETE /api/cart/:productId
// @desc    Remove product from cart
// @access  Private
router.delete('/:productId', removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', clearCart);

module.exports = router;
