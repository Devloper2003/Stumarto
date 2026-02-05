
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, ProductType, Review, User } from '../types';
import { getProductEnhancement } from '../services/geminiService';

interface ProductDetailProps {
  products: Product[];
  addToCart: (p: Product) => void;
  currentUser: User | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart, currentUser, setProducts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [smartTips, setSmartTips] = useState<string>('Analyzing product context with AI...');
  const [showContact, setShowContact] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const reportReasons = [
    "Inappropriate content",
    "Fraudulent listing",
    "Wrong category",
    "Prohibited item",
    "Counterfeit product",
    "Spam"
  ];

  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImage(found.imageUrl);
      enhance(found);
    }
  }, [id, products]);

  const enhance = async (p: Product) => {
    const tips = await getProductEnhancement(p.name, p.category);
    setSmartTips(tips);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) { navigate('/login'); return; }
    if (!product) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedProducts = products.map(p => 
      p.id === product.id ? { ...p, reviews: [newReview, ...p.reviews] } : p
    );
    setProducts(updatedProducts);
    setReviewForm({ rating: 5, comment: '' });
    alert("Review shared! Thank you.");
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    setIsSubmittingReport(true);
    
    setTimeout(() => {
      setIsSubmittingReport(false);
      setShowReportModal(false);
      setReportReason('');
      alert("Listing reported successfully. Our team will review it within 24 hours.");
    }, 1500);
  };

  if (!product) return <div className="p-40 text-center font-bold text-gray-400">Loading essentials...</div>;

  const galleryImages = [
    product.imageUrl,
    `https://picsum.photos/seed/${product.id}1/800/800`,
    `https://picsum.photos/seed/${product.id}2/800/800`,
    `https://picsum.photos/seed/${product.id}3/800/800`,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Product Visuals (Enhanced Gallery) */}
        <div className="lg:w-1/2 space-y-6">
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="md:w-24 flex md:flex-col gap-4">
              {galleryImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`flex-1 md:flex-none aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 group hover:scale-105 ${activeImage === img ? 'border-[#16a34a] shadow-xl' : 'border-white shadow-sm opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="Detail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage */}
            <div className="flex-1 aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-white relative group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
              <div className="absolute top-8 left-8">
                 <span className="px-5 py-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">Active Focus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:w-1/2 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-5 py-2 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">{product.category}</span>
                <span className="px-5 py-2 bg-gray-50 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-gray-100">{product.condition}</span>
              </div>
              <button 
                onClick={() => setShowReportModal(true)}
                className="text-[10px] font-black text-red-300 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Flag Listing
              </button>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">{product.name}</h1>
            <div className="flex items-center gap-6">
              <p className="text-5xl font-black text-green-600 tracking-tighter">₹{product.price}</p>
              <div className="h-10 w-px bg-gray-100"></div>
              <div className="flex items-center gap-1.5 text-yellow-400 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-50">
                {[...Array(5)].map((_, i) => (
                   <svg key={i} className={`w-4 h-4 ${i < Math.round(product.reviews.reduce((a,b)=>a+b.rating,0)/(product.reviews.length||1)) ? 'fill-current' : 'text-gray-100 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
                <span className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">{product.reviews.length} Feedbacks</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl group-hover:rotate-12 transition-transform duration-700">💡</div>
             <h4 className="font-black flex items-center gap-3 mb-4 uppercase tracking-widest text-[10px] text-green-400">
               Gemini Context Insights
             </h4>
             <p className="text-base text-gray-300 leading-relaxed font-medium italic whitespace-pre-line">"{smartTips}"</p>
          </div>

          <div className="space-y-4">
             <h3 className="font-black text-xs text-gray-400 uppercase tracking-[0.2em]">Story & Description</h3>
             <p className="text-slate-600 leading-relaxed text-xl font-medium">{product.description}</p>
          </div>

          <div className="pt-4 space-y-6">
            <div className="flex items-center gap-5 p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-3xl">
                 {product.sellerName.charAt(0)}
               </div>
               <div className="flex-1">
                 <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Listed By</p>
                 <p className="font-black text-slate-800 text-xl tracking-tighter">{product.sellerName}</p>
                 <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">{product.location} Hub • {product.pincode}</p>
               </div>
            </div>

            {product.productType === ProductType.PLATFORM_SELL ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => { addToCart(product); navigate('/cart'); }}
                  className="py-5 bg-green-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-900 shadow-2xl shadow-green-200 transition-all active:scale-95"
                >
                  Confirm Purchase
                </button>
                <button 
                  onClick={() => addToCart(product)}
                  className="py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Stumarto Direct Safety</p>
                    <p className="text-xs text-orange-900 font-medium">Coordinate a public meeting spot and inspect the items thoroughly before concluding the deal.</p>
                  </div>
                </div>
                {showContact ? (
                   <div className="p-10 bg-slate-950 text-white rounded-[3rem] space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                      <p className="text-[10px] opacity-40 font-black uppercase tracking-widest text-center">Contact Securely Revealed</p>
                      <div className="flex items-center justify-center gap-6">
                         <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">📱</div>
                         <p className="text-3xl font-black tracking-widest">+91 98XXX-XXXXX</p>
                      </div>
                      <button onClick={() => setShowContact(false)} className="w-full text-center text-[10px] font-black text-white/30 hover:text-white uppercase tracking-[0.2em] transition">Hide Details</button>
                   </div>
                ) : (
                  <button 
                    onClick={() => setShowContact(true)}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-green-600 shadow-2xl transition-all active:scale-95"
                  >
                    Connect with Seller
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
