# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

これは、[Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager) Figmaプラグイン専用のデザイントークン管理アプリケーションです。W3C Design Tokens標準形式のみをサポートし、Figmaとの完全な互換性を保証します。

主要な構成要素：

- **React Webアプリ** (`src/`): React、TypeScript、Tailwind CSSで構築されたトークン管理インターフェース
- **Figmaプラグイン** (`code.ts`, `ui-src/`): Figma API統合とバニラJS代替UIを含むプラグインコード

## 開発コマンド

```bash
# Reactアプリの開発サーバー起動
npm run dev

# プロジェクトのビルド
npm run build

# コードのリント実行
npm run lint

# プロダクションビルドのプレビュー
npm run preview
```

## アーキテクチャ

### デュアルUIシステム

このプロジェクトは2つのUI実装を持ちます：

1. **React UI** (`src/`): ReactコンポーネントとTypeScriptを使用したモダンなインターフェース
2. **バニラJS UI** (`ui-src/`): バニラJavaScriptモジュールを使用した代替実装

### 主要コンポーネント構造

**Reactアプリ (`src/`)**:

- `App.tsx`: 状態管理を含むメインアプリケーションコンポーネント
- `components/`: 再利用可能なUIコンポーネント
  - `TokenGroup.tsx`: トークンの表示とグループ化
  - `TokenEditor.tsx`: インライン編集機能付きトークンエディタ
  - `TokenTableView.tsx`: テーブル形式でのトークン表示
  - `BulkDeleteMode.tsx`: 複数トークンの一括削除機能
  - `ConfirmDialog.tsx`: 削除確認用ダイアログ
  - `ExportPreviewModal.tsx`: フォーマットオプション付きエクスポート機能
  - `ErrorDisplay.tsx`: エラーハンドリング表示
- `utils/`: コアビジネスロジック
  - `tokenUtils.ts`: トークンの解析、バリデーション、ストレージユーティリティ
  - `colorUtils.ts`: 色操作とコントラスト計算
  - `tokenConverter.ts`: トークンフォーマット変換ユーティリティ

**Figmaプラグイン**:

- `code.ts`: メインプラグインロジック、Figma API統合を処理
- `ui-src/`: ビューと状態管理を持つモジュラーアーキテクチャのバニラJS UI

### トークンデータ構造

アプリはW3Cデザイントークン仕様に従ったデザイントークンをサポートします：

- トークンタイプ: `color`, `typography`, `spacing`, `size`, `opacity`, `borderRadius`ÌG
- 組織化のためのネストされたトークングループ
- 表示と処理のためのフラット化されたトークン表現

### 状態管理

- ReactアプリはlocalStorageの永続化を伴うローカル状態を使用
- トークンデータはブラウザストレージから自動的に保存/ロード
- ダークモード設定はセッション間で永続化

### スタイリング

- ダークモードサポート付きTailwind CSSによるスタイリング
- タイポグラフィトークンのためのGoogle Fontsの動的ロード
- モバイルファーストアプローチによるレスポンシブデザイン

## 最近の機能追加・改善

### UI/UX改善 (2024年)

- **3つの表示モード**: Standard、Compact、Table view with segmented control
- **検索機能強化**: クリア/リセットボタン (X アイコン) を追加
- **削除確認ダイアログ**: 誤操作防止のための確認モーダル
- **一括削除モード**: 複数トークンの選択・削除機能
- **スクロールトップボタン**: 長いリストでのナビゲーション改善

### CRUD機能改善

- **ダブルクリック編集**: 値、役割、説明フィールドのインライン編集
- **役割・説明の分離**: role と description フィールドの独立表示・編集
- **リアルタイム更新**: localStorageとの自動同期
- **データ整合性**: Array format と W3C format の正確な処理

### データ管理改善

- **強制リフレッシュ機能**: ページリロードでデータリセット
- **サンプルデータ再読み込み**: 最新のmockTokensを確実にロード
- **デバッグ機能**: 開発時のデータフロー追跡

## 技術的な注意点

### トークンデータフォーマット

アプリはDesign Token Manager専用形式をサポート：

