import { useState, useEffect } from 'react';
import { TokenData, FlattenedToken, Token, ImportError } from '../types';
import {
  flattenTokens,
  validateToken,
  groupTokensByType,
  saveTokensToStorage,
  clearTokensFromStorage,
} from '../utils/tokenUtils';
import { initialMockData } from '../data/initialMockData';

export function useTokenManagement(
  tokens: TokenData,
  setTokens: (tokens: TokenData) => void,
  setShowExampleData: (show: boolean) => void,
  setError: (error: ImportError | null) => void,
  setSelectedToken: (token: FlattenedToken | null) => void
) {
  const [flattenedTokens, setFlattenedTokens] = useState<FlattenedToken[]>([]);
  const [groupedTokens, setGroupedTokens] = useState<
    Record<string, FlattenedToken[]>
  >({});

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

  // Flatten and group tokens
  useEffect(() => {
    try {
      const result = flattenTokens(tokens);
      setFlattenedTokens(result);
      setGroupedTokens(groupTokensByType(result));
    } catch (err) {
      console.error('flattenTokens error:', err);
      setFlattenedTokens([]);
      setGroupedTokens({});
    }
  }, [tokens]);

  // Font family loading effect
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
    // インポート後に即座保存
    setTimeout(() => saveTokensToStorage(data), 0);
  };

  const handleReset = () => {
    setTokens({});
    clearTokensFromStorage();
    setSelectedToken(null);
    setError(null);
    setShowExampleData(false);
  };

  const handleLoadExample = () => {
    // localStorageをクリアして最新のw3cSampleTokensを確実にロード
    clearTokensFromStorage();
    setTokens(initialMockData);
    setShowExampleData(true);
    setSelectedToken(null);
    setError(null);
    // W3C形式のサンプルデータを保存
    setTimeout(() => saveTokensToStorage(initialMockData), 0);
  };

  const handleForceRefresh = () => {
    // 全データをクリアして完全にリセット
    clearTokensFromStorage();
    window.location.reload();
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
    setTokens((currentTokens) => {
      const updatedTokens = { ...currentTokens };

      // トークンタイプに応じて適切な配列から削除
      const actualTokenType = getTokenArrayKey(tokenToDelete.type);

      if (Array.isArray(updatedTokens[actualTokenType])) {
        const tokenArray = [...updatedTokens[actualTokenType]] as Token[];
        updatedTokens[actualTokenType] = tokenArray.filter(
          (t) => t.name !== tokenToDelete.path.join('/')
        );
      }

      return updatedTokens;
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

  return {
    // State
    flattenedTokens,
    groupedTokens,
    // Actions
    handleFileUpload,
    handlePasteImport,
    handleReset,
    handleLoadExample,
    handleForceRefresh,
    handleClearExample,
    handleTokenUpdate,
    handleTokenDelete,
    handleTokenCreate,
    getTokenArrayKey,
  };
}
