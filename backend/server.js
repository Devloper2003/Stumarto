const path = require('path');
// Always load env from backend/.env (prevents picking up root env files)
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { seedAdmin } = require('./utils/seedAdmin');

const app = express();

// CORS configuration for frontend domains
const corsOptions = {
  origin: [
    "https://stumarto.in",
    "https://www.stumarto.in",
    "https://stumarto.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Serve frontend static assets when present
const clientDist = path.join(__dirname, '..', 'dist');
const fs = require('fs');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  console.log('📦 Serving frontend from', clientDist);
}

// MongoDB Connection
let DB_CONNECTED = false;
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MongoDB connection error: MONGODB_URI is undefined');
      DB_CONNECTED = false;
      return;
    }

    // Log URI safely (no password)
    const safeMongoUri = mongoURI.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@)/i, '$1****$3');
    console.log(`🔐 MONGODB_URI: ${safeMongoUri}`);

    await mongoose.connect(mongoURI);
    DB_CONNECTED = true;
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    
    // Seed admin user in MongoDB
    try {
      const { User } = require('./models');
      await seedAdmin(User, null);
    } catch (seedErr) {
      console.error('Admin seeding error:', seedErr.message);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    DB_CONNECTED = false;
    console.warn('⚠️  Continuing without MongoDB. Running in Supabase/mock mode.');
  }
};

// Connect MongoDB
connectDB();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY;

let supabaseService = null;
if (supabaseUrl && supabaseKey) {
  supabaseService = require('./supabaseService');
  console.log('✅ Supabase Configured');
  const safeUrl = supabaseUrl.replace(/(.{10})[^/]*/g, '$1****');
  console.log(`📍 Supabase: ${safeUrl}`);
  
  // Seed admin user in Supabase
  (async () => {
    try {
      await seedAdmin(null, supabaseService);
    } catch (err) {
      console.warn('Supabase admin seeding warning:', err.message);
    }
  })();
} else {
  console.warn('⚠️  Supabase not configured. Using MongoDB/Mock mode.');
}

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'School Marketplace API is running!',
    timestamp: new Date().toISOString(),
    supabase: process.env.SUPABASE_URL ? '✅ Connected' : '⚠️ Not configured'
  });
});

// Auth Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Product Routes
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

// Cart Routes
const cartRoutes = require('./routes/cart.routes');
app.use('/api/cart', cartRoutes);

// Order Routes
const orderRoutes = require('./routes/order.routes');
app.use('/api/orders', orderRoutes);

// Admin Routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

// Payment Routes (Razorpay)
const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payments', paymentRoutes);

// Server
const PORT = process.env.PORT || 5000;

// Prefer explicit use of process.env.PORT so hosting platforms can bind correctly.
const listenPort = process.env.PORT || PORT;

app.listen(listenPort, () => {
  console.log(`🚀 Server is running on port ${listenPort}`);
  console.log(`📍 Test route: http://localhost:${listenPort}/`);
});

// If frontend is built, serve index.html for unmatched routes (SPA fallback)
const clientIndex = path.join(__dirname, '..', 'dist', 'index.html');
if (fs.existsSync(clientIndex)) {
  app.get('*', (req, res) => {
    // only handle non-API routes
    if (req.path.startsWith('/api/')) return res.status(404).json({ success: false, message: 'API route not found' });
    res.sendFile(clientIndex);
  });
}
