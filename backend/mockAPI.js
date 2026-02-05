// Mock API data for development when MongoDB is unavailable
const mockUsers = [
  {
    _id: 'admin_001',
    name: 'Platform Admin',
    email: 'admin@stumarto.com',
    password: 'admin123',
    role: 'admin',
    location: 'Headquarters',
    createdAt: new Date('2024-01-01')
  },
  {
    _id: 'seller_001',
    name: 'Anita Sharma',
    email: 'anita@example.com',
    password: 'pass123',
    role: 'seller',
    location: 'Delhi',
    createdAt: new Date('2024-01-15')
  },
  {
    _id: 'buyer_001',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'pass123',
    role: 'buyer',
    location: 'Mumbai',
    createdAt: new Date('2024-02-01')
  }
];

const mockProducts = [
  {
    _id: 'prod_001',
    name: 'DPS School Uniform (Grade 5)',
    description: 'Complete set with blazer, skirt, and tie. Excellent condition.',
    price: 1200,
    category: 'UNIFORM',
    condition: 'USED',
    productType: 'DIRECT_SELL',
    imageUrl: 'https://picsum.photos/seed/uniform1/400/400',
    sellerId: 'seller_001',
    sellerName: 'Anita Sharma',
    location: 'Delhi',
    pincode: '110001',
    approved: true,
    createdAt: new Date('2024-01-15'),
    reviews: []
  },
  {
    _id: 'prod_002',
    name: 'Mathematics NCERT Class 10',
    description: 'Latest edition, brand new with plastic wrap.',
    price: 350,
    category: 'BOOKS',
    condition: 'NEW',
    productType: 'PLATFORM_SELL',
    imageUrl: 'https://picsum.photos/seed/book1/400/400',
    sellerId: 'seller_001',
    sellerName: 'Anita Sharma',
    location: 'Delhi',
    pincode: '110001',
    approved: true,
    createdAt: new Date('2024-01-20'),
    reviews: []
  },
  {
    _id: 'prod_003',
    name: 'Skybag Durable School Bag',
    description: 'Waterproof, 3 compartments, ergonomic design.',
    price: 899,
    category: 'BAGS',
    condition: 'NEW',
    productType: 'PLATFORM_SELL',
    imageUrl: 'https://picsum.photos/seed/bag1/400/400',
    sellerId: 'seller_001',
    sellerName: 'Anita Sharma',
    location: 'Delhi',
    pincode: '110001',
    approved: true,
    createdAt: new Date('2024-01-25'),
    reviews: []
  }
];

const mockOrders = [
  {
    _id: 'order_001',
    userId: 'buyer_001',
    items: [
      { productId: 'prod_001', quantity: 1, price: 1200 }
    ],
    totalAmount: 1200,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    createdAt: new Date('2024-02-01')
  }
];

const mockCart = {
  'buyer_001': {
    items: [
      { productId: 'prod_002', quantity: 1 }
    ]
  }
};

module.exports = {
  mockUsers,
  mockProducts,
  mockOrders,
  mockCart
};
