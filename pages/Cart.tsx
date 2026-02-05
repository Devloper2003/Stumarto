
import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, removeFromCart }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">My Shopping Bag</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border p-20 text-center space-y-6">
          <div className="text-6xl">🛒</div>
          <h2 className="text-xl font-bold text-gray-400">Your cart is empty</h2>
          <Link to="/marketplace" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-bold">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="bg-white border rounded-2xl p-4 flex gap-6 items-center">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-green-600 font-bold">₹{item.product.price * item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="p-2 text-gray-400 hover:text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-3xl p-8 h-fit space-y-6 shadow-sm">
             <h3 className="font-bold text-xl">Order Summary</h3>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-gray-500">Subtotal</span>
                 <span className="font-bold">₹{subtotal}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Shipping</span>
                 <span className="font-bold">₹{shipping}</span>
               </div>
               <div className="border-t pt-4 flex justify-between text-lg font-black">
                 <span>Total</span>
                 <span className="text-green-600">₹{total}</span>
               </div>
             </div>
             <Link 
               to="/checkout"
               className="block w-full text-center py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition shadow-lg"
             >
               Checkout
             </Link>
             <p className="text-[10px] text-gray-400 text-center">Platform fees and taxes may apply at checkout.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
