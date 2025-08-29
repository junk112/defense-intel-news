import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ArticleParser } from '@/lib/articleParser';

/**
 * 個別記事取得API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // HTMLファイルのパスを構築
    const filePath = path.join(process.cwd(), 'pub', 'articles', `${slug}.html`);
    
    // ファイルの存在確認
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // 記事を解析
    const article = await ArticleParser.createArticleFromFile(filePath);
    
    if (!article) {
      return NextResponse.json({ error: 'Failed to parse article' }, { status: 500 });
    }

    // 関連記事を取得（簡易実装）
    const relatedArticles = await getRelatedArticles(article.category, article.id);
    
    // 目次は空配列として返す（フロントエンドで生成）
    const tableOfContents: any[] = [];

    const response = {
      article,
      relatedArticles,
      tableOfContents
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 関連記事を取得（簡易実装）
 */
async function getRelatedArticles(category: string, currentId: string) {
  try {
    const articlesDir = path.join(process.cwd(), 'pub', 'articles');
    const files = await fs.readdir(articlesDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    const relatedArticles = [];
    
    for (const file of htmlFiles.slice(0, 5)) { // 最大5件
      try {
        const filePath = path.join(articlesDir, file);
        const article = await ArticleParser.createArticleFromFile(filePath);
        
        if (article && article.id !== currentId && article.category === category) {
          relatedArticles.push(article);
        }
      } catch (error) {
        // スキップ
      }
    }
    
    return relatedArticles.slice(0, 4); // 最大4件
    
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}