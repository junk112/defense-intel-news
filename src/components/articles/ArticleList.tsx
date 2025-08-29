'use client';

import React, { useState, useMemo } from 'react';
import { Article, ArticleFilter, SortOption } from '@/lib/types';
import { ArticleCard } from './ArticleCard';
import { Grid3X3, List, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useLanguage, getLocalizedText, LANGUAGE_LABELS, LanguageBadge } from '@/hooks/useLanguage';

interface ArticleListProps {
  initialArticles: Article[];
  itemsPerPage?: number;
}

export function ArticleList({ initialArticles, itemsPerPage = 12 }: ArticleListProps) {
  const { language } = useLanguage();
  const labels = LANGUAGE_LABELS[language];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ArticleFilter>({});
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'publishedAt',
    order: 'desc',
    label: language === 'ja' ? '新着順' : 'Latest First'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // ソートオプションの定義
  const sortOptions: SortOption[] = language === 'ja' ? [
    { field: 'publishedAt', order: 'desc', label: '新着順' },
    { field: 'publishedAt', order: 'asc', label: '古い順' },
    { field: 'title', order: 'asc', label: 'タイトル昇順' },
    { field: 'title', order: 'desc', label: 'タイトル降順' },
    { field: 'readTime', order: 'asc', label: '読了時間短い順' },
    { field: 'readTime', order: 'desc', label: '読了時間長い順' },
    { field: 'viewCount', order: 'desc', label: '人気順' },
  ] : [
    { field: 'publishedAt', order: 'desc', label: 'Latest First' },
    { field: 'publishedAt', order: 'asc', label: 'Oldest First' },
    { field: 'title', order: 'asc', label: 'Title A-Z' },
    { field: 'title', order: 'desc', label: 'Title Z-A' },
    { field: 'readTime', order: 'asc', label: 'Quick Read' },
    { field: 'readTime', order: 'desc', label: 'Long Read' },
    { field: 'viewCount', order: 'desc', label: 'Most Popular' },
  ];

  // フィルタリングとソートされた記事（簡素化）
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = [...initialArticles];
    
    // 検索フィルタリング（多言語対応）
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => {
        // 言語に応じたタイトルと要約を取得
        const title = getLocalizedText(article, 'title', language);
        const excerpt = getLocalizedText(article, 'excerpt', language);
        
        return title.toLowerCase().includes(query) ||
               excerpt.toLowerCase().includes(query) ||
               article.tags.some(tag => tag.toLowerCase().includes(query));
      });
    }
    
    // カテゴリフィルター
    if (filters.category) {
      filtered = filtered.filter(article => article.category === filters.category);
    }
    
    // ソート
    filtered.sort((a, b) => {
      switch (sortOption.field) {
        case 'publishedAt':
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          return sortOption.order === 'desc' ? dateB - dateA : dateA - dateB;
        case 'title':
          const titleA = getLocalizedText(a, 'title', language);
          const titleB = getLocalizedText(b, 'title', language);
          return sortOption.order === 'desc' 
            ? titleB.localeCompare(titleA)
            : titleA.localeCompare(titleB);
        case 'readTime':
          return sortOption.order === 'desc' 
            ? b.readTime - a.readTime 
            : a.readTime - b.readTime;
        case 'viewCount':
          return sortOption.order === 'desc' 
            ? b.viewCount - a.viewCount 
            : a.viewCount - b.viewCount;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [initialArticles, filters, searchQuery, sortOption, language]);

  // ページネーション（簡素化）
  const paginatedData = useMemo(() => {
    const totalItems = filteredAndSortedArticles.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const items = filteredAndSortedArticles.slice(startIndex, endIndex);
    
    return {
      items,
      totalItems,
      totalPages,
      currentPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  }, [filteredAndSortedArticles, currentPage, itemsPerPage]);

  // 利用可能なカテゴリを取得
  const availableCategories = useMemo(() => {
    const categories = [...new Set(initialArticles.map(article => article.category))];
    return categories.sort();
  }, [initialArticles]);

  // 利用可能なタグを取得
  const availableTags = useMemo(() => {
    const allTags = initialArticles.flatMap(article => article.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }, [initialArticles]);

  // ハンドラー関数
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: ArticleFilter) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => 
      `${opt.field}-${opt.order}` === value
    );
    if (option) {
      setSortOption(option);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 検索とフィルター */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* 簡単な検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={language === 'ja' ? '記事のタイトル、内容、タグから検索...' : 'Search articles by title, content, tags...'}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* 簡単なカテゴリフィルター */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange({})}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                !filters.category 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {language === 'ja' ? 'すべて' : 'All'}
            </button>
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange({ category })}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  filters.category === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ツールバー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {language === 'ja' 
              ? `${filteredAndSortedArticles.length} 件の記事` 
              : `${filteredAndSortedArticles.length} articles`}
            {searchQuery && (
              <span className="ml-2 text-blue-600">
                {language === 'ja' 
                  ? `「${searchQuery}」の検索結果`
                  : `Search results for "${searchQuery}"`}
              </span>
            )}
          </span>
          
          {(searchQuery || Object.keys(filters).length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {language === 'ja' ? 'フィルターをクリア' : 'Clear Filters'}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* ソート選択 */}
          <select
            value={`${sortOption.field}-${sortOption.order}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={`${option.field}-${option.order}`} value={`${option.field}-${option.order}`}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* ビュー切り替え */}
          <div className="flex items-center border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 記事一覧 */}
      {paginatedData.items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Grid3X3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">
              {language === 'ja' ? '記事が見つかりませんでした' : 'No articles found'}
            </p>
            <p className="text-sm">
              {searchQuery || Object.keys(filters).length > 0
                ? (language === 'ja' ? '検索条件を変更してみてください' : 'Try changing your search criteria')
                : (language === 'ja' ? '記事がまだ投稿されていません' : 'No articles have been published yet')
              }
            </p>
          </div>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {paginatedData.items.map((article) => {
            // 言語に応じたタイトルと要約を取得
            const title = getLocalizedText(article, 'title', language);
            const excerpt = getLocalizedText(article, 'excerpt', language);
            
            return (
              <div key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {article.category}
                      </span>
                      <span className="ml-3 text-gray-500 text-sm">
                        {article.publishedAt.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
                          year: 'numeric',
                          month: language === 'ja' ? 'long' : 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {/* 言語バッジ */}
                    <LanguageBadge languages={article.contentLanguages} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    <a href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                      {title}
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {language === 'ja' 
                        ? `読了時間: ${article.readTime}分` 
                        : `${article.readTime} min read`}
                    </span>
                    <a 
                      href={`/articles/${article.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      {labels.readMore}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ページネーション */}
      {paginatedData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!paginatedData.hasPrev}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === 'ja' ? '前へ' : 'Previous'}
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(paginatedData.totalPages, 5) }, (_, i) => {
              const page = i + Math.max(1, currentPage - 2);
              if (page > paginatedData.totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 text-sm rounded-lg ${
                    page === currentPage 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!paginatedData.hasNext}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {language === 'ja' ? '次へ' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}