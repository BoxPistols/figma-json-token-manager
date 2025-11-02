/**
 * Figma Design Tokens Manager (DTM) Format Utilities
 *
 * This module provides utilities to detect, parse, and convert DTM format exports
 * (manifest.json + multiple token files) into the app's internal array-based format.
 */

import JSZip from 'jszip';
import { TokenData, Token } from '../types';

/**
 * DTM Manifest structure
 */
export interface DTMManifest {
  version?: string;
  name?: string;
  description?: string;
  files?: string[];
  [key: string]: unknown;
}

/**
 * DTM File structure (key is filename, value is parsed JSON)
 */
export interface DTMFiles {
  [filename: string]: unknown;
}

/**
 * Check if the provided files contain a DTM format structure
 * DTM format is identified by the presence of manifest.json
 */
export function isDTMFormat(files: DTMFiles): boolean {
  return 'manifest.json' in files || files['manifest.json'] !== undefined;
}

/**
 * Parse the manifest.json file
 */
export function parseManifest(manifestData: unknown): DTMManifest | null {
  if (!manifestData || typeof manifestData !== 'object') {
    return null;
  }
  return manifestData as DTMManifest;
}

/**
 * Read and extract files from a ZIP archive
 */
export async function readZipFile(file: File): Promise<DTMFiles> {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const files: DTMFiles = {};

  // Extract all JSON files from the ZIP
  const filePromises: Promise<void>[] = [];

  contents.forEach((relativePath, zipEntry) => {
    // Only process JSON files and skip directories
    if (!zipEntry.dir && relativePath.endsWith('.json')) {
      const promise = zipEntry.async('string').then((content) => {
        try {
          files[relativePath] = JSON.parse(content);
        } catch (error) {
          console.error(`Error parsing ${relativePath}:`, error);
        }
      });
      filePromises.push(promise);
    }
  });

  await Promise.all(filePromises);
  return files;
}

/**
 * Read multiple File objects and parse them as JSON
 */
export async function readMultipleFiles(fileList: FileList): Promise<DTMFiles> {
  const files: DTMFiles = {};
  const filePromises: Promise<void>[] = [];

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    if (file.name.endsWith('.json')) {
      const promise = file.text().then((content) => {
        try {
          files[file.name] = JSON.parse(content);
        } catch (error) {
          console.error(`Error parsing ${file.name}:`, error);
        }
      });
      filePromises.push(promise);
    } else if (file.name.endsWith('.zip')) {
      const promise = readZipFile(file).then((zipFiles) => {
        Object.assign(files, zipFiles);
      });
      filePromises.push(promise);
    }
  }

  await Promise.all(filePromises);
  return files;
}

/**
 * Convert DTM format to the app's internal array-based format
 * This function ensures lossless conversion, especially for Typography tokens
 */
export function convertDTMToArrayFormat(files: DTMFiles): TokenData {
  const tokenData: TokenData = {
    colors: [],
    typography: [],
    spacing: [],
    size: [],
    opacity: [],
    borderRadius: [],
    borderColor: [],
    shadow: [],
    breakpoint: [],
    icon: [],
  };

  // Process each file (excluding manifest.json)
  Object.entries(files).forEach(([filename, data]) => {
    if (filename === 'manifest.json') {
      return;
    }

    // Handle different DTM file naming conventions
    // Common patterns: text.styles.tokens.json, color.styles.tokens.json, variables/*.json
    if (typeof data !== 'object' || data === null) {
      return;
    }

    // Recursively process tokens from the file
    processTokensRecursive(
      data as Record<string, unknown>,
      [],
      tokenData,
      filename
    );
  });

  return tokenData;
}

/**
 * Recursively process tokens from nested W3C format
 */
