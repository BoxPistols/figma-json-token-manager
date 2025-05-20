import { useState } from 'react';
import { ExportPreviewModalProps } from '../types';
import { isArrayFormat, convertToArrayFormat, convertToStandardFormat } from '../utils/tokenConverter';

export function ExportPreviewModal({ isOpen, onClose, tokens }: ExportPreviewModalProps) {
  const [format, setFormat] = useState<'array' | 'standard'>(isArrayFormat(tokens) ? 'array' : 'standard');
  
  if (!isOpen) return null;

  const getFormattedTokens = () => {
    if (format === 'array') {
      return isArrayFormat(tokens) ? tokens : convertToArrayFormat(tokens);
    } else {
      return isArrayFormat(tokens) ? convertToStandardFormat(tokens) : tokens;
    }
  };

  const formattedJson = JSON.stringify(getFormattedTokens(), null, 2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Preview</h2>
          <div className="flex items-center space-x-4">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'array' | 'standard')}
              className="bg-gray-100 dark:bg-gray-700 border-0 rounded-md px-3 py-1 text-sm"
            >
              <option value="array">Array Format</option>
              <option value="standard">Standard Format</option>
            </select>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-auto max-h-[60vh]">
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-gray-800 dark:text-gray-200">{formattedJson}</code>
          </pre>
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
              const blob = new Blob([formattedJson], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `design-tokens-${format}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}