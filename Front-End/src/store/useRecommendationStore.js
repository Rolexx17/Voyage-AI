import { create } from 'zustand';

export const useRecommendationStore = create((set) => ({
  data: { destination: [], hotel: [], food: [], photospot: [] },
  loading: false,
  error: null,

  fetchRecommendations: async (category) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/recommendations/${category}`, {
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