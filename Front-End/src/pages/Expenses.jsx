// src/pages/Expenses.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Plus, Trash2, PieChart as ChartIcon, 
  ArrowUpRight, ArrowDownLeft, DollarSign,
  Coffee, Utensils, Hotel, Plane
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useTravelStore from '../store/useTravelStore';

export default function Expenses() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  
  const { expenses, addExpense, deleteExpense } = useTravelStore();

  const total = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const data = [
    { name: 'Food', value: expenses.filter(e => e.category === 'Food').reduce((s, c) => s + parseFloat(c.amount), 0) },
    { name: 'Hotel', value: expenses.filter(e => e.category === 'Hotel').reduce((s, c) => s + parseFloat(c.amount), 0) },
    { name: 'Transport', value: expenses.filter(e => e.category === 'Transport').reduce((s, c) => s + parseFloat(c.amount), 0) },
    { name: 'Leisure', value: expenses.filter(e => e.category === 'Leisure').reduce((s, c) => s + parseFloat(c.amount), 0) },
  ].filter(d => d.value > 0);

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    addExpense({ amount, category, description, date: new Date().toLocaleDateString() });
    setAmount('');
    setDescription('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <header>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Expense Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Keep your budget under control.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-brand-600 p-6 rounded-3xl text-white shadow-xl shadow-brand-500/30">
              <p className="text-sm font-bold opacity-80 uppercase mb-1">Total Spent</p>
              <h2 className="text-3xl font-black">${total.toFixed(2)}</h2>
           </div>
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Currency</p>
                <h3 className="text-xl font-bold dark:text-white">USD - $</h3>
              </div>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                <DollarSign size={20} />
              </div>
           </div>
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Converter</p>
                <h3 className="text-xl font-bold dark:text-white">1 USD = 0.92 EUR</h3>
              </div>
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                <ArrowUpRight size={20} />
              </div>
           </div>
        </div>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
           <h3 className="text-xl font-bold mb-6 dark:text-white">Recent Transactions</h3>
           <div className="space-y-4">
             <AnimatePresence initial={false}>
               {expenses.length === 0 && <p className="text-center py-10 text-slate-400">No expenses yet.</p>}
               {expenses.map((exp) => (
                 <motion.div 
                   key={exp.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group transition-colors"
                 >
                   <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center text-brand-600">
                     {exp.category === 'Food' && <Utensils size={20} />}
                     {exp.category === 'Hotel' && <Hotel size={20} />}
                     {exp.category === 'Transport' && <Plane size={20} />}
                     {exp.category === 'Leisure' && <Coffee size={20} />}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{exp.description || exp.category}</h4>
                      <p className="text-xs text-slate-400">{exp.date}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">-${parseFloat(exp.amount).toFixed(2)}</p>
                      <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">{exp.category}</p>
                   </div>
                   <button 
                     onClick={() => deleteExpense(exp.id)}
                     className="p-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Trash2 size={18} />
                   </button>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </section>
      </div>

      <div className="space-y-8">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
           <h3 className="text-xl font-bold mb-6 dark:text-white">Add Expense</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase ml-2">Description</label>
                 <input 
                   required
                   value={description}
                   onChange={e => setDescription(e.target.value)}
                   className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white dark:placeholder-slate-500" 
                   placeholder="Coffee at Starbucks"
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Amount</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white dark:placeholder-slate-500" 
                      placeholder="0.00"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Category</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-white"
                    >
                      <option>Food</option>
                      <option>Hotel</option>
                      <option>Transport</option>
                      <option>Leisure</option>
                    </select>
                 </div>
              </div>
              <button className="w-full py-4 bg-slate-900 dark:bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-brand-700 transition-all mt-4">
                 <Plus size={20} /> Add Entry
              </button>
           </form>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
            <ChartIcon className="text-slate-400" /> Spending Distribution
          </h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
             {data.map((entry, i) => (
               <div key={entry.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                 <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{entry.name}</span>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}