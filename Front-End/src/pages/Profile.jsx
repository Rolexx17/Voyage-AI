// src/pages/Profile.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Save, Key } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    style: user?.style || '',
  });

  const [pwd, setPwd] = useState({ old: '', new: '', confirm: '' });
  const [msg, setMsg] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setMsg('Profile updated successfully!');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (pwd.old !== user?.password) return alert('Incorrect old password');
    if (pwd.new !== pwd.confirm) return alert('New passwords do not match');
    updateProfile({ password: pwd.new });
    setMsg('Password changed successfully!');
    setPwd({ old: '', new: '', confirm: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  // Shared classes for consistent styling
  const cardStyle = "bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300";
  const inputStyle = "w-full p-4 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400";
  const labelStyle = "text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-2";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
         <h1 className="text-4xl font-black text-slate-900 dark:text-white">Personal Settings</h1>
         {msg && (
           <motion.span 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold"
           >
             {msg}
           </motion.span>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Sidebar */}
         <div className="lg:col-span-1 space-y-6">
            <div className={`${cardStyle} text-center`}>
               <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 text-4xl font-black">
                     {user?.name ? user.name[0] : <User size={40} />}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-slate-900 dark:bg-brand-600 text-white rounded-full border-4 border-white dark:border-slate-800">
                     <Camera size={18} />
                  </button>
               </div>
               <h2 className="text-2xl font-bold dark:text-white">{user?.name}</h2>
               <p className="text-slate-400 dark:text-slate-500 font-medium mb-6">{user?.email}</p>
               <div className="inline-block px-4 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest">
                  {user?.style || 'Adventure'} Traveler
               </div>
            </div>

            <div className="bg-slate-900 dark:bg-brand-600 p-8 rounded-[3rem] text-white">
               <h3 className="font-bold mb-4 flex items-center gap-2"><Shield size={18} className="text-brand-400 dark:text-white" /> Account Status</h3>
               <p className="text-slate-400 dark:text-brand-100 text-sm mb-4">You are currently using the AI Premium tier with full access to smart routing.</p>
               <button className="w-full py-3 bg-white/10 dark:bg-black/20 hover:bg-white/20 transition-colors rounded-xl font-bold text-sm border border-white/20">Manage Subscription</button>
            </div>
         </div>

         {/* Main Forms */}
         <div className="lg:col-span-2 space-y-8">
            <section className={cardStyle}>
               <h3 className="text-xl font-bold mb-8 flex items-center gap-2 dark:text-white"><User className="text-brand-500" /> Basic Information</h3>
               <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className={labelStyle}>Display Name</label>
                     <input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className={inputStyle}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className={labelStyle}>Email Address</label>
                     <input 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className={inputStyle}
                     />
                  </div>
                  <div className="md:col-span-2">
                    <button className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all">
                       <Save size={20} /> Save Changes
                    </button>
                  </div>
               </form>
            </section>

            <section className={cardStyle}>
               <h3 className="text-xl font-bold mb-8 flex items-center gap-2 dark:text-white"><Key className="text-amber-500" /> Security & Password</h3>
               <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                     <label className={labelStyle}>Current Password</label>
                     <input 
                        type="password"
                        value={pwd.old}
                        onChange={e => setPwd({...pwd, old: e.target.value})}
                        placeholder="••••••••"
                        className={inputStyle}
                     />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className={labelStyle}>New Password</label>
                        <input 
                           type="password"
                           value={pwd.new}
                           onChange={e => setPwd({...pwd, new: e.target.value})}
                           placeholder="••••••••"
                           className={inputStyle}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className={labelStyle}>Confirm New Password</label>
                        <input 
                           type="password"
                           value={pwd.confirm}
                           onChange={e => setPwd({...pwd, confirm: e.target.value})}
                           placeholder="••••••••"
                           className={inputStyle}
                        />
                     </div>
                  </div>
                  <button className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-slate-100 transition-all">
                     Update Password
                  </button>
               </form>
            </section>
         </div>
      </div>
    </div>
  );
}