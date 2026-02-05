
export enum ProductType {
  DIRECT_SELL = 'direct_sell',
  PLATFORM_SELL = 'platform_sell'
}

export enum Category {
  UNIFORM = 'Uniform',
  BOOKS = 'Books',
  BAGS = 'Bags',
  SHOES = 'Shoes',
  STATIONERY = 'Stationery'
}

export enum Condition {
  NEW = 'New',
  USED = 'Used'
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  productType: ProductType;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  location: string;
  pincode: string;
  approved: boolean;
  createdAt: string;
  reviews: Review[];
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolder: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  location?: string;
  pincode?: string;
  phone?: string;
  bio?: string;
  bankDetails?: BankDetails;
  orders: Order[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}
