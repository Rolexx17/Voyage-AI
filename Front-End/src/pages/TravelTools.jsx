import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, DollarSign, Clock, ArrowRightLeft, Sparkles, Loader2, Languages } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function TravelTools() {
  const [activeTab, setActiveTab] = useState('currency');

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Globe className="text-brand-500" size={36} /> Travel Tools
        </h1>
        <p className="text-slate-500 mt-2">Essential utilities for your global journey.</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        {[
          { id: 'currency', icon: DollarSign, label: 'Currency' },
          { id: 'translate', icon: Languages, label: 'Translator' },
          { id: 'time', icon: Clock, label: 'World Time' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${
              activeTab === tab.id ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <tab.icon size={18} /> <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'currency' && <CurrencyConverter key="curr" />}
          {activeTab === 'translate' && <Translator key="trans" />}
          {activeTab === 'time' && <WorldClock key="time" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ================= 1. CURRENCY CONVERTER =================
function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('IDR');
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Menggunakan API Publik Gratis untuk Currency
    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurr}`)
      .then(res => res.json())
      .then(data => {
        const rate = data.rates[toCurr];
        setResult((amount * rate).toLocaleString('en-US', { maximumFractionDigits: 2 }));
      });
  }, [amount, fromCurr, toCurr]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white mb-6">Currency Converter</h2>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">Amount & From</label>
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-4 bg-transparent outline-none dark:text-white font-bold" />
            <select value={fromCurr} onChange={e => setFromCurr(e.target.value)} className="bg-slate-50 dark:bg-slate-800 px-4 font-bold outline-none text-slate-700 dark:text-white">
              <option value="USD">USD</option><option value="IDR">IDR</option><option value="EUR">EUR</option><option value="JPY">JPY</option>
            </select>
          </div>
        </div>
        <ArrowRightLeft className="text-slate-400 rotate-90 md:rotate-0 mt-4 md:mt-6" />
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500">To</label>
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 text-xl font-black text-brand-600 dark:text-brand-400">{result || '...'}</div>
            <select value={toCurr} onChange={e => setToCurr(e.target.value)} className="bg-slate-50 dark:bg-slate-800 px-4 font-bold outline-none text-slate-700 dark:text-white border-l dark:border-slate-700">
              <option value="IDR">IDR</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="JPY">JPY</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ================= 2. TRANSLATOR (Menggunakan AI Backend) =================
function Translator() {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('Indonesian');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tools/translate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text, targetLanguage: targetLang })
      });
      const data = await res.json();
      if(data.success) setTranslated(data.data.translatedText);
    } catch (err) {
      setTranslated('Error connecting to translation server.');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">AI Translator</h2>
        <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="p-2 border rounded-xl dark:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700 outline-none">
          <option value="Indonesian">Indonesian</option>
          <option value="English">English</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type text here..." className="w-full h-40 p-4 border rounded-xl outline-none dark:bg-slate-800 dark:text-white dark:border-slate-700 resize-none" />
        <div className="w-full h-40 p-4 border rounded-xl bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 text-slate-800 dark:text-white overflow-auto relative">
          {loading ? <Loader2 className="animate-spin text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> : (translated || 'Translation will appear here...')}
        </div>
      </div>
      <button onClick={handleTranslate} disabled={loading} className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 disabled:opacity-50">
        Translate
      </button>
    </motion.div>
  );
}

// ================= 3. WORLD TIME CHECKER =================
function WorldClock() {
  const [time, setTime] = useState(new Date());
  const zones = [
    { name: 'Jakarta (WIB)', tz: 'Asia/Jakarta' },
    { name: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
    { name: 'London (GMT)', tz: 'Europe/London' },
    { name: 'New York (EST)', tz: 'America/New_York' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white mb-6">World Time Checker</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {zones.map(zone => (
          <div key={zone.tz} className="p-6 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center">
            <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2">{zone.name}</h3>
            <p className="text-3xl font-black text-slate-800 dark:text-white tracking-wider">
              {time.toLocaleTimeString('en-US', { timeZone: zone.tz, hour12: false })}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}