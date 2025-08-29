'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Article } from '@/lib/types';
import { useLanguage, getLocalizedText, LANGUAGE_LABELS } from '@/hooks/useLanguage';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ArticleList } from '@/components/articles/ArticleList';

interface ArticlesPageClientProps {
  articles: Article[];
}

export default function ArticlesPageClient({ articles }: ArticlesPageClientProps) {
  const { language } = useLanguage();
  const labels = LANGUAGE_LABELS[language];
  
  // タイトル・サブタイトルの言語別表示
  const siteTitle = language === 'ja' ? '防衛情報インテリジェンス' : 'Defense Intelligence';
  const siteSubtitle = language === 'ja' ? 'Defense Intelligence Portal' : '防衛情報ポータル';
  const pageTitle = language === 'ja' ? '記事一覧' : 'Articles';
  const pageDescription = language === 'ja' 
    ? `防衛・安全保障分野の最新記事と分析レポート (${articles.length}件)`
    : `Latest articles and analysis reports on defense and security (${articles.length} articles)`;

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{siteTitle}</h1>
                  <p className="text-sm text-gray-600">{siteSubtitle}</p>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                {labels.home}
              </Link>
              <Link href="/articles" className="text-blue-600 font-medium">
                {labels.articles}
              </Link>
              <Link href="/admin/upload" className="text-gray-700 hover:text-blue-600 font-medium">
                {labels.upload}
              </Link>
              <LanguageToggle />
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
          <p className="text-gray-600">
            {pageDescription}
          </p>
        </div>
        
        <ArticleList initialArticles={articles} />
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">{siteTitle}</span>
            </div>
            <p className="text-gray-400 mb-8">
              {siteSubtitle} - {language === 'ja' ? '防衛・安全保障専門情報サイト' : 'Defense & Security Information Portal'}
            </p>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500 text-sm">
                © 2025 Defense Intelligence Portal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}