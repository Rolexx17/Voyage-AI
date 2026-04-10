// src/store/useAuthStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('voyage_user')) || null,
  isAuthenticated: !!localStorage.getItem('voyage_user'),
  login: (email, password) => {
    const db = JSON.parse(localStorage.getItem('voyage_user_db')) || [];
    const user = db.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('voyage_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: (userData) => {
    const db = JSON.parse(localStorage.getItem('voyage_user_db')) || [];
    db.push(userData);
    localStorage.setItem('voyage_user_db', JSON.stringify(db));
    localStorage.setItem('voyage_user', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('voyage_user');
    set({ user: null, isAuthenticated: false });
  }
}));