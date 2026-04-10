// src/pages/Emergency.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Phone, MapPin, HeartPulse, UserCircle2, Info } from 'lucide-react';

export default function Emergency() {
  const contacts = [
    { label: "Emergency Services", number: "112", icon: Phone, color: "bg-red-500" },
    { label: "Local Police", number: "911", icon: ShieldAlert, color: "bg-blue-600" },
    { label: "Medical Help", number: "999", icon: HeartPulse, color: "bg-emerald-500" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <header className="flex items-center gap-6 p-8 bg-red-50 dark:bg-red-950/30 rounded-[3rem] border border-red-100 dark:border-red-900/30">
         <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/40">
           <ShieldAlert size={40} />
         </div>
         <div>
           <h1 className="text-3xl font-black text-red-900 dark:text-red-400 leading-tight">Emergency Assistance</h1>
           <p className="text-red-700 dark:text-red-500 font-medium opacity-80">Quick access to help, wherever you are.</p>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <motion.a 
            href={`tel:${contact.number}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={contact.label}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-4 group cursor-pointer"
          >
             <div className={`w-16 h-16 rounded-3xl ${contact.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-2xl transition-all`}>
               <contact.icon size={32} />
             </div>
             <div>
               <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{contact.label}</h3>
               <p className="text-3xl font-black text-slate-800 dark:text-white">{contact.number}</p>
             </div>
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
              <MapPin className="text-brand-500" /> Nearest Hospital
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex gap-4">
               <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                 <HeartPulse size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Tokyo Central General</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">2.4 km away • 12 min drive</p>
                  <button className="mt-2 text-brand-600 font-bold text-sm">Get Directions →</button>
               </div>
            </div>
         </section>

         <section className="bg-slate-900 dark:bg-brand-900 p-8 rounded-[3rem] text-white transition-colors">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserCircle2 className="text-brand-400" /> Emergency ID
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-slate-400">Blood Type</span>
                 <span className="font-bold">O Positive</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-slate-400">Allergies</span>
                 <span className="font-bold">Peanuts, Penicillin</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-slate-400">Primary Contact</span>
                 <span className="font-bold">+1 (555) 0921</span>
               </div>
            </div>
         </section>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-6 rounded-3xl flex gap-4">
         <Info className="text-amber-600 shrink-0" />
         <p className="text-sm text-amber-800 dark:text-amber-500 font-medium">
           Voyage AI automatically shares your emergency medical data with responders when an emergency call is initiated through the app.
         </p>
      </div>
    </div>
  );
}