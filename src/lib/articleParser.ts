/**
 * 記事HTMLファイルパーサー (シンプル版)
 * 
 * HTMLファイルを解析してArticleオブジェクトを生成
 * CSS名前空間アプローチに対応
 */

import { promises as fs } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { Article, ArticleLanguage } from './types';
import { inferTechTags, sortTechTags, getTechTags } from './techTags';

const ARTICLE_CATEGORIES = {
  DEFENSE_POLICY: '防衛政策',
  INTERNATIONAL: '国際情勢',
  TECHNOLOGY: '防衛技術',
  INTELLIGENCE: 'インテリジェンス',
  CYBER_SECURITY: 'サイバーセキュリティ',
  SPACE_DEFENSE: '宇宙防衛',
  MARITIME: '海洋安全保障',
  ANALYSIS: '分析レポート',
  DASHBOARD: 'ダッシュボード',
  OTHER: 'その他'
} as const;

export class ArticleParser {
  
  /**
   * HTMLファイルからArticleオブジェクトを作成
   */
  static async createArticleFromFile(filePath: string): Promise<Article> {
    try {
      // ファイル読み込み
      const htmlContent = await fs.readFile(filePath, 'utf-8');
      const fileName = path.basename(filePath, '.html');
      
      // ファイル統計
      const stats = await fs.stat(filePath);
      
      // JSDOM で解析
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;
      
      // 基本情報抽出
      const title = this.extractTitle(document);
      const publishedAt = this.extractDateFromFilename(fileName);
      const category = this.inferCategory(fileName, title);
      const excerpt = this.generateExcerpt(document);
      const wordCount = this.calculateWordCount(document);
      const readTime = this.calculateReadTime(wordCount);
      
      // タグ抽出
      const tags = this.extractTags(document, fileName, title);
      
      // 画像抽出
      const images = this.extractImages(document);
      const featuredImage = this.extractFeaturedImage(document);
      
      // 言語情報抽出
      const languageInfo = this.extractLanguageInfo(document, title, excerpt);
      
      // 技術タグの自動推測
      const techTagIds = inferTechTags(fileName, title, tags);
      const techTags = getTechTags(techTagIds);
      const sortedTechTags = sortTechTags(techTags);
      
      // 主要タグ（表示用、最大3個）
      const primaryTechTagIds = sortedTechTags.slice(0, 3).map(tag => tag.id);
      
      const article: Article = {
        id: fileName,
        slug: fileName,
        title,
        titleEn: languageInfo.titleEn,
        titleJa: languageInfo.titleJa,
        publishedAt,
        content: htmlContent, // 元のHTMLをそのまま保存
        contentLanguages: languageInfo.contentLanguages,
        excerpt,
        excerptEn: languageInfo.excerptEn,
        excerptJa: languageInfo.excerptJa,
        category,
        tags, // 既存のタグも保持
        techTags: techTagIds, // 技術タグID配列
        primaryTechTags: primaryTechTagIds, // 主要技術タグ
        readTime,
        wordCount,
        lastModified: stats.mtime,
        status: 'published',
        featured: false,
        viewCount: 0,
        author: this.extractAuthor(document) || '防衛情報研究センター',
        featuredImage,
        images
      };
      
      return article;
      
    } catch (error) {
      console.error(`Error parsing article file ${filePath}:`, error);
      throw error;
    }
  }
  
  /**
   * ディレクトリ内のすべてのHTMLファイルを解析
   */
  static async parseArticlesFromDirectory(directoryPath: string): Promise<Article[]> {
    try {
      const files = await fs.readdir(directoryPath);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      const articles: Article[] = [];
      
      for (const file of htmlFiles) {
        try {
          const filePath = path.join(directoryPath, file);
          const article = await this.createArticleFromFile(filePath);
          articles.push(article);
        } catch (error) {
          console.error(`Failed to parse ${file}:`, error);
          // 個別ファイルの失敗は無視して続行
        }
      }
      
      return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
      
    } catch (error) {
      console.error(`Error reading directory ${directoryPath}:`, error);
      throw error;
    }
  }
  
