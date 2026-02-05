
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, User } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  // Added missing props required by App.tsx
  user: User | null;
  updateUserInfo: (updatedUser: User) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, setCart, user, updateUserInfo }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) + 50;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate Razorpay Gateway
    setTimeout(() => {
      setIsProcessing(false);
      setCart([]);
      alert("Payment Successful! Order ID: STU-992384. Redirecting home...");
      navigate('/');
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
           <h2 className="text-2xl font-black">Shipping Details</h2>
           <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Full Street Address" 
                className="w-full border rounded-xl p-3 focus:ring-2 ring-green-500 outline-none"
                value={address.street}
                onChange={e => setAddress(p => ({...p, street: e.target.value}))}
              />
              <div className="grid grid-cols-2 gap-4">
                 <input 
                   type="text" 
                   placeholder="City" 
                   className="border rounded-xl p-3" 
                   value={address.city}
                   onChange={e => setAddress(p => ({...p, city: e.target.value}))}
                 />
                 <input 
                   type="text" 
                   placeholder="Pincode" 
                   className="border rounded-xl p-3" 
                   value={address.zip}
                   onChange={e => setAddress(p => ({...p, zip: e.target.value}))}
                 />
              </div>
           </div>

           <div className="p-6 bg-slate-50 rounded-2xl space-y-4 border">
              <h3 className="font-bold flex items-center gap-2">
                <span className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-lg">R</span>
                Secure Razorpay Checkout
              </h3>
              <p className="text-sm text-gray-500 italic">This is a sandbox environment. No actual money will be deducted.</p>
              <button 
                onClick={handlePay}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${isProcessing ? 'bg-gray-300' : 'bg-[#3399cc] text-white hover:bg-[#2c88b4]'}`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                    Processing...
                  </>
                ) : `Pay ₹${total} Now`}
              </button>
           </div>
        </div>

        <div className="bg-white p-8 border rounded-3xl h-fit">
          <h2 className="text-xl font-bold mb-6">Review Order</h2>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.product.name} (x{item.quantity})</span>
                <span className="font-bold">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-black">
               <span>Amount to Pay</span>
               <span className="text-green-600">₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
