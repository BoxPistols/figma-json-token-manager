export interface TokenSet {
  [key: string]: DesignToken | TokenGroup;
}

export interface TokenGroup {
  [key: string]: DesignToken | TokenGroup;
}

export interface DesignToken {
  $type: 'color' | 'typography' | 'spacing' | 'size' | 'opacity' | 'borderRadius';
  $value: string | number | Record<string, unknown>;
  $description?: string;
}

// 汎用トークン定義
export interface Token {
  name: string;
  value: string | number | Record<string, unknown>;
  role?: string;
  description?: string;
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textTransform?: string;
  textDecoration?: string;
}

// カラートークン定義（後方互換性のため）
export interface ColorToken extends Token {
  value: string;
}

// タイポグラフィトークン定義（後方互換性のため）
export interface TypographyToken extends Token {
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textTransform?: string;
  textDecoration?: string;
}

// カラーバリエーション定義
export interface ColorVariation {
  main: string;
  dark: string;
  light: string;
  lighter: string;
  [key: string]: string; // インデックスシグネチャを追加
}

// カラーバリエーションの集合
export interface ColorVariations {
  [colorName: string]: ColorVariation;
}

// トークンデータ構造
export interface TokenData {
  colors?: Token[];
  variations?: ColorVariations;
  typography?: Token[];
  spacing?: Token[];
  size?: Token[];
  opacity?: Token[];
  borderRadius?: Token[];
  [key: string]: unknown; // その他のプロパティを許可
}

export interface FlattenedToken {
  path: string[];
  type: string;
  value: string | number | Record<string, unknown>;
  description?: string;
  role?: string;
}

export interface ImportError {
  message: string;
  path?: string[];
}

export interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenData;
}