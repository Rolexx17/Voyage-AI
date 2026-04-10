// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) navigate('/');
    else alert('Invalid credentials');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem]">
        <div className="text-center mb-10">
          <Sparkles className="text-brand-500 mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-bold text-white">Voyage AI</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white" onChange={e => setPassword(e.target.value)} />
          <button className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold">Sign In</button>
        </form>
        <p className="text-slate-400 text-center mt-6">New here? <Link to="/register" className="text-brand-400 font-bold">Register</Link></p>
      </div>
    </div>
  );
}