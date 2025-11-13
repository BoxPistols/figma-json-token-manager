# Figma Design Token Manager

**W3C Design Tokens Standard Compliant - Figma-Exclusive Design Token Management Application**

[日本語版はこちら / Japanese version](./README.ja.md)

This application is a W3C Design Tokens Community Group standards-compliant token management tool with full compatibility with the [Figma Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager) plugin.

## 🎯 Key Features

- **Full Figma Compatibility**: Bidirectional data exchange with the Design Tokens Manager plugin
- **W3C Standards Compliant**: Fully compatible with the W3C Design Tokens Community Group specification
- **Intuitive UI**: Three display modes - Standard, Compact, and Table
- **Real-time Editing**: Edit values, roles, and descriptions with double-click
- **Dark Mode Support**: Automatic switching linked to system settings
- **TypeScript**: Complete type safety and IntelliSense support

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

### Basic Usage

1. **Load Sample Data**: Click "Load Figma Sample Data" button to display W3C format samples
2. **Import JSON File**: Use "Choose JSON file" to load JSON exported from Figma
3. **Paste JSON Directly**: Use "Paste JSON" to import data from clipboard
4. **Edit Tokens**: Double-click any field to edit values
5. **Export Data**: Click "Export" button to output W3C format JSON

## 📋 Supported Token Types

| Type           | Description          | Example                                |
| -------------- | -------------------- | -------------------------------------- |
| `color`        | Color tokens         | `#2164D1`, `rgb(33, 100, 209)`         |
| `typography`   | Typography tokens    | Font family, size, weight              |
| `spacing`      | Spacing tokens       | `16px`, `1rem`, `2em`                  |
| `size`         | Size tokens          | `24px`, `2rem`                         |
| `borderRadius` | Border radius tokens | `8px`, `50%`                           |
| `opacity`      | Opacity tokens       | `0.5`, `0.8`                           |
| `borderColor`  | Border color tokens  | `#E0E0E0`                              |
| `shadow`       | Shadow tokens        | `0px 2px 4px rgba(0,0,0,0.1)`          |
| `breakpoint`   | Breakpoint tokens    | `768px`, `1200px`                      |
| `icon`         | Icon tokens          | Size and stroke settings               |

## 🔗 Figma Integration Workflow

### Exporting from Figma

1. Open the **Design Tokens Manager** plugin in Figma
2. Select the **Export** tab
3. Choose **JSON** format
4. Click **Export** button to download the JSON file
5. Import the JSON file in this app

### Importing to Figma

1. Click the **Export** button in this app
2. **Copy to Clipboard** or **Download JSON file**
3. Open the **Design Tokens Manager** plugin in Figma
4. Paste JSON or select file in the **Import** tab
5. Automatically recognized as W3C format and imported

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Dark mode support
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks + localStorage
- **Standards**: W3C Design Tokens Community Group

## 📊 Data Formats

### W3C Design Tokens Format (Recommended/Standard)

```json
{
  "figma": {
    "color": {
      "primary": {
        "main": {
          "$type": "color",
          "$value": "#2164D1",
          "$role": "Brand color",
          "$description": "Color used for primary actions and branding"
        }
      }
    },
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
}
```

## 🎨 UI Features

### Display Modes

- **Standard**: Card format displaying detailed information
- **Compact**: Compact list view
- **Table**: Table format with sort and filter support

### Editing Features

- **Value Editing**: Inline editing with double-click
- **Role Setting**: Clarify token purpose
- **Description Addition**: Describe detailed usage
- **Real-time Updates**: Changes reflected immediately

### Search & Filter

- **Keyword Search**: Search by token name, value, or description
- **Type Filter**: Display only specific token types
- **Bulk Operations**: Delete multiple selections

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Run linter
npm run lint
```

## 📖 User Manual

### 1. Initial Setup

#### Starting the App
```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

#### Checking Initial Data
When the app starts, sample data is automatically loaded. This allows you to immediately see the token structure and usage.

### 2. Data Import Methods

#### Method 1: Upload File Exported from Figma
1. Open the **Design Tokens Manager** plugin in Figma
2. Select the **Export** tab
3. Choose **JSON** format and click **Export**
4. Click the **"Choose JSON file"** button in this app
5. Select the downloaded JSON file
6. Tokens are automatically loaded and displayed

