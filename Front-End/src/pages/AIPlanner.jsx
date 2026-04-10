// src/pages/AIPlanner.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, MapPin, Calendar, Users, 
  Search, Wand2, ArrowRight, Plane,
  Hotel, Utensils, Cloud, Package,
  History, Camera, Clock
} from 'lucide-react';

export default function AIPlanner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [destination, setDestination] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full font-bold text-sm"
        >
          <Sparkles size={16} /> AI-POWERED TRIP ENGINE
        </motion.div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white">Where to next?</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Our AI will craft the perfect itinerary based on your soul.</p>
      </header>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
              <input 
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="Ex: Amalfi Coast, Italy"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white dark:placeholder-slate-500" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-2">Dates</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" size={20} />
              <input 
                type="text"
                placeholder="June 12 - June 24"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white dark:placeholder-slate-500" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-bold">TRIP TYPE</p>
                <p className="font-bold text-slate-700 dark:text-slate-200">Solo Adventure</p>
              </div>
           </div>
           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                <Search size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-bold">VIBE</p>
                <p className="font-bold text-slate-700 dark:text-slate-200">Nature & Relax</p>
              </div>
           </div>
           <button 
             onClick={handleGenerate}
             disabled={isGenerating || !destination}
             className="bg-slate-900 dark:bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black dark:hover:bg-brand-700 transition-all disabled:opacity-50"
           >
             {isGenerating ? 'Analyzing...' : <><Wand2 size={20} /> Generate</>}
           </button>
        </div>
      </section>

      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 py-20"
          >
             <div className="relative">
                <div className="w-24 h-24 border-4 border-brand-200 dark:border-slate-800 border-t-brand-600 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-600" size={32} />
             </div>
             <div className="text-center">
                <p className="text-xl font-bold text-slate-700 dark:text-slate-200 animate-pulse">Scanning 1,000+ local hotspots...</p>
                <p className="text-slate-400">Optimizing budget and weather forecasts</p>
             </div>
          </motion.div>
        )}

        {showResult && !isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Plane, label: "Transport Suggestion", val: "Direct Flight + Local E-Scooters", color: "bg-blue-500" },
                { icon: Clock, label: "Time Estimation", val: "4h Travel / 12h Total", color: "bg-amber-500" },
                { icon: Search, label: "Budget Estimation", val: "$1,450 Total", color: "bg-emerald-500" },
                { icon: Hotel, label: "Hotel Match", val: "The Grand Meridian (Eco-suite)", color: "bg-purple-500" },
                { icon: Utensils, label: "Food Guide", val: "8 Local Favorites Found", color: "bg-orange-500" },
                { icon: Cloud, label: "Weather Forecast", val: "22°C - Mostly Sunny", color: "bg-sky-500" },
                { icon: Package, label: "Packing List", val: "12 Items Suggested", color: "bg-indigo-500" },
                { icon: Camera, label: "Photo Spots", val: "6 Golden Hour Points", color: "bg-pink-500" },
                { icon: History, label: "Personalized", val: "Matches your History", color: "bg-slate-700" }
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.label}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white mb-4`}>
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">{item.label}</h4>
                  <p className="text-slate-800 dark:text-slate-200 font-bold">{item.val}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
               <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 dark:text-white">
                 <Calendar className="text-brand-600" /> Itinerary Timeline
               </h3>
               <div className="space-y-12 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
                  {[
                    { time: "08:00 AM", event: "Morning Yoga at the Beach", tag: "Wellness" },
                    { time: "11:30 AM", event: "Local Market Food Tour", tag: "Food" },
                    { time: "03:00 PM", event: "Coastal Hike to Hidden Cove", tag: "Adventure" },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-10 relative">
                       <div className="w-12 h-12 rounded-full bg-brand-500 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white z-10">
                         {i + 1}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-bold text-brand-600">{act.time}</p>
                          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{act.event}</h4>
                          <span className="inline-block mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {act.tag}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-12 flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-brand-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all">
                    Save Itinerary <ArrowRight size={18} />
                  </button>
                  <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                    Edit Plan
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}