import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, Star, Trash2, Calendar, Wand2, Loader2, PenTool } from 'lucide-react';
import { useJournalStore } from '../store/useJournalStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function TravelJournal() {
  const { journals, loading, fetchJournals, addJournal, deleteJournal } = useJournalStore();
  const [formData, setFormData] = useState({ title: '', location: '', story: '', rating: 5, date: new Date().toISOString().split('T')[0] });
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => { fetchJournals(); }, []);

  const handleEnhance = async () => {
    if (!formData.story) return;
    setEnhancing(true);
    try {
      const token = localStorage.getItem('token');
      const currentIP = window.location.hostname;
      const res = await fetch(`${API_BASE}/api/journals/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rawText: formData.story })
      });
      const data = await res.json();
      if (data.success) setFormData({ ...formData, story: data.data.enhancedText });
    } catch (e) { console.error(e); }
    setEnhancing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.story) return;
    addJournal(formData);
    setFormData({ title: '', location: '', story: '', rating: 5, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {/* KIRI: Form Tulis Jurnal */}
      <div className="space-y-6">
        <header>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="text-brand-500" size={36} /> Diary
          </h1>
          <p className="text-slate-500 font-medium mt-2">Log your travel memories.</p>
        </header>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2"><PenTool size={20}/> New Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Entry Title (e.g. Sunset at Kuta)" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-500 transition-all"/>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Location" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-500 transition-all"/>
              <input required type="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-500 transition-all"/>
            </div>
            
            <div className="relative">
              <textarea required rows="4" placeholder="Write your rough notes here..." value={formData.story} onChange={e=>setFormData({...formData, story: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-500 transition-all resize-none custom-scrollbar pb-12"></textarea>
              <button type="button" onClick={handleEnhance} disabled={enhancing || !formData.story} className="absolute bottom-3 right-3 text-xs font-bold bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-200 transition-colors disabled:opacity-50">
                {enhancing ? <Loader2 size={14} className="animate-spin"/> : <Wand2 size={14}/>} {enhancing ? 'Enhancing...' : 'AI Enhance'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Day Rating</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={24} onClick={() => setFormData({...formData, rating: star})} className={`cursor-pointer transition-colors ${formData.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600 hover:text-yellow-200'}`} />
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-slate-900 dark:bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-brand-700 transition-all shadow-lg mt-2">
              Save Memory
            </button>
          </form>
        </section>
      </div>

      {/* KANAN: Daftar Jurnal */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {journals.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">Your journal is empty</h3>
                <p className="text-sm text-slate-400 mt-2">Start writing your adventures!</p>
              </div>
            )}
            {journals.map((j) => (
              <motion.div key={j.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white line-clamp-1">{j.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {j.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={12}/> {j.date}</span>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 shrink-0">
                    {[...Array(j.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 font-medium">{j.story}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button onClick={() => deleteJournal(j.id)} className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}