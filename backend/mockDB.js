/**
 * In-Memory Mock Database for Development/Testing
 * When MongoDB is unavailable, this provides a simple in-memory store
 */

const mockDB = {
  users: [
    {
      _id: '1',
      name: 'Admin User',
      email: 'admin@stumarto.com',
      password: 'hashed_password', // In real app, this would be bcrypt hashed
      role: 'admin',
      createdAt: new Date(),
    },
    {
      _id: '2',
      name: 'Test Seller',
      email: 'seller@stumarto.com',
      password: 'hashed_password',
      role: 'seller',
      createdAt: new Date(),
    },
  ],
  products: [
    {
      _id: '1',
      name: 'Eco-friendly Water Bottle',
      price: 299,
      description: 'Sustainable water bottle made from recycled materials',
      category: 'Sustainability',
      condition: 'NEW',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7e406cab6869?w=400',
      sellerName: 'Test Seller',
      sellerId: '2',
      approved: true,
      createdAt: new Date(),
    },
    {
      _id: '2',
      name: 'Second Hand Textbook',
      price: 150,
      description: 'Economics textbook, lightly used',
      category: 'Books',
      condition: 'USED',
      imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
      sellerName: 'Test Seller',
      sellerId: '2',
      approved: true,
      createdAt: new Date(),
    },
  ],
  carts: [],
  orders: [],
};

// Simple ID generator
let idCounter = 100;
const generateId = () => String(++idCounter);

module.exports = {
  mockDB,
  generateId,

  // User methods
  async findUser(query) {
    const key = Object.keys(query)[0];
    const value = query[key];
    return mockDB.users.find(u => u[key] === value);
  },

  async createUser(userData) {
    const user = {
      _id: generateId(),
      ...userData,
      createdAt: new Date(),
    };
    mockDB.users.push(user);
    return user;
  },

  async findAllUsers() {
    return mockDB.users;
  },

  async updateUser(id, updates) {
    const user = mockDB.users.find(u => u._id === id);
    if (user) {
      Object.assign(user, updates);
    }
    return user;
  },

  async deleteUser(id) {
    const index = mockDB.users.findIndex(u => u._id === id);
    if (index > -1) {
      mockDB.users.splice(index, 1);
      return true;
    }
    return false;
  },

  // Product methods
  async findProduct(query) {
    const key = Object.keys(query)[0];
    const value = query[key];
    return mockDB.products.find(p => p[key] === value);
  },

  async findAllProducts(filter = {}) {
    let results = mockDB.products;
    if (filter.approved !== undefined) {
      results = results.filter(p => p.approved === filter.approved);
    }
    if (filter.condition) {
      results = results.filter(p => p.condition === filter.condition);
    }
    if (filter.category) {
      results = results.filter(p => p.category === filter.category);
    }
    return results;
  },

  async createProduct(productData) {
    const product = {
      _id: generateId(),
      ...productData,
      createdAt: new Date(),
      approved: false,
    };
    mockDB.products.push(product);
    return product;
  },

  async updateProduct(id, updates) {
    const product = mockDB.products.find(p => p._id === id);
    if (product) {
      Object.assign(product, updates);
    }
    return product;
  },

  async deleteProduct(id) {
    const index = mockDB.products.findIndex(p => p._id === id);
    if (index > -1) {
      mockDB.products.splice(index, 1);
      return true;
    }
    return false;
  },

  // Cart methods
  async findCart(userId) {
    return mockDB.carts.find(c => c.userId === userId);
  },

  async createCart(userId, items = []) {
    const cart = {
      _id: generateId(),
      userId,
      items,
      createdAt: new Date(),
    };
    mockDB.carts.push(cart);
    return cart;
  },

  async updateCart(userId, items) {
    const cart = await this.findCart(userId);
    if (cart) {
      cart.items = items;
      return cart;
    }
    return this.createCart(userId, items);
  },

  // Order methods
  async createOrder(orderData) {
    const order = {
      _id: generateId(),
      ...orderData,
      createdAt: new Date(),
    };
    mockDB.orders.push(order);
    return order;
  },

  async findOrder(query) {
    const key = Object.keys(query)[0];
    const value = query[key];
    return mockDB.orders.find(o => o[key] === value);
  },

  async findAllOrders(filter = {}) {
    let results = mockDB.orders;
    if (filter.userId) {
      results = results.filter(o => o.userId === filter.userId);
    }
    return results;
  },
};
