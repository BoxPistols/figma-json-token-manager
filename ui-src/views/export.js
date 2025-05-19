// Export view renderer

export function renderExport(state) {
  return `
    <div class="export-container">
      <h1>Export Design Tokens</h1>
      
      <div class="export-description">
        <p>Export all color, typography, and spacing tokens from your Figma document into a JSON file.</p>
      </div>
      
      <div class="export-options">
        <h2>Export Options</h2>
        
        <div class="option-group">
          <label class="checkbox-label">
            <input type="checkbox" checked class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span>Include Color Styles</span>
          </label>
          
          <label class="checkbox-label">
            <input type="checkbox" checked class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span>Include Text Styles</span>
          </label>
          
          <label class="checkbox-label">
            <input type="checkbox" checked class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span>Include Effect Styles</span>
          </label>
          
          <label class="checkbox-label">
            <input type="checkbox" checked class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span>Include Grid Styles</span>
          </label>
        </div>
      </div>
      
      <div class="format-settings">
        <h2>Format Settings</h2>
        
        <div class="settings-grid">
          <div class="setting-group">
            <label class="setting-label">Format</label>
            <div class="select-wrapper">
              <select class="select-input">
                <option value="json" selected>JSON</option>
                <option value="js">JavaScript</option>
                <option value="ts">TypeScript</option>
              </select>
              <svg class="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          
          <div class="setting-group">
            <label class="setting-label">Indentation</label>
            <div class="select-wrapper">
              <select class="select-input">
                <option value="2" selected>2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="tab">Tab</option>
              </select>
              <svg class="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <button id="export-button" class="primary-button export-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Export Tokens
      </button>
    </div>
  `;
}