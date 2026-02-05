
import React, { useState } from 'react';
import { Product, ProductType, Category, Condition, User } from '../types';
import { getSmartCategory } from '../services/geminiService';

interface SellerDashboardProps {
  user: User | null;
  products: Product[];
  onAddProduct: (p: Product) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, products, onAddProduct }) => {
  const [isListing, setIsListing] = useState(false);
  const [isLoadingCat, setIsLoadingCat] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: Category.UNIFORM,
    condition: Condition.NEW,
    productType: ProductType.PLATFORM_SELL,
    imageUrl: '',
    location: user?.location || 'Delhi',
    pincode: user?.pincode || ''
  });

  const myProducts = products.filter(p => p.sellerId === user?.id);
  const totalValue = myProducts.reduce((acc, p) => acc + p.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      condition: formData.condition,
      productType: formData.productType,
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${Math.random()}/400/400`,
      sellerId: user?.id || 'temp',
      sellerName: user?.name || 'Guest Seller',
      location: formData.location,
      pincode: formData.pincode,
      approved: false,
      createdAt: new Date().toISOString(),
      reviews: []
    };
    onAddProduct(newProduct);
    setIsListing(false);
    alert("Item listed! It will go live after a quick admin review.");
  };

  const autoCategory = async () => {
    if (!formData.description) return;
    setIsLoadingCat(true);
    const cat = await getSmartCategory(formData.description);
    setFormData(prev => ({ ...prev, category: cat as Category }));
    setIsLoadingCat(false);
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="max-w-4xl mx-auto py-32 px-4 text-center">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🏐</div>
        <h2 className="text-4xl font-black text-slate-800 mb-4">Start Selling on Stumarto</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">Turn your outgrown uniforms and used textbooks into cash while helping another student!</p>
        <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase shadow-2xl hover:bg-green-600 transition">Become a Seller</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tighter">SELLER COMMAND CENTER</h1>
           <p className="text-gray-500 font-medium">Greetings, {user.name}! Your shop is performing well today.</p>
        </div>
        <button 
          onClick={() => setIsListing(true)}
          className="bg-green-600 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase shadow-xl shadow-green-200 hover:scale-[1.05] transition flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Launch New Product
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
         {[
           { label: 'Total Inventory Value', value: `₹${totalValue}`, icon: '💰', color: 'bg-green-50 text-green-600' },
           { label: 'Active Listings', value: myProducts.length, icon: '📎', color: 'bg-green-50 text-green-600' },
           { label: 'Pending Approval', value: myProducts.filter(p => !p.approved).length, icon: '⏳', color: 'bg-yellow-50 text-yellow-600' },
           { label: 'Profile Views', value: '428', icon: '👁️', color: 'bg-purple-50 text-purple-600' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col items-center text-center group hover:border-green-200 transition">
              <span className={`text-4xl mb-4 p-5 rounded-3xl ${stat.color} group-hover:scale-110 transition duration-500`}>{stat.icon}</span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Inventory List */}
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Your Inventory</h3>
            {myProducts.length === 0 ? (
              <div className="p-32 border-4 border-dashed rounded-[3rem] text-center bg-gray-50 flex flex-col items-center">
                <div className="text-5xl mb-4 opacity-20">📭</div>
                <p className="text-gray-400 font-black">Warehouse is currently empty.</p>
                <button onClick={() => setIsListing(true)} className="mt-4 text-green-600 font-bold hover:underline">List your first item now</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myProducts.map(p => (
                  <div key={p.id} className="bg-white border rounded-[2rem] p-4 flex gap-6 hover:shadow-lg transition group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={p.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-black text-slate-800 truncate">{p.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${p.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.approved ? 'Live' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-lg font-black text-green-600">₹{p.price}</p>
                      <div className="flex gap-4 mt-3">
                         <button className="text-[10px] font-black text-gray-400 hover:text-green-600 uppercase tracking-widest border-b border-transparent hover:border-green-600 transition">Modify</button>
                         <button className="text-[10px] font-black text-gray-400 hover:text-red-600 uppercase tracking-widest border-b border-transparent hover:border-red-600 transition">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
         </div>

         {/* Sales History & Performance */}
         <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Order History</h3>
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">📊</div>
              <h3 className="text-xl font-black mb-6 uppercase tracking-widest">Revenue Stats</h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                   <div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">Total Earned</span>
                     <span className="text-3xl font-black">₹0.00</span>
                   </div>
                   <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded">0% Growth</span>
                 </div>
                 
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Recent Transactions</p>
                    <div className="text-sm opacity-50 italic py-10 text-center border border-white/5 rounded-2xl">
                       No sales recorded yet.<br/>Your items are still attracting eyes!
                    </div>
                 </div>

                 <div className="pt-6">
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition">Export Report</button>
                 </div>
              </div>
            </div>
         </div>
      </div>

      {/* Listing Modal */}
      {isListing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setIsListing(false)} className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 hover:text-black rounded-full transition">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">List New Essential</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Item Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData(f => ({...f, name: e.target.value}))}
                      placeholder="e.g. Modern Blazer"
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white outline-none focus:border-green-600 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Selling Price (₹)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData(f => ({...f, price: e.target.value}))}
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white outline-none focus:border-green-600 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Product Story & Specs</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(f => ({...f, description: e.target.value}))}
                    onBlur={autoCategory}
                    className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white outline-none focus:border-green-600 transition"
                    placeholder="Tell parents why this is a great deal..."
                  ></textarea>
                  <div className="flex items-center gap-2 mt-2 px-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI auto-categorizer active</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Category Selection</label>
                    <select 
                      className={`w-full border-2 border-gray-100 rounded-2xl p-4 transition outline-none ${isLoadingCat ? 'opacity-50 animate-pulse' : ''}`}
                      value={formData.category}
                      onChange={(e) => setFormData(f => ({...f, category: e.target.value as Category}))}
                    >
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                   </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Sale Model</label>
                    <select 
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 outline-none"
                      value={formData.productType}
                      onChange={(e) => setFormData(f => ({...f, productType: e.target.value as ProductType}))}
                    >
                      <option value={ProductType.PLATFORM_SELL}>Full Platform Logistics</option>
                      <option value={ProductType.DIRECT_SELL}>Contact Me Directly</option>
                    </select>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Location City</label>
                    <input 
                      required
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData(f => ({...f, location: e.target.value}))}
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 outline-none"
                    />
                   </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Pincode</label>
                    <input 
                      required
                      type="text" 
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData(f => ({...f, pincode: e.target.value}))}
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 outline-none"
                    />
                   </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black text-lg uppercase shadow-2xl shadow-green-200 hover:bg-green-700 transition transform active:scale-95"
                >
                  Confirm & List Item
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