  /**
   * タイトル抽出
   */
  private static extractTitle(document: Document): string {
    // title タグから抽出
    const titleElement = document.querySelector('title');
    if (titleElement?.textContent?.trim()) {
      return titleElement.textContent.trim();
    }
    
    // h1 タグから抽出
    const h1Element = document.querySelector('h1');
    if (h1Element?.textContent?.trim()) {
      return h1Element.textContent.trim();
    }
    
    return 'タイトルなし';
  }
  
  /**
   * ファイル名から日付抽出
   */
  static extractDateFromFilename(fileName: string): Date {
    const match = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) {
      return new Date(match[1] + 'T15:00:00.000Z'); // JSTの午後3時として設定
    }
    return new Date();
  }
  
  /**
   * カテゴリ推測
   */
  private static inferCategory(fileName: string, title: string): string {
    const text = (fileName + ' ' + title).toLowerCase();
    
    if (text.includes('dashboard') || text.includes('ダッシュボード')) {
      return ARTICLE_CATEGORIES.DASHBOARD;
    }
    if (text.includes('ai') || text.includes('人工知能')) {
      return ARTICLE_CATEGORIES.TECHNOLOGY;
    }
    if (text.includes('cyber') || text.includes('サイバー')) {
      return ARTICLE_CATEGORIES.CYBER_SECURITY;
    }
    if (text.includes('intel') || text.includes('intelligence') || text.includes('情報')) {
      return ARTICLE_CATEGORIES.INTELLIGENCE;
    }
    if (text.includes('iran') || text.includes('israel') || text.includes('international')) {
      return ARTICLE_CATEGORIES.INTERNATIONAL;
    }
    if (text.includes('policy') || text.includes('方針') || text.includes('政策')) {
      return ARTICLE_CATEGORIES.DEFENSE_POLICY;
    }
    if (text.includes('space') || text.includes('宇宙')) {
      return ARTICLE_CATEGORIES.SPACE_DEFENSE;
    }
    if (text.includes('maritime') || text.includes('海洋')) {
      return ARTICLE_CATEGORIES.MARITIME;
    }
    if (text.includes('analysis') || text.includes('分析')) {
      return ARTICLE_CATEGORIES.ANALYSIS;
    }
    
    return ARTICLE_CATEGORIES.OTHER;
  }
  
  /**
   * 要約生成
   */
  private static generateExcerpt(document: Document): string {
    // メタディスクリプション
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDesc?.trim()) {
      return metaDesc.trim().substring(0, 200);
    }
    
    // 最初のp要素
    const firstP = document.querySelector('p');
    if (firstP?.textContent?.trim()) {
      return firstP.textContent.trim().substring(0, 200);
    }
    
    // body全体から
    const bodyText = document.body?.textContent || '';
    return bodyText.trim().substring(0, 200);
  }
  
  /**
   * 文字数計算
   */
  private static calculateWordCount(document: Document): number {
    const text = document.body?.textContent || '';
    return text.length;
  }
  
  /**
   * 読了時間計算（1分あたり200文字）
   */
  private static calculateReadTime(wordCount: number): number {
    return Math.max(1, Math.round(wordCount / 200));
  }
  
  /**
   * タグ抽出
   */
  private static extractTags(document: Document, fileName: string, title: string): string[] {
    const tags = new Set<string>();
    
    // メタキーワード
    const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
    if (metaKeywords) {
      metaKeywords.split(',').forEach(keyword => {
        const tag = keyword.trim();
        if (tag) tags.add(tag);
      });
    }
    
    // ファイル名とタイトルからキーワード抽出
    const text = (fileName + ' ' + title).toLowerCase();
    const commonTags = ['防衛', '安全保障', 'AI', '技術', '分析', 'レポート'];
    
    commonTags.forEach(tag => {
      if (text.includes(tag.toLowerCase())) {
        tags.add(tag);
      }
    });
    
    return Array.from(tags).slice(0, 10); // 最大10個
  }
  
  /**
   * 著者抽出
   */
  private static extractAuthor(document: Document): string | null {
    const authorMeta = document.querySelector('meta[name="author"]')?.getAttribute('content');
    if (authorMeta?.trim()) {
      return authorMeta.trim();
    }
    
    return null;
  }
  
  /**
   * 目次生成（簡易版）
   */
  static generateTOC(content: string): Array<{ level: number; text: string; id: string }> {
    const headings: Array<{ level: number; text: string; id: string }> = [];
    
    try {
      const dom = new JSDOM(content);
      const document = dom.window.document;
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      headingElements.forEach((element, index) => {
        const level = parseInt(element.tagName.charAt(1));
        const text = element.textContent?.trim() || '';
        const id = element.id || `heading-${index}`;
        
        if (text) {
          headings.push({ level, text, id });
        }
      });
    } catch (error) {
      console.warn('Failed to generate TOC:', error);
    }
    
    return headings;
  }

  /**
   * 記事内の全画像を抽出
   */
  private static extractImages(document: Document): string[] {
    const images = new Set<string>();
    
    // img要素から画像URL抽出
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(img => {
      const src = img.getAttribute('src');
      if (src && this.isValidImageUrl(src)) {
        // 相対パスを絶対パスに変換（基本的なケース）
        const absoluteUrl = this.resolveImageUrl(src);
        images.add(absoluteUrl);
      }
    });
    
    // CSS background-imageからも抽出（基本的なケース）
    const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
    elementsWithBg.forEach(element => {
      const style = element.getAttribute('style') || '';
      const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")']+)['"]?\)/);
      if (bgMatch && bgMatch[1] && this.isValidImageUrl(bgMatch[1])) {
        const absoluteUrl = this.resolveImageUrl(bgMatch[1]);
        images.add(absoluteUrl);
      }
    });
    
    return Array.from(images);
  }

  /**
   * メイン画像（Featured Image）を抽出
   * 優先順位: og:image > twitter:image > 最初のimg要素
   */
  private static extractFeaturedImage(document: Document): string | undefined {
    // 1. Open Graph画像
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    if (ogImage && this.isValidImageUrl(ogImage)) {
      return this.resolveImageUrl(ogImage);
    }
    
    // 2. Twitter Card画像
    const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    if (twitterImage && this.isValidImageUrl(twitterImage)) {
      return this.resolveImageUrl(twitterImage);
    }
    
    // 3. カスタムメタタグ
    const featuredMeta = document.querySelector('meta[name="featured-image"]')?.getAttribute('content');
    if (featuredMeta && this.isValidImageUrl(featuredMeta)) {
      return this.resolveImageUrl(featuredMeta);
    }
    
    // 4. 最初の画像要素
    const firstImg = document.querySelector('img');
    if (firstImg) {
      const src = firstImg.getAttribute('src');
      if (src && this.isValidImageUrl(src)) {
        return this.resolveImageUrl(src);
      }
    }
    
    return undefined;
  }

  /**
   * 画像URLの妥当性チェック
   */
  private static isValidImageUrl(url: string): boolean {
    if (!url || url.trim() === '') return false;
    
    // データURLは除外（base64画像は重すぎるため）
    if (url.startsWith('data:')) return false;
    
    // 一般的な画像拡張子チェック
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)($|\?|#)/i;
    return imageExtensions.test(url) || url.includes('image') || url.includes('photo');
  }

  /**
   * 画像URLを絶対URLに変換
   */
  private static resolveImageUrl(url: string): string {
    // すでに絶対URLの場合はそのまま返す
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // プロトコル相対URLの場合
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    // 相対URLの場合は、記事のパブリックパスとして解釈
    // 例: ./images/chart.png → /articles/images/chart.png
    if (url.startsWith('./')) {
      return `/articles/${url.slice(2)}`;
    }
    
    // ルート相対URLの場合
    if (url.startsWith('/')) {
      return url;
    }
    
    // 相対パスの場合
    return `/articles/${url}`;
  }

  /**
   * 言語情報を抽出
   * meta name="language" 、meta name="article:language"、meta name="title:ja"などから判定
   */
  private static extractLanguageInfo(document: Document, defaultTitle: string, defaultExcerpt: string): {
    titleEn?: string;
    titleJa?: string;
    excerptEn?: string;
    excerptJa?: string;
    contentLanguages: ArticleLanguage[];
  } {
    const result: {
      titleEn?: string;
      titleJa?: string;
      excerptEn?: string;
      excerptJa?: string;
      contentLanguages: ArticleLanguage[];
    } = {
      contentLanguages: []
    };

    // 言語メタタグから判定
    const langMeta = document.querySelector('meta[name="article:language"]')?.getAttribute('content') 
                   || document.querySelector('meta[name="language"]')?.getAttribute('content')
                   || document.querySelector('html')?.getAttribute('lang');

    // 言語別タイトル抽出
    const titleJa = document.querySelector('meta[name="title:ja"]')?.getAttribute('content');
    const titleEn = document.querySelector('meta[name="title:en"]')?.getAttribute('content');
    
    if (titleJa) result.titleJa = titleJa;
    if (titleEn) result.titleEn = titleEn;

    // 言語別要約抽出
    const excerptJa = document.querySelector('meta[name="description:ja"]')?.getAttribute('content');
    const excerptEn = document.querySelector('meta[name="description:en"]')?.getAttribute('content');
    
    if (excerptJa) result.excerptJa = excerptJa;
    if (excerptEn) result.excerptEn = excerptEn;

    // コンテンツ言語判定
    const supportedLanguages = document.querySelector('meta[name="article:languages"]')?.getAttribute('content');
    
    if (supportedLanguages) {
      // meta name="article:languages" content="ja,en" の形式
      const langs = supportedLanguages.toLowerCase().split(',').map(s => s.trim());
      if (langs.includes('ja') && langs.includes('en')) {
        result.contentLanguages = ['both'];
      } else if (langs.includes('ja')) {
        result.contentLanguages = ['ja'];
      } else if (langs.includes('en')) {
        result.contentLanguages = ['en'];
      }
    } else {
      // 自動判定
      const hasJapaneseContent = this.detectJapaneseContent(document);
      const hasEnglishContent = this.detectEnglishContent(document);
      
      if (hasJapaneseContent && hasEnglishContent) {
        result.contentLanguages = ['both'];
      } else if (hasJapaneseContent) {
        result.contentLanguages = ['ja'];
        // デフォルトタイトルが日本語なら日本語タイトルとして設定
        if (!result.titleJa && defaultTitle) {
          result.titleJa = defaultTitle;
        }
        if (!result.excerptJa && defaultExcerpt) {
          result.excerptJa = defaultExcerpt;
        }
      } else if (hasEnglishContent) {
        result.contentLanguages = ['en'];
        // デフォルトタイトルが英語なら英語タイトルとして設定
        if (!result.titleEn && defaultTitle) {
          result.titleEn = defaultTitle;
        }
        if (!result.excerptEn && defaultExcerpt) {
          result.excerptEn = defaultExcerpt;
        }
      } else {
        // 言語が判定できない場合はHTMLのlang属性で判断
        if (langMeta === 'ja' || langMeta === 'ja-JP') {
          result.contentLanguages = ['ja'];
        } else if (langMeta === 'en' || langMeta === 'en-US') {
          result.contentLanguages = ['en'];
        } else {
          // デフォルトは両言語対応とする
          result.contentLanguages = ['both'];
        }
      }
    }

    // 空配列の場合はデフォルトで both とする
    if (result.contentLanguages.length === 0) {
      result.contentLanguages = ['both'];
    }

    return result;
  }

  /**
   * 日本語コンテンツの検出
   */
  private static detectJapaneseContent(document: Document): boolean {
    const bodyText = document.body?.textContent || '';
    // ひらがな、カタカナ、漢字の検出
    const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    const matches = bodyText.match(new RegExp(japanesePattern, 'g'));
    // 日本語文字が全体の10%以上ある場合は日本語コンテンツと判定
    return matches ? matches.length > bodyText.length * 0.1 : false;
  }

  /**
   * 英語コンテンツの検出
   */
  private static detectEnglishContent(document: Document): boolean {
    const bodyText = document.body?.textContent || '';
    // アルファベットの検出
    const englishPattern = /[a-zA-Z]/;
    const matches = bodyText.match(new RegExp(englishPattern, 'g'));
    // アルファベットが全体の30%以上ある場合は英語コンテンツと判定（記号や数字があるため閾値を高くする）
    return matches ? matches.length > bodyText.length * 0.3 : false;
  }
}