import { create } from 'zustand';

// Ganti IP sesuai Network kamu
const API_BASE = 'http://192.168.1.8:5000'; 

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,

  login: async (email, password) => {
    set({ error: null });
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        set({ user: result.data.user, token: result.data.token, isAuthenticated: true });
        return true;
      } else {
        set({ error: result.error || 'Invalid email or password' });
        return false;
      }
    } catch (error) {
      set({ error: 'Server is down. Please try again later.' });
      return false;
    }
  },

  register: async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Registration successful! Please login.');
        return true;
      } else {
        alert(result.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      alert('Server error during registration');
      return false;
    }
  },

  updateProfile: async (formData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        set({ user: result.data });
        localStorage.setItem('user', JSON.stringify(result.data));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (e) { return { success: false, error: 'Server error' }; }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));