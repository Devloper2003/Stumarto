const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

// All order routes require authentication
router.use(protect);

// @route   POST /api/orders
// @desc    Create order from cart
// @access  Private
router.post('/', createOrder);

// @route   POST /api/orders/verify-payment
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify-payment', verifyPayment);

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', getOrderById);

module.exports = router;
