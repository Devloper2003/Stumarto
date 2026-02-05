const jwt = require('jsonwebtoken');
const { User } = require('../models');

// @desc    Protect routes - verify JWT token
// @access  Private
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please provide a token.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Invalid or expired token.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error in authentication middleware',
      error: error.message
    });
  }
};

// @desc    Check user role
// @access  Private
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // First verify token
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. Please authenticate first.'
        });
      }

      // Get user from database
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user role is authorized
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role '${user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`
        });
      }

      // Attach user to request
      req.user.role = user.role;
      next();
    } catch (error) {
      console.error('Authorize middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error in authorization middleware',
        error: error.message
      });
    }
  };
};

// Convenience middleware for specific roles
const isAdmin = authorize('admin');
const isSeller = authorize('seller', 'admin');
const isUser = authorize('user', 'seller', 'admin');

module.exports = {
  protect,
  authorize,
  isAdmin,
  isSeller,
  isUser
};
