import { useState } from 'react';
import { Upload, Download, Trash2, Search, Palette, RotateCcw } from 'lucide-react';
import { useTokens } from './hooks';
import { sampleTokens } from './data/sampleTokens';
import {
  ImportModal,
  ExportModal,
  TokenCard,
  ValidationStatus,
  SchemaGuide,
} from './components';

export default function App() {
  const {
    flattened,
    validation,
    circularRefs,
    importTokens,
    exportTokens,
    clearTokens,
  } = useTokens();

  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const types = Array.from(new Set(flattened.map((t) => t.type))).sort();

  const filtered = flattened.filter((t) => {
    const matchSearch =
      !search ||
      t.path.join('/').toLowerCase().includes(search.toLowerCase()) ||
      (t.description ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const exportJson = exportTokens();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-blue-500" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Design Tokens Manager
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              W3C DTCG 2025.10
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SchemaGuide />
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Upload className="w-4 h-4" /> インポート
            </button>
            <button
              onClick={() => setShowExport(true)}
              disabled={flattened.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> エクスポート
            </button>
            {flattened.length > 0 && (
              <>
                <button
                  onClick={() => importTokens(sampleTokens)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  title="サンプルデータをリロード"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('すべてのトークンを削除しますか？')) clearTokens();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Validation status */}
        <ValidationStatus validation={validation} circularRefs={circularRefs} />

        {/* Filters */}
        {flattened.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="トークン名や説明で検索..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
            >
              <option value="all">すべての型 ({flattened.length})</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t} ({flattened.filter((f) => f.type === t).length})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Token grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((token, i) => (
              <TokenCard key={`${token.path.join('/')}-${i}`} token={token} />
            ))}
          </div>
        ) : flattened.length > 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-sm">一致するトークンがありません</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <Palette className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Design Tokensをインポート
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Figma Design Tokens ManagerからエクスポートしたJSONを読み込むか、
              W3C DTCG形式でトークンを定義してください
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => importTokens(sampleTokens)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" /> Example を読み込む
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
              >
                <Upload className="w-4 h-4" /> JSONをインポート
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ImportModal isOpen={showImport} onClose={() => setShowImport(false)} onImport={importTokens} />
      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} json={exportJson} />
    </div>
  );
}
