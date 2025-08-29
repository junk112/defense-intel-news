'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Shield, FileText, Calendar, User, ArrowRight } from 'lucide-react';
import { Article } from '@/lib/types';
import { useLanguage, getLocalizedText, LANGUAGE_LABELS, LanguageBadge } from '@/hooks/useLanguage';
import { LanguageToggle } from '@/components/common/LanguageToggle';

interface HomePageClientProps {
  allArticles: Article[];
  latestArticles: Article[];
}

function getCategoryColor(category: string): string {
  const colorMap: { [key: string]: string } = {
    '防衛政策': 'from-red-500 to-red-600',
    '国際情勢': 'from-orange-500 to-red-600', 
    '防衛技術': 'from-blue-500 to-purple-600',
    'インテリジェンス': 'from-purple-500 to-indigo-600',
    'サイバーセキュリティ': 'from-green-500 to-teal-600',
    '宇宙防衛': 'from-indigo-500 to-purple-600',
    '海洋安全保障': 'from-cyan-500 to-blue-600',
    '分析レポート': 'from-indigo-500 to-blue-600',
    'ダッシュボード': 'from-pink-500 to-rose-600',
    'その他': 'from-gray-500 to-gray-600'
  };
  
  return colorMap[category] || colorMap['その他'];
}

function getCategoryBadgeColor(category: string): string {
  const colorMap: { [key: string]: string } = {
    '防衛政策': 'bg-red-100 text-red-800',
    '国際情勢': 'bg-orange-100 text-orange-800',
    '防衛技術': 'bg-blue-100 text-blue-800',
    'インテリジェンス': 'bg-purple-100 text-purple-800',
    'サイバーセキュリティ': 'bg-green-100 text-green-800',
    '宇宙防衛': 'bg-indigo-100 text-indigo-800',
    '海洋安全保障': 'bg-cyan-100 text-cyan-800',
    '分析レポート': 'bg-indigo-100 text-indigo-800',
    'ダッシュボード': 'bg-pink-100 text-pink-800',
    'その他': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[category] || colorMap['その他'];
}

export default function HomePageClient({ allArticles, latestArticles }: HomePageClientProps) {
  const { language } = useLanguage();
  const labels = LANGUAGE_LABELS[language];
  
  // タイトル・サブタイトルの言語別表示
  const siteTitle = language === 'ja' ? '防衛情報インテリジェンス' : 'Defense Intelligence';
  const siteSubtitle = language === 'ja' ? 'Defense Intelligence Portal' : '防衛情報ポータル';
  const heroTitle = language === 'ja' ? ['防衛情報', 'インテリジェンス', 'ポータル'] : ['Defense', 'Intelligence', 'Portal'];
  const heroDescription = language === 'ja' 
    ? '防衛・安全保障分野の最新動向、専門分析、政策解説を提供する日本初の総合インテリジェンスプラットフォーム'
    : 'Japan\'s first comprehensive intelligence platform providing the latest trends, expert analysis, and policy insights in defense and security';
    
  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{siteTitle}</h1>
                <p className="text-sm text-gray-600">{siteSubtitle}</p>
              </div>
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
              <LanguageToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ヒーローセクション */}
        <section className="text-center mb-16">
          <div className="mb-6">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {heroTitle[0]}
            <span className="gradient-text block">{heroTitle[1]}</span>
            {heroTitle[2]}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/articles" 
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {language === 'ja' ? '記事を読む' : 'Read Articles'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/categories" 
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'ja' ? 'カテゴリ一覧' : 'Categories'}
            </Link>
          </div>
        </section>

        {/* 統計セクション */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-blue-600">{allArticles.length}+</h3>
                <p className="text-gray-600 font-medium">{language === 'ja' ? '掲載記事数' : 'Articles'}</p>
              </div>
              <FileText className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-green-600">8+</h3>
                <p className="text-gray-600 font-medium">{language === 'ja' ? '専門カテゴリ' : 'Categories'}</p>
              </div>
              <Shield className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-purple-600">2025</h3>
                <p className="text-gray-600 font-medium">{language === 'ja' ? '最新年度' : 'Latest Year'}</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </section>

        {/* 最新記事プレビュー */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'ja' ? '最新記事' : 'Latest Articles'}
            </h2>
            <Link 
              href="/articles" 
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
            >
              {language === 'ja' ? 'すべて見る' : 'View All'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.length > 0 ? (
              latestArticles.map((article) => {
                // 言語に応じたタイトルと要約を取得
                const title = getLocalizedText(article, 'title', language);
                const excerpt = getLocalizedText(article, 'excerpt', language);
                
                return (
                  <article key={article.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 card-hover">
                    <div className={`h-48 ${getCategoryColor(article.category)} flex items-center justify-center relative overflow-hidden`}>
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={() => {
                            // 画像読み込み失敗時はアイコン表示にフォールバック
                          }}
                        />
                      ) : (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(article.category)}`} />
                          <Shield className="h-16 w-16 text-white opacity-80 relative z-10" />
                        </>
                      )}
                      {/* 画像がある場合は、カテゴリオーバーレイを追加 */}
                      {article.featuredImage && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(article.category)} opacity-75`} />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 ${getCategoryBadgeColor(article.category)} text-sm font-medium rounded-full`}>
                          {article.category}
                        </span>
                        {/* 言語バッジ */}
                        <LanguageBadge languages={article.contentLanguages} />
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <span>
                          {article.publishedAt.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {excerpt}
                      </p>
                      <Link 
                        href={`/articles/${article.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {labels.readMore}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'ja' ? '記事を読み込んでいます' : 'Loading Articles'}
                </h3>
                <p className="text-gray-500">
                  {language === 'ja' ? '記事データを準備中です...' : 'Preparing article data...'}
                </p>
              </div>
            )}
          </div>
        </section>
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