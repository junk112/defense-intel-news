'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, 
  FileText, 
  Calendar, 
  User, 
  ArrowRight, 
  Clock,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Article } from '@/lib/types';
import { useLanguage, getLocalizedText, LANGUAGE_LABELS, LanguageBadge } from '@/hooks/useLanguage';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { getCategoryName } from '@/lib/utils';
import { getTechTag } from '@/lib/techTags';

interface HomePageClientProps {
  allArticles: Article[];
  latestArticles: Article[];
}

// LinkedIn風のモダンなカテゴリカラー (日本語カテゴリをキーとした色マップ)
function getCategoryGradientColor(category: string): string {
  const colorMap: { [key: string]: string } = {
    '防衛政策': 'from-blue-600 to-indigo-700',
    '国際情勢': 'from-emerald-600 to-teal-700', 
    '防衛技術': 'from-purple-600 to-violet-700',
    'インテリジェンス': 'from-indigo-600 to-blue-700',
    'サイバーセキュリティ': 'from-red-600 to-rose-700',
    '宇宙防衛': 'from-violet-600 to-purple-700',
    '海洋安全保障': 'from-cyan-600 to-blue-700',
    '分析レポート': 'from-slate-600 to-gray-700',
    'ダッシュボード': 'from-pink-600 to-rose-700',
    'その他': 'from-gray-600 to-slate-700'
  };
  
  return colorMap[category] || colorMap['その他'];
}

function getCategoryBadgeColor(category: string): string {
  const colorMap: { [key: string]: string } = {
    '防衛政策': 'bg-blue-50 text-blue-700 border border-blue-200',
    '国際情勢': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    '防衛技術': 'bg-purple-50 text-purple-700 border border-purple-200',
    'インテリジェンス': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    'サイバーセキュリティ': 'bg-red-50 text-red-700 border border-red-200',
    '宇宙防衛': 'bg-violet-50 text-violet-700 border border-violet-200',
    '海洋安全保障': 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    '分析レポート': 'bg-slate-50 text-slate-700 border border-slate-200',
    'ダッシュボード': 'bg-pink-50 text-pink-700 border border-pink-200',
    'その他': 'bg-gray-50 text-gray-700 border border-gray-200'
  };
  
  return colorMap[category] || colorMap['その他'];
}

