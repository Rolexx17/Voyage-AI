import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null, // State baru untuk menyimpan pesan error

  login: async (email, password) => {
    set({ error: null }); // Reset error setiap kali mencoba login
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
        // Simpan pesan error dari backend ke state
        set({ error: result.error || 'Invalid email or password' });
        return false;
      }
    } catch (error) {
      set({ error: 'Server is down. Please try again later.' });
      return false;
    }
  },

  // Fungsi untuk menghapus error secara manual (opsional)
  clearError: () => set({ error: null }),

  // Fungsi Register
  register: async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
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
      console.error('Register error:', error);
      alert('Server error during registration');
      return false;
    }
  },

  updateProfile: async (formData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Kirim token di sini
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

  passwordError: null, // Tambahkan state khusus error password

  changePassword: async (oldPassword, newPassword) => {
    set({ passwordError: null }); // Reset error setiap mulai
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true };
      } else {
        // Simpan pesan error "Incorrect old password" ke state
        set({ passwordError: result.error || 'Failed to update password' });
        return { success: false };
      }
    } catch (e) {
      set({ passwordError: 'Server error. Please try again.' });
      return { success: false };
    }
  },
  
  // Fungsi pembersih error
  clearPasswordError: () => set({ passwordError: null }),


  // Fungsi Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));