const { Product, User } = require('../models');
const { mockProducts } = require('../mockAPI');

// @desc    Add a new product
// @route   POST /api/products
// @access  Private (Seller only)
const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, images, location, productType, stock, condition } = req.body;

    // Validation
    if (!title || !description || !price || !category || !productType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, price, category, and productType'
      });
    }

    // Validate productType
    if (!['direct_sell', 'platform_sell'].includes(productType)) {
      return res.status(400).json({
        success: false,
        message: 'productType must be either "direct_sell" or "platform_sell"'
      });
    }

    // Validate category
    const validCategories = ['uniforms', 'books', 'bags', 'shoes', 'stationery', 'other'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Create product (unapproved by default)
    const product = await Product.create({
      title,
      description,
      price,
      category: category.toLowerCase(),
      images: images || [],
      location: location || '',
      productType,
      sellerId: req.user.userId,
      approved: false, // Products need admin approval
      stock: stock || 1,
      condition: condition || 'new'
    });

    // Populate seller info
    await product.populate('sellerId', 'name email location');

    res.status(201).json({
      success: true,
      message: 'Product created successfully. Waiting for admin approval.',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Get approved products with filters
// @route   GET /api/products
// @access  Public
const getApprovedProducts = async (req, res) => {
  try {
    const { category, location, productType, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    // Try to use real database first
    try {
      // Build query - only approved products
      const query = { approved: true };

      // Filter by category
      if (category) {
        query.category = category.toLowerCase();
      }

      // Filter by location (case-insensitive partial match)
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }

      // Filter by productType
      if (productType) {
        if (!['direct_sell', 'platform_sell'].includes(productType)) {
          return res.status(400).json({
            success: false,
            message: 'productType must be either "direct_sell" or "platform_sell"'
          });
        }
        query.productType = productType;
      }

      // Pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Execute query
      const products = await Product.find(query)
        .populate('sellerId', 'name email location')
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const total = await Product.countDocuments(query);

      return res.status(200).json({
        success: true,
        count: products.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        data: {
          products
        }
      });
    } catch (dbError) {
      // Fall back to mock data if DB is unavailable
      console.warn('Database unavailable, serving mock products');
      
      let filteredProducts = [...mockProducts];

      // Apply filters to mock data
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (location) {
        filteredProducts = filteredProducts.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
      }
      if (productType) {
        filteredProducts = filteredProducts.filter(p => p.productType === productType);
      }

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      const skip = (pageNum - 1) * limitNum;
      const paginatedProducts = filteredProducts.slice(skip, skip + limitNum);

      return res.status(200).json({
        success: true,
        count: paginatedProducts.length,
        total: filteredProducts.length,
        page: pageNum,
        pages: Math.ceil(filteredProducts.length / limitNum),
        data: {
          products: paginatedProducts
        }
      });
    }
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // Try real database first
    try {
      const product = await Product.findById(req.params.id)
        .populate('sellerId', 'name email location');

      if (!product) {
        throw new Error('Product not found in DB');
      }

      // Only return approved products to public, or if user is seller/admin, show their own products
      if (!product.approved && req.user) {
        const user = await User.findById(req.user.userId);
        if (user && (user.role === 'admin' || product.sellerId._id.toString() === req.user.userId)) {
          // Allow seller to see their own unapproved products, admin can see all
          return res.status(200).json({
            success: true,
            data: { product }
          });
        }
      }

      if (!product.approved) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: { product }
      });
    } catch (dbError) {
      // Fall back to mock data
      console.warn('Database unavailable, serving mock product');
      const mockProduct = mockProducts.find(p => p._id === req.params.id);
      
      if (!mockProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: { product: mockProduct }
      });
    }
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Admin approve product
// @route   PATCH /api/products/:id/approve
// @access  Private (Admin only)
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.approved) {
      return res.status(400).json({
        success: false,
        message: 'Product is already approved'
      });
    }

    product.approved = true;
    await product.save();

    await product.populate('sellerId', 'name email location');

    res.status(200).json({
      success: true,
      message: 'Product approved successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving product',
      error: error.message
    });
  }
};

// @desc    Get seller's own products
// @route   GET /api/products/seller/my-products
// @access  Private (Seller only)
const getMyProducts = async (req, res) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;

    const query = { sellerId: req.user.userId };

    // Filter by approval status if provided
    if (approved !== undefined) {
      query.approved = approved === 'true';
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .populate('sellerId', 'name email location')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your products',
      error: error.message
    });
  }
};

// @desc    Get pending products (Admin only)
// @route   GET /api/products/admin/pending
// @access  Private (Admin only)
const getPendingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const query = { approved: false };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .populate('sellerId', 'name email location')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get pending products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending products',
      error: error.message
    });
  }
};

// @desc    Update a product (Admin only)
// @route   PATCH /api/products/:id
// @access  Private (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Apply updates from body
    Object.keys(req.body).forEach(key => {
      // prevent changing sellerId unintentionally
      if (key === 'sellerId') return;
      product[key] = req.body[key];
    });

    await product.save();
    await product.populate('sellerId', 'name email location');

    res.status(200).json({ success: true, message: 'Product updated', data: { product } });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.remove();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};

module.exports = {
  addProduct,
  getApprovedProducts,
  getProductById,
  approveProduct,
  getMyProducts,
  getPendingProducts
  ,updateProduct, deleteProduct
};
