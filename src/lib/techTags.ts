/**
 * 防衛技術専門タグシステム
 * 記事内容に応じた専門的な技術タグとカラーを管理
 */

export interface TechTag {
  id: string;
  nameJa: string;
  nameEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description?: string;
  category: TechCategory;
}

export type TechCategory = 
  | 'missile_defense'    // ミサイル防衛
  | 'air_defense'       // 航空防衛
  | 'c4isr'            // 指揮統制・情報通信
  | 'ai_tech'          // AI・先端技術
  | 'cyber'            // サイバーセキュリティ
  | 'space'            // 宇宙技術
  | 'naval'            // 海上・海洋技術
  | 'ground'           // 陸上技術
  | 'nuclear'          // 核技術・核拡散
  | 'intelligence'     // インテリジェンス
  | 'international'    // 国際関係
  | 'policy'          // 政策・戦略
  | 'logistics'        // ロジスティクス
  | 'simulation'       // シミュレーション
  | 'other';           // その他

// 専門技術タグ定義
export const TECH_TAGS: Record<string, TechTag> = {
  // ミサイル防衛関連
  missile_defense: {
    id: 'missile_defense',
    nameJa: 'ミサイル防衛',
    nameEn: 'Missile Defense',
    color: 'text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    category: 'missile_defense'
  },
  iamd: {
    id: 'iamd',
    nameJa: 'IAMD',
    nameEn: 'IAMD',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    description: 'Integrated Air and Missile Defense',
    category: 'missile_defense'
  },
  golden_dome: {
    id: 'golden_dome',
    nameJa: 'ゴールデン・ドーム',
    nameEn: 'Golden Dome',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    category: 'missile_defense'
  },
  
  // C4ISR・情報通信関連
  c4isr: {
    id: 'c4isr',
    nameJa: 'C4ISR',
    nameEn: 'C4ISR',
    color: 'text-blue-800',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Command, Control, Communications, Computers, Intelligence, Surveillance and Reconnaissance',
    category: 'c4isr'
  },
  ict: {
    id: 'ict',
    nameJa: 'ICT',
    nameEn: 'ICT',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    description: 'Information and Communication Technology',
    category: 'c4isr'
  },
  next_gen_comm: {
    id: 'next_gen_comm',
    nameJa: '次世代通信',
    nameEn: 'Next-Gen Communications',
    color: 'text-indigo-800',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    category: 'c4isr'
  },
  
  // AI・先端技術関連
  ai: {
    id: 'ai',
    nameJa: 'AI',
    nameEn: 'Artificial Intelligence',
    color: 'text-purple-800',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    category: 'ai_tech'
  },
  advanced_tech: {
    id: 'advanced_tech',
    nameJa: '先端技術',
    nameEn: 'Advanced Technology',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    category: 'ai_tech'
  },
  machine_learning: {
    id: 'machine_learning',
    nameJa: '機械学習',
    nameEn: 'Machine Learning',
    color: 'text-violet-800',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    category: 'ai_tech'
  },
  
  // サイバーセキュリティ関連
  cyber_security: {
    id: 'cyber_security',
    nameJa: 'サイバーセキュリティ',
    nameEn: 'Cybersecurity',
    color: 'text-green-800',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    category: 'cyber'
  },
  cyber_warfare: {
    id: 'cyber_warfare',
    nameJa: 'サイバー戦',
    nameEn: 'Cyber Warfare',
    color: 'text-emerald-800',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    category: 'cyber'
  },
  
  // 宇宙技術関連
  space_defense: {
    id: 'space_defense',
    nameJa: '宇宙防衛',
    nameEn: 'Space Defense',
    color: 'text-indigo-800',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    category: 'space'
  },
  satellite: {
    id: 'satellite',
    nameJa: '衛星技術',
    nameEn: 'Satellite Technology',
    color: 'text-sky-800',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    category: 'space'
  },
  
  // インテリジェンス関連
  intelligence: {
    id: 'intelligence',
    nameJa: 'インテリジェンス',
    nameEn: 'Intelligence',
    color: 'text-slate-800',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    category: 'intelligence'
  },
  sigint: {
    id: 'sigint',
    nameJa: 'SIGINT',
    nameEn: 'SIGINT',
    color: 'text-gray-800',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    description: 'Signals Intelligence',
    category: 'intelligence'
  },
  
  // 国際関係関連
  international_affairs: {
    id: 'international_affairs',
    nameJa: '国際情勢',
    nameEn: 'International Affairs',
    color: 'text-orange-800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    category: 'international'
  },
  geopolitics: {
    id: 'geopolitics',
    nameJa: '地政学',
    nameEn: 'Geopolitics',
    color: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    category: 'international'
  },
  
  // 政策・戦略関連
  defense_policy: {
    id: 'defense_policy',
    nameJa: '防衛政策',
    nameEn: 'Defense Policy',
    color: 'text-rose-800',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    category: 'policy'
  },
  strategy: {
    id: 'strategy',
    nameJa: '戦略',
    nameEn: 'Strategy',
    color: 'text-pink-800',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    category: 'policy'
  },
  
  // 航空防衛関連
  air_defense: {
    id: 'air_defense',
    nameJa: '航空防衛',
    nameEn: 'Air Defense',
    color: 'text-sky-800',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    category: 'air_defense'
  },
  fighter_aircraft: {
    id: 'fighter_aircraft',
    nameJa: '戦闘機',
    nameEn: 'Fighter Aircraft',
    color: 'text-sky-700',
    bgColor: 'bg-sky-100',
    borderColor: 'border-sky-300',
    category: 'air_defense'
  },
  radar: {
    id: 'radar',
    nameJa: 'レーダー',
    nameEn: 'Radar',
    color: 'text-cyan-800',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    category: 'air_defense'
  },
  
  // 海上・海洋技術関連
  naval_systems: {
    id: 'naval_systems',
    nameJa: '海上システム',
    nameEn: 'Naval Systems',
    color: 'text-teal-800',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    category: 'naval'
  },
  submarine: {
    id: 'submarine',
    nameJa: '潜水艦',
    nameEn: 'Submarine',
    color: 'text-teal-700',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-300',
    category: 'naval'
  },
  anti_ship: {
    id: 'anti_ship',
    nameJa: '対艦ミサイル',
    nameEn: 'Anti-Ship Missile',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    category: 'naval'
  },
  
  // 陸上技術関連
  ground_systems: {
    id: 'ground_systems',
    nameJa: '陸上システム',
    nameEn: 'Ground Systems',
    color: 'text-lime-800',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-200',
    category: 'ground'
  },
  artillery: {
    id: 'artillery',
    nameJa: '砲兵',
    nameEn: 'Artillery',
    color: 'text-lime-700',
    bgColor: 'bg-lime-100',
    borderColor: 'border-lime-300',
    category: 'ground'
  },
  armored_vehicle: {
    id: 'armored_vehicle',
    nameJa: '装甲車両',
    nameEn: 'Armored Vehicle',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    category: 'ground'
  },
  
  // 核技術関連
  nuclear_tech: {
    id: 'nuclear_tech',
    nameJa: '核技術',
    nameEn: 'Nuclear Technology',
    color: 'text-red-900',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    category: 'nuclear'
  },
  nuclear_weapon: {
    id: 'nuclear_weapon',
    nameJa: '核兵器',
    nameEn: 'Nuclear Weapon',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    category: 'nuclear'
  },
  nonproliferation: {
    id: 'nonproliferation',
    nameJa: '核不拡散',
    nameEn: 'Nuclear Nonproliferation',
    color: 'text-orange-800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    category: 'nuclear'
  },
  
  // ロジスティクス関連
  logistics: {
    id: 'logistics',
    nameJa: 'ロジスティクス',
    nameEn: 'Logistics',
    color: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    category: 'logistics'
  },
  supply_chain: {
    id: 'supply_chain',
    nameJa: 'サプライチェーン',
    nameEn: 'Supply Chain',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    category: 'logistics'
  },
  
  // シミュレーション関連
  simulation: {
    id: 'simulation',
    nameJa: 'シミュレーション',
    nameEn: 'Simulation',
    color: 'text-neutral-800',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200',
    category: 'simulation'
  },
  digital_twin: {
    id: 'digital_twin',
    nameJa: 'デジタルツイン',
    nameEn: 'Digital Twin',
    color: 'text-stone-800',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-200',
    category: 'simulation'
  }
};

