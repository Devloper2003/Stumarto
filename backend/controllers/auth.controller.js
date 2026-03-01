const { User } = require('../models');
const jwt = require('jsonwebtoken');
const mockDB = require('../mockDB');

// Mock users for degraded mode
const MOCK_USERS = {
  'admin@stumarto.com': { _id: '1', name: 'Admin User', email: 'admin@stumarto.com', password: 'admin123', role: 'admin' },
  'seller@stumarto.com': { _id: '2', name: 'Test Seller', email: 'seller@stumarto.com', password: 'seller123', role: 'seller' },
  'user@stumarto.com': { _id: '3', name: 'Regular User', email: 'user@stumarto.com', password: 'user123', role: 'user' },
};

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate role if provided
    if (role && !['user', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user, seller, or admin'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      location: location || ''
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Try real MongoDB first
    let user = null;
    try {
      user = await User.findOne({ email }).select('+password');
    } catch (dbErr) {
      console.warn('Database unavailable, using mock mode for login:', dbErr.message);
      user = null;
    }

    // Fallback to mock users if DB fails
    if (!user) {
      const mockUser = MOCK_USERS[email.toLowerCase()];
      if (mockUser && mockUser.password === password) {
        const token = generateToken(mockUser._id);
        console.log(`✅ Mock login successful for: ${email}`);
        return res.status(200).json({
          success: true,
          message: 'Login successful (mock mode)',
          data: {
            user: {
              _id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email,
              role: mockUser.role,
              location: 'Mock Mode'
            },
            token
          }
        });
      }
      console.warn(`❌ Login failed: Invalid credentials for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Real DB user - check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.warn(`❌ Login failed: Invalid password for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      createdAt: user.createdAt
    };

    console.log(`✅ Database login successful for: ${email} (${user.role})`);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
