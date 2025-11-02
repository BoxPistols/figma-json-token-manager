# Figma Design Tokens Manager (DTM) Format Import Guide

## Overview

Version 1.1.0 introduces full support for importing Figma Design Tokens Manager (DTM) export format, including:

- **Single JSON files** - Traditional W3C format imports
- **Multiple JSON files** - DTM format with manifest.json + token files
- **ZIP archives** - DTM exports packaged as ZIP files

## DTM Format Structure

The DTM format typically consists of:

1. **manifest.json** - Metadata about the design system
2. **Token files** - Multiple JSON files organized by token type:
   - `color.styles.tokens.json` - Color tokens
   - `text.styles.tokens.json` - Typography tokens
   - `variables/*.json` - Variable collections
   - Additional custom token files

### Example DTM Structure

```
design-system-export/
├── manifest.json
├── color.styles.tokens.json
├── text.styles.tokens.json
├── spacing.tokens.json
└── variables/
    ├── primitives.json
    └── semantic.json
```

## Import Methods

### Method 1: Multiple Files

1. Click "Choose files" button
2. Hold Ctrl/Cmd and select all DTM files including manifest.json
3. Click "Open"
4. Tokens will be automatically detected and converted

### Method 2: ZIP Archive

1. Package your DTM files into a ZIP archive
2. Click "Choose files" button
3. Select the ZIP file
4. All tokens will be extracted and imported

### Method 3: Single JSON (Original Method)

1. Click "Choose files" button
2. Select a single W3C format JSON file
3. Tokens will be imported as before

## Lossless Typography Import

The DTM format converter ensures **lossless import** of Typography tokens with all properties preserved:

```json
{
  "typography": {
    "heading": {
      "h1": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Inter",
          "fontSize": 32,
          "fontWeight": 700,
          "lineHeight": 1.25,
          "letterSpacing": "-0.02em"
        },
        "$description": "Main heading style",
        "$role": "heading"
      }
    }
  }
}
```

All typography properties are preserved:
- ✓ fontFamily
- ✓ fontSize
- ✓ fontWeight
- ✓ lineHeight
- ✓ letterSpacing
- ✓ textTransform
- ✓ textDecoration
- ✓ $description
- ✓ $role

## Supported Token Types

The DTM converter supports all W3C Design Token types:

| Type | Description | Example |
|------|-------------|---------|
| `color` | Color values | `#2164D1`, `rgb(33, 100, 209)` |
| `typography` | Text styles | Font properties object |
| `spacing` | Spacing values | `16px`, `1rem` |
| `size` | Size/dimension | `24px`, `2rem` |
| `opacity` | Opacity values | `0.5`, `0.8` |
| `borderRadius` | Border radius | `8px`, `50%` |
| `borderColor` | Border colors | `#E0E0E0` |
| `shadow` | Shadow effects | `0px 2px 4px rgba(0,0,0,0.1)` |
| `breakpoint` | Breakpoints | `768px`, `1200px` |
| `icon` | Icon definitions | Size and stroke properties |

## Technical Details

### DTM Detection

The import handler automatically detects DTM format by checking for:
1. Multiple files selected
2. A ZIP file selected
3. Presence of `manifest.json` in the file collection

### Conversion Process

1. **File Reading**: All JSON files are parsed from FileList or ZIP
2. **Validation**: Checks for manifest.json and validates structure
3. **Token Processing**: Recursively processes nested W3C token structure
4. **Array Format Conversion**: Converts to app's internal array-based format
5. **Storage**: Saves to localStorage for persistence

### Error Handling

Clear error messages are provided for:
- Missing manifest.json in multi-file selection
- Invalid JSON format
- Unsupported token types
- ZIP extraction errors

## Example Usage

### Creating a Test DTM Export

Create the following files:

**manifest.json**:
```json
{
  "version": "1.0.0",
  "name": "My Design System",
  "description": "Design tokens for my project",
  "files": ["color.styles.tokens.json", "text.styles.tokens.json"]
}
```

**color.styles.tokens.json**:
```json
{
  "colors": {
    "primary": {
      "main": {
        "$type": "color",
        "$value": "#2164D1",
        "$description": "Primary brand color",
        "$role": "brand"
      }
    }
  }
}
```

**text.styles.tokens.json**:
```json
{
  "typography": {
    "heading": {
      "h1": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Inter",
          "fontSize": 32,
          "fontWeight": 700,
          "lineHeight": 1.25
        },
        "$description": "Main heading"
      }
    }
  }
}
```

Then select all three files or ZIP them and import.

## Troubleshooting

### "manifest.json not found" Error

**Cause**: Selected multiple JSON files without manifest.json

**Solution**: Either:
- Include manifest.json in your selection
- Select only a single JSON file for standard import

### ZIP File Not Working

**Cause**: Browser security restrictions or corrupt ZIP

**Solution**: 
- Try extracting files manually and selecting them
- Verify ZIP file integrity
- Check browser console for detailed error messages

### Typography Tokens Missing Properties

**Cause**: Source data doesn't follow W3C typography format

**Solution**:
- Ensure typography tokens use object $value with proper properties
- Check that all required fields (fontFamily, fontSize, fontWeight) are present

### Tokens Not Appearing After Import

**Cause**: Token validation failed

**Solution**:
- Check browser console for validation errors
- Verify token types are supported
- Ensure W3C format compliance ($type and $value fields)

## API Reference

### DTM Format Utilities (`dtmFormatUtils.ts`)

#### `isDTMFormat(files: DTMFiles): boolean`
Detects if file collection contains DTM format structure.

#### `readMultipleFiles(fileList: FileList): Promise<DTMFiles>`
Reads multiple JSON files and ZIP archives from FileList.

#### `readZipFile(file: File): Promise<DTMFiles>`
Extracts and parses JSON files from ZIP archive.

#### `convertDTMToArrayFormat(files: DTMFiles): TokenData`
Converts DTM format to app's internal array-based format.

#### `validateDTMFiles(files: DTMFiles): { valid: boolean; error?: string }`
Validates DTM file structure and manifest.

## Version History

### v1.1.0 (Current)
- ✨ Added DTM format import support
- ✨ Multiple file selection
- ✨ ZIP archive import
- ✨ Lossless typography conversion
- 📦 Added jszip dependency
- 📝 Updated UI with format hints

### v1.0.0
- Initial release with single JSON import
- W3C format support
- Array format support

## Related Documentation

- [README.md](./README.md) - Main project documentation
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
- [W3C Design Tokens Specification](https://design-tokens.github.io/community-group/format/)
- [Figma Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager)