#### Method 2: Paste JSON Text Directly
1. Click the **"Paste JSON"** button in the app
2. A modal opens - paste your JSON string
3. Click the **"Import"** button
4. If the format is correct, tokens will be displayed

#### Method 3: Load Sample Data (For Learning)
1. Click the **"Load Figma Sample Data"** button
2. W3C standard format sample tokens are displayed
3. Use this data as a reference to create your own tokens

### 3. Token Display and Editing

#### Switching Display Modes
Use the segment control at the top of the screen to switch between three display modes:

- **Standard**: Card format displaying details for each token (default)
- **Compact**: Compact list view
- **Table**: Table format view with sortable columns

#### Editing Tokens
To edit token values:

1. **Double-click** the field you want to edit (value, role, description)
2. Inline editing mode is activated, allowing text input
3. Press **Enter** key or click outside to confirm
4. Press **Esc** key to cancel editing
5. Changes are automatically saved

Editable fields:
- **Value**: The actual token value (color code, font size, etc.)
- **Role**: The token's role or purpose
- **Description**: Detailed explanation of the token

### 4. Search and Filtering

#### Search Function
1. Enter keywords in the search box at the top of the screen
2. Token names, values, and descriptions are searched with partial matching
3. Search results are displayed in real-time
4. Click the **X** icon to clear the search

#### Type Filter
1. Select a specific token type from the "Type" dropdown
2. Only tokens of the selected type are displayed
3. Select "All Types" to reset the filter

### 5. Bulk Delete Feature

To delete multiple tokens at once:

1. Click the **"Bulk Delete Mode"** button
2. Check the checkboxes on the left of tokens you want to delete
3. Once selections are complete, click **"Delete Selected Tokens"** button
4. A confirmation dialog appears - click **"Delete"**
5. Click **"Done"** button to exit bulk delete mode

### 6. Data Export

#### Export Steps
1. Click the **"Export"** button
2. The export preview modal opens
3. Choose from the following options:
   - **W3C Design Tokens (JSON)**: Figma-compatible W3C standard format (recommended)
   - **Copy to Clipboard**: Copy JSON to clipboard
   - **Download JSON**: Download as JSON file

#### Re-importing to Figma
1. Export JSON using this app
2. Open the **Design Tokens Manager** plugin in Figma
3. Select the **Import** tab
4. Paste JSON or upload file
5. Automatically recognized as W3C format and import completed

### 7. Data Persistence and Reset

#### Auto-save Feature
- All changes are automatically saved to browser's localStorage
- Page reloads preserve the previous state
- No manual saving required

#### Data Reset
- Click the **"Force Refresh"** button (top right of page)
- All data is cleared and reverts to initial sample data
- Warning: This operation cannot be undone

### 8. Dark Mode

Click the **moon/sun icon** in the top right corner to toggle between dark mode and light mode. Settings are automatically saved.

### 9. Troubleshooting

#### Tokens Not Displaying
- Verify JSON format is correct
- Check browser console for error messages
- Try "Force Refresh" to return to initial state

#### Edited Content Not Saving
- Verify browser localStorage is enabled
- Data won't be saved in private browsing mode
- Clear browser cache and retry

#### Figma Import Fails
- Verify export format is "W3C Design Tokens (JSON)"
- Check for JSON syntax errors
- Verify Design Tokens Manager plugin is latest version

---

## 🔧 Developer Operations Manual

### Project Structure

```
figma-json-token-manager/
├── src/
│   ├── components/        # React components
│   │   ├── TokenGroup.tsx           # Token group display
│   │   ├── TokenEditor.tsx          # Token editing UI
│   │   ├── TokenTableView.tsx       # Table view
│   │   ├── BulkDeleteMode.tsx       # Bulk delete feature
│   │   ├── ConfirmDialog.tsx        # Confirmation dialog
│   │   ├── ExportPreviewModal.tsx   # Export modal
│   │   ├── PasteJsonModal.tsx       # JSON paste modal
│   │   ├── ErrorDisplay.tsx         # Error display
│   │   └── HelpModal.tsx            # Help modal
│   ├── hooks/             # Custom hooks
│   │   ├── useAppState.ts           # App-wide state management
│   │   ├── useTokenManagement.ts    # Token management logic
│   │   ├── useSearchAndFilter.ts    # Search & filter functionality
│   │   ├── useBulkDelete.ts         # Bulk delete logic
│   │   ├── useKeyboardShortcuts.ts  # Keyboard shortcuts
│   │   ├── useEffects.ts            # Side effects management
│   │   └── useUIHelpers.ts          # UI helper functions
│   ├── utils/             # Utility functions
│   │   ├── tokenUtils.ts            # Core token operations
│   │   ├── tokenConverter.ts        # Format conversion
│   │   └── colorUtils.ts            # Color manipulation utilities
│   ├── data/              # Sample data
│   │   ├── initialMockData.ts       # Initial mock data
│   │   └── w3cSampleTokens.ts       # W3C samples
│   ├── types.ts           # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── CLAUDE.md              # Claude Code guidelines
└── README.md              # This file
```

