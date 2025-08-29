import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleDetailPageClient from './ArticleDetailPageClient';
import { Article } from '@/lib/types';
import { ArticleParser } from '@/lib/articleParser';
import path from 'path';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) {
      return { title: '記事が見つかりません' };
    }

    // 多言語対応のタイトルと説明
    const title = article.titleJa && article.titleEn 
      ? `${article.titleJa} | ${article.titleEn}`
      : article.title;
    const description = article.excerptJa && article.excerptEn
      ? `${article.excerptJa} | ${article.excerptEn}`
      : article.excerpt;

    return {
      title: `${title} | 防衛情報インテリジェンス | Defense Intelligence Portal`,
      description,
      keywords: article.tags.join(', '),
      authors: [{ name: article.author }],
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: article.publishedAt.toISOString(),
        modifiedTime: article.lastModified.toISOString(),
        authors: [article.author],
        tags: article.tags,
        images: article.featuredImage ? [{ url: article.featuredImage }] : [],
      }
    };
  } catch {
    return { title: '記事が見つかりません' };
  }
}

async function getArticle(slug: string) {
  try {
    // pub/articlesディレクトリから該当する記事ファイルを探す
    const articlesDir = path.join(process.cwd(), 'pub', 'articles');
    const articles = await ArticleParser.parseArticlesFromDirectory(articlesDir);
    return articles.find(article => article.slug === slug);
  } catch (error) {
    console.error('Failed to load article:', error);
    return null;
  }
}

async function getRelatedArticles(currentArticle: any) {
  try {
    const articlesDir = path.join(process.cwd(), 'pub', 'articles');
    const allArticles = await ArticleParser.parseArticlesFromDirectory(articlesDir);
    
    // 同じカテゴリの記事を取得（現在の記事は除外）
    const relatedByCategory = allArticles.filter(article => 
      article.id !== currentArticle.id && 
      article.category === currentArticle.category
    );

    // 関連記事が少ない場合は、タグが一致する記事も含める
    if (relatedByCategory.length < 3) {
      const relatedByTags = allArticles.filter(article => 
        article.id !== currentArticle.id &&
        article.category !== currentArticle.category &&
        article.tags.some(tag => currentArticle.tags.includes(tag))
      );
      
      return [...relatedByCategory, ...relatedByTags].slice(0, 6);
    }
    
    return relatedByCategory.slice(0, 6);
  } catch (error) {
    console.error('Failed to load related articles:', error);
    return [];
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article);

  return (
    <ArticleDetailPageClient 
      article={article} 
      relatedArticles={relatedArticles} 
    />
  );
}