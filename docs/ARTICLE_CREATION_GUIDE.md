# 防衛情報インテリジェンス記事作成総合ガイド（Claude.ai用）

## 🎯 基本方針
防衛情報インテリジェンス ニュースポータル用の記事を作成する際の包括的なガイドです。HTML形式で高度な防衛技術ダッシュボードを作成し、統一されたJavaScript関数を使用してインタラクティブな機能を実現します。

### 核心原則
- **統一性**: 全記事で同じ関数名・同じ動作を保証
- **機能性**: 複雑なデータの可視化とインタラクション
- **デザイン**: 既存デザインを最大限保持
- **技術性**: エンタープライズレベルのUI/UX

## 🏷️ 技術タグシステム（必須）

### 主要技術カテゴリ（15分野）
1. **ミサイル防衛** - IAMD、ゴールデン・ドーム、GMD、NGI、THAAD、PAC-3
2. **航空防衛** - 戦闘機、GCAP、F-35、F-22、レーダー、防空システム
3. **核技術** - 核兵器、核不拡散、核抑止、核セキュリティ
4. **C4ISR** - 指揮統制、情報通信、偵察、監視、AI情報処理
5. **AI・先端技術** - 人工知能、機械学習、自律システム、量子技術
6. **サイバーセキュリティ** - サイバー防御、サイバー攻撃、情報戦
7. **宇宙技術** - 宇宙防衛、衛星技術、宇宙監視、対衛星兵器
8. **海上・海洋技術** - 海上システム、潜水艦、海洋監視、対艦兵器
9. **陸上技術** - 陸上システム、装甲車両、地上戦闘システム
10. **インテリジェンス** - 情報収集・分析、SIGINT、HUMINT、OSINT
11. **シミュレーション** - 軍事シミュレーション、戦術訓練
12. **ロジスティクス** - 軍事ロジスティクス、兵站、補給システム
13. **国際関係** - 国際情勢、地政学、同盟関係、安全保障協力
14. **政策・戦略** - 防衛政策、軍事戦略、国防計画

### 必須メタタグ設定例
```html
<!-- 記事のhead部分に必ず含めること -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[記事タイトル] - [英語タイトル]</title>

<!-- 技術タグシステム設定【重要】 -->
<meta name="category" content="[適切なカテゴリ]">
<meta name="tags" content="[技術タグ1],[技術タグ2],[技術タグ3]">
<meta name="author" content="Defense Intelligence Portal">

<!-- 多言語対応 -->
<meta name="article:languages" content="ja,en">
<meta name="title:ja" content="[日本語タイトル]">
<meta name="title:en" content="[英語タイトル]">
<meta name="description:ja" content="[日本語説明]">
<meta name="description:en" content="[英語説明]">
```

## 📋 統一JavaScript関数（6つの必須関数）

