import { useState } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  json: string;
}

export function ExportModal({ isOpen, onClose, json }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.tokens.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              エクスポート
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              W3C Design Tokens形式 (Figma互換)
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="relative">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-[50vh] text-sm text-gray-800 dark:text-gray-200 font-mono">
              {json}
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
                copied
                  ? 'bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300'
                  : 'bg-white/80 text-gray-600 dark:bg-gray-800/80 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            キャンセル
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download className="w-4 h-4" />
            .tokens.jsonダウンロード
          </button>
        </div>
      </div>
    </div>
  );
}
