// Supabase Database Service
const supabase = require('./supabaseClient');

const supabaseService = {
  // Users operations
  async getUser(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error('Supabase getUser error:', error);
      return null;
    }
  },

  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Supabase createUser error:', error);
      throw error;
    }
  },

  async updateUser(userId, updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Supabase updateUser error:', error);
      throw error;
    }
  },

  // Products operations
  async getProducts(filters = {}) {
    try {
      let query = supabase.from('products').select('*');
      
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.sellerId) query = query.eq('seller_id', filters.sellerId);
      if (filters.type) query = query.eq('type', filters.type);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Supabase getProducts error:', error);
      return [];
    }
  },

  async getProduct(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Supabase getProduct error:', error);
      return null;
    }
  },

  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Supabase createProduct error:', error);
      throw error;
    }
  },

  async updateProduct(productId, updateData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Supabase updateProduct error:', error);
      throw error;
    }
  },

  async deleteProduct(productId) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase deleteProduct error:', error);
      throw error;
    }
  },

  // Orders operations
  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Supabase createOrder error:', error);
      throw error;
    }
  },

  async getOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Supabase getOrders error:', error);
      return [];
    }
  },

  async updateOrder(orderId, updateData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Supabase updateOrder error:', error);
      throw error;
    }
  },

  // Cart operations
  async getCart(userId) {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Supabase getCart error:', error);
      return [];
    }
  },

  async addToCart(cartData) {
    try {
      const { data, error } = await supabase
        .from('cart')
        .insert([cartData])
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Supabase addToCart error:', error);
      throw error;
    }
  },

  async removeFromCart(cartId) {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase removeFromCart error:', error);
      throw error;
    }
  },

  async clearCart(userId) {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase clearCart error:', error);
      throw error;
    }
  }
};

module.exports = supabaseService;
