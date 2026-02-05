const { Order, Cart, Product } = require('../models');
const Razorpay = require('razorpay');
const crypto = require('crypto');

function isMockPaymentsEnabled() {
  // If user doesn't have Razorpay account/keys yet, we auto-fallback to mock mode.
  // You can also force it explicitly with PAYMENT_MODE=mock.
  return (
    (process.env.PAYMENT_MODE || '').toLowerCase() === 'mock' ||
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  );
}

function getRazorpayClient() {
  if (isMockPaymentsEnabled()) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Add products to cart before creating order.'
      });
    }

    // Validate all products are platform_sell and approved
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.productId;

      // Check if product exists
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found in cart`
        });
      }

      // CRITICAL: Only platform_sell products can be ordered
      if (product.productType !== 'platform_sell') {
        return res.status(400).json({
          success: false,
          message: `Product "${product.title}" is a direct_sell product and cannot be ordered through the platform.`
        });
      }

      // Check if product is approved
      if (!product.approved) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.title}" is not approved and cannot be ordered.`
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Only ${product.stock} item(s) available.`
        });
      }

      // Add to order items
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        title: product.title
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid products to order'
      });
    }

    // Create order in database (pending payment)
    const order = await Order.create({
      userId,
      products: orderItems,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingAddress: shippingAddress || '',
      paymentMethod: 'online'
    });

    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order (or mock order if keys not available)
    let razorpayOrder;
    if (isMockPaymentsEnabled()) {
      razorpayOrder = {
        id: `mock_order_${order._id}`,
        amount: amountInPaise,
        currency: 'INR',
        receipt: `order_${order._id}`,
      };
    } else {
      const razorpay = getRazorpayClient();
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise, // paise
        currency: 'INR',
        receipt: `order_${order._id}`,
        notes: {
          orderId: order._id.toString(),
          userId: userId.toString(),
        },
      });
    }

    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully. Please proceed with payment.',
      data: {
        order: {
          _id: order._id,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          products: order.products,
          createdAt: order.createdAt
        },
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt
        },
        // Frontend needs this for Razorpay checkout.
        // In mock mode it can be any string (frontend won't be able to open Razorpay checkout without script),
        // but you can still complete the flow by calling verify-payment in mock mode.
        key: process.env.RAZORPAY_KEY_ID || 'mock_key',
        paymentMode: isMockPaymentsEnabled() ? 'mock' : 'razorpay'
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Verify payment and update order
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, mockPaymentId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to verify this order'
      });
    }

    if (isMockPaymentsEnabled()) {
      // MOCK MODE: no Razorpay account/keys needed.
      // Mark payment as paid with a generated mock payment id.
      const mockPayId = mockPaymentId || `mock_pay_${Date.now()}`;
      order.paymentStatus = 'paid';
      order.razorpayOrderId = order.razorpayOrderId || `mock_order_${order._id}`;
      order.razorpayPaymentId = mockPayId;
      order.razorpaySignature = 'mock_signature';
      order.transactionId = mockPayId;
      order.orderStatus = 'processing';
      await order.save();
    } else {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: 'Missing payment verification details'
        });
      }

      // Verify Razorpay signature
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        // Payment verification failed
        order.paymentStatus = 'failed';
        await order.save();

        return res.status(400).json({
          success: false,
          message: 'Payment verification failed. Invalid signature.'
        });
      }

      // Payment verified successfully
      order.paymentStatus = 'paid';
      order.razorpayOrderId = razorpayOrderId;
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      order.transactionId = razorpayPaymentId;
      order.orderStatus = 'processing';
      await order.save();
    }

    // Update product stock
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Clear user's cart after successful payment
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (cart) {
      cart.products = [];
      await cart.save();
    }

    // Populate order details
    await order.populate('products.productId', 'title images category');
    await order.populate('userId', 'name email location');

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentStatus, orderStatus, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { userId };

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('products.productId', 'title images category productType')
      .populate('userId', 'name email location')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: { orders }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.productId', 'title description images category productType')
      .populate('userId', 'name email location');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.userId._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById
};
