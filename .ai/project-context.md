# プロジェクトコンテキスト

このファイルはAI自動修正システムがプロジェクトを理解するための情報です。

## プロジェクト概要

### 基本情報

- **プロジェクト名**: Figma JSON Token Manager
- **目的**: W3Cデザイントークン仕様に準拠したデザイントークンをFigmaプラグインとして管理・ビューア機能を提供
- **対象ユーザー**: デザイナー、フロントエンドエンジニア
- **互換性**: Design Tokens Manager Figmaプラグインと相互互換

### 技術スタック

#### フロントエンド

- **React**: 18.x
- **TypeScript**: 5.x
- **状態管理**: React Hooks (useState, useCallback, useMemo)
- **ビルドツール**: Vite

#### UIライブラリ

- **Tailwind CSS**: 3.x
  - ダークモードサポート
  - カスタム設定あり

#### アイコン

- **Lucide React**: アイコンライブラリ

#### Figmaプラグイン

- **Figma Plugin API**: メインスレッド通信
- **バニラJS UI**: 代替実装 (ui-src/)

### アーキテクチャパターン

#### ディレクトリ構造

```
src/
├── App.tsx              # メインアプリケーション
├── main.tsx             # エントリーポイント
├── types.ts             # 型定義
├── components/          # Reactコンポーネント
│   ├── TokenGroup.tsx
│   ├── TokenEditor.tsx
│   ├── TokenCreator.tsx
│   ├── TokenTableView.tsx
│   ├── ExportPreviewModal.tsx
│   ├── PasteJsonModal.tsx
│   ├── HelpModal.tsx
│   ├── ErrorDisplay.tsx
│   ├── ConfirmDialog.tsx
│   └── BulkDeleteMode.tsx
├── hooks/               # カスタムフック
│   ├── useAppState.ts
│   ├── useTokenManagement.ts
│   ├── useSearchAndFilter.ts
│   ├── useBulkDelete.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useUIHelpers.ts
│   └── useEffects.ts
├── utils/               # ユーティリティ
│   ├── tokenUtils.ts
│   ├── colorUtils.ts
│   └── tokenConverter.ts
└── data/                # サンプルデータ
    ├── initialMockData.ts
    └── w3cSampleTokens.ts
```

#### コンポーネント設計原則

1. **単一責任の原則** - 1コンポーネント = 1責任
2. **カスタムフック分離** - ロジックはhooksに分離
3. **Props drilling回避** - 適切な状態管理
4. **ダークモード対応** - 全コンポーネントで対応

### データフロー

#### トークンデータ構造

```typescript
// W3Cデザイントークン仕様
interface DesignToken {
  $type?: 'color' | 'typography' | 'spacing' | 'size' | 'opacity' | 'borderRadius';
  $value: TokenValue;
  $description?: string;
}

// フラット化されたトークン（表示用）
interface FlatToken {
  path: string;
  name: string;
  type: string;
  value: string | number | object;
  description?: string;
}
```

#### 状態管理

- **tokens**: デザイントークンのJSON構造
- **flattenedTokens**: 表示用にフラット化されたトークン
- **searchTerm**: 検索文字列
- **selectedTypes**: 選択されたトークンタイプ
- **isDarkMode**: ダークモード状態

### スタイリング方針

#### Tailwind CSS使い分け

```typescript
// レイアウト・スペーシング
<div className="flex items-center gap-4 p-6">
  {/* 色・背景 */}
  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    {/* ボタン */}
    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
      Submit
    </button>
  </div>
</div>
```

### パフォーマンス最適化

#### 実装済みの最適化

- [x] useMemo for filtered tokens
- [x] useCallback for handlers
- [x] Lazy loading for modals
- [x] localStorage persistence

### セキュリティ

#### 実装済み対策

- [x] JSON入力のバリデーション
- [x] XSS対策（React標準）
- [x] localStorage暗号化なし（機密データなし）

## ビジネスロジック

### 主要機能

1. **トークン表示**
   - グループ別表示
   - テーブル表示
   - 検索・フィルタリング

2. **トークン編集**
   - 値の編集
   - 新規作成
   - 削除・一括削除

3. **インポート/エクスポート**
   - JSONペースト
   - 各種フォーマット出力
   - CSS変数、SCSS、JS/TS

### ドメインモデル

```typescript
// デザイントークングループ
interface TokenGroup {
  [key: string]: DesignToken | TokenGroup;
}

// カラートークン
interface ColorToken extends DesignToken {
  $type: 'color';
  $value: string; // HEX, RGB, HSL
}

// タイポグラフィトークン
interface TypographyToken extends DesignToken {
  $type: 'typography';
  $value: {
    fontFamily: string;
    fontSize: string | number;
    fontWeight: string | number;
    lineHeight?: string | number;
    letterSpacing?: string | number;
  };
}
```

## 開発ワークフロー

### ブランチ戦略

```
main (production)
  └── feature/xxx
  └── fix/xxx
  └── claude/xxx (AI自動修正)
```

### コミット規約

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント変更
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルドプロセス・補助ツール変更
```

## よくある問題と解決策

### 問題1: TypeScriptコンパイルエラー

**症状**: `tsc --noEmit` でエラー
**原因**: 型定義の不一致
**解決策**: types.tsで型を正しく定義

### 問題2: ビルドエラー

**症状**: `npm run build` が失敗
**原因**: インポートエラー、構文エラー
**解決策**: エラーメッセージに従い修正

### 問題3: ダークモード不具合

**症状**: 色が正しく切り替わらない
**原因**: dark:プレフィックスの欠落
**解決策**: Tailwindのdark:クラスを追加

## AI修正の判断基準

### 自動修正してOKなケース

- Lintエラーの修正
- インポート文の整理
- 簡単な型エラー (any → unknown など)
- フォーマッティング
- 未使用変数・インポートの削除

### Issue化すべきケース

- ビジネスロジックの変更が必要
- 大規模なリファクタリング
- パフォーマンスに影響する変更
- トークン構造の変更

### 人間の判断が必要なケース

- アーキテクチャの変更
- 新機能の追加
- Figma APIの使用方法変更
- デザイントークン仕様への対応

## 依存関係の管理

### 重要な依存関係

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "vite": "^5.4.2",
    "tailwindcss": "^3.4.1",
    "eslint": "^9.9.1"
  }
}
```

### アップデート方針

- **Major version**: 慎重に検討、テスト必須
- **Minor version**: 定期的にアップデート
- **Patch version**: 自動アップデート可

---

**Note**: このファイルはAIが参照します。プロジェクトの成長に合わせて定期的に更新してください。

**Last Updated:** 2024-11
