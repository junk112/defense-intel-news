# 防衛技術専門タグシステム仕様書

## 概要
記事の内容をより専門的で具体的な技術分野に分類し、ユーザーが関心のある技術領域の記事を効率的に発見できるタグシステムです。

## 主要技術カテゴリ

### 1. ミサイル防衛 (Missile Defense)
**優先度**: 1位 | **色系統**: 赤系

- **ミサイル防衛** (Missile Defense) - 包括的なミサイル防衛システム
- **IAMD** (Integrated Air and Missile Defense) - 統合防空ミサイル防衛
- **ゴールデン・ドーム** (Golden Dome) - 米国次世代ミサイル防衛システム

### 2. 航空防衛 (Air Defense) 
**優先度**: 2位 | **色系統**: 空色系

- **航空防衛** (Air Defense) - 航空脅威対処システム
- **戦闘機** (Fighter Aircraft) - 迎撃戦闘機システム
- **レーダー** (Radar) - 早期警戒・追跡レーダー

### 3. 核技術 (Nuclear Technology)
**優先度**: 3位 | **色系統**: 深紅系

- **核技術** (Nuclear Technology) - 核関連技術全般
- **核兵器** (Nuclear Weapon) - 核兵器システム
- **核不拡散** (Nuclear Nonproliferation) - 不拡散体制

### 4. C4ISR (Command, Control, Communications, Computers, Intelligence, Surveillance, Reconnaissance)
**優先度**: 4位 | **色系統**: 青系

- **C4ISR** - 指揮統制・情報通信・偵察
- **ICT** (Information and Communication Technology) - 情報通信技術
- **次世代通信** (Next-Gen Communications) - 5G/6G等先進通信

### 5. AI・先端技術 (AI & Advanced Technology)
**優先度**: 5位 | **色系統**: 紫系

- **AI** (Artificial Intelligence) - 人工知能技術
- **先端技術** (Advanced Technology) - 先進的軍事技術
- **機械学習** (Machine Learning) - ML/深層学習

### 6. サイバーセキュリティ (Cybersecurity)
**優先度**: 6位 | **色系統**: 緑系

- **サイバーセキュリティ** (Cybersecurity) - サイバー防御
- **サイバー戦** (Cyber Warfare) - サイバー攻撃・防御

### 7. 宇宙技術 (Space Technology)
**優先度**: 7位 | **色系統**: インディゴ系

- **宇宙防衛** (Space Defense) - 宇宙領域での軍事活動
- **衛星技術** (Satellite Technology) - 軍用衛星システム

### 8. 海上・海洋技術 (Naval Technology)
**優先度**: 8位 | **色系統**: ティール系

- **海上システム** (Naval Systems) - 艦艇・海上プラットフォーム
- **潜水艦** (Submarine) - 潜水艦技術
- **対艦ミサイル** (Anti-Ship Missile) - 対艦攻撃システム

### 9. 陸上技術 (Ground Systems)
**優先度**: 9位 | **色系統**: ライム・グリーン系

- **陸上システム** (Ground Systems) - 地上戦闘システム
- **砲兵** (Artillery) - 火砲・ロケットシステム
- **装甲車両** (Armored Vehicle) - 戦車・装甲車

### 10. インテリジェンス (Intelligence)
**優先度**: 10位 | **色系統**: スレート・グレー系

- **インテリジェンス** (Intelligence) - 情報収集・分析
- **SIGINT** (Signals Intelligence) - 通信・電子情報収集

### 11. シミュレーション (Simulation)
**優先度**: 11位 | **色系統**: ニュートラル系

- **シミュレーション** (Simulation) - 軍事シミュレーション
- **デジタルツイン** (Digital Twin) - デジタル双子技術

### 12. ロジスティクス (Logistics)
**優先度**: 12位 | **色系統**: アンバー・イエロー系

- **ロジスティクス** (Logistics) - 軍事ロジスティクス
- **サプライチェーン** (Supply Chain) - 装備品供給網

### 13. 国際関係 (International Affairs)
**優先度**: 13位 | **色系統**: オレンジ系

