import React, { useState } from 'react';
import { X, Code, AlertCircle } from 'lucide-react';
import { TokenData, ImportError } from '../types';
import { validateToken } from '../utils/tokenUtils';

interface PasteJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: TokenData) => void;
}

export function PasteJsonModal({
  isOpen,
  onClose,
  onImport,
}: PasteJsonModalProps) {
  const [pasteInput, setPasteInput] = useState('');
  const [error, setError] = useState<ImportError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaste = async () => {
    if (!pasteInput.trim()) {
      setError({
        message: 'JSONデータを入力してください',
        type: 'validation',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsedData = JSON.parse(pasteInput) as TokenData;

      const validationError = validateToken(parsedData);
      if (validationError) {
        setError({
          message: validationError,
          type: 'validation',
        });
        setIsLoading(false);
        return;
      }

      onImport(parsedData);
      setPasteInput('');
      setError(null);
      onClose();
    } catch (err) {
      setError({
        message:
          err instanceof Error ? err.message : 'JSONの解析に失敗しました',
        type: 'parse',
      });
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setPasteInput('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              JSONを直接貼り付け
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JSONデータ
            </label>
            <textarea
              value={pasteInput}
              onChange={(e) => setPasteInput(e.target.value)}
              placeholder={`Figma互換のW3C形式（推奨）:
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

または Array形式:
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
      "fontFamily": "Inter",
      "fontSize": 24,
      "fontWeight": 700,
      "description": "メイン見出し"
    }
  ]
}`}
              className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {error && (
            <div className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                  {error.type === 'parse'
                    ? 'JSON解析エラー'
                    : 'バリデーションエラー'}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {error.message}
                </p>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="font-medium mb-2">サポート形式:</p>
            <ul className="space-y-1 pl-4">
              <li>
                • <strong>W3C Design Tokens形式</strong> (Figma Design Tokens
                Manager互換・推奨)
              </li>
              <li>
                • <strong>Array形式</strong> (独自形式・簡易)
              </li>
              <li>
                • <strong>ネストされた構造</strong> (複雑なトークン階層に対応)
              </li>
            </ul>
            <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              💡 ヘルプボタン（?）をクリックすると詳細な使用方法を確認できます
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              onClick={handlePaste}
              disabled={!pasteInput.trim() || isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>処理中...</span>
                </>
              ) : (
                <span>インポート</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
