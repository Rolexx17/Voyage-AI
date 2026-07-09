import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const useJournalStore = create((set, get) => ({
  journals: [],
  loading: false,

  fetchJournals: async () => {
    set({ loading: true });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/journals`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) set({ journals: data.data });
    } catch (e) { console.error(e); }
    set({ loading: false });
  },

  addJournal: async (journalData) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/journals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(journalData)
      });
      const data = await res.json();
      if (data.success) set((state) => ({ journals: [data.data, ...state.journals] }));
    } catch (e) { alert("Failed to save journal"); }
  },

  deleteJournal: async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE}/api/journals/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
      set((state) => ({ journals: state.journals.filter(j => j.id !== id) }));
    } catch (e) { console.error(e); }
  }
}));