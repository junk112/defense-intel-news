'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { formatDate, formatReadTime, getCategoryColor } from '@/lib/utils';
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
  return (
    <Card className={`card-hover overflow-hidden ${className}`}>
      {/* カテゴリ表示用のトップバー */}
      <div className={`h-1 ${getCategoryColor(article.category).split(' ')[0]}`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge 
                variant="secondary" 
                className={getCategoryColor(article.category)}
              >
                {article.category}
              </Badge>
              {article.featured && (
                <Badge variant="destructive" className="text-xs">
                  注目
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
                    <span>{formatReadTime(article.readTime)}で読める</span>
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
              <span>著者: {article.author}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {showExcerpt && article.excerpt && (
        <CardContent className="pt-0">
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <Link 
              href={`/articles/${article.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors group"
            >
              続きを読む
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
}