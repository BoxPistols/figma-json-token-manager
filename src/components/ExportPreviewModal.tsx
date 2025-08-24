import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { ExportPreviewModalProps } from '../types';
import {
  isArrayFormat,
  convertToStandardFormat,
} from '../utils/tokenConverter';

export function ExportPreviewModal({
  isOpen,
  onClose,
  tokens,
}: ExportPreviewModalProps) {
  // Design Token Manager専用 - W3C形式のみサポート
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Design Token Manager互換のW3C形式に変換
  const getFormattedTokens = () => {
    return isArrayFormat(tokens) ? convertToStandardFormat(tokens) : tokens;
  };

  const formattedJson = JSON.stringify(getFormattedTokens(), null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Design Token Manager Export
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              W3C Design Tokens形式（Figma互換）
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  コピー済み
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  クリップボードにコピー
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-auto max-h-[60vh]">
          <div className="relative">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto pr-12">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                {formattedJson}
              </code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
                copied
                  ? 'bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300'
                  : 'bg-white/80 text-gray-600 dark:bg-gray-800/80 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
              }`}
              title={copied ? 'コピー済み' : 'クリップボードにコピー'}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const blob = new Blob([formattedJson], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `design-tokens-w3c.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            JSONファイルをダウンロード
          </button>
        </div>
      </div>
    </div>
  );
}