function processTokensRecursive(
  obj: Record<string, unknown>,
  path: string[],
  tokenData: TokenData,
  filename: string
): void {
  Object.entries(obj).forEach(([key, value]) => {
    if (!value || typeof value !== 'object') {
      return;
    }

    const currentPath = [...path, key];
    const valueObj = value as Record<string, unknown>;

    // Check if this is a token (has $type and $value)
    if ('$type' in valueObj && '$value' in valueObj) {
      const tokenType = valueObj.$type as string;
      const tokenValue = valueObj.$value;
      const tokenName = currentPath.join('/');

      // Create token based on type
      switch (tokenType) {
        case 'color':
        case 'borderColor':
          {
            const colorToken: Token = {
              name: tokenName,
              value: tokenValue as string,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };
            if (tokenType === 'color') {
              tokenData.colors?.push(colorToken);
            } else {
              tokenData.borderColor?.push(colorToken);
            }
          }
          break;

        case 'typography':
          {
            // Handle typography with full preservation of all properties
            let typographyValue: Record<string, unknown>;

            if (typeof tokenValue === 'object' && tokenValue !== null) {
              typographyValue = tokenValue as Record<string, unknown>;
            } else {
              // Fallback for string values (shouldn't happen in proper DTM format)
              typographyValue = { value: tokenValue };
            }

            const typographyToken: Token = {
              name: tokenName,
              value: typographyValue.value as string | number,
              fontFamily: typographyValue.fontFamily as string | undefined,
              fontSize: typographyValue.fontSize as string | number | undefined,
              fontWeight: typographyValue.fontWeight as number | undefined,
              lineHeight: typographyValue.lineHeight as
                | string
                | number
                | undefined,
              letterSpacing: typographyValue.letterSpacing as
                | string
                | number
                | undefined,
              textTransform: typographyValue.textTransform as
                | string
                | undefined,
              textDecoration: typographyValue.textDecoration as
                | string
                | undefined,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };

            tokenData.typography?.push(typographyToken);
          }
          break;

        case 'spacing':
          {
            const spacingToken: Token = {
              name: tokenName,
              value: tokenValue as string | number,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };
            tokenData.spacing?.push(spacingToken);
          }
          break;

        case 'size':
        case 'dimension':
          {
            const sizeToken: Token = {
              name: tokenName,
              value: tokenValue as string | number,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };
            tokenData.size?.push(sizeToken);
          }
          break;

        case 'opacity':
          {
            const opacityToken: Token = {
              name: tokenName,
              value: tokenValue as string | number,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };
            tokenData.opacity?.push(opacityToken);
          }
          break;

        case 'borderRadius':
          {
            const radiusToken: Token = {
              name: tokenName,
              value: tokenValue as string | number,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };
            tokenData.borderRadius?.push(radiusToken);
          }
          break;

        case 'shadow':
          {
            const shadowToken: Token = {
              name: tokenName,
              value: tokenValue as string | number,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };
            tokenData.shadow?.push(shadowToken);
          }
          break;

        case 'breakpoint':
          {
            const breakpointToken: Token = {
              name: tokenName,
              value: tokenValue as string | number,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };
            tokenData.breakpoint?.push(breakpointToken);
          }
          break;

        case 'icon':
          {
            const iconToken: Token = {
              name: tokenName,
              value: tokenValue as string | number | Record<string, unknown>,
              description: valueObj.$description as string | undefined,
              role: valueObj.$role as string | undefined,
            };
            tokenData.icon?.push(iconToken);
          }
          break;

        default:
          console.warn(
            `Unknown token type: ${tokenType} for token: ${tokenName}`
          );
      }
    } else {
      // Not a token, recurse deeper
      processTokensRecursive(valueObj, currentPath, tokenData, filename);
    }
  });
}

/**
 * Validate DTM files structure
 */
export function validateDTMFiles(files: DTMFiles): {
  valid: boolean;
  error?: string;
} {
  if (Object.keys(files).length === 0) {
    return { valid: false, error: 'No files provided' };
  }

  if (!isDTMFormat(files)) {
    return {
      valid: false,
      error:
        'manifest.json not found. This does not appear to be a DTM format export.',
    };
  }

  const manifest = parseManifest(files['manifest.json']);
  if (!manifest) {
    return { valid: false, error: 'Invalid manifest.json format' };
  }

  return { valid: true };
}
