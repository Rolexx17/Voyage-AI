import { create } from 'zustand';

export const useRecommendationStore = create((set, get) => ({
  // TAMBAHKAN transport: [] DI SINI
  data: { destination: [], hotel: [], food: [], photospot: [], transport: [] }, 
  loading: false,
  error: null,
  currentLocation: '', 

  fetchRecommendations: async (category, location) => {
    if (!location) return;

    if (get().currentLocation !== location) {
      set({ 
        currentLocation: location,
        // TAMBAHKAN JUGA DI SINI SAAT RESET
        data: { destination: [], hotel: [], food: [], photospot: [], transport: [] } 
      });
    }

    set({ loading: true, error: null });
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/recommendations/${category}?location=${encodeURIComponent(location)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success) {
        set((state) => ({ 
          data: { ...state.data, [category]: result.data },
          loading: false 
        }));
      } else {
        set({ error: result.error, loading: false });
      }
    } catch (err) {
      set({ error: 'Server connection error', loading: false });
    }
  }
}));