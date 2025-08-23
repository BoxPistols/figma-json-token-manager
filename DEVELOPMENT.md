# 開発者ガイド

このファイルは、Figma JSON Token Managerの開発と保守に関するガイドラインを提供します。

## 開発環境セットアップ

### 必要な環境

- Node.js 18.x以上
- npm 9.x以上
- モダンブラウザ（Chrome、Firefox、Safari、Edge）

### 初期設定

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 別ターミナルで型チェック（推奨）
npm run typecheck
```

## コード構造とアーキテクチャ

### ディレクトリ構成

```bash
src/
├── components/          # Reactコンポーネント
│   ├── TokenGroup.tsx   # メインのトークン表示コンポーネント
│   ├── TokenEditor.tsx  # インライン編集機能
│   ├── BulkDeleteMode.tsx # 一括削除UI
│   └── ...
├── utils/               # ビジネスロジック
│   ├── tokenUtils.ts    # トークン処理の中核
│   ├── tokenConverter.ts # フォーマット変換
│   └── colorUtils.ts    # 色関連ユーティリティ
├── types.ts             # TypeScript型定義
└── data/
    └── mockTokens.ts    # サンプルデータ
```

### 重要なコンポーネント

#### App.tsx

- 全体の状態管理
- ルーティングはなし（SPA）
- localStorageとの同期管理

#### TokenGroup.tsx

- トークンのグループ表示
- カード形式での表示制御
- 色トークンの特別なソート処理

#### TokenEditor.tsx

- インライン編集機能
- ダブルクリックでの編集開始
- 型別の値検証

## データフロー

### トークン処理パイプライン

```bash
Raw Data (mockTokens or imported)
    ↓
flattenTokens() - 平坦化処理
    ↓
groupTokensByType() - 型別グループ化
    ↓
React Components - UI表示
    ↓
localStorage - 永続化
```

### 状態管理パターン

- React Hooks （useState, useEffect）
- LocalStorage同期
- コンポーネント間のprops伝達

## 重要な技術的決定事項

### なぜArray Formatを採用したか

- W3C標準よりもシンプルな構造
- role/description フィールドの明示的分離
- JSONの可読性が高い

### flattenTokens関数の設計

```typescript
// Array Format処理
if (isArrayFormat(data)) {
  // 直接処理: role/description がそのまま使用可能
}
// W3C Format処理
else {
  // 変換処理: $description のみ利用可能
}
```

### コンポーネント設計原則

- 単一責任原則
- Props drilling回避
- 型安全性の徹底

## 開発時の注意点

### パフォーマンス考慮事項

- 大量トークン（1000+）での動作確認
- メモリリークの監視（useEffect cleanup）
- 不要な再レンダリング防止

### アクセシビリティ

- キーボードナビゲーション対応
- スクリーンリーダー対応
- カラーコントラスト検証

### 国際化

- 現在は日本語のみ
- UIテキストの外部化は未実装
- 将来的な多言語化を考慮した設計

## テストガイドライン

### 手動テスト項目

1. **基本機能**
   - [ ] データ読み込み・表示
   - [ ] 検索・フィルタリング
   - [ ] 表示モード切り替え

2. **CRUD操作**
   - [ ] トークン編集（値・役割・説明）
   - [ ] 単体削除
   - [ ] 一括削除

3. **データ永続化**
   - [ ] ページリロード後の状態保持
   - [ ] localStorageクリア後の復旧

4. **レスポンシブ対応**
   - [ ] モバイル表示
   - [ ] タブレット表示
   - [ ] デスクトップ表示

### ブラウザテスト

- Chrome（最新・前バージョン）
- Firefox（最新）
- Safari（最新）
- Edge（最新）

## リリースプロセス

### バージョニング

- セマンティックバージョニング採用
- 機能追加: マイナーバージョンアップ
- バグ修正: パッチバージョンアップ

### リリース前チェックリスト

- [ ] 型チェック通過（`npm run typecheck`）
- [ ] リント通過（`npm run lint`）
- [ ] 本番ビルド成功（`npm run build`）
- [ ] サンプルデータでの動作確認
- [ ] 各ブラウザでの動作確認

### デバッグ情報の削除

リリース前に以下を確認：

- console.log文の削除
- 開発用フラグの無効化
- 不要なコメントの整理

## 今後の開発予定

### 短期目標

- [ ] ユニットテストの追加
- [ ] エラーハンドリング強化
- [ ] パフォーマンス最適化

### 中期目標

- [ ] 多言語化対応
- [ ] カスタムトークンタイプサポート
- [ ] インポート・エクスポート機能拡張

### 長期目標

- [ ] Figma Plugin APIとの深い統合
- [ ] チーム共有機能
- [ ] バージョン管理機能

## 貢献ガイドライン

### コード規約

- TypeScript strict mode使用
- Tailwind CSS for styling
- 関数型コンポーネント優先
- カスタムHooks活用

### Commit Message

```bash
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: スタイル修正
refactor: リファクタリング
test: テスト追加
```

### Pull Request

- 機能単位での分割
- 詳細な説明とテスト結果
- スクリーンショット付き（UI変更時）

## サポート・連絡先

開発に関する質問や提案は以下で受け付けています：

- GitHub Issues（バグ報告・機能要求）
- GitHub Discussions（一般的な質問）
- 開発者向けドキュメント（このファイル）

---

Happy coding! 🎨✨
