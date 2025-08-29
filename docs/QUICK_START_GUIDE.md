# 📚 HTMLアップロード クイックスタートガイド

## 🚀 今すぐ使える方法

### 方法1: シンプルなファイル配置

1. **HTMLファイルを作成**
```html
<!-- my-article.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>私の新しい記事タイトル</title>
    <style>
        /* お好みのスタイル */
        .my-article {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="my-article">
        <h1>記事タイトル</h1>
        <p>記事内容...</p>
    </div>
</body>
</html>
```

2. **正しいファイル名に変更**
```bash
# ファイル名を YYYY-MM-DD-slug.html 形式に
mv my-article.html 2025-08-24-my-article.html
```

3. **pub/articlesフォルダに配置**
```bash
# ファイルをコピー
cp 2025-08-24-my-article.html pub/articles/
```

4. **ブラウザで確認**
```
http://localhost:3002/articles/2025-08-24-my-article
```

## 📝 HTMLテンプレート集

### テンプレート1: シンプル記事
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>シンプルな防衛ニュース記事</title>
    <style>
        body {
            font-family: 'Noto Sans JP', sans-serif;
            line-height: 1.8;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 { color: #1e3a8a; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
        h2 { color: #2563eb; margin-top: 30px; }
        .date { color: #666; font-size: 0.9em; }
        .category { 
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
        }
    </style>
</head>
<body>
    <span class="category">防衛技術</span>
    <h1>記事タイトル</h1>
    <p class="date">2025年8月24日</p>
    
    <h2>概要</h2>
    <p>記事の概要をここに書きます。</p>
    
    <h2>詳細</h2>
    <p>詳細な内容をここに書きます。</p>
</body>
</html>
```

### テンプレート2: ダッシュボード形式
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>防衛技術ダッシュボード</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', 'Noto Sans JP', sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 20px;
        }
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
        }
        .stat-label {
            opacity: 0.9;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>防衛技術ダッシュボード</h1>
            <p>2025年8月 最新レポート</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">156</div>
                <div class="stat-label">新規プロジェクト</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">89%</div>
                <div class="stat-label">達成率</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">¥2.5兆</div>
                <div class="stat-label">予算規模</div>
            </div>
        </div>
        
        <h2>詳細情報</h2>
        <p>ダッシュボードの詳細情報をここに記載...</p>
    </div>
</body>
</html>
```

### テンプレート3: インタラクティブ記事
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>インタラクティブ防衛分析</title>
    <style>
        body {
            font-family: 'Noto Sans JP', sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .tab {
            padding: 10px 20px;
            background: #e2e8f0;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        }
        .tab.active {
            background: #3b82f6;
            color: white;
        }
        .content {
            display: none;
        }
        .content.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>インタラクティブ防衛分析</h1>
        
        <div class="tabs">
            <button class="tab active" onclick="showTab('overview')">概要</button>
            <button class="tab" onclick="showTab('details')">詳細</button>
            <button class="tab" onclick="showTab('analysis')">分析</button>
        </div>
        
        <div id="overview" class="content active">
            <h2>概要</h2>
            <p>概要コンテンツ...</p>
        </div>
        
        <div id="details" class="content">
            <h2>詳細情報</h2>
            <p>詳細コンテンツ...</p>
        </div>
        
        <div id="analysis" class="content">
            <h2>分析結果</h2>
            <p>分析コンテンツ...</p>
        </div>
    </div>
    
    <script>
        function showTab(tabName) {
            // すべてのタブとコンテンツを非アクティブに
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 選択されたタブとコンテンツをアクティブに
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        }
    </script>
</body>
</html>
```

## 🛠️ 便利なツール

### 自動アップロードスクリプト
```bash
#!/bin/bash
# upload-article.sh

# 使い方: ./upload-article.sh my-article.html

if [ $# -eq 0 ]; then
    echo "使い方: $0 <HTMLファイル>"
    exit 1
fi

# 日付を自動生成
DATE=$(date +%Y-%m-%d)

# ファイル名からスラッグを生成
FILENAME=$(basename "$1" .html)
SLUG=${FILENAME// /-}  # スペースをハイフンに変換
SLUG=${SLUG,,}  # 小文字に変換

# 新しいファイル名
NEW_NAME="${DATE}-${SLUG}.html"

# ファイルをコピー
cp "$1" "pub/articles/$NEW_NAME"

echo "✅ アップロード完了: pub/articles/$NEW_NAME"
echo "📍 URL: http://localhost:3002/articles/${DATE}-${SLUG}"
```

### バッチアップロード
```bash
# 複数ファイルを一括アップロード
for file in *.html; do
    date=$(date +%Y-%m-%d)
    name=$(basename "$file" .html)
    cp "$file" "pub/articles/${date}-${name}.html"
    echo "✅ Uploaded: ${date}-${name}"
done
```

## 📋 チェックリスト

### アップロード前の確認事項
- [ ] ファイル名は `YYYY-MM-DD-slug.html` 形式
- [ ] 文字エンコーディングは UTF-8
- [ ] `<title>` タグが設定されている
- [ ] 日本語が正しく表示される
- [ ] CSSスタイルが含まれている（必要な場合）
- [ ] JavaScriptが含まれている（必要な場合）

### トラブルシューティング

#### 記事が表示されない
1. ファイル名の形式を確認
2. `pub/articles/` フォルダに配置されているか確認
3. サーバーを再起動: `npm run dev`

#### スタイルが適用されない
1. `<style>` タグ内にCSSを記述
2. インラインスタイルの使用も可能

#### 日本語が文字化けする
1. `<meta charset="UTF-8">` が含まれているか確認
2. ファイル自体のエンコーディングを確認

## 🎯 ベストプラクティス

1. **シンプルに始める**
   - まずは基本的なHTMLから始める
   - 徐々に機能を追加

2. **テンプレートを活用**
   - 提供されたテンプレートをベースに作成
   - 自分用のテンプレートを作成して再利用

3. **命名規則を守る**
   - 日付-スラッグ形式を必ず守る
   - スラッグは英数字とハイフンのみ使用

4. **プレビュー確認**
   - アップロード前にブラウザでHTMLファイルを直接開いて確認
   - スタイルとレイアウトをチェック

5. **バックアップ**
   - オリジナルファイルは別途保管
   - バージョン管理を検討

これで、HTMLファイルを作成してフォルダに配置するだけで、すぐに記事として公開できます！