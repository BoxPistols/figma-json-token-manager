/**
 * W3C Design Tokens Community Group (DTCG) Specification - Draft 2025.10
 * Type definitions for Figma-compatible design tokens
 */

// ── Token Types ──────────────────────────────────────────────

export type TokenTypeName =
  | 'color'
  | 'dimension'
  | 'duration'
  | 'fontFamily'
  | 'fontWeight'
  | 'cubicBezier'
  | 'number'
  | 'opacity'
  | 'spacing'
  | 'typography'
  | 'borderRadius'
  | 'borderWidth'
  | 'borderColor'
  | 'shadow'
  | 'blur'
  | 'textDecoration'
  | 'textCase'
  | 'lineHeight'
  | 'letterSpacing'
  | 'paragraphSpacing'
  | 'fontStyle'
  | 'breakpoint'
  | 'icon';

// ── Token Reference ─────────────────────────────────────────

export type TokenReference = string; // {group.token} or #/path/to/token

// ── Value Types ──────────────────────────────────────────────

export interface ColorValue {
  colorSpace?: 'srgb' | 'display-p3' | 'oklch';
  components: {
    r: number;
    g: number;
    b: number;
    a?: number;
  };
}

export interface ShadowValue {
  offsetX: number | string | TokenReference;
  offsetY: number | string | TokenReference;
  blur: number | string | TokenReference;
  spread?: number | string | TokenReference;
  color: string | TokenReference;
  inset?: boolean;
}

export interface TypographyValue {
  fontFamily: string | string[] | TokenReference;
  fontSize: number | string | TokenReference;
  fontWeight: number | string | TokenReference;
  lineHeight?: number | string | TokenReference;
  letterSpacing?: number | string | TokenReference;
  paragraphSpacing?: number | string | TokenReference;
  paragraphIndent?: number | string | TokenReference;
  textDecoration?: 'underline' | 'line-through' | 'overline' | 'none' | TokenReference;
  textCase?: 'uppercase' | 'lowercase' | 'capitalize' | 'none' | TokenReference;
}

export interface BorderValue {
  color: string | TokenReference;
  width: number | string | TokenReference;
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none' | TokenReference;
}

export interface TransitionValue {
  duration: number | string | TokenReference;
  delay: number | string | TokenReference;
  timingFunction: number[] | TokenReference;
}

// ── Design Token ─────────────────────────────────────────────

export interface DesignToken {
  $type?: TokenTypeName;
  $value:
    | string
    | number
    | boolean
    | Record<string, unknown>
    | unknown[]
    | TokenReference;
  $description?: string;
  $deprecated?: boolean | string;
  $extensions?: Record<string, unknown>;
}

// ── Token Group ──────────────────────────────────────────────

export interface TokenGroup {
  $type?: TokenTypeName; // Group-level type inheritance
  $description?: string;
  $extensions?: Record<string, unknown>;
  [key: string]: DesignToken | TokenGroup | Record<string, unknown> | string | undefined;
}

// ── Token Set (Root) ────────────────────────────────────────

export interface TokenSet {
  $schema?: string;
  $version?: string;
  $id?: string;
  $description?: string;
  [key: string]: DesignToken | TokenGroup | string | undefined;
}

// ── Manifest (Multi-file) ───────────────────────────────────

export interface ManifestFile {
  path: string;
  collection: string;
  mode: string;
}

export interface Manifest {
  version: string;
  files: ManifestFile[];
}

// ── Flattened Token (for display) ───────────────────────────

export interface FlattenedToken {
  path: string[];
  type: TokenTypeName | 'unknown';
  value: unknown;
  description?: string;
  deprecated?: boolean | string;
  extensions?: Record<string, unknown>;
  isReference: boolean;
}

// ── Validation ──────────────────────────────────────────────

export interface ValidationError {
  path: string;
  message: string;
  keyword: 'type' | 'format' | 'required' | 'enum' | 'pattern' | 'reference' | 'structure';
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  stats: {
    tokenCount: number;
    groupCount: number;
    types: TokenTypeName[];
  };
}
