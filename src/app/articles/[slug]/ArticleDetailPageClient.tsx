'use client';

import Link from 'next/link';
import ArticleDetail from '@/components/articles/ArticleDetail';
import { Article } from '@/lib/types';
import { useLanguage, getLocalizedText, LANGUAGE_LABELS, LanguageBadge } from '@/hooks/useLanguage';
import { LanguageToggleCompact } from '@/components/common/LanguageToggle';
import { Shield } from 'lucide-react';

interface ArticleDetailPageClientProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleDetailPageClient({ 
  article, 
  relatedArticles 
}: ArticleDetailPageClientProps) {
  const { language } = useLanguage();
  const labels = LANGUAGE_LABELS[language];
  
  // 言語に応じたタイトルと要約を取得
  const articleTitle = getLocalizedText(article, 'title', language);
  const articleExcerpt = getLocalizedText(article, 'excerpt', language);
  
  // タイトル・サブタイトルの言語別表示
  const siteTitle = language === 'ja' ? '防衛情報インテリジェンス' : 'Defense Intelligence';
  const siteSubtitle = language === 'ja' ? 'Defense Intelligence Portal' : '防衛情報ポータル';
  
  return (
    <div className="min-h-screen">
      {/* ヘッダー - 言語対応版 */}
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
              <Link href="/articles" className="text-gray-700 hover:text-blue-600 font-medium">
                {labels.articles}
              </Link>
              <Link href="/admin/upload" className="text-gray-700 hover:text-blue-600 font-medium">
                {labels.upload}
              </Link>
              <LanguageToggleCompact />
            </nav>
          </div>
        </div>
      </header>

      {/* パンくずリスト - 言語対応 */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              {labels.home}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/articles" className="hover:text-blue-600">
              {labels.articles}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 truncate max-w-md">
              {articleTitle}
            </span>
            {/* 言語バッジ */}
            <LanguageBadge languages={article.contentLanguages} />
          </div>
        </div>
      </nav>

      {/* 記事ヘッダー - 言語対応 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {article.category}
              </span>
              <span className="mx-3 text-gray-300">|</span>
              <time className="text-gray-500 text-sm">
                {article.publishedAt.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {articleTitle}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {articleExcerpt}
            </p>
            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <span>{labels.readTime}: {article.readTime}{labels.minutes}</span>
              <span className="mx-3">•</span>
              <span>{language === 'ja' ? '著者' : 'Author'}: {article.author}</span>
            </div>
          </div>
        </div>
      </div>

      <main>
        <ArticleDetail article={article} relatedArticles={relatedArticles} />
      </main>

      {/* フッター - 言語対応 */}
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