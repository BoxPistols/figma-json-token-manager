import React, { useState, useEffect } from 'react';
import { Palette, Import, Search, Sun, Moon, LayoutGrid, Grid, BookOpen } from 'lucide-react';
import { TokenData, FlattenedToken, ImportError, Token } from './types';
import { flattenTokens, validateToken, groupTokensByType, saveTokensToStorage, loadTokensFromStorage, clearTokensFromStorage } from './utils/tokenUtils';
import { convertToArrayFormat, convertToStandardFormat } from './utils/tokenConverter';
import { ErrorDisplay } from './components/ErrorDisplay';
import { TokenGroup } from './components/TokenGroup';
import { ExportPreviewModal } from './components/ExportPreviewModal';
import { mockTokens } from './data/mockTokens';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : true;
  });

  const [tokens, setTokens] = useState<TokenData>(() => {
    const storedTokens = loadTokensFromStorage();
    return storedTokens && Object.keys(storedTokens).length > 0 ? storedTokens : mockTokens;
  });

  const [showExampleData, setShowExampleData] = useState(() => {
    const storedTokens = loadTokensFromStorage();
    return !storedTokens || Object.keys(storedTokens).length === 0;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<FlattenedToken | null>(null);
  const [error, setError] = useState<ImportError | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  // キーボードショートカット for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Win/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      // Escape to clear search
      if (event.key === 'Escape' && isSearchFocused) {
        setSearchQuery('');
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchFocused]);

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
          setShowExampleData(false);
          setError(null);
          // インポート後に即座保存
          setTimeout(() => saveTokensToStorage(data), 0);
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
    setShowExampleData(false);
  };

  const handleLoadExample = () => {
    setTokens(mockTokens);
    setShowExampleData(true);
    setSelectedToken(null);
    setError(null);
    // サンプルデータ読み込み後に保存
    setTimeout(() => saveTokensToStorage(mockTokens), 0);
  };

  const handleClearExample = () => {
    setTokens({});
    setShowExampleData(false);
    setSelectedToken(null);
    setError(null);
    clearTokensFromStorage();
  };

  const handleTokenUpdate = (token: FlattenedToken, updates: { value?: string | number | object; role?: string; description?: string }) => {
    setTokens(currentTokens => {
      const updatedTokens = { ...currentTokens };
      
      // トークンタイプに応じて適切な配列を更新
      const tokenType = token.type + 's';
      const actualTokenType = tokenType === 'colors' ? 'colors' : 
                             tokenType === 'typographys' ? 'typography' :
                             tokenType === 'spacings' ? 'spacing' :
                             tokenType === 'sizes' ? 'size' :
                             tokenType === 'opacitys' ? 'opacity' :
                             tokenType === 'borderRadiuss' ? 'borderRadius' : tokenType;
      
      if (Array.isArray(updatedTokens[actualTokenType])) {
        const tokenArray = [...updatedTokens[actualTokenType]] as Token[];
        const tokenIndex = tokenArray.findIndex(t => t.name === token.path.join('/'));
        
        if (tokenIndex !== -1) {
          const updatedToken = {
            ...tokenArray[tokenIndex],
            ...(updates.value !== undefined && { value: updates.value }),
            ...(updates.role !== undefined && { role: updates.role }),
            ...(updates.description !== undefined && { description: updates.description })
          };
          
          tokenArray[tokenIndex] = updatedToken;
          updatedTokens[actualTokenType] = tokenArray;
        }
      }
      
      return updatedTokens;
    });
  };

  const handleTokenDelete = (token: FlattenedToken) => {
    setTokens(currentTokens => {
      const updatedTokens = { ...currentTokens };
      
      // トークンタイプに応じて適切な配列から削除
      const tokenType = token.type + 's';
      const actualTokenType = tokenType === 'colors' ? 'colors' : 
                             tokenType === 'typographys' ? 'typography' :
                             tokenType === 'spacings' ? 'spacing' :
                             tokenType === 'sizes' ? 'size' :
                             tokenType === 'opacitys' ? 'opacity' :
                             tokenType === 'borderRadiuss' ? 'borderRadius' : tokenType;
      
      if (Array.isArray(updatedTokens[actualTokenType])) {
        const tokenArray = [...updatedTokens[actualTokenType]] as Token[];
        updatedTokens[actualTokenType] = tokenArray.filter(t => t.name !== token.path.join('/'));
      }
      
      return updatedTokens;
    });
  };

  const handleTokenCreate = (tokenType: string, tokenData: {
    name: string;
    value: string | number;
    role?: string;
    description?: string;
  }) => {
    setTokens(currentTokens => {
      const updatedTokens = { ...currentTokens };
      
      // トークンタイプに応じて適切な配列に追加
      const actualTokenType = tokenType === 'colors' ? 'colors' : 
                             tokenType === 'typography' ? 'typography' :
                             tokenType === 'spacing' ? 'spacing' :
                             tokenType === 'size' ? 'size' :
                             tokenType === 'opacity' ? 'opacity' :
                             tokenType === 'borderRadius' ? 'borderRadius' : tokenType;
      
      if (!updatedTokens[actualTokenType]) {
        updatedTokens[actualTokenType] = [];
      }
      
      if (Array.isArray(updatedTokens[actualTokenType])) {
        const tokenArray = [...updatedTokens[actualTokenType]] as Token[];
        tokenArray.push({
          name: tokenData.name,
          value: tokenData.value,
          ...(tokenData.role && { role: tokenData.role }),
          ...(tokenData.description && { description: tokenData.description })
        });
        updatedTokens[actualTokenType] = tokenArray;
      }
      
      return updatedTokens;
    });
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
            <div className="space-y-4">
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
                  disabled={Object.keys(tokens).length === 0}
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
              
              {Object.keys(tokens).length === 0 && (
                <div className="flex items-center justify-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLoadExample}
                    className="flex items-center px-3 py-2 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    サンプルデータを読み込む
                  </button>
                </div>
              )}
              
              {showExampleData && Object.keys(tokens).length > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-700 dark:text-green-300">サンプルデータを表示中</span>
                  </div>
                  <button
                    onClick={handleClearExample}
                    className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 underline"
                  >
                    クリア
                  </button>
                </div>
              )}
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
                  id="search-input"
                  type="text"
                  placeholder="トークンを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 pr-20 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-white w-full"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-500">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                  </kbd>
                  <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-500">
                    K
                  </kbd>
                </div>
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
              onTokenUpdate={handleTokenUpdate}
              onTokenDelete={handleTokenDelete}
              onTokenCreate={handleTokenCreate}
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
