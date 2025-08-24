export const w3cSampleTokens = {
  figma: {
    color: {
      primary: {
        main: {
          $type: 'color',
          $value: '#2164D1',
          $description: '主要アクションやブランディングに使用する色',
        },
        dark: {
          $type: 'color',
          $value: '#1E4B99',
          $description: 'ホバー状態やアクティブ状態で使用する濃い主要色',
        },
        light: {
          $type: 'color',
          $value: '#4B7FE8',
          $description: '軽い背景やアクセントに使用する薄い主要色',
        },
        lighter: {
          $type: 'color',
          $value: '#E8F1FE',
          $description: 'フォーカス状態やベース背景に使用する最も薄い主要色',
        },
      },
      secondary: {
        main: {
          $type: 'color',
          $value: '#495974',
          $description: 'キャンセルボタンや中性アクションに使用する色',
        },
        dark: {
          $type: 'color',
          $value: '#384557',
          $description: 'ホバー状態のキャンセルボタンに使用する濃いセカンダリ色',
        },
        light: {
          $type: 'color',
          $value: '#6B7A92',
          $description: '軽い背景の中性要素に使用する薄いセカンダリ色',
        },
        lighter: {
          $type: 'color',
          $value: '#E8EBF0',
          $description: '中性要素の背景に使用する最も薄いセカンダリ色',
        },
      },
      success: {
        main: {
          $type: 'color',
          $value: '#059669',
          $description: '成功メッセージや完了状態を表す色',
        },
        dark: {
          $type: 'color',
          $value: '#065F46',
          $description: 'ホバー状態や強調表示に使用する濃い成功色',
        },
        light: {
          $type: 'color',
          $value: '#10B981',
          $description: '軽い背景の成功要素に使用する薄い成功色',
        },
        lighter: {
          $type: 'color',
          $value: '#ECFDF5',
          $description: '成功要素の背景に使用する最も薄い成功色',
        },
      },
      warning: {
        main: {
          $type: 'color',
          $value: '#D97706',
          $description: '注意喚起や警告メッセージを表す色',
        },
        dark: {
          $type: 'color',
          $value: '#92400E',
          $description: 'ホバー状態や強調表示に使用する濃い警告色',
        },
        light: {
          $type: 'color',
          $value: '#F59E0B',
          $description: '軽い背景の警告要素に使用する薄い警告色',
        },
        lighter: {
          $type: 'color',
          $value: '#FEF3C7',
          $description: '警告要素の背景に使用する最も薄い警告色',
        },
      },
      error: {
        main: {
          $type: 'color',
          $value: '#DC2626',
          $description: 'エラーメッセージや危険な操作を表す色',
        },
        dark: {
          $type: 'color',
          $value: '#991B1B',
          $description: 'ホバー状態や強調表示に使用する濃いエラー色',
        },
        light: {
          $type: 'color',
          $value: '#F87171',
          $description: '軽い背景のエラー要素に使用する薄いエラー色',
        },
        lighter: {
          $type: 'color',
          $value: '#FEE2E2',
          $description: 'エラー要素の背景に使用する最も薄いエラー色',
        },
      },
      info: {
        main: {
          $type: 'color',
          $value: '#0EA5E9',
          $description: '情報提供やガイダンスを表す色',
        },
        dark: {
          $type: 'color',
          $value: '#0284C7',
          $description: 'ホバー状態や強調表示に使用する濃い情報色',
        },
        light: {
          $type: 'color',
          $value: '#38BDF8',
          $description: '軽い背景の情報要素に使用する薄い情報色',
        },
        lighter: {
          $type: 'color',
          $value: '#E0F2FE',
          $description: '情報要素の背景に使用する最も薄い情報色',
        },
      },
      grey: {
        '50': {
          $type: 'color',
          $value: '#F9FAFB',
          $description: '最も軽いページ背景やカード背景に使用',
        },
        '100': {
          $type: 'color',
          $value: '#F3F4F6',
          $description: 'セクション区切りや軽いコンテナ背景に使用',
        },
        '200': {
          $type: 'color',
          $value: '#E5E7EB',
          $description: '要素間の区切り線やボーダーに使用',
        },
        '300': {
          $type: 'color',
          $value: '#D1D5DB',
          $description: '軽いボーダーやディバイダーに使用',
        },
        '400': {
          $type: 'color',
          $value: '#9CA3AF',
          $description: '入力フィールドのヒントテキストに使用',
        },
        '500': {
          $type: 'color',
          $value: '#6B7280',
          $description: '補助的な情報やキャプションに使用',
        },
        '600': {
          $type: 'color',
          $value: '#4B5563',
          $description: '通常のテキストコンテンツに使用',
        },
        '700': {
          $type: 'color',
          $value: '#374151',
          $description: '見出しや重要なテキストに使用',
        },
        '800': {
          $type: 'color',
          $value: '#1F2937',
          $description: '主要見出しや強調テキストに使用',
        },
        '900': {
          $type: 'color',
          $value: '#111827',
          $description: '最も重要なテキストや大見出しに使用',
        },
      },
    },
    typography: {
      display: {
        large: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '64px',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -0.025,
          },
          $description: '大型ディスプレイタイトル',
        },
        medium: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -0.02,
          },
          $description: '中型ディスプレイタイトル',
        },
        small: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '36px',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: -0.015,
          },
          $description: '小型ディスプレイタイトル',
        },
      },
      heading: {
        h1: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: -0.01,
          },
          $description: 'メイン見出し H1',
        },
        h2: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '28px',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: -0.008,
          },
          $description: 'セクション見出し H2',
        },
        h3: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: 1.35,
            letterSpacing: -0.006,
          },
          $description: 'サブセクション見出し H3',
        },
        h4: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: -0.004,
          },
          $description: '小見出し H4',
        },
        h5: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 1.45,
          },
          $description: 'ミニ見出し H5',
        },
        h6: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: 1.5,
          },
          $description: '最小見出し H6',
        },
      },
      body: {
        large: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.6,
          },
          $description: '大きな本文テキスト',
        },
        medium: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: 1.5,
          },
          $description: '標準本文テキスト',
        },
        small: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.4,
          },
          $description: '小さな本文テキスト',
        },
      },
      label: {
        large: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: 1.4,
          },
          $description: '大きなラベル',
        },
        medium: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1.3,
          },
          $description: '標準ラベル',
        },
        small: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: 1.25,
          },
          $description: '小さなラベル',
        },
      },
      caption: {
        default: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: 1.3,
          },
          $description: 'キャプションテキスト',
        },
      },
      overline: {
        default: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '11px',
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          },
          $description: 'オーバーラインテキスト',
        },
      },
      button: {
        large: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: 1.25,
          },
          $description: '大きなボタンテキスト',
        },
        medium: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1.2,
          },
          $description: '標準ボタンテキスト',
        },
        small: {
          $type: 'typography',
          $value: {
            fontFamily: 'Inter',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1.15,
          },
          $description: '小さなボタンテキスト',
        },
      },
    },
    spacing: {
      '0': {
        $type: 'spacing',
        $value: '0px',
        $description: 'スペーシングなし',
      },
      '1': {
        $type: 'spacing',
        $value: '4px',
        $description: '最小スペーシング',
      },
      '2': {
        $type: 'spacing',
        $value: '8px',
        $description: '小スペーシング',
      },
      '3': {
        $type: 'spacing',
        $value: '12px',
        $description: 'コンパクトスペーシング',
      },
      '4': {
        $type: 'spacing',
        $value: '16px',
        $description: '標準スペーシング',
      },
      '5': {
        $type: 'spacing',
        $value: '20px',
        $description: '中スペーシング',
      },
      '6': {
        $type: 'spacing',
        $value: '24px',
        $description: '大スペーシング',
      },
      '8': {
        $type: 'spacing',
        $value: '32px',
        $description: '特大スペーシング',
      },
      '10': {
        $type: 'spacing',
        $value: '40px',
        $description: '超大スペーシング',
      },
      '12': {
        $type: 'spacing',
        $value: '48px',
        $description: '最大スペーシング',
      },
      '16': {
        $type: 'spacing',
        $value: '64px',
        $description: 'セクション間スペーシング',
      },
      '20': {
        $type: 'spacing',
        $value: '80px',
        $description: 'ページ間スペーシング',
      },
    },
    size: {
      xs: {
        $type: 'size',
        $value: '16px',
        $description: '最小サイズ',
      },
      sm: {
        $type: 'size',
        $value: '24px',
        $description: '小サイズ',
      },
      md: {
        $type: 'size',
        $value: '32px',
        $description: '中サイズ',
      },
      lg: {
        $type: 'size',
        $value: '40px',
        $description: '大サイズ',
      },
      xl: {
        $type: 'size',
        $value: '48px',
        $description: '特大サイズ',
      },
      '2xl': {
        $type: 'size',
        $value: '56px',
        $description: '超特大サイズ',
      },
      '3xl': {
        $type: 'size',
        $value: '64px',
        $description: '最大サイズ',
      },
    },
    borderRadius: {
      none: {
        $type: 'borderRadius',
        $value: '0px',
        $description: '角なし',
      },
      xs: {
        $type: 'borderRadius',
        $value: '2px',
        $description: '最小角丸',
      },
      sm: {
        $type: 'borderRadius',
        $value: '4px',
        $description: '小角丸',
      },
      md: {
        $type: 'borderRadius',
        $value: '6px',
        $description: '中角丸',
      },
      lg: {
        $type: 'borderRadius',
        $value: '8px',
        $description: '大角丸',
      },
      xl: {
        $type: 'borderRadius',
        $value: '12px',
        $description: '特大角丸',
      },
      '2xl': {
        $type: 'borderRadius',
        $value: '16px',
        $description: '超特大角丸',
      },
      '3xl': {
        $type: 'borderRadius',
        $value: '24px',
        $description: '最大角丸',
      },
      full: {
        $type: 'borderRadius',
        $value: '9999px',
        $description: '完全円形',
      },
    },
    opacity: {
      '0': {
        $type: 'opacity',
        $value: '0',
        $description: '完全透明',
      },
      '5': {
        $type: 'opacity',
        $value: '0.05',
        $description: '5% 不透明',
      },
      '10': {
        $type: 'opacity',
        $value: '0.1',
        $description: '10% 不透明',
      },
      '20': {
        $type: 'opacity',
        $value: '0.2',
        $description: '20% 不透明',
      },
      '25': {
        $type: 'opacity',
        $value: '0.25',
        $description: '25% 不透明',
      },
      '30': {
        $type: 'opacity',
        $value: '0.3',
        $description: '30% 不透明',
      },
      '40': {
        $type: 'opacity',
        $value: '0.4',
        $description: '40% 不透明',
      },
      '50': {
        $type: 'opacity',
        $value: '0.5',
        $description: '50% 不透明',
      },
      '60': {
        $type: 'opacity',
        $value: '0.6',
        $description: '60% 不透明',
      },
      '70': {
        $type: 'opacity',
        $value: '0.7',
        $description: '70% 不透明',
      },
      '75': {
        $type: 'opacity',
        $value: '0.75',
        $description: '75% 不透明',
      },
      '80': {
        $type: 'opacity',
        $value: '0.8',
        $description: '80% 不透明',
      },
      '90': {
        $type: 'opacity',
        $value: '0.9',
        $description: '90% 不透明',
      },
      '95': {
        $type: 'opacity',
        $value: '0.95',
        $description: '95% 不透明',
      },
      '100': {
        $type: 'opacity',
        $value: '1',
        $description: '完全不透明',
      },
    },
    borderColor: {
      primary: {
        $type: 'color',
        $value: '#E0E0E0',
        $description: '主要な境界線やディバイダーに使用',
      },
      secondary: {
        $type: 'color',
        $value: '#F5F5F5',
        $description: '軽い境界線やカード境界に使用',
      },
      focused: {
        $type: 'color',
        $value: '#2196F3',
        $description: 'フォーカス状態の要素境界線',
      },
      error: {
        $type: 'color',
        $value: '#F44336',
        $description: 'エラー状態の要素境界線',
      },
      disabled: {
        $type: 'color',
        $value: '#BDBDBD',
        $description: '無効状態の要素境界線',
      },
    },
    shadow: {
      'elevation-level0': {
        $type: 'shadow',
        $value: 'none',
        $description: '影なし - フラットな表面',
      },
      'elevation-level1': {
        $type: 'shadow',
        $value: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
        $description: 'カード、ボタンの軽い浮き上がり',
      },
      'elevation-level2': {
        $type: 'shadow',
        $value: '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
        $description: 'アプリバー、メニューの中程度の浮き上がり',
      },
      'elevation-level3': {
        $type: 'shadow',
        $value: '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
        $description: 'ドロワー、モーダルの強い浮き上がり',
      },
      'elevation-level4': {
        $type: 'shadow',
        $value: '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
        $description: 'ナビゲーション、FABの最も強い浮き上がり',
      },
    },
    breakpoint: {
      xs: {
        $type: 'breakpoint',
        $value: '0px',
        $description: 'モバイル（縦向き）- 0px以上',
      },
      sm: {
        $type: 'breakpoint',
        $value: '600px',
        $description: 'タブレット（縦向き）- 600px以上',
      },
      md: {
        $type: 'breakpoint',
        $value: '900px',
        $description: 'タブレット（横向き）- 900px以上',
      },
      lg: {
        $type: 'breakpoint',
        $value: '1200px',
        $description: 'デスクトップ - 1200px以上',
      },
      xl: {
        $type: 'breakpoint',
        $value: '1536px',
        $description: '大画面デスクトップ - 1536px以上',
      },
    },
    icon: {
      size: {
        xs: {
          $type: 'size',
          $value: '12px',
          $description: 'インライン要素内の小さなアイコン',
        },
        sm: {
          $type: 'size',
          $value: '16px',
          $description: 'ボタンやフォーム内の標準アイコン',
        },
        md: {
          $type: 'size',
          $value: '24px',
          $description: 'ツールバーやリスト項目のアイコン',
        },
        lg: {
          $type: 'size',
          $value: '32px',
          $description: '見出しや重要なアクションアイコン',
        },
        xl: {
          $type: 'size',
          $value: '48px',
          $description: 'ヒーローエリアや装飾的なアイコン',
        },
      },
      stroke: {
        thin: {
          $type: 'size',
          $value: '1px',
          $description: '繊細なアイコンの線の太さ',
        },
        regular: {
          $type: 'size',
          $value: '1.5px',
          $description: '一般的なアイコンの線の太さ',
        },
        bold: {
          $type: 'size',
          $value: '2px',
          $description: '強調アイコンの線の太さ',
        },
      },
    },
  },
};