// フィード記事の相対時間表示
function getRelativeTime(date: Date, language: string): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (language === 'ja') {
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });
  } else {
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export default function HomePageClient({ allArticles, latestArticles }: HomePageClientProps) {
  const { language } = useLanguage();
  const labels = LANGUAGE_LABELS[language];
  const [visibleArticles, setVisibleArticles] = useState(6);
  
  // タイトル・サブタイトルの言語別表示
  const siteTitle = language === 'ja' ? '防衛情報インテリジェンス' : 'Defense Intelligence';
  const siteSubtitle = language === 'ja' ? 'Defense Intelligence Portal' : '防衛情報ポータル';

  // フィード表示用の記事を時系列で取得
  const feedArticles = allArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  // 無限スクロール的な「もっと見る」機能
  const loadMoreArticles = () => {
    setVisibleArticles(prev => Math.min(prev + 6, feedArticles.length));
  };
    
  return (
    <div className="min-h-screen bg-slate-50">
      {/* LinkedIn風のモダンヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{siteTitle}</h1>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                {labels.home}
              </Link>
              <Link href="/articles" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                {labels.articles}
              </Link>
              <Link href="/admin/upload" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                {labels.upload}
              </Link>
              <LanguageToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* メインフィードエリア */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* サイドバー - 統計・クイックアクセス */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="text-center pb-4 border-b border-gray-100 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{siteTitle}</h3>
                <p className="text-xs text-gray-500 mt-1">{siteSubtitle}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{language === 'ja' ? '記事数' : 'Articles'}</span>
                  <span className="font-semibold text-gray-900">{allArticles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{language === 'ja' ? 'カテゴリ' : 'Categories'}</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{language === 'ja' ? '最新更新' : 'Last Updated'}</span>
                  <span className="font-semibold text-gray-900">
                    {language === 'ja' ? '今日' : 'Today'}
                  </span>
                </div>
              </div>
            </div>

            {/* クイックアクセス */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                {language === 'ja' ? 'クイックアクセス' : 'Quick Access'}
              </h4>
              <div className="space-y-2">
                <Link href="/articles" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{language === 'ja' ? '記事一覧' : 'All Articles'}</span>
                </Link>
                <Link href="/admin/upload" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{language === 'ja' ? 'アップロード' : 'Upload'}</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* メインフィード */}
          <div className="lg:col-span-9">
            {/* フィードヘッダー */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {language === 'ja' ? '最新の防衛情報' : 'Latest Defense Intelligence'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {language === 'ja' 
                      ? '防衛・安全保障分野の最新動向をお届けします' 
                      : 'Stay updated with the latest defense and security insights'
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
            {/* 記事フィード */}
            <div className="space-y-4">
              {feedArticles.slice(0, visibleArticles).map((article, index) => {
                const title = getLocalizedText(article, 'title', language);
                const excerpt = getLocalizedText(article, 'excerpt', language);
                
                return (
                  <article key={article.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                    {/* 記事ヘッダー */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getCategoryGradientColor(article.category)} flex items-center justify-center`}>
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 flex-wrap">
                            {/* 技術タグ表示（最大3個） */}
                            {article.primaryTechTags && article.primaryTechTags.map((tagId) => {
                              const techTag = getTechTag(tagId);
                              if (!techTag) return null;
                              return (
                                <span 
                                  key={tagId}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${techTag.bgColor} ${techTag.color} border ${techTag.borderColor}`}
                                >
                                  {language === 'ja' ? techTag.nameJa : techTag.nameEn}
                                </span>
                              );
                            })}
                            <LanguageBadge languages={article.contentLanguages} />
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{getRelativeTime(article.publishedAt, language)}</span>
                          </div>
                        </div>
                        
                        {/* 記事タイトル */}
                        <Link href={`/articles/${article.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                            {title}
                          </h3>
                        </Link>
                        
                        {/* 記事要約 */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {excerpt}
                        </p>
                        
                        {/* 記事メタデータと操作ボタン */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{language === 'ja' ? `${article.readTime}分` : `${article.readTime} min`}</span>
                            </div>
                          </div>
                          
                          {/* LinkedIn風のアクションボタン */}
                          <div className="flex items-center space-x-3">
                            <button className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors text-xs text-gray-600 hover:text-gray-900">
                              <Heart className="h-3 w-3" />
                              <span>{language === 'ja' ? 'いいね' : 'Like'}</span>
                            </button>
                            <button className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors text-xs text-gray-600 hover:text-gray-900">
                              <MessageSquare className="h-3 w-3" />
                              <span>{language === 'ja' ? 'コメント' : 'Comment'}</span>
                            </button>
                            <button className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors text-xs text-gray-600 hover:text-gray-900">
                              <Share2 className="h-3 w-3" />
                              <span>{language === 'ja' ? 'シェア' : 'Share'}</span>
                            </button>
                            <button className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors text-xs text-gray-600 hover:text-gray-900">
                              <Bookmark className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* もっと見るボタン */}
            {visibleArticles < feedArticles.length && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreArticles}
                  className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {language === 'ja' ? 'さらに記事を読む' : 'Load More Articles'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">{siteTitle}</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm">
              {language === 'ja' 
                ? '防衛・安全保障分野の専門情報を提供する総合インテリジェンスプラットフォーム' 
                : 'Comprehensive intelligence platform for defense and security information'
              }
            </p>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-gray-500 text-xs">
                © 2025 Defense Intelligence Portal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}