import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. IMPORT ICON Train (atau Car/Bus) DI SINI
import { MapPin, Hotel, Utensils, Camera, Sparkles, Loader2, AlertCircle, Search, Train } from 'lucide-react';
import { useRecommendationStore } from '../store/useRecommendationStore';

// 2. TAMBAHKAN KE ARRAY TABS
const TABS = [
  { id: 'destination', label: 'Destinations', icon: MapPin, color: 'text-blue-500' },
  { id: 'hotel', label: 'Hotels', icon: Hotel, color: 'text-purple-500' },
  { id: 'food', label: 'Culinary', icon: Utensils, color: 'text-orange-500' },
  { id: 'photospot', label: 'Photo Spots', icon: Camera, color: 'text-pink-500' },
  { id: 'transport', label: 'Transport', icon: Train, color: 'text-teal-500' } // <--- TAB BARU
];

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState('destination');
  const [searchInput, setSearchInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <header className="text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-3">
          <Sparkles className="text-brand-500" size={36} /> Curated For You
        </h1>
        <p className="text-slate-500 mt-2">Personalized recommendations based on your unique travel profile.</p>
      </header>

      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-brand-500" size={24} />
        </div>
        <input 
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Where are you going? (e.g. Kyoto, Japan)"
          className="w-full p-5 pl-12 pr-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-lg font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-brand-500/20 outline-none shadow-sm"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-brand-600 text-white px-6 rounded-[1.5rem] font-bold hover:bg-brand-700 transition-colors"
        >
          Explore
        </button>
      </form>

      {hasSearched && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="flex flex-wrap gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? tab.color : ''} />
                {tab.label}
              </button>
            ))}
          </div>

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
                  <p className="font-bold animate-pulse text-slate-500">Curating the best {activeTab} in {searchInput}...</p>
                </motion.div>
              ) : (
                <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data[activeTab]?.length > 0 ? (
                    data[activeTab].map((item, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-black text-slate-800 dark:text-white">{item.name}</h3>
                          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                            {item.price_estimate}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-400 mb-2 flex items-center gap-1"><MapPin size={14}/> {item.location}</p>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{item.description}</p>
                        <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-2xl">
                          <p className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase mb-1">Why it fits you</p>
                          <p className="text-sm text-brand-800 dark:text-brand-200">{item.why_it_fits}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    !error && <p className="text-slate-500 italic col-span-2 text-center">No data found.</p>
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