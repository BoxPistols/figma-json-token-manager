import { TokenData, TokenSet, DesignToken } from '../types';

export function convertToStandardFormat(data: TokenData): TokenSet {
  const standardFormat: TokenSet = {};

  // Convert array-based colors to standard format
  if (Array.isArray(data.colors)) {
    data.colors.forEach(color => {
      standardFormat[color.name] = {
        $type: 'color',
        $value: color.value,
        $description: color.role
      };
    });
  }

  // Convert variations to standard format
  if (data.variations) {
    Object.entries(data.variations).forEach(([name, variations]) => {
      Object.entries(variations).forEach(([shade, value]) => {
        standardFormat[`${name}/${shade}`] = {
          $type: 'color',
          $value: value,
          $description: `${name} ${shade}`
        };
      });
    });
  }

  return standardFormat;
}

export function convertToArrayFormat(data: TokenSet): TokenData {
  const arrayFormat: TokenData = {
    colors: [],
    variations: {}
  };

  // Process tokens and organize them into colors and variations
  Object.entries(data).forEach(([path, token]) => {
    if ('$type' in token && token.$type === 'color') {
      const pathParts = path.split('/');
      
      if (pathParts.length === 1) {
        // Base color
        arrayFormat.colors.push({
          name: pathParts[0],
          value: token.$value as string,
          role: token.$description
        });
      } else if (pathParts.length === 2) {
        // Variation
        const [colorName, shade] = pathParts;
        if (!arrayFormat.variations[colorName]) {
          arrayFormat.variations[colorName] = {
            main: '',
            dark: '',
            light: '',
            lighter: ''
          };
        }
        arrayFormat.variations[colorName][shade as keyof typeof arrayFormat.variations[typeof colorName]] = token.$value as string;
      }
    }
  });

  return arrayFormat;
}

export function isArrayFormat(data: any): boolean {
  return Array.isArray(data.colors);
}

export function isStandardFormat(data: any): boolean {
  return Object.values(data).some(value => 
    value && typeof value === 'object' && '$type' in value && '$value' in value
  );
}