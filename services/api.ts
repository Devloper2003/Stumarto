// API Base URL
const API_BASE = "https://stumarto.onrender.com/api";
export default API_BASE;

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('stumarto_token');
};

// Get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// API response type
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Generic API call function
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==================== AUTH APIs ====================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'seller' | 'admin';
  location?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  location?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    return apiCall<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    return apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    return apiCall<{ user: User }>('/auth/me');
  },
};

// ==================== PRODUCT APIs ====================

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: 'uniforms' | 'books' | 'bags' | 'shoes' | 'stationery' | 'other';
  images: string[];
  location: string;
  productType: 'direct_sell' | 'platform_sell';
  sellerId: string | User;
  approved: boolean;
  stock: number;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  location?: string;
  productType?: 'direct_sell' | 'platform_sell';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  count: number;
  total: number;
  page: number;
  pages: number;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  location?: string;
  productType: 'direct_sell' | 'platform_sell';
  stock?: number;
  condition?: 'new' | 'like_new' | 'good' | 'fair';
}

export const productAPI = {
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<ProductsResponse>> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.productType) params.append('productType', filters.productType);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    return apiCall<ProductsResponse>(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    return apiCall<{ product: Product }>(`/products/${id}`);
  },

  createProduct: async (data: CreateProductData): Promise<ApiResponse<{ product: Product }>> => {
    return apiCall<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyProducts: async (approved?: boolean, page?: number, limit?: number): Promise<ApiResponse<ProductsResponse>> => {
    const params = new URLSearchParams();
    if (approved !== undefined) params.append('approved', approved.toString());
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    return apiCall<ProductsResponse>(`/products/seller/my-products${queryString ? `?${queryString}` : ''}`);
  },

  approveProduct: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    return apiCall<{ product: Product }>(`/products/${id}/approve`, {
      method: 'PATCH',
    });
  },

  getPendingProducts: async (page?: number, limit?: number): Promise<ApiResponse<ProductsResponse>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    return apiCall<ProductsResponse>(`/products/admin/pending${queryString ? `?${queryString}` : ''}`);
  },
};

// ==================== CART APIs ====================

export interface CartItem {
  productId: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  products: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartSummary {
  totalItems: number;
  totalAmount: string;
  itemCount: number;
}

export interface CartResponse {
  cart: Cart;
  summary: CartSummary;
}

export const cartAPI = {
  getCart: async (): Promise<ApiResponse<CartResponse>> => {
    return apiCall<CartResponse>('/cart');
  },

  addToCart: async (productId: string, quantity: number = 1): Promise<ApiResponse<{ cart: Cart }>> => {
    return apiCall<{ cart: Cart }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateCartItem: async (productId: string, quantity: number): Promise<ApiResponse<{ cart: Cart }>> => {
    return apiCall<{ cart: Cart }>(`/cart/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (productId: string): Promise<ApiResponse<{ cart: Cart }>> => {
    return apiCall<{ cart: Cart }>(`/cart/${productId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async (): Promise<ApiResponse<{ cart: Cart }>> => {
    return apiCall<{ cart: Cart }>('/cart', {
      method: 'DELETE',
    });
  },
};

// ==================== ORDER APIs ====================

export interface OrderItem {
  productId: string | Product;
  quantity: number;
  price: number;
  title: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  products: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: 'cash_on_delivery' | 'online' | 'wallet';
  transactionId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface CreateOrderResponse {
  order: Order;
  razorpayOrder: RazorpayOrder;
  key: string;
}

export interface VerifyPaymentData {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
  total: number;
  page: number;
  pages: number;
}

export const orderAPI = {
  createOrder: async (shippingAddress?: string): Promise<ApiResponse<CreateOrderResponse>> => {
    return apiCall<CreateOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress: shippingAddress || '' }),
    });
  },

  verifyPayment: async (data: VerifyPaymentData): Promise<ApiResponse<{ order: Order }>> => {
    return apiCall<{ order: Order }>('/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyOrders: async (
    paymentStatus?: string,
    orderStatus?: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<OrdersResponse>> => {
    const params = new URLSearchParams();
    if (paymentStatus) params.append('paymentStatus', paymentStatus);
    if (orderStatus) params.append('orderStatus', orderStatus);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    return apiCall<OrdersResponse>(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrderById: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    return apiCall<{ order: Order }>(`/orders/${id}`);
  },
};

// Export API_BASE for use in other files if needed
export { API_BASE };
