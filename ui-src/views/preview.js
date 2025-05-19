// Preview view renderer

export function renderPreview(state) {
  const { tokens, selectedCategory, selectedToken, searchQuery } = state;
  
  // Default to first category if none selected
  const activeCategory = selectedCategory || getFirstCategory(tokens);
  
  // Get active tokens
  const activeTokens = tokens[activeCategory] || {};
  
  // Filter tokens by search query if present
  const filteredTokens = searchQuery 
    ? filterTokensBySearch(activeTokens, searchQuery)
    : activeTokens;
  
  return `
    <div class="preview-container">
      <div class="preview-header">
        <h1>Token Preview</h1>
        
        <div class="search-container">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="search-input" class="search-input" placeholder="Search tokens..." value="${searchQuery || ''}">
        </div>
      </div>
      
      <div class="category-tabs">
        ${renderCategoryTabs(tokens, activeCategory)}
      </div>
      
      <div class="tokens-grid">
        ${renderTokenList(filteredTokens, activeCategory, selectedToken)}
      </div>
      
      ${selectedToken ? renderTokenDetail(selectedToken, activeCategory) : ''}
    </div>
  `;
}

// Render category tabs
function renderCategoryTabs(tokens, activeCategory) {
  const categories = Object.keys(tokens).filter(cat => 
    tokens[cat] && Object.keys(tokens[cat]).length > 0
  );
  
  if (categories.length === 0) {
    return '<div class="empty-message">No tokens available</div>';
  }
  
  return categories.map(category => `
    <button class="category-tab ${category === activeCategory ? 'active' : ''}" data-category="${category}">
      <span class="category-icon">
        ${getCategoryIcon(category)}
      </span>
      <span class="category-name">${formatCategoryName(category)}</span>
      <span class="category-count">${Object.keys(tokens[category] || {}).length}</span>
    </button>
  `).join('');
}

// Render token list
function renderTokenList(tokens, category, selectedToken) {
  const tokenList = Object.entries(tokens);
  
  if (tokenList.length === 0) {
    return '<div class="empty-message">No tokens found</div>';
  }
  
  return tokenList.map(([tokenName, token]) => `
    <div class="token-item ${selectedToken && selectedToken.name === token.name ? 'selected' : ''}" 
         data-category="${category}" 
         data-token="${tokenName}">
      ${renderTokenPreview(token, category)}
      <div class="token-name">${token.name}</div>
    </div>
  `).join('');
}

// Render token preview based on category
function renderTokenPreview(token, category) {
  if (category === 'colors') {
    return `
      <div class="color-preview" style="background-color: ${token.value}; ${token.opacity !== undefined ? `opacity: ${token.opacity};` : ''}"></div>
    `;
  } else if (category === 'typography') {
    return `
      <div class="typography-preview" style="
        font-family: ${token.fontFamily || 'sans-serif'};
        font-size: ${Math.min(token.fontSize, 24)}px;
        font-weight: ${token.fontWeight || 400};
        line-height: ${token.lineHeight ? token.lineHeight + 'px' : 'normal'};
        ${token.letterSpacing ? `letter-spacing: ${token.letterSpacing}px;` : ''}
      ">Aa</div>
    `;
  } else if (category === 'spacing') {
    const size = Math.min(Math.max(token.value, 4), 32);
    return `
      <div class="spacing-preview">
        <div class="spacing-box" style="width: ${size}px; height: ${size}px;"></div>
      </div>
    `;
  } else {
    return `
      <div class="token-preview-generic">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
    `;
  }
}

// Render detailed token information
function renderTokenDetail(token, category) {
  let detailContent = '';
  
  if (category === 'colors') {
    detailContent = `
      <div class="color-detail">
        <div class="large-color-preview" style="background-color: ${token.value}; ${token.opacity !== undefined ? `opacity: ${token.opacity};` : ''}"></div>
        <div class="color-values">
          <div class="color-value-item">
            <span class="value-label">HEX</span>
            <span class="value-text">${token.value}</span>
          </div>
          ${token.opacity !== undefined ? `
            <div class="color-value-item">
              <span class="value-label">Opacity</span>
              <span class="value-text">${token.opacity}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  } else if (category === 'typography') {
    detailContent = `
      <div class="typography-detail">
        <div class="typography-sample" style="
          font-family: ${token.fontFamily || 'sans-serif'};
          font-size: ${token.fontSize}px;
          font-weight: ${token.fontWeight || 400};
          line-height: ${token.lineHeight ? token.lineHeight + 'px' : 'normal'};
          ${token.letterSpacing ? `letter-spacing: ${token.letterSpacing}px;` : ''}
        ">The quick brown fox jumps over the lazy dog</div>
        
        <div class="typography-values">
          <div class="typography-value-item">
            <span class="value-label">Font</span>
            <span class="value-text">${token.fontFamily}</span>
          </div>
          <div class="typography-value-item">
            <span class="value-label">Size</span>
            <span class="value-text">${token.fontSize}px</span>
          </div>
          <div class="typography-value-item">
            <span class="value-label">Weight</span>
            <span class="value-text">${token.fontWeight}</span>
          </div>
          ${token.lineHeight ? `
            <div class="typography-value-item">
              <span class="value-label">Line Height</span>
              <span class="value-text">${token.lineHeight}px</span>
            </div>
          ` : ''}
          ${token.letterSpacing ? `
            <div class="typography-value-item">
              <span class="value-label">Letter Spacing</span>
              <span class="value-text">${token.letterSpacing}px</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  } else if (category === 'spacing') {
    detailContent = `
      <div class="spacing-detail">
        <div class="spacing-visualization">
          <div class="spacing-box-container">
            <div class="spacing-box-outer">
              <div class="spacing-box-inner" style="padding: ${token.value}px;"></div>
            </div>
          </div>
        </div>
        
        <div class="spacing-values">
          <div class="spacing-value-item">
            <span class="value-label">Value</span>
            <span class="value-text">${token.value}${token.unit || 'px'}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="token-detail-panel">
      <h2 class="token-detail-name">${token.name}</h2>
      ${token.description ? `<p class="token-description">${token.description}</p>` : ''}
      
      ${detailContent}
      
      <button id="apply-token-button" class="primary-button apply-token-button">
        Apply to Selection
      </button>
    </div>
  `;
}

// Helper functions
function getFirstCategory(tokens) {
  const categories = Object.keys(tokens).filter(cat => 
    tokens[cat] && Object.keys(tokens[cat]).length > 0
  );
  return categories[0] || null;
}

function formatCategoryName(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getCategoryIcon(category) {
  if (category === 'colors') {
    return `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="4"></circle>
      </svg>
    `;
  } else if (category === 'typography') {
    return `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4 7 4 4 20 4 20 7"></polyline>
        <line x1="9" y1="20" x2="15" y2="20"></line>
        <line x1="12" y1="4" x2="12" y2="20"></line>
      </svg>
    `;
  } else if (category === 'spacing') {
    return `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
    `;
  } else {
    return `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    `;
  }
}

function filterTokensBySearch(tokens, query) {
  const lowerQuery = query.toLowerCase();
  const filteredTokens = {};
  
  Object.entries(tokens).forEach(([key, token]) => {
    if (token.name.toLowerCase().includes(lowerQuery) || 
        (token.value && token.value.toString().toLowerCase().includes(lowerQuery)) ||
        (token.description && token.description.toLowerCase().includes(lowerQuery))) {
      filteredTokens[key] = token;
    }
  });
  
  return filteredTokens;
}