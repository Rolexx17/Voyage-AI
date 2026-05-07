import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Trash2, CheckCircle2, Circle, Sparkles, Loader2 } from 'lucide-react';
import { usePackingStore } from '../store/usePackingStore';

export default function PackingTracker() {
  const { packingLists, loading, fetchLists, generateList, toggleItem, deleteList } = usePackingStore();
  const [dest, setDest] = useState('');
  const [dur, setDur] = useState('');
  const [vibe, setVibe] = useState('Summer/Warm');

  useEffect(() => { fetchLists(); }, []);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!dest || !dur) return;
    generateList({ destination: dest, duration: dur, vibe });
    setDest(''); setDur('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Briefcase className="text-brand-500" size={40} /> AI Packing
          </h1>
          <p className="text-slate-500 font-medium mt-2">Generate perfect packing lists powered by AI.</p>
        </div>
      </header>

      {/* Generator Form */}
      <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Destination</label>
            <input required value={dest} onChange={e=>setDest(e.target.value)} placeholder="Bali, Japan..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-500 transition-all"/>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Duration (Days)</label>
            <input required type="number" value={dur} onChange={e=>setDur(e.target.value)} placeholder="5" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-500 transition-all"/>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Vibe / Weather</label>
            <select value={vibe} onChange={e=>setVibe(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white focus:ring-2 focus:ring-brand-500 transition-all">
              <option>Summer / Warm</option><option>Winter / Cold</option><option>Business Trip</option><option>Hiking / Adventure</option>
            </select>
          </div>
          <div className="flex items-end">
            <button disabled={loading} className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 disabled:opacity-70">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> Magic Generate</>}
            </button>
          </div>
        </form>
      </section>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {packingLists.map((list) => {
            const packedCount = list.items.filter(i => i.isPacked).length;
            const progress = Math.round((packedCount / list.items.length) * 100) || 0;
            
            return (
              <motion.div key={list.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white">{list.title}</h3>
                    <p className="text-sm font-medium text-brand-500 mt-1">{progress}% Packed ({packedCount}/{list.items.length})</p>
                  </div>
                  <button onClick={() => deleteList(list.id)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><Trash2 size={20}/></button>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700">
                  <motion.div className="h-full bg-brand-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>

                <div className="p-6 flex-1 max-h-80 overflow-y-auto custom-scrollbar space-y-2">
                  {list.items.map(item => (
                    <div key={item.id} onClick={() => toggleItem(list.id, item.id)} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                      {item.isPacked ? <CheckCircle2 className="text-emerald-500 shrink-0" size={24} /> : <Circle className="text-slate-300 dark:text-slate-600 group-hover:text-brand-400 shrink-0 transition-colors" size={24} />}
                      <div className={`flex-1 transition-all ${item.isPacked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200 font-medium'}`}>
                        {item.name}
                        <span className="ml-2 text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">{item.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {!loading && packingLists.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
            <Briefcase size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">No Packing Lists Yet</h3>
            <p className="text-sm text-slate-400 mt-2">Generate one using the form above!</p>
          </div>
        )}
      </div>
    </div>
  );
}