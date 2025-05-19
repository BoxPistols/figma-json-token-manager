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

export interface ColorToken {
  name: string;
  value: string;
  role?: string;
}

export interface ColorVariation {
  main: string;
  dark: string;
  light: string;
  lighter: string;
}

export interface ColorVariations {
  [key: string]: ColorVariation;
}

export interface TextColorSettings {
  main: string;
  dark: string;
  light: string;
  lighter: string;
}

export interface TokenData {
  [key: string]: any;
  colors?: ColorToken[];
  variations?: ColorVariations;
  textColorSettings?: TextColorSettings;
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