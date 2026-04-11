// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, Briefcase, Wallet, 
  Heart, Users, Trees, Dog, CheckCircle2, ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    style: 'budget', budget: 'low', food: 'everything',
    travelType: 'solo', interests: [], hasPets: 'no'
  });
  
  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const handleNext = () => {
    // Basic validation for Step 1
    if (step === 1) {
      if (!formData.name || !formData.email || formData.password.length < 6) {
        return alert("Please fill in all credentials (password min. 6 chars)");
      }
    }
    setStep(s => s + 1);
  };
  
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    const success = await register(formData);
    if (success) navigate('/login'); // Pindah ke login setelah sukses
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Progress Indicator */}
        <div className="md:w-1/3 bg-brand-600 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
               <Link to="/login" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft size={20} />
               </Link>
               <h2 className="text-2xl font-bold">Onboarding</h2>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex items-center gap-3 transition-opacity ${step === i ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === i ? 'bg-white text-brand-600' : 'border-white'}`}>
                    {i}
                  </div>
                  <span className="font-medium">{i === 1 ? 'Credentials' : i === 2 ? 'Preferences' : 'Interests'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm opacity-60">Join 50k+ elite travelers</div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold mb-2 dark:text-white">Create Account</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Start your journey with Voyage AI</p>
                <div className="space-y-4">
                  <input 
                    placeholder="Full Name" 
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    placeholder="Email" 
                    type="email"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    placeholder="Password" 
                    type="password"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <button onClick={handleNext} className="mt-8 w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20">
                  Next Step
                </button>
                <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
                  Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">Log in</Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold mb-6 dark:text-white">Travel Profile</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Travel Style</label>
                    <select 
                      className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none appearance-none"
                      value={formData.style}
                      onChange={e => setFormData({...formData, style: e.target.value})}
                    >
                      <option value="luxury">💎 Luxury</option>
                      <option value="budget">💰 Budget</option>
                      <option value="backpacker">🎒 Backpacker</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Group Size</label>
                    <select 
                      className="w-full p-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl border-none outline-none appearance-none"
                      value={formData.travelType}
                      onChange={e => setFormData({...formData, travelType: e.target.value})}
                    >
                      <option value="solo">🧍 Solo</option>
                      <option value="group">👥 Group</option>
                      <option value="family">👨‍👩‍👧‍👦 Family</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mt-2">
                    <Dog className="text-slate-400" />
                    <span className="flex-1 text-slate-600 dark:text-slate-300 font-medium">Traveling with pets?</span>
                    <button 
                      onClick={() => setFormData({...formData, hasPets: 'yes'})}
                      className={`px-4 py-1 rounded-lg transition-all ${formData.hasPets === 'yes' ? 'bg-brand-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 dark:text-white'}`}
                    >Yes</button>
                    <button 
                      onClick={() => setFormData({...formData, hasPets: 'no'})}
                      className={`px-4 py-1 rounded-lg transition-all ${formData.hasPets === 'no' ? 'bg-brand-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 dark:text-white'}`}
                    >No</button>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                   <button onClick={handleBack} className="flex-1 bg-slate-200 dark:bg-slate-800 dark:text-white py-4 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Back</button>
                   <button onClick={handleNext} className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">Next</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-bold mb-6 dark:text-white">Choose Interests</h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {['Nature', 'Nightlife', 'Museums', 'Beaches', 'Shopping', 'Hiking', 'Photography', 'Foodie'].map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between font-medium ${
                        formData.interests.includes(interest) 
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                        : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {interest}
                      {formData.interests.includes(interest) && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                   <button onClick={handleBack} className="flex-1 bg-slate-200 dark:bg-slate-800 dark:text-white py-4 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Back</button>
                   <button onClick={handleSubmit} className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-500/40 hover:bg-brand-700 transition-colors">Finish</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}