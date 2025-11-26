# GitHub Copilot Instructions for Figma JSON Token Manager

このプロジェクトでGitHub CopilotとClaude AIが協調して動作するための指示です。

## プロジェクト概要

このプロジェクトはJSONフォーマットのデザイントークンを管理するFigmaプラグインです。
Design Tokens Manager Figmaプラグインとの相互互換性を持つデザイントークン管理ビューワーとして機能します。

### コア技術

- **React 18+**
- **TypeScript 5+** (厳格な型チェック)
- **Tailwind CSS 3+**
- **Vite** (ビルドツール)
- **Figma Plugin API**

### 開発原則

#### 1. コンポーネント設計

```typescript
// ✅ GOOD: Props型定義 + デフォルトエクスポート
interface TokenGroupProps {
  groupName: string;
  tokens: FlatToken[];
  onTokenClick?: (token: FlatToken) => void;
}

export default function TokenGroup({
  groupName,
  tokens,
  onTokenClick,
}: TokenGroupProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{groupName}</h3>
      {/* ... */}
    </div>
  );
}

// ❌ BAD: 型なし、名前付きエクスポート
export const TokenGroup = (props) => <div>{props.groupName}</div>;
```

#### 2. TypeScript厳格設定

```typescript
// ✅ GOOD: 完全な型定義
interface DesignToken {
  $type: 'color' | 'typography' | 'spacing' | 'size' | 'opacity' | 'borderRadius';
  $value: string | number | TypographyValue;
  $description?: string;
}

function parseToken(raw: unknown): DesignToken {
  if (!isValidToken(raw)) {
    throw new Error('Invalid token format');
  }
  return raw as DesignToken;
}

// ❌ BAD: any使用
function parseToken(raw: any): any {
  return raw;
}
```

#### 3. Tailwind CSS使用基準

```typescript
// ✅ GOOD: Tailwindユーティリティクラス使用
<div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
    Submit
  </button>
</div>

// ❌ BAD: インラインスタイル
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <button style={{ backgroundColor: '#3b82f6' }}>Submit</button>
</div>
```

## AI自動修正のルール

### 即座に修正すべきもの

1. **Lintエラー** - ESLint/Prettierルールに従う
2. **TypeScript型エラー** - any型の排除、strictモード対応
3. **ビルドエラー** - インポートエラー、構文エラー
4. **未使用インポート** - 削除
5. **console.log残存** - 本番コードでは削除

### Issue化すべきもの

1. **アーキテクチャ変更が必要** - 設計の見直し
2. **破壊的変更** - APIの変更、型の大幅な変更
3. **パフォーマンス問題** - 最適化が必要
4. **Figma API変更対応** - プラグインAPIの更新

## コーディング規約

### ファイル命名

```
src/
├── components/
│   ├── TokenGroup.tsx
│   ├── ExportPreviewModal.tsx
│   └── ErrorDisplay.tsx
├── hooks/
│   ├── useAppState.ts
│   └── useTokenManagement.ts
├── utils/
│   ├── tokenUtils.ts
│   └── colorUtils.ts
└── types.ts
```

### Import順序

```typescript
// 1. React
import { useState, useCallback } from 'react';

// 2. 外部ライブラリ
import { X, Check } from 'lucide-react';

// 3. 内部モジュール
import { parseTokens } from './utils/tokenUtils';
import { calculateContrast } from './utils/colorUtils';

// 4. 型定義
import type { FlatToken, DesignTokens } from './types';
```

### デザイントークン型定義

```typescript
// W3Cデザイントークン仕様に準拠
interface DesignToken {
  $type?: 'color' | 'typography' | 'spacing' | 'size' | 'opacity' | 'borderRadius';
  $value: TokenValue;
  $description?: string;
}

interface TokenGroup {
  [key: string]: DesignToken | TokenGroup;
}
```

## ダークモード対応

```typescript
// ✅ GOOD: Tailwindのdark:プレフィックス使用
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>

// ダークモード状態管理
const [isDarkMode, setIsDarkMode] = useState(() => {
  return localStorage.getItem('darkMode') === 'true';
});
```

## テストパターン

### ユーティリティ関数テスト

```typescript
import { parseTokens, flattenTokens } from './tokenUtils';

describe('tokenUtils', () => {
  it('should parse valid W3C token structure', () => {
    const input = {
      color: {
        primary: {
          $type: 'color',
          $value: '#2196f3',
        },
      },
    };
    const result = parseTokens(input);
    expect(result.isValid).toBe(true);
  });
});
```

## Copilot Chat使用例

### コンポーネント作成

```
Create a TokenPreview component that:
- Displays a color swatch for color tokens
- Shows typography preview for typography tokens
- Uses Tailwind CSS for styling
- Has proper TypeScript types
- Supports dark mode
```

### リファクタリング

```
Refactor this component to:
- Use proper TypeScript types (no any)
- Follow our import order convention
- Use Tailwind for all styling
- Add proper error handling
```

## CI/CD要件

### 必須チェック

- `npm run lint` - ESLintエラーなし
- `npm run type-check` - TypeScriptエラーなし
- `npm run build` - ビルド成功

## 禁止事項

### 絶対に使わない

```typescript
// 1. any型の乱用
const data: any = {}; // NG

// 2. console.log残存（開発時のみOK）
console.log('debug'); // NG in production

// 3. インラインスタイルの乱用
<div style={{ color: 'red' }} /> // NG

// 4. 古いReact記法
class Component extends React.Component {} // NG

// 5. var宣言
var x = 1; // NG (const/let使用)
```

---

**Note:** このファイルはGitHub Copilotの振る舞いに影響します。
プロジェクトの成長に合わせて定期的に更新してください。

**Last Updated:** 2024-11
**Version:** 1.0.0
