export interface TokenSet {
  [key: string]: DesignToken | TokenGroup;
}

export interface TokenGroup {
  [key: string]: DesignToken | TokenGroup;
}

export interface DesignToken {
  $type: 'color' | 'typography' | 'spacing' | 'size' | 'opacity' | 'borderRadius';
  $value: string | number | Record<string, any>;
  $description?: string;
}

// カラートークン定義
export interface ColorToken {
  name: string;
  value: string;
  role?: string;
}

// タイポグラフィトークン定義
export interface TypographyToken {
  name: string;
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textTransform?: string;
  textDecoration?: string;
  description?: string;
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
  colors: ColorToken[];
  variations: ColorVariations;
  typography: TypographyToken[];
  [key: string]: any; // その他のプロパティを許可
}

export interface FlattenedToken {
  path: string[];
  type: string;
  value: string | number | Record<string, any>;
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