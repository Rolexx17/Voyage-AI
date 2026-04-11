import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, PieChart as ChartIcon, 
  ArrowUpRight, DollarSign, Coffee, Utensils, Hotel, Plane
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useTravelStore from '../store/useTravelStore';

const CURRENCIES = ['USD', 'IDR', 'EUR', 'JPY', 'GBP', 'AUD'];

export default function Expenses() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [rates, setRates] = useState({});
  
  const { expenses, fetchExpenses, addExpense, deleteExpense } = useTravelStore();

  useEffect(() => {
    fetchExpenses();
    // Ambil kurs konversi secara live
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => setRates(data.rates));
  }, []);

  // Fungsi Konversi ke USD untuk perhitungan akurat di Chart & Total
  const convertToUSD = (amt, curr) => {
    if (!rates[curr]) return parseFloat(amt);
    return parseFloat(amt) / rates[curr];
  };

  const totalUSD = expenses.reduce((sum, item) => sum + convertToUSD(item.amount, item.currency), 0);

  const data = ['Food', 'Hotel', 'Transport', 'Leisure'].map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((s, c) => s + convertToUSD(c.amount, c.currency), 0)
  })).filter(d => d.value > 0);

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    addExpense({ amount, currency, category, description, date: new Date().toLocaleDateString() });
    setAmount('');
    setDescription('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <header>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Expense Tracker</h1>
          <p className="text-slate-500 font-medium">Multi-currency budget tracker synced to cloud.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-brand-600 p-6 rounded-3xl text-white shadow-xl">
              <p className="text-sm font-bold opacity-80 uppercase mb-1">Total Spent (USD)</p>
              <h2 className="text-3xl font-black">${totalUSD.toFixed(2)}</h2>
           </div>
        </div>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm">
           <h3 className="text-xl font-bold mb-6 dark:text-white">Transaction History</h3>
           <div className="space-y-4">
             <AnimatePresence>
               {expenses.length === 0 && <p className="text-center py-10 text-slate-400">No expenses yet.</p>}
               {expenses.map((exp) => (
                 <motion.div 
                   key={exp.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group"
                 >
                   <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center text-brand-600">
                     {exp.category === 'Food' && <Utensils size={20} />}
                     {exp.category === 'Hotel' && <Hotel size={20} />}
                     {exp.category === 'Transport' && <Plane size={20} />}
                     {exp.category === 'Leisure' && <Coffee size={20} />}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{exp.description}</h4>
                      <p className="text-xs text-slate-400">{exp.date}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">{exp.currency} {parseFloat(exp.amount).toLocaleString()}</p>
                      <p className="text-[10px] uppercase tracking-tighter text-brand-500 font-bold">~${convertToUSD(exp.amount, exp.currency).toFixed(2)}</p>
                   </div>
                   <button onClick={() => deleteExpense(exp.id)} className="p-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100">
                     <Trash2 size={18} />
                   </button>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </section>
      </div>

      <div className="space-y-8">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm">
           <h3 className="text-xl font-bold mb-6 dark:text-white">Add Expense</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                 <input required value={description} onChange={e => setDescription(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white" placeholder="Sushi in Tokyo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Amount & Curr</label>
                    <div className="flex bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden">
                      <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-4 bg-transparent outline-none dark:text-white" placeholder="0.00" />
                      <select value={currency} onChange={e => setCurrency(e.target.value)} className="bg-slate-100 dark:bg-slate-700 px-2 font-bold outline-none dark:text-white">
                        {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none dark:text-white">
                      <option>Food</option><option>Hotel</option><option>Transport</option><option>Leisure</option>
                    </select>
                 </div>
              </div>
              <button className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 mt-4">
                 <Plus size={20} /> Add Entry
              </button>
           </form>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
            <ChartIcon className="text-slate-400" /> Distribution (USD)
          </h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                 </Pie>
                 <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}