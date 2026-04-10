// src/pages/Map.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Layers, Search, ZoomIn, ZoomOut } from 'lucide-react';

export default function InteractiveMap() {
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">3D Explorer</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time topographic and points of interest map.</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <input placeholder="Search coordinates..." className="border-none bg-transparent focus:ring-0 text-sm w-48 text-slate-800 dark:text-white dark:placeholder-slate-500" />
             <button className="p-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"><Search size={18} /></button>
          </div>
       </header>

       <div className="flex-1 bg-slate-200 dark:bg-slate-950 rounded-[3rem] border-4 border-white dark:border-slate-900 shadow-2xl relative overflow-hidden group transition-all">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1600')] bg-cover bg-center grayscale brightness-50 opacity-40 dark:opacity-20" />
          
          {/* Animated Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Floating UI Elements */}
          <div className="absolute top-8 right-8 flex flex-col gap-2">
             {[Layers, ZoomIn, ZoomOut, Navigation].map((Icon, i) => (
               <button key={i} className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-xl rounded-2xl text-slate-600 dark:text-slate-400 hover:text-brand-600 transition-all hover:scale-110 border border-transparent dark:border-white/10">
                 <Icon size={20} />
               </button>
             ))}
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between pointer-events-none">
             <div className="bg-slate-900/80 dark:bg-brand-950/90 backdrop-blur-xl p-6 rounded-[2rem] text-white w-72 pointer-events-auto border border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="font-bold flex items-center gap-2"><MapPin className="text-red-500" /> Current Marker</h4>
                   <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold">LIVE</span>
                </div>
                <p className="text-sm font-bold mb-1">Shibuya Crossing, Tokyo</p>
                <p className="text-xs text-slate-400 mb-4">Lat: 35.6595° N, Long: 139.7005° E</p>
                <button className="w-full py-3 bg-brand-600 rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors">View 360° Panorama</button>
             </div>

             <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-3xl pointer-events-auto shadow-2xl border border-white dark:border-white/10 flex gap-4 items-center transition-colors">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/40 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400">
                   <Navigation size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">Proximity</p>
                   <p className="text-sm font-bold text-slate-800 dark:text-slate-200">12 Spots Nearby</p>
                </div>
             </div>
          </div>

          {/* Random Map Markers */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-1/2 left-1/3 w-4 h-4 bg-brand-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg shadow-brand-500/50" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute top-1/4 right-1/4 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg shadow-emerald-500/50" 
          />
       </div>
    </div>
  );
}