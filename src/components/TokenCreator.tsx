import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';

interface TokenCreatorProps {
  tokenType: string;
  onCreateToken: (tokenData: {
    name: string;
    value: string | number;
    role?: string;
    description?: string;
  }) => void;
}

export function TokenCreator({ tokenType, onCreateToken }: TokenCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim() || !value.trim()) return;

    let processedValue: string | number = value.trim();

    // 型に応じて値を処理
    if (tokenType === 'opacity') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
        processedValue = numValue;
      }
    } else if (
      tokenType === 'spacing' ||
      tokenType === 'size' ||
      tokenType === 'borderRadius'
    ) {
      if (/^\d+px?$/.test(value.trim())) {
        processedValue = value.trim().endsWith('px')
          ? value.trim()
          : value.trim() + 'px';
      }
    }

    onCreateToken({
      name: name.trim(),
      value: processedValue,
      role: role.trim() || undefined,
      description: description.trim() || undefined,
    });

    // リセット
    setName('');
    setValue('');
    setRole('');
    setDescription('');
    setIsCreating(false);
  };

  const handleCancel = () => {
    setName('');
    setValue('');
    setRole('');
    setDescription('');
    setIsCreating(false);
  };

  const getInputType = () => {
    if (tokenType === 'opacity') return 'number';
    return 'text';
  };

  const getValuePlaceholder = () => {
    switch (tokenType) {
      case 'color':
        return '#ff0000';
      case 'spacing':
      case 'size':
      case 'borderRadius':
        return '16px';
      case 'opacity':
        return '0.5';
      case 'typography':
        return 'Inter';
      default:
        return '値を入力...';
    }
  };

  const getNamePlaceholder = () => {
    switch (tokenType) {
      case 'color':
        return 'primary/main';
      case 'spacing':
        return 'spacing/4';
      case 'size':
        return 'size/md';
      case 'borderRadius':
        return 'radius/md';
      case 'opacity':
        return 'opacity/50';
      case 'typography':
        return 'body/medium';
      default:
        return 'トークン名';
    }
  };

  if (!isCreating) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新しい{tokenType}トークンを追加</span>
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          新しい{tokenType}トークンを作成
        </h4>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              トークン名 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={getNamePlaceholder()}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              値 *
            </label>
            <input
              type={getInputType()}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={getValuePlaceholder()}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
              {...(tokenType === 'opacity' && {
                min: 0,
                max: 1,
                step: 0.01,
              })}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              役割
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="このトークンの役割..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="追加の説明..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !value.trim()}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
