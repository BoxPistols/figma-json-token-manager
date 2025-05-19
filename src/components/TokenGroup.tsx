import { useState, useEffect } from 'react';
import { FlattenedToken } from '../types';
import { calculateContrastRatio, isLightColor } from '../utils/colorUtils';

interface TokenGroupProps {
  name: string;
  tokens: FlattenedToken[];
  onTokenSelect: (token: FlattenedToken) => void;
  selectedToken?: FlattenedToken | null;
  isCompactMode?: boolean;
}

export function TokenGroup({ name, tokens, onTokenSelect, selectedToken, isCompactMode = false }: TokenGroupProps) {
  // Group tokens by their parent path
  const groupedTokens = tokens.reduce((acc, token) => {
    const pathWithoutCommonPrefix = removeCommonPrefix(token.path);
    const parentPath = pathWithoutCommonPrefix.slice(0, -1).join('/');
    if (!acc[parentPath]) {
      acc[parentPath] = [];
    }
    acc[parentPath].push(token);
    return acc;
  }, {} as Record<string, FlattenedToken[]>);

  // Sort tokens within each group
  Object.values(groupedTokens).forEach(group => {
    group.sort((a, b) => {
      if (a.path[a.path.length - 1] === 'contrastText') return 1;
      if (b.path[a.path.length - 1] === 'contrastText') return -1;

      const variants = ['main', 'dark', 'light', 'lighter'];
      const aVariant = a.path[a.path.length - 1];
      const bVariant = b.path[b.path.length - 1];

      const aIndex = variants.indexOf(aVariant);
      const bIndex = variants.indexOf(bVariant);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      return a.path[a.path.length - 1].localeCompare(b.path[b.path.length - 1]);
    });
  });

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {name.charAt(0).toUpperCase() + name.slice(1)}
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          ({tokens.length})
        </span>
      </h3>

      <div className="space-y-6">
        {Object.entries(groupedTokens).map(([parentPath, groupTokens]) => (
          <div key={parentPath} className="space-y-2">
            {parentPath && (
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                {parentPath}
              </h4>
            )}
            <div className={`grid gap-4 ${isCompactMode ? 'grid-cols-2 md:grid-cols-6' : 'grid-cols-1 md:grid-cols-4'}`}>
              {groupTokens.map((token, index) => (
                <div
                  key={`${token.path.join('-')}-${index}`}
                  onClick={() => onTokenSelect(token)}
                  className={`
                    cursor-pointer rounded-lg ${isCompactMode ? 'p-2' : 'p-4'} transition-all
                    ${selectedToken?.path.join('/') === token.path.join('/')
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                      : 'bg-white dark:bg-gray-800 hover:shadow-md border border-gray-200 dark:border-gray-700'
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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

    // ③ サンプル「Aa」の色 - バリアント名に基づく（こちらは既存の挙動を維持）
    const textColorForSample = isLightVariant ? '#000000' : '#FFFFFF';

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
          <div className={`absolute bottom-1 right-1 text-xs ${isCompact ? 'bg-black/80 text-white px-1 py-0' : 'bg-black/70 dark:bg-white/70 text-white dark:text-black px-1.5 py-0.5'} rounded`}>
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
    const sampleTexts = {
      short: 'Aa',
      pangram: 'The quick brown fox jumps over the lazy dog',
      alphabet: 'AaBbCcDdEeFfGg',
      japanese: 'こんにちは世界'
    };

    const sampleText = isCompact ? sampleTexts.short : sampleTexts.alphabet;
    const fontSizeRaw = typographyValue.fontSize;
    const fontSizeValue = typeof fontSizeRaw === 'number' ? fontSizeRaw : parseInt(fontSizeRaw || '16', 10);
    const containerHeight = isCompact ? 'h-12' : `min-h-[${Math.min(Math.max(fontSizeValue * 2, 20), 48)}px]`;

    // ダークモードに基づいて動的に背景色とテキスト色を設定
    const bgColor = isDarkMode ? '#1E1E1E' : '#F9FAFB'; // dark:bg-gray-900 : bg-gray-50
    const textColor = isDarkMode ? '#FFFFFF' : '#111827'; // dark:text-white : text-gray-900

    return (
      <div className="space-y-2">
        <div
          className={`w-full flex items-center justify-center rounded-md overflow-hidden relative ${containerHeight}`}
          style={{
            fontFamily: `"${typographyValue.fontFamily}", sans-serif`,
            fontSize: `${fontSizeValue}px`,
            fontWeight: typographyValue.fontWeight,
            lineHeight: typographyValue.lineHeight ? `${typographyValue.lineHeight}px` : 'normal',
            letterSpacing: typographyValue.letterSpacing ? `${typographyValue.letterSpacing}px` : 'normal',
            backgroundColor: bgColor,
            color: textColor
          }}
        >
          <span>{sampleText}</span>
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
                <span className="text-gray-600 dark:text-gray-300 font-medium">{typographyValue.lineHeight}px</span>
              </div>
            )}
            {/* {typographyValue.letterSpacing && (
              <div className="flex justify-between">
                <span className="text-gray-500">Letter Spacing</span>
                <span className="font-medium">{typographyValue.letterSpacing}px</span>
              </div>
            )} */}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md ${isCompact ? 'h-12' : 'h-20'}`}>
      <span className="text-sm text-gray-400">
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