### 1. `setLanguage(lang)` - 言語切り替え【全記事必須】
```javascript
let currentLang = 'ja';

function setLanguage(lang) {
    currentLang = lang;
    
    // 言語ボタンのアクティブ状態更新
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick*="${lang}"]`)?.classList.add('active');
    
    // data-ja/data-en属性による自動テキスト更新
    document.querySelectorAll('[data-ja]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if(text) el.textContent = text;
    });
    
    console.log(`Language changed to: ${lang}`);
}
```

### 2. `showTab(tabId)` - タブ切り替え【タブがある場合必須】
```javascript
function showTab(tabId) {
    // タブボタンのアクティブ状態更新
    document.querySelectorAll('.tab, .tab-btn, .tab-button').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"], [onclick*="${tabId}"]`)?.classList.add('active');
    
    // パネル表示切り替え
    document.querySelectorAll('.panel, .tab-panel, .tab-content').forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(tabId);
    if(targetPanel) {
        targetPanel.style.display = 'block';
        targetPanel.classList.add('active');
    }
    
    console.log(`Tab switched to: ${tabId}`);
}
```

### 3. `showModal(modalId, data)` - モーダル表示【モーダルがある場合必須】

> ⚠️ **重要**: CSS名前空間システム対応のため、以下の実装が必須です

```javascript
function showModal(modalId, data) {
    const modal = document.getElementById('modal') || document.querySelector('.modal');
    const title = document.getElementById('modal-title') || modal?.querySelector('.modal-title, .modal-header h2, .modal-header h3');
    const body = document.getElementById('modal-body') || modal?.querySelector('.modal-body, .modal-content');
    
    if(modal) {
        // 🔧 【CSS名前空間システム対応】モーダルをbody直下に移動
        if(modal.parentElement !== document.body) {
            document.body.appendChild(modal);
            console.log('[Modal Fix] Moved modal to body root to escape CSS namespace constraints');
        }
        
        // タイトルマップからデータ取得（記事固有のデータ構造に応じて実装）
        const titleText = data?.title || (typeof titleMap !== 'undefined' && titleMap[modalId]) ? 
            (titleMap[modalId][currentLang] || titleMap[modalId].ja) : modalId;
        const bodyText = data?.content || (typeof bodyMap !== 'undefined' && bodyMap[modalId]) ? 
            (bodyMap[modalId][currentLang] || bodyMap[modalId].ja) : '';
        
        if(title) title.textContent = titleText;
        if(body) body.innerHTML = bodyText;
        
        // CSS名前空間システムの制約を完全回避
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.zIndex = '9999';
        modal.style.transform = 'none';
        modal.style.margin = '0';
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
    
    console.log(`Modal opened: ${modalId}`);
}
```

### 4. `hideModal()` - モーダル非表示【モーダルがある場合必須】
```javascript
function hideModal() {
    const modal = document.getElementById('modal') || document.querySelector('.modal');
    if(modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
    
    console.log('Modal closed');
}
```

### 5. `showDetail(detailData)` - 詳細表示【詳細表示がある場合実装】
```javascript
function showDetail(detailData) {
    const title = detailData.name + " — " + detailData.type + " / " + detailData.domain;
    const body = (currentLang==='ja') ? detailData.desc.ja : detailData.desc.en;
    
    showModal('detail', {
        title: title,
        content: `
            <p>${body}</p>
            <div class='tagbar'>${detailData.role?.map(r=>`<span class='tag'>${r}</span>`).join('') || ''}</div>
            <div class='inline-note muted'>${detailData.notes || ""}</div>
        `
    });
    
    console.log(`Detail shown for: ${detailData.name}`);
}
```

### 6. `initializeArticle()` - 記事初期化【必須】
```javascript
function initializeArticle() {
    // データ構築関数の実行（記事固有）
    if(typeof buildSystems === 'function') buildSystems();
    if(typeof buildMatrix === 'function') buildMatrix();
    if(typeof buildTimeline === 'function') buildTimeline();
    if(typeof buildIndustry === 'function') buildIndustry();
    if(typeof buildCharts === 'function') buildCharts();
    if(typeof buildCards === 'function') buildCards();
    
    // 初期言語設定
    setLanguage(currentLang || 'ja');
    
    console.log('Article initialized');
}

// 必ず最後に初期化実行
initializeArticle();
```

## 🔧 CSS名前空間システム対応【重要】

### ⚠️ モーダル表示問題の背景
本システムではCSS名前空間システムが`.article-content`に`position: relative`を設定するため、その中のモーダルの`position: fixed`がビューポート基準でなく親要素基準になります。

### ✅ 必須対応策
1. **JavaScript実行時のDOM移動**
   ```javascript
   // モーダルをbody直下に移動してCSS制約を回避
   if(modal.parentElement !== document.body) {
       document.body.appendChild(modal);
   }
   ```

2. **CSS強制設定**
   ```javascript
   // CSS名前空間システムを上書きする強制スタイル設定
   modal.style.position = 'fixed';
   modal.style.top = '0';
   modal.style.left = '0';
   modal.style.width = '100vw';
   modal.style.height = '100vh';
   modal.style.zIndex = '9999';
   modal.style.transform = 'none';
   modal.style.margin = '0';
   ```

3. **CSS側での!important宣言**
   ```css
   #modal {
       position: fixed !important;
       top: 0 !important;
       left: 0 !important;
       width: 100vw !important;
       height: 100vh !important;
       z-index: 9999 !important;
       transform: none !important;
       margin: 0 !important;
   }
   ```

## 🎨 HTML構造統一規則

### 言語切り替えボタン【必須】
```html
<div class="language-switch">
    <button class="lang-btn active" onclick="setLanguage('ja')">日本語</button>
    <button class="lang-btn" onclick="setLanguage('en')">English</button>
</div>
```

### タブナビゲーション【タブがある場合】
```html
<!-- Golden Dome方式（推奨） -->
<div class="tabs">
    <div class="tab active" data-tab="overview" onclick="showTab('overview')">概要</div>
    <div class="tab" data-tab="systems" onclick="showTab('systems')">システム</div>
    <div class="tab" data-tab="analysis" onclick="showTab('analysis')">分析</div>
</div>

<!-- Iran vs Israel方式（ボタンタイプ） -->
<div class="tab-nav">
    <button class="tab-button active" onclick="showTab('overview', this)">概要</button>
    <button class="tab-button" onclick="showTab('timeline', this)">タイムライン</button>
    <button class="tab-button" onclick="showTab('current', this)">最新状況</button>
</div>

<!-- タブコンテンツ -->
<section id="overview" class="panel"><!-- 概要コンテンツ --></section>
<section id="systems" class="panel" style="display:none"><!-- システムコンテンツ --></section>
<section id="analysis" class="panel" style="display:none"><!-- 分析コンテンツ --></section>
```

### モーダル構造【モーダルがある場合】
```html
<!-- 🔧 【重要】CSS名前空間システム対応のモーダル構造 -->
<div id="modal">
    <div class="modal-content">
        <div class="modal-header">
            <div id="modal-title"></div>
            <button onclick="hideModal()">×</button>
        </div>
        <div id="modal-body"></div>
    </div>
</div>
```

### モーダル用CSS【重要】
```css
#modal {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 9999 !important;
    /* CSS名前空間システム対応 */
    transform: none !important;
    margin: 0 !important;
}