### Development Environment Setup

```bash
# Clone repository
git clone https://github.com/boxpistols/figma-json-token-manager.git
cd figma-json-token-manager

# Install dependencies
npm install

# Start development server (hot reload enabled)
npm run dev

# TypeScript type check
npx tsc --noEmit

# Run linter
npm run lint

# Auto-fix lint errors
npm run fix
```

### Build and Deployment

```bash
# Production build
npm run build

# Preview build result
npm run preview

# Build artifacts generated in dist/ folder
```

### Code Quality Management

#### Linting Rules
- **ESLint**: Integrates TypeScript, React, and Prettier rules
- Config file: `eslint.config.js`
- Key rules:
  - Proper use of React Hooks
  - Strict TypeScript type checking
  - Unified code formatting with Prettier

#### TypeScript Configuration
- **Strict Mode** enabled
- Guarantees complete type safety
- Config file: `tsconfig.json`

### Adding New Features

#### 1. Adding New Token Types

**Step 1**: Update type definitions (`src/types.ts`)
```typescript
export interface DesignToken {
  $type:
    | 'color'
    | 'typography'
    // Add new type
    | 'newType';
  // ...
}
```

**Step 2**: Update validation (`src/utils/tokenUtils.ts:validateToken`)
```typescript
if (![
  'color',
  'typography',
  // ...
  'newType', // Add
].includes(designToken.$type)) {
  // ...
}
```

**Step 3**: Update flattening process (`src/utils/tokenUtils.ts:flattenTokens`)
- Add processing for new type in `isArrayFormat` branch

**Step 4**: Add UI component support
- Add display logic to `TokenGroup.tsx` or `TokenEditor.tsx`

#### 2. Adding UI Components

**Best Practices**:
- Place components in `src/components/`
- Clearly define Props types
- Separate logic with custom hooks
- Style with Tailwind CSS

**Example**: New modal component
```typescript
// src/components/NewModal.tsx
import { X } from 'lucide-react';

interface NewModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Other props
}

export default function NewModal({ isOpen, onClose }: NewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal content */}
    </div>
  );
}
```

#### 3. Adding Custom Hooks

**Location**: `src/hooks/`

**Naming Convention**: Use `use` prefix

**Example**: New hook
```typescript
// src/hooks/useNewFeature.ts
import { useState, useCallback } from 'react';

export function useNewFeature() {
  const [state, setState] = useState(initialValue);

  const action = useCallback(() => {
    // Logic
  }, [dependencies]);

  return { state, action };
}
```

### Data Flow Explanation

#### 1. Data Loading Flow
```
User action (file upload/JSON paste)
  ↓
handleFileUpload / handlePasteJson (useTokenManagement.ts)
  ↓
validateToken() (tokenUtils.ts) - Validation
  ↓
setTokens() - Save to React state
  ↓
saveTokensToStorage() - Persist to localStorage
  ↓
useEffect trigger (useTokenManagement.ts)
  ↓
flattenTokens() - Flatten data
  ↓
groupTokensByType() - Group by type
  ↓
UI re-render
```

#### 2. Data Editing Flow
```
User double-clicks field
  ↓
Inline edit mode activated (TokenEditor.tsx)
  ↓
Change value and confirm
  ↓
handleTokenUpdate() (useTokenManagement.ts)
  ↓
Array format: Update token in array directly
W3C format: Reconstruct nested object
  ↓
setTokens() - Update React state
  ↓
useEffect trigger → Auto-save to localStorage
  ↓
UI re-render
```

