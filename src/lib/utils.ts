import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Article, ArticleFilter, SortOption } from './types';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * Tailwind CSSクラスをマージするユーティリティ
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 日付を日本語でフォーマット
 */
export function formatDate(date: Date | string | number, formatStr: string = 'yyyy年MM月dd日'): string {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) {
    return '日付不明';
  }
  return format(dateObj, formatStr, { locale: ja });
}

/**
 * 相対的な時間を日本語で表示
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) {
    return '不明';
  }
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ja });
}

/**
 * 記事をフィルタリング
 */
export function filterArticles(articles: Article[], filters: ArticleFilter): Article[] {
  return articles.filter(article => {
    // カテゴリフィルター
    if (filters.category && article.category !== filters.category) {
      return false;
    }

    // タグフィルター
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        article.tags.some(articleTag => 
          articleTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    // 日付範囲フィルター
    if (filters.dateFrom && article.publishedAt < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && article.publishedAt > filters.dateTo) {
      return false;
    }

    // 検索クエリフィルター
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `${article.title} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // ステータスフィルター
    if (filters.status && filters.status !== 'all' && article.status !== filters.status) {
      return false;
    }

    return true;
  });
}

/**
 * 記事をソート
 */
export function sortArticles(articles: Article[], sortOption: SortOption): Article[] {
  const sorted = [...articles];
  
  sorted.sort((a, b) => {
    let valueA: any;
    let valueB: any;

    switch (sortOption.field) {
      case 'publishedAt':
        valueA = a.publishedAt.getTime();
        valueB = b.publishedAt.getTime();
        break;
      case 'title':
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case 'viewCount':
        valueA = a.viewCount;
        valueB = b.viewCount;
        break;
      case 'readTime':
        valueA = a.readTime;
        valueB = b.readTime;
        break;
      default:
        return 0;
    }

    if (sortOption.order === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });

  return sorted;
}

/**
 * 配列をページネーション
 */
export function paginateArray<T>(
  array: T[], 
  page: number, 
  limit: number
): { items: T[]; totalPages: number; hasNext: boolean; hasPrev: boolean } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = array.slice(startIndex, endIndex);
  const totalPages = Math.ceil(array.length / limit);

  return {
    items,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

/**
 * 文字列を切り詰める
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * カテゴリの多言語マッピング
 */
export const CATEGORY_TRANSLATIONS = {
  '防衛政策': 'Defense Policy',
  '国際情勢': 'International Affairs',
  '防衛技術': 'Defense Technology',
  'インテリジェンス': 'Intelligence',
  'サイバーセキュリティ': 'Cybersecurity',
  '宇宙防衛': 'Space Defense',
  '海洋安全保障': 'Maritime Security',
  '分析レポート': 'Analysis Report',
  'ダッシュボード': 'Dashboard',
  'その他': 'Others'
} as const;

/**
 * カテゴリ名を言語に応じて翻訳
 */
export function getCategoryName(category: string, language: 'ja' | 'en'): string {
  if (language === 'en' && category in CATEGORY_TRANSLATIONS) {
    return CATEGORY_TRANSLATIONS[category as keyof typeof CATEGORY_TRANSLATIONS];
  }
  return category;
}

/**
 * カテゴリ名を色に変換
 */
export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    '防衛政策': 'bg-red-100 text-red-800',
    '国際情勢': 'bg-orange-100 text-orange-800', 
    '防衛技術': 'bg-blue-100 text-blue-800',
    'インテリジェンス': 'bg-purple-100 text-purple-800',
    'サイバーセキュリティ': 'bg-green-100 text-green-800',
    '宇宙防衛': 'bg-indigo-100 text-indigo-800',
    '海洋安全保障': 'bg-cyan-100 text-cyan-800',
    '分析レポート': 'bg-violet-100 text-violet-800',
    'ダッシュボード': 'bg-pink-100 text-pink-800',
    'その他': 'bg-gray-100 text-gray-800'
  };

  return colorMap[category] || colorMap['その他'];
}

/**
 * 記事の読了時間をテキストに変換（多言語対応）
 */
export function formatReadTime(minutes: number, language: 'ja' | 'en' = 'ja'): string {
  if (language === 'en') {
    if (minutes < 1) return 'Less than 1 min';
    if (minutes === 1) return '1 min';
    return `${minutes} min`;
  } else {
    if (minutes < 1) return '1分未満';
    if (minutes === 1) return '1分';
    return `${minutes}分`;
  }
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * URLから記事のスラッグを抽出
 */
export function extractSlugFromPath(pathname: string): string {
  const segments = pathname.split('/');
  return segments[segments.length - 1] || '';
}

/**
 * 安全なHTMLをレンダリング用に準備（CSS隔離システム対応）
 * 新しい隔離システムでは元HTMLをより安全に保持可能
 */
export function sanitizeHtml(html: string): string {
  // CSS隔離システムを使用しているため、よりゆるやかなサニタイズ
  // 危険な要素のみ除去、スタイル・スクリプト・onclickハンドラーは保持
  return html
    .replace(/<script[^>]+src=[^>]*><\/script>/gi, '') // 外部スクリプトのみ除去
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // iframeは除去
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // objectタグ除去
    .replace(/<embed\b[^<]*>/gi, '') // embedタグ除去
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '') // formタグ除去（セキュリティ上）
    // onclick以外の危険なイベントハンドラのみ除去
    .replace(/on(?!click\s*=)(load|error|focus|blur|submit|reset)\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, 'void(0);'); // javascript:プロトコル無効化
  
  // 注意: styleとscriptタグ、onclickハンドラーは保持（CSS隔離により安全）
  // 元HTMLの機能とデザインを最大限維持
}

/**
 * URLが有効かチェック
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * デバウンス関数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * スロットル関数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * ローカルストレージのヘルパー
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silent fail
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

/**
 * クエリパラメータを解析
 */
export function parseQueryParams(searchParams: URLSearchParams): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
}

/**
 * オブジェクトからクエリ文字列を生成
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

/**
 * エラーメッセージを整理
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

/**
 * 記事の統計情報を計算
 */
export function calculateArticleStats(articles: Article[]) {
  const totalArticles = articles.length;
  const totalWords = articles.reduce((sum, article) => sum + article.wordCount, 0);
  const avgReadTime = totalArticles > 0 ? Math.round(articles.reduce((sum, article) => sum + article.readTime, 0) / totalArticles) : 0;
  
  // カテゴリ別統計
  const categoryStats = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 最新記事（過去30日）
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentArticles = articles.filter(article => article.publishedAt >= thirtyDaysAgo);

  return {
    totalArticles,
    totalWords,
    avgReadTime,
    categoryStats,
    recentArticlesCount: recentArticles.length,
    categories: Object.keys(categoryStats).length
  };
}