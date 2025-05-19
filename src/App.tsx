import React, { useState, useEffect } from 'react';
import { Palette, Import, Search, Sun, Moon, LayoutGrid, Grid } from 'lucide-react';
import { TokenData, FlattenedToken, ImportError } from './types';
import { flattenTokens, validateToken, groupTokensByType, saveTokensToStorage, loadTokensFromStorage, clearTokensFromStorage } from './utils/tokenUtils';
import { ErrorDisplay } from './components/ErrorDisplay';
import { TokenGroup } from './components/TokenGroup';
import { ExportPreviewModal } from './components/ExportPreviewModal';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : true;
  });

  const [tokens, setTokens] = useState<TokenData>(() => {
    return loadTokensFromStorage() || {};
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<FlattenedToken | null>(null);
  const [error, setError] = useState<ImportError | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);

  // フォントファミリーの動的読み込み用の副作用を追加
  useEffect(() => {
    if (!tokens) return;

    const flattenedTokens = flattenTokens(tokens);
    const fontFamilies = new Set<string>();

    flattenedTokens.forEach(token => {
      if (token.type === 'typography' && typeof token.value === 'object') {
        const typographyValue = token.value as Record<string, unknown>;
        if (typeof typographyValue.fontFamily === 'string') {
          fontFamilies.add(typographyValue.fontFamily);
        }
      }
    });

    if (fontFamilies.size > 0) {
      const fontFamiliesList = Array.from(fontFamilies)
        .map(f => f.replace(/ /g, '+'))
        .join('|');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamiliesList)}&display=swap`;
      document.head.appendChild(link);
    }
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (Object.keys(tokens).length > 0) {
      saveTokensToStorage(tokens);
    }
  }, [tokens]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const validationError = validateToken(data);

          if (validationError) {
            setError({ message: validationError });
            return;
          }

          setTokens(data);
          setError(null);
        } catch (err) {
          setError({ message: `Error parsing JSON file: ${err instanceof Error ? err.message : String(err)}` });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleReset = () => {
    setTokens({});
    clearTokensFromStorage();
    setSelectedToken(null);
    setError(null);
  };

  const flattenedTokens = React.useMemo(() => {
    try {
      return flattenTokens(tokens);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return [];
    }
  }, [tokens]);

  const groupedTokens = React.useMemo(() => {
    return groupTokensByType(flattenedTokens);
  }, [flattenedTokens]);

  const filteredTokens = React.useMemo(() => {
    if (!searchQuery) return groupedTokens;

    const filtered: Record<string, FlattenedToken[]> = {};
    Object.entries(groupedTokens).forEach(([type, tokens]) => {
      filtered[type] = tokens.filter(token =>
        token.path.join('/').toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return filtered;
  }, [groupedTokens, searchQuery]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Palette className="w-8 h-8 text-blue-500" />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Design Tokens Manager
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCompactMode(!isCompactMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              title={isCompactMode ? "Switch to Full View" : "Switch to Compact View"}
            >
              {isCompactMode ? (
                <LayoutGrid className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Grid className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-200" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Import Tokens
            </h2>
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
                  <Import className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">Choose JSON file</span>
                </div>
              </label>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Export
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
            {error && (
              <ErrorDisplay error={error} onDismiss={() => setError(null)} />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Search Tokens
              </h2>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          {Object.entries(filteredTokens).map(([type, tokens]) => (
            <TokenGroup
              key={type}
              name={type}
              tokens={tokens}
              onTokenSelect={setSelectedToken}
              selectedToken={selectedToken}
              isCompactMode={isCompactMode}
            />
          ))}
        </div>

        <ExportPreviewModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          tokens={tokens}
        />
      </div>
    </div>
  );
}

export default App;