#### 3. Data Export Flow
```
Export button click
  ↓
ExportPreviewModal displayed
  ↓
Select format (W3C Design Tokens)
  ↓
convertToW3CFormat() (tokenConverter.ts)
  ↓
Array format → Convert to W3C format
W3C format → Output as-is
  ↓
Copy to clipboard / Download JSON file
```

### localStorage Management

#### Keys
- `design-tokens-state`: Token data
- `darkMode`: Dark mode setting

#### Notes
- Data saved in JSON format
- Capacity limit: Approximately 5-10MB (browser dependent)
- Not persisted in private browsing mode

#### Debugging Methods
```javascript
// In browser developer console
// View saved data
console.log(JSON.parse(localStorage.getItem('design-tokens-state')));

// Clear data
localStorage.removeItem('design-tokens-state');
```

### Testing and Debugging

#### Debug Log Locations
Key logging points:
- `tokenUtils.ts`: Flattening process logs
- `tokenConverter.ts`: Format conversion logs
- `useTokenManagement.ts`: Data update logs

#### Console Debugging
```javascript
// Check flattenTokens result
console.log('Flattened tokens:', flattenedTokens);

// Check type detection
console.log('Is array format:', isArrayFormat(data));

// Check localStorage contents
console.log('Stored data:', loadTokensFromStorage());
```

### Performance Optimization

#### Current Optimizations
- `useMemo` to prevent recalculation
- `useCallback` to stabilize callbacks
- `React.memo` to prevent component re-renders

#### Recommended Additional Optimizations
- Introduce virtual scrolling for large token sets (1000+)
- Debounce search processing (currently not implemented)

### Troubleshooting (For Developers)

#### Build Errors
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
```

#### Type Errors
```bash
# Run TypeScript type check
npx tsc --noEmit