// 記事ファイル名やタイトルから適切な技術タグを推測
export function inferTechTags(fileName: string, title: string, existingTags: string[]): string[] {
  const techTagIds: string[] = [];
  const lowerFileName = fileName.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const combinedText = (lowerFileName + ' ' + lowerTitle + ' ' + existingTags.join(' ')).toLowerCase();

  // Golden Dome関連
  if (combinedText.includes('golden') || combinedText.includes('ゴールデン') || combinedText.includes('dome')) {
    techTagIds.push('golden_dome', 'missile_defense', 'iamd');
  }

  // MOD AI Dashboard関連
  if (combinedText.includes('mod') && combinedText.includes('ai')) {
    techTagIds.push('ai', 'advanced_tech', 'ict');
  }

  // Defense Info Strategy関連
  if (combinedText.includes('defense') && combinedText.includes('info')) {
    techTagIds.push('c4isr', 'ict', 'next_gen_comm');
  }

  // Iran vs Israel関連
  if (combinedText.includes('iran') || combinedText.includes('israel') || combinedText.includes('イラン') || combinedText.includes('イスラエル')) {
    techTagIds.push('international_affairs', 'geopolitics', 'intelligence');
  }

  // 一般的なキーワードマッチング
  const keywordMap: Record<string, string[]> = {
    'ミサイル': ['missile_defense'],
    'missile': ['missile_defense'],
    'iamd': ['iamd', 'missile_defense'],
    'c4isr': ['c4isr'],
    'ict': ['ict'],
    '情報通信': ['ict', 'c4isr'],
    'ai': ['ai'],
    '人工知能': ['ai'],
    '機械学習': ['machine_learning'],
    'サイバー': ['cyber_security'],
    'cyber': ['cyber_security'],
    '宇宙': ['space_defense'],
    'space': ['space_defense'],
    '衛星': ['satellite'],
    'satellite': ['satellite'],
    'インテリジェンス': ['intelligence'],
    'intelligence': ['intelligence'],
    '国際': ['international_affairs'],
    'international': ['international_affairs'],
    '地政学': ['geopolitics'],
    'geopolitics': ['geopolitics'],
    '防衛政策': ['defense_policy'],
    'policy': ['defense_policy'],
    '戦略': ['strategy'],
    'strategy': ['strategy']
  };

  Object.entries(keywordMap).forEach(([keyword, tags]) => {
    if (combinedText.includes(keyword)) {
      techTagIds.push(...tags);
    }
  });

  // 重複削除
  return [...new Set(techTagIds)];
}

