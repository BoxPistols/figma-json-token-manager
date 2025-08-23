import React, { useState } from 'react';
import { Trash2, CheckSquare, Square } from 'lucide-react';
import { FlattenedToken } from '../types';

interface BulkDeleteModeProps {
  groupedTokens: Record<string, FlattenedToken[]>;
  onBulkDelete: (tokensToDelete: FlattenedToken[]) => void;
  onCancel: () => void;
}

export function BulkDeleteMode({
  groupedTokens,
  onBulkDelete,
  onCancel,
}: BulkDeleteModeProps) {
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());

  // Flatten all tokens for bulk selection
  const allTokens = Object.entries(groupedTokens).flatMap(([type, tokens]) =>
    tokens.map(token => ({ ...token, type }))
  );

  const toggleToken = (tokenPath: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(tokenPath)) {
      newSelected.delete(tokenPath);
    } else {
      newSelected.add(tokenPath);
    }
    setSelectedTokens(newSelected);
  };

  const selectAll = () => {
    if (selectedTokens.size === allTokens.length) {
      setSelectedTokens(new Set());
    } else {
      setSelectedTokens(new Set(allTokens.map(token => token.path.join('/'))));
    }
  };

  const handleBulkDelete = () => {
    const tokensToDelete = allTokens.filter(token => 
      selectedTokens.has(token.path.join('/'))
    );
    onBulkDelete(tokensToDelete);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      typography: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      spacing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      size: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      opacity: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      borderRadius: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      borderColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      shadow: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      breakpoint: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      icon: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-orange-200 dark:border-orange-600">
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <Trash2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="font-medium text-orange-700 dark:text-orange-300">
                一括削除モード
              </span>
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              削除するトークンを選択してください ({selectedTokens.size} 個選択中)
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={selectAll}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 rounded hover:bg-orange-200 dark:hover:bg-orange-700 transition-colors"
            >
              {selectedTokens.size === allTokens.length ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  <span>全解除</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  <span>全選択</span>
                </>
              )}
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedTokens.size === 0}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              削除 ({selectedTokens.size})
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-2">
          {Object.entries(groupedTokens).map(([type, tokens]) =>
            tokens.map((token, index) => (
              <div
                key={`${token.path.join('-')}-${index}`}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTokens.has(token.path.join('/'))
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-600'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => toggleToken(token.path.join('/'))}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {selectedTokens.has(token.path.join('/')) ? (
                    <CheckSquare className="w-5 h-5 text-red-500" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(token.type)}`}>
                    {token.type}
                  </span>
                  
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {token.path[token.path.length - 1]}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {token.path.join(' / ')}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    {token.type === 'color' && (
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: token.value as string }}
                      />
                    )}
                    <span className="font-mono text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {typeof token.value === 'object' 
                        ? (token.type === 'typography' 
                            ? `${(token.value as any).fontSize}px ${(token.value as any).fontFamily}`
                            : JSON.stringify(token.value))
                        : String(token.value)}
                    </span>
                    {token.role && (
                      <span className="text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {token.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}