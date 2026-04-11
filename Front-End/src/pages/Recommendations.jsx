import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Hotel, Utensils, Camera, Sparkles, Loader2, AlertCircle, Search, Train, Filter, ArrowUpDown } from 'lucide-react';
import { useRecommendationStore } from '../store/useRecommendationStore';

const TABS = [
  { id: 'destination', label: 'Destinations', icon: MapPin, color: 'text-blue-500' },
  { id: 'hotel', label: 'Hotels', icon: Hotel, color: 'text-purple-500' },
  { id: 'food', label: 'Culinary', icon: Utensils, color: 'text-orange-500' },
  { id: 'photospot', label: 'Photo Spots', icon: Camera, color: 'text-pink-500' },
  { id: 'transport', label: 'Transport', icon: Train, color: 'text-teal-500' }
];

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState('destination');
  const [searchInput, setSearchInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // States untuk Sort & Filter
  const [sortBy, setSortBy] = useState('none'); // none, asc, desc
  const [maxPrice, setMaxPrice] = useState('all'); // all, 20, 50, 100 (in USD)
  
  const { fetchRecommendations, data, loading, error, currentLocation } = useRecommendationStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setHasSearched(true);
    fetchRecommendations(activeTab, searchInput);
  };

  useEffect(() => {
    if (hasSearched && data[activeTab].length === 0 && currentLocation === searchInput) {
      fetchRecommendations(activeTab, searchInput);
    }
  }, [activeTab, hasSearched, currentLocation]);

  // LOGIKA SORT & FILTER
  const getProcessedData = () => {
    let processed = [...(data[activeTab] || [])];

    // 1. Apply Filter (Pastikan angka terbaca benar)
    if (maxPrice !== 'all') {
      processed = processed.filter(item => {
        const price = Number(item.price_usd_value) || 0;
        return price <= parseInt(maxPrice);
      });
    }

    // 2. Apply Sort (Handle Free/0 agar di paling atas saat ASC)
    if (sortBy === 'asc') {
      processed.sort((a, b) => {
        const priceA = Number(a.price_usd_value) || 0;
        const priceB = Number(b.price_usd_value) || 0;
        return priceA - priceB; // 0 akan selalu lebih kecil dari 5000
      });
    } else if (sortBy === 'desc') {
      processed.sort((a, b) => {
        const priceA = Number(a.price_usd_value) || 0;
        const priceB = Number(b.price_usd_value) || 0;
        return priceB - priceA; // Harga tertinggi di atas
      });
    }

    return processed;
  };
  
  const processedData = getProcessedData();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Sparkles className="text-brand-500" size={36} /> Curated For You
        </h1>
        <p className="text-slate-500 mt-2">Discover 10 personalized spots tailored to your preferences.</p>
      </header>

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-brand-500" size={24} />
        </div>
        <input 
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Where are you going? (e.g. Bali, Tokyo)"
          className="w-full p-5 pl-12 pr-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-lg font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-brand-500/20 outline-none"
        />
        <button type="submit" className="absolute right-2 top-2 bottom-2 bg-brand-600 text-white px-6 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-colors">
          Explore
        </button>
      </form>

      {hasSearched && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* TABS */}
          <div className="flex flex-wrap gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${
                  activeTab === tab.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? tab.color : ''} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* FILTER & SORT CONTROLS */}
          <div className="flex flex-wrap gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg font-medium border-none focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="all">All Prices</option>
                <option value="20">Budget (Under $20)</option>
                <option value="100">Moderate (Under $100)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-slate-400" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg font-medium border-none focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="none">Sort by: Recommended</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[400px] relative">
            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl flex items-center gap-2 font-bold mb-4">
                <AlertCircle /> {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 text-brand-500">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <p className="font-bold animate-pulse text-slate-500">Curating 10 amazing options...</p>
                </motion.div>
              ) : (
                <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {processedData.length > 0 ? (
                    processedData.map((item, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-black text-slate-800 dark:text-white">{item.name}</h3>
                          <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                            {item.price_estimate}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 mb-2 flex items-center gap-1"><MapPin size={14}/> {item.location}</p>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{item.description}</p>
                        <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-2xl">
                          <p className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase mb-1">Why it fits you</p>
                          <p className="text-sm text-brand-800 dark:text-white">{item.why_it_fits}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    !error && <p className="text-slate-500 italic col-span-2 text-center">No options match your filter.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}