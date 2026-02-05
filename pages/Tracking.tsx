
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface TrackingProps {
  user: User | null;
}

const Tracking: React.FC<TrackingProps> = ({ user }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2); // 0: Ordered, 1: Packed, 2: Out for delivery, 3: Delivered
  const [simulatedLocation, setSimulatedLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi center

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Simulate driver movement
    const interval = setInterval(() => {
      setSimulatedLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const steps = [
    { title: 'Order Confirmed', time: 'Oct 12, 10:30 AM', icon: '🛒' },
    { title: 'Packed & Ready', time: 'Oct 12, 02:45 PM', icon: '📦' },
    { title: 'Out for Delivery', time: 'Oct 13, 09:15 AM', icon: '🛵' },
    { title: 'Delivered', time: 'Pending', icon: '🏠' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border rounded-full hover:bg-gray-50 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Track Order</h1>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">ID: {orderId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Map Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-[500px] w-full bg-slate-100 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
            {/* Simulated Live Map - Styled div representing a map */}
            <div className="absolute inset-0 bg-[#e5e3df] overflow-hidden">
               {/* Grid patterns to simulate map tiles */}
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
               <div className="absolute top-1/2 left-1/3 w-96 h-2 bg-white/40 -rotate-12"></div>
               <div className="absolute top-1/4 left-1/2 w-64 h-2 bg-white/40 rotate-45"></div>
               
               {/* Current User/Destination Marker */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-lg animate-pulse">
                    📍
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">Home</div>
               </div>

               {/* Driver Marker */}
               <div 
                 className="absolute transition-all duration-3000 ease-linear"
                 style={{ 
                   top: `calc(50% + ${(simulatedLocation.lat - 28.6139) * 1000}px)`, 
                   left: `calc(50% + ${(simulatedLocation.lng - 77.2090) * 1000}px)` 
                 }}
               >
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl border-2 border-white transform -rotate-12 scale-110">
                    🛵
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-xl">Driver Moving</div>
               </div>
            </div>

            {/* Map Overlay info */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end gap-4 pointer-events-none">
               <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white flex items-center gap-6 pointer-events-auto">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-3xl">👤</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Partner</p>
                    <p className="font-black text-slate-800 text-lg">Rahul V.</p>
                    <p className="text-xs font-bold text-green-600">Verified Professional</p>
                  </div>
                  <button className="ml-4 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </button>
               </div>
               
               <div className="bg-green-600 text-white px-8 py-5 rounded-[2rem] shadow-2xl text-center flex flex-col items-center pointer-events-auto">
                 <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Est. Arrival</p>
                 <p className="text-3xl font-black">12 MINS</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Tracking Steps */}
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 pointer-events-none">🚀</div>
              <h3 className="text-xl font-black text-slate-800 mb-10 uppercase tracking-tighter">Live Journey</h3>
              
              <div className="space-y-0 relative">
                 {/* Vertical line connecting steps */}
                 <div className="absolute left-6 top-2 bottom-2 w-1 bg-gray-100 rounded-full"></div>
                 <div 
                   className="absolute left-6 top-2 w-1 bg-green-600 rounded-full transition-all duration-1000" 
                   style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
                 ></div>

                 {steps.map((step, idx) => (
                   <div key={idx} className="relative pl-16 pb-12 last:pb-0 flex flex-col">
                      <div className={`absolute left-4 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 transition-all duration-500 ${idx <= currentStep ? 'bg-green-600 scale-125' : 'bg-gray-200'}`}></div>
                      <div className="flex items-start gap-4">
                        <span className="text-2xl grayscale group-hover:grayscale-0 transition">{step.icon}</span>
                        <div>
                          <p className={`font-black text-sm uppercase tracking-tight ${idx <= currentStep ? 'text-slate-800' : 'text-gray-300'}`}>{step.title}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{step.time}</p>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-lg font-black mb-4 uppercase tracking-widest text-green-400">Security Note</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">Please share the OTP <span className="text-white font-black bg-white/10 px-2 py-0.5 rounded">4920</span> with the delivery partner only when you receive the item in hand.</p>
              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Delivery To</p>
                 <p className="font-bold text-sm">{user?.name}</p>
                 <p className="text-xs text-white/40">{user?.location}, {user?.pincode}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
