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
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
  if (token.type === 'color') {
    const color = token.value as string;
    const contrastWithWhite = calculateContrastRatio(color, '#FFFFFF');
    const contrastWithBlack = calculateContrastRatio(color, '#000000');
    const isLight = isLightColor(color);
    const textColor = isLight ? '#000000' : '#FFFFFF';
    const variant = token.path[token.path.length - 1];
    const isLightVariant = variant === 'light' || variant === 'lighter';

    return (
      <div className="space-y-2">
        <div
          className={`relative rounded-md overflow-hidden ${isCompact ? 'h-12' : 'h-24'}`}
          style={{ backgroundColor: color }}
        >
          {!isCompact && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ color: isLightVariant ? '#000000' : '#FFFFFF' }} className="text-2xl font-medium">
                  Aa
                </span>
              </div>
              <div className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">
                {Math.round(Math.max(contrastWithWhite, contrastWithBlack) * 10) / 10}:1
              </div>
            </>
          )}
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
    // サンプルテキスト選択のバリエーションを増やす
    const sampleTexts = {
      short: 'Aa',
      pangram: 'The quick brown fox jumps over the lazy dog',
      alphabet: 'AaBbCcDdEeFfGg',
      japanese: 'こんにちは世界'
    };

    // 選択できるサンプルテキスト（Compact時は短いものを使用）
    const sampleText = isCompact ? sampleTexts.short : sampleTexts.alphabet;

    // フォントサイズに応じてコンテナの高さを動的に調整
    const fontSizeRaw = typographyValue.fontSize;
    const fontSizeValue = typeof fontSizeRaw === 'number' ? fontSizeRaw : parseInt(fontSizeRaw || '16', 10);
    const containerHeight = isCompact ? 'h-12' : `min-h-[${Math.min(Math.max(fontSizeValue * 2, 20), 48)}px]`;

    return (
      <div className="space-y-2">
        <div
          className={`w-full flex items-center justify-center bg-gray-50 dark:text-white  dark:bg-gray-900 rounded-md overflow-hidden relative ${containerHeight}`}
          style={{
            fontFamily: `"${typographyValue.fontFamily}", sans-serif`,
            fontSize: `${fontSizeValue}px`,
            fontWeight: typographyValue.fontWeight,
            lineHeight: typographyValue.lineHeight ? `${typographyValue.lineHeight}px` : 'normal',
            letterSpacing: typographyValue.letterSpacing ? `${typographyValue.letterSpacing}px` : 'normal',
          }}
        >
          <span>{sampleText}</span>
          <div className="absolute bottom-1 right-1 text-xs bg-blue-500/90 text-white dark:text-blue-300 px-1 py-0.5 rounded">
            {fontSizeValue}px
          </div>
        </div>
        {!isCompact && (
          <div className="space-y-1 text-xs mt-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Font</span>
              <span className="font-medium truncate">{typographyValue.fontFamily}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Size</span>
              <span className="font-medium">{fontSizeValue}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Weight</span>
              <span className="font-medium">{typographyValue.fontWeight}</span>
            </div>
            {typographyValue.lineHeight && (
              <div className="flex justify-between">
                <span className="text-gray-500">Line Height</span>
                <span className="font-medium">{typographyValue.lineHeight}px</span>
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
