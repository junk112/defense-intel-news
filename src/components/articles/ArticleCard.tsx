'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { formatDate, formatReadTime, getCategoryColor, getCategoryName } from '@/lib/utils';
import { useLanguage, LANGUAGE_LABELS, LanguageBadge } from '@/hooks/useLanguage';
import { getTechTag } from '@/lib/techTags';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  showExcerpt?: boolean;
  showStats?: boolean;
  className?: string;
}

export function ArticleCard({ 
  article, 
  showExcerpt = true, 
  showStats = true, 
  className = '' 
}: ArticleCardProps) {
  const { language } = useLanguage();
  const labels = LANGUAGE_LABELS[language];

  return (
    <Card className={`card-hover overflow-hidden ${className}`}>
      {/* カテゴリ表示用のトップバー */}
      <div className={`h-1 ${getCategoryColor(article.category).split(' ')[0]}`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {/* 技術タグ表示（最大3個） */}
              {article.primaryTechTags && article.primaryTechTags.map((tagId) => {
                const techTag = getTechTag(tagId);
                if (!techTag) return null;
                return (
                  <Badge 
                    key={tagId}
                    className={`${techTag.bgColor} ${techTag.color} ${techTag.borderColor} border text-xs`}
                  >
                    {language === 'ja' ? techTag.nameJa : techTag.nameEn}
                  </Badge>
                );
              })}
              <LanguageBadge languages={article.contentLanguages} />
              {article.featured && (
                <Badge variant="destructive" className="text-xs">
                  {language === 'ja' ? '注目' : 'Featured'}
                </Badge>
              )}
            </div>
            
            <Link href={`/articles/${article.slug}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer mb-2">
                {article.title}
              </h3>
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt, 'yyyy/MM/dd')}</span>
              </div>
              
              {showStats && (
                <>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatReadTime(article.readTime, language)}{language === 'ja' ? 'で読める' : ' read'}</span>
                  </div>
                  
                  {article.viewCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.viewCount.toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <span>{language === 'ja' ? '著者' : 'Author'}: {article.author}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {showExcerpt && article.excerpt && (
        <CardContent className="pt-0">
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-end">
            <Link 
              href={`/articles/${article.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors group"
            >
              {labels.readMore}
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
}