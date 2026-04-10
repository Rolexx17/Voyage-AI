import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDarkMode;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // This part actually talks to the browser:
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { isDarkMode: newTheme };
  }),
}));