import { useState, useCallback } from 'react';
import { X, Upload, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';
import type { TokenSet } from '../types';
import { validateAgainstSchema } from '../utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: TokenSet) => void;
}

export function ImportModal({ isOpen, onClose, onImport }: Props) {
  const [input, setInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<{
    data: TokenSet;
    validation: ReturnType<typeof validateAgainstSchema>;
  } | null>(null);

  const handleClose = useCallback(() => {
    setInput('');
    setParseError(null);
    setPreviewResult(null);
    onClose();
  }, [onClose]);

  const handleValidate = useCallback(() => {
    setParseError(null);
    setPreviewResult(null);

    if (!input.trim()) {
      setParseError('JSONデータを入力してください');
      return;
    }

    try {
      const parsed = JSON.parse(input) as TokenSet;
      const result = validateAgainstSchema(parsed);
      setPreviewResult({ data: parsed, validation: result });
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'JSONの解析に失敗しました');
    }
  }, [input]);

  const handleImport = useCallback(() => {
    if (previewResult) {
      onImport(previewResult.data);
      handleClose();
    }
  }, [previewResult, onImport, handleClose]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setInput(text);
      };
      reader.readAsText(file);
    },
    []
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              トークンをインポート
            </h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ファイルから読み込み (.tokens.json)
            </label>
            <input
              type="file"
              accept=".json,.tokens.json,.tokens"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
            />
          </div>

          {/* JSON input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JSONデータ
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`W3C Design Tokens形式 (Figma互換):\n{\n  "color": {\n    "primary": {\n      "$type": "color",\n      "$value": "#2164D1",\n      "$description": "メインブランドカラー"\n    }\n  }\n}`}
              className="w-full h-48 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Parse error */}
          {parseError && (
            <ErrorBox icon="error" message={parseError} />
          )}

          {/* Preview validation */}
          {previewResult && (
            <ValidationReport validation={previewResult.validation} />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          {!previewResult ? (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={handleValidate}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={!input.trim()}
              >
                バリデーション実行
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPreviewResult(null)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                戻る
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                インポート実行 ({previewResult.validation.stats.tokenCount} トークン)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ icon, message }: { icon: 'error' | 'warning'; message: string }) {
  const Icon = icon === 'error' ? AlertCircle : AlertTriangle;
  const color = icon === 'error'
    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300';

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border ${color}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function ValidationReport({ validation }: { validation: ReturnType<typeof validateAgainstSchema> }) {
  const { isValid, errors, warnings, stats } = validation;

  return (
    <div className="space-y-3">
      {/* Status */}
      {isValid ? (
        <div className="flex items-start gap-2 p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Figma互換性チェック: 合格</p>
            <p className="text-xs mt-1">
              {stats.tokenCount} トークン / {stats.groupCount} グループ / タイプ: {stats.types.join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Figma互換性エラー ({errors.length})</p>
            <p className="text-xs mt-1">
              {stats.tokenCount} トークン / タイプ: {stats.types.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Errors list */}
      {errors.length > 0 && (
        <div className="p-3 rounded-lg border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">エラー</h4>
          <ul className="space-y-1 text-xs text-red-700 dark:text-red-400">
            {errors.slice(0, 10).map((e, i) => (
              <li key={i}>
                <code className="bg-red-100 dark:bg-red-900 px-1 rounded">{e.path}</code> {e.message}
              </li>
            ))}
            {errors.length > 10 && (
              <li className="italic">... 他 {errors.length - 10} 件</li>
            )}
          </ul>
        </div>
      )}

      {/* Warnings list */}
      {warnings.length > 0 && (
        <div className="p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">警告 ({warnings.length})</h4>
          <ul className="space-y-1 text-xs text-yellow-700 dark:text-yellow-400">
            {warnings.slice(0, 5).map((w, i) => (
              <li key={i}>
                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{w.path}</code> {w.message}
              </li>
            ))}
            {warnings.length > 5 && (
              <li className="italic">... 他 {warnings.length - 5} 件</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
