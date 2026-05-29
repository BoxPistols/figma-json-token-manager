import Ajv from 'ajv';
import type { ErrorObject, ValidateFunction } from 'ajv';
import schema from '../schemas/w3c-design-tokens.schema.json';
import type {
  TokenSet,
  DesignToken,
  FlattenedToken,
  TokenTypeName,
  ValidationError,
  ValidationResult,
} from '../types';

let _ajv: Ajv | null = null;
let _validate: ValidateFunction | null = null;

function getValidator(): ValidateFunction {
  if (!_validate) {
    _ajv = new Ajv({
      strict: false,
      allErrors: true,
      verbose: true,
    });
    _validate = _ajv.compile(schema);
  }
  return _validate;
}

export function validateAgainstSchema(data: unknown): ValidationResult {
  const validate = getValidator();
  const valid = validate(data);
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!valid && validate.errors) {
    for (const err of validate.errors as ErrorObject[]) {
      const path = err.instancePath || '/';
      const msg = formatAjvError(err);
      const sev: 'error' | 'warning' = err.keyword === 'required' || err.keyword === 'type' ? 'error' : 'warning';
      (sev === 'error' ? errors : warnings).push({
        path,
        message: msg,
        keyword: mapKeyword(err.keyword),
        severity: sev,
      });
    }
  }

  // Count tokens and groups
  const stats = countStats(data);

  return { isValid: errors.length === 0, errors, warnings, stats };
}

function formatAjvError(err: ErrorObject): string {
  const prop = err.params?.missingProperty ?? err.params?.property;
  if (err.keyword === 'required' && prop) {
    return `Missing required property "${prop}"`;
  }
  if (err.keyword === 'enum') {
    const allowed = (err.params as { allowedValues?: unknown[] })?.allowedValues;
    return `Value must be one of: ${allowed?.join(', ') ?? 'unknown'}`;
  }
  if (err.keyword === 'pattern') {
    return `Value does not match expected format`;
  }
  if (err.keyword === 'additionalProperties') {
    const extra = (err.params as { additionalProperty?: string })?.additionalProperty;
    return `Unknown property "${extra}"`;
  }
  return err.message ?? 'Validation error';
}

function mapKeyword(kw: string): ValidationError['keyword'] {
  const map: Record<string, ValidationError['keyword']> = {
    type: 'type',
    format: 'format',
    required: 'required',
    enum: 'enum',
    pattern: 'pattern',
  };
  return map[kw] ?? 'structure';
}

function countStats(data: unknown): ValidationResult['stats'] {
  const types = new Set<TokenTypeName>();
  let tokenCount = 0;
  let groupCount = 0;

  function walk(obj: unknown, inheritedType?: TokenTypeName) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
    const rec = obj as Record<string, unknown>;

    if ('$value' in rec) {
      tokenCount++;
      const t = (rec.$type as TokenTypeName) ?? inheritedType;
      if (t) types.add(t);
    } else {
      groupCount++;
      const groupType = rec.$type as TokenTypeName | undefined;
      for (const [key, val] of Object.entries(rec)) {
        if (key.startsWith('$')) continue;
        walk(val, groupType ?? inheritedType);
      }
    }
  }

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const root = data as Record<string, unknown>;
    for (const [key, val] of Object.entries(root)) {
      if (key.startsWith('$')) continue;
      walk(val);
    }
  }

  return { tokenCount, groupCount, types: Array.from(types) };
}

// ── Flatten tokens for display ───────────────────────────────

export function flattenTokenSet(
  data: TokenSet,
  inheritedType?: TokenTypeName
): FlattenedToken[] {
  const result: FlattenedToken[] = [];

  function walk(
    obj: Record<string, unknown>,
    path: string[],
    inType?: TokenTypeName
  ) {
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      if (!val || typeof val !== 'object' || Array.isArray(val)) continue;

      const currentPath = [...path, key];
      const rec = val as Record<string, unknown>;

      if ('$value' in rec) {
        const token = rec as unknown as DesignToken;
        const type = (token.$type ?? inType ?? 'unknown') as FlattenedToken['type'];
        const rawValue = token.$value;
        const isRef =
          typeof rawValue === 'string' &&
          (/^\{[^{}]+\}$/.test(rawValue) || /^#\/[^.]+$/.test(rawValue));

        result.push({
          path: currentPath,
          type,
          value: rawValue,
          description: token.$description,
          deprecated: token.$deprecated,
          extensions: token.$extensions,
          isReference: isRef,
        });
      } else {
        const groupType = (rec.$type as TokenTypeName) ?? inType;
        walk(rec, currentPath, groupType);
      }
    }
  }

  walk(data as unknown as Record<string, unknown>, [], inheritedType);
  return result;
}

// ── Export: reconstruct nested W3C structure ──────────────────

export function exportToW3C(flattened: FlattenedToken[]): TokenSet {
  const root: Record<string, unknown> = {};

  for (const token of flattened) {
    let current = root;
    for (let i = 0; i < token.path.length - 1; i++) {
      const part = token.path[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const last = token.path[token.path.length - 1];
    const obj: DesignToken = {
      $type: token.type as TokenTypeName,
      $value: token.value as DesignToken['$value'],
    };
    if (token.description) obj.$description = token.description;
    if (token.deprecated) obj.$deprecated = token.deprecated;
    if (token.extensions) obj.$extensions = token.extensions;

    current[last] = obj;
  }

  return root as TokenSet;
}

// ── Resolve token references ─────────────────────────────────

export function isTokenReference(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    (/^\{[^{}]+\}$/.test(value) || /^#\/[^.]+$/.test(value))
  );
}

export function resolveReference(
  ref: string,
  data: TokenSet
): DesignToken | null {
  let path: string[];

  if (ref.startsWith('{') && ref.endsWith('}')) {
    path = ref.slice(1, -1).split('.');
  } else if (ref.startsWith('#/')) {
    path = ref.slice(2).split('/');
  } else {
    return null;
  }

  let current: unknown = data;
  for (const key of path) {
    if (!current || typeof current !== 'object') return null;
    current = (current as Record<string, unknown>)[key];
  }

  if (current && typeof current === 'object' && '$value' in (current as Record<string, unknown>)) {
    return current as DesignToken;
  }
  return null;
}

// ── Detect circular references ───────────────────────────────

export function detectCircularReferences(data: TokenSet): string[] {
  const cycles: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function walk(obj: unknown, path: string) {
    if (!obj || typeof obj !== 'object') return;
    const rec = obj as Record<string, unknown>;

    if ('$value' in rec) {
      const val = rec.$value;
      if (typeof val === 'string' && isTokenReference(val)) {
        if (visiting.has(val)) {
          cycles.push(`${path} -> ${val}`);
          return;
        }
        if (!visited.has(val)) {
          const resolved = resolveReference(val, data);
          if (resolved) {
            visiting.add(val);
            walk(resolved, val);
            visiting.delete(val);
          }
        }
        visited.add(val);
      }
      return;
    }

    for (const [key, child] of Object.entries(rec)) {
      if (key.startsWith('$')) continue;
      walk(child, path ? `${path}.${key}` : key);
    }
  }

  walk(data, '');
  return cycles;
}
