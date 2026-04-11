import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, MapPin, Calendar, Users, 
  Search, Wand2, Plane, Hotel, 
  Utensils, Cloud, Package, Camera, 
  AlertCircle, Wallet, Info, Train, 
  Map, Lightbulb, History as HistoryIcon,
  MapPinned
} from 'lucide-react';

export default function AIPlanner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]); // Array untuk menampung data dari PostgreSQL
  const [error, setError] = useState('');
  
  // Input States
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [budget, setBudget] = useState('');
  const [tripType, setTripType] = useState('Solo Adventure');
  const [vibe, setVibe] = useState('Nature & Relax');

  const getApiBase = () => {
    const currentIP = window.location.hostname;
    return `http://${currentIP}:5000`;
  };

  // LOAD HISTORY DARI POSTGRESQL SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${getApiBase()}/api/planner/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        
        if (result.success && Array.isArray(result.data)) {
          setHistory(result.data);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    if (!origin || !destination || !dates || !budget) {
      setError('Please fill in Origin, Destination, Dates, and Budget.');
      return;
    }
    
    setError('');
    setIsGenerating(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${getApiBase()}/api/planner/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ origin, destination, dates, budget, tripType, vibe })
      });

      const result = await res.json();
      
      if (result.success) {
        // Tambahkan data baru (format DB) ke urutan paling atas
        setHistory(prev => [result.data, ...prev]);
        
        // Reset form agar user tahu proses selesai
        setOrigin('');
        setDestination('');
        setDates('');
        setBudget('');
      } else {
        setError(result.error || 'Failed to generate plan.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full font-bold text-sm"
        >
          <Sparkles size={16} /> AI MASTER PLANNER
        </motion.div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Where to next?</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Detailed flights, hotels, and day-by-day routing curated to your budget.</p>
      </header>

      {/* FORM INPUT */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 font-bold text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Flying From</label>
            <div className="relative">
              <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
              <input 
                value={origin} onChange={e => setOrigin(e.target.value)}
                placeholder="Ex: Jakarta, Indonesia"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Destination</label>
            <div className="relative">
              <MapPinned className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
              <input 
                value={destination} onChange={e => setDestination(e.target.value)}
                placeholder="Ex: Tokyo, Japan"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Dates</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
              <input 
                value={dates} onChange={e => setDates(e.target.value)}
                placeholder="Ex: Oct 10 - Oct 15 (5 Days)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Max Budget (Total)</label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
              <input 
                value={budget} onChange={e => setBudget(e.target.value)}
                placeholder="Ex: $1,500 or Rp 15.000.000"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-600 shadow-sm shrink-0">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-bold">TRIP TYPE</p>
                <select 
                  value={tripType} onChange={e => setTripType(e.target.value)}
                  className="bg-transparent w-full font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                >
                  <option>Solo Adventure</option>
                  <option>Couples Getaway</option>
                  <option>Family Trip</option>
                  <option>Friends Group</option>
                </select>
              </div>
           </div>

           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                <Search size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-bold">VIBE</p>
                <select 
                  value={vibe} onChange={e => setVibe(e.target.value)}
                  className="bg-transparent w-full font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                >
                  <option>Nature & Relax</option>
                  <option>City & Culture</option>
                  <option>Party & Nightlife</option>
                  <option>Food & Culinary</option>
                </select>
              </div>
           </div>

           <button 
             onClick={handleGenerate}
             disabled={isGenerating}
             className="bg-brand-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-700 hover:scale-[1.02] transition-all shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:scale-100"
           >
             {isGenerating ? 'Crafting Plan...' : <><Wand2 size={22} /> Generate Plan</>}
           </button>
        </div>
      </section>

      {/* LOADER */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 py-10"
          >
             <div className="relative">
                <div className="w-24 h-24 border-4 border-brand-200 dark:border-slate-800 border-t-brand-600 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-600" size={32} />
             </div>
             <div className="text-center space-y-2">
                <p className="text-2xl font-black text-slate-800 dark:text-white animate-pulse">Calculating complex logistics...</p>
                <p className="text-slate-500 font-medium">Matching flights from {origin || 'origin'} to {destination || 'destination'} under {budget || 'budget'}...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT HISTORY (DARI DATABASE) */}
      <div className="space-y-16">
        {history.length > 0 && (
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-4">
            <HistoryIcon size={16} /> Trip History ({history.length})
          </div>
        )}

        {history.map((dbItem, index) => {
          // Parsing plan_data jika PostgreSQL mengembalikannya sebagai string
          let data = dbItem.plan_data;
          if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch(e) { return null; }
          }
          
          if (!data || !data.summary) return null; // Safety check

          return (
            <motion.div 
              key={dbItem.id || index}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-10 bg-slate-50/50 dark:bg-slate-900/20 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 relative"
            >
              {/* TIMESTAMP */}
              {dbItem.created_at && (
                <div className="absolute top-8 right-8 text-xs font-bold text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-sm">
                  Generated: {new Date(dbItem.created_at).toLocaleDateString()}
                </div>
              )}

              {/* QUICK SUMMARY */}
              <div className="flex flex-wrap gap-4 items-center justify-center bg-slate-900 dark:bg-brand-950 p-6 rounded-3xl text-white">
                <span className="font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl"><Plane size={18}/> {data.summary.origin} ➔ {data.summary.destination}</span>
                <span className="font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl"><Calendar size={18}/> {data.summary.duration}</span>
                <span className="font-bold flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl"><Wallet size={18}/> Used: {data.summary.total_budget_used}</span>
                <span className="font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl"><Cloud size={18}/> {data.summary.weather}</span>
              </div>

              {/* LOGISTICS (FLIGHT, HOTEL, TRANSPORT) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Flight */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 text-slate-50 dark:text-slate-800/50 group-hover:scale-110 transition-transform"><Plane size={140} /></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6"><Plane size={24} /></div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Flight Strategy</h3>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">{data.logistics.flight.route}</p>
                    <p className="text-sm text-slate-500 mb-4"><span className="font-bold text-emerald-500">{data.logistics.flight.est_cost}</span></p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex gap-3 text-sm text-blue-800 dark:text-blue-300 font-medium">
                      <Info size={18} className="shrink-0" /> {data.logistics.flight.tip}
                    </div>
                  </div>
                </div>

                {/* Hotel */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 text-slate-50 dark:text-slate-800/50 group-hover:scale-110 transition-transform"><Hotel size={140} /></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6"><Hotel size={24} /></div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Accommodation</h3>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">{data.logistics.hotel.name}</p>
                    <p className="text-xs text-slate-500 mb-2"><MapPin size={12} className="inline mr-1"/>{data.logistics.hotel.area}</p>
                    <p className="text-sm text-slate-500 mb-4"><span className="font-bold text-emerald-500">{data.logistics.hotel.price_per_night}</span></p>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl flex gap-3 text-sm text-purple-800 dark:text-purple-300 font-medium">
                      <Sparkles size={18} className="shrink-0" /> {data.logistics.hotel.why_stay_here}
                    </div>
                  </div>
                </div>

                {/* Transport */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 text-slate-50 dark:text-slate-800/50 group-hover:scale-110 transition-transform"><Train size={140} /></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><Train size={24} /></div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4">Local Transport</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Airport Transfer</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{data.logistics.transport.airport_transfer}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Daily Commute</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{data.logistics.transport.daily_getting_around}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* TIMELINE DETIL */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                   <h3 className="text-2xl font-black mb-8 flex items-center gap-3 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-6">
                     <Map className="text-brand-600" /> Day-by-Day Routing
                   </h3>
                   
                   <div className="space-y-12">
                     {data.itinerary.map((dayPlan, dayIdx) => (
                       <div key={dayIdx} className="space-y-8 relative">
                          <div className="sticky top-4 z-20 bg-brand-50 dark:bg-brand-900/20 px-6 py-3 rounded-2xl border border-brand-100 dark:border-brand-800 shadow-sm w-max">
                            <h4 className="font-black text-brand-700 dark:text-brand-400 text-lg">
                              {dayPlan.day} <span className="text-slate-400 font-medium text-sm ml-2">| {dayPlan.date}</span>
                            </h4>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">{dayPlan.daily_theme}</p>
                          </div>
                          
                          <div className="space-y-8 relative before:absolute before:left-[1.35rem] before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 ml-2">
                            {dayPlan.activities.map((act, actIdx) => (
                              <div key={actIdx} className="flex gap-6 relative pl-12 group">
                                 <div className="absolute left-0 w-12 h-12 -ml-2.5 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 font-black shadow-sm group-hover:scale-110 group-hover:border-brand-500 group-hover:text-brand-600 transition-all z-10">
                                   {actIdx + 1}
                                 </div>
                                 <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 group-hover:shadow-md transition-shadow">
                                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                                      <p className="text-sm font-black text-brand-600 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{act.time}</p>
                                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                                        <MapPin size={12} /> {act.location}
                                      </span>
                                    </div>
                                    
                                    <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">{act.event}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">{act.description}</p>
                                    
                                    {act.insider_tip && (
                                      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-3 rounded-xl flex gap-3 text-sm text-amber-800 dark:text-amber-500 font-medium mb-4">
                                        <Lightbulb size={18} className="shrink-0" /> {act.insider_tip}
                                      </div>
                                    )}

                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <Train size={14} className="text-slate-400" /> {act.transport}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                                        <Wallet size={14} /> Est: {act.cost}
                                      </div>
                                    </div>
                                 </div>
                              </div>
                            ))}
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* SIDEBAR (PACKING LIST) */}
                <div className="space-y-6">
                  <div className="bg-slate-900 dark:bg-brand-900 text-white p-8 rounded-[3rem] shadow-xl">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                      <Package className="text-brand-400" /> Essential Packing
                    </h3>
                    <ul className="space-y-4">
                      {data.packing_list.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm font-medium text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                          <span className="text-brand-400 font-bold">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-brand-50 dark:bg-slate-900 border border-brand-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm">
                    <h3 className="text-lg font-black text-brand-800 dark:text-white mb-2">Must-Have Apps</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {data.summary.best_app_to_download}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}