
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import API_BASE from '../services/api';

interface SignupProps {
  setUser: (u: User) => void;
}

const Signup: React.FC<SignupProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    pincode: '',
    location: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: 'user',
          location: formData.location || 'Delhi',
          phone: formData.phone,
          pincode: formData.pincode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('stumarto_token', data.data.token);
      localStorage.setItem('stumarto_user', JSON.stringify(data.data.user));
      setUser(data.data.user);
      setSuccess(true);

      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border text-center">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Welcome!</h2>
          <p className="text-gray-500 mb-8">Your account has been created successfully. Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Create Your Account</h2>
          <p className="text-gray-500 font-medium">Join Stumarto and start buying & selling school essentials</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-700 text-sm font-bold">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] px-2 mb-6">Personal Identity</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">First Name</label>
                <input 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-green-600 outline-none transition" 
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Last Name</label>
                <input 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-green-600 outline-none transition" 
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Email Address</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  type="email" 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-green-600 outline-none transition" 
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Mobile Number</label>
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required 
                  type="tel" 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-green-600 outline-none transition" 
                  placeholder="+91 98XXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">City</label>
                <input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-green-600 outline-none transition" 
                  placeholder="New Delhi"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Area Pincode</label>
                <input 
                  name="pincode" 
                  value={formData.pincode} 
                  onChange={handleInputChange} 
                  required 
                  maxLength={6} 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-green-600 outline-none transition" 
                  placeholder="110001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Password</label>
                <input 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                  type="password" 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-green-600 outline-none transition" 
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Confirm Password</label>
                <input 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  required 
                  type="password" 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:bg-white focus:border-green-600 outline-none transition" 
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading} 
            className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-green-700 shadow-2xl shadow-green-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="mt-10 text-center text-xs font-black uppercase tracking-widest text-gray-400">
          Already have an account? <Link to="/login" className="text-green-600 hover:underline font-black">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
