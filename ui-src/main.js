import { createApp } from './app.js';
import { setupPluginMessageHandler } from './plugin-bridge.js';
import { createState } from './state.js';

// Create application state
const state = createState({
  currentView: 'home',
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  tokens: {
    colors: {},
    typography: {},
    spacing: {}
  },
  selectedCategory: null,
  selectedToken: null,
  history: [],
  searchQuery: ''
});

// Set up plugin message handling
window.dispatchPluginMessage = setupPluginMessageHandler(state);

// Create and mount the application
const app = createApp(state);
app.mount('#app');

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  state.isDarkMode = e.matches;
});

// Listen for keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + I for import
  if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
    e.preventDefault();
    state.currentView = 'import';
  }
  
  // Cmd/Ctrl + E for export
  if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
    e.preventDefault();
    state.currentView = 'export';
  }
  
  // Escape to go home
  if (e.key === 'Escape' && state.currentView !== 'home') {
    state.currentView = 'home';
  }
});