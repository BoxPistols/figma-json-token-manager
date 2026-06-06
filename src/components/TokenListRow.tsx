import type { FlattenedToken } from '../types';

interface Props {
  token: FlattenedToken;
}

const TYPE_COLORS: Record<string, string> = {
  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  typography: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  spacing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  dimension: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  borderRadius: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  shadow: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
  opacity: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
};

function getTypeColor(type: string) {
  return TYPE_COLORS[type] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400';
}

function formatValue(token: FlattenedToken): string {
  if (token.isReference) return String(token.value);
  const v = token.value;
  switch (token.type) {
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

export function TokenListRow({ token }: Props) {
  const isDeprecated = token.deprecated === true || typeof token.deprecated === 'string';
  const name = token.path[token.path.length - 1];
  const group = token.path.slice(0, -1).join(' / ');

  return (
    <tr className={`group border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
      isDeprecated ? 'opacity-60' : ''
    }`}>
      {/* Swatch / icon */}
      <td className="w-10 px-3 py-2.5">
        {token.type === 'color' && typeof token.value === 'string' && !token.isReference ? (
          <div
            className="w-7 h-7 rounded border border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: token.value }}
          />
        ) : (
          <div className="w-7 h-7 rounded border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700" />
        )}
      </td>

      {/* Name + path */}
      <td className="px-3 py-2.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-900 dark:text-white">{name}</span>
          {token.isReference && (
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">ref</span>
          )}
          {isDeprecated && (
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">deprecated</span>
          )}
        </div>
        {group && (
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{group}</div>
        )}
      </td>

      {/* Type badge */}
      <td className="px-3 py-2.5 whitespace-nowrap">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(token.type)}`}>
          {token.type}
        </span>
      </td>

      {/* Value */}
      <td className="px-3 py-2.5 max-w-[260px]">
        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
          {formatValue(token)}
        </span>
      </td>

      {/* Description */}
      <td className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell max-w-[200px] truncate">
        {token.description ?? '—'}
      </td>
    </tr>
  );
}
