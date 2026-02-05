const express = require('express');
const router = express.Router();
const {
  getUsers, updateUser, deleteUser,
  getReviews, addReview, deleteReview,
  getBankDetails, addBankDetails, updateBankDetails, deleteBankDetails,
  getCoupons, addCoupon, updateCoupon, deleteCoupon,
  getBlogs, addBlog, updateBlog, deleteBlog
} = require('../controllers/admin.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// Users
router.get('/users', protect, isAdmin, getUsers);
router.patch('/users/:id', protect, isAdmin, updateUser);
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Reviews
router.get('/reviews', protect, isAdmin, getReviews);
router.post('/reviews', protect, isAdmin, addReview);
router.delete('/reviews/:id', protect, isAdmin, deleteReview);

// Bank Details
router.get('/bank-details', protect, isAdmin, getBankDetails);
router.post('/bank-details', protect, isAdmin, addBankDetails);
router.patch('/bank-details/:id', protect, isAdmin, updateBankDetails);
router.delete('/bank-details/:id', protect, isAdmin, deleteBankDetails);

// Coupons
router.get('/coupons', protect, isAdmin, getCoupons);
router.post('/coupons', protect, isAdmin, addCoupon);
router.patch('/coupons/:id', protect, isAdmin, updateCoupon);
router.delete('/coupons/:id', protect, isAdmin, deleteCoupon);

// Blogs
router.get('/blogs', protect, isAdmin, getBlogs);
router.post('/blogs', protect, isAdmin, addBlog);
router.patch('/blogs/:id', protect, isAdmin, updateBlog);
router.delete('/blogs/:id', protect, isAdmin, deleteBlog);

module.exports = router;
