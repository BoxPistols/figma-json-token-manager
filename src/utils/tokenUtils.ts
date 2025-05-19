import { TokenSet, DesignToken, TokenGroup, FlattenedToken, TokenData } from '../types';
import { convertToStandardFormat, convertToArrayFormat, isArrayFormat, isStandardFormat } from './tokenConverter';

export function flattenTokens(data: TokenData): FlattenedToken[] {
  const flattened: FlattenedToken[] = [];
  
  // Convert to standard format if needed
  const standardFormat = isArrayFormat(data) ? convertToStandardFormat(data) : data;

  function processToken(path: string[], token: DesignToken | TokenGroup) {
    if ('$type' in token && '$value' in token) {
      // Process typography values
      if (token.$type === 'typography' && typeof token.$value === 'object') {
        const typographyValue = token.$value as Record<string, any>;
        // Remove 'px' and '%' from values
        Object.keys(typographyValue).forEach(key => {
          if (typeof typographyValue[key] === 'string') {
            typographyValue[key] = typographyValue[key].replace(/(px|%)/g, '');
          }
        });
      }

      flattened.push({
        path,
        type: token.$type,
        value: token.$value,
        description: token.$description,
        role: token.$description
      });
    } else {
      Object.entries(token).forEach(([key, value]) => {
        processToken([...path, key], value as DesignToken | TokenGroup);
      });
    }
  }

  Object.entries(standardFormat).forEach(([key, value]) => {
    processToken([key], value as DesignToken | TokenGroup);
  });

  return flattened;
}

export function validateToken(data: any): string | null {
  // Check if the data is empty
  if (!data || Object.keys(data).length === 0) {
    return 'Token data is empty';
  }

  function validateNestedToken(token: any, path: string[] = []): string | null {
    if (!token) return null;

    if ('$type' in token && '$value' in token) {
      if (!['color', 'typography', 'spacing', 'size', 'opacity', 'borderRadius', 'dimension'].includes(token.$type)) {
        return `Invalid token type: ${token.$type} at ${path.join('.')}`;
      }

      // Validate typography token structure
      if (token.$type === 'typography') {
        const requiredFields = ['fontFamily', 'fontSize', 'fontWeight'];
        const value = token.$value as Record<string, any>;
        
        for (const field of requiredFields) {
          if (!(field in value)) {
            return `Missing required field '${field}' in typography token at ${path.join('.')}`;
          }
        }
      }

      return null;
    }

    if (typeof token === 'object' && !Array.isArray(token)) {
      for (const [key, value] of Object.entries(token)) {
        const error = validateNestedToken(value, [...path, key]);
        if (error) return error;
      }
    }

    return null;
  }

  return validateNestedToken(data);
}

export function groupTokensByType(tokens: FlattenedToken[]): Record<string, FlattenedToken[]> {
  const groups: Record<string, FlattenedToken[]> = {};

  tokens.forEach(token => {
    const type = token.type || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(token);
  });

  return groups;
}

// Local Storage Functions
const STORAGE_KEY = 'design-tokens-state';

export function saveTokensToStorage(tokens: TokenData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Error saving tokens to localStorage:', error);
  }
}

export function loadTokensFromStorage(): TokenData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading tokens from localStorage:', error);
    return null;
  }
}

export function clearTokensFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tokens from localStorage:', error);
  }
}