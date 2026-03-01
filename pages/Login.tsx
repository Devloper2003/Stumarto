
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../services/api';
import { User } from '../types';

interface LoginProps {
  setUser: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log('🔐 Attempting login with email:', email);
      console.log('📍 API Base URL:', API_BASE);
      
      const loginUrl = `${API_BASE}/auth/login`;
      console.log('🌐 Login endpoint:', loginUrl);
      
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('📨 Response status:', res.status);
      
      const data = await res.json();
      console.log('📦 Response data:', data);
      
      if (!res.ok) {
        const errorMsg = data.message || 'Login failed';
        setErrorMessage(errorMsg);
        console.error('❌ Login failed:', errorMsg);
        alert(errorMsg);
        return;
      }
      
      const { user, token } = data.data;
      // persist token and user
      localStorage.setItem('stumarto_token', token);
      localStorage.setItem('stumarto_user', JSON.stringify(user));
      setUser(user);
      console.log('✅ Login successful, redirecting...');
      navigate(user.role === 'seller' ? '/seller-dashboard' : '/');
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unable to connect to server';
      setErrorMessage(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetEmailSent(true);
    // Simulate API latency
    setTimeout(() => {
      // Keep it on the sent state for demonstration
    }, 1000);
  };

  if (resetEmailSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✉️</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Check Your Inbox</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We've sent a secure reset link to <span className="font-bold text-slate-800">{email}</span>. Please click the link to choose a new password.
          </p>
          <button 
            onClick={() => { setResetEmailSent(false); setIsResetMode(false); }}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase hover:bg-green-600 transition-all shadow-xl"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border transition-all">
         <div className="text-center mb-8">
            <img src="https://i.ibb.co/LdQ8vJ9/Stumarto-Logo.jpg" alt="Logo" className="h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              {isResetMode ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500">
              {isResetMode ? 'Enter your email to receive a recovery link' : 'Sign in to your school marketplace'}
            </p>
         </div>

         {!isResetMode ? (
           <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-sm font-semibold">
                  ⚠️ {errorMessage}
                </div>
              )}
              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                 <input 
                   required
                   type="email" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   disabled={isLoading}
                   className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 outline-none focus:bg-white focus:border-[#16a34a] transition disabled:opacity-50"
                   placeholder="parent@school.com"
                 />
              </div>
              <div>
                 <div className="flex justify-between items-center mb-2 ml-1">
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                   <button 
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    disabled={isLoading}
                    className="text-[10px] font-black text-green-600 uppercase hover:underline disabled:opacity-50"
                   >
                     Forgot?
                   </button>
                 </div>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 outline-none focus:bg-white focus:border-[#16a34a] transition disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-sm uppercase hover:bg-green-700 transition shadow-lg shadow-green-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
           </form>
         ) : (
           <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Registered Email</label>
                 <input 
                   required
                   type="email" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full border-2 border-gray-100 rounded-xl p-3 bg-gray-50 outline-none focus:bg-white focus:border-[#16a34a] transition"
                   placeholder="Enter your email"
                 />
              </div>
              <div className="space-y-3">
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase hover:bg-green-600 transition shadow-xl">
                   Send Recovery Link
                </button>
                <button 
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-slate-800 transition"
                >
                   Cancel and Return
                </button>
              </div>
           </form>
         )}

         {!isResetMode && (
           <p className="mt-8 text-center text-sm text-gray-500">
             New to Stumarto? <Link to="/signup" className="text-green-600 font-black hover:underline">Join Now</Link>
           </p>
         )}
      </div>
    </div>
  );
};

export default Login;
