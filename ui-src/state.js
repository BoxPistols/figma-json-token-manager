// Simple state management for the plugin UI

export function createState(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();
  
  // Get current state (creates a copy to prevent direct mutation)
  function getState() {
    return JSON.parse(JSON.stringify(state));
  }
  
  // Create a proxy for state updates
  const stateProxy = new Proxy(state, {
    set(target, property, value) {
      // Update the property
      target[property] = value;
      
      // Notify listeners of state change
      notifyListeners();
      
      return true;
    }
  });
  
  // Subscribe to state changes
  function subscribe(listener) {
    if (typeof listener === 'function') {
      listeners.add(listener);
      
      // Return unsubscribe function
      return () => {
        listeners.delete(listener);
      };
    }
  }
  
  // Notify all listeners of state changes
  function notifyListeners() {
    listeners.forEach(listener => {
      try {
        listener(getState());
      } catch (error) {
        console.error('Error in state change listener:', error);
      }
    });
  }
  
  // Update multiple state properties at once
  function setState(partialState) {
    if (typeof partialState === 'object' && partialState !== null) {
      Object.entries(partialState).forEach(([key, value]) => {
        stateProxy[key] = value;
      });
    }
  }
  
  return {
    ...stateProxy,
    getState,
    subscribe,
    setState
  };
}