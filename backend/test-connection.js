/**
 * Quick MongoDB Atlas Connection Test
 * Verifies the connection to your MongoDB cluster
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  MongoDB Atlas Connection Test              ║');
    console.log('╚════════════════════════════════════════════╝\n');
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI not set in .env');
      process.exit(1);
    }

    // Log connection info (safely)
    const safeURI = mongoURI.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@)/i, '$1****$3');
    console.log('🔗 Connection String:', safeURI);
    console.log('⏳ Connecting to MongoDB Atlas...\n');

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });

    console.log('✅ CONNECTION SUCCESSFUL!\n');
    console.log('📊 Database Details:');
    console.log('  • Database Name:', mongoose.connection.name);
    console.log('  • Host:', mongoose.connection.host);
    console.log('  • State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('  • Collections:', Object.keys(mongoose.connection.collections).join(', ') || 'None yet');

    console.log('\n✨ Your MongoDB Atlas cluster is ready!\n');
    console.log('Next steps:');
    console.log('  1. Run: node seed.js');
    console.log('  2. Then: npm run dev');
    console.log('  3. Open: http://localhost:3001\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Connection Failed!\n');
    console.error('Error:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('  1. Check your internet connection');
    console.error('  2. Verify credentials in backend/.env');
    console.error('  3. Check IP address is whitelisted in MongoDB Atlas');
    console.error('  4. Wait a moment and try again\n');
    process.exit(1);
  }
};

testConnection();
