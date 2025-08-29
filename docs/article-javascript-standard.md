# 記事JavaScript関数統一仕様書（2025年8月最新版）

## 🎯 基本方針
このシステムでは記事間での一貫性とエラー防止のため、JavaScript関数を統一仕様に準拠させています。
**全ての記事で同じ関数名・同じ動作を保証**します。

## 🏷️ 技術タグシステム（2025年8月導入）
**重要**: 記事作成時は以下の専門技術タグシステムに準拠してください。

### 主要技術カテゴリ（15分野）
1. **ミサイル防衛** (Missile Defense) - ゴールデン・ドーム、IAMD等
2. **航空防衛** (Air Defense) - 戦闘機、レーダー等  
3. **核技術** (Nuclear Technology) - 核兵器、核不拡散等
4. **C4ISR** - 指揮統制・情報通信・偵察
5. **AI・先端技術** - 人工知能、機械学習等
6. **サイバーセキュリティ** - サイバー防御・攻撃等
7. **宇宙技術** - 宇宙防衛、衛星技術等
8. **海上・海洋技術** - 海上システム、潜水艦等
9. **陸上技術** - 陸上システム、装甲車両等
10. **インテリジェンス** - 情報収集・分析、SIGINT等
11. **シミュレーション** - 軍事シミュレーション等
12. **ロジスティクス** - 軍事ロジスティクス等
13. **国際関係** - 国際情勢、地政学等
14. **政策・戦略** - 防衛政策、軍事戦略等

### 必須メタタグ設定
```html
<!-- 記事のhead部分に必ず含めること -->
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

## 📋 必須実装関数（6つの標準関数）

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
```javascript
function showModal(modalId, data) {
    const modal = document.getElementById('modal') || document.querySelector('.modal');
    const title = document.getElementById('modal-title') || modal?.querySelector('.modal-title, .modal-header h2, .modal-header h3');
    const body = document.getElementById('modal-body') || modal?.querySelector('.modal-body, .modal-content');
    
    // タイトルマップからデータ取得（記事固有のデータ構造に応じて実装）
    const titleText = data?.title || (typeof titleMap !== 'undefined' && titleMap[modalId]) ? 
        (titleMap[modalId][currentLang] || titleMap[modalId].ja) : modalId;
    const bodyText = data?.content || (typeof bodyMap !== 'undefined' && bodyMap[modalId]) ? 
        (bodyMap[modalId][currentLang] || bodyMap[modalId].ja) : '';
    
    if(modal) {
        if(title) title.textContent = titleText;
        if(body) body.innerHTML = bodyText;
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
    // システム詳細などの個別データ表示
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
<div class="tabs">
    <div class="tab active" data-tab="overview" onclick="showTab('overview')">概要</div>
    <div class="tab" data-tab="systems" onclick="showTab('systems')">システム</div>
    <div class="tab" data-tab="analysis" onclick="showTab('analysis')">分析</div>
</div>

<section id="overview" class="panel"><!-- 概要コンテンツ --></section>
<section id="systems" class="panel" style="display:none"><!-- システムコンテンツ --></section>
<section id="analysis" class="panel" style="display:none"><!-- 分析コンテンツ --></section>
```

### モーダル構造【モーダルがある場合】
```html
<div id="modal" style="position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5)">
    <div class="modal-content" style="background:#fff;max-width:720px;width:92%;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.45);">
        <div class="modal-header" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #e2e8f0">
            <div id="modal-title" style="font-weight:800"></div>
            <button class="btn" onclick="hideModal()">×</button>
        </div>
        <div id="modal-body" style="padding:16px;max-height:70vh;overflow:auto"></div>
    </div>
</div>
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

## 🎯 記事作成チェックリスト

### HTML構造
- [ ] DOCTYPE html、meta charset UTF-8設定
- [ ] 言語切り替えボタンが正しく実装されている
- [ ] data-ja/data-en属性が全てのテキストに設定されている
- [ ] タブがある場合、適切なHTML構造を使用
- [ ] モーダルがある場合、統一されたモーダル構造を使用

### 🏷️ 技術タグシステム設定
- [ ] **meta name="tags"が適切に設定されている**（専門技術タグ）
- [ ] **meta name="category"が設定されている**（主要カテゴリ）
- [ ] **多言語メタデータが完備されている**（title:ja/en、description:ja/en）
- [ ] **記事内容と一致する技術分野タグが選択されている**

### JavaScript実装
- [ ] `setLanguage(lang)` 関数が実装されている
- [ ] `showTab(tabId)` 関数が実装されている（タブがある場合）
- [ ] `showModal(modalId, data)` 関数が実装されている（モーダルがある場合）
- [ ] `hideModal()` 関数が実装されている（モーダルがある場合）
- [ ] `showDetail(detailData)` 関数が実装されている（詳細表示がある場合）
- [ ] `initializeArticle()` 関数が実装され、最後に実行されている
- [ ] 全関数でconsole.logによるデバッグ出力を行っている
- [ ] onclick属性が統一関数名を使用している

### CSS・デザイン
- [ ] 既存デザインを可能な限り保持
- [ ] .lang-btn, .tab, .modal等の統一クラス使用
- [ ] レスポンシブ対応
- [ ] 視覚的な一貫性の保持

### データ構造
- [ ] data変数でグローバルデータを管理
- [ ] titleMap/bodyMap等でモーダル内容を定義（該当する場合）
- [ ] 適切な多言語データ構造

## 🚀 品質保証のポイント

1. **関数統一性**: 必ず統一された関数名を使用
2. **エラー防止**: 適切なnullチェックとエラーハンドリング
3. **パフォーマンス**: 不要なDOM操作を避ける
4. **保守性**: 明確なコードコメントとログ出力
5. **一貫性**: 既存記事との視覚的・機能的一貫性
6. **🏷️ タグ適切性**: 記事内容と一致する専門技術タグの設定

## 📋 技術タグ設定ガイダンス

### タグ選択の原則
- **主要技術**: 記事の中心となる技術分野を1-2個選択
- **関連技術**: サブテーマとなる関連技術を1-2個追加
- **地政学要素**: 国際的な内容の場合は地域・国名を含める
- **時代性**: 次世代、先端、新型等の時代を表すキーワード

### 具体例
```html
<!-- ミサイル防衛システム記事 -->
<meta name="tags" content="ミサイル防衛,IAMD,レーダー,米国">

<!-- AI活用記事 -->  
<meta name="tags" content="AI,先端技術,機械学習,防衛省">

<!-- サイバー攻撃分析記事 -->
<meta name="tags" content="サイバーセキュリティ,サイバー戦,APT,中国">
```

この仕様に準拠することで、システム全体の安定性と保守性が向上し、
記事間でのエラーを防止できます。また、技術タグシステムにより記事の発見性も大幅に向上します。
**必ず上記チェックリストを確認してから記事を公開してください。**