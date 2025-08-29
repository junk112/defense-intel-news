// 言語関連の型定義
export type ArticleLanguage = 'ja' | 'en' | 'both';
export type UILanguage = 'ja' | 'en';

// 記事関連の型定義

export interface Article {
  id: string;                           // ファイル名ベースのユニークID
  slug: string;                         // URL用スラッグ (ファイル名から拡張子を除去)
  title: string;                        // HTMLのtitleタグから抽出（デフォルト言語）
  titleEn?: string;                     // 英語タイトル（meta name="title:en"から抽出）
  titleJa?: string;                     // 日本語タイトル（meta name="title:ja"から抽出）
  publishedAt: Date;                    // ファイル名の日付部分から抽出
  content: string;                      // HTML記事の全内容
  contentLanguages: ArticleLanguage[];  // 記事がサポートする言語（'ja', 'en', 'both'）
  excerpt: string;                      // 記事の要約（最初の段落または指定文字数）
  excerptEn?: string;                   // 英語要約
  excerptJa?: string;                   // 日本語要約
  category: string;                     // カテゴリ（ファイル名や内容から推測）
  tags: string[];                       // タグ（記事内容から自動抽出）
  techTags: string[];                   // 技術タグIDの配列
  primaryTechTags: string[];            // 表示用主要タグ（最大3個）
  readTime: number;                     // 推定読了時間（分）
  wordCount: number;                    // 文字数
  lastModified: Date;                   // 最終更新日時
  status: 'published' | 'draft';        // 公開状態
  featured: boolean;                    // 注目記事フラグ
  viewCount: number;                    // 閲覧数（将来拡張）
  author: string;                       // 著者（デフォルト値またはメタタグから）
  featuredImage?: string;               // 記事のメイン画像URL（og:image、最初のimg、metaから抽出）
  images: string[];                     // 記事内の全画像URL一覧
}

export interface ArticleMetadata {
  title: string;
  description?: string;
  author?: string;
  publishedAt: Date;
  category: string;
  tags: string[];
  readTime: number;
  wordCount: number;
}

export interface ParsedArticleData {
  title: string;
  content: string;
  excerpt: string;
  wordCount: number;
  readTime: number;
  headings: Heading[];
  meta: {
    author?: string;
    description?: string;
    keywords?: string;
  };
}

export interface Heading {
  level: number;        // h1, h2, h3など
  text: string;         // 見出しテキスト
  id: string;          // アンカー用ID
}

export interface ArticleFilter {
  category?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
  status?: 'published' | 'draft' | 'all';
  featured?: boolean;
}

export interface PaginatedArticles {
  articles: Article[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ArticleSearchResult {
  article: Article;
  matchType: 'title' | 'content' | 'tag' | 'category';
  relevanceScore: number;
}

// カテゴリ関連の型定義
export const ARTICLE_CATEGORIES = {
  DEFENSE_POLICY: '防衛政策',
  INTERNATIONAL: '国際情勢',
  TECHNOLOGY: '防衛技術',
  INTELLIGENCE: 'インテリジェンス',
  CYBER_SECURITY: 'サイバーセキュリティ',
  SPACE_DEFENSE: '宇宙防衛',
  MARITIME: '海洋安全保障',
  ANALYSIS: '分析レポート',
  DASHBOARD: 'ダッシュボード',
  OTHER: 'その他'
} as const;

export type ArticleCategory = typeof ARTICLE_CATEGORIES[keyof typeof ARTICLE_CATEGORIES];

export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  count: number;
}

// UI関連の型定義
export interface SortOption {
  field: 'publishedAt' | 'title' | 'viewCount' | 'readTime';
  order: 'asc' | 'desc';
  label: string;
}

export interface ViewMode {
  type: 'grid' | 'list';
  label: string;
}

// API関連の型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ArticleListQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'date' | 'title' | 'views';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
}

export interface ArticleListResponse {
  articles: Article[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    availableCategories: CategoryInfo[];
    availableTags: string[];
    dateRange: {
      earliest: Date;
      latest: Date;
    };
  };
}

export interface ArticleDetailResponse {
  article: Article;
  relatedArticles: Article[];
  tableOfContents: Heading[];
}

// ファイルアップロード関連の型定義
export interface UploadRequest {
  file: File;
  category?: string;
  featured?: boolean;
  tags?: string[];
}

export interface UploadResponse {
  success: boolean;
  article?: Article;
  message: string;
  errors?: string[];
}

// 統計情報の型定義
export interface SiteStats {
  totalArticles: number;
  totalCategories: number;
  totalViews: number;
  avgReadTime: number;
  recentActivity: {
    newArticles: number;
    updatedArticles: number;
    period: 'day' | 'week' | 'month';
  };
  categoryStats: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  popularArticles: Article[];
}

// エラー処理の型定義
export interface AppError {
  type: 'validation' | 'network' | 'server' | 'permission';
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// 管理者関連の型定義
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin: Date;
  permissions: string[];
}

export interface AdminActivity {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  target: 'article' | 'category' | 'user';
  targetId: string;
  timestamp: Date;
  details?: Record<string, any>;
}

// テーマ関連の型定義
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
}

// 設定関連の型定義
export interface AppConfig {
  site: {
    name: string;
    description: string;
    url: string;
    logo?: string;
  };
  features: {
    comments: boolean;
    search: boolean;
    categories: boolean;
    tags: boolean;
    darkMode: boolean;
  };
  pagination: {
    articlesPerPage: number;
    maxPages: number;
  };
  upload: {
    maxFileSize: number;
    allowedExtensions: string[];
  };
}

// ユーティリティ型定義
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// React関連の型定義
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Hook関連の型定義
export interface UseArticlesOptions {
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: ArticleFilter;
  initialSort?: SortOption;
}

export interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
}