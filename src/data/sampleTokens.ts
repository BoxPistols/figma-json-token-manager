import type { TokenSet } from '../types';

/**
 * W3C DTCG specification sample tokens
 * Can be cleared and re-imported at any time
 */
export const sampleTokens: TokenSet = {
  color: {
    $type: 'color',
    $description: 'Color palette for the design system',
    brand: {
      primary: {
        $value: '#2164D1',
        $description: 'Primary brand color',
      },
      secondary: {
        $value: '#6B4EE6',
        $description: 'Secondary brand color',
      },
      accent: {
        $value: '#E64980',
        $description: 'Accent color for highlights',
      },
    },
    semantic: {
      background: {
        $value: '#FFFFFF',
        $description: 'Main background color',
      },
      surface: {
        $value: '#F8FAFC',
        $description: 'Surface/card background',
      },
      text: {
        primary: {
          $value: '#0F172A',
          $description: 'Primary text color',
        },
        secondary: {
          $value: '#64748B',
          $description: 'Secondary text color',
        },
      },
      border: {
        $value: '#E2E8F0',
        $description: 'Default border color',
      },
    },
    feedback: {
      success: {
        $value: '#16A34A',
        $description: 'Success state color',
      },
      warning: {
        $value: '#CA8A04',
        $description: 'Warning state color',
      },
      error: {
        $value: '#DC2626',
        $description: 'Error state color',
      },
    },
  },
  dimension: {
    $type: 'dimension',
    spacing: {
      xs: { $value: '4px', $description: 'Extra small spacing' },
      sm: { $value: '8px', $description: 'Small spacing' },
      md: { $value: '16px', $description: 'Medium spacing' },
      lg: { $value: '24px', $description: 'Large spacing' },
      xl: { $value: '32px', $description: 'Extra large spacing' },
    },
    radius: {
      sm: { $value: '4px', $description: 'Small border radius' },
      md: { $value: '8px', $description: 'Medium border radius' },
      lg: { $value: '12px', $description: 'Large border radius' },
      full: { $value: '9999px', $description: 'Full/pill border radius' },
    },
  },
  typography: {
    $type: 'typography',
    $description: 'Typography tokens for text styling',
    heading: {
      $value: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      $description: 'Heading typography',
    },
    body: {
      $value: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      $description: 'Body text typography',
    },
    caption: {
      $value: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: 1.4,
      },
      $description: 'Caption/small text typography',
    },
  },
  opacity: {
    $type: 'opacity',
    disabled: { $value: 0.5, $description: 'Disabled state opacity' },
    hover: { $value: 0.8, $description: 'Hover state opacity' },
  },
  shadow: {
    $type: 'shadow',
    sm: {
      $value: {
        offsetX: 0,
        offsetY: 1,
        blur: 2,
        color: '#0000001A',
      },
      $description: 'Small shadow',
    },
    md: {
      $value: {
        offsetX: 0,
        offsetY: 4,
        blur: 6,
        color: '#0000001F',
      },
      $description: 'Medium shadow',
    },
    lg: {
      $value: {
        offsetX: 0,
        offsetY: 10,
        blur: 15,
        color: '#00000026',
      },
      $description: 'Large shadow',
    },
  },
};
