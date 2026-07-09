import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const usePackingStore = create((set, get) => ({
  packingLists: [],
  loading: false,

  fetchLists: async () => {
    set({ loading: true });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/packing`, { headers: { 'Authorization': `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) set({ packingLists: data.data });
    } catch (e) { console.error(e); }
    set({ loading: false });
  },

  generateList: async (params) => {
    set({ loading: true });
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/api/packing/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success) set((state) => ({ packingLists: [data.data, ...state.packingLists] }));
    } catch (e) { console.error(e); }
    set({ loading: false });
  },

  toggleItem: async (listId, itemId) => {
    const { packingLists } = get();
    const listIndex = packingLists.findIndex(l => l.id === listId);
    if (listIndex === -1) return;

    // Optimistic UI update
    const updatedLists = [...packingLists];
    const items = [...updatedLists[listIndex].items];
    const itemIndex = items.findIndex(i => i.id === itemId);
    items[itemIndex].isPacked = !items[itemIndex].isPacked;
    updatedLists[listIndex].items = items;
    set({ packingLists: updatedLists });

    // Sync to backend
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/api/packing/${listId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ items })
    });
  },

  deleteList: async (listId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE}/api/packing/${listId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
      set((state) => ({ packingLists: state.packingLists.filter(l => l.id !== listId) }));
    } catch (e) { console.error(e); }
  }
}));