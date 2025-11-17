import { useState } from 'react';
import { Copy, Check, X, Download } from 'lucide-react';
import { ExportPreviewModalProps } from '../types';
import {
  isArrayFormat,
  convertToStandardFormat,
} from '../utils/tokenConverter';
import {
  convertToFigmaFormat,
  generateFigmaPluginCode,
} from '../utils/figmaTokenConverter';

export function ExportPreviewModal({
  isOpen,
  onClose,
  tokens,
}: ExportPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<
    'w3c' | 'figma-variables' | 'figma-styles' | 'figma-hybrid'
  >('w3c');
  const [exportType, setExportType] = useState<'json' | 'plugin-code'>('json');

  if (!isOpen) return null;

  // フォーマットに応じたトークンデータを取得
  const getFormattedTokens = () => {
    if (exportFormat === 'w3c') {
      return isArrayFormat(tokens) ? convertToStandardFormat(tokens) : tokens;
    } else {
      // Figma形式の場合は、文字列ではなくオブジェクトとして返す
      const figmaData = convertToFigmaFormat(tokens);

      switch (exportFormat) {
        case 'figma-variables':
          return {
            colors: figmaData.colors.variables,
            spacing: figmaData.spacing.variables,
            size: figmaData.size.variables,
            opacity: figmaData.opacity.variables,
            borderRadius: figmaData.borderRadius.variables,
          };
        case 'figma-styles':
          return {
            colors: figmaData.colors.styles,
            typography: figmaData.typography.styles,
            effects: figmaData.effects.styles,
            grids: figmaData.grids.styles,
          };
        case 'figma-hybrid':
        default:
          return {
            variables: {
              colors: figmaData.colors.variables,
              spacing: figmaData.spacing.variables,
              size: figmaData.size.variables,
              opacity: figmaData.opacity.variables,
              borderRadius: figmaData.borderRadius.variables,
            },
            styles: {
              colors: figmaData.colors.styles,
              typography: figmaData.typography.styles,
              effects: figmaData.effects.styles,
              grids: figmaData.grids.styles,
            },
          };
      }
    }
  };

  // エクスポート用のデータを取得
  const getExportData = () => {
    if (exportType === 'plugin-code') {
      return generateFigmaPluginCode(tokens);
    } else {
      return getFormattedTokens();
    }
  };

  const exportData = getExportData();
  const isJson = typeof exportData === 'string' && exportData.startsWith('{');

  const handleCopy = async () => {
    try {
      const dataToCopy =
        typeof exportData === 'string'
          ? exportData
          : JSON.stringify(exportData, null, 2);
      await navigator.clipboard.writeText(dataToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const dataToDownload =
      typeof exportData === 'string'
        ? exportData
        : JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataToDownload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `design-tokens-${exportFormat}-${exportType === 'plugin-code' ? 'plugin' : 'json'}.${exportType === 'plugin-code' ? 'ts' : 'json'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFormatDescription = () => {
    switch (exportFormat) {
      case 'w3c':
        return 'W3C Design Tokens形式（標準）';
      case 'figma-variables':
        return 'Figma Variable Collections（推奨）';
      case 'figma-styles':
        return 'Figma Styles（従来のスタイル）';
      case 'figma-hybrid':
        return 'Figma Variables + Styles（ハイブリッド）';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Design Token Export
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getFormatDescription()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center px-3 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              ダウンロード
            </button>
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
                  コピー
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

        {/* Export Options */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                エクスポート形式
              </label>
              <select
                value={exportFormat}
                onChange={(e) =>
                  setExportFormat(
                    e.target.value as
                      | 'w3c'
                      | 'figma-variables'
                      | 'figma-styles'
                      | 'figma-hybrid'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="w3c">W3C Design Tokens</option>
                <option value="figma-variables">Figma Variables</option>
                <option value="figma-styles">Figma Styles</option>
                <option value="figma-hybrid">Figma Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                出力タイプ
              </label>
              <select
                value={exportType}
                onChange={(e) =>
                  setExportType(e.target.value as 'json' | 'plugin-code')
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="json">JSON</option>
                <option value="plugin-code">Figma Plugin Code</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 overflow-auto max-h-[60vh]">
          <div className="relative">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto pr-12">
              <code
                className={`text-sm text-gray-800 dark:text-gray-200 ${exportType === 'plugin-code' ? 'language-typescript' : 'language-json'}`}
              >
                {String(
                  exportType === 'plugin-code'
                    ? exportData
                    : isJson
                      ? exportData
                      : JSON.stringify(exportData, null, 2)
                )}
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
      </div>
    </div>
  );
}
