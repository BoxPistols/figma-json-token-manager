import { TokenSet, DesignToken, FlattenedToken } from './src/types';

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-tokens') {
    await handleImportedTokens(msg.tokens);
  } else if (msg.type === 'apply-token') {
    await applyToken(msg.token);
  } else if (msg.type === 'create-variables') {
    await createVariableCollections(msg.tokens);
  } else if (msg.type === 'create-styles') {
    await createStyles(msg.tokens);
  } else if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};

async function handleImportedTokens(tokens: TokenSet) {
  try {
    // まずVariable Collectionsを作成（推奨）
    await createVariableCollections(tokens);

    // 次にStylesを作成（互換性のため）
    await createStyles(tokens);

    figma.notify('Tokens imported successfully as Variables and Styles');
  } catch (error) {
    console.error('Error importing tokens:', error);
    figma.notify('Error importing tokens', { error: true });
  }
}

async function createVariableCollections(tokens: TokenSet) {
  try {
    // Color Variables
    const colorCollection = figma.variables.createVariableCollection(
      'Design Tokens - Colors'
    );
    const colorMode = colorCollection.addMode('Default');

    // Spacing Variables
    const spacingCollection = figma.variables.createVariableCollection(
      'Design Tokens - Spacing'
    );
    const spacingMode = spacingCollection.addMode('Default');

    // Size Variables
    const sizeCollection = figma.variables.createVariableCollection(
      'Design Tokens - Sizes'
    );
    const sizeMode = sizeCollection.addMode('Default');

    // Opacity Variables
    const opacityCollection = figma.variables.createVariableCollection(
      'Design Tokens - Opacity'
    );
    const opacityMode = opacityCollection.addMode('Default');

    // Border Radius Variables
    const borderRadiusCollection = figma.variables.createVariableCollection(
      'Design Tokens - Border Radius'
    );
    const borderRadiusMode = borderRadiusCollection.addMode('Default');

    await processTokenGroupForVariables(tokens, '', {
      colorCollection,
      colorMode,
      spacingCollection,
      spacingMode,
      sizeCollection,
      sizeMode,
      opacityCollection,
      opacityMode,
      borderRadiusCollection,
      borderRadiusMode,
    });

    figma.notify('Variable Collections created successfully');
  } catch (error) {
    console.error('Error creating variables:', error);
    figma.notify('Error creating variables', { error: true });
  }
}

async function processTokenGroupForVariables(
  group: TokenSet,
  prefix: string,
  collections: Record<string, unknown>
) {
  for (const [key, value] of Object.entries(group)) {
    const fullKey = prefix ? `${prefix}/${key}` : key;

    if ('$type' in value && '$value' in value) {
      await processTokenForVariables(
        fullKey,
        value as DesignToken,
        collections
      );
    } else {
      await processTokenGroupForVariables(
        value as TokenSet,
        fullKey,
        collections
      );
    }
  }
}

async function processTokenForVariables(
  name: string,
  token: DesignToken,
  collections: Record<string, unknown>
) {
  const { $type, $value } = token;

  try {
    switch ($type) {
      case 'color': {
        const color = hexToRgb($value as string);
        if (color) {
          const variable = figma.variables.createVariable(
            name,
            collections.colorCollection,
            'COLOR'
          );
          variable.setValueForMode(collections.colorMode, color);
        }
        break;
      }

      case 'spacing': {
        const spacingValue = parseFloat(String($value));
        if (!isNaN(spacingValue)) {
          const variable = figma.variables.createVariable(
            name,
            collections.spacingCollection,
            'FLOAT'
          );
          variable.setValueForMode(collections.spacingMode, spacingValue);
        }
        break;
      }

      case 'size': {
        const sizeValue = parseFloat(String($value));
        if (!isNaN(sizeValue)) {
          const variable = figma.variables.createVariable(
            name,
            collections.sizeCollection,
            'FLOAT'
          );
          variable.setValueForMode(collections.sizeMode, sizeValue);
        }
        break;
      }

      case 'opacity': {
        const opacityValue = parseFloat(String($value));
        if (!isNaN(opacityValue)) {
          // 0-100の値を0-1に正規化
          const normalizedValue = Math.max(0, Math.min(1, opacityValue / 100));
          const variable = figma.variables.createVariable(
            name,
            collections.opacityCollection,
            'FLOAT'
          );
          variable.setValueForMode(collections.opacityMode, normalizedValue);
        }
        break;
      }

      case 'borderRadius': {
        const borderRadiusValue = parseFloat(String($value));
        if (!isNaN(borderRadiusValue)) {
          const variable = figma.variables.createVariable(
            name,
            collections.borderRadiusCollection,
            'FLOAT'
          );
          variable.setValueForMode(
            collections.borderRadiusMode,
            borderRadiusValue
          );
        }
        break;
      }
    }
  } catch (error) {
    console.error(`Error creating variable for ${name}:`, error);
  }
}

