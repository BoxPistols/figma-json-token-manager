import { useState } from 'react';
import { BookOpen, X, ChevronDown, ChevronRight } from 'lucide-react';

export function SchemaGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <BookOpen className="w-4 h-4" />
        JSON Schemaガイド
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl my-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              JSON Schemaガイド
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh] space-y-4 text-sm text-gray-800 dark:text-gray-200">
          <Section title="トークンの基本構造" id="basics" expanded={expanded} toggle={toggle}>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">{`{
  "tokenName": {
    "$type": "color",
    "$value": "#2164D1",
    "$description": "説明文",
    "$deprecated": false,
    "$extensions": {
      "com.figma.plugin": {
        "figmaId": "ID"
      }
    }
  }
}`}</pre>
            <ul className="mt-2 space-y-1 text-xs">
              <li><b>$value</b> - 必須。トークンの値</li>
              <li><b>$type</b> - 推奨。トークンの型</li>
              <li><b>$description</b> - 推奨。説明文</li>
              <li><b>$deprecated</b> - 廃止予定マーク</li>
              <li><b>$extensions</b> - ベンダー拡張</li>
            </ul>
          </Section>

          <Section title="サポートする型一覧" id="types" expanded={expanded} toggle={toggle}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><b>color</b> - カラー (hex/rgb/hsl)</div>
              <div><b>dimension</b> - 寸法 (px/rem/em)</div>
              <div><b>spacing</b> - 間隔</div>
              <div><b>typography</b> - タイポグラフィ複合</div>
              <div><b>borderRadius</b> - 角丸</div>
              <div><b>borderWidth</b> - ボーダー幅</div>
              <div><b>borderColor</b> - ボーダー色</div>
              <div><b>shadow</b> - シャドウ</div>
              <div><b>opacity</b> - 不透明度 (0-1)</div>
              <div><b>duration</b> - アニメーション時間</div>
              <div><b>cubicBezier</b> - イージング [x1,y1,x2,y2]</div>
              <div><b>fontFamily</b> - フォント</div>
              <div><b>fontWeight</b> - ウェイト (1-1000)</div>
              <div><b>number</b> - 数値</div>
              <div><b>size</b> - サイズ</div>
              <div><b>blur</b> - ぼかし</div>
            </div>
          </Section>

          <Section title="トークン参照 (エイリアス)" id="refs" expanded={expanded} toggle={toggle}>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">{`{
  "primary": {
    "$type": "color",
    "$value": "#2164D1"
  },
  "primaryLight": {
    "$type": "color",
    "$value": "{primary}",
    "$description": "primaryへの参照"
  }
}`}</pre>
            <p className="mt-2 text-xs">
              波括弧構文 <code>{'{group.token}'}</code> または JSON Pointer <code>#/group/token</code>
            </p>
          </Section>

          <Section title="グループレベル型継承" id="inherit" expanded={expanded} toggle={toggle}>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">{`{
  "color": {
    "$type": "color",
    "primary": {
      "$value": "#2164D1"
    },
    "secondary": {
      "$value": "#888888"
    }
  }
}`}</pre>
            <p className="mt-2 text-xs">
              親の <code>$type</code> は子に継承されます。子で上書き可能。
            </p>
          </Section>

          <Section title="ファイル形式" id="format" expanded={expanded} toggle={toggle}>
            <ul className="space-y-1 text-xs">
              <li>拡張子: <code>.tokens.json</code> または <code>.tokens</code></li>
              <li>MIME: <code>application/design-tokens+json</code></li>
              <li>名前制限: <code>$</code>で始まらない、<code>{'{ } .'}</code>を含まない</li>
              <li><code>$schema</code> プロパティでVSCode自動補完可能</li>
            </ul>
          </Section>

          <Section title="Figma拡張" id="extensions" expanded={expanded} toggle={toggle}>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">{`"$extensions": {
  "com.figma.plugin": {
    "figmaId": "variable-id",
    "collection": "Colors",
    "mode": "Light",
    "scopes": ["all", "figma"]
  }
}`}</pre>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  id,
  expanded,
  toggle,
  children,
}: {
  title: string;
  id: string;
  expanded: Record<string, boolean>;
  toggle: (key: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = expanded[id] ?? false;
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <button
        onClick={() => toggle(id)}
        className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
      >
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
