// Import view renderer

export function renderImport(state) {
  return `
    <div class="import-container">
      <h1>Import Design Tokens</h1>
      
      <form id="import-form" class="import-form">
        <div class="file-input-container">
          <label for="token-file-input" class="file-input-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <span>Select JSON file</span>
          </label>
          <input type="file" id="token-file-input" accept=".json" class="file-input" />
          <button type="submit" class="primary-button">Import</button>
        </div>
        
        <div id="import-error" class="error-message" style="display: none;"></div>
      </form>
      
      <div class="format-info">
        <h2>Supported Format</h2>
        <pre><code>{
  "colors": {
    "primary": {
      "name": "primary",
      "value": "#0D99FF"
    },
    "secondary": {
      "name": "secondary",
      "value": "#6E56CF"
    }
  },
  "typography": {
    "heading-1": {
      "name": "heading-1",
      "fontFamily": "SF Pro Display",
      "fontSize": 32,
      "fontWeight": 700,
      "lineHeight": 38
    }
  }
}</code></pre>
      </div>
      
      <div class="examples-section">
        <h2>Try an Example</h2>
        <div class="examples-grid">
          <button class="example-token-button" data-example="basic">
            <div class="example-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <div class="example-info">
              <h3>Basic Design System</h3>
              <p>Colors and typography tokens</p>
            </div>
          </button>
          
          <button class="example-token-button" data-example="material">
            <div class="example-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </div>
            <div class="example-info">
              <h3>Material Design</h3>
              <p>Material Design color palette</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;
}