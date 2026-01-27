
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, BankDetails } from '../types';

interface SignupProps {
  setUser: (u: User) => void;
}

const Signup: React.FC<SignupProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'user' | 'seller'>('user');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pincode: '',
    location: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolder: ''
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bankDetails: BankDetails | undefined = role === 'seller' ? {
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      accountHolder: formData.accountHolder || `${formData.firstName} ${formData.lastName}`
    } : undefined;

    const mockUser: User = {
      id: 'new-' + Date.now(),
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      role,
      location: formData.location || 'Delhi',
      pincode: formData.pincode,
      phone: formData.phone,
      bankDetails,
      orders: []
    };

    localStorage.setItem('stumarto_user', JSON.stringify(mockUser));
    setUser(mockUser);
    navigate(role === 'seller' ? '/seller-dashboard' : '/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen py-20 bg-gray-50/30 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100">
         <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Join the Hub</h2>
            <p className="text-gray-500 font-medium">Create your profile and start trading essentials.</p>
         </div>

         <div className="flex gap-4 mb-12 bg-gray-50 p-2 rounded-[2.5rem] border border-gray-100">
            <button 
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 p-6 rounded-[2rem] transition-all duration-300 flex flex-col items-center gap-2 ${role === 'user' ? 'bg-white shadow-xl text-blue-600 scale-105' : 'text-gray-400 hover:text-slate-800'}`}
            >
               <span className="text-3xl">🎒</span>
               <span className="font-black text-[10px] uppercase tracking-widest">Parent / Student</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('seller')}
              className={`flex-1 p-6 rounded-[2rem] transition-all duration-300 flex flex-col items-center gap-2 ${role === 'seller' ? 'bg-white shadow-xl text-blue-600 scale-105' : 'text-gray-400 hover:text-slate-800'}`}
            >
               <span className="text-3xl">🏢</span>
               <span className="font-black text-[10px] uppercase tracking-widest">Business Seller</span>
            </button>
         </div>

         <form onSubmit={handleSignup} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] px-2">Personal Identity</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} required type="email" className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Mobile Number</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} required type="tel" className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" placeholder="+91 XXX-XXX-XXXX" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">City</label>
                  <input name="location" value={formData.location} onChange={handleInputChange} required className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Area Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleInputChange} required maxLength={6} className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" />
                </div>
              </div>
            </div>

            {role === 'seller' && (
              <div className="space-y-6 pt-8 border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Payout Credentials</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                    Bank Encrypted
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Bank Name</label>
                    <input name="bankName" value={formData.bankName} onChange={handleInputChange} required className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" placeholder="e.g. HDFC Bank" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Account Holder Name</label>
                    <input name="accountHolder" value={formData.accountHolder} onChange={handleInputChange} required className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Account Number</label>
                    <input name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} required type="password" title="Encrypted field" className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">IFSC Code</label>
                    <input name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} required className="w-full border-2 border-gray-50 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-blue-600 outline-none transition" placeholder="e.g. HDFC0001234" />
                  </div>
                </div>
              </div>
            )}

            <button className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-900 shadow-2xl shadow-blue-200 transition-all transform active:scale-95 mt-4">
               Complete {role === 'seller' ? 'Seller' : 'Buyer'} Registration
            </button>
         </form>

         <p className="mt-12 text-center text-xs font-black uppercase tracking-widest text-gray-400">
           Already a member? <Link to="/login" className="text-blue-600 hover:underline">Sign In Instead</Link>
         </p>
      </div>
    </div>
  );
};

export default Signup;
