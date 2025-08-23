// Figma Design Tokens Manager compatible W3C format sample data
// This format is compatible with the "Design Tokens Manager" Figma plugin

export const w3cSampleTokens = {
  // Typography tokens following Figma Design Tokens Manager format
  figma: {
    display: {
      medium: {
        $type: 'typography',
        $description: 'figma用の見出し',
        $value: {
          fontFamily: 'Inter',
          fontSize: '48px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      large: {
        $type: 'typography',
        $description: 'figma用の見出し',
        $value: {
          fontFamily: 'Inter',
          fontSize: '72px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
    },
    header: {
      'head-1': {
        $type: 'typography',
        $description: 'figma用の見出し',
        $value: {
          fontFamily: 'Inter',
          fontSize: '48px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      'head-2': {
        $type: 'typography',
        $description: 'figma用の見出し',
        $value: {
          fontFamily: 'Inter',
          fontSize: '32px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      'head-3': {
        $type: 'typography',
        $description: 'figma用の見出し',
        $value: {
          fontFamily: 'Inter',
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      'head-4': {
        $type: 'typography',
        $description: 'figma用の見出し',
        $value: {
          fontFamily: 'Inter',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      'head-5': {
        $type: 'typography',
        $description: 'figma用の見出し',
        $value: {
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
    },
    body: {
      small: {
        $type: 'typography',
        $description: 'figma用の本文',
        $value: {
          fontFamily: 'Inter',
          fontSize: '12px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      normal: {
        $type: 'typography',
        $description: 'figma用の本文',
        $value: {
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      large: {
        $type: 'typography',
        $description: 'figma用の本文',
        $value: {
          fontFamily: 'Inter',
          fontSize: '20px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: 'normal',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
    },
  },

  typography: {
    body1: {
      $type: 'typography',
      $value: {
        fontFamily: 'Noto Sans JP',
        fontSize: '14px',
        fontWeight: 400,
        letterSpacing: '0%',
        lineHeight: '160%',
        textTransform: 'none',
        textDecoration: 'none',
      },
    },
    body2: {
      $type: 'typography',
      $value: {
        fontFamily: 'Noto Sans JP',
        fontSize: '13px',
        fontWeight: 400,
        letterSpacing: '0%',
        lineHeight: '160%',
        textTransform: 'none',
        textDecoration: 'none',
      },
    },
    subtitle1: {
      $type: 'typography',
      $value: {
        fontFamily: 'Noto Sans JP',
        fontSize: '13px',
        fontWeight: 400,
        letterSpacing: '0%',
        lineHeight: '140%',
        textTransform: 'none',
        textDecoration: 'none',
      },
    },
    subtitle2: {
      $type: 'typography',
      $value: {
        fontFamily: 'Noto Sans JP',
        fontSize: '12px',
        fontWeight: 400,
        letterSpacing: '0%',
        lineHeight: '140%',
        textTransform: 'none',
        textDecoration: 'none',
      },
    },
    caption: {
      $type: 'typography',
      $value: {
        fontFamily: 'Noto Sans JP',
        fontSize: '12px',
        fontWeight: 400,
        letterSpacing: '0%',
        lineHeight: '140%',
        textTransform: 'none',
        textDecoration: 'none',
      },
    },
    overline: {
      $type: 'typography',
      $value: {
        fontFamily: 'Noto Sans JP',
        fontSize: '11px',
        fontWeight: 400,
        letterSpacing: '0%',
        lineHeight: '140%',
        textTransform: 'none',
        textDecoration: 'none',
      },
    },
    heading: {
      h1: {
        $type: 'typography',
        $description:
          "見出し / h1以外は variant='h(x)'で見出しデザインを持ったdivとなるため、マークアップ構造自体は気にしなくて良い仕組みです。\n見出しは全て太字になります",
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '22px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      h2: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      h3: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      h4: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      h5: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      h6: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
    },
    variant: {
      xxl: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '22px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      xl: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      lg: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      ml: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '16px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      md: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '14px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      sm: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '13px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      xs: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '12px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      xxs: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      xxxs: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '10px',
          fontWeight: 400,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      displayLarge: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '32px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      displayMedium: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
      displaySmall: {
        $type: 'typography',
        $value: {
          fontFamily: 'Noto Sans JP',
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '0%',
          lineHeight: '140%',
          textTransform: 'none',
          textDecoration: 'none',
        },
      },
    },
  },

  // Color tokens
  colors: {
    light: {
      primary: {
        main: {
          $type: 'color',
          $value: '#2c1b9c',
        },
        dark: {
          $type: 'color',
          $value: '#11114a',
        },
        light: {
          $type: 'color',
          $value: '#5451d6',
        },
        lighter: {
          $type: 'color',
          $value: '#b5b4ee',
        },
        contrastText: {
          $type: 'color',
          $value: '#ffffff',
        },
      },
      secondary: {
        main: {
          $type: 'color',
          $value: '#696881',
        },
        dark: {
          $type: 'color',
          $value: '#424242',
        },
        light: {
          $type: 'color',
          $value: '#757575',
        },
        lighter: {
          $type: 'color',
          $value: '#fafafa',
        },
        contrastText: {
          $type: 'color',
          $value: '#ffffff',
        },
      },
      success: {
        main: {
          $type: 'color',
          $value: '#4caf50',
        },
        dark: {
          $type: 'color',
          $value: '#3f7f42',
        },
        light: {
          $type: 'color',
          $value: '#46ab4a',
        },
        lighter: {
          $type: 'color',
          $value: '#d4e9d4',
        },
        contrastText: {
          $type: 'color',
          $value: '#000000de',
        },
      },
      warning: {
        main: {
          $type: 'color',
          $value: '#eb8117',
        },
        dark: {
          $type: 'color',
          $value: '#ef6c00',
        },
        light: {
          $type: 'color',
          $value: '#dd9c3c',
        },
        lighter: {
          $type: 'color',
          $value: '#fff3e0',
        },
        contrastText: {
          $type: 'color',
          $value: '#000000de',
        },
      },
      error: {
        main: {
          $type: 'color',
          $value: '#da3737',
        },
        dark: {
          $type: 'color',
          $value: '#c63535',
        },
        light: {
          $type: 'color',
          $value: '#dc4e4e',
        },
        lighter: {
          $type: 'color',
          $value: '#ffebee',
        },
        contrastText: {
          $type: 'color',
          $value: '#ffffff',
        },
      },
      info: {
        main: {
          $type: 'color',
          $value: '#1dafc2',
        },
        dark: {
          $type: 'color',
          $value: '#277781',
        },
        light: {
          $type: 'color',
          $value: '#43bfcf',
        },
        lighter: {
          $type: 'color',
          $value: '#bde8ee',
        },
        contrastText: {
          $type: 'color',
          $value: '#000000de',
        },
      },
      text: {
        primary: {
          $type: 'color',
          $value: '#223354',
        },
        secondary: {
          $type: 'color',
          $value: '#4a515e',
        },
        disabled: {
          $type: 'color',
          $value: '#9e9e9e',
        },
      },
      background: {
        default: {
          $type: 'color',
          $value: '#ffffff',
        },
        paper: {
          $type: 'color',
          $value: '#ffffff',
        },
      },
      common: {
        black: {
          $type: 'color',
          $value: '#323538',
        },
        primary: {
          $type: 'color',
          $value: '#33383c',
        },
        white: {
          $type: 'color',
          $value: '#ffffff',
        },
      },
    },
    grey: {
      50: {
        $type: 'color',
        $value: '#fafafa',
      },
      100: {
        $type: 'color',
        $value: '#f5f5f5',
      },
      200: {
        $type: 'color',
        $value: '#eeeeee',
      },
      300: {
        $type: 'color',
        $value: '#e0e0e0',
      },
      400: {
        $type: 'color',
        $value: '#bdbdbd',
      },
      500: {
        $type: 'color',
        $value: '#9e9e9e',
      },
      600: {
        $type: 'color',
        $value: '#757575',
      },
      700: {
        $type: 'color',
        $value: '#4e4e4e',
      },
      800: {
        $type: 'color',
        $value: '#3a3a3a',
      },
      850: {
        $type: 'color',
        $value: '#323232',
      },
      900: {
        $type: 'color',
        $value: '#292929',
      },
    },
  },

  figma: {
    text: {
      primary: {
        $type: 'color',
        $value: '#33383c',
      },
      secondary: {
        $type: 'color',
        $value: '#4a535d',
      },
      white: {
        $type: 'color',
        $value: '#fafafa',
      },
    },
    primary: {
      $type: 'color',
      $value: '#8540df',
    },
    bg: {
      default: {
        $type: 'color',
        $value: '#ffffff',
      },
      paper: {
        $type: 'color',
        $value: '#ffffff',
      },
    },
  },
};
