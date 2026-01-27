
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product, Category, ProductType, Condition } from '../types';

interface MarketplaceProps {
  products: Product[];
  location: string;
  setLocation: (loc: string) => void;
}

/**
 * A custom searchable dropdown component for a better UI/UX.
 */
const SearchableDropdown = ({ 
  label, 
  options, 
  selected, 
  onSelect, 
  placeholder,
  icon 
}: { 
  label: string, 
  options: string[], 
  selected: string, 
  onSelect: (val: string) => void,
  placeholder: string,
  icon: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:border-blue-500 rounded-2xl px-4 py-3 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-600">{icon}</span>
          <span className={`text-sm font-bold ${selected === 'All' ? 'text-gray-400' : 'text-slate-800'}`}>
            {selected === 'All' ? placeholder : selected}
          </span>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-50">
            <input
              autoFocus
              type="text"
              className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-blue-500/20"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            <button
              onClick={() => { onSelect('All'); setIsOpen(false); setSearch(''); }}
              className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-blue-50 transition-colors ${selected === 'All' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
            >
              All {label}s
            </button>
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { onSelect(opt); setIsOpen(false); setSearch(''); }}
                className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-blue-50 transition-colors ${selected === opt ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
              >
                {opt}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-6 text-center text-xs text-gray-400 italic">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Marketplace: React.FC<MarketplaceProps> = ({ products, location, setLocation }) => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') as Category | null;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat || 'All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pincodeFilter, setPincodeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const locations = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];
  const categories = Object.values(Category);

  /**
   * Helper to calculate average rating. 
   * Items with no reviews return 0 to be sorted accordingly.
   */
  const getAvgRating = (product: Product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    return product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchType = selectedType === 'All' || p.productType === selectedType;
      const matchCond = selectedCondition === 'All' || p.condition === selectedCondition;
      const matchPrice = p.price <= priceRange;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLoc = location === 'All Locations' || p.location.includes(location) || location === 'Near My Location';
      const matchPin = !pincodeFilter || p.pincode.startsWith(pincodeFilter);
      return matchCat && matchType && matchCond && matchPrice && matchSearch && matchLoc && matchPin && p.approved;
    });

    switch (sortBy) {
      case 'price_low': result.sort((a, b) => a.price - b.price); break;
      case 'price_high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'rating_high': 
        result.sort((a, b) => getAvgRating(b) - getAvgRating(a)); 
        break;
      case 'rating_low': 
        result.sort((a, b) => getAvgRating(a) - getAvgRating(b)); 
        break;
      default: break;
    }

    return result;
  }, [products, selectedCategory, selectedType, selectedCondition, priceRange, searchQuery, location, pincodeFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 space-y-6 bg-white p-8 rounded-[2.5rem] border shadow-sm h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-xl text-slate-800 uppercase tracking-tighter flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              Smart Filters
            </h3>
          </div>

          <div className="space-y-6">
            {/* Global Search */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Search Anything</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Uniforms, Class 10 Books"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 outline-none transition-all font-bold placeholder:text-gray-300"
                />
                <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </div>

            {/* Pincode & Location */}
            <div className="p-5 bg-blue-50/50 rounded-3xl space-y-4 border border-blue-50">
              <div className="space-y-2">
                <label className="block text-xs font-black text-blue-400 uppercase tracking-widest ml-1">Hyperlocal Reach</label>
                <input 
                  type="text" 
                  value={pincodeFilter}
                  onChange={(e) => setPincodeFilter(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  maxLength={6}
                  className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm font-bold shadow-sm focus:ring-2 ring-blue-500 outline-none transition-all"
                />
              </div>

              <SearchableDropdown 
                label="Location"
                options={locations}
                selected={location === 'All Locations' ? 'All' : location}
                onSelect={(val) => setLocation(val === 'All' ? 'All Locations' : val)}
                placeholder="Select City"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
              />
            </div>

            {/* Category */}
            <SearchableDropdown 
              label="Category"
              options={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              placeholder="All Categories"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>}
            />

            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price Limit</label>
                <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-tighter">₹{priceRange}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-black text-gray-300 uppercase px-1">
                <span>Free</span>
                <span>₹10,000+</span>
              </div>
            </div>

            {/* Deal Type & Condition Toggle */}
            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-2">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                 <button 
                  onClick={() => setSelectedType(selectedType === ProductType.PLATFORM_SELL ? 'All' : ProductType.PLATFORM_SELL)}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${selectedType === ProductType.PLATFORM_SELL ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-100'}`}
                 >
                   E-Shop
                 </button>
               </div>
               <div className="space-y-2">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition</label>
                 <button 
                  onClick={() => setSelectedCondition(selectedCondition === Condition.NEW ? 'All' : Condition.NEW)}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${selectedCondition === Condition.NEW ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-100'}`}
                 >
                   Brand New
                 </button>
               </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50">
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedType('All');
                setSelectedCondition('All');
                setPriceRange(10000);
                setSearchQuery('');
                setPincodeFilter('');
                setLocation('All Locations');
              }}
              className="w-full py-4 text-xs font-black text-red-400 uppercase tracking-widest bg-red-50/50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Clear Preferences
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Marketplace</h1>
                <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-blue-100">{filteredProducts.length} Items</div>
              </div>
              <p className="text-gray-500 font-medium max-w-md">Browse verified school essentials from your local community.</p>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border shadow-sm self-start md:self-auto group">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Order By</span>
               <select 
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="bg-transparent text-sm font-black text-blue-600 outline-none cursor-pointer pr-2"
               >
                 <option value="newest">Latest Arrivals</option>
                 <option value="price_low">Price: Low to High</option>
                 <option value="price_high">Price: High to Low</option>
                 <option value="rating_high">Highest Rated</option>
                 <option value="rating_low">Lowest Rated</option>
               </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map(product => {
                const avgRating = getAvgRating(product);
                return (
                  <div key={product.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500">
                    <div className="h-64 overflow-hidden relative">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                      <div className="absolute top-5 left-5 flex flex-col gap-2">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white shadow-xl ${product.productType === ProductType.PLATFORM_SELL ? 'bg-blue-600' : 'bg-slate-900'}`}>
                           {product.productType === ProductType.PLATFORM_SELL ? 'Buy Securely' : 'Contact Seller'}
                         </span>
                      </div>
                      {product.condition === Condition.NEW && (
                        <div className="absolute top-5 right-5 bg-yellow-400 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase shadow-xl tracking-tighter">Mint Condition</div>
                      )}
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                         <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 px-4 py-1.5 rounded-full uppercase tracking-widest">{product.category}</span>
                         <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg">
                           <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                           <span className="text-xs font-black text-yellow-600">
                             {avgRating > 0 ? avgRating.toFixed(1) : 'New'}
                           </span>
                         </div>
                      </div>
                      <h3 className="font-black text-slate-800 text-xl line-clamp-1 mb-4 group-hover:text-blue-600 transition-colors duration-300">{product.name}</h3>
                      <div className="flex items-end justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{product.price}</span>
                            {product.price > 1000 && <span className="text-[9px] font-black text-green-500 uppercase ml-2 bg-green-50 px-2 py-0.5 rounded">Free Del.</span>}
                          </div>
                          <p className="text-[10px] font-black text-gray-400 flex items-center gap-2 uppercase tracking-tighter bg-gray-50 w-fit pr-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-blue-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {product.location} • {product.pincode}
                          </p>
                        </div>
                        <Link 
                          to={`/product/${product.id}`}
                          className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center shrink-0"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[4rem] border-4 border-dashed border-gray-100 p-24 text-center flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-50 text-blue-500 rounded-[2.5rem] flex items-center justify-center text-6xl mb-8 animate-bounce">🔍</div>
              <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase mb-4">No Gear Found</h3>
              <p className="text-gray-400 font-medium max-w-sm text-lg mb-10 leading-relaxed">We couldn't find matches for these filters. Try refining your search or widening the price limit.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedCondition('All'); setSelectedType('All'); setSearchQuery(''); setPincodeFilter(''); setLocation('All Locations'); }}
                className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                Reset Everything
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
