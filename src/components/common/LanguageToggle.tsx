'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGE_LABELS } from '@/hooks/useLanguage';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();
  const labels = LANGUAGE_LABELS[language];
  
  return (
    <button
      onClick={toggleLanguage}
      className={`
        flex items-center gap-2 px-3 py-2 
        text-sm font-medium rounded-lg 
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-colors
        ${className}
      `}
      aria-label={`Switch language to ${labels.switchTo}`}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">{labels.language}</span>
      <span className="text-gray-500 dark:text-gray-400">→</span>
      <span className="text-gray-600 dark:text-gray-300">{labels.switchTo}</span>
    </button>
  );
}

// コンパクト版（ヘッダー用）
export function LanguageToggleCompact() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
      className="
        flex items-center justify-center
        w-10 h-10 rounded-lg
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-colors
      "
      aria-label={`Current language: ${language.toUpperCase()}`}
    >
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
        {language.toUpperCase()}
      </span>
    </button>
  );
}