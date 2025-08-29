'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { UILanguage } from '@/lib/types';

// 言語コンテキスト
interface LanguageContextType {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// LocalStorageキー
const LANGUAGE_STORAGE_KEY = 'defense-intel-language';

// ブラウザの言語設定から初期言語を判定
const detectInitialLanguage = (): UILanguage => {
  if (typeof window === 'undefined') return 'ja';
  
  // LocalStorageから保存済み設定を取得
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage === 'ja' || savedLanguage === 'en') {
    return savedLanguage;
  }
  
  // ブラウザの言語設定をチェック
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ja')) {
    return 'ja';
  }
  
  // デフォルトは日本語
  return 'ja';
};

// 言語プロバイダーコンポーネント
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<UILanguage>('ja');
  const [isInitialized, setIsInitialized] = useState(false);

  // クライアントサイドでの初期化
  useEffect(() => {
    const initialLang = detectInitialLanguage();
    setLanguageState(initialLang);
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: UILanguage) => {
    setLanguageState(lang);
    // LocalStorageに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'ja' ? 'en' : 'ja';
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 言語フック
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// 言語別テキスト取得ヘルパー関数
export function getLocalizedText<T extends Record<string, any>>(
  obj: T,
  field: string,
  language: UILanguage
): string {
  const enField = `${field}En`;
  const jaField = `${field}Ja`;
  
  // 優先順位: 言語別フィールド → デフォルトフィールド
  if (language === 'en' && obj[enField]) {
    return obj[enField];
  }
  if (language === 'ja' && obj[jaField]) {
    return obj[jaField];
  }
  
  // デフォルトフィールド
  return obj[field] || '';
}

// 言語別ラベル・定数
export const LANGUAGE_LABELS = {
  ja: {
    language: '日本語',
    switchTo: 'English',
    readMore: '続きを読む',
    readTime: '読了時間',
    minutes: '分',
    articlesCount: '件の記事',
    search: '検索...',
    category: 'カテゴリ',
    all: 'すべて',
    sortBy: '並び替え',
    latest: '新着順',
    oldest: '古い順',
    titleAsc: 'タイトル昇順',
    titleDesc: 'タイトル降順',
    noArticles: '記事が見つかりませんでした',
    japaneseOnly: '日本語記事',
    englishOnly: 'English Only',
    bilingualArticle: '日英対応',
    home: 'ホーム',
    articles: '記事一覧',
    upload: 'アップロード'
  },
  en: {
    language: 'English',
    switchTo: '日本語',
    readMore: 'Read More',
    readTime: 'Read Time',
    minutes: 'min',
    articlesCount: 'articles',
    search: 'Search...',
    category: 'Category',
    all: 'All',
    sortBy: 'Sort by',
    latest: 'Latest',
    oldest: 'Oldest',
    titleAsc: 'Title A-Z',
    titleDesc: 'Title Z-A',
    noArticles: 'No articles found',
    japaneseOnly: 'Japanese Only',
    englishOnly: 'English Article',
    bilingualArticle: 'Bilingual',
    home: 'Home',
    articles: 'Articles',
    upload: 'Upload'
  }
};

// 言語バッジコンポーネント
export function LanguageBadge({ languages }: { languages: string[] }) {
  const { language } = useLanguage();
  const labels = LANGUAGE_LABELS[language];
  
  if (languages.includes('both')) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        {labels.bilingualArticle}
      </span>
    );
  }
  
  if (languages.includes('ja') && !languages.includes('en')) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {labels.japaneseOnly}
      </span>
    );
  }
  
  if (languages.includes('en') && !languages.includes('ja')) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
        {labels.englishOnly}
      </span>
    );
  }
  
  return null;
}