// 技術タグIDから表示用のタグオブジェクトを取得
export function getTechTag(tagId: string): TechTag | undefined {
  return TECH_TAGS[tagId];
}

// 技術タグIDのリストからソートされた表示用タグリストを取得
export function getTechTags(tagIds: string[]): TechTag[] {
  return tagIds
    .map(id => TECH_TAGS[id])
    .filter((tag): tag is TechTag => tag !== undefined)
    .sort((a, b) => a.nameJa.localeCompare(b.nameJa));
}

// カテゴリ別のタググループ化
export function groupTagsByCategory(tagIds: string[]): Record<TechCategory, TechTag[]> {
  const groups: Record<TechCategory, TechTag[]> = {
    missile_defense: [],
    air_defense: [],
    c4isr: [],
    ai_tech: [],
    cyber: [],
    space: [],
    naval: [],
    ground: [],
    nuclear: [],
    intelligence: [],
    international: [],
    policy: [],
    logistics: [],
    simulation: [],
    other: []
  };

  tagIds.forEach(id => {
    const tag = TECH_TAGS[id];
    if (tag) {
      groups[tag.category].push(tag);
    }
  });

  return groups;
}

// 技術タグの重要度によるソート（カテゴリ順 + 名前順）
export function sortTechTags(tags: TechTag[]): TechTag[] {
  const categoryPriority: Record<TechCategory, number> = {
    missile_defense: 1,
    air_defense: 2,
    nuclear: 3,
    c4isr: 4,
    ai_tech: 5,
    cyber: 6,
    space: 7,
    naval: 8,
    ground: 9,
    intelligence: 10,
    simulation: 11,
    logistics: 12,
    international: 13,
    policy: 14,
    other: 15
  };

  return tags.sort((a, b) => {
    const priorityDiff = categoryPriority[a.category] - categoryPriority[b.category];
    if (priorityDiff !== 0) return priorityDiff;
    return a.nameJa.localeCompare(b.nameJa);
  });
}