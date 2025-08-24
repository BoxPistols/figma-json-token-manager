import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  isSearchFocused: boolean;
  setSearchQuery: (query: string) => void;
}

export function useKeyboardShortcuts({
  isSearchFocused,
  setSearchQuery,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Win/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById(
          'search-input'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      // Escape to clear search
      if (event.key === 'Escape' && isSearchFocused) {
        setSearchQuery('');
        const searchInput = document.getElementById(
          'search-input'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchFocused, setSearchQuery]);
}
