import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Network, Scale, Sigma, Route, Play, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000`;

function JsonBlock({ title, data }) {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 overflow-auto border border-slate-700">
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">{title}</p>
      <pre className="text-xs whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default function AIModelingLab() {
  const [loadingKey, setLoadingKey] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [payload, setPayload] = useState({
    csp: {
      slots: ['morning', 'afternoon', 'evening'],
      activities: ['museum', 'culinary', 'park']
    },
    logic: {
      query: 'tripReady(user)'
    }
  });

  const callApi = async (path, body = {}) => {
    setError('');
    setResult(null);
    setLoadingKey(path);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/ai-modeling${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      setResult(data.data);
    } catch (e) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoadingKey('');
    }
  };

  const actions = [
    {
      key: '/run-all',
      label: 'Run All Models',
      icon: Brain,
      color: 'bg-brand-600 hover:bg-brand-700',
      description: 'CSP + Game Theory + Logic + Classical Planning',
      body: payload
    },
    {
      key: '/csp',
      label: 'Run CSP',
      icon: Network,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      description: 'Constraint Satisfaction Problem',
      body: payload.csp
    },
    {
      key: '/game-theory',
      label: 'Run Game Theory',
      icon: Scale,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      description: 'Nash Equilibrium & mixed strategy',
      body: {}
    },
    {
      key: '/logic',
      label: 'Run Logic',
      icon: Sigma,
      color: 'bg-amber-600 hover:bg-amber-700',
      description: 'Knowledge base + inference',
      body: payload.logic
    },
    {
      key: '/planning',
      label: 'Run Planning',
      icon: Route,
      color: 'bg-fuchsia-600 hover:bg-fuchsia-700',
      description: 'Classical STRIPS-like planning',
      body: {}
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <header className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center">
          <Brain size={30} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">AI Modeling Lab</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            CSP / Game Theory / Logic Representation / Classical Planning
          </p>
        </div>
      </header>

      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 space-y-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Input Playground</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase">CSP Slots (comma separated)</label>
            <input
              value={payload.csp.slots.join(', ')}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  csp: {
                    ...prev.csp,
                    slots: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))
              }
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
            />

            <label className="text-xs font-bold text-slate-400 uppercase">CSP Activities (comma separated)</label>
            <input
              value={payload.csp.activities.join(', ')}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  csp: {
                    ...prev.csp,
                    activities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                }))
              }
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase">Logic Query</label>
            <input
              value={payload.logic.query}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  logic: { ...prev.logic, query: e.target.value }
                }))
              }
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. tripReady(user)"
            />

            <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/30 text-sm text-brand-800 dark:text-brand-300">
              Endpoint base: <span className="font-bold">{API_BASE}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {actions.map((a) => (
          <button
            key={a.key}
            onClick={() => callApi(a.key, a.body)}
            disabled={!!loadingKey}
            className={`${a.color} text-white rounded-2xl p-5 text-left transition-all disabled:opacity-60 shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <a.icon size={20} />
              {loadingKey === a.key ? <Loader2 className="animate-spin" size={18} /> : <Play size={16} />}
            </div>
            <h3 className="font-black text-sm">{a.label}</h3>
            <p className="text-xs opacity-90 mt-1">{a.description}</p>
          </button>
        ))}
      </section>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center gap-2 font-bold"
          >
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 size={18} /> Modeling executed successfully
            </div>

            <JsonBlock title="Result JSON" data={result} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
