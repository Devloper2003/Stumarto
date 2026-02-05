/**
 * Seed Script for Stumarto Database
 * Populates MongoDB with sample data for testing
 * 
 * Run: node seed.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { User, Product, Order, Cart, Review } = require('./models');

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI not set in .env');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Collections cleared');

    // Create admin user
    console.log('\n👤 Creating admin user...');
    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@stumarto.com',
      password: 'admin123',
      role: 'admin',
      location: 'Headquarters',
      phone: '1234567890',
      verified: true
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create seller users
    console.log('\n👥 Creating seller users...');
    const sellers = await User.create([
      {
        name: 'Tech Books Store',
        email: 'seller1@stumarto.com',
        password: 'seller123',
        role: 'seller',
        location: 'Mumbai',
        phone: '9876543210',
        verified: true
      },
      {
        name: 'Educational Materials Co',
        email: 'seller2@stumarto.com',
        password: 'seller123',
        role: 'seller',
        location: 'Delhi',
        phone: '9876543211',
        verified: true
      },
      {
        name: 'Study Resources Hub',
        email: 'seller3@stumarto.com',
        password: 'seller123',
        role: 'seller',
        location: 'Bangalore',
        phone: '9876543212',
        verified: true
      }
    ]);
    console.log(`✅ ${sellers.length} sellers created`);

    // Create buyer users
    console.log('\n🛍️ Creating buyer users...');
    const buyers = await User.create([
      {
        name: 'Rahul Kumar',
        email: 'buyer1@stumarto.com',
        password: 'buyer123',
        role: 'buyer',
        location: 'Pune',
        phone: '8765432109',
        verified: true
      },
      {
        name: 'Priya Singh',
        email: 'buyer2@stumarto.com',
        password: 'buyer123',
        role: 'buyer',
        location: 'Hyderabad',
        phone: '8765432108',
        verified: true
      },
      {
        name: 'Amit Patel',
        email: 'buyer3@stumarto.com',
        password: 'buyer123',
        role: 'buyer',
        location: 'Ahmedabad',
        phone: '8765432107',
        verified: true
      }
    ]);
    console.log(`✅ ${buyers.length} buyers created`);

    // Create products
    console.log('\n📚 Creating products...');
    const products = await Product.create([
      {
        name: 'Advanced Mathematics Textbook',
        description: 'Complete guide to advanced mathematics for class 12',
        category: 'Books',
        price: 599,
        seller: sellers[0]._id,
        image: 'https://via.placeholder.com/300x400?text=Math+Book',
        stock: 50,
        rating: 4.5,
        approved: true
      },
      {
        name: 'Physics Practical Kit',
        description: 'Complete practical kit for physics experiments',
        category: 'Lab Equipment',
        price: 1499,
        seller: sellers[1]._id,
        image: 'https://via.placeholder.com/300x400?text=Physics+Kit',
        stock: 20,
        rating: 4.7,
        approved: true
      },
      {
        name: 'Chemistry Guide & Notes',
        description: 'Comprehensive chemistry notes with diagrams',
        category: 'Books',
        price: 449,
        seller: sellers[0]._id,
        image: 'https://via.placeholder.com/300x400?text=Chemistry+Guide',
        stock: 75,
        rating: 4.3,
        approved: true
      },
      {
        name: 'English Literature Collection',
        description: '10 classic novels for English studies',
        category: 'Books',
        price: 899,
        seller: sellers[2]._id,
        image: 'https://via.placeholder.com/300x400?text=Literature',
        stock: 30,
        rating: 4.6,
        approved: true
      },
      {
        name: 'Biology Microscope Professional',
        description: 'Professional grade microscope for biology lab',
        category: 'Lab Equipment',
        price: 3999,
        seller: sellers[1]._id,
        image: 'https://via.placeholder.com/300x400?text=Microscope',
        stock: 5,
        rating: 4.8,
        approved: true
      },
      {
        name: 'History & Geography Atlas',
        description: 'Detailed world atlas with historical maps',
        category: 'Reference Books',
        price: 359,
        seller: sellers[2]._id,
        image: 'https://via.placeholder.com/300x400?text=Atlas',
        stock: 40,
        rating: 4.4,
        approved: true
      },
      {
        name: 'Computer Science Workbook',
        description: 'Coding exercises and problems for class 12',
        category: 'Books',
        price: 549,
        seller: sellers[0]._id,
        image: 'https://via.placeholder.com/300x400?text=CS+Book',
        stock: 60,
        rating: 4.5,
        approved: true
      },
      {
        name: 'Drawing & Sketching Tools Set',
        description: 'Professional quality drawing materials',
        category: 'Stationery',
        price: 299,
        seller: sellers[2]._id,
        image: 'https://via.placeholder.com/300x400?text=Drawing+Set',
        stock: 100,
        rating: 4.2,
        approved: true
      }
    ]);
    console.log(`✅ ${products.length} products created`);

    // Create reviews
    console.log('\n⭐ Creating reviews...');
    const reviews = await Review.create([
      {
        productId: products[0]._id,
        userId: buyers[0]._id,
        rating: 5,
        comment: 'Excellent book! Very helpful for exams. Highly recommend!',
        approved: true
      },
      {
        productId: products[0]._id,
        userId: buyers[1]._id,
        rating: 4,
        comment: 'Good content but a bit pricey',
        approved: true
      },
      {
        productId: products[1]._id,
        userId: buyers[2]._id,
        rating: 5,
        comment: 'Perfect lab kit! All equipment is working great.',
        approved: true
      },
      {
        productId: products[2]._id,
        userId: buyers[0]._id,
        rating: 4,
        comment: 'Very detailed notes, helped me understand chemistry better',
        approved: true
      },
      {
        productId: products[4]._id,
        userId: buyers[1]._id,
        rating: 5,
        comment: 'Professional grade microscope. Worth every penny!',
        approved: true
      }
    ]);
    console.log(`✅ ${reviews.length} reviews created`);

    // Create orders
    console.log('\n📦 Creating sample orders...');
    const orders = await Order.create([
      {
        userId: buyers[0]._id,
        products: [
          {
            productId: products[0]._id,
            quantity: 1,
            price: products[0].price
          }
        ],
        totalAmount: products[0].price,
        status: 'completed',
        paymentStatus: 'paid',
        shippingAddress: '123 Main St, Pune, 411001',
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        userId: buyers[1]._id,
        products: [
          {
            productId: products[1]._id,
            quantity: 1,
            price: products[1].price
          },
          {
            productId: products[2]._id,
            quantity: 2,
            price: products[2].price
          }
        ],
        totalAmount: products[1].price + (products[2].price * 2),
        status: 'processing',
        paymentStatus: 'paid',
        shippingAddress: '456 Park Ave, Hyderabad, 500001',
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: buyers[2]._id,
        products: [
          {
            productId: products[3]._id,
            quantity: 1,
            price: products[3].price
          }
        ],
        totalAmount: products[3].price,
        status: 'shipped',
        paymentStatus: 'paid',
        shippingAddress: '789 Oak Lane, Ahmedabad, 380001',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]);
    console.log(`✅ ${orders.length} orders created`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📊 Data Summary:');
    console.log(`  • Admin users: 1`);
    console.log(`  • Sellers: ${sellers.length}`);
    console.log(`  • Buyers: ${buyers.length}`);
    console.log(`  • Products: ${products.length}`);
    console.log(`  • Orders: ${orders.length}`);
    console.log(`  • Reviews: ${reviews.length}`);
    console.log('\n🔐 Test Credentials:');
    console.log('  Admin:   admin@stumarto.com / admin123');
    console.log('  Seller1: seller1@stumarto.com / seller123');
    console.log('  Buyer1:  buyer1@stumarto.com / buyer123');
    console.log('\n✅ Ready to run the application!');
    console.log('   Run: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