# Identify and fix error locations
```

#### Hot Reload Not Working
- Restart Vite server
- Clear browser cache
- Check `vite.config.ts` configuration

### Version Control and Release

#### Branching Strategy
- `main`: Stable version (production)
- `develop`: Development version
- `feature/*`: Feature addition branches
- `fix/*`: Bug fix branches

#### Release Flow
1. Develop in `feature/*` or `fix/*` branch
2. Create Pull Request
3. Code review
4. Merge to `develop`
5. Test verification
6. Merge to `main` and release

#### Versioning
Adopts Semantic Versioning (SemVer):
- `MAJOR.MINOR.PATCH`
- Example: `1.0.0` → `1.1.0` (new feature) → `1.1.1` (bug fix)

### Data Integrity Maintenance

**Important Notes**:
- Be careful of data loss during conversion processing as both Array and W3C formats are supported
- Handling of `role` and `description` fields differs by format (details below)
- Be careful with path joining when using nested W3C format

**Recommended Measures**:
1. Always execute validation with `validateToken()`
2. Compare token counts before and after format conversion
3. Add unit tests (currently not implemented)

---

## 🔍 Data Integrity Analysis Report

### Analysis Overview
After detailed codebase analysis, the following potential data integrity issues have been identified.

### 1. Potential Data Loss During Format Conversion

#### Issue Location
**File**: `src/utils/tokenConverter.ts`

**Problem**:
- When converting Array format → W3C format, `role` field is mapped to `$description` (lines 56-57, 68, etc.)
- W3C format can have both `$role` and `$description`, but when converting from Array format, `role` converts to `$description`
- During reverse conversion (W3C → Array), `$role` field information may be lost

**Concrete Example**:
```typescript
// Array format
{
  name: "primary",
  value: "#2c1b9c",
  role: "Brand color",        // role field
  description: "Main heading"  // description field
}

// Converted to W3C format
{
  "$type": "color",
  "$value": "#2c1b9c",
  "$description": "Brand color" // role mapped to $description
  // Original description is lost!
}
```

**Impact Scope**:
- When exporting tokens with both `role` and `description` in Array format to W3C format
- `description` information is lost

**Recommended Fix**:
```typescript
// In convertToStandardFormat() in tokenConverter.ts
standardFormat[color.name] = {
  $type: 'color',
  $value: color.value,
  $role: color.role,           // Save as $role
  $description: color.description, // Save as $description
};
```

### 2. Path Processing for Nested W3C Format

#### Issue Location
**File**: `src/utils/tokenUtils.ts:flattenTokens()`

**Problem**:
- Deeply nested W3C format (e.g., `figma.color.primary.main`) is correctly processed, but unclear if nesting structure can be fully restored during reverse conversion
- `convertToArrayFormat()` assumes 1 or 2 nesting levels, potentially unexpected behavior with 3+ levels

**Concrete Example**:
```json
{
  "figma": {
    "design-system": {
      "color": {
        "brand": {
          "primary": {
            "$type": "color",
            "$value": "#2c1b9c"
          }
        }
      }
    }
  }
}
```

Unclear if such 5-level nesting can be correctly flattened and reconstructed.

**Impact Scope**:
- Data exported from Figma projects with complex nesting structures

**Recommended Fix**:
- Improve `convertToArrayFormat()` path processing to work recursively
- Or add option to preserve nesting structure on export

### 3. Typography Token Value Type Mismatch

#### Issue Location
**File**: `src/utils/tokenUtils.ts:flattenTokens()` (lines 75-103)

**Problem**:
- When W3C format Typography token has `fontSize` as string (`"16px"`), it's converted to number
- However, Array format expects `fontSize` to be numeric type
- Unclear if this conversion is performed consistently and correctly reverted to string on export

**Concrete Example**:
```typescript
// W3C format (input)
{
  "$type": "typography",
  "$value": {
    "fontSize": "16px",  // String
    "fontWeight": "700"  // String
  }
}

// After flattening
{
  type: "typography",
  value: {
    fontSize: 16,       // Converted to number
    fontWeight: 700     // Converted to number
  }
}
```

**Impact Scope**:
- Type mismatch may occur when editing/exporting Typography tokens

**Recommended Fix**:
- Add logic to convert numeric fontSize to string (`"16px"`) on export
- Or unify internal representation (all numbers or all strings)

### 4. localStorage Capacity Limit and Large-scale Data

#### Issue Location
**File**: `src/utils/tokenUtils.ts:saveTokensToStorage()`

**Problem**:
- Insufficient error handling when exceeding localStorage capacity limit (typically 5-10MB)
- Currently only outputs `console.error` log

**Impact Scope**:
- When handling large token sets (thousands of tokens)
- Users not notified of errors, data not saved

**Recommended Fix**:
```typescript
export function saveTokensToStorage(tokens: TokenData) {
  try {
    const jsonString = JSON.stringify(tokens);
    // Size check
    const sizeInMB = new Blob([jsonString]).size / (1024 * 1024);
    if (sizeInMB > 5) {
      console.warn(`Token data size: ${sizeInMB.toFixed(2)}MB`);
      // Display warning to user
      return { success: false, error: 'Data too large' };
    }
    localStorage.setItem(STORAGE_KEY, jsonString);
    return { success: true };
  } catch (error) {
    console.error('Error saving tokens to localStorage:', error);
    return { success: false, error };
  }
}
```

### 5. Path Mismatch During Token Update

#### Issue Location
**File**: `src/hooks/useTokenManagement.ts:handleTokenUpdate()`

**Problem**:
- Different logic used to update tokens for Array and W3C formats
- Path joining method (slash-delimited) may be inconsistent
- Reconstructing nested objects when updating W3C format is complex

**Impact Scope**:
- Wrong token may be updated when editing
- Especially when nesting is deep

**Recommended Fix**:
- Create utility function to handle path processing uniformly
- Add test cases (currently not implemented)

### Summary and Recommended Actions

#### Priority: High
1. **Fix handling of `role` and `description` during Array → W3C conversion**
   - File: `src/utils/tokenConverter.ts`
   - To prevent data loss

2. **Unify Typography `fontSize` type conversion**
   - Files: `src/utils/tokenUtils.ts`, `src/utils/tokenConverter.ts`
   - To prevent type errors on export

#### Priority: Medium
3. **Strengthen localStorage error handling**
   - File: `src/utils/tokenUtils.ts`
   - Improve user experience

4. **Improve handling of deeply nested structures**
   - File: `src/utils/tokenConverter.ts`
   - Support complex Figma projects

#### Priority: Low (Long-term Improvement)
5. **Add unit tests**
   - Create tests for all utility functions
   - Continuously guarantee data integrity

6. **Further strengthen type safety**
   - More strict type definitions
   - Add runtime validation

---

## 🆘 Support

- [GitHub Issues](https://github.com/boxpistols/figma-json-token-manager/issues)
- [Figma Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager)
- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)

---

**Figma Design Tokens Manager-Exclusive App - W3C Design Tokens Standard Compliant**
