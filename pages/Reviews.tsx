
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ReviewsPageProps {
  products: Product[];
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ products }) => {
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const allReviews = useMemo(() => {
    return products.flatMap(p => 
      p.reviews.map(r => ({ ...r, productName: p.name, productId: p.id }))
    );
  }, [products]);

  const filteredReviews = useMemo(() => {
    if (selectedRating === 'all') return allReviews;
    return allReviews.filter(r => r.rating === selectedRating);
  }, [allReviews, selectedRating]);

  // For the featured slider
  const featuredReviews = useMemo(() => {
    return [...allReviews].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [allReviews]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredReviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredReviews.length) % featuredReviews.length);
  };

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 blur-[120px] rounded-full -mr-20 -mt-20"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            COMMUNITY <br/><span className="text-green-400">VOICE</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl mx-auto text-lg">
            Read real feedback from students and parents sharing school essentials across the globe.
          </p>
        </div>
      </section>

      {/* Featured Slider */}
      <section className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100 flex flex-col items-center">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-green-600 mb-10">Top Shared Stories</div>
          
          <div className="relative w-full overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {featuredReviews.map((rev, i) => (
                <div key={i} className="min-w-full px-4 flex flex-col items-center text-center space-y-8">
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, star) => (
                      <svg key={star} className={`w-6 h-6 ${star < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-100 fill-current'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-2xl md:text-3xl font-black text-slate-800 leading-tight tracking-tight italic">
                    "{rev.comment}"
                  </blockquote>
                  <div className="flex flex-col items-center pt-8 border-t border-gray-50 w-full">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-gray-500 mb-2">{rev.userName.charAt(0)}</div>
                    <p className="font-black text-slate-800 uppercase tracking-tighter">{rev.userName}</p>
                    <Link to={`/product/${rev.productId}`} className="text-xs font-bold text-green-600 hover:underline">Item: {rev.productName}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <button onClick={prevReview} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex items-center gap-2">
              {featuredReviews.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? 'w-8 bg-green-600' : 'w-2 bg-gray-200'}`}></div>
              ))}
            </div>
            <button onClick={nextReview} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Filtered Wall Section */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Verified Feedback</h2>
            <p className="text-gray-500 font-medium">Browse through all reviews shared by our community.</p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-white border rounded-[2rem] shadow-sm">
            <button 
              onClick={() => setSelectedRating('all')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedRating === 'all' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-gray-400 hover:text-slate-800'}`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map(star => (
              <button 
                key={star}
                onClick={() => setSelectedRating(star)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedRating === star ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-gray-400 hover:text-slate-800'}`}
              >
                {star} <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.length > 0 ? filteredReviews.map((rev, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, star) => (
                    <svg key={star} className={`w-3.5 h-3.5 ${star < rev.rating ? 'fill-current' : 'text-gray-100 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{rev.date}</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed italic group-hover:text-green-700 transition">"{rev.comment}"</p>
              <div className="flex items-center gap-4 pt-8 border-t border-gray-50 mt-8">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-black text-xs">{rev.userName.charAt(0)}</div>
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{rev.userName}</p>
                  <Link to={`/product/${rev.productId}`} className="text-[10px] font-bold text-gray-400 hover:text-green-600">RE: {rev.productName}</Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-40 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-4xl mb-6">🏜️</div>
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">No Feedback Here Yet</h3>
              <p className="text-gray-400 mt-2">Try selecting a different rating filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Write CTA */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="bg-green-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -ml-20 -mt-20"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Your Opinion <br/>Matters Most</h2>
            <p className="text-green-100 max-w-lg mx-auto font-medium">Have you bought or sold something on Stumarto? Share your experience and help the community grow.</p>
            <Link to="/marketplace" className="inline-block bg-white text-green-600 px-12 py-5 rounded-[2rem] font-black uppercase text-sm shadow-2xl shadow-green-900/40 hover:scale-105 transition-all">Start Reviewing</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
