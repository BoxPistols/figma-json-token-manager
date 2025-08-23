import { useState, useEffect } from 'react';
import { FlattenedToken } from '../types';
import { calculateContrastRatio, isLightColor } from '../utils/colorUtils';
import { TokenEditor } from './TokenEditor';
import { TokenCreator } from './TokenCreator';

interface TokenGroupProps {
  name: string;
  tokens: FlattenedToken[];
  onTokenSelect: (token: FlattenedToken) => void;
  selectedToken?: FlattenedToken | null;
  isCompactMode?: boolean;
  onTokenUpdate?: (token: FlattenedToken, updates: { value?: string | number | object; role?: string; description?: string }) => void;
  onTokenDelete?: (token: FlattenedToken) => void;
  onTokenCreate?: (tokenType: string, tokenData: {
    name: string;
    value: string | number;
    role?: string;
    description?: string;
  }) => void;
}

export function TokenGroup({ name, tokens, onTokenSelect, selectedToken, isCompactMode = false, onTokenUpdate, onTokenDelete, onTokenCreate }: TokenGroupProps) {
  const [editingTokenId, setEditingTokenId] = useState<string | null>(null);
  // Group tokens by their parent path for color tokens
  const groupedTokens = name === 'colors' 
    ? tokens.reduce((acc, token) => {
        const pathWithoutCommonPrefix = removeCommonPrefix(token.path);
        const parentPath = pathWithoutCommonPrefix.slice(0, -1).join('/');
        if (!acc[parentPath]) {
          acc[parentPath] = [];
        }
        acc[parentPath].push(token);
        return acc;
      }, {} as Record<string, FlattenedToken[]>)
    : { '': tokens }; // Other token types don't need grouping

  // Sort tokens within each group
  if (name === 'colors') {
    // Define color group order
    const colorGroupOrder = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'grey'];
    
    // Sort groups by predefined order
    const sortedGroups: Record<string, FlattenedToken[]> = {};
    colorGroupOrder.forEach(groupName => {
      if (groupedTokens[groupName]) {
        sortedGroups[groupName] = groupedTokens[groupName];
      }
    });
    
    // Add any remaining groups that weren't in the predefined order
    Object.entries(groupedTokens).forEach(([key, value]) => {
      if (!sortedGroups[key]) {
        sortedGroups[key] = value;
      }
    });
    
    Object.assign(groupedTokens, sortedGroups);
    
    // Sort tokens within each color group
    Object.values(groupedTokens).forEach(group => {
      group.sort((a, b) => {
        const variants = ['main', 'dark', 'light', 'lighter'];
        const aVariant = a.path[a.path.length - 1];
        const bVariant = b.path[b.path.length - 1];

        const aIndex = variants.indexOf(aVariant);
        const bIndex = variants.indexOf(bVariant);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        return a.path[a.path.length - 1].localeCompare(b.path[b.path.length - 1]);
      });
    });
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {name.charAt(0).toUpperCase() + name.slice(1)}
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({tokens.length})
          </span>
        </h3>
        {name === 'colors' && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            primary → secondary → success → warning → error → info → grey
          </div>
        )}
      </div>

      <div className={name === 'colors' ? 'space-y-8' : 'space-y-6'}>
        {Object.entries(groupedTokens).map(([parentPath, groupTokens], groupIndex) => (
          <div 
            key={parentPath} 
            className={`
              space-y-2 
              ${name === 'colors' && groupIndex > 0 ? 'pt-6 border-t border-gray-200 dark:border-gray-700' : ''}
            `}
          >
            {parentPath && name === 'colors' && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {parentPath.charAt(0).toUpperCase() + parentPath.slice(1)}
                </h4>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              </div>
            )}
            <div className={`
              grid gap-4 
              ${isCompactMode 
                ? (name === 'colors' ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-6') 
                : (name === 'colors' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-4')
              }
            `}>
              {groupTokens.map((token, index) => (
                <div
                  key={`${token.path.join('-')}-${index}`}
                  onClick={() => onTokenSelect(token)}
                  className={`
                    cursor-pointer rounded-lg ${isCompactMode ? 'p-2' : 'p-4'} transition-all
                    ${selectedToken?.path.join('/') === token.path.join('/')
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-md'
                      : 'bg-white dark:bg-gray-800 hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <TokenPreview token={token} isCompact={isCompactMode} />
                  <div className={isCompactMode ? 'mt-1' : 'mt-2'}>
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {token.path[token.path.length - 1]}
                    </div>
                    {!isCompactMode && (
                      <div className="text-xs text-blue-500 dark:text-blue-400 mt-1 truncate">
                        {token.path.join(' / ')}
                      </div>
                    )}
                    {!isCompactMode && (token.role || token.description) && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate" title={token.role || token.description}>
                        {token.role || token.description}
                      </div>
                    )}
                    {!isCompactMode && onTokenUpdate && (
                      <div className="mt-2 space-y-1">
                        <TokenEditor
                          token={token}
                          onSave={onTokenUpdate}
                          onDelete={onTokenDelete}
                          isEditing={editingTokenId === token.path.join('/')}
                          onStartEdit={() => setEditingTokenId(token.path.join('/'))}
                          onCancelEdit={() => setEditingTokenId(null)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {onTokenCreate && (
          <TokenCreator 
            tokenType={name.replace(/s$/, '')} 
            onCreateToken={(tokenData) => onTokenCreate(name, tokenData)}
          />
        )}
      </div>
    </div>
  );
}

function TokenPreview({ token, isCompact }: { token: FlattenedToken; isCompact: boolean }) {
  // ダークモード状態をReactの状態として管理
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // 初期値の設定: ローカルストレージまたはHTML要素のクラスから取得
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    return document.documentElement.classList.contains('dark');
  });

  // ダークモードの変更を監視
  useEffect(() => {
    const handleThemeChange = () => {
      // LocalStorageの値またはHTML要素のクラスを確認
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        setIsDarkMode(true);
      } else if (storedTheme === 'light') {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      }
    };

    // 初期設定
    handleThemeChange();

    // MutationObserverを使用してHTMLのクラス変更を監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // ローカルストレージの変更を監視
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'theme') {
        handleThemeChange();
      }
    };
    window.addEventListener('storage', storageHandler);

    // クリーンアップ
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  if (token.type === 'color') {
    const color = token.value as string;
    const isLight = isLightColor(color);
    const variant = token.path[token.path.length - 1];
    const isLightVariant = variant === 'light' || variant === 'lighter';

    // 現在のテーマの背景色
    const backgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';

    // ① カラートークンがテキストとして使用される場合のコントラスト比
    const contrastWithBackground = calculateContrastRatio(color, backgroundColor);

    // ② カラートークンが背景として使用される場合に適切なテキスト色
    const textColor = isLight ? '#000000' : '#FFFFFF';

    // ③ サンプル「Aa」の色 - lighter の場合は濃い色を使用、それ以外は明度ベース
    const textColorForSample = (isLightVariant && variant === 'lighter') 
      ? '#000000'  // lighterバリアントは常に濃い文字
      : isLight ? '#000000' : '#FFFFFF';  // その他は明度ベース

    // ④ サンプル「Aa」とその背景（カラートークン）のコントラスト
    const contrastWithSampleText = calculateContrastRatio(color, textColorForSample);

    return (
      <div className="space-y-2">
        <div
          className={`relative rounded-md overflow-hidden ${isCompact ? 'h-12' : 'h-24'}`}
          style={{ backgroundColor: color }}
        >
          {/* Aaテキストはコンパクトモードでは表示しない */}
          {!isCompact && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ color: textColorForSample }} className="text-2xl font-medium">
                Aa
              </span>
            </div>
          )}

          {/* コントラスト比表示 - 実際に表示されている組み合わせを使用 */}
          <div className={`absolute bottom-1 right-1 text-xs ${isCompact ? 'bg-black/80 text-white px-1 py-0' : 'bg-black/70 dark:bg-white/70 text-white dark:text-black px-1.5 py-0.5'} rounded ${contrastWithSampleText < 3 ? 'ring-1 ring-orange-400' : ''}`}>
            <span title={`現在のテーマ背景色との対比: ${contrastWithBackground.toFixed(2)}:1`}>
              {isCompact
                ? `${(Math.floor(contrastWithSampleText * 100) / 100).toFixed(2)}:1`
                : `${(Math.floor(contrastWithSampleText * 100) / 100).toFixed(2)}:1`}
            </span>
          </div>
        </div>

        {!isCompact && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">HEX</span>
              <span className="font-mono text-gray-500 dark:text-gray-400">{color.toUpperCase()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="flex-1 h-8 rounded flex items-center justify-center text-sm"
                style={{ backgroundColor: color, color: textColor }}
              >
                Text
              </div>
              <div
                className="flex-1 h-8 rounded flex items-center justify-center text-sm border"
                style={{ color, backgroundColor: 'transparent' }}
              >
                Text
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (token.type === 'typography') {
    const typographyValue = token.value as Record<string, string | number | undefined>;
    const fontSizeRaw = typographyValue.fontSize;
    const fontSizeValue = typeof fontSizeRaw === 'number' ? fontSizeRaw : parseInt(fontSizeRaw || '16', 10);
    
    // コンパクトモードでの表示サンプルを最適化
    const sampleText = isCompact ? 'Aa' : 'テキストサンプル';
    const displayFontSize = isCompact ? Math.min(fontSizeValue, 24) : Math.min(fontSizeValue, 32);
    
    // カード内に収まる高さを計算
    const containerHeight = isCompact ? 'h-12' : 'h-20';
    
    // ダークモードに基づいて動的に背景色とテキスト色を設定
    const bgColor = isDarkMode ? '#1F2937' : '#F9FAFB';
    const textColor = isDarkMode ? '#FFFFFF' : '#111827';

    return (
      <div className="space-y-2">
        <div
          className={`w-full flex items-center justify-center rounded-md overflow-hidden relative ${containerHeight} border border-gray-200 dark:border-gray-700`}
          style={{
            backgroundColor: bgColor
          }}
        >
          <span 
            className="truncate px-2 text-center"
            style={{
              fontFamily: `"${typographyValue.fontFamily}", sans-serif`,
              fontSize: `${displayFontSize}px`,
              fontWeight: typographyValue.fontWeight,
              lineHeight: typographyValue.lineHeight || 'normal',
              letterSpacing: typographyValue.letterSpacing ? `${typographyValue.letterSpacing}px` : 'normal',
              color: textColor,
              textTransform: typographyValue.textTransform as any
            }}
          >
            {sampleText}
          </span>
          <div className="absolute bottom-1 right-1 text-xs bg-blue-500/90 text-white px-1 py-0.5 rounded">
            {fontSizeValue}px
          </div>
        </div>
        {!isCompact && (
          <div className="space-y-1 text-xs mt-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Font</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium truncate">{typographyValue.fontFamily}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Size</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">{fontSizeValue}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weight</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">{typographyValue.fontWeight}</span>
            </div>
            {typographyValue.lineHeight && (
              <div className="flex justify-between">
                <span className="text-gray-400">Line Height</span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">{typographyValue.lineHeight}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Spacing tokens
  if (token.type === 'spacing') {
    const spacingValue = typeof token.value === 'string' ? parseInt(token.value) : (token.value as number);
    const displayValue = typeof token.value === 'string' ? token.value : `${token.value}px`;
    const maxWidth = isCompact ? 80 : 120;
    const actualWidth = Math.min(spacingValue, maxWidth);
    
    return (
      <div className="space-y-2">
        <div className={`w-full flex items-center justify-center rounded-md ${isCompact ? 'h-12' : 'h-16'} bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <div 
              className="bg-blue-200 dark:bg-blue-800 h-2 rounded"
              style={{ width: `${actualWidth}px` }}
            ></div>
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          </div>
        </div>
        {!isCompact && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            {displayValue}
          </div>
        )}
      </div>
    );
  }

  // Size tokens
  if (token.type === 'size') {
    const sizeValue = typeof token.value === 'string' ? parseInt(token.value) : (token.value as number);
    const displayValue = typeof token.value === 'string' ? token.value : `${token.value}px`;
    const containerSize = isCompact ? 48 : 80;
    const actualSize = Math.min(sizeValue, containerSize);
    
    return (
      <div className="space-y-2">
        <div className={`w-full flex items-center justify-center rounded-md ${isCompact ? 'h-12' : 'h-20'} bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
          <div 
            className="bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${actualSize}px`, height: `${actualSize}px` }}
          >
            {actualSize < 20 ? '' : 'Size'}
          </div>
        </div>
        {!isCompact && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            {displayValue}
          </div>
        )}
      </div>
    );
  }

  // Opacity tokens
  if (token.type === 'opacity') {
    const opacityValue = typeof token.value === 'string' ? parseFloat(token.value) : (token.value as number);
    const displayValue = `${Math.round(opacityValue * 100)}%`;
    
    return (
      <div className="space-y-2">
        <div className={`w-full flex items-center justify-center rounded-md ${isCompact ? 'h-12' : 'h-16'} bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative overflow-hidden`}>
          {/* チェッカーボード背景 */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
          }}></div>
          {/* 透明度を適用したレイヤー */}
          <div 
            className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm"
            style={{ opacity: opacityValue }}
          >
            {displayValue}
          </div>
        </div>
        {!isCompact && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            {opacityValue.toFixed(2)}
          </div>
        )}
      </div>
    );
  }

  // BorderRadius tokens
  if (token.type === 'borderRadius') {
    const radiusValue = typeof token.value === 'string' ? token.value : `${token.value}px`;
    const numericValue = typeof token.value === 'string' ? parseInt(token.value) : (token.value as number);
    const displayRadius = Math.min(numericValue === 9999 ? 50 : numericValue, 32); // Cap at 32px for display
    
    return (
      <div className="space-y-2">
        <div className={`w-full flex items-center justify-center rounded-md ${isCompact ? 'h-12' : 'h-16'} bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
          <div 
            className="bg-blue-500 flex items-center justify-center text-white font-medium text-xs w-16 h-10"
            style={{ borderRadius: `${displayRadius}px` }}
          >
            {numericValue === 9999 ? '◯' : displayRadius < 8 ? '' : 'Radius'}
          </div>
        </div>
        {!isCompact && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            {radiusValue}
          </div>
        )}
      </div>
    );
  }

  // Fallback for other token types
  return (
    <div className={`w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md ${isCompact ? 'h-12' : 'h-20'} border border-gray-200 dark:border-gray-700`}>
      <span className="text-sm text-gray-400 text-center px-2">
        {typeof token.value === 'object'
          ? JSON.stringify(token.value, null, 2)
          : String(token.value)
        }
      </span>
    </div>
  );
}

function removeCommonPrefix(path: string[]): string[] {
  // If all tokens have the same prefix (e.g., 'palette'), remove it
  if (path[0] === 'palette') {
    return path.slice(1);
  }
  return path;
}
