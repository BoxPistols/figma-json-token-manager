// 'ColorToken' と 'processTokenGroup' は未使用のため削除
import {
  DesignToken,
  TokenData,
  TokenSet,
  Token,
  ColorVariations,
  TokenGroup,
} from '../types';

export function convertToStandardFormat(data: TokenData): TokenSet {
  const standardFormat: TokenSet = {};

  // Convert array-based colors to standard format
  if (Array.isArray(data.colors)) {
    data.colors.forEach((color) => {
      const token: DesignToken = {
        $type: 'color',
        $value: color.value,
      };

      // Preserve both role and description fields
      if (color.role) {
        token.$role = color.role;
      }
      if (color.description) {
        token.$description = color.description;
      }

      standardFormat[color.name] = token;
    });
  }

  // Convert variations to standard format
  if (data.variations) {
    Object.entries(data.variations).forEach(([name, variations]) => {
      Object.entries(variations).forEach(([shade, value]) => {
        const tokenKey = `${name}/${shade}`;
        // 既に存在するトークンの場合は上書きしない（colors配列が優先）
        if (!standardFormat[tokenKey]) {
          standardFormat[tokenKey] = {
            $type: 'color',
            $value: value,
            $description: `${name} ${shade}`,
          };
        }
      });
    });
  }

  // Convert array-based typography to standard format
  if (Array.isArray(data.typography)) {
    data.typography.forEach((typo) => {
      // Ensure fontSize is properly formatted (with 'px' suffix if numeric)
      let fontSize = typo.fontSize;
      if (typeof fontSize === 'number') {
        fontSize = `${fontSize}px`;
      }

      const token: DesignToken = {
        $type: 'typography',
        $value: {
          fontFamily: typo.fontFamily,
          fontSize: fontSize,
          fontWeight: typo.fontWeight,
          lineHeight: typo.lineHeight,
          letterSpacing: typo.letterSpacing,
          textTransform: typo.textTransform,
          textDecoration: typo.textDecoration,
        },
      };

      // Preserve both role and description fields
      if (typo.role) {
        token.$role = typo.role;
      }
      if (typo.description) {
        token.$description = typo.description;
      }

      standardFormat[typo.name] = token;
    });
  }

  // Convert array-based spacing to standard format
  if (Array.isArray(data.spacing)) {
    data.spacing.forEach((space) => {
      const token: DesignToken = {
        $type: 'spacing',
        $value: space.value,
      };

      // Preserve both role and description fields
      if (space.role) {
        token.$role = space.role;
      }
      if (space.description) {
        token.$description = space.description;
      }

      standardFormat[space.name] = token;
    });
  }

  // Convert array-based size to standard format
  if (Array.isArray(data.size)) {
    data.size.forEach((size) => {
      const token: DesignToken = {
        $type: 'size',
        $value: size.value,
      };

      // Preserve both role and description fields
      if (size.role) {
        token.$role = size.role;
      }
      if (size.description) {
        token.$description = size.description;
      }

      standardFormat[size.name] = token;
    });
  }

  // Convert array-based opacity to standard format
  if (Array.isArray(data.opacity)) {
    data.opacity.forEach((opacity) => {
      const token: DesignToken = {
        $type: 'opacity',
        $value: opacity.value,
      };

      // Preserve both role and description fields
      if (opacity.role) {
        token.$role = opacity.role;
      }
      if (opacity.description) {
        token.$description = opacity.description;
      }

      standardFormat[opacity.name] = token;
    });
  }

  // Convert array-based borderRadius to standard format
  if (Array.isArray(data.borderRadius)) {
    data.borderRadius.forEach((radius) => {
      const token: DesignToken = {
        $type: 'borderRadius',
        $value: radius.value,
      };

      // Preserve both role and description fields
      if (radius.role) {
        token.$role = radius.role;
      }
      if (radius.description) {
        token.$description = radius.description;
      }

      standardFormat[radius.name] = token;
    });
  }

  return standardFormat;
}

export function isArrayFormat(data: unknown): boolean {
  if (data === null || typeof data !== 'object') {
    return false;
  }

  const tokenData = data as TokenData;

  // Check for array format (our current mockTokens format)
  const hasArrayFormat =
    Array.isArray(tokenData.colors) ||
    Array.isArray(tokenData.typography) ||
    Array.isArray(tokenData.spacing) ||
    Array.isArray(tokenData.size) ||
    Array.isArray(tokenData.opacity) ||
    Array.isArray(tokenData.borderRadius) ||
    Array.isArray(tokenData.borderColor) ||
    Array.isArray(tokenData.shadow) ||
    Array.isArray(tokenData.breakpoint) ||
    Array.isArray(tokenData.icon);

  // If it has array format, return true
  if (hasArrayFormat) {
    return true;
  }

  // Check if it's W3C format by looking for $type/$value patterns
  // If no direct tokens found at root level, it's likely W3C nested format
  const hasW3CTokens = Object.values(tokenData).some(
    (value) =>
      typeof value === 'object' &&
      value !== null &&
      ('$type' in value || '$value' in value)
  );

  // If it has W3C tokens at root level, it's not array format
  if (hasW3CTokens) {
    return false;
  }

  // Check for nested W3C format (like Figma Design Tokens Manager)
  // Recursively check for W3C tokens at any depth
  function hasW3CTokensRecursive(obj: Record<string, unknown>): boolean {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return false;
    }

    // Check if current object is a W3C token
    if ('$type' in obj || '$value' in obj) {
      return true;
    }

    // Recursively check nested objects
    return Object.values(obj).some((value) =>
      typeof value === 'object' && value !== null && !Array.isArray(value)
        ? hasW3CTokensRecursive(value as Record<string, unknown>)
        : false
    );
  }

  const hasNestedW3CTokens = hasW3CTokensRecursive(tokenData);

  // If it has nested W3C tokens, it's not array format
  return !hasNestedW3CTokens;
}

