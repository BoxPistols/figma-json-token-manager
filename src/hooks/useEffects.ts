import { useEffect } from 'react';

export function useEffects(
  viewMode: 'standard' | 'compact' | 'table',
  isBulkDeleteMode: boolean,
  setSelectedTypes: (types: Set<string>) => void
) {
  // Reset filters when view mode changes
  useEffect(() => {
    setSelectedTypes(new Set());
  }, [viewMode, isBulkDeleteMode, setSelectedTypes]);
}
