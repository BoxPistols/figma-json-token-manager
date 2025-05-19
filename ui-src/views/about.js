// About view renderer

export function renderAbout(state) {
  return `
    <div class="about-container">
      <h1>About Design Token Studio</h1>
      
      <div class="about-content">
        <p class="about-description">
          Design Token Studio is a Figma plugin that helps you import, export, and visualize design tokens in your Figma files.
          It bridges the gap between design systems and implementation by providing a standardized way to work with design tokens.
        </p>
        
        <h2>What are Design Tokens?</h2>
        <p>
          Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes.
          They are used in place of hard-coded values in order to maintain a scalable and consistent visual system.
        </p>
        
        <h2>Supported Token Types</h2>
        <ul class="token-types-list">
          <li>
            <div class="token-type-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <div class="token-type-info">
              <h3>Colors</h3>
              <p>Primary, secondary, semantic, and system colors</p>
            </div>
          </li>
          
          <li>
            <div class="token-type-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                <line x1="9" y1="20" x2="15" y2="20"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
              </svg>
            </div>
            <div class="token-type-info">
              <h3>Typography</h3>
              <p>Font families, sizes, weights, and line heights</p>
            </div>
          </li>
          
          <li>
            <div class="token-type-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            <div class="token-type-info">
              <h3>Spacing</h3>
              <p>Layout spacing and sizing definitions</p>
            </div>
          </li>
        </ul>
        
        <h2>File Format</h2>
        <p>
          Design Token Studio uses a simple JSON format compatible with most design systems.
          You can export tokens from your favorite design system tools and import them into Figma,
          or export tokens from Figma to use in your development workflow.
        </p>
        
        <div class="about-footer">
          <p>Version 1.0.0</p>
          <p>Created with ♥ for designers and developers</p>
        </div>
      </div>
    </div>
  `;
}