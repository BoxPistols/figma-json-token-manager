// Footer component renderer

export function renderFooter(state) {
  return `
    <div class="footer-container">
      <div class="footer-info">
        <button class="text-button nav-button" data-view="about">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>About</span>
        </button>
      </div>
      
      <div class="footer-actions">
        <button class="text-button close-button" onclick="parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>Close</span>
        </button>
      </div>
    </div>
  `;
}