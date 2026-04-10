// src/pages/Dashboard.jsx
import React from 'react';
import { 
  CloudSun, MapPin, DollarSign, Star, 
  Navigation, Sparkles 
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 group">
    <Icon className={`${colorClass} mb-4 group-hover:scale-110 transition-transform`} />
    <p className="text-xs text-slate-400 font-black uppercase tracking-wider">{label}</p>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
  </div>
);

export default function Dashboard() {
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          Welcome, {user?.name || 'Traveler'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Your AI-curated travel insights for today.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={MapPin} label="Visits" value="12 Countries" colorClass="text-brand-500" />
        <StatCard icon={DollarSign} label="Budget" value="$4,250" colorClass="text-emerald-500" />
        <StatCard icon={Star} label="Loyalty" value="Elite Gold" colorClass="text-amber-500" />
        <StatCard icon={CloudSun} label="Weather" value="24°C Tokyo" colorClass="text-sky-500" />
      </div>

      <div className="bg-slate-900 dark:bg-brand-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl transition-colors">
        <div className="relative z-10">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Sparkles className="text-brand-400" /> AI Recommendation
          </h2>
          <p className="text-slate-300 max-w-lg leading-relaxed">
            Based on your backpacker style, we suggest exploring the hidden temples of Kyoto 
            during the sunrise window (5:30 AM) to avoid the crowds and get the best light for photography.
          </p>
        </div>
        <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10">
          <Navigation size={240} />
        </div>
      </div>
    </div>
  );
}