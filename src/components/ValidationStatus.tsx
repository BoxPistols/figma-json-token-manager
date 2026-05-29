import { CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';
import type { ValidationResult } from '../types';

interface Props {
  validation: ValidationResult | null;
  circularRefs: string[];
}

export function ValidationStatus({ validation, circularRefs }: Props) {
  if (!validation) return null;

  const { isValid, errors, warnings, stats } = validation;

  return (
    <div className="space-y-2">
      {/* Summary bar */}
      <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {isValid ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {isValid ? 'スキーマ検証: 合格' : `スキーマ検証: ${errors.length} エラー`}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {stats.tokenCount} トークン / {stats.groupCount} グループ
          </span>
        </div>
        {warnings.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="w-4 h-4" /> {warnings.length} 警告
          </span>
        )}
      </div>

      {/* Circular references */}
      {circularRefs.length > 0 && (
        <div className="flex items-start gap-2 p-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-red-700 dark:text-red-300">循環参照を検出</p>
            {circularRefs.map((ref, i) => (
              <p key={i} className="text-xs text-red-600 dark:text-red-400 font-mono">{ref}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
