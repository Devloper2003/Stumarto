const { Cart, Product } = require('../models');

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is approved
    if (!product.approved) {
      return res.status(400).json({
        success: false,
        message: 'Product is not approved and cannot be added to cart'
      });
    }

    // CRITICAL: Only platform_sell products can be added to cart
    if (product.productType !== 'platform_sell') {
      return res.status(400).json({
        success: false,
        message: 'Only platform_sell products can be added to cart. This product is for direct selling.'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} item(s) available.`
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        userId,
        products: []
      });
    }

    // Check if product already exists in cart
    const existingProductIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // Update quantity
      const newQuantity = cart.products[existingProductIndex].quantity + quantity;
      
      // Check stock again with new quantity
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${product.stock} item(s) available.`
        });
      }

      cart.products[existingProductIndex].quantity = newQuantity;
    } else {
      // Add new product to cart
      cart.products.push({
        productId,
        quantity
      });
    }

    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'products.productId',
      select: 'title price images category productType approved stock'
    });

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product to cart',
      error: error.message
    });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    // Find cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart is empty or not found'
      });
    }

    // Find product in cart
    const productIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    // Remove product from cart
    cart.products.splice(productIndex, 1);
    await cart.save();

    // Populate remaining products
    await cart.populate({
      path: 'products.productId',
      select: 'title price images category productType approved stock'
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from cart successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing product from cart',
      error: error.message
    });
  }
};

// @desc    Update product quantity in cart
// @route   PATCH /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find product in cart
    const productIndex = cart.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} item(s) available.`
      });
    }

    // Update quantity
    cart.products[productIndex].quantity = quantity;
    await cart.save();

    // Populate product details
    await cart.populate({
      path: 'products.productId',
      select: 'title price images category productType approved stock'
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find cart
    let cart = await Cart.findOne({ userId });

    // If cart doesn't exist, create empty cart
    if (!cart) {
      cart = await Cart.create({
        userId,
        products: []
      });
    }

    // Populate product details
    await cart.populate({
      path: 'products.productId',
      select: 'title description price images category productType approved stock condition sellerId',
      populate: {
        path: 'sellerId',
        select: 'name email location'
      }
    });

    // Calculate totals
    let totalAmount = 0;
    let totalItems = 0;

    cart.products.forEach(item => {
      if (item.productId && item.productId.approved) {
        totalAmount += item.productId.price * item.quantity;
        totalItems += item.quantity;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        cart,
        summary: {
          totalItems,
          totalAmount: totalAmount.toFixed(2),
          itemCount: cart.products.length
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart is already empty'
      });
    }

    cart.products = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: { cart }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart
};
