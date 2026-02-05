const path = require('path');
// Always load env from backend/.env (prevents picking up root env files)
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets when present (production / hosting)
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
    // Seed admin user if configured
    try {
      const { User } = require('./models');
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminEmail && adminPassword) {
        const existing = await User.findOne({ email: adminEmail.toLowerCase() });
        if (!existing) {
          await User.create({
            name: 'Platform Admin',
            email: adminEmail.toLowerCase(),
            password: adminPassword,
            role: 'admin',
            location: 'Headquarters'
          });
          console.log(`🔐 Admin seeded: ${adminEmail}`);
        } else {
          console.log(`🔐 Admin exists: ${adminEmail}`);
        }
      }
    } catch (seedErr) {
      console.error('Admin seeding error:', seedErr && seedErr.message ? seedErr.message : seedErr);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    DB_CONNECTED = false;
    console.warn('⚠️  Continuing without MongoDB connection. Server will run in degraded/mock mode.');
    console.info('💡 Mock in-memory database is available at ./mockDB.js for testing.');
    // Do not exit process; allow server to start for frontend/demo work
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'School Marketplace API is running!',
    timestamp: new Date().toISOString()
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
