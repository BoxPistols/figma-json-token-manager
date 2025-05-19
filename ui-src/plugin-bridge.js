// Bridge between plugin UI and plugin code

export function setupPluginMessageHandler(state) {
  return function handlePluginMessage(message) {
    console.log('Received message from plugin:', message);
    
    switch (message.type) {
      case 'show-import':
        state.currentView = 'import';
        break;
        
      case 'show-export':
        state.currentView = 'export';
        break;
        
      case 'show-about':
        state.currentView = 'about';
        break;
        
      case 'import-complete':
        // Tokens have been processed by the plugin
        // Show a success message or update UI
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification success';
        notificationElement.textContent = 'Tokens imported successfully!';
        document.body.appendChild(notificationElement);
        
        // Remove after 3 seconds
        setTimeout(() => {
          notificationElement.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(notificationElement);
          }, 300);
        }, 3000);
        break;
        
      case 'export-result':
        // Handle the exported tokens
        if (message.tokens) {
          state.tokens = message.tokens;
          
          // Add to history
          const newHistoryItem = {
            id: Date.now().toString(),
            name: `Export ${new Date().toLocaleTimeString()}`,
            date: new Date().toISOString(),
            type: 'export',
            tokenCount: countTokens(message.tokens)
          };
          
          state.history = [newHistoryItem, ...state.history];
          
          // Create a downloadable JSON
          downloadJSON(message.tokens, `figma-tokens-${formatDate(new Date())}.json`);
          
          // Navigate to preview
          state.currentView = 'preview';
        }
        break;
        
      case 'spacing-tokens-processed':
        console.log(`Processed ${message.count} spacing tokens`);
        break;
        
      default:
        console.log('Unhandled message type:', message.type);
    }
  };
}

// Helper function to count tokens
function countTokens(tokenSet) {
  let count = 0;
  for (const category in tokenSet) {
    count += Object.keys(tokenSet[category] || {}).length;
  }
  return count;
}

// Helper function to format date for filenames
function formatDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Helper function to download JSON
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}