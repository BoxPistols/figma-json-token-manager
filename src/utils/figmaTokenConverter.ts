import { TokenData } from '../types';

export interface FigmaTokenData {
  colors: {
    variables: Record<string, string>;
    styles: Record<string, string>;
  };
  typography: {
    styles: Record<string, TypographyStyle>;
  };
  spacing: {
    variables: Record<string, number>;
  };
  size: {
    variables: Record<string, number>;
  };
  opacity: {
    variables: Record<string, number>;
  };
  borderRadius: {
    variables: Record<string, number>;
  };
  effects: {
    styles: Record<string, EffectStyle>;
  };
  grids: {
    styles: Record<string, GridStyle>;
  };
}

export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number | string;
  letterSpacing: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface EffectStyle {
  type: 'dropShadow' | 'innerShadow' | 'blur';
  color: string;
  offsetX: number;
  offsetY: number;
  radius: number;
  spread?: number;
  visible: boolean;
}

export interface GridStyle {
  pattern: 'grid' | 'columns' | 'rows';
  sectionSize: number;
  visible: boolean;
  color: string;
  gutterSize: number;
  alignment: 'min' | 'max' | 'center' | 'stretch';
  count: number;
}

/**
 * TokenDataをFigma対応の形式に変換
 * カラーはVariable Collection、その他はStylesとして出力
 */
export function convertToFigmaFormat(tokens: TokenData): FigmaTokenData {
  const figmaData: FigmaTokenData = {
    colors: { variables: {}, styles: {} },
    typography: { styles: {} },
    spacing: { variables: {} },
    size: { variables: {} },
    opacity: { variables: {} },
    borderRadius: { variables: {} },
    effects: { styles: {} },
    grids: { styles: {} },
  };

  // カラートークンの処理
  if (tokens.colors && Array.isArray(tokens.colors)) {
    tokens.colors.forEach((color) => {
      const name = color.name;
      const value = color.value as string;

      // Variable Collectionとして出力（Figmaで推奨）
      figmaData.colors.variables[name] = value;

      // 従来のスタイルとしても出力（互換性のため）
      figmaData.colors.styles[name] = value;
    });
  }

  // カラーバリエーションの処理
  if (tokens.variations) {
    Object.entries(tokens.variations).forEach(([baseName, variations]) => {
      Object.entries(variations).forEach(([variant, value]) => {
        if (value && typeof value === 'string') {
          const fullName = `${baseName}/${variant}`;
          figmaData.colors.variables[fullName] = value;
          figmaData.colors.styles[fullName] = value;
        }
      });
    });
  }

  // タイポグラフィトークンの処理
  if (tokens.typography && Array.isArray(tokens.typography)) {
    tokens.typography.forEach((typography) => {
      const name = typography.name;
      const value = typography.value;

      if (typeof value === 'object' && value !== null) {
        const typoValue = value as Record<string, unknown>;
        figmaData.typography.styles[name] = {
          fontFamily: String(typoValue.fontFamily || 'Inter'),
          fontSize: Number(typoValue.fontSize) || 16,
          fontWeight: Number(typoValue.fontWeight) || 400,
          lineHeight: (typoValue.lineHeight as string | number) || 1.5,
          letterSpacing: Number(typoValue.letterSpacing) || 0,
          textAlign:
            (typoValue.textAlign as 'left' | 'center' | 'right' | 'justify') ||
            'left',
          textDecoration:
            (typoValue.textDecoration as
              | 'none'
              | 'underline'
              | 'line-through') || 'none',
          textTransform:
            (typoValue.textTransform as
              | 'none'
              | 'uppercase'
              | 'lowercase'
              | 'capitalize') || 'none',
        };
      }
    });
  }

  // スペーシングトークンの処理
  if (tokens.spacing && Array.isArray(tokens.spacing)) {
    tokens.spacing.forEach((spacing) => {
      const name = spacing.name;
      const value = spacing.value;

      if (typeof value === 'number') {
        figmaData.spacing.variables[name] = value;
      } else if (typeof value === 'string') {
        // px, rem, emなどの単位を数値に変換
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          figmaData.spacing.variables[name] = numericValue;
        }
      }
    });
  }

  // サイズトークンの処理
  if (tokens.size && Array.isArray(tokens.size)) {
    tokens.size.forEach((size) => {
      const name = size.name;
      const value = size.value;

      if (typeof value === 'number') {
        figmaData.size.variables[name] = value;
      } else if (typeof value === 'string') {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          figmaData.size.variables[name] = numericValue;
        }
      }
    });
  }

  // 透明度トークンの処理
  if (tokens.opacity && Array.isArray(tokens.opacity)) {
    tokens.opacity.forEach((opacity) => {
      const name = opacity.name;
      const value = opacity.value;

      if (typeof value === 'number') {
        // 0-1の範囲に正規化
        figmaData.opacity.variables[name] = Math.max(
          0,
          Math.min(1, value / 100)
        );
      } else if (typeof value === 'string') {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          figmaData.opacity.variables[name] = Math.max(
            0,
            Math.min(1, numericValue / 100)
          );
        }
      }
    });
  }

  // ボーダーラジウストークンの処理
  if (tokens.borderRadius && Array.isArray(tokens.borderRadius)) {
    tokens.borderRadius.forEach((borderRadius) => {
      const name = borderRadius.name;
      const value = borderRadius.value;

      if (typeof value === 'number') {
        figmaData.borderRadius.variables[name] = value;
      } else if (typeof value === 'string') {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          figmaData.borderRadius.variables[name] = numericValue;
        }
      }
    });
  }

  return figmaData;
}

