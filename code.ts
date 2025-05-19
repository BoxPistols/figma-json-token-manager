import { TokenSet, DesignToken, FlattenedToken } from './src/types';

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-tokens') {
    await handleImportedTokens(msg.tokens);
  } else if (msg.type === 'apply-token') {
    await applyToken(msg.token);
  } else if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};

async function handleImportedTokens(tokens: TokenSet) {
  try {
    for (const [key, value] of Object.entries(tokens)) {
      if ('$type' in value && '$value' in value) {
        await processToken(key, value as DesignToken);
      } else {
        await processTokenGroup(key, value as TokenSet);
      }
    }
    figma.notify('Tokens imported successfully');
  } catch (error) {
    console.error('Error importing tokens:', error);
    figma.notify('Error importing tokens', { error: true });
  }
}

async function processTokenGroup(prefix: string, group: TokenSet) {
  for (const [key, value] of Object.entries(group)) {
    const fullKey = `${prefix}/${key}`;
    if ('$type' in value && '$value' in value) {
      await processToken(fullKey, value as DesignToken);
    } else {
      await processTokenGroup(fullKey, value as TokenSet);
    }
  }
}

async function processToken(name: string, token: DesignToken) {
  if (token.$type === 'color') {
    const style = figma.createPaintStyle();
    style.name = name;
    const color = hexToRgb(token.$value as string);
    if (color) {
      style.paints = [{
        type: 'SOLID',
        color: {
          r: color.r / 255,
          g: color.g / 255,
          b: color.b / 255
        }
      }];
    }
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
          node.fills = [{
            type: 'SOLID',
            color: {
              r: color.r / 255,
              g: color.g / 255,
              b: color.b / 255
            }
          }];
        }
      }
    }
    
    figma.notify(`Applied ${token.path.join('.')} to ${figma.currentPage.selection.length} layers`);
  } catch (error) {
    console.error('Error applying token:', error);
    figma.notify('Error applying token', { error: true });
  }
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}