'use client';

import React, { useState } from 'react';
import { ArticleFilter } from '@/lib/types';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  filters: ArticleFilter;
  onFilterChange: (filters: ArticleFilter) => void;
  availableCategories: string[];
  availableTags: string[];
  onClear: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  onFilterChange,
  availableCategories,
  availableTags,
  onClear,
  className = ''
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ArticleFilter];
    return value !== undefined && value !== null && value !== '';
  });

  const handleCategoryChange = (value: string) => {
    const category = value === 'all' ? undefined : value;
    onFilterChange({ ...filters, category });
  };

  const handleStatusChange = (value: string) => {
    const status = value === 'all' ? undefined : value as 'published' | 'draft';
    onFilterChange({ ...filters, status });
  };

  const handleFeaturedChange = (value: string) => {
    const featured = value === 'all' ? undefined : value === 'true';
    onFilterChange({ ...filters, featured });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateFrom = e.target.value ? new Date(e.target.value) : undefined;
    onFilterChange({ ...filters, dateFrom });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTo = e.target.value ? new Date(e.target.value) : undefined;
    onFilterChange({ ...filters, dateTo });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onFilterChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={`border border-gray-200 rounded-lg bg-gray-50 ${className}`}>
      {/* フィルターヘッダー */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">フィルター</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {Object.keys(filters).filter(key => {
                const value = filters[key as keyof ArticleFilter];
                return value !== undefined && value !== null && value !== '';
              }).length}個適用中
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              クリア
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* フィルター内容 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* カテゴリフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <Select
                value={filters.category || 'all'}
                onChange={(e) => handleCategoryChange(e.target.value)}
                options={[
                  { value: 'all', label: 'すべて' },
                  ...availableCategories.map(cat => ({ value: cat, label: cat }))
                ]}
              />
            </div>

            {/* ステータスフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <Select
                value={filters.status || 'all'}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={[
                  { value: 'all', label: 'すべて' },
                  { value: 'published', label: '公開済み' },
                  { value: 'draft', label: '下書き' }
                ]}
              />
            </div>

            {/* 注目記事フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                注目記事
              </label>
              <Select
                value={filters.featured === undefined ? 'all' : filters.featured.toString()}
                onChange={(e) => handleFeaturedChange(e.target.value)}
                options={[
                  { value: 'all', label: 'すべて' },
                  { value: 'true', label: '注目記事のみ' },
                  { value: 'false', label: '通常記事のみ' }
                ]}
              />
            </div>
          </div>

          {/* 日付範囲フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              公開日
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  type="date"
                  value={formatDateForInput(filters.dateFrom)}
                  onChange={handleDateFromChange}
                  placeholder="開始日"
                  className="text-sm"
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={formatDateForInput(filters.dateTo)}
                  onChange={handleDateToChange}
                  placeholder="終了日"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* タグフィルター */}
          {availableTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {selectedTags.length}個のタグが選択されています
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}