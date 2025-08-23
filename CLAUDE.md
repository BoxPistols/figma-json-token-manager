# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

これは、JSONフォーマットのデザイントークンを管理するFigmaプラグインです。[Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager) Figmaプラグインとの相互完成性を持つデザイントークン管理ビューワーとして機能します。

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

- トークンタイプ: `color`, `typography`, `spacing`, `size`, `opacity`, `borderRadius`
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
