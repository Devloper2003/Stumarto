
import { Product, ProductType, Category, Condition, Review } from './types';

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', userId: 'u1', userName: 'Suresh Raina', rating: 5, comment: 'Great quality and fits perfectly!', date: '2023-10-12' },
  { id: 'r2', userId: 'u2', userName: 'Meera K.', rating: 4, comment: 'Minor signs of wear but very useful.', date: '2023-11-05' }
];

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'DPS School Uniform (Grade 5)',
    description: 'Complete set with blazer, skirt, and tie. Excellent condition.',
    price: 1200,
    category: Category.UNIFORM,
    condition: Condition.USED,
    productType: ProductType.DIRECT_SELL,
    imageUrl: 'https://picsum.photos/seed/uniform1/400/400',
    sellerId: 's1',
    sellerName: 'Anita Sharma',
    location: 'Delhi',
    pincode: '110001',
    approved: true,
    createdAt: '2023-01-15T10:00:00Z',
    reviews: [MOCK_REVIEWS[0]]
  },
  {
    id: '2',
    name: 'Mathematics NCERT Class 10',
    description: 'Latest edition, brand new with plastic wrap.',
    price: 350,
    category: Category.BOOKS,
    condition: Condition.NEW,
    productType: ProductType.PLATFORM_SELL,
    imageUrl: 'https://picsum.photos/seed/book1/400/400',
    sellerId: 's2',
    sellerName: 'Academic Store',
    location: 'Mumbai',
    pincode: '400001',
    approved: true,
    createdAt: '2023-05-20T14:30:00Z',
    reviews: [MOCK_REVIEWS[1]]
  },
  {
    id: '3',
    name: 'Skybag Durable School Bag',
    description: 'Waterproof, 3 compartments, ergonomic design.',
    price: 899,
    category: Category.BAGS,
    condition: Condition.NEW,
    productType: ProductType.PLATFORM_SELL,
    imageUrl: 'https://picsum.photos/seed/bag1/400/400',
    sellerId: 's2',
    sellerName: 'Academic Store',
    location: 'Mumbai',
    pincode: '400012',
    approved: true,
    createdAt: '2023-08-10T09:15:00Z',
    reviews: []
  },
  {
    id: '4',
    name: 'Nike Kids School Shoes (Size 4)',
    description: 'Used for only one term, still in great shape.',
    price: 600,
    category: Category.SHOES,
    condition: Condition.USED,
    productType: ProductType.DIRECT_SELL,
    imageUrl: 'https://picsum.photos/seed/shoe1/400/400',
    sellerId: 's3',
    sellerName: 'Rajesh Kumar',
    location: 'Bangalore',
    pincode: '560001',
    approved: true,
    createdAt: '2023-09-01T12:00:00Z',
    reviews: []
  },
  {
    id: '5',
    name: 'Standard Stationery Kit',
    description: 'Includes 10 pencils, eraser, sharpener, and scale.',
    price: 150,
    category: Category.STATIONERY,
    condition: Condition.NEW,
    productType: ProductType.PLATFORM_SELL,
    imageUrl: 'https://picsum.photos/seed/stat1/400/400',
    sellerId: 's2',
    sellerName: 'Academic Store',
    location: 'Pune',
    pincode: '411001',
    approved: true,
    createdAt: '2023-11-12T16:45:00Z',
    reviews: [MOCK_REVIEWS[0], MOCK_REVIEWS[1]]
  }
];
