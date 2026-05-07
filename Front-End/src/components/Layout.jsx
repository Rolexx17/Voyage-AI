// src/components/Layout.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Wallet, User, ShieldAlert, 
  LogOut, Sparkles, Sun, Moon, Menu, X, Star, Wrench, 
  Briefcase, BookOpen
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${isActive 
        ? 'bg-brand-600 text-white shadow-md' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600'}
    `}
  >
    <Icon size={20} /> 
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Layout() {
  const { logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const menu = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/planner", icon: Sparkles, label: "AI Planner" },
    { to: "/recommendations", icon: Star, label: "For You" },
    { to: "/tools", icon: Wrench, label: "Travel Tools" },
    { to: "/expenses", icon: Wallet, label: "Expenses" },
    { to: "/packing", icon: Briefcase, label: "AI Packing" },
    { to: "/emergency", icon: ShieldAlert, label: "Emergency" },
    { to: "/journal", icon: BookOpen, label: "Travel Diary" },
    { to: "/profile", icon: User, label: "Profile" }
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Mobile Top Header (Visible only on Mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-xl">
          <Sparkles size={24} /> <span className="dark:text-white">Voyage AI</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-600 dark:text-slate-300"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 p-6 
        transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-2xl">
            <Sparkles size={28} /> <span className="dark:text-white">Voyage AI</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:ring-2 ring-brand-500 transition-all"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={closeMenu} className="lg:hidden p-2 text-slate-400">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          {menu.map(item => (
            <SidebarLink key={item.to} {...item} onClick={closeMenu} />
          ))}
        </nav>

        <button 
          onClick={() => { logout(); navigate('/login'); }} 
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl mt-auto transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}