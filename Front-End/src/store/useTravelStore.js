import { create } from 'zustand';

const API_BASE = 'http://192.168.1.8:5000';

const useTravelStore = create((set, get) => ({
  expenses: [],
  itineraries: [],
  loading: false,

  fetchExpenses: async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/expenses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if(data.success) set({ expenses: data.data });
    } catch (e) { console.error("Fetch expenses failed"); }
  },

  addExpense: async (expense) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/expenses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expense)
      });
      const data = await res.json();
      if(data.success) set((state) => ({ expenses: [data.data, ...state.expenses] }));
    } catch (e) { alert("Failed to add expense to database"); }
  },

  deleteExpense: async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) }));
    } catch (e) { console.error("Delete failed"); }
  }
}));

export default useTravelStore;