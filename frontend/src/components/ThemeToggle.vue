<template>
    <button @click="toggleTheme" class="theme-toggle" :title="darkMode ? 'Modalità chiara' : 'Modalità scura'">
      <span v-if="darkMode">🌙</span>
      <span v-else>☀️</span>
    </button>
  </template>
  
  <script>
  import { useThemeStore } from '@/stores/themeStore';
  import { computed } from 'vue';
  
  export default {
    name: 'ThemeToggle',
    setup() {
      const themeStore = useThemeStore();
      
      const darkMode = computed(() => themeStore.darkMode);
      
      return {
        darkMode,
        toggleTheme: themeStore.toggleTheme
      };
    }
  }
  </script>
  
  <style scoped>
  .theme-toggle {
    position: fixed;  /* Fixed position relative to viewport */
    top: 20px;        /* Distance from top */
    right: 20px;      /* Distance from right */
    z-index: 1000;    /* Ensure it stays above other content */
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    font-size: 1.2rem;
    width: 40px;       /* Fixed size */
    height: 40px;      /* Fixed size */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .theme-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style>