.modal-content {
    background: #ffffff;
    max-width: 720px;
    width: 92%;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    position: relative;
    margin: auto;
    max-height: 90vh;
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 25px;
    border-bottom: 1px solid #e2e8f0;
}

#modal-body {
    padding: 25px;
    max-height: 70vh;
    overflow: auto;
}
```

### 多言語対応属性
```html
<!-- テキストに多言語対応属性を必ず設定 -->
<h1 data-ja="防衛技術ダッシュボード" data-en="Defense Technology Dashboard">防衛技術ダッシュボード</h1>
<p data-ja="令和6年度実施計画" data-en="FY2024 Implementation Plan">令和6年度実施計画</p>
```

## 💾 データ構造統一規則

### グローバルデータオブジェクト
```javascript
const data = {
    // システム/項目一覧（該当する場合）
    systems: [
        {
            id: "system1",
            name: "システム名",
            type: "種別", 
            domain: "領域",
            desc: {
                ja: "日本語説明",
                en: "English description"
            },
            role: ["役割1", "役割2"],
            notes: "備考"
        }
    ],
    
    // 詳細データ（モーダル用）
    details: {
        itemId: {
            title: { ja: "タイトル", en: "Title" },
            content: { ja: "内容", en: "Content" }
        }
    },
    
    // その他記事固有データ
    threats: [...],      // 脅威データ
    milestones: [...],   // マイルストーンデータ
    industry: [...],     // 産業データ
    budget: [...],       // 予算データ
    timeline: [...]      // タイムラインデータ
};
```

## ⚠️ 重要な制約事項

### 🚫 禁止事項
1. **関数名を独自に変更すること**
   - switchTab ❌ → showTab ✅
   - setLang ❌ → setLanguage ✅
   - openModal ❌ → showModal ✅
   - closeModal ❌ → hideModal ✅

2. **window.関数名での登録を忘れること**
   - 必ず `function functionName()` 形式で定義（自動でwindow.functionNameに変換されます）

3. **currentLangを独自変数で管理すること**
   - 必ず `let currentLang = 'ja';` で統一

4. **console.logを省略すること**
   - 各関数で必ずログ出力を行う

### ✅ 必須事項
1. **統一関数の実装**（上記6つの関数）
2. **data-ja/data-en属性の使用**
3. **initializeArticle()の実装と実行**
4. **適切なHTML構造の使用**
5. **エラー処理の実装**

## 📁 ファイル管理規則

### ファイル命名規則
```
YYYY-MM-DD-{slug}.html
```

### 例
- `2025-08-24-cyber-defense-strategy.html`
- `2025-08-25-space-surveillance-system.html`  
- `2025-08-26-ai-command-control.html`

### フォルダ構造
```
defense-intel-news/
├── pub/
│   └── articles/              # 公開記事フォルダ
│       ├── 2024-07-02-mod_ai_dashboard.html
│       ├── 2025-08-23-golden-dome-dashboard.html
│       ├── 2025-08-30-gcap-dashboard.html
│       └── [新規記事].html
```

## 🎯 記事作成チェックリスト

### HTML構造
- [ ] DOCTYPE html、meta charset UTF-8設定
- [ ] 言語切り替えボタンが正しく実装されている
- [ ] data-ja/data-en属性が全てのテキストに設定されている
- [ ] タブがある場合、適切なHTML構造を使用
- [ ] モーダルがある場合、CSS名前空間対応の統一されたモーダル構造を使用

### 🏷️ 技術タグ設定
- [ ] **適切なmeta tagsが設定されている**（記事内容に応じた専門技術タグ）
- [ ] **主要技術分野が特定されている**（ミサイル防衛、C4ISR、AI、サイバー等）
- [ ] **具体的な技術キーワードが含まれている**（IAMD、ゴールデン・ドーム、核技術等）
- [ ] **地政学的要素がある場合は国名・地域が含まれている**（米国、中東、イラン等）

### JavaScript実装
- [ ] `setLanguage(lang)` 関数が実装されている
- [ ] `showTab(tabId)` 関数が実装されている（タブがある場合）
- [ ] `showModal(modalId, data)` 関数が実装されている（モーダルがある場合）
- [ ] `hideModal()` 関数が実装されている（モーダルがある場合）
- [ ] `showDetail(detailData)` 関数が実装されている（詳細表示がある場合）
- [ ] `initializeArticle()` 関数が実装され、最後に実行されている
- [ ] 全関数でconsole.logによるデバッグ出力を行っている
- [ ] onclick属性が統一関数名を使用している
- [ ] CSS名前空間システム対応が実装されている（モーダル使用時）

### CSS・デザイン
- [ ] 既存デザインを可能な限り保持
- [ ] .lang-btn, .tab, .modal等の統一クラス使用
- [ ] レスポンシブ対応
- [ ] 視覚的な一貫性の保持
- [ ] モーダル用CSSが!important宣言を含む

### データ構造
- [ ] data変数でグローバルデータを管理
- [ ] titleMap/bodyMap等でモーダル内容を定義（該当する場合）
- [ ] 適切な多言語データ構造

## 📝 実装済み記事パターン（参考例）

### 1. Golden Domeパターン（推奨）
- フル機能タブ切り替え
- システム詳細モーダル
- 多言語対応完備
- 統合ダッシュボード形式

### 2. GCAP戦闘機パターン
- 国際協力プロジェクト表示
- 企業・組織詳細モーダル
- タイムライン機能
- CSS名前空間システム完全対応

### 3. MOD AI Dashboardパターン  
- カード型レイアウト
- hover エフェクト
- 統計表示
- 詳細展開機能

### 4. Iran vs Israelパターン
- タイムライン表示
- 国際反応分析
- シナリオ展開
- ボタン型タブナビ

### 5. Defense Info Strategyパターン
- 多層データ表示
- インタラクティブカード
- 段階的情報開示
- スクロールアニメーション

## 🎨 デザインシステム仕様

### カラーパレット
```javascript
const colors = {
    // Primary Colors (Intelligence Theme)
    primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        900: '#1e3a8a'
    },
    
    // Status Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    
    // Domain Colors
    air: '#3b82f6',      // Blue
    maritime: '#06b6d4',  // Cyan  
    ground: '#10b981',    // Green
    space: '#8b5cf6',     // Purple
    cyber: '#f59e0b'      // Orange
};
```

### タイポグラフィ
```css
/* Headers */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }

/* 日本語対応フォント */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', 'Hiragino Sans', sans-serif;
```

## 🚀 品質保証のポイント

1. **関数統一性**: 必ず統一された関数名を使用
2. **エラー防止**: 適切なnullチェックとエラーハンドリング
3. **パフォーマンス**: 不要なDOM操作を避ける
4. **保守性**: 明確なコードコメントとログ出力
5. **一貫性**: 既存記事との視覚的・機能的一貫性
6. **CSS名前空間対応**: モーダル表示時の確実な中央配置

## 🎯 統一仕様による品質保証

この仕様に準拠することで：
1. **エラーゼロ**: 統一された関数名でJavaScriptエラーを完全排除
2. **開発効率**: 一貫したパターンで記事作成時間を大幅短縮  
3. **保守性向上**: 将来の機能追加・修正が容易
4. **ユーザー体験統一**: 全記事で一貫した操作性を提供
5. **品質保証**: チェックリストによる確実な品質管理
6. **CSS制約回避**: CSS名前空間システムの制約を完全解決

**必ず上記チェックリストを確認してから記事を作成してください。**
**参考実装として既存記事も随時確認することを推奨します。**