// ネストされたTokenSetをフラットなTokenSetに変換する関数を追加
export function flattenTokenSet(
  data: TokenSet,
  parentPath: string[] = []
): TokenSet {
  let result: TokenSet = {};

  Object.entries(data).forEach(([key, value]) => {
    const currentPath = [...parentPath, key];

    if ('$type' in value) {
      // DesignTokenの場合はパスをスラッシュ区切りにしてセット
      result[currentPath.join('/')] = value;
    } else {
      // TokenGroupの場合は再帰的に処理
      const nested = flattenTokenSet(value as TokenGroup, currentPath);
      result = { ...result, ...nested };
    }
  });

  return result;
}

// convertToArrayFormatを修正し、flattenTokenSetを使うように変更
export function convertToArrayFormat(data: TokenSet): TokenData {
  const flatData = flattenTokenSet(data);

  const arrayFormat: TokenData = {
    colors: [],
    variations: {} as ColorVariations,
    typography: [],
    spacing: [],
    size: [],
    opacity: [],
    borderRadius: [],
  };

  Object.entries(flatData).forEach(([path, tokenOrGroup]) => {
    const token = tokenOrGroup as DesignToken;

    if (token.$type === 'color') {
      const pathParts = path.split('/');

      if (pathParts.length === 1) {
        const colorToken: Token = {
          name: pathParts[0],
          value: token.$value as string,
        };

        // Preserve both role and description fields
        if (token.$role) {
          colorToken.role = token.$role;
        }
        if (token.$description) {
          colorToken.description = token.$description;
        }

        arrayFormat.colors!.push(colorToken);
      } else if (pathParts.length >= 2) {
        const colorName = pathParts[0];
        const shade = pathParts[pathParts.length - 1];

        if (!arrayFormat.variations![colorName]) {
          arrayFormat.variations![colorName] = {
            main: '',
            dark: '',
            light: '',
            lighter: '',
          };
        }

        if (typeof token.$value === 'string') {
          const shadeParts = shade.split('/');
          let currentLevel: Record<string, unknown> =
            arrayFormat.variations![colorName];

          for (let i = 0; i < shadeParts.length - 1; i++) {
            const part = shadeParts[i];
            if (!currentLevel[part]) {
              currentLevel[part] = {};
            }
            currentLevel = currentLevel[part] as Record<string, unknown>;
          }

          currentLevel[shadeParts[shadeParts.length - 1]] = token.$value;
        }
      }
    } else if (token.$type === 'typography') {
      const pathParts = path.split('/');
      const name = pathParts.join('-');

      const typographyValue =
        typeof token.$value === 'object'
          ? (token.$value as Record<string, unknown>)
          : {};

      // Convert fontSize from string to number if needed
      let fontSize = typographyValue.fontSize;
      if (typeof fontSize === 'string') {
        const numericValue = parseFloat(fontSize.replace('px', ''));
        if (!isNaN(numericValue)) {
          fontSize = numericValue;
        }
      }

      const typoToken: Token = {
        name,
        ...typographyValue,
        fontSize: fontSize,
      };

      // Preserve both role and description fields
      if (token.$role) {
        typoToken.role = token.$role;
      }
      if (token.$description) {
        typoToken.description = token.$description;
      }

      arrayFormat.typography!.push(typoToken);
    } else if (token.$type === 'spacing') {
      const spacingToken: Token = {
        name: path,
        value: token.$value,
      };

      // Preserve both role and description fields
      if (token.$role) {
        spacingToken.role = token.$role;
      }
      if (token.$description) {
        spacingToken.description = token.$description;
      }

      arrayFormat.spacing!.push(spacingToken);
    } else if (token.$type === 'size') {
      const sizeToken: Token = {
        name: path,
        value: token.$value,
      };

      // Preserve both role and description fields
      if (token.$role) {
        sizeToken.role = token.$role;
      }
      if (token.$description) {
        sizeToken.description = token.$description;
      }

      arrayFormat.size!.push(sizeToken);
    } else if (token.$type === 'opacity') {
      const opacityToken: Token = {
        name: path,
        value: token.$value,
      };

      // Preserve both role and description fields
      if (token.$role) {
        opacityToken.role = token.$role;
      }
      if (token.$description) {
        opacityToken.description = token.$description;
      }

      arrayFormat.opacity!.push(opacityToken);
    } else if (token.$type === 'borderRadius') {
      const borderRadiusToken: Token = {
        name: path,
        value: token.$value,
      };

      // Preserve both role and description fields
      if (token.$role) {
        borderRadiusToken.role = token.$role;
      }
      if (token.$description) {
        borderRadiusToken.description = token.$description;
      }

      arrayFormat.borderRadius!.push(borderRadiusToken);
    }
  });

  return arrayFormat;
}
