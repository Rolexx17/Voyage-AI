import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, AlertCircle } from 'lucide-react'; // Tambahkan AlertCircle

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Ambil login dan error dari store
  const { login, error } = useAuthStore(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem]">
        <div className="text-center mb-10">
          <Sparkles className="text-brand-500 mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-bold text-white">Voyage AI</h1>
        </div>

        {/* Tampilkan Pesan Error di sini */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-200 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all" 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all" 
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <button className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
            Sign In
          </button>
        </form>
        
        <p className="text-slate-400 text-center mt-6">
          New here? <Link to="/register" className="text-brand-400 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}