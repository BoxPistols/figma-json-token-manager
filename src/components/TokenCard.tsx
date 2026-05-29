import type { FlattenedToken } from '../types';

interface Props {
  token: FlattenedToken;
}

const TYPE_COLORS: Record<string, string> = {
  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  typography: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  spacing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  dimension: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  borderRadius: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  shadow: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  opacity: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
};

function getTypeColor(type: string) {
  return TYPE_COLORS[type] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
}

function formatValue(token: FlattenedToken): string {
  if (token.isReference) return String(token.value);
  const v = token.value;

  switch (token.type) {
    case 'color':
      return String(v);
    case 'typography':
      if (typeof v === 'object' && v !== null) {
        const t = v as Record<string, unknown>;
        return `${t.fontFamily ?? ''} ${t.fontSize ?? ''}/${t.fontWeight ?? ''}`;
      }
      return String(v);
    case 'shadow':
      if (typeof v === 'object' && v !== null) {
        const s = v as Record<string, unknown>;
        return `${s.offsetX ?? 0} ${s.offsetY ?? 0} ${s.blur ?? 0} ${s.color ?? ''}`;
      }
      return String(v);
    default:
      return String(v);
  }
}

export function TokenCard({ token }: Props) {
  const pathStr = token.path.join(' / ');
  const isDeprecated = token.deprecated === true || typeof token.deprecated === 'string';

  return (
    <div className={`group p-4 rounded-lg border bg-white dark:bg-gray-800 hover:shadow-md transition-shadow ${
      isDeprecated ? 'border-yellow-300 dark:border-yellow-700 opacity-75' : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {token.path[token.path.length - 1]}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(token.type)}`}>
              {token.type}
            </span>
            {token.isReference && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                ref
              </span>
            )}
            {isDeprecated && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                deprecated
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{pathStr}</p>
        </div>

        {/* Color swatch */}
        {token.type === 'color' && typeof token.value === 'string' && !token.isReference && (
          <div
            className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0"
            style={{ backgroundColor: token.value }}
            title={token.value}
          />
        )}
      </div>

      {/* Value */}
      <div className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-2 rounded">
        {formatValue(token)}
      </div>

      {/* Description */}
      {token.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{token.description}</p>
      )}
      {typeof token.deprecated === 'string' && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Deprecated: {token.deprecated}</p>
      )}
    </div>
  );
}
