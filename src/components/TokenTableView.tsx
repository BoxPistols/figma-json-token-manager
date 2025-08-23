import React, { useState } from 'react';
import { FlattenedToken } from '../types';
import { Edit3, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface TokenTableViewProps {
  groupedTokens: Record<string, FlattenedToken[]>;
  onTokenSelect: (token: FlattenedToken) => void;
  onTokenUpdate?: (
    token: FlattenedToken,
    updates: {
      value?: string | number | object;
      role?: string;
      description?: string;
    }
  ) => void;
  onTokenDelete?: (token: FlattenedToken) => void;
  selectedToken?: FlattenedToken | null;
}

export function TokenTableView({
  groupedTokens,
  onTokenSelect,
  onTokenUpdate,
  onTokenDelete,
  selectedToken,
}: TokenTableViewProps) {
  const [sortBy, setSortBy] = useState<'type' | 'name' | 'value'>('type');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Flatten all tokens for table view
  const allTokens = Object.entries(groupedTokens).flatMap(([type, tokens]) =>
    tokens.map((token) => ({ ...token, type }))
  );

  // Sort tokens
  const sortedTokens = [...allTokens].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'name':
        comparison = a.path.join('/').localeCompare(b.path.join('/'));
        break;
      case 'value': {
        const aValue =
          typeof a.value === 'string' ? a.value : JSON.stringify(a.value);
        const bValue =
          typeof b.value === 'string' ? b.value : JSON.stringify(b.value);
        comparison = aValue.localeCompare(bValue);
        break;
      }
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: 'type' | 'name' | 'value') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleEdit = (
    token: FlattenedToken,
    field: 'value' | 'role' | 'description'
  ) => {
    const newValue = prompt(
      `Edit ${field}:`,
      field === 'value'
        ? typeof token.value === 'object'
          ? JSON.stringify(token.value)
          : String(token.value)
        : (field === 'role' ? token.role : token.description) || ''
    );

    if (newValue !== null && onTokenUpdate) {
      let processedValue: string | number | object = newValue;

      if (field === 'value') {
        // Process value based on token type
        if (token.type === 'opacity') {
          const numValue = parseFloat(newValue);
          if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
            processedValue = numValue;
          }
        } else if (
          token.type === 'spacing' ||
          token.type === 'size' ||
          token.type === 'borderRadius'
        ) {
          const trimmedValue = newValue.trim();
          const unitRegex =
            /^(\d*\.?\d+)(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)?$/;
          const match = trimmedValue.match(unitRegex);

          if (match) {
            const [, , unit] = match;
            processedValue = unit ? trimmedValue : trimmedValue + 'px';
          } else {
            processedValue = trimmedValue;
          }
        } else if (
          token.type === 'typography' &&
          typeof token.value === 'object'
        ) {
          try {
            processedValue = JSON.parse(newValue);
          } catch {
            processedValue = newValue;
          }
        }
      }

      const updates: {
        value?: string | number | object;
        role?: string;
        description?: string;
      } = {};
      if (field === 'value') updates.value = processedValue;
      else if (field === 'role') updates.role = newValue;
      else if (field === 'description') updates.description = newValue;

      onTokenUpdate(token, updates);
    }
  };

  const formatValue = (token: FlattenedToken) => {
    if (typeof token.value === 'object') {
      if (token.type === 'typography') {
        const typographyValue = token.value as Record<string, unknown>;
        return `${typographyValue.fontSize}px ${typographyValue.fontFamily}`;
      }
      return JSON.stringify(token.value);
    }
    return String(token.value);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      typography:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      spacing:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      size: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      opacity:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      borderRadius:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      borderColor:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      shadow:
        'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
      breakpoint:
        'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      icon: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    };
    return (
      colors[type] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {sortBy === 'type' &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    ))}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortBy === 'name' &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    ))}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center space-x-1">
                  <span>Value</span>
                  {sortBy === 'value' &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    ))}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTokens.map((token, index) => (
              <tr
                key={`${token.path.join('-')}-${index}`}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  selectedToken?.path.join('/') === token.path.join('/')
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
                onClick={() => onTokenSelect(token)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(token.type)}`}
                  >
                    {token.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {token.path[token.path.length - 1]}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {token.path.join(' / ')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {token.type === 'color' && (
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: token.value as string }}
                      />
                    )}
                    <span className="text-sm text-gray-900 dark:text-white font-mono break-all">
                      {formatValue(token)}
                    </span>
                    {onTokenUpdate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(token, 'value');
                        }}
                        className="text-gray-400 hover:text-blue-500"
                        title="値を編集"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 dark:text-white break-all">
                      {token.role || '-'}
                    </span>
                    {onTokenUpdate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(token, 'role');
                        }}
                        className="text-gray-400 hover:text-blue-500"
                        title="役割を編集"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 dark:text-white break-all">
                      {token.description || '-'}
                    </span>
                    {onTokenUpdate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(token, 'description');
                        }}
                        className="text-gray-400 hover:text-blue-500"
                        title="説明を編集"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onTokenDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTokenDelete(token);
                      }}
                      className="text-gray-400 hover:text-red-500"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
