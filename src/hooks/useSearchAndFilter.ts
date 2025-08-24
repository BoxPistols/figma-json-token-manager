import { useMemo } from 'react';
import { FlattenedToken } from '../types';

export function useSearchAndFilter(
  groupedTokens: Record<string, FlattenedToken[]>,
  searchQuery: string,
  selectedTypes: Set<string>
) {
  const filteredTokens = useMemo(() => {
    if (!searchQuery) return groupedTokens;

    const filtered: Record<string, FlattenedToken[]> = {};
    Object.entries(groupedTokens).forEach(([type, tokens]) => {
      filtered[type] = tokens.filter(
        (token) =>
          token.path
            .join('/')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          token.value
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    });
    return filtered;
  }, [groupedTokens, searchQuery]);

  const filteredTokensByType = useMemo(() => {
    if (selectedTypes.size === 0) {
      return filteredTokens;
    }
    return Object.fromEntries(
      Object.entries(filteredTokens).filter(([type]) => selectedTypes.has(type))
    );
  }, [filteredTokens, selectedTypes]);

  return {
    filteredTokens,
    filteredTokensByType,
  };
}
