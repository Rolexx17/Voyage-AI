import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, MapPin, Calendar, Users, 
  Search, Wand2, Plane, Hotel, 
  Cloud, Package, AlertCircle, Wallet, 
  Info, Train, Map, Lightbulb, MapPinned, 
  Plus, ChevronRight, Clock, Briefcase, 
  Utensils, Coffee, Trash2
} from 'lucide-react';

export default function AIPlanner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]); 
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');
  
  // State untuk Modal Delete Kustom
  const [deleteId, setDeleteId] = useState(null);

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

  // LOAD HISTORY DARI POSTGRESQL SAAT HALAMAN DIMUAT
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

  // FUNGSI GENERATE PLAN BARU
  const handleGenerate = async () => {
    if (!origin || !destination || !dates || !budget) {
      setError('Please fill in Origin, Destination, Dates, and Budget.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setSelectedPlan(null);

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
        setHistory(prev => [result.data, ...prev]);
        setSelectedPlan(result.data);
        setOrigin(''); setDestination(''); setDates(''); setBudget('');
      } else {
        setError(result.error || 'Failed to generate plan.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // FUNGSI KONFIRMASI HAPUS (MODAL KUSTOM)
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${getApiBase()}/api/planner/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await res.json();
      if (result.success) {
        setHistory(prev => prev.filter(item => item.id !== deleteId));
        if (selectedPlan && selectedPlan.id === deleteId) {
          setSelectedPlan(null);
        }
        setDeleteId(null); // Tutup modal
      }
    } catch (err) {
      alert("Server error while deleting.");
    }
  };

  // AMAN PARSING DATA DARI DATABASE POSTGRESQL
  const getPlanData = (dbItem) => {
    if (!dbItem) return null;
    let data = dbItem.plan_data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch(e) { return null; }
    }
    return data;
  };

  const activeData = getPlanData(selectedPlan);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pb-20 relative">
      
      {/* ================= MODAL DELETE KUSTOM ================= */}
      <AnimatePresence>
        {deleteId && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-slate-100 dark:border-slate-800"
            >
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Delete Trip?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">This action cannot be undone. Your masterpiece will be lost forever.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SIDEBAR HISTORY ================= */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        <button 
          onClick={() => setSelectedPlan(null)}
          className="w-full bg-brand-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30"
        >
          <Plus size={20} /> Create New Trip
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-4 h-[600px] overflow-y-auto custom-scrollbar shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Trip History</h3>
          <div className="space-y-2">
            {history.length === 0 && <p className="text-sm text-slate-500 italic px-2">No trips planned yet.</p>}
            
            {history.map((item) => {
              const data = getPlanData(item);
              if (!data || !data.summary) return null;
              
              const isSelected = selectedPlan?.id === item.id;
              
              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedPlan(item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border group relative overflow-hidden ${isSelected ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                >
                  <div className="pr-8">
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-brand-700 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'} truncate`}>
                      {data.summary.destination}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                      <span>{data.summary.duration}</span>
                      <ChevronRight size={14} className={isSelected ? 'text-brand-500' : 'opacity-0'} />
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(item.id);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl opacity-0 md:group-hover:opacity-100 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1">
        
        {/* FORM INPUT */}
        {!selectedPlan && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <header className="space-y-4">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full font-bold text-sm">
                <Sparkles size={16} /> AI MASTER PLANNER
              </motion.div>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Where to next?</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Define your parameters, and our AI will calculate the perfect logistics.</p>
            </header>

            <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
              {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 font-bold text-sm"><AlertCircle size={18} /> {error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Flying From</label>
                  <div className="relative">
                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
                    <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Ex: Jakarta (CGK)" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Destination</label>
                  <div className="relative">
                    <MapPinned className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
                    <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Ex: Tokyo (HND)" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Dates</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
                    <input value={dates} onChange={e => setDates(e.target.value)} placeholder="Ex: Oct 10 - Oct 15 (5 Days)" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-2">Max Budget (Total)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
                    <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="Ex: $1,500" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-600 shadow-sm shrink-0"><Users size={20} /></div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-bold">TRIP TYPE</p>
                      <select value={tripType} onChange={e => setTripType(e.target.value)} className="dark:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700 outline-none">
                        <option>Solo Adventure</option><option>Couples Getaway</option><option>Family Trip</option><option>Friends Group</option>
                      </select>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0"><Search size={20} /></div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-bold">VIBE</p>
                      <select value={vibe} onChange={e => setVibe(e.target.value)} className="dark:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700 outline-none">
                        <option>Nature & Relax</option><option>City & Culture</option><option>Party & Nightlife</option><option>Food & Culinary</option>
                      </select>
                    </div>
                </div>
              </div>

              <button onClick={handleGenerate} className="w-full bg-brand-600 text-white rounded-2xl py-4 font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-700 hover:scale-[1.01] transition-all shadow-lg shadow-brand-500/30">
                <Wand2 size={22} /> Generate Master Plan
              </button>
            </section>
          </motion.div>
        )}

        {/* LOADER */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-[600px] gap-6">
              <div className="relative">
                  <div className="w-24 h-24 border-4 border-brand-200 dark:border-slate-800 border-t-brand-600 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-600" size={32} />
              </div>
              <div className="text-center space-y-2">
                  <p className="text-2xl font-black text-slate-800 dark:text-white animate-pulse">Calculating complex logistics...</p>
                  <p className="text-slate-500 font-medium">Finding the best flights, detailed hotel routes, and culinary spots.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HASIL ITINERARY DETAIL */}
        {activeData && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            <div className="bg-slate-900 dark:bg-brand-950 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
              <Map className="absolute -right-10 -bottom-10 text-white/5" size={200} />
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-4">{activeData.summary.origin} <Plane className="inline mx-2 text-brand-400" size={24}/> {activeData.summary.destination}</h2>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl"><Calendar size={18}/> {activeData.summary.duration}</span>
                  <span className="font-bold flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl"><Wallet size={18}/> Used: {activeData.summary.total_budget_used}</span>
                  <span className="font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl"><Cloud size={18}/> {activeData.summary.weather}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FLIGHT DETAIL */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center"><Plane size={24} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">Flight Details</h3>
                    <p className="text-xs font-bold text-emerald-500">{activeData.logistics.flight.est_cost}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Airline</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{activeData.logistics.flight.airline}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Route & Time</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{activeData.logistics.flight.route}</p>
                  </div>
                  <div className="flex gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 items-center px-2">
                    <Briefcase size={16} className="text-slate-400 shrink-0"/> {activeData.logistics.flight.baggage_info}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                    <Info size={18} className="shrink-0 mt-0.5" /> <span className="font-medium">{activeData.logistics.flight.tip}</span>
                  </div>
                </div>
              </div>

              {/* HOTEL DETAIL */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center"><Hotel size={24} /></div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">Accommodation</h3>
                    <p className="text-xs font-bold text-emerald-500">{activeData.logistics.hotel.price_per_night}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Hotel Name & Room</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{activeData.logistics.hotel.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{activeData.logistics.hotel.room_type}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Location</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200"><MapPin size={14} className="inline mr-1 text-brand-500"/>{activeData.logistics.hotel.area}</p>
                  </div>
                  <div className="flex gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 items-center px-2">
                    <Coffee size={16} className="text-slate-400 shrink-0"/> {activeData.logistics.hotel.amenities}
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl flex gap-3 text-sm text-purple-800 dark:text-purple-300">
                    <Sparkles size={18} className="shrink-0 mt-0.5" /> <span className="font-medium">{activeData.logistics.hotel.why_stay_here}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ITINERARY TIMELINE */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-6">
                <Map className="text-brand-600" /> Exhaustive Day-by-Day Routing
              </h3>
              
              <div className="space-y-12">
                {activeData.itinerary.map((dayPlan, dayIdx) => (
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
                                <p className="text-sm font-black text-brand-600 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                                  <Clock size={14} /> {act.time}
                                </p>
                                <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                                  <MapPin size={12} /> {act.location}
                                </span>
                              </div>
                              
                              <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">{act.event}</h4>
                              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">{act.description}</p>

                              {act.food_recommendation && (
                                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-4 rounded-2xl flex gap-3 text-sm text-orange-800 dark:text-orange-500 font-medium mb-4">
                                  <Utensils size={18} className="shrink-0 mt-0.5" /> 
                                  <div>
                                    <span className="font-bold block mb-1">Food Recommendation:</span>
                                    {act.food_recommendation}
                                  </div>
                                </div>
                              )}
                              
                              {act.insider_tip && (
                                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-3 rounded-xl flex gap-3 text-sm text-amber-800 dark:text-amber-500 font-medium mb-4">
                                  <Lightbulb size={18} className="shrink-0 mt-0.5" /> {act.insider_tip}
                                </div>
                              )}

                              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                  <Train size={14} className="text-slate-400" /> {act.transport}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                                  <Wallet size={14} /> Cost Est: {act.cost}
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

            {/* TRANSPORT & PACKING */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 dark:bg-brand-900 text-white p-8 rounded-[3rem] shadow-xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <Package className="text-brand-400" /> Essential Packing
                </h3>
                <ul className="space-y-4">
                  {activeData.packing_list.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm font-medium text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                      <span className="text-brand-400 font-bold">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-50 dark:bg-slate-900 border border-brand-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm">
                <h3 className="text-xl font-black text-brand-800 dark:text-white mb-6 flex items-center gap-3">
                  <Train className="text-brand-600" /> Local Commute Guide
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Airport to Hotel Transfer</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{activeData.logistics.transport.airport_transfer}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Daily Getting Around</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{activeData.logistics.transport.daily_getting_around}</p>
                  </div>
                  <div className="pt-4 border-t border-brand-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Must-Have Apps</p>
                    <p className="text-sm font-medium text-brand-600 dark:text-brand-400">{activeData.summary.best_app_to_download}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}