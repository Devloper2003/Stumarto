const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabaseService = require('../supabaseService');
const crypto = require('crypto');

// Mock users for degraded mode (hashed passwords)
const MOCK_USERS = {
  'admin@stumarto.com': { _id: '1', name: 'Admin User', email: 'admin@stumarto.com', password: '$2a$10$YjY0dXg3elVJaFp6TFNZcOyRWXoC0ynkC1L75Q3L3QW7D5Q5M2XAG', role: 'admin' },
  'seller@stumarto.com': { _id: '2', name: 'Test Seller', email: 'seller@stumarto.com', password: '$2a$10$YjY0dXg3elVJaFp6TFNZcOyRWXoC0ynkC1L75Q3L3QW7D5Q5M2XAG', role: 'seller' },
  'user@stumarto.com': { _id: '3', name: 'Regular User', email: 'user@stumarto.com', password: '$2a$10$YjY0dXg3elVJaFp6TFNZcOyRWXoC0ynkC1L75Q3L3QW7D5Q5M2XAG', role: 'user' },
};

// In-memory password reset tokens
const resetTokens = new Map();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate password reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
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

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // If Supabase is configured, use it instead of MongoDB
    if (process.env.SUPABASE_URL) {
      // Validate role if provided
      if (role && !['user', 'seller', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role. Must be user, seller, or admin' });
      }

      const existing = await supabaseService.getUser(email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const created = await supabaseService.createUser({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashed,
        role: role || 'user',
        location: location || ''
      });

      const token = generateToken(created.id || created._id || created.ID);
      const userResponse = {
        _id: created.id || created._id || created.ID,
        name: created.name,
        email: created.email,
        role: created.role,
        location: created.location,
        createdAt: created.created_at || created.createdAt
      };

      return res.status(201).json({ success: true, message: 'User registered successfully', data: { user: userResponse, token } });
    }

    // Fallback: MongoDB path
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
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
      name: name.trim(),
      email: email.toLowerCase(),
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
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
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

    // If Supabase configured, try it first
    if (process.env.SUPABASE_URL) {
      try {
        let sbUser = await supabaseService.getUser(email.toLowerCase());
        if (sbUser) {
          const passwordMatch = await bcrypt.compare(password, sbUser.password || '');
          if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
          }

          const token = generateToken(sbUser.id || sbUser._id || sbUser.ID);
          return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
              user: {
                _id: sbUser.id || sbUser._id || sbUser.ID,
                name: sbUser.name,
                email: sbUser.email,
                role: sbUser.role,
                location: sbUser.location || ''
              },
              token
            }
          });
        }
      } catch (err) {
        console.warn('Supabase unavailable for login:', err.message);
      }
    }

    // Try real MongoDB
    try {
      let user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (user) {
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }

        const token = generateToken(user._id);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              location: user.location
            },
            token
          }
        });
      }
    } catch (dbErr) {
      console.warn('Database unavailable for login:', dbErr.message);
    }

    // Fallback to mock users if DB fails
    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (mockUser) {
      const passwordMatch = await bcrypt.compare(password, mockUser.password);
      if (passwordMatch) {
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
    }

    console.warn(`❌ Login failed: Invalid credentials for ${email}`);
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
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
    // If Supabase configured, use it
    if (process.env.SUPABASE_URL) {
      const sbUser = await supabaseService.getUserById(req.user.userId);
      if (!sbUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const userResponse = {
        _id: sbUser.id || sbUser._id || sbUser.ID,
        name: sbUser.name,
        email: sbUser.email,
        role: sbUser.role,
        location: sbUser.location || '',
        createdAt: sbUser.created_at || sbUser.createdAt,
        updatedAt: sbUser.updated_at || sbUser.updatedAt
      };
      return res.status(200).json({ success: true, data: { user: userResponse } });
    }

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
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Forgot password - request reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    // Check if user exists
    let userExists = false;
    if (process.env.SUPABASE_URL) {
      const sbUser = await supabaseService.getUser(email.toLowerCase());
      userExists = !!sbUser;
    } else {
      const user = await User.findOne({ email: email.toLowerCase() });
      userExists = !!user;
    }

    // Always return success for security (don't reveal if email exists)
    if (!userExists) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive reset instructions'
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const resetExpires = Date.now() + 3600000; // 1 hour

    // Store reset token
    resetTokens.set(resetTokenHash, {
      email: email.toLowerCase(),
      expires: resetExpires
    });

    // In production, send email with reset link
    console.log(`🔑 Password reset token for ${email}: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent',
      // Only for development
      ...(process.env.NODE_ENV === 'development' && { token: resetToken })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing password reset request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reset token and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Find matching reset token
    let resetData = null;
    let foundTokenHash = null;

    for (const [hash, data] of resetTokens.entries()) {
      if (data.expires > Date.now()) {
        const isMatch = await bcrypt.compare(token, hash);
        if (isMatch) {
          resetData = data;
          foundTokenHash = hash;
          break;
        }
      } else {
        resetTokens.delete(hash);
      }
    }

    if (!resetData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (process.env.SUPABASE_URL) {
      await supabaseService.updateUser(resetData.email, {
        password: hashedPassword
      });
    } else {
      const user = await User.findOne({ email: resetData.email });
      if (user) {
        user.password = newPassword;
        await user.save();
      }
    }

    resetTokens.delete(foundTokenHash);

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Change password (authenticated user)
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    if (process.env.SUPABASE_URL) {
      const user = await supabaseService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await supabaseService.updateUser(userId, { password: hashedPassword });

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword
};
