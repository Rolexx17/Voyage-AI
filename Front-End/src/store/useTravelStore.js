// src/store/useTravelStore.js
import { create } from 'zustand';

const useTravelStore = create((set) => ({
  expenses: JSON.parse(localStorage.getItem('voyage_expenses')) || [],
  itineraries: JSON.parse(localStorage.getItem('voyage_itineraries')) || [],
  
  addExpense: (expense) => set((state) => {
    const newExpenses = [...state.expenses, { ...expense, id: Date.now() }];
    localStorage.setItem('voyage_expenses', JSON.stringify(newExpenses));
    return { expenses: newExpenses };
  }),

  deleteExpense: (id) => set((state) => {
    const newExpenses = state.expenses.filter(e => e.id !== id);
    localStorage.setItem('voyage_expenses', JSON.stringify(newExpenses));
    return { expenses: newExpenses };
  }),

  saveItinerary: (itinerary) => set((state) => {
    const newItineraries = [...state.itineraries, { ...itinerary, id: Date.now() }];
    localStorage.setItem('voyage_itineraries', JSON.stringify(newItineraries));
    return { itineraries: newItineraries };
  })
}));

export default useTravelStore;