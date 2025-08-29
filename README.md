# 防衛情報インテリジェンス ニュースポータル

防衛・安全保障関連の情報記事を管理・表示するインテリジェンス ニュースポータルです。HTMLファイルベースの記事を動的に読み込み、**CSS名前空間システム**により元デザインを完全保持した記事表示を実現します。

## 🚀 主要機能

- **CSS名前空間システム**: 元HTMLデザインの100%保持 + JavaScript機能サポート
- **記事一覧表示**: カード形式での記事表示、検索・フィルタリング機能
- **JavaScript実行エンジン**: onclick属性、グローバル関数の動的実行
- **自動HTMLパーシング**: styles/scripts/bodyContentの自動分離・処理
- **HTML記事パーサー**: HTMLファイルからメタデータを自動抽出
- **グリッドレイアウト自動修正**: display:gridの強制適用によるレイアウト崩れ防止
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応

## 🛠 技術スタック

### フロントエンド
- **Next.js 14** - App Router使用
- **TypeScript** - 型安全な開発
- **CSS名前空間システム** - 元デザイン完全保持技術
- **Tailwind CSS v3.4** - モダンなスタイリング
- **Lucide React** - アイコンライブラリ

### コア技術
- **CSS名前空間システム** - `.article-content`スコープによる完全分離
- **JavaScript実行エンジン** - グローバル関数の動的登録・実行
- **JSDOM** - HTMLファイル解析・パーシング
- **自動HTMLパーサー** - メタデータ抽出・分類

### 開発環境
- **ESLint** - コード品質管理
- **TypeScript** - 型チェック
- **npm** - パッケージ管理

## 📁 プロジェクト構造

```
defense-intel-news/
├── pub/                                # 記事HTMLファイル格納
│   └── articles/
│       ├── 2024-07-02-mod_ai_dashboard.html
│       ├── 2025-06-06-iran-vs-islael.html
│       └── 2025-07-01-defense-info-strategy-dashboard.html
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # ルートレイアウト
│   │   ├── page.tsx                    # ホームページ
│   │   ├── articles/                   # 記事関連ページ
│   │   │   ├── page.tsx                # 記事一覧ページ
│   │   │   └── [slug]/                 # 記事詳細ページ
│   │   │       └── page.tsx
│   │   └── globals.css                 # グローバルスタイル
│   │
│   ├── components/                     # Reactコンポーネント
│   │   ├── articles/                   # 記事関連コンポーネント
│   │   │   ├── ArticleList.tsx         # 記事一覧
│   │   │   ├── ArticleCard.tsx         # 記事カード
│   │   │   ├── ArticleDetail.tsx       # CSS名前空間システム実装
│   │   │   ├── ShadowDOMRenderer.tsx   # Shadow DOM実装（保管用）
│   │   │   ├── SearchBar.tsx           # 検索バー
│   │   │   └── FilterPanel.tsx         # フィルターパネル
│   │   └── ui/                         # 基本UIコンポーネント
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Input.tsx
│   │       └── Select.tsx
│   │
│   └── lib/                            # ライブラリ・ユーティリティ
│       ├── types.ts                    # TypeScript型定義
│       ├── articleParser.ts            # HTML記事パーサー
│       └── utils.ts                    # ユーティリティ関数
│
├── package.json                        # パッケージ設定
├── tsconfig.json                       # TypeScript設定
├── tailwind.config.js                  # Tailwind設定
└── next.config.js                      # Next.js設定
```

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0以上
- npm 8.0以上

### インストール

1. リポジトリのクローン
```bash
git clone <repository-url>
cd defense-intel-news
```

2. 依存関係のインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```

4. ブラウザでアクセス
```
http://localhost:3000
```

## 🎯 CSS名前空間システム

### 技術概要
本システムの核心技術。HTMLファイルの元デザインを100%保持しながら、Tailwind CSSとの競合を完全回避。

```typescript
// 1. HTMLパーシング
function parseHTMLContent(html: string) {
  // styles, scripts, bodyContent を自動分離
}

// 2. CSS名前空間化  
function namespaceCSS(css: string): string {
  return css
    .replace(/\bbody\b/g, '.article-content')  // body → .article-content
    .replace(/\bhtml\b/g, '.article-content')  // html → .article-content
    .replace(/^\s*\*/gm, '.article-content *'); // * → .article-content *
}

