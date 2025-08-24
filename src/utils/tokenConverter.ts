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
      standardFormat[color.name] = {
        $type: 'color',
        $value: color.value,
        $description: color.role,
      };
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
      standardFormat[typo.name] = {
        $type: 'typography',
        $value: {
          fontFamily: typo.fontFamily,
          fontSize: typo.fontSize,
          fontWeight: typo.fontWeight,
          lineHeight: typo.lineHeight,
          letterSpacing: typo.letterSpacing,
          textTransform: typo.textTransform,
          textDecoration: typo.textDecoration,
        },
        $description: typo.description,
      };
    });
  }

  // Convert array-based spacing to standard format
  if (Array.isArray(data.spacing)) {
    data.spacing.forEach((space) => {
      standardFormat[space.name] = {
        $type: 'spacing',
        $value: space.value,
        $description: space.role,
      };
    });
  }

  // Convert array-based size to standard format
  if (Array.isArray(data.size)) {
    data.size.forEach((size) => {
      standardFormat[size.name] = {
        $type: 'size',
        $value: size.value,
        $description: size.role,
      };
    });
  }

  // Convert array-based opacity to standard format
  if (Array.isArray(data.opacity)) {
    data.opacity.forEach((opacity) => {
      standardFormat[opacity.name] = {
        $type: 'opacity',
        $value: opacity.value,
        $description: opacity.role,
      };
    });
  }

  // Convert array-based borderRadius to standard format
  if (Array.isArray(data.borderRadius)) {
    data.borderRadius.forEach((radius) => {
      standardFormat[radius.name] = {
        $type: 'borderRadius',
        $value: radius.value,
        $description: radius.role,
      };
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
        arrayFormat.colors!.push({
          name: pathParts[0],
          value: token.$value as string,
          role: token.$description,
        });
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

      arrayFormat.typography!.push({
        name,
        ...typographyValue,
        description: token.$description,
      } as Token);
    } else if (token.$type === 'spacing') {
      arrayFormat.spacing!.push({
        name: path,
        value: token.$value,
        role: token.$description,
      });
    } else if (token.$type === 'size') {
      arrayFormat.size!.push({
        name: path,
        value: token.$value,
        role: token.$description,
      });
    } else if (token.$type === 'opacity') {
      arrayFormat.opacity!.push({
        name: path,
        value: token.$value,
        role: token.$description,
      });
    } else if (token.$type === 'borderRadius') {
      arrayFormat.borderRadius!.push({
        name: path,
        value: token.$value,
        role: token.$description,
      });
    }
  });

  return arrayFormat;
}
