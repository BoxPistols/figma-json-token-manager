import { useState, useCallback, useEffect } from 'react';
import type { TokenSet, FlattenedToken, ValidationResult } from '../types';
import {
  flattenTokenSet,
  validateAgainstSchema,
  detectCircularReferences,
  exportToW3C,
} from '../utils';
import { sampleTokens } from '../data/sampleTokens';

const STORAGE_KEY = 'figma-design-tokens';

export function useTokens() {
  const [tokenSet, setTokenSet] = useState<TokenSet>({});
  const [flattened, setFlattened] = useState<FlattenedToken[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [circularRefs, setCircularRefs] = useState<string[]>([]);

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TokenSet;
        setTokenSet(parsed);
      } else {
        // Load sample tokens if no data exists
        setTokenSet(sampleTokens);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = useCallback((data: TokenSet) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const flat = flattenTokenSet(tokenSet);
    setFlattened(flat);
    const result = validateAgainstSchema(tokenSet);
    setValidation(result);
    setCircularRefs(detectCircularReferences(tokenSet));
    saveToStorage(tokenSet);
  }, [tokenSet, saveToStorage]);

  const importTokens = useCallback((data: TokenSet) => {
    setTokenSet(data);
  }, []);

  const exportTokens = useCallback((): string => {
    const output = exportToW3C(flattened);
    const enriched = {
      $schema:
        'https://design-tokens.app/schemas/w3c-design-tokens.schema.json',
      ...output,
    };
    return JSON.stringify(enriched, null, 2);
  }, [flattened]);

  const clearTokens = useCallback(() => {
    setTokenSet({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    tokenSet,
    flattened,
    validation,
    circularRefs,
    importTokens,
    exportTokens,
    clearTokens,
  };
}
