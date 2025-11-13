import { DesignToken, TokenGroup, FlattenedToken, TokenData } from '../types';
import { isArrayFormat } from './tokenConverter';

export function flattenTokens(data: TokenData): FlattenedToken[] {
  const flattened: FlattenedToken[] = [];

  // Check if it's array format first
  const isArray = isArrayFormat(data);
  console.log('Data format check - isArrayFormat:', isArray);

  if (isArray) {
    // Handle array format directly (colors, typography, spacing, etc.)
    Object.entries(data).forEach(([type, tokens]) => {
      if (Array.isArray(tokens)) {
        tokens.forEach((token) => {
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
              textDecoration: token.textDecoration,
            };
          }

          const flattenedToken = {
            path,
            type:
              type === 'colors'
                ? 'color'
                : type === 'typography'
                  ? 'typography'
                  : type === 'spacing'
                    ? 'spacing'
                    : type === 'size'
                      ? 'size'
                      : type === 'opacity'
                        ? 'opacity'
                        : type === 'borderRadius'
                          ? 'borderRadius'
                          : type === 'borderColor'
                            ? 'borderColor'
                            : type === 'shadow'
                              ? 'shadow'
                              : type === 'breakpoint'
                                ? 'breakpoint'
                                : type === 'icon'
                                  ? 'icon'
                                  : type.slice(0, -1), // remove 's'
            value: tokenValue,
            description: token.description,
            role: token.role,
          };
          flattened.push(flattenedToken);
        });
      }
    });
  } else {
    // Handle W3C format directly (Figma Design Tokens Manager format)
    console.log('Entering W3C processing');
    function processToken(path: string[], token: DesignToken | TokenGroup) {
      if ('$type' in token && '$value' in token) {
        // Keep typography values as objects for proper display
        let processedValue = token.$value;

        // For typography, ensure fontSize is numeric for proper display
        if (token.$type === 'typography' && typeof token.$value === 'object') {
          const typographyValue = {
            ...(token.$value as Record<string, unknown>),
          };

          // Convert fontSize from "16px" to 16 for consistent display
          if (
            typographyValue.fontSize &&
            typeof typographyValue.fontSize === 'string'
          ) {
            const fontSize = typographyValue.fontSize.replace('px', '');
            if (!isNaN(parseFloat(fontSize))) {
              typographyValue.fontSize = parseFloat(fontSize);
            }
          }

          // Convert fontWeight to number if it's a string
          if (
            typographyValue.fontWeight &&
            typeof typographyValue.fontWeight === 'string'
          ) {
            const weight = parseInt(typographyValue.fontWeight);
            if (!isNaN(weight)) {
              typographyValue.fontWeight = weight;
            }
          }

          processedValue = typographyValue;
        }

        flattened.push({
          path,
          type: token.$type,
          value: processedValue,
          description: token.$description,
          role: token.$role, // W3Cフォーマットの$roleフィールドを処理
        });
      } else {
        // Recursively process nested objects
        Object.entries(token).forEach(([key, value]) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            processToken([...path, key], value as DesignToken | TokenGroup);
          }
        });
      }
    }

    // Process the data directly without conversion
    // Handle both direct W3C format and nested format (like figma: { ... })
    console.log('Starting W3C data processing with keys:', Object.keys(data));
    Object.entries(data).forEach(([key, value]) => {
      console.log('Processing entry:', key);
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Check if this is a direct token or needs further processing
        if ('$type' in value && '$value' in value) {
          // Direct token at root level
          processToken([key], value as DesignToken);
        } else {
          // Nested structure, process recursively
          console.log('Calling processToken for:', key);
          processToken([key], value as TokenGroup);
        }
      }
    });
  }

  console.log('Final flattened result:', flattened.length, 'tokens');
  return flattened;
}

export function validateToken(data: unknown): string | null {
  // Check if the data is empty
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return 'Token data is empty';
  }

  function validateNestedToken(
    token: unknown,
    path: string[] = []
  ): string | null {
    if (!token) return null;

    if (
      typeof token === 'object' &&
      token !== null &&
      '$type' in token &&
      '$value' in token
    ) {
      const designToken = token as DesignToken;
      if (
        ![
          'color',
          'typography',
          'spacing',
          'size',
          'opacity',
          'borderRadius',
          'dimension',
        ].includes(designToken.$type)
      ) {
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

export function groupTokensByType(
  tokens: FlattenedToken[]
): Record<string, FlattenedToken[]> {
  const groups: Record<string, FlattenedToken[]> = {};

  tokens.forEach((token) => {
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
    'icon',
  ];

  // Sort groups by logical order
  const sortedGroups: Record<string, FlattenedToken[]> = {};
  logicalOrder.forEach((type) => {
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
const MAX_STORAGE_SIZE_MB = 5; // Maximum recommended size in MB

export interface StorageResult {
  success: boolean;
  error?: string;
  sizeInMB?: number;
}

export function saveTokensToStorage(
  tokens: TokenData
): StorageResult {
  try {
    const jsonString = JSON.stringify(tokens);

    // Check data size
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    // Warn if approaching or exceeding size limit
    if (sizeInMB > MAX_STORAGE_SIZE_MB) {
      const errorMsg = `Token data size (${sizeInMB.toFixed(2)}MB) exceeds recommended limit of ${MAX_STORAGE_SIZE_MB}MB. Data may not be saved reliably.`;
      console.error(errorMsg);
      return {
        success: false,
        error: errorMsg,
        sizeInMB,
      };
    }

    // Log warning if size is close to limit
    if (sizeInMB > MAX_STORAGE_SIZE_MB * 0.8) {
      console.warn(
        `Token data size (${sizeInMB.toFixed(2)}MB) is approaching the ${MAX_STORAGE_SIZE_MB}MB limit.`
      );
    }

    localStorage.setItem(STORAGE_KEY, jsonString);
    return {
      success: true,
      sizeInMB,
    };
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : 'Unknown error saving to localStorage';

    // Check for quota exceeded error
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      console.error(
        'localStorage quota exceeded. Please reduce the number of tokens or clear browser storage.'
      );
      return {
        success: false,
        error: 'Storage quota exceeded',
      };
    }

    console.error('Error saving tokens to localStorage:', error);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export function loadTokensFromStorage(): TokenData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    // Validate JSON structure before parsing
    const parsed = JSON.parse(stored);

    // Basic validation - check if it's an object
    if (typeof parsed !== 'object' || parsed === null) {
      console.error('Invalid token data format in localStorage');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error loading tokens from localStorage:', error);

    // If parsing fails, clear corrupted data
    if (error instanceof SyntaxError) {
      console.warn('Corrupted localStorage data detected. Clearing...');
      clearTokensFromStorage();
    }

    return null;
  }
}

export function clearTokensFromStorage(): StorageResult {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return {
      success: true,
    };
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : 'Unknown error clearing localStorage';
    console.error('Error clearing tokens from localStorage:', error);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

// Get storage usage information
export function getStorageInfo(): {
  sizeInMB: number;
  percentUsed: number;
} | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        sizeInMB: 0,
        percentUsed: 0,
      };
    }

    const sizeInBytes = new Blob([stored]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const percentUsed = (sizeInMB / MAX_STORAGE_SIZE_MB) * 100;

    return {
      sizeInMB,
      percentUsed,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return null;
  }
}
