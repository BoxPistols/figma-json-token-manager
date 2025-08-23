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
アプリは2つのフォーマットをサポート：
1. **Array Format** (現在のmockTokens): `{ colors: [...], typography: [...] }`
2. **W3C Format**: `{ "color-primary": { "$type": "color", "$value": "#000" } }`

### flattenTokens処理
- `isArrayFormat()` でフォーマット判定
- Array format は直接処理、W3C format は変換後処理
- role/description フィールドの正確なマッピング

### localStorage管理
- キー: `design-tokens-state`
- 自動保存/復元機能
- クリア・リセット機能
