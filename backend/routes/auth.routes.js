const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Private routes (require authentication)
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);

module.exports = router;
