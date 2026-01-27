
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category, Review } from '../types';

interface HomeProps {
  products: Product[];
  setLocation: (loc: string) => void;
  location: string;
}

const Home: React.FC<HomeProps> = ({ products, setLocation, location }) => {
  const [activeReviewTab, setActiveReviewTab] = useState<'top' | 'recent'>('top');

  const categories = [
    { name: Category.UNIFORM, icon: '👕', color: 'bg-red-50 text-red-600' },
    { name: Category.BOOKS, icon: '📚', color: 'bg-blue-50 text-blue-600' },
    { name: Category.BAGS, icon: '🎒', color: 'bg-green-50 text-green-600' },
    { name: Category.SHOES, icon: '👟', color: 'bg-yellow-50 text-yellow-600' },
    { name: Category.STATIONERY, icon: '✏️', color: 'bg-purple-50 text-purple-600' },
  ];

  const featured = products.filter(p => p.approved).slice(0, 4);

  const allReviews = useMemo(() => {
    return products.flatMap(p => p.reviews.map(r => ({ ...r, productName: p.name, productId: p.id })));
  }, [products]);
  
  const displayedReviews = useMemo(() => {
    return activeReviewTab === 'top' 
      ? [...allReviews].sort((a, b) => b.rating - a.rating).slice(0, 3)
      : [...allReviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  }, [allReviews, activeReviewTab]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation('Near My Location'),
        () => alert("Please allow location access to find nearby deals.")
      );
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8">
            <h1 className="text-5xl md:text-7xl font-black leading-none uppercase tracking-tighter">
              School Goods <br /><span className="text-yellow-400">Recycled.</span>
            </h1>
            <p className="text-xl opacity-90 max-w-lg font-medium leading-relaxed">
              The premium hub for students to circulate uniforms, books, and gear. Save the planet, save your budget.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/marketplace" className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-black uppercase text-sm shadow-2xl hover:bg-gray-100 transition tracking-widest">Shop Now</Link>
              <Link to="/seller-dashboard" className="bg-transparent border-2 border-white px-10 py-4 rounded-2xl font-black uppercase text-sm hover:bg-white/10 transition tracking-widest">Start Selling</Link>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-400 blur-[60px] opacity-20 group-hover:opacity-40 transition duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800" 
                alt="Education" 
                className="rounded-[3rem] shadow-2xl transform rotate-3 hover:rotate-0 transition duration-1000 relative z-10" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/marketplace?cat=${cat.name}`}
              className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border border-transparent hover:border-blue-100 hover:shadow-xl transition bg-white group"
            >
              <span className={`text-5xl p-6 rounded-[2rem] ${cat.color} group-hover:scale-110 transition duration-500 shadow-sm`}>{cat.icon}</span>
              <span className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-blue-600 transition">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Wall of Trust (Aesthetic Match for Screenshot) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-950 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-24 opacity-5 text-[300px] pointer-events-none italic font-black text-white leading-none">“</div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-[0.85]">
                Wall of <br/><span className="text-blue-500">Trust</span>
              </h2>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">Hear from thousands of parents who have simplified their school shopping experience.</p>
              
              <div className="flex p-1.5 bg-white/5 backdrop-blur-md rounded-[2rem] w-fit border border-white/5">
                <button 
                  onClick={() => setActiveReviewTab('top')}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeReviewTab === 'top' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-gray-400 hover:text-white'}`}
                >
                  Top Rated
                </button>
                <button 
                  onClick={() => setActiveReviewTab('recent')}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeReviewTab === 'recent' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-gray-400 hover:text-white'}`}
                >
                  Recent
                </button>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedReviews.map((rev, idx) => (
                  <div 
                    key={idx} 
                    className={`p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] space-y-6 hover:bg-white/[0.08] transition-all duration-500 group relative ${idx === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex text-yellow-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-white/10 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">{rev.date}</span>
                    </div>
                    <p className="text-white text-xl font-medium leading-relaxed italic group-hover:text-blue-100 transition duration-500 line-clamp-3">“{rev.comment}”</p>
                    <div className="flex items-center gap-4 pt-8 border-t border-white/5 mt-auto">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xs text-white uppercase shadow-lg shadow-blue-900/50 group-hover:scale-110 transition">{rev.userName.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white uppercase tracking-tighter truncate">{rev.userName}</p>
                        <Link to={`/product/${rev.productId}`} className="text-[10px] text-blue-400 hover:text-blue-300 font-bold tracking-tight truncate block mt-0.5 transition">Item: {rev.productName}</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="max-w-7xl mx-auto px-4 pt-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Hot Community Deals</h2>
          <Link to="/marketplace" className="px-6 py-2 border-2 border-slate-900 text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-slate-900 hover:text-white transition-all">Explore All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <div key={product.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
              <div className="h-64 overflow-hidden relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-xl ${product.productType === 'platform_sell' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-white'}`}>
                    {product.productType === 'platform_sell' ? 'E-Shop' : 'Direct'}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-5">
                <h3 className="font-black text-slate-800 text-xl line-clamp-1 group-hover:text-blue-600 transition">{product.name}</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{product.price}</p>
                  <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{product.condition}</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {product.location}
                  </div>
                  <Link to={`/product/${product.id}`} className="bg-slate-950 text-white p-3 rounded-2xl hover:bg-blue-600 transition shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
