// 'ColorToken' と 'processTokenGroup' は未使用のため削除
import {
  DesignToken,
  TokenData,
  TokenSet,
  TypographyToken,
  ColorVariations,
  TokenGroup,
} from "../types";

export function convertToStandardFormat(data: TokenData): TokenSet {
  const standardFormat: TokenSet = {};

  // Convert array-based colors to standard format
  if (Array.isArray(data.colors)) {
    data.colors.forEach((color) => {
      standardFormat[color.name] = {
        $type: "color",
        $value: color.value,
        $description: color.role,
      };
    });
  }

  // Convert variations to standard format
  if (data.variations) {
    Object.entries(data.variations).forEach(([name, variations]) => {
      Object.entries(variations).forEach(([shade, value]) => {
        standardFormat[`${name}/${shade}`] = {
          $type: "color",
          $value: value,
          $description: `${name} ${shade}`,
        };
      });
    });
  }

  return standardFormat;
}

export function isArrayFormat(data: unknown): boolean {
  return (
    data !== null &&
    typeof data === "object" &&
    "colors" in data &&
    Array.isArray((data as TokenData).colors)
  );
}

// ネストされたTokenSetをフラットなTokenSetに変換する関数を追加
export function flattenTokenSet(
  data: TokenSet,
  parentPath: string[] = []
): TokenSet {
  let result: TokenSet = {};

  Object.entries(data).forEach(([key, value]) => {
    const currentPath = [...parentPath, key];

    if ("$type" in value) {
      // DesignTokenの場合はパスをスラッシュ区切りにしてセット
      result[currentPath.join("/")] = value;
    } else {
      // TokenGroupの場合は再帰的に処理
      const nested = flattenTokenSet(value as TokenGroup, currentPath);
      result = { ...result, ...nested };
    }
  });

  return result;
}

// convertToArrayFormatを修正し、flattenTokenSetを使うように変更
export function convertToArrayFormat(data: TokenSet): TokenData {
  const flatData = flattenTokenSet(data);

  const arrayFormat: TokenData = {
    colors: [],
    variations: {} as ColorVariations,
    typography: [],
  };

  Object.entries(flatData).forEach(([path, tokenOrGroup]) => {
    const token = tokenOrGroup as DesignToken;

    if (token.$type === "color") {
      const pathParts = path.split("/");

      if (pathParts.length === 1) {
        arrayFormat.colors.push({
          name: pathParts[0],
          value: token.$value as string,
          role: token.$description,
        });
      } else if (pathParts.length >= 2) {
        const colorName = pathParts[0];
        const shade = pathParts[pathParts.length - 1];

        if (!arrayFormat.variations[colorName]) {
          // ColorVariationの初期値を設定して型エラーを防ぐ
          arrayFormat.variations[colorName] = {
            main: "",
            dark: "",
            light: "",
            lighter: "",
          };
        }

        if (typeof token.$value === "string") {
          // ネストされたshade名を反映するために、再帰的にオブジェクトを作成する処理を追加
          const shadeParts = shade.split("/");
          let currentLevel: Record<string, unknown> =
            arrayFormat.variations[colorName];

          for (let i = 0; i < shadeParts.length - 1; i++) {
            const part = shadeParts[i];
            if (!currentLevel[part]) {
              currentLevel[part] = {};
            }
            currentLevel = currentLevel[part] as Record<string, unknown>;
          }

          currentLevel[shadeParts[shadeParts.length - 1]] = token.$value;
        }
      }
    } else if (token.$type === "typography") {
      const pathParts = path.split("/");
      const name = pathParts.join("-");

      const typographyValue =
        typeof token.$value === "object"
          ? (token.$value as Record<string, unknown>)
          : {};

      arrayFormat.typography.push({
        name,
        ...typographyValue,
        description: token.$description,
      } as TypographyToken);
    }
  });

  return arrayFormat;
}
