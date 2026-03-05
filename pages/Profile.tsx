
import React, { useState } from 'react';
import { User, Product, BankDetails } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

interface ProfileProps {
  user: User | null;
  onUpdate: (u: User) => void;
  products: Product[];
   onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, products, onLogout }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);

  const handleUpgrade = async () => {
    try {
      const res = await authAPI.upgradeToSeller();
      if (res.success && res.data?.user) {
        onUpdate(res.data.user);
        alert('You are now a seller!');
      }
    } catch (err) {
      console.error('Upgrade failed', err);
      alert('Could not upgrade to seller');
    }
  };
  
  const [formData, setFormData] = useState(user || {
    id: '', name: '', email: '', role: 'user', location: '', pincode: '', phone: '', bio: '', orders: []
  });

  const [bankData, setBankData] = useState<BankDetails>(user?.bankDetails || {
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolder: user?.name || ''
  });

   if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-40 text-center">
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Please log in to see your profile</h2>
        <button onClick={() => navigate('/login')} className="px-10 py-4 bg-[#16a34a] text-white rounded-2xl font-black uppercase tracking-widest text-xs">Login Now</button>
      </div>
    );
  }

  const handleSave = () => {
    onUpdate({ ...formData, bankDetails: bankData } as User);
    setIsEditing(false);
  };

  const handleSaveBank = () => {
    onUpdate({ ...user, bankDetails: bankData } as User);
    setIsEditingBank(false);
  };

  const myOrders = user.orders || [];
  const myProducts = products.filter(p => p.sellerId === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex flex-col lg:flex-row gap-16">
         {/* Sidebar: Profile Info */}
         <div className="w-full lg:w-96 space-y-8">
            <div className="bg-white rounded-[3rem] border p-12 text-center shadow-xl shadow-slate-100 relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-32 bg-[#16a34a]"></div>
               <div className="relative pt-12">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center text-5xl font-black text-[#16a34a] mx-auto mb-8">
                    {user.name.charAt(0)}
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tighter">{user.name}</h2>
                  <div className="flex items-center justify-center gap-2 mb-10">
                    <span className="text-[10px] font-black text-[#16a34a] uppercase tracking-widest">{user.role} Member</span>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4 text-left">
                       <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value} as User)} className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 outline-none focus:bg-white focus:border-[#16a34a] transition" placeholder="Full Name" />
                       <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value} as User)} className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 outline-none focus:bg-white focus:border-[#16a34a] transition" placeholder="Phone Number" />
                       <div className="flex gap-3 pt-4">
                          <button onClick={handleSave} className="flex-1 py-4 bg-[#16a34a] text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Save</button>
                          <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <p className="text-gray-500 font-medium leading-relaxed">{user.bio || 'Building a sustainable school community on Stumarto.'}</p>
                       <div className="space-y-4 pt-8 border-t border-gray-50 text-left">
                          <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                             <div className="w-10 h-10 bg-green-50 text-[#16a34a] rounded-xl flex items-center justify-center text-lg">✉️</div>
                             <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                             <div className="w-10 h-10 bg-green-50 text-[#16a34a] rounded-xl flex items-center justify-center text-lg">📍</div>
                             <span>{user.location || 'Location Pending'}, {user.pincode}</span>
                          </div>
                          {user.phone && (
                             <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                                <div className="w-10 h-10 bg-green-50 text-[#16a34a] rounded-xl flex items-center justify-center text-lg">📞</div>
                                <span>{user.phone}</span>
                             </div>
                          )}
                       </div>
                       <button onClick={() => setIsEditing(true)} className="w-full py-5 bg-[#0f172a] text-white rounded-[2rem] font-black text-[10px] uppercase hover:bg-[#16a34a] transition tracking-widest shadow-xl">Update Identity</button>
                       {user.role === 'user' && (
                         <button onClick={handleUpgrade} className="w-full mt-3 py-4 bg-green-600 text-white rounded-[2rem] font-black text-[10px] uppercase hover:bg-green-700 transition tracking-widest shadow-xl">Become Seller</button>
                       )}
                      <button onClick={() => { localStorage.removeItem('stumarto_token'); localStorage.removeItem('stumarto_user'); if (onLogout) onLogout(); navigate('/'); }} className="w-full mt-3 py-3 bg-red-50 text-red-600 rounded-[2rem] font-black text-[10px] uppercase hover:bg-red-100 transition tracking-widest">Logout</button>
                                 {user.role === 'admin' && (
                                    <Link to="/admin" className="block w-full mt-3 py-3 text-center bg-green-600 text-white rounded-[2rem] font-black text-[10px] uppercase hover:bg-green-700 transition tracking-widest">Go to Admin Dashboard</Link>
                                 )}
                    </div>
                  )}
               </div>
            </div>

            {/* Seller Insights Grid */}
            {user.role === 'seller' && (
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[2rem] border shadow-sm text-center">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Trust Score</p>
                     <p className="text-2xl font-black text-green-500">98%</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border shadow-sm text-center">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Items Sold</p>
                     <p className="text-2xl font-black text-[#16a34a]">{myOrders.length + 12}</p>
                  </div>
               </div>
            )}
         </div>

         {/* Main Content */}
         <div className="flex-1 space-y-12">
            <div className="flex justify-between items-end">
               <h1 className="text-5xl font-black text-slate-800 uppercase tracking-tighter">Command Dashboard</h1>
               {user.role === 'seller' && (
                  <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">Verified Business</span>
               )}
            </div>

            {/* Payout Credentials Section - Matches Image 3 Exactly */}
            {user.role === 'seller' && (
               <div className="bg-white rounded-[3.5rem] border p-12 space-y-10 shadow-sm relative">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                     <h2 className="text-sm font-black text-[#16a34a] uppercase tracking-[0.2em]">Payout Credentials</h2>
                     <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                        <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Bank Encrypted</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">Bank Name</label>
                        {isEditingBank ? (
                           <input 
                              value={bankData.bankName} 
                              onChange={e => setBankData({...bankData, bankName: e.target.value})}
                              placeholder="e.g. HDFC Bank"
                              className="w-full bg-[#f8fafc] border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20 placeholder:text-slate-300" 
                           />
                        ) : (
                           <div className="w-full bg-[#f8fafc] rounded-full px-6 py-4 text-sm font-bold text-slate-700">{bankData.bankName || 'Not Set'}</div>
                        )}
                     </div>
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">Account Holder Name</label>
                        {isEditingBank ? (
                           <input 
                              value={bankData.accountHolder} 
                              onChange={e => setBankData({...bankData, accountHolder: e.target.value})}
                              className="w-full bg-[#f8fafc] border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20" 
                           />
                        ) : (
                           <div className="w-full bg-[#f8fafc] rounded-full px-6 py-4 text-sm font-bold text-slate-700">{bankData.accountHolder || 'Not Set'}</div>
                        )}
                     </div>
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">Account Number</label>
                        {isEditingBank ? (
                           <input 
                              type="password"
                              value={bankData.accountNumber} 
                              onChange={e => setBankData({...bankData, accountNumber: e.target.value})}
                              className="w-full bg-[#f8fafc] border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20" 
                           />
                        ) : (
                           <div className="w-full bg-[#f8fafc] rounded-full px-6 py-4 text-sm font-bold text-slate-700 tracking-widest">
                              {bankData.accountNumber ? `**** **** ${bankData.accountNumber.slice(-4)}` : 'Not Set'}
                           </div>
                        )}
                     </div>
                     <div className="space-y-3">
                        <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">IFSC Code</label>
                        {isEditingBank ? (
                           <input 
                              value={bankData.ifscCode} 
                              onChange={e => setBankData({...bankData, ifscCode: e.target.value.toUpperCase()})}
                              placeholder="e.g. HDFC0001234"
                              className="w-full bg-[#f8fafc] border-none rounded-full px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20 placeholder:text-slate-300" 
                           />
                        ) : (
                           <div className="w-full bg-[#f8fafc] rounded-full px-6 py-4 text-sm font-bold text-slate-700 uppercase">{bankData.ifscCode || 'Not Set'}</div>
                        )}
                     </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-4">
                     {isEditingBank ? (
                        <>
                           <button onClick={handleSaveBank} className="px-10 py-4 bg-[#16a34a] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-100 transition">Confirm Changes</button>
                           <button onClick={() => setIsEditingBank(false)} className="px-10 py-4 bg-gray-100 text-gray-500 rounded-full font-black text-[10px] uppercase tracking-widest transition">Cancel</button>
                        </>
                     ) : (
                        <button onClick={() => setIsEditingBank(true)} className="px-10 py-4 bg-gray-50 text-slate-400 hover:text-[#16a34a] rounded-full font-black text-[10px] uppercase tracking-widest transition border border-transparent hover:border-green-100">Update Bank Account</button>
                     )}
                  </div>
               </div>
            )}

            {/* Orders & Inventory Section */}
            <div className="space-y-12">
               <section className="space-y-8">
                  <h3 className="text-xl font-black text-[#16a34a] uppercase tracking-[0.3em] flex items-center gap-4">
                     <div className="w-3 h-3 bg-[#16a34a] rounded-full animate-pulse"></div>
                     Live Operations
                  </h3>
                  {myOrders.length === 0 ? (
                    <div className="p-20 bg-gray-50 rounded-[4rem] text-center border-4 border-dashed border-gray-100 flex flex-col items-center">
                       <span className="text-5xl mb-6 grayscale opacity-20">🛒</span>
                       <p className="text-gray-400 font-black uppercase tracking-widest text-sm mb-6">No orders currently active.</p>
                       <button onClick={() => navigate('/marketplace')} className="bg-[#0f172a] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Go Shopping</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       {myOrders.map(order => (
                          <div key={order.id} className="bg-white border border-gray-100 rounded-[3rem] p-8 flex flex-col sm:flex-row justify-between items-center hover:border-blue-200 hover:shadow-2xl transition-all duration-500 gap-6">
                             <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-green-50 rounded-[1.5rem] flex items-center justify-center text-4xl">📦</div>
                                <div>
                                   <p className="font-black text-slate-800 text-2xl tracking-tighter">{order.productName}</p>
                                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{order.date} • ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-8 self-end sm:self-center">
                                <div className="text-right">
                                   <p className="text-3xl font-black text-slate-950 tracking-tighter">₹{order.amount}</p>
                                   <span className={`text-[10px] font-black uppercase px-4 py-1 rounded-full mt-2 inline-block ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'}`}>{order.status}</span>
                                </div>
                                <button 
                                  onClick={() => navigate(`/track/${order.id}`)}
                                  className="px-8 py-3 bg-[#0f172a] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-[#16a34a] transition-all shadow-xl shadow-slate-100"
                                >
                                  Track
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                  )}
               </section>

               {user.role === 'seller' && (
                 <section className="space-y-8 pt-8">
                    <h3 className="text-xl font-black text-orange-600 uppercase tracking-[0.3em] flex items-center gap-4">
                       <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></div>
                       Warehouse Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {myProducts.slice(0, 4).map(p => (
                          <div key={p.id} className="bg-white border border-gray-100 rounded-[3rem] p-6 flex items-center gap-6 hover:shadow-2xl transition-all duration-500 group">
                             <div className="w-24 h-24 rounded-[2rem] overflow-hidden shrink-0 border-4 border-white shadow-lg">
                               <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                             </div>
                             <div className="min-w-0 flex-1">
                                <h4 className="font-black text-slate-800 text-lg truncate tracking-tight">{p.name}</h4>
                                <p className="text-2xl font-black text-[#16a34a] tracking-tighter">₹{p.price}</p>
                             </div>
                             <Link to={`/product/${p.id}`} className="p-4 bg-gray-50 text-slate-400 rounded-2xl group-hover:bg-[#16a34a] group-hover:text-white transition-all">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                             </Link>
                          </div>
                       ))}
                    </div>
                    <button onClick={() => navigate('/seller-dashboard')} className="w-full py-6 bg-[#0f172a] text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-[#16a34a] transition-all shadow-2xl">Manage All Listings</button>
                 </section>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
