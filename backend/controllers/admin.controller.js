const mockDB = require('../mockDB');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = mockDB.users?.getAll?.() || [];
    res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const users = mockDB.users?.getAll?.() || [];
    const user = users.find(u => u._id === id || u.id === id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (role) user.role = role;
    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = mockDB.users?.getAll?.() || [];
    const idx = users.findIndex(u => u._id === id || u.id === id);
    if (idx >= 0) users.splice(idx, 1);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = mockDB.reviews?.getAll?.() || [];
    res.json({ success: true, data: { reviews } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add review
const addReview = async (req, res) => {
  try {
    const { productId, rating, text, userName } = req.body;
    const review = {
      _id: Date.now().toString(),
      productId,
      rating,
      text,
      userName,
      date: new Date()
    };
    if (!mockDB.reviews) mockDB.reviews = { _list: [] };
    if (!mockDB.reviews._list) mockDB.reviews._list = [];
    mockDB.reviews._list.push(review);
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (mockDB.reviews?._list) {
      const idx = mockDB.reviews._list.findIndex(r => r._id === id);
      if (idx >= 0) mockDB.reviews._list.splice(idx, 1);
    }
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bank details
const getBankDetails = async (req, res) => {
  try {
    const banks = mockDB.bankDetails?._list || [];
    res.json({ success: true, data: { banks } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add bank details
const addBankDetails = async (req, res) => {
  try {
    const { sellerId, accountHolder, bankName, accountNumber, ifsc } = req.body;
    const bank = {
      _id: Date.now().toString(),
      sellerId,
      accountHolder,
      bankName,
      accountNumber,
      ifsc,
      verified: false
    };
    if (!mockDB.bankDetails) mockDB.bankDetails = { _list: [] };
    if (!mockDB.bankDetails._list) mockDB.bankDetails._list = [];
    mockDB.bankDetails._list.push(bank);
    res.json({ success: true, data: bank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update bank details
const updateBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (mockDB.bankDetails?._list) {
      const bank = mockDB.bankDetails._list.find(b => b._id === id);
      if (bank) Object.assign(bank, req.body);
    }
    res.json({ success: true, message: 'Bank details updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete bank details
const deleteBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (mockDB.bankDetails?._list) {
      const idx = mockDB.bankDetails._list.findIndex(b => b._id === id);
      if (idx >= 0) mockDB.bankDetails._list.splice(idx, 1);
    }
    res.json({ success: true, message: 'Bank details deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = mockDB.coupons?._list || [];
    res.json({ success: true, data: { coupons } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add coupon
const addCoupon = async (req, res) => {
  try {
    const { code, discount, minPurchase, expiryDate } = req.body;
    const coupon = {
      _id: Date.now().toString(),
      code,
      discount,
      minPurchase,
      expiryDate,
      usageCount: 0,
      maxUsage: 100
    };
    if (!mockDB.coupons) mockDB.coupons = { _list: [] };
    if (!mockDB.coupons._list) mockDB.coupons._list = [];
    mockDB.coupons._list.push(coupon);
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    if (mockDB.coupons?._list) {
      const coupon = mockDB.coupons._list.find(c => c._id === id);
      if (coupon) Object.assign(coupon, req.body);
    }
    res.json({ success: true, message: 'Coupon updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    if (mockDB.coupons?._list) {
      const idx = mockDB.coupons._list.findIndex(c => c._id === id);
      if (idx >= 0) mockDB.coupons._list.splice(idx, 1);
    }
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = mockDB.blogs?._list || [];
    res.json({ success: true, data: { blogs } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add blog
const addBlog = async (req, res) => {
  try {
    const { title, content, author, date } = req.body;
    const blog = {
      _id: Date.now().toString(),
      title,
      content,
      author,
      date: date || new Date(),
      published: false
    };
    if (!mockDB.blogs) mockDB.blogs = { _list: [] };
    if (!mockDB.blogs._list) mockDB.blogs._list = [];
    mockDB.blogs._list.push(blog);
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (mockDB.blogs?._list) {
      const blog = mockDB.blogs._list.find(b => b._id === id);
      if (blog) Object.assign(blog, req.body);
    }
    res.json({ success: true, message: 'Blog updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (mockDB.blogs?._list) {
      const idx = mockDB.blogs._list.findIndex(b => b._id === id);
      if (idx >= 0) mockDB.blogs._list.splice(idx, 1);
    }
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers, updateUser, deleteUser,
  getReviews, addReview, deleteReview,
  getBankDetails, addBankDetails, updateBankDetails, deleteBankDetails,
  getCoupons, addCoupon, updateCoupon, deleteCoupon,
  getBlogs, addBlog, updateBlog, deleteBlog
};
