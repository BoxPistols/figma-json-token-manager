# Figma Design Token Manager

**W3C Design Tokens標準対応 - Figma専用デザイントークン管理アプリ**

このアプリケーションは、[Figma Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager) プラグインと完全互換性を持つ、W3C Design Tokens Community Group標準準拠のトークン管理ツールです。

## 🎯 主な特徴

- **Figma完全対応**: Design Tokens Managerプラグインとの双方向データ交換
- **W3C標準準拠**: W3C Design Tokens Community Group仕様に完全対応
- **直感的なUI**: Standard・Compact・Tableの3つの表示モード
- **リアルタイム編集**: ダブルクリックでの値・役割・説明の編集
- **ダークモード対応**: システム設定に連動した自動切り替え
- **TypeScript**: 完全な型安全性とIntelliSense対応

## 🚀 クイックスタート

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build
```

### 基本的な使用方法

1. **サンプルデータの読み込み**: 「Figmaサンプルデータをロード」ボタンでW3C形式のサンプルを表示
2. **JSONファイルのインポート**: 「Choose JSON file」でFigmaからエクスポートしたJSONを読み込み
3. **JSONの直接貼り付け**: 「JSONを貼り付け」でクリップボードからデータをインポート
4. **トークンの編集**: 各フィールドをダブルクリックして値を編集
5. **データのエクスポート**: 「Export」ボタンでW3C形式のJSONを出力

## 📋 サポートするトークンタイプ

| タイプ | 説明 | 例 |
|--------|------|-----|
| `color` | カラートークン | `#2164D1`, `rgb(33, 100, 209)` |
| `typography` | タイポグラフィ | フォントファミリー、サイズ、ウェイト |
| `spacing` | スペーシング | `16px`, `1rem`, `2em` |
| `size` | サイズ | `24px`, `2rem` |
| `borderRadius` | ボーダー半径 | `8px`, `50%` |
| `opacity` | 不透明度 | `0.5`, `0.8` |
| `borderColor` | ボーダー色 | `#E0E0E0` |
| `shadow` | シャドウ | `0px 2px 4px rgba(0,0,0,0.1)` |
| `breakpoint` | ブレークポイント | `768px`, `1200px` |
| `icon` | アイコン | サイズ・ストローク設定 |

## 🔗 Figma連携ワークフロー

### Figmaからのエクスポート

1. Figmaで**Design Tokens Manager**プラグインを開く
2. 「**Export**」タブを選択
3. 「**JSON**」形式を選択
4. 「**Export**」ボタンでJSONファイルをダウンロード
5. このアプリでJSONファイルをインポート

### Figmaへのインポート

1. このアプリで「**Export**」ボタンをクリック
2. **クリップボードにコピー**または**JSONファイルをダウンロード**
3. Figmaで**Design Tokens Manager**プラグインを開く
4. 「**Import**」タブでJSONを貼り付けまたはファイルを選択
5. 自動的にW3C形式として認識・インポート完了

## 🛠 技術スタック

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + ダークモード対応
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks + localStorage
- **Standards**: W3C Design Tokens Community Group

## 📊 データフォーマット

### W3C Design Tokens形式（推奨・標準）

```json
{
  "figma": {
    "color": {
      "primary": {
        "main": {
          "$type": "color",
          "$value": "#2164D1",
          "$role": "ブランドカラー",
          "$description": "主要アクションやブランディングに使用する色"
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
          "$description": "メイン見出し"
        }
      }
    }
  }
}
```

## 🎨 UI機能

### 表示モード

- **Standard**: カード形式で詳細情報を表示
- **Compact**: コンパクトな一覧表示
- **Table**: 表形式でソート・フィルタリング対応

### 編集機能

- **値の編集**: ダブルクリックでインライン編集
- **役割の設定**: トークンの用途を明確化
- **説明の追加**: 詳細な使用方法を記述
- **リアルタイム更新**: 編集内容を即座に反映

### 検索・フィルター

- **キーワード検索**: トークン名・値・説明で検索
- **タイプフィルター**: 特定のトークンタイプのみ表示
- **一括操作**: 複数選択での削除機能

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドプレビュー
npm run preview

# コードリント
npm run lint
```

## 📝 ライセンス

MIT License

## 🤝 コントリビュート

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 🆘 サポート

- [GitHub Issues](https://github.com/your-username/figma-json-token-manager/issues)
- [Figma Design Tokens Manager](https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager)
- [W3C Design Tokens Community Group](https://www.w3.org/community/design-tokens/)

---

**Figma Design Tokens Manager専用アプリ - W3C Design Tokens標準対応**