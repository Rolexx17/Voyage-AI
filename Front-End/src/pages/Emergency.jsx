import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Phone, MapPin, HeartPulse, Info, Loader2, Flame, Navigation } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Emergency() {
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Locating...");
  const [hospital, setHospital] = useState({ name: "Detecting nearest facility...", info: "Please wait..." });
  
  const [contacts, setContacts] = useState([
    { label: "Local Police", number: "112", icon: ShieldAlert, color: "bg-blue-600" },
    { label: "Medical Help", number: "112", icon: HeartPulse, color: "bg-emerald-500" },
    { label: "Fire & Rescue", number: "112", icon: Flame, color: "bg-orange-500" }
  ]);

  useEffect(() => {
    const fetchNumbers = async (lat, lng) => {
      try {
        const token = localStorage.getItem('token');
        
        // --- LOGIKA CACHE START ---
        const CACHE_KEY = `voyage_emergency_cache`;
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          // Jika lokasi mirip (selisih < 0.01 derajat atau sekitar 1km) dan belum 24 jam
          const isSameLocation = lat && lng && 
                                Math.abs(cached.lat - lat) < 0.01 && 
                                Math.abs(cached.lng - lng) < 0.01;
          const isFresh = Date.now() - cached.timestamp < 24 * 60 * 60 * 1000;

          if (isSameLocation && isFresh) {
            console.log("Using Cached Emergency Data");
            applyData(cached.data);
            setLoading(false);
            return;
          }
        }
        // --- LOGIKA CACHE END ---

        const currentIP = window.location.hostname;
        const url = lat && lng 
          ? `${API_BASE}/api/emergency/local-numbers?lat=${lat}&lng=${lng}`
          : `${API_BASE}/api/emergency/local-numbers`;
          
        const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        const result = await res.json();

        if (result.success) {
          applyData(result.data);
          // Simpan ke Cache
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            lat, lng, timestamp: Date.now(), data: result.data
          }));
        }
      } catch (err) {
        console.error("Failed to fetch emergency numbers");
        setLocationName("Global Standard (112)");
      } finally {
        setLoading(false);
      }
    };

    const applyData = (result) => {
      setLocationName(result.region || result.country || "Global Standard");
      setContacts([
        { label: "Local Police", number: result.police, icon: ShieldAlert, color: "bg-blue-600" },
        { label: "Medical Help", number: result.medical, icon: HeartPulse, color: "bg-emerald-500" },
        { label: "Fire & Rescue", number: result.fire, icon: Flame, color: "bg-orange-500" }
      ]);
      if (result.hospital) setHospital(result.hospital);
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchNumbers(position.coords.latitude, position.coords.longitude),
        () => fetchNumbers(null, null),
        { timeout: 5000 }
      );
    } else {
      fetchNumbers(null, null);
    }
  }, []);
  
  // Membuat URL Google Maps berdasarkan Nama Rumah Sakit + Kota
  const mapQuery = encodeURIComponent(`${hospital.name} ${locationName}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      <header className="flex flex-col md:flex-row items-center gap-6 p-8 bg-red-50 dark:bg-red-950/30 rounded-[3rem] border border-red-100 dark:border-red-900/30 relative overflow-hidden">
         <div className="w-24 h-24 bg-red-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-red-500/40 shrink-0 z-10">
           <ShieldAlert size={48} />
         </div>
         <div className="text-center md:text-left z-10">
           <h1 className="text-4xl font-black text-red-900 dark:text-red-400 leading-tight">Emergency Assistance</h1>
           <p className="text-red-700 dark:text-red-500 font-bold mt-2 flex items-center justify-center md:justify-start gap-2">
             <MapPin size={18} /> Current Region: 
             {loading ? <Loader2 size={16} className="animate-spin inline" /> : <span className="bg-red-200 dark:bg-red-900/50 px-3 py-1 rounded-full text-red-800 dark:text-red-300">{locationName}</span>}
           </p>
         </div>
         <ShieldAlert size={200} className="absolute -right-10 -bottom-10 text-red-100 dark:text-red-900/10 rotate-12 pointer-events-none" />
      </header>

      {/* EMERGENCY NUMBERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {contacts.map((contact, idx) => (
            <motion.a 
              href={`tel:${contact.number}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={contact.label}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-4 group cursor-pointer hover:shadow-xl transition-all"
            >
               <div className={`w-20 h-20 rounded-[2rem] ${contact.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                 {loading ? <Loader2 size={32} className="animate-spin" /> : <contact.icon size={36} />}
               </div>
               <div>
                 <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">{contact.label}</h3>
                 <p className="text-4xl font-black text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
                    {loading ? '...' : contact.number}
                 </p>
               </div>
               <div className="mt-2 text-sm font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full flex items-center gap-2 group-hover:bg-brand-50 group-hover:text-brand-600 dark:group-hover:bg-brand-900/30 transition-colors">
                 <Phone size={14} /> Tap to Call
               </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* AI NEAREST HOSPITAL */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl mx-auto w-full">
         <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center">
           <MapPin className="text-brand-500" /> Nearest Major Hospital
         </h3>
         
         <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 border border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-red-500 shadow-sm shrink-0">
              {loading ? <Loader2 size={32} className="animate-spin" /> : <HeartPulse size={32} />}
            </div>
            
            <div className="flex-1">
               <h4 className="font-black text-slate-800 dark:text-white text-xl mb-1">
                 {loading ? "Searching via AI..." : hospital.name}
               </h4>
               <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-4">
                 {hospital.info}
               </p>
               
               <a 
                 href={googleMapsUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-700 transition-colors w-full sm:w-auto"
               >
                 <Navigation size={18} /> Get Directions
               </a>
            </div>
         </div>
      </section>

      {/* DISCLAIMER */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-6 rounded-3xl flex gap-4 items-start">
         <div className="bg-amber-200 dark:bg-amber-900/50 p-2 rounded-full shrink-0">
            <Info className="text-amber-600 dark:text-amber-400" size={24} />
         </div>
         <p className="text-sm text-amber-800 dark:text-amber-500 font-medium leading-relaxed">
           Voyage AI automatically detects your GPS location to display the correct local emergency numbers and AI-curated hospital facilities. Always confirm via local authorities in severe emergencies.
         </p>
      </div>
    </div>
  );
}