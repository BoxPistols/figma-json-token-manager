import React, { useState, useEffect } from 'react';
import {
  Palette,
  Import,
  Search,
  Sun,
  Moon,
  LayoutGrid,
  Grid,
  BookOpen,
  Table,
  X,
  ChevronUp,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { TokenData, FlattenedToken, ImportError, Token } from './types';
import {
  flattenTokens,
  validateToken,
  groupTokensByType,
  saveTokensToStorage,
  loadTokensFromStorage,
  clearTokensFromStorage,
} from './utils/tokenUtils';
import { ErrorDisplay } from './components/ErrorDisplay';
import { TokenGroup } from './components/TokenGroup';
import { TokenTableView } from './components/TokenTableView';
import { ExportPreviewModal } from './components/ExportPreviewModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { BulkDeleteMode } from './components/BulkDeleteMode';
import { PasteJsonModal } from './components/PasteJsonModal';
import { HelpModal } from './components/HelpModal';
import { mockTokens } from './data/mockTokens';
import { w3cSampleTokens } from './data/w3cSampleTokens';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : true;
  });

  const [tokens, setTokens] = useState<TokenData>(() => {
    const storedTokens = loadTokensFromStorage();
    return storedTokens && Object.keys(storedTokens).length > 0
      ? storedTokens
      : mockTokens;
  });

  const [showExampleData, setShowExampleData] = useState(() => {
    const storedTokens = loadTokensFromStorage();
    return !storedTokens || Object.keys(storedTokens).length === 0;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<FlattenedToken | null>(
    null
  );
  const [error, setError] = useState<ImportError | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'compact' | 'table'>(
    'standard'
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  // setImportMode, pasteInput, setPasteInput は未使用のため削除

  // Helper function to map token type to array property name
  const getTokenArrayKey = (tokenType: string): string => {
    const tokenTypePlural = tokenType + 's';
    switch (tokenTypePlural) {
      case 'colors':
        return 'colors';
      case 'typographys':
        return 'typography';
      case 'spacings':
        return 'spacing';
      case 'sizes':
        return 'size';
      case 'opacitys':
        return 'opacity';
      case 'borderRadiuss':
        return 'borderRadius';
      default:
        return tokenTypePlural;
    }
  };

  // Reset filters when view mode changes
  useEffect(() => {
    setSelectedTypes(new Set());
  }, [viewMode, isBulkDeleteMode]);

  // フォントファミリーの動的読み込み用の副作用を追加
  useEffect(() => {
    if (!tokens) return;

    const flattenedTokens = flattenTokens(tokens);
    const fontFamilies = new Set<string>();

    flattenedTokens.forEach((token) => {
      if (token.type === 'typography' && typeof token.value === 'object') {
        const typographyValue = token.value as Record<string, unknown>;
        if (typeof typographyValue.fontFamily === 'string') {
          fontFamilies.add(typographyValue.fontFamily);
        }
      }
    });

    if (fontFamilies.size > 0) {
      const fontFamiliesList = Array.from(fontFamilies)
        .map((f) => f.replace(/ /g, '+'))
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
        const searchInput = document.getElementById(
          'search-input'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      // Escape to clear search
      if (event.key === 'Escape' && isSearchFocused) {
        setSearchQuery('');
        const searchInput = document.getElementById(
          'search-input'
        ) as HTMLInputElement;
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

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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
          setError({
            message: `Error parsing JSON file: ${err instanceof Error ? err.message : String(err)}`,
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePasteImport = (data: TokenData) => {
    setTokens(data);
    setShowExampleData(false);
    setError(null);
    setIsPasteModalOpen(false);
    // インポート後に即座保存
    setTimeout(() => saveTokensToStorage(data), 0);
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
    // localStorageをクリアして最新のmockTokensを確実にロード
    clearTokensFromStorage();
    setTokens(mockTokens);
    setShowExampleData(true);
    setSelectedToken(null);
    setError(null);
    // サンプルデータ読み込み後に保存
    setTimeout(() => saveTokensToStorage(mockTokens), 0);
  };

  // Helper function to convert nested W3C tokens to TokenData format
  const convertW3CTokensToTokenData = (w3cTokens: unknown): TokenData => {
    const result: TokenData = {};

    // Interface for W3C token structure
    interface W3CToken {
      $type: string;
      $value: string | number | Record<string, unknown>;
      $description?: string;
    }

    const traverse = (obj: unknown, path: string[] = []) => {
      if (typeof obj !== 'object' || obj === null) return;
      Object.entries(obj).forEach(([key, value]) => {
        if (
          value &&
          typeof value === 'object' &&
          '$type' in value &&
          '$value' in value
        ) {
          const token = value as W3CToken;
          const tokenType = token.$type;
          const tokenName = [...path, key].join('/');

          // Ensure value is string | number | Record<string, unknown>
          let tokenValue: string | number | Record<string, unknown>;
          const rawValue = token.$value;
          if (
            typeof rawValue === 'string' ||
            typeof rawValue === 'number' ||
            (typeof rawValue === 'object' && rawValue !== null)
          ) {
            tokenValue = rawValue;
          } else {
            tokenValue = String(rawValue);
          }

          const tokenObject: Token = {
            name: tokenName,
            value: tokenValue as string | number | Record<string, unknown>,
            description: (value as W3CToken).$description,
          };

          // Map tokenType to TokenData property name
          let propName = '';
          switch (tokenType) {
            case 'color':
              propName = 'colors';
              break;
            case 'typography':
              propName = 'typography';
              break;
            case 'spacing':
              propName = 'spacing';
              break;
            case 'size':
              propName = 'size';
              break;
            case 'opacity':
              propName = 'opacity';
              break;
            case 'borderRadius':
              propName = 'borderRadius';
              break;
            case 'borderColor':
              propName = 'borderColor';
              break;
            case 'shadow':
              propName = 'shadow';
              break;
            case 'breakpoint':
              propName = 'breakpoint';
              break;
            case 'icon':
              propName = 'icon';
              break;
            default:
              propName = 'others';
          }

          if (!result[propName]) {
            result[propName] = [];
          }
          (result[propName] as Token[]).push(tokenObject);
        } else if (value && typeof value === 'object') {
          traverse(value, [...path, key]);
        }
      });
    };

    traverse(w3cTokens);
    return result;
  };

  const handleLoadW3CExample = () => {
    // W3Cサンプルデータをロード
    clearTokensFromStorage();
    const convertedTokens = convertW3CTokensToTokenData(w3cSampleTokens);
    setTokens(convertedTokens);
    setShowExampleData(true);
    setSelectedToken(null);
    setError(null);
    // サンプルデータ読み込み後に保存
    setTimeout(() => saveTokensToStorage(convertedTokens), 0);
  };

  const handleForceRefresh = () => {
    // 全データをクリアして完全にリセット
    clearTokensFromStorage();
    window.location.reload();
  };

  const toggleGroup = (groupName: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName);
    } else {
      newCollapsed.add(groupName);
    }
    setCollapsedGroups(newCollapsed);
  };

  const getGroupDisplayName = (groupName: string) => {
    const displayNames: Record<string, string> = {
      color: 'Colors',
      borderColor: 'Border Colors',
      shadow: 'Shadows',
      typography: 'Typography',
      spacing: 'Spacing',
      size: 'Sizes',
      opacity: 'Opacity',
      borderRadius: 'Border Radius',
      breakpoint: 'Breakpoints',
      icon: 'Icons',
    };
    return (
      displayNames[groupName] ||
      groupName.charAt(0).toUpperCase() + groupName.slice(1)
    );
  };

  const handleAccordionControl = (
    action: 'openAll' | 'closeAll' | 'selectOpen'
  ) => {
    const allGroupTypes = Object.keys(filteredTokens);

    switch (action) {
      case 'openAll':
        setCollapsedGroups(new Set());
        break;
      case 'closeAll':
        setCollapsedGroups(new Set(allGroupTypes));
        break;
      case 'selectOpen': {
        // Keep only groups that have search matches or selected types
        const groupsToKeep = allGroupTypes.filter(
          (type) => selectedTypes.size === 0 || selectedTypes.has(type)
        );
        const groupsToCollapse = allGroupTypes.filter(
          (type) => !groupsToKeep.includes(type)
        );
        setCollapsedGroups(new Set(groupsToCollapse));
        break;
      }
    }
  };

  const handleClearExample = () => {
    setTokens({});
    setShowExampleData(false);
    setSelectedToken(null);
    setError(null);
    clearTokensFromStorage();
  };

  const handleTokenUpdate = (
    token: FlattenedToken,
    updates: {
      value?: string | number | object;
      role?: string;
      description?: string;
    }
  ) => {
    setTokens((currentTokens) => {
      const updatedTokens = { ...currentTokens };

      // トークンタイプに応じて適切な配列を更新
      const actualTokenType = getTokenArrayKey(token.type);

      if (Array.isArray(updatedTokens[actualTokenType])) {
        const tokenArray = [...updatedTokens[actualTokenType]] as Token[];
        const tokenIndex = tokenArray.findIndex(
          (t) => t.name === token.path.join('/')
        );

        if (tokenIndex !== -1) {
          const updatedToken = {
            ...tokenArray[tokenIndex],
            ...(updates.value !== undefined && { value: updates.value }),
            ...(updates.role !== undefined && { role: updates.role }),
            ...(updates.description !== undefined && {
              description: updates.description,
            }),
          };

          // valueの型をToken型に合わせてRecord<string, unknown>に変換
          let fixedValue = updatedToken.value;
          if (
            typeof fixedValue === 'object' &&
            fixedValue !== null &&
            !Array.isArray(fixedValue)
          ) {
            // すでにRecord<string, unknown>ならそのまま
            fixedValue = fixedValue as Record<string, unknown>;
          }

          // Token型に合わせてupdatedTokenを再構築
          // valueの型をToken型（string | number | Record<string, unknown>）に厳密に合わせる
          let safeValue: string | number | Record<string, unknown>;
          if (
            typeof fixedValue === 'string' ||
            typeof fixedValue === 'number'
          ) {
            safeValue = fixedValue;
          } else if (
            typeof fixedValue === 'object' &&
            fixedValue !== null &&
            !Array.isArray(fixedValue)
          ) {
            safeValue = fixedValue as Record<string, unknown>;
          } else {
            // 万が一不正な型の場合は空オブジェクトにフォールバック
            safeValue = {};
          }

          const fixedToken: Token = {
            ...updatedToken,
            value: safeValue,
          };

          tokenArray[tokenIndex] = fixedToken;
          updatedTokens[actualTokenType] = tokenArray;
        }
      }

      return updatedTokens;
    });
  };

  const handleTokenDelete = (tokenToDelete: FlattenedToken) => {
    setConfirmDialog({
      isOpen: true,
      title: 'トークンを削除',
      message: `"${tokenToDelete.path.join('/')}" を削除してもよろしいですか？この操作は元に戻せません。`,
      onConfirm: () => performTokenDelete(tokenToDelete),
    });
  };

  const performTokenDelete = (token: FlattenedToken) => {
    setTokens((currentTokens) => {
      const updatedTokens = { ...currentTokens };

      // トークンタイプに応じて適切な配列から削除
      const actualTokenType = getTokenArrayKey(token.type);

      if (Array.isArray(updatedTokens[actualTokenType])) {
        const tokenArray = [...updatedTokens[actualTokenType]] as Token[];
        updatedTokens[actualTokenType] = tokenArray.filter(
          (t) => t.name !== token.path.join('/')
        );
      }

      return updatedTokens;
    });
  };

  const handleBulkDelete = (tokensToDelete: FlattenedToken[]) => {
    setConfirmDialog({
      isOpen: true,
      title: '一括削除確認',
      message: `${tokensToDelete.length} 個のトークンを削除してもよろしいですか？この操作は元に戻せません。`,
      onConfirm: () => {
        tokensToDelete.forEach((token) => performTokenDelete(token));
        setIsBulkDeleteMode(false);
      },
    });
  };

  const handleTokenCreate = (
    tokenType: string,
    tokenData: {
      name: string;
      value: string | number;
      role?: string;
      description?: string;
    }
  ) => {
    setTokens((currentTokens) => {
      const updatedTokens = { ...currentTokens };

      // トークンタイプに応じて適切な配列に追加
      const actualTokenType =
        tokenType === 'colors'
          ? 'colors'
          : tokenType === 'typography'
            ? 'typography'
            : tokenType === 'spacing'
              ? 'spacing'
              : tokenType === 'size'
                ? 'size'
                : tokenType === 'opacity'
                  ? 'opacity'
                  : tokenType === 'borderRadius'
                    ? 'borderRadius'
                    : tokenType;

      if (!updatedTokens[actualTokenType]) {
        updatedTokens[actualTokenType] = [];
      }

      if (Array.isArray(updatedTokens[actualTokenType])) {
        const tokenArray = [...updatedTokens[actualTokenType]] as Token[];
        tokenArray.push({
          name: tokenData.name,
          value: tokenData.value,
          ...(tokenData.role && { role: tokenData.role }),
          ...(tokenData.description && { description: tokenData.description }),
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
      filtered[type] = tokens.filter(
        (token) =>
          token.path
            .join('/')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          token.value
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    });
    return filtered;
  }, [groupedTokens, searchQuery]);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Palette className="w-8 h-8 text-blue-500" />
            <h1
              className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Design Tokens Manager
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('standard')}
                  className={`p-2 transition-colors ${
                    viewMode === 'standard'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Standard View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 transition-colors border-x border-gray-300 dark:border-gray-600 ${
                    viewMode === 'compact'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Compact View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Table View"
                >
                  <Table className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-0">
                {viewMode === 'standard'
                  ? 'Standard'
                  : viewMode === 'compact'
                    ? 'Compact'
                    : 'Table'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsHelpModalOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                title="ヘルプ・使用方法"
              >
                <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                title={isDarkMode ? 'ライトモード' : 'ダークモード'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-200" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm md:col-span-2">
            <h2
              className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Import Tokens
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-2 justify-between">
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
                      <span className="text-gray-600 dark:text-gray-300">
                        Choose JSON file
                      </span>
                    </div>
                  </label>
                  <button
                    onClick={() => setIsPasteModalOpen(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    JSON貼付け
                  </button>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={Object.keys(tokens).length === 0}
                  >
                    Export
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsBulkDeleteMode(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    disabled={Object.keys(tokens).length === 0}
                  >
                    一括削除
                  </button>
                </div>
              </div>

              {Object.keys(tokens).length === 0 && (
                <div className="flex items-center justify-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLoadW3CExample}
                    className="flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    W3C形式サンプル
                  </button>
                  <button
                    onClick={handleLoadExample}
                    className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Array形式サンプル
                  </button>
                </div>
              )}

              {showExampleData && Object.keys(tokens).length > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      サンプルデータを表示中
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleLoadExample}
                      className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 underline"
                      title="最新のサンプルデータを再読み込み"
                    >
                      再読み込み
                    </button>
                    <button
                      onClick={handleForceRefresh}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline"
                      title="ページを完全リフレッシュ"
                    >
                      リフレッシュ
                    </button>
                    <button
                      onClick={handleClearExample}
                      className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 underline"
                    >
                      クリア
                    </button>
                  </div>
                </div>
              )}
            </div>
            {error && (
              <ErrorDisplay error={error} onDismiss={() => setError(null)} />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-sm">
            <div className="flex flex-col gap-4 mb-4">
              <h2
                className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
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
                  className="pl-10 pr-20 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-white w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded z-10 bg-white dark:bg-gray-700"
                    title="検索をクリア"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <div className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-500">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                  </div>
                  <div className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-500">
                    K
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isBulkDeleteMode ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            {/* Filter for Bulk Delete Mode */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Filter Tokens for Bulk Delete
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filteredTokens).map(([type, tokens]) => (
                  <button
                    key={type}
                    onClick={() => {
                      const newSelected = new Set(selectedTypes);
                      if (newSelected.has(type)) {
                        newSelected.delete(type);
                      } else {
                        newSelected.add(type);
                      }
                      setSelectedTypes(newSelected);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTypes.size === 0 || selectedTypes.has(type)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {getGroupDisplayName(type)} ({tokens.length})
                  </button>
                ))}
                {selectedTypes.size > 0 && (
                  <button
                    onClick={() => setSelectedTypes(new Set())}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <BulkDeleteMode
              groupedTokens={
                selectedTypes.size === 0
                  ? filteredTokens
                  : Object.fromEntries(
                      Object.entries(filteredTokens).filter(([type]) =>
                        selectedTypes.has(type)
                      )
                    )
              }
              onBulkDelete={handleBulkDelete}
              onCancel={() => setIsBulkDeleteMode(false)}
            />
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            {/* Table Filters */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Filter by Token Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filteredTokens).map(([type, tokens]) => (
                  <button
                    key={type}
                    onClick={() => {
                      const newSelected = new Set(selectedTypes);
                      if (newSelected.has(type)) {
                        newSelected.delete(type);
                      } else {
                        newSelected.add(type);
                      }
                      setSelectedTypes(newSelected);
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTypes.size === 0 || selectedTypes.has(type)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {getGroupDisplayName(type)} ({tokens.length})
                  </button>
                ))}
                {selectedTypes.size > 0 && (
                  <button
                    onClick={() => setSelectedTypes(new Set())}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <TokenTableView
              groupedTokens={
                selectedTypes.size === 0
                  ? filteredTokens
                  : Object.fromEntries(
                      Object.entries(filteredTokens).filter(([type]) =>
                        selectedTypes.has(type)
                      )
                    )
              }
              onTokenSelect={setSelectedToken}
              onTokenUpdate={handleTokenUpdate}
              onTokenDelete={handleTokenDelete}
              selectedToken={selectedToken}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            {/* Accordion Controls */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Token Groups
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAccordionControl('openAll')}
                    className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    All Open
                  </button>
                  <button
                    onClick={() => handleAccordionControl('closeAll')}
                    className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    All Close
                  </button>
                  <button
                    onClick={() => handleAccordionControl('selectOpen')}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Select Open
                  </button>
                </div>
              </div>

              {/* Filter by Token Type for Card Views */}
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Filter by Token Type
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filteredTokens).map(([type, tokens]) => (
                    <button
                      key={type}
                      onClick={() => {
                        const newSelected = new Set(selectedTypes);
                        if (newSelected.has(type)) {
                          newSelected.delete(type);
                        } else {
                          newSelected.add(type);
                        }
                        setSelectedTypes(newSelected);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTypes.size === 0 || selectedTypes.has(type)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {getGroupDisplayName(type)} ({tokens.length})
                    </button>
                  ))}
                  {selectedTypes.size > 0 && (
                    <button
                      onClick={() => setSelectedTypes(new Set())}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            {Object.entries(
              selectedTypes.size === 0
                ? filteredTokens
                : Object.fromEntries(
                    Object.entries(filteredTokens).filter(([type]) =>
                      selectedTypes.has(type)
                    )
                  )
            ).map(([type, tokens]) => (
              <div key={type} className="mb-6 last:mb-0">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleGroup(type)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mb-4"
                >
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {getGroupDisplayName(type)}
                    </h3>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm rounded-full">
                      {tokens.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        collapsedGroups.has(type) ? 'rotate-0' : 'rotate-180'
                      }`}
                    />
                  </div>
                </button>

                {/* Accordion Content */}
                {!collapsedGroups.has(type) && (
                  <TokenGroup
                    key={type}
                    name={type}
                    tokens={tokens}
                    onTokenSelect={setSelectedToken}
                    selectedToken={selectedToken}
                    isCompactMode={viewMode === 'compact'}
                    onTokenUpdate={handleTokenUpdate}
                    onTokenDelete={handleTokenDelete}
                    onTokenCreate={handleTokenCreate}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <ExportPreviewModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          tokens={tokens}
        />

        <PasteJsonModal
          isOpen={isPasteModalOpen}
          onClose={() => setIsPasteModalOpen(false)}
          onImport={handlePasteImport}
        />

        <HelpModal
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
        />

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type="danger"
        />

        {/* Scroll to Top Button */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 z-40"
            title="トップに戻る"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
