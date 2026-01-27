
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Product, User, CartItem, ProductType, Order } from './types';
import { DUMMY_PRODUCTS } from './mockData';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerDashboard from './pages/SellerDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Tracking from './pages/Tracking';
import ReviewsPage from './pages/Reviews';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>('All Locations');

  useEffect(() => {
    const storedUser = localStorage.getItem('stumarto_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const updateUserInfo = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('stumarto_user', JSON.stringify(updatedUser));
  };

  const addToCart = (product: Product) => {
    if (product.productType !== ProductType.PLATFORM_SELL) return;
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, quantity: 1, product }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const logout = () => {
    localStorage.removeItem('stumarto_user');
    setUser(null);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleApproveProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, approved: true } : p));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <header className="bg-white sticky top-0 z-50 py-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo Section - Matches Image 2 */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2563eb] rounded-[10px] flex items-center justify-center text-white font-black text-lg">S</div>
              <span className="text-[22px] font-black text-[#1e293b] tracking-[-0.03em] uppercase">Stumarto</span>
            </Link>

            {/* Navigation - Matches Image 2 Typography */}
            <nav className="flex items-center gap-10">
              <Link to="/marketplace" className="text-[11px] font-black uppercase tracking-[0.05em] text-[#64748b] hover:text-[#2563eb] transition-colors">Marketplace</Link>
              <Link to="/reviews" className="text-[11px] font-black uppercase tracking-[0.05em] text-[#64748b] hover:text-[#2563eb] transition-colors">Community</Link>
              
              {/* Shopping Bag Icon - Matches Image 2 */}
              <Link to="/cart" className="relative text-[#1e293b] hover:text-[#2563eb] transition-colors">
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#2563eb] text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-black">
                    {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </span>
                )}
              </Link>

              {user ? (
                <Link to="/profile" className="flex items-center gap-2 bg-[#0f172a] text-white pl-1.5 pr-4 py-1.5 rounded-full hover:bg-[#2563eb] transition-all shadow-lg group">
                   <div className="w-7 h-7 bg-white/10 text-white rounded-full flex items-center justify-center font-bold text-[10px] uppercase">{user.name.charAt(0)}</div>
                   <span className="text-[10px] font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link to="/login" className="bg-[#0f172a] text-white px-8 py-2.5 rounded-full font-black text-[11px] uppercase tracking-[0.1em] hover:bg-[#2563eb] transition-all shadow-md shadow-slate-200">Login</Link>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1 bg-gray-50/50">
          <Routes>
            <Route path="/" element={<Home products={products} setLocation={setLocationFilter} location={locationFilter} />} />
            <Route path="/marketplace" element={<Marketplace products={products} location={locationFilter} setLocation={setLocationFilter} />} />
            <Route path="/reviews" element={<ReviewsPage products={products} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} currentUser={user} setProducts={setProducts} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} user={user} updateUserInfo={updateUserInfo} />} />
            <Route path="/seller-dashboard" element={<SellerDashboard user={user} products={products} onAddProduct={handleAddProduct} />} />
            <Route path="/admin" element={<AdminPanel products={products} onApprove={handleApproveProduct} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} onUpdate={updateUserInfo} products={products} onLogout={logout} />} />
            <Route path="/track/:orderId" element={<Tracking user={user} />} />
          </Routes>
        </main>

        <footer className="bg-slate-950 text-slate-400 py-20 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
            <div className="col-span-1 lg:col-span-1 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-black text-xl border border-white/10">S</div>
                <span className="text-2xl font-black text-white uppercase tracking-tighter">Stumarto</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm font-medium">
                Pioneering sustainable school resource sharing. We empower families to save money and reduce waste through a trusted community marketplace.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                System Operational & Verified
              </div>
            </div>

            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link to="/marketplace" className="hover:text-blue-400 transition">Marketplace</Link></li>
                <li><Link to="/seller-dashboard" className="hover:text-blue-400 transition">Sell Items</Link></li>
                <li><Link to="/reviews" className="hover:text-blue-400 transition">User Reviews</Link></li>
                {/* Admin Panel Hidden per request */}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Support</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link to="/profile" className="hover:text-blue-400 transition">Help Center</Link></li>
                <li><Link to="/profile" className="hover:text-blue-400 transition">Safety Tips</Link></li>
                <li><Link to="/profile" className="hover:text-blue-400 transition">Order History</Link></li>
                <li><Link to="/profile" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4">Newsletter</h4>
              <p className="text-xs font-medium">Stay updated with the latest back-to-school deals.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs w-full focus:outline-none focus:border-blue-500" />
                <button className="bg-blue-600 text-white px-5 py-3 rounded-xl font-black uppercase text-[10px]">Join</button>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Stumarto Ecosystems Ltd.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition">Instagram</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">Facebook</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