/**
 * Figma用のJSONファイルを生成
 */
export function generateFigmaJSON(
  tokens: TokenData,
  format: 'figma-variables' | 'figma-styles' | 'figma-hybrid' = 'figma-hybrid'
): string {
  console.log('Input tokens:', tokens);

  const figmaData = convertToFigmaFormat(tokens);
  console.log('Converted figma data:', figmaData);

  let outputData: Record<string, unknown> = {};

  switch (format) {
    case 'figma-variables':
      // Variable Collectionsのみ
      outputData = {
        colors: figmaData.colors.variables,
        spacing: figmaData.spacing.variables,
        size: figmaData.size.variables,
        opacity: figmaData.opacity.variables,
        borderRadius: figmaData.borderRadius.variables,
      };
      break;

    case 'figma-styles':
      // Stylesのみ
      outputData = {
        colors: figmaData.colors.styles,
        typography: figmaData.typography.styles,
        effects: figmaData.effects.styles,
        grids: figmaData.grids.styles,
      };
      break;

    case 'figma-hybrid':
    default:
      // ハイブリッド（推奨）
      outputData = {
        variables: {
          colors: figmaData.colors.variables,
          spacing: figmaData.spacing.variables,
          size: figmaData.size.variables,
          opacity: figmaData.opacity.variables,
          borderRadius: figmaData.borderRadius.variables,
        },
        styles: {
          colors: figmaData.colors.styles,
          typography: figmaData.typography.styles,
          effects: figmaData.effects.styles,
          grids: figmaData.grids.styles,
        },
      };
      break;
  }

  console.log('Final output data:', outputData);
  return JSON.stringify(outputData, null, 2);
}

/**
 * Figmaプラグイン用のコード生成
 */
export function generateFigmaPluginCode(tokens: TokenData): string {
  const figmaData = convertToFigmaFormat(tokens);

  const code = `// Figma Plugin Code - Auto-generated from Design Tokens
import { TokenSet, DesignToken } from './types';

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

// Create Variable Collections
async function createVariableCollections() {
  // Color Variables
  const colorCollection = figma.variables.createVariableCollection('Design Tokens - Colors');
  const colorMode = colorCollection.addMode('Default');
  
  Object.entries(${JSON.stringify(figmaData.colors.variables, null, 2)}).forEach(([name, value]) => {
    const variable = figma.variables.createVariable(name, colorCollection, 'COLOR');
    variable.setValueForMode(colorMode, hexToRgb(value as string));
  });
  
  // Spacing Variables
  const spacingCollection = figma.variables.createVariableCollection('Design Tokens - Spacing');
  const spacingMode = spacingCollection.addMode('Default');
  
  Object.entries(${JSON.stringify(figmaData.spacing.variables, null, 2)}).forEach(([name, value]) => {
    const variable = figma.variables.createVariable(name, spacingCollection, 'FLOAT');
    variable.setValueForMode(spacingMode, value);
  });
  
  // Size Variables
  const sizeCollection = figma.variables.createVariableCollection('Design Tokens - Sizes');
  const sizeMode = sizeCollection.addMode('Default');
  
  Object.entries(${JSON.stringify(figmaData.size.variables, null, 2)}).forEach(([name, value]) => {
    const variable = figma.variables.createVariable(name, sizeCollection, 'FLOAT');
    variable.setValueForMode(sizeMode, value);
  });
  
  // Opacity Variables
  const opacityCollection = figma.variables.createVariableCollection('Design Tokens - Opacity');
  const opacityMode = opacityCollection.addMode('Default');
  
  Object.entries(${JSON.stringify(figmaData.opacity.variables, null, 2)}).forEach(([name, value]) => {
    const variable = figma.variables.createVariable(name, opacityCollection, 'FLOAT');
    variable.setValueForMode(opacityMode, value);
  });
  
  // Border Radius Variables
  const borderRadiusCollection = figma.variables.createVariableCollection('Design Tokens - Border Radius');
  const borderRadiusMode = borderRadiusCollection.addMode('Default');
  
  Object.entries(${JSON.stringify(figmaData.borderRadius.variables, null, 2)}).forEach(([name, value]) => {
    const variable = figma.variables.createVariable(name, borderRadiusCollection, 'FLOAT');
    variable.setValueForMode(borderRadiusMode, value);
  });
}

// Create Text Styles
async function createTextStyles() {
  Object.entries(${JSON.stringify(figmaData.typography.styles, null, 2)}).forEach(([name, style]) => {
    const textStyle = figma.createTextStyle();
    textStyle.name = name;
    
    // Note: Figma API limitations may require manual font loading
    // textStyle.fontName = { family: style.fontFamily, style: 'Regular' };
    textStyle.fontSize = style.fontSize;
    textStyle.lineHeight = { value: typeof style.lineHeight === 'number' ? style.lineHeight : 1.5, unit: 'PIXELS' };
    textStyle.letterSpacing = { value: style.letterSpacing, unit: 'PIXELS' };
  });
}

// Utility function
function hexToRgb(hex: string) {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}

// Main execution
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-tokens') {
    await createVariableCollections();
    await createTextStyles();
    figma.notify('Design tokens created successfully!');
  }
};

// Auto-execute on plugin start
createVariableCollections();
createTextStyles();
`;

  return code;
}
