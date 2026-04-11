import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Sparkles, Navigation, Lightbulb, 
  Compass, Loader2, PlaneTakeoff, Wallet, ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState("Detecting location...");

  useEffect(() => {
    const fetchDashboardData = async (lat, lng) => {
      try {
        const token = localStorage.getItem('token');
        // Gunakan template literal yang benar
        let url = `http://localhost:5000/api/dashboard/insights`;
        if (lat && lng) {
          url += `?lat=${lat}&lng=${lng}`;
        }

        const res = await fetch(url, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        const result = await res.json();

        if (result.success) {
          setData(result.data);
          console.log("Dashboard Data Loaded:", result.data); // Untuk debugging
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus("Generating AI insights for your area...");
          fetchDashboardData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Location permission denied");
          setLocationStatus("Using global traveler insights...");
          fetchDashboardData(null, null);
        },
        { timeout: 10000 }
      );
    } else {
      fetchDashboardData(null, null);
    }
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {loading ? `Welcome, ${user?.name || 'Traveler'}` : data?.greeting}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-2">
            <MapPin size={18} className="text-brand-500" />
            {loading ? locationStatus : `Currently exploring: ${data?.locationDetected}`}
          </p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-64 text-brand-500 space-y-4"
          >
            <Loader2 className="animate-spin" size={48} />
            <p className="font-bold text-slate-500 animate-pulse">{locationStatus}</p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* AI DAILY RECOMMENDATION (HERO CARD) */}
            <div className="md:col-span-2 bg-gradient-to-br from-brand-600 to-indigo-700 p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl text-white group">
              <div className="relative z-10">
                <div className="bg-white/20 backdrop-blur-md w-max px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2 border border-white/20">
                  <Sparkles size={14} className="text-yellow-300" /> Today's Mission
                </div>
                <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-4 max-w-lg">
                  {data?.daily_recommendation}
                </h2>
                <button onClick={() => navigate('/planner')} className="mt-4 bg-white text-brand-700 px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
                  <Compass size={18} /> Open AI Planner
                </button>
              </div>
              <Navigation size={240} className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" />
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-4 flex flex-col justify-between">
              <button onClick={() => navigate('/recommendations')} className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] flex items-center gap-4 hover:shadow-lg transition-shadow text-left group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlaneTakeoff size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Curated For You</h3>
                  <p className="text-xs text-slate-500 font-medium">Discover local spots</p>
                </div>
              </button>
              
              <button onClick={() => navigate('/expenses')} className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] flex items-center gap-4 hover:shadow-lg transition-shadow text-left group">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Track Expenses</h3>
                  <p className="text-xs text-slate-500 font-medium">Log today's budget</p>
                </div>
              </button>

              <button onClick={() => navigate('/emergency')} className="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-6 rounded-[2rem] flex items-center gap-4 hover:shadow-lg transition-shadow text-left group">
                <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-red-500/30">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-red-900 dark:text-red-400">Emergency Hub</h3>
                  <p className="text-xs text-red-700/70 dark:text-red-500/70 font-medium">Local 911/112</p>
                </div>
              </button>
            </div>

            {/* FUN FACT */}
            <div className="md:col-span-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-8 rounded-[2.5rem] relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-200 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400">
                  <Lightbulb size={24} />
                </div>
                <h3 className="font-black text-amber-900 dark:text-amber-500 text-lg">Did You Know?</h3>
              </div>
              <p className="text-amber-800/80 dark:text-amber-400/80 font-medium leading-relaxed">
                {data?.fun_fact}
              </p>
            </div>

            {/* LOCAL INSIGHT */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] relative shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                    <Compass size={24} />
                  </div>
                  <h3 className="font-black text-slate-800 dark:text-white text-lg">Local Insight</h3>
                </div>
                <span className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {user?.style || 'Travel'} Style
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-lg">
                {data?.local_insight}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}