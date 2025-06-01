import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: localStorage.getItem('theme') === 'dark' || 
              (localStorage.getItem('theme') === null && 
               window.matchMedia('(prefers-color-scheme: dark)').matches)
  }),
  
  actions: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
      this.applyTheme();
    },
    
    applyTheme() {
      document.documentElement.classList.toggle('dark-theme', this.darkMode);
    },
    
    initTheme() {
      this.applyTheme();
    }
  }
});