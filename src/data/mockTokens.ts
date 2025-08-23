import { TokenData } from '../types';

export const mockTokens: TokenData = {
  colors: [
    // Primary
    {
      name: "primary/main",
      value: "#2164D1",
      role: "ブランドカラー",
      description: "主要アクションやブランディングに使用する色"
    },
    {
      name: "primary/dark",
      value: "#1E4B99", 
      role: "ブランドカラー（濃）",
      description: "ホバー状態やアクティブ状態で使用する濃い主要色"
    },
    {
      name: "primary/light",
      value: "#4B7FE8",
      role: "ブランドカラー（薄）",
      description: "軽い背景やアクセントに使用する薄い主要色"
    },
    {
      name: "primary/lighter",
      value: "#E8F1FE",
      role: "ブランドカラー（最薄）",
      description: "フォーカス状態やベース背景に使用する最も薄い主要色"
    },
    // Secondary - キャンセルボタン用の彩度低めグレー
    {
      name: "secondary/main",
      value: "#495974",
      role: "キャンセル・中性",
      description: "キャンセルボタンや中性アクションに使用する色"
    },
    {
      name: "secondary/dark",
      value: "#384557",
      role: "キャンセル・中性（濃）",
      description: "ホバー状態のキャンセルボタンに使用する濃いセカンダリ色"
    },
    {
      name: "secondary/light",
      value: "#6B7A92",
      role: "キャンセル・中性（薄）",
      description: "軽い背景の中性要素に使用する薄いセカンダリ色"
    },
    {
      name: "secondary/lighter",
      value: "#E8EBF0",
      role: "キャンセル・中性（最薄）",
      description: "中性要素の背景に使用する最も薄いセカンダリ色"
    },
    // Success
    {
      name: "success/main",
      value: "#059669",
      role: "成功・確認",
      description: "成功メッセージや完了状態を表す色"
    },
    {
      name: "success/dark",
      value: "#065F46",
      role: "成功・確認（濃）",
      description: "ホバー状態や強調表示に使用する濃い成功色"
    },
    {
      name: "success/light",
      value: "#10B981",
      role: "成功・確認（薄）",
      description: "軽い背景の成功要素に使用する薄い成功色"
    },
    {
      name: "success/lighter",
      value: "#ECFDF5",
      role: "成功・確認（最薄）",
      description: "成功要素の背景に使用する最も薄い成功色"
    },
    // Warning
    {
      name: "warning/main",
      value: "#D97706",
      role: "注意・警告",
      description: "注意喚起や警告メッセージを表す色"
    },
    {
      name: "warning/dark",
      value: "#92400E",
      role: "注意・警告（濃）",
      description: "ホバー状態や強調表示に使用する濃い警告色"
    },
    {
      name: "warning/light",
      value: "#F59E0B",
      role: "注意・警告（薄）",
      description: "軽い背景の警告要素に使用する薄い警告色"
    },
    {
      name: "warning/lighter",
      value: "#FEF3C7",
      role: "注意・警告（最薄）",
      description: "警告要素の背景に使用する最も薄い警告色"
    },
    // Error
    {
      name: "error/main",
      value: "#DC2626",
      role: "エラー・危険",
      description: "エラーメッセージや危険な操作を表す色"
    },
    {
      name: "error/dark",
      value: "#991B1B",
      role: "エラー・危険（濃）",
      description: "ホバー状態や強調表示に使用する濃いエラー色"
    },
    {
      name: "error/light",
      value: "#F87171",
      role: "エラー・危険（薄）",
      description: "軽い背景のエラー要素に使用する薄いエラー色"
    },
    {
      name: "error/lighter",
      value: "#FEE2E2",
      role: "エラー・危険（最薄）",
      description: "エラー要素の背景に使用する最も薄いエラー色"
    },
    // Info
    {
      name: "info/main",
      value: "#0EA5E9",
      role: "情報・ガイド",
      description: "情報提供やガイダンスを表す色"
    },
    {
      name: "info/dark",
      value: "#0284C7",
      role: "情報・ガイド（濃）",
      description: "ホバー状態や強調表示に使用する濃い情報色"
    },
    {
      name: "info/light",
      value: "#38BDF8",
      role: "情報・ガイド（薄）",
      description: "軽い背景の情報要素に使用する薄い情報色"
    },
    {
      name: "info/lighter",
      value: "#E0F2FE",
      role: "情報・ガイド（最薄）",
      description: "情報要素の背景に使用する最も薄い情報色"
    },
    // Grey
    {
      name: "grey/50",
      value: "#F9FAFB",
      role: "背景色",
      description: "最も軽いページ背景やカード背景に使用"
    },
    {
      name: "grey/100", 
      value: "#F3F4F6",
      role: "軽い背景色",
      description: "セクション区切りや軽いコンテナ背景に使用"
    },
    {
      name: "grey/200",
      value: "#E5E7EB",
      role: "境界線色",
      description: "要素間の区切り線やボーダーに使用"
    },
    {
      name: "grey/300",
      value: "#D1D5DB",
      role: "軽い境界線色",
      description: "軽いボーダーやディバイダーに使用"
    },
    {
      name: "grey/400",
      value: "#9CA3AF",
      role: "プレースホルダー色",
      description: "入力フィールドのヒントテキストに使用"
    },
    {
      name: "grey/500",
      value: "#6B7280",
      role: "セカンダリテキスト色",
      description: "補助的な情報やキャプションに使用"
    },
    {
      name: "grey/600",
      value: "#4B5563",
      role: "テキスト色",
      description: "通常のテキストコンテンツに使用"
    },
    {
      name: "grey/700",
      value: "#374151",
      role: "ダークテキスト色",
      description: "見出しや重要なテキストに使用"
    },
    {
      name: "grey/800",
      value: "#1F2937",
      role: "より濃いテキスト色",
      description: "主要見出しや強調テキストに使用"
    },
    {
      name: "grey/900",
      value: "#111827",
      role: "メインテキスト色",
      description: "最も重要なテキストや大見出しに使用"
    }
  ],
  variations: {
    primary: {
      main: "#2164D1",
      dark: "#1E4B99",
      light: "#4B7FE8",
      lighter: "#E8F1FE"
    },
    secondary: {
      main: "#495974",
      dark: "#384557",
      light: "#6B7A92",
      lighter: "#E8EBF0"
    },
    neutral: {
      main: "#6B7280",
      dark: "#374151",
      light: "#9CA3AF",
      lighter: "#F3F4F6"
    }
  },
  typography: [
    // Display サイズ - 大きなタイトル用
    {
      name: "display/large",
      value: "64px Inter",
      fontFamily: "Inter",
      fontSize: 64,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: -0.025,
      description: "大型ディスプレイタイトル"
    },
    {
      name: "display/medium",
      value: "48px Inter",
      fontFamily: "Inter",
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: -0.02,
      description: "中型ディスプレイタイトル"
    },
    {
      name: "display/small",
      value: "36px Inter",
      fontFamily: "Inter",
      fontSize: 36,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: -0.015,
      description: "小型ディスプレイタイトル"
    },
    // Heading サイズ
    {
      name: "heading/h1",
      value: "32px Inter",
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: -0.01,
      description: "メイン見出し H1"
    },
    {
      name: "heading/h2",
      value: "28px Inter",
      fontFamily: "Inter",
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: -0.008,
      description: "セクション見出し H2"
    },
    {
      name: "heading/h3",
      value: "24px Inter",
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: -0.006,
      description: "サブセクション見出し H3"
    },
    {
      name: "heading/h4",
      value: "20px Inter",
      fontFamily: "Inter",
      fontSize: 20,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: -0.004,
      description: "小見出し H4"
    },
    {
      name: "heading/h5",
      value: "18px Inter",
      fontFamily: "Inter",
      fontSize: 18,
      fontWeight: 600,
      lineHeight: 1.45,
      description: "ミニ見出し H5"
    },
    {
      name: "heading/h6",
      value: "16px Inter",
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.5,
      description: "最小見出し H6"
    },
    // Body サイズ
    {
      name: "body/large",
      value: "18px Inter",
      fontFamily: "Inter",
      fontSize: 18,
      fontWeight: 400,
      lineHeight: 1.6,
      description: "大きな本文テキスト"
    },
    {
      name: "body/medium",
      value: "16px Inter",
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
      description: "標準本文テキスト"
    },
    {
      name: "body/small",
      value: "14px Inter",
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.4,
      description: "小さな本文テキスト"
    },
    // Label サイズ
    {
      name: "label/large",
      value: "16px Inter",
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 500,
      lineHeight: 1.4,
      description: "大きなラベル"
    },
    {
      name: "label/medium",
      value: "14px Inter",
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.3,
      description: "標準ラベル"
    },
    {
      name: "label/small",
      value: "12px Inter",
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.25,
      description: "小さなラベル"
    },
    // Caption & Overline
    {
      name: "caption/default",
      value: "12px Inter",
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.3,
      description: "キャプションテキスト"
    },
    {
      name: "overline/default",
      value: "11px Inter",
      fontFamily: "Inter",
      fontSize: 11,
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      description: "オーバーラインテキスト"
    },
    // Button サイズ
    {
      name: "button/large",
      value: "16px Inter",
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.25,
      description: "大きなボタンテキスト"
    },
    {
      name: "button/medium",
      value: "14px Inter",
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.2,
      description: "標準ボタンテキスト"
    },
    {
      name: "button/small",
      value: "12px Inter",
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.15,
      description: "小さなボタンテキスト"
    }
  ],
  spacing: [
    // Base spacing scale (4px グリッド)
    {
      name: "spacing/0",
      value: "0px",
      role: "スペーシングなし"
    },
    {
      name: "spacing/1",
      value: "4px",
      role: "最小スペーシング"
    },
    {
      name: "spacing/2",
      value: "8px",
      role: "小スペーシング"
    },
    {
      name: "spacing/3",
      value: "12px",
      role: "コンパクトスペーシング"
    },
    {
      name: "spacing/4",
      value: "16px",
      role: "標準スペーシング"
    },
    {
      name: "spacing/5",
      value: "20px",
      role: "中スペーシング"
    },
    {
      name: "spacing/6",
      value: "24px",
      role: "大スペーシング"
    },
    {
      name: "spacing/8",
      value: "32px",
      role: "特大スペーシング"
    },
    {
      name: "spacing/10",
      value: "40px",
      role: "超大スペーシング"
    },
    {
      name: "spacing/12",
      value: "48px",
      role: "最大スペーシング"
    },
    {
      name: "spacing/16",
      value: "64px",
      role: "セクション間スペーシング"
    },
    {
      name: "spacing/20",
      value: "80px",
      role: "ページ間スペーシング"
    }
  ],
  borderRadius: [
    {
      name: "radius/none",
      value: "0px",
      role: "角なし"
    },
    {
      name: "radius/xs",
      value: "2px",
      role: "最小角丸"
    },
    {
      name: "radius/sm",
      value: "4px",
      role: "小角丸"
    },
    {
      name: "radius/md",
      value: "6px",
      role: "中角丸"
    },
    {
      name: "radius/lg",
      value: "8px",
      role: "大角丸"
    },
    {
      name: "radius/xl",
      value: "12px",
      role: "特大角丸"
    },
    {
      name: "radius/2xl",
      value: "16px",
      role: "超特大角丸"
    },
    {
      name: "radius/3xl",
      value: "24px",
      role: "最大角丸"
    },
    {
      name: "radius/full",
      value: "9999px",
      role: "完全円形"
    }
  ],
  opacity: [
    {
      name: "opacity/0",
      value: 0,
      role: "完全透明"
    },
    {
      name: "opacity/5",
      value: 0.05,
      role: "5% 不透明"
    },
    {
      name: "opacity/10",
      value: 0.1,
      role: "10% 不透明"
    },
    {
      name: "opacity/20",
      value: 0.2,
      role: "20% 不透明"
    },
    {
      name: "opacity/25",
      value: 0.25,
      role: "25% 不透明"
    },
    {
      name: "opacity/30",
      value: 0.3,
      role: "30% 不透明"
    },
    {
      name: "opacity/40",
      value: 0.4,
      role: "40% 不透明"
    },
    {
      name: "opacity/50",
      value: 0.5,
      role: "50% 不透明"
    },
    {
      name: "opacity/60",
      value: 0.6,
      role: "60% 不透明"
    },
    {
      name: "opacity/70",
      value: 0.7,
      role: "70% 不透明"
    },
    {
      name: "opacity/75",
      value: 0.75,
      role: "75% 不透明"
    },
    {
      name: "opacity/80",
      value: 0.8,
      role: "80% 不透明"
    },
    {
      name: "opacity/90",
      value: 0.9,
      role: "90% 不透明"
    },
    {
      name: "opacity/95",
      value: 0.95,
      role: "95% 不透明"
    },
    {
      name: "opacity/100",
      value: 1,
      role: "完全不透明"
    }
  ],
  // Size tokens for consistent sizing
  size: [
    {
      name: "size/xs",
      value: "16px",
      role: "最小サイズ"
    },
    {
      name: "size/sm",
      value: "24px",
      role: "小サイズ"
    },
    {
      name: "size/md",
      value: "32px",
      role: "中サイズ"
    },
    {
      name: "size/lg",
      value: "40px",
      role: "大サイズ"
    },
    {
      name: "size/xl",
      value: "48px",
      role: "特大サイズ"
    },
    {
      name: "size/2xl",
      value: "56px",
      role: "超特大サイズ"
    },
    {
      name: "size/3xl",
      value: "64px",
      role: "最大サイズ"
    }
  ]
};