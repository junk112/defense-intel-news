import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ArticleParser } from '@/lib/articleParser';

/**
 * 記事一覧取得API
 * pub/articlesフォルダ内のHTMLファイルを解析して記事データを返す
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // pub/articlesディレクトリのパス
    const articlesDir = path.join(process.cwd(), 'pub', 'articles');
    
    // ディレクトリ存在確認
    try {
      await fs.access(articlesDir);
    } catch {
      return NextResponse.json({ 
        articles: [], 
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalCount: 0,
          hasNext: false,
          hasPrev: false
        },
        filters: {
          availableCategories: [],
          dateRange: {
            earliest: new Date(),
            latest: new Date()
          }
        }
      });
    }

    // HTMLファイルを取得
    const files = await fs.readdir(articlesDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`[ArticlesAPI] Found ${htmlFiles.length} HTML files`);

    // 各ファイルを解析
    const articles = [];
    const availableCategories = new Set<string>();
    let earliestDate = new Date();
    let latestDate = new Date(0);

    for (const file of htmlFiles) {
      try {
        const filePath = path.join(articlesDir, file);
        const article = await ArticleParser.createArticleFromFile(filePath);
        
        if (article) {
          articles.push(article);
          availableCategories.add(article.category);
          
          // 日付範囲の更新
          if (article.publishedAt < earliestDate) {
            earliestDate = article.publishedAt;
          }
          if (article.publishedAt > latestDate) {
            latestDate = article.publishedAt;
          }
        }
      } catch (error) {
        console.error(`[ArticlesAPI] Failed to parse ${file}:`, error);
        // パースに失敗したファイルはスキップ
      }
    }

    console.log(`[ArticlesAPI] Successfully parsed ${articles.length} articles`);

    // フィルタリング
    let filteredArticles = articles;

    // カテゴリフィルタ
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(article => 
        article.category === category
      );
    }

    // 検索フィルタ
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 日付範囲フィルタ
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredArticles = filteredArticles.filter(article =>
        article.publishedAt >= fromDate
      );
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredArticles = filteredArticles.filter(article =>
        article.publishedAt <= toDate
      );
    }

    // ソート
    filteredArticles.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'views':
          comparison = a.viewCount - b.viewCount;
          break;
        case 'date':
        default:
          comparison = a.publishedAt.getTime() - b.publishedAt.getTime();
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // ページネーション
    const totalCount = filteredArticles.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    // レスポンス
    const response = {
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        availableCategories: Array.from(availableCategories),
        dateRange: {
          earliest: earliestDate,
          latest: latestDate
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[ArticlesAPI] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}