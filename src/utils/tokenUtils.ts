import { DesignToken, TokenGroup, FlattenedToken, TokenData } from '../types';
import { convertToStandardFormat, isArrayFormat } from './tokenConverter';

export function flattenTokens(data: TokenData): FlattenedToken[] {
  const flattened: FlattenedToken[] = [];
  
  // Check if it's array format first
  if (isArrayFormat(data)) {
    // Handle array format directly (colors, typography, spacing, etc.)
    Object.entries(data).forEach(([type, tokens]) => {
      if (Array.isArray(tokens)) {
        tokens.forEach(token => {
          // Split name to create path
          const path = token.name.split('/');
          let tokenValue = token.value;
          
          // For typography tokens, create a complete value object
          if (type === 'typography') {
            tokenValue = {
              value: token.value,
              fontFamily: token.fontFamily,
              fontSize: token.fontSize,
              fontWeight: token.fontWeight,
              lineHeight: token.lineHeight,
              letterSpacing: token.letterSpacing,
              textTransform: token.textTransform,
              textDecoration: token.textDecoration
            };
          }
          
          const flattenedToken = {
            path,
            type: type === 'colors' ? 'color' : 
                  type === 'typography' ? 'typography' :
                  type === 'spacing' ? 'spacing' :
                  type === 'size' ? 'size' :
                  type === 'opacity' ? 'opacity' :
                  type === 'borderRadius' ? 'borderRadius' :
                  type === 'borderColor' ? 'borderColor' :
                  type === 'shadow' ? 'shadow' :
                  type === 'breakpoint' ? 'breakpoint' :
                  type === 'icon' ? 'icon' : type.slice(0, -1), // remove 's'
            value: tokenValue,
            description: token.description,
            role: token.role
          };
          flattened.push(flattenedToken);
        });
      }
    });
  } else {
    // Convert to standard format if it's W3C format
    const standardFormat = convertToStandardFormat(data);
    
    function processToken(path: string[], token: DesignToken | TokenGroup) {
      if ('$type' in token && '$value' in token) {
        // Process typography values
        if (token.$type === 'typography' && typeof token.$value === 'object') {
          const typographyValue = token.$value as Record<string, unknown>;
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
          role: undefined  // W3C標準では role は別フィールド
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
  }

  return flattened;
}

export function validateToken(data: unknown): string | null {
  // Check if the data is empty
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return 'Token data is empty';
  }

  function validateNestedToken(token: unknown, path: string[] = []): string | null {
    if (!token) return null;

    if (typeof token === 'object' && token !== null && '$type' in token && '$value' in token) {
      const designToken = token as DesignToken;
      if (!['color', 'typography', 'spacing', 'size', 'opacity', 'borderRadius', 'dimension'].includes(designToken.$type)) {
        return `Invalid token type: ${designToken.$type} at ${path.join('.')}`;
      }

      // Validate typography token structure
      if (designToken.$type === 'typography') {
        const requiredFields = ['fontFamily', 'fontSize', 'fontWeight'];
        const value = designToken.$value as Record<string, unknown>;
        
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

  // Define logical order - BorderColor and Shadow go under Color family
  const logicalOrder = [
    'color',
    'borderColor', 
    'shadow',
    'typography',
    'spacing',
    'size',
    'opacity',
    'borderRadius',
    'breakpoint',
    'icon'
  ];

  // Sort groups by logical order
  const sortedGroups: Record<string, FlattenedToken[]> = {};
  logicalOrder.forEach(type => {
    if (groups[type]) {
      sortedGroups[type] = groups[type];
    }
  });

  // Add any remaining groups that weren't in the predefined order
  Object.entries(groups).forEach(([type, tokens]) => {
    if (!sortedGroups[type]) {
      sortedGroups[type] = tokens;
    }
  });

  return sortedGroups;
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