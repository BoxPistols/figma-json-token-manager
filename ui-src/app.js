import { renderHome } from './views/home.js';
import { renderImport } from './views/import.js';
import { renderExport } from './views/export.js';
import { renderPreview } from './views/preview.js';
import { renderAbout } from './views/about.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';

export function createApp(state) {
  // DOM elements cache
  let appElement = null;
  let headerElement = null;
  let contentElement = null;
  let footerElement = null;
  
  // View renderer map
  const viewRenderers = {
    home: renderHome,
    import: renderImport,
    export: renderExport,
    preview: renderPreview,
    about: renderAbout
  };
  
  // Initialize and mount the app
  function mount(selector) {
    appElement = document.querySelector(selector);
    if (!appElement) {
      console.error(`Could not find element with selector: ${selector}`);
      return;
    }
    
    // Create app structure
    appElement.innerHTML = `
      <div class="app-container ${state.isDarkMode ? 'dark-mode' : 'light-mode'}">
        <header id="app-header" class="app-header"></header>
        <main id="app-content" class="app-content"></main>
        <footer id="app-footer" class="app-footer"></footer>
      </div>
    `;
    
    // Cache DOM elements
    headerElement = document.getElementById('app-header');
    contentElement = document.getElementById('app-content');
    footerElement = document.getElementById('app-footer');
    
    // Initial render
    render();
    
    // Set up state change subscription
    state.subscribe(render);
  }
  
  // Render the app based on current state
  function render() {
    // Update theme class
    const container = appElement.querySelector('.app-container');
    if (container) {
      container.className = `app-container ${state.isDarkMode ? 'dark-mode' : 'light-mode'}`;
    }
    
    // Render header
    if (headerElement) {
      headerElement.innerHTML = renderHeader(state);
    }
    
    // Render current view
    if (contentElement) {
      const currentView = state.currentView;
      const renderView = viewRenderers[currentView] || viewRenderers.home;
      contentElement.innerHTML = renderView(state);
      
      // Attach event listeners for the current view
      attachEventListeners(currentView);
    }
    
    // Render footer
    if (footerElement) {
      footerElement.innerHTML = renderFooter(state);
    }
  }
  
  // Attach event listeners based on current view
  function attachEventListeners(view) {
    // Common header navigation
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        state.currentView = button.dataset.view;
      });
    });
    
    // Toggle theme button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        state.isDarkMode = !state.isDarkMode;
      });
    }
    
    // View-specific event listeners
    if (view === 'home') {
      attachHomeEventListeners();
    } else if (view === 'import') {
      attachImportEventListeners();
    } else if (view === 'export') {
      attachExportEventListeners();
    } else if (view === 'preview') {
      attachPreviewEventListeners();
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
      });
    }
  }
  
  // Home view event listeners
  function attachHomeEventListeners() {
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
      item.addEventListener('click', () => {
        // Find the history item by ID and load it
        const historyId = item.dataset.id;
        const historyItem = state.history.find(h => h.id === historyId);
        if (historyItem) {
          // In a real implementation, we'd load the tokens from storage
          // For now, just navigate to preview
          state.currentView = 'preview';
        }
      });
    });
  }
  
  // Import view event listeners
  function attachImportEventListeners() {
    const fileInput = document.getElementById('token-file-input');
    const importForm = document.getElementById('import-form');
    
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const tokens = JSON.parse(event.target.result);
              // Update state with imported tokens
              state.tokens = tokens;
              
              // Send to plugin code
              parent.postMessage({ 
                pluginMessage: { 
                  type: 'import-tokens', 
                  tokens 
                } 
              }, '*');
              
              // Add to history
              const newHistoryItem = {
                id: Date.now().toString(),
                name: file.name,
                date: new Date().toISOString(),
                type: 'import',
                tokenCount: countTokens(tokens)
              };
              
              state.history = [newHistoryItem, ...state.history];
              
              // Navigate to preview
              state.currentView = 'preview';
            } catch (error) {
              // Show error in UI
              const errorElement = document.getElementById('import-error');
              if (errorElement) {
                errorElement.textContent = `Error parsing JSON: ${error.message}`;
                errorElement.style.display = 'block';
              }
            }
          };
          reader.readAsText(file);
        }
      });
    }
    
    if (importForm) {
      importForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fileInput.click();
      });
    }
    
    // Example token set buttons
    const exampleButtons = document.querySelectorAll('.example-token-button');
    exampleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const exampleType = button.dataset.example;
        
        // Load example token set
        let exampleTokens;
        
        if (exampleType === 'basic') {
          exampleTokens = {
            colors: {
              "primary": { name: "primary", value: "#0D99FF" },
              "secondary": { name: "secondary", value: "#6E56CF" },
              "success": { name: "success", value: "#30C998" },
              "error": { name: "error", value: "#FF5247" }
            },
            typography: {
              "heading-1": { 
                name: "heading-1", 
                fontFamily: "SF Pro Display", 
                fontSize: 32, 
                fontWeight: 700, 
                lineHeight: 38 
              },
              "body": { 
                name: "body", 
                fontFamily: "SF Pro Text", 
                fontSize: 16, 
                fontWeight: 400, 
                lineHeight: 24 
              }
            }
          };
        } else if (exampleType === 'material') {
          exampleTokens = {
            colors: {
              "primary-50": { name: "primary-50", value: "#E3F2FD" },
              "primary-100": { name: "primary-100", value: "#BBDEFB" },
              "primary-500": { name: "primary-500", value: "#2196F3" },
              "primary-900": { name: "primary-900", value: "#0D47A1" }
            }
          };
        }
        
        if (exampleTokens) {
          state.tokens = exampleTokens;
          
          // Send to plugin code
          parent.postMessage({ 
            pluginMessage: { 
              type: 'import-tokens', 
              tokens: exampleTokens 
            } 
          }, '*');
          
          // Add to history
          const newHistoryItem = {
            id: Date.now().toString(),
            name: `Example: ${exampleType}`,
            date: new Date().toISOString(),
            type: 'import',
            tokenCount: countTokens(exampleTokens)
          };
          
          state.history = [newHistoryItem, ...state.history];
          
          // Navigate to preview
          state.currentView = 'preview';
        }
      });
    });
  }
  
  // Export view event listeners
  function attachExportEventListeners() {
    const exportButton = document.getElementById('export-button');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        // Request tokens from the plugin
        parent.postMessage({ 
          pluginMessage: { 
            type: 'export-tokens'
          } 
        }, '*');
      });
    }
  }
  
  // Preview view event listeners
  function attachPreviewEventListeners() {
    // Category selection
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        state.selectedCategory = tab.dataset.category;
      });
    });
    
    // Token selection
    const tokenItems = document.querySelectorAll('.token-item');
    tokenItems.forEach(item => {
      item.addEventListener('click', () => {
        const category = item.dataset.category;
        const tokenName = item.dataset.token;
        
        if (category && tokenName && state.tokens[category]) {
          state.selectedToken = state.tokens[category][tokenName];
        }
      });
    });
    
    // Apply token button
    const applyButton = document.getElementById('apply-token-button');
    if (applyButton && state.selectedToken) {
      applyButton.addEventListener('click', () => {
        const category = state.selectedCategory;
        
        if (category === 'colors') {
          parent.postMessage({
            pluginMessage: {
              type: 'apply-color-token',
              token: state.selectedToken
            }
          }, '*');
        } else if (category === 'typography') {
          parent.postMessage({
            pluginMessage: {
              type: 'apply-typography-token',
              token: state.selectedToken
            }
          }, '*');
        } else if (category === 'spacing') {
          parent.postMessage({
            pluginMessage: {
              type: 'apply-spacing-token',
              token: state.selectedToken
            }
          }, '*');
        }
      });
    }
  }
  
  // Utility to count tokens
  function countTokens(tokenSet) {
    let count = 0;
    for (const category in tokenSet) {
      count += Object.keys(tokenSet[category] || {}).length;
    }
    return count;
  }
  
  return {
    mount
  };
}