- **国際情勢** (International Affairs) - 国際安全保障情勢
- **地政学** (Geopolitics) - 地政学的分析

### 14. 政策・戦略 (Policy & Strategy)
**優先度**: 14位 | **色系統**: ローズ・ピンク系

- **防衛政策** (Defense Policy) - 防衛政策・計画
- **戦略** (Strategy) - 軍事戦略・ドクトリン

## 自動タグ付けシステム

### タグ推測ロジック
1. **ファイル名解析**: 記事ファイル名からキーワード抽出
2. **タイトル解析**: 記事タイトルからキーワード抽出  
3. **既存タグ活用**: メタタグ`tags`の内容を参照
4. **複合マッチング**: 複数キーワードの組み合わせ判定

### 記事別推奨タグ設定

#### Golden Dome Dashboard
```html
<meta name="tags" content="ゴールデン・ドーム,ミサイル防衛,IAMD,米国,次世代技術">
```
**推測タグ**: `golden_dome`, `missile_defense`, `iamd`

#### MOD AI Dashboard  
```html
<meta name="tags" content="防衛省,AI,先端技術,ICT,機械学習">
```
**推測タグ**: `ai`, `advanced_tech`, `ict`, `machine_learning`

#### Defense Info Strategy
```html
<meta name="tags" content="防衛省,C4ISR,ICT戦略,次世代通信,情報システム">
```
**推測タグ**: `c4isr`, `ict`, `next_gen_comm`

#### Iran vs Israel Analysis
```html
<meta name="tags" content="イラン,イスラエル,地政学,核開発,中東情勢">
```
**推測タグ**: `international_affairs`, `geopolitics`, `nuclear_tech`

## 表示システム

### ホームページカード表示
```tsx
// 主要タグ（最大3個）をバッジ形式で表示
<div className="flex flex-wrap gap-2">
  {primaryTags.map(tag => (
    <Badge 
      key={tag.id}
      className={`${tag.bgColor} ${tag.color} ${tag.borderColor} border`}
    >
      {language === 'ja' ? tag.nameJa : tag.nameEn}
    </Badge>
  ))}
</div>
```

### 記事詳細ページ
```tsx
// 全タグをカテゴリ別にグループ化して表示
const groupedTags = groupTagsByCategory(article.techTags);
```

## カスタマイズ・拡張

### 新規タグ追加手順
1. `src/lib/techTags.ts` の `TECH_TAGS` に定義追加
2. 適切な `TechCategory` に分類
3. 色系統の一貫性を保持
4. `inferTechTags` 関数にキーワードマッピング追加

### カラーパレット設計原則
- **軍事・防衛系**: 赤系（ミサイル、核など）
- **技術・通信系**: 青・紫系（AI、ICT、C4ISRなど）  
- **海洋・航空系**: 水色・緑系（海軍、空軍など）
- **情報・分析系**: グレー・ニュートラル系
- **国際・政策系**: オレンジ・ピンク系

### API連携
```typescript
// 技術タグでのフィルタリング
const filteredArticles = articles.filter(article => 
  article.techTags.some(tagId => 
    selectedTechCategories.includes(TECH_TAGS[tagId]?.category)
  )
);
```

## データ構造拡張

### Article型への追加
```typescript
interface Article {
  // 既存フィールド...
  techTags: string[];        // 技術タグIDの配列
  primaryTechTags: string[]; // 表示用主要タグ（最大3個）
}
```

### 検索・フィルター機能
- **技術カテゴリ別フィルター**
- **複数タグ組み合わせ検索**  
- **タグベース関連記事推薦**
- **タグ人気度ランキング**

## 品質管理

### タグ付け品質チェック
- [ ] 記事内容とタグの関連性確認
- [ ] 主要タグ数が3個以下
- [ ] カテゴリ分類の適切性
- [ ] 多言語表記の正確性

### パフォーマンス考慮事項
- タグ検索のインデックス化
- 人気タグのキャッシュ化
- 関連記事計算の最適化
- 表示用タグ数の制限

この技術タグシステムにより、ユーザーは具体的な技術分野で記事を効率的に発見でき、専門性の高いニュースポータルとしての価値が向上します。