// 3. JavaScript実行
function executeScripts(scripts: string) {
  (0, eval)(scripts);  // グローバル関数登録
  // onclick属性の動的実行をサポート
}
```

### 表示モード
- **🎨 CSS名前空間モード**: デフォルト、完全機能サポート
- **📄 Raw表示モード**: iframe経由での元HTMLそのまま表示

### 自動修正機能
```css
/* グリッドレイアウト自動修正 */
.article-content .grid-container {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important;
}
```

## 📚 使用方法

### 記事の追加

1. `pub/articles/` ディレクトリにHTMLファイルを配置
2. ファイル名は `YYYY-MM-DD-{slug}.html` 形式で命名
3. HTMLファイルには以下の要素を含める：
   - `<title>` タグ（必須）
   - `<meta name="description">` （推奨）
   - `<meta name="author">` （推奨）
   - `<meta name="keywords">` （推奨）

### 記事ファイル例

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>防衛省AI活用推進基本方針</title>
    <meta name="description" content="防衛省が発表したAI活用推進基本方針の詳細分析">
    <meta name="author" content="防衛情報研究センター">
    <meta name="keywords" content="防衛省,AI,人工知能,政策">
</head>
<body>
    <h1>防衛省AI活用推進基本方針</h1>
    <p>記事の内容...</p>
</body>
</html>
```

### カテゴリ分類

記事は以下のカテゴリに自動分類されます：

- **防衛政策** - 防衛省の政策、戦略関連
- **国際情勢** - 国際的な軍事・安全保障情勢
- **防衛技術** - 防衛関連技術、AI、システム
- **インテリジェンス** - 情報収集・分析関連
- **サイバーセキュリティ** - サイバー防衛関連
- **宇宙防衛** - 宇宙領域の安全保障
- **海洋安全保障** - 海洋・海上防衛関連
- **分析レポート** - 詳細な分析記事
- **ダッシュボード** - データ可視化記事
- **その他** - 上記以外の記事

## 🎨 カスタマイズ

### テーマの変更

`tailwind.config.js` でカラーテーマをカスタマイズできます：

```javascript
colors: {
  primary: {
    500: '#3b82f6', // メインカラー
    600: '#2563eb',
  },
  // カテゴリ別カラーの設定
  defense_policy: '#dc2626',
  international: '#ea580c',
  // ...
}
```

### 記事パーサーの設定

`src/lib/articleParser.ts` で記事解析ロジックをカスタマイズできます：

- メタデータ抽出ルール
- カテゴリ分類アルゴリズム  
- タグ自動生成ロジック
- 読了時間計算

## 📊 パフォーマンス

- **初期読み込み**: < 2.5秒（LCP）
- **インタラクション**: < 100ms（FID）
- **レイアウト安定性**: < 0.1（CLS）
- **記事検索**: リアルタイム（debounce 300ms）

## 🔧 開発

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# リンター実行
npm run lint
```

### ディレクトリ規約

- `src/app/` - Next.js App Routerページ
- `src/components/` - 再利用可能なReactコンポーネント
- `src/lib/` - ユーティリティ、型定義、ビジネスロジック
- `pub/articles/` - HTMLファイル形式の記事データ

### コンポーネント設計原則

1. **単一責任の原則** - 各コンポーネントは一つの責任を持つ
2. **再利用性** - プロップスによる柔軟な設定
3. **アクセシビリティ** - WCAG 2.1 AA準拠
4. **型安全性** - TypeScriptによる厳密な型定義

## 📈 記事統計

現在の記事統計：
- 総記事数: 3件
- カテゴリ数: 8+個
- 平均読了時間: 5-10分
- サポート形式: HTML

## 🐛 トラブルシューティング

### よくある問題

1. **記事が表示されない**
   - `pub/articles/` ディレクトリに適切なHTMLファイルがあるか確認
   - ファイル名が `YYYY-MM-DD-{slug}.html` 形式になっているか確認

2. **スタイルが崩れる**
   - Tailwind CSSのビルドが正常に実行されているか確認
   - カスタムスタイルがglobals.cssに正しく定義されているか確認

3. **検索が動作しない**
   - JavaScriptが有効になっているか確認
   - コンソールエラーがないか確認

### ログの確認

開発サーバー実行中は、コンソールに詳細なログが出力されます：

```bash
# 記事パース時のログ
✓ Parsed article: 2024-07-02-mod_ai_dashboard.html
✗ Failed to parse: invalid-file.html

# エラーログ
Error: Failed to load articles: ENOENT
```

## 🚀 デプロイ

### Vercel（推奨）

1. Vercelにプロジェクトをインポート
2. 環境変数の設定（必要に応じて）
3. 自動デプロイの設定

### その他のプラットフォーム

- **Netlify**: `npm run build` でスタティック生成
- **AWS**: S3 + CloudFront でホスティング
- **自前サーバー**: `npm run build` + `npm run start`

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 📞 サポート

質問やサポートが必要な場合：

1. [Issues](../../issues) でバグレポートや機能リクエストを作成
2. [Discussions](../../discussions) でコミュニティに質問
3. [Wiki](../../wiki) で詳細なドキュメントを確認

---

**防衛情報インテリジェンス ニュースポータル**
© 2025 Defense Intelligence Portal. All rights reserved.