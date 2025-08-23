import React from 'react';
import {
  X,
  HelpCircle,
  ExternalLink,
  FileText,
  Upload,
  Edit2,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                ヘルプ・使用方法
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Figma Design Tokens Manager 対応 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Figma Design Tokens Manager 対応
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                  このアプリは{' '}
                  <a
                    href="https://www.figma.com/community/plugin/1263743870981744253/design-tokens-manager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center underline hover:text-blue-600"
                  >
                    Figma Design Tokens Manager
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>{' '}
                  プラグインと完全に互換性があります。
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  W3C Design Tokens
                  標準形式をサポートし、FigmaからエクスポートされたJSONデータを直接インポート・編集・エクスポートできます。
                </p>
              </div>
            </div>
          </section>

          {/* データ形式 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              サポートするデータ形式
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  1. W3C Format（Figma互換・推奨）
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                  {`{
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
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  2. Array Format（独自形式）
                </h4>
                <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
                  {`{
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
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* 使用方法 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-green-500" />
              データのインポート方法
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    ファイルアップロード
                  </h4>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>1. 「Choose JSON file」ボタンをクリック</li>
                    <li>2. JSONファイルを選択</li>
                    <li>3. 自動的にインポート完了</li>
                  </ol>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    JSON直接貼り付け
                  </h4>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>1. 「JSONを貼り付け」ボタンをクリック</li>
                    <li>2. JSONデータをテキストエリアに貼り付け</li>
                    <li>3. 「インポート」ボタンをクリック</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* Figma連携手順 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Figmaとの連携手順
            </h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  📤 Figmaからのエクスポート
                </h4>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>1. Figmaで Design Tokens Manager プラグインを開く</li>
                  <li>2. 「Export」タブを選択</li>
                  <li>3. 「JSON」形式を選択</li>
                  <li>
                    4. 「Export」ボタンをクリックしてJSONファイルをダウンロード
                  </li>
                  <li>5. このアプリでJSONファイルをインポート</li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  📥 Figmaへのインポート
                </h4>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>1. このアプリで「Export」ボタンをクリック</li>
                  <li>2. 「W3C Design Tokens (JSON)」形式を選択</li>
                  <li>3. エクスポートされたJSONファイルを保存</li>
                  <li>4. Figmaで Design Tokens Manager プラグインを開く</li>
                  <li>5. 「Import」タブでJSONファイルを選択してインポート</li>
                </ol>
              </div>
            </div>
          </section>

          {/* 編集機能 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Edit2 className="w-5 h-5 mr-2 text-orange-500" />
              編集・管理機能
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  表示モード
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                    • <strong>Standard</strong>: カード形式で詳細表示
                  </li>
                  <li>
                    • <strong>Compact</strong>: コンパクトな一覧表示
                  </li>
                  <li>
                    • <strong>Table</strong>: 表形式でソート可能
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  編集機能
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• ダブルクリックでインライン編集</li>
                  <li>• 値、役割、説明の個別編集</li>
                  <li>• リアルタイム更新と自動保存</li>
                  <li>• 検索・フィルター機能</li>
                </ul>
              </div>
            </div>
          </section>

          {/* サポートするトークンタイプ */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              サポートするトークンタイプ
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  type: 'color',
                  desc: 'カラートークン',
                  color:
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                },
                {
                  type: 'typography',
                  desc: 'タイポグラフィ',
                  color:
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                },
                {
                  type: 'spacing',
                  desc: 'スペーシング',
                  color:
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                },
                {
                  type: 'size',
                  desc: 'サイズ',
                  color:
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                },
                {
                  type: 'opacity',
                  desc: '不透明度',
                  color:
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                },
                {
                  type: 'borderRadius',
                  desc: 'ボーダー半径',
                  color:
                    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
                },
              ].map((token) => (
                <div key={token.type} className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${token.color}`}
                  >
                    {token.type}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {token.desc}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 技術仕様 */}
          <section className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              技術仕様・互換性
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  機能
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• フォーマット自動判定</li>
                  <li>• TypeScriptによる型安全性</li>
                  <li>• JSONスキーマバリデーション</li>
                  <li>• エラーハンドリングと修正提案</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  互換性
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Figma Design Tokens Manager v1.x</li>
                  <li>• W3C Design Tokens Community Group</li>
                  <li>• 双方向インポート/エクスポート</li>
                  <li>• ネストされた構造対応</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