1. **W3C Format（推奨）**: `{ "color-primary": { "$type": "color", "$value": "#000" } }`
2. **Array Format（内部変換用）**: `{ colors: [...], typography: [...] }`

**_重要：エクスポートはW3C形式のみ対応（Design Token Manager互換性保証）_**

### flattenTokens処理

- `isArrayFormat()` でフォーマット判定
- Array format は直接処理、W3C format は変換後処理www
- role/description フィールドの正確なマッピング

### localStorage管理

- キー: `design-tokens-state`
- 自動保存/復元機能
- クリア・リセット機能

## Figma Design Tokens Manager 対応

### 概要

このアプリケーションは [Figma Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager) プラグインと完全に互換性があります。W3C Design Tokens 標準形式をサポートし、FigmaからエクスポートされたJSONデータを直接インポート・編集・エクスポートできます。

### サポートするデータ形式

#### 1. Array Format（独自形式）

```json
{
  "colors": [
    {
      "name": "primary",
      "value": "#2c1b9c",
      "role": "ブランドカラー",
      "description": "メインブランドカラー"
    }
  ],
  "typography": [
    {
      "name": "heading/h1",
      "value": "24px Inter",
      "fontFamily": "Inter",
      "fontSize": 24,
      "fontWeight": 700,
      "description": "メイン見出し"
    }
  ]
}
```

#### 2. W3C Format（Figma互換）

```json
{
  "color-primary": {
    "$type": "color",
    "$value": "#2c1b9c",
    "$description": "メインブランドカラー"
  },
  "typography-h1": {
    "$type": "typography",
    "$value": {
      "fontFamily": "Inter",
      "fontSize": "24px",
      "fontWeight": 700
    },
    "$description": "メイン見出し"
  }
}
```

#### 3. 入れ子構造W3C Format（推奨）

```json
{
  "figma": {
    "color": {
      "primary": {
        "$type": "color",
        "$value": "#2c1b9c",
        "$description": "メインブランドカラー"
      }
    },
    "typography": {
      "heading": {
        "h1": {
          "$type": "typography",
          "$value": {
            "fontFamily": "Inter",
            "fontSize": "24px",
            "fontWeight": 700
          },
          "$description": "メイン見出し"
        }
      }
    }
  }
}
```

### Figma Design Tokens Manager との連携手順

#### 1. Figmaからのエクスポート

1. Figmaで [Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager) プラグインを開く
2. 「Export」タブを選択
3. 「JSON」形式を選択
4. 「Export」ボタンをクリックしてJSONファイルをダウンロード

#### 2. このアプリでの読み込み

1. **ファイルアップロード方式**：
   - 「Choose JSON file」ボタンをクリック
   - ダウンロードしたJSONファイルを選択
2. **直接貼り付け方式**：
   - 「JSONを貼り付け」ボタンをクリック
   - JSONの内容をコピー&ペースト
   - 「インポート」ボタンをクリック

#### 3. 編集・管理

- 3つの表示モード（Standard/Compact/Table）で確認・編集
- ダブルクリックでインライン編集
- 検索・フィルター機能で効率的な管理

#### 4. Figmaへの戻し

1. 「Export」ボタンをクリック
2. 「W3C Design Tokens (JSON)」形式を選択
3. エクスポートされたJSONをFigmaにインポート

### サポートするトークンタイプ

- **color**: カラートークン
- **typography**: タイポグラフィトークン
- **spacing**: スペーシング/マージン/パディング
- **size**: サイズ/ディメンション
- **opacity**: 不透明度
- **borderRadius**: ボーダー半径
- **borderColor**: ボーダーカラー
- **shadow**: シャドウ/ドロップシャドウ
- **breakpoint**: ブレークポイント
- **icon**: アイコン

### 技術仕様

- **フォーマット自動判定**: Array形式かW3C形式かを自動判定
- **型安全性**: TypeScriptによる厳密な型チェック
- **バリデーション**: JSONデータの構造とトークン内容を検証
- **エラーハンドリング**: 分かりやすいエラーメッセージと修正提案

### 互換性保証

このアプリケーションは以下の互換性を保証します：

- Figma Design Tokens Manager v1.x との双方向互換性
- W3C Design Tokens Community Group 仕様準拠
- JSONスキーマバリデーション対応