async function createStyles(tokens: TokenSet) {
  try {
    await processTokenGroupForStyles(tokens, '');
    figma.notify('Styles created successfully');
  } catch (error) {
    console.error('Error creating styles:', error);
    figma.notify('Error creating styles', { error: true });
  }
}

async function processTokenGroupForStyles(group: TokenSet, prefix: string) {
  for (const [key, value] of Object.entries(group)) {
    const fullKey = prefix ? `${prefix}/${key}` : key;

    if ('$type' in value && '$value' in value) {
      await processTokenForStyles(fullKey, value as DesignToken);
    } else {
      await processTokenGroupForStyles(value as TokenSet, fullKey);
    }
  }
}

async function processTokenForStyles(name: string, token: DesignToken) {
  const { $type, $value } = token;

  try {
    switch ($type) {
      case 'color': {
        const color = hexToRgb($value as string);
        if (color) {
          const style = figma.createPaintStyle();
          style.name = name;
          style.paints = [
            {
              type: 'SOLID',
              color: color,
            },
          ];
        }
        break;
      }

      case 'typography': {
        if (typeof $value === 'object' && $value !== null) {
          const typoValue = $value as Record<string, unknown>;
          const textStyle = figma.createTextStyle();
          textStyle.name = name;

          if (typoValue.fontSize) {
            textStyle.fontSize = Number(typoValue.fontSize);
          }

          if (typoValue.lineHeight) {
            const lineHeight = typoValue.lineHeight;
            if (typeof lineHeight === 'number') {
              textStyle.lineHeight = { value: lineHeight, unit: 'PIXELS' };
            } else if (typeof lineHeight === 'string') {
              const numericValue = parseFloat(lineHeight);
              if (!isNaN(numericValue)) {
                textStyle.lineHeight = { value: numericValue, unit: 'PIXELS' };
              }
            }
          }

          if (typoValue.letterSpacing) {
            textStyle.letterSpacing = {
              value: Number(typoValue.letterSpacing),
              unit: 'PIXELS',
            };
          }
        }
        break;
      }

      case 'effect': {
        if (typeof $value === 'object' && $value !== null) {
          const effectValue = $value as Record<string, unknown>;
          const effectStyle = figma.createEffectStyle();
          effectStyle.name = name;

          if (
            effectValue.type === 'dropShadow' ||
            effectValue.type === 'innerShadow'
          ) {
            effectStyle.effects = [
              {
                type:
                  effectValue.type === 'dropShadow'
                    ? 'DROP_SHADOW'
                    : 'INNER_SHADOW',
                color: hexToRgb(effectValue.color as string) || {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 0.25,
                },
                offset: {
                  x: Number(effectValue.offsetX) || 0,
                  y: Number(effectValue.offsetY) || 0,
                },
                radius: Number(effectValue.radius) || 4,
                visible: effectValue.visible !== false,
                spread: Number(effectValue.spread) || 0,
              },
            ];
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error(`Error creating style for ${name}:`, error);
  }
}

async function applyToken(token: FlattenedToken) {
  if (!figma.currentPage.selection.length) {
    figma.notify('Please select at least one layer');
    return;
  }

  try {
    if (token.type === 'color') {
      const color = hexToRgb(token.value as string);
      if (!color) return;

      for (const node of figma.currentPage.selection) {
        if ('fills' in node) {
          node.fills = [
            {
              type: 'SOLID',
              color: color,
            },
          ];
        }
      }
    } else if (token.type === 'spacing' || token.type === 'size') {
      const value = parseFloat(String(token.value));
      if (isNaN(value)) return;

      for (const node of figma.currentPage.selection) {
        if (token.type === 'spacing') {
          if ('itemSpacing' in node) {
            node.itemSpacing = value;
          }
          if ('paddingLeft' in node) {
            node.paddingLeft = value;
            node.paddingRight = value;
            node.paddingTop = value;
            node.paddingBottom = value;
          }
        } else if (token.type === 'size') {
          if ('resize' in node) {
            node.resize(value, value);
          }
        }
      }
    }

    figma.notify(
      `Applied ${token.path.join('.')} to ${figma.currentPage.selection.length} layers`
    );
  } catch (error) {
    console.error('Error applying token:', error);
    figma.notify('Error applying token', { error: true });
  }
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}
