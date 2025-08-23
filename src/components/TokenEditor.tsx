import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Check, X, Trash2 } from 'lucide-react';
import { FlattenedToken } from '../types';

interface TokenEditorProps {
  token: FlattenedToken;
  onSave: (token: FlattenedToken, updates: { value?: string | number | object; role?: string; description?: string }) => void;
  onDelete?: (token: FlattenedToken) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export function TokenEditor({
  token,
  onSave,
  onDelete,
  isEditing,
  onStartEdit,
  onCancelEdit,
}: TokenEditorProps) {
  const [editValue, setEditValue] = useState<string>('');
  const [editRole, setEditRole] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editMode, setEditMode] = useState<'value' | 'role' | 'description'>('value');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      // typographyトークンの場合は編集用の文字列を生成
      const displayValue = typeof token.value === 'object' 
        ? (token.type === 'typography' 
            ? `${(token.value as any).fontSize}px ${(token.value as any).fontFamily}`
            : JSON.stringify(token.value))
        : String(token.value);
      
      setEditValue(displayValue);
      setEditRole(token.role || '');
      setEditDescription(token.description || '');
      setTimeout(() => {
        if (editMode === 'value') {
          inputRef.current?.focus();
        } else {
          textareaRef.current?.focus();
        }
      }, 0);
    }
  }, [isEditing, token.value, token.role, token.description, editMode]);

  const handleSave = () => {
    const updates: { value?: string | number | object; role?: string; description?: string } = {};
    
    if (editMode === 'value' && editValue.trim() !== '') {
      // 型に応じて値を変換
      let newValue: string | number | object = editValue.trim();
      
      if (token.type === 'opacity') {
        const numValue = parseFloat(editValue);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
          newValue = numValue;
        }
      } else if (token.type === 'spacing' || token.type === 'size' || token.type === 'borderRadius') {
        if (/^\d+px?$/.test(editValue.trim())) {
          newValue = editValue.trim().endsWith('px') ? editValue.trim() : editValue.trim() + 'px';
        }
      } else if (token.type === 'typography') {
        // typography値の場合、元のオブジェクト構造を保持しながら更新
        // 簡易編集の場合はvalueフィールドを更新
        if (typeof token.value === 'object') {
          newValue = { ...token.value as any, value: editValue.trim() };
        } else {
          newValue = editValue.trim();
        }
      }
      updates.value = newValue;
    } else if (editMode === 'role') {
      updates.role = editRole.trim();
    } else if (editMode === 'description') {
      updates.description = editDescription.trim();
    }
    
    // 空の更新でも保存を実行（役割や説明の削除を許可）
    onSave(token, updates);
    onCancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 日本語入力中（変換中）かどうかをチェック
    if (e.nativeEvent.isComposing) {
      return; // 変換中の場合は何もしない
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  const getInputType = () => {
    if (token.type === 'opacity') return 'number';
    return 'text';
  };

  const getInputProps = () => {
    const baseProps = {
      ref: inputRef,
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value),
      onKeyDown: handleKeyDown,
      className: "w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white",
      type: getInputType()
    };

    if (token.type === 'opacity') {
      return {
        ...baseProps,
        min: 0,
        max: 1,
        step: 0.01
      };
    }

    return baseProps;
  };

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between group">
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">値:</div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {typeof token.value === 'string' 
                ? token.value 
                : typeof token.value === 'object' 
                  ? (token.type === 'typography' 
                      ? `${(token.value as any).fontSize}px ${(token.value as any).fontFamily}`
                      : JSON.stringify(token.value))
                  : String(token.value)}
            </span>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => { setEditMode('value'); onStartEdit(); }}
              className="p-1 text-gray-400 hover:text-blue-500 rounded"
              title="値を編集"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(token)}
                className="p-1 text-gray-400 hover:text-red-500 rounded"
                title="削除"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        
        {(token.role || token.description) && (
          <div className="flex items-start justify-between group">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {token.role ? '役割:' : '説明:'}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 break-words">
                {token.role || token.description}
              </span>
            </div>
            <button
              onClick={() => { setEditMode(token.role ? 'role' : 'description'); onStartEdit(); }}
              className="p-1 text-gray-400 hover:text-blue-500 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
              title={token.role ? '役割を編集' : '説明を編集'}
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        )}
        
        {!token.role && !token.description && (
          <div className="flex items-center justify-between group">
            <span className="text-xs text-gray-400 italic">役割/説明を追加</span>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditMode('role'); onStartEdit(); }}
                className="p-1 text-gray-400 hover:text-green-500 rounded text-xs"
                title="役割を追加"
              >
                +役割
              </button>
              <button
                onClick={() => { setEditMode('description'); onStartEdit(); }}
                className="p-1 text-gray-400 hover:text-green-500 rounded text-xs"
                title="説明を追加"
              >
                +説明
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {editMode === 'value' ? '値を編集:' : editMode === 'role' ? '役割を編集:' : '説明を編集:'}
      </div>
      <div className="flex items-start space-x-2">
        {editMode === 'value' ? (
          <input {...getInputProps()} />
        ) : (
          <textarea
            ref={textareaRef}
            value={editMode === 'role' ? editRole : editDescription}
            onChange={(e) => editMode === 'role' ? setEditRole(e.target.value) : setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white resize-none"
            rows={2}
            placeholder={editMode === 'role' ? '役割を入力...' : '説明を入力...'}
          />
        )}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-700 rounded"
            title="保存"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={onCancelEdit}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="キャンセル"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}