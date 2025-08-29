import { Metadata } from 'next';
import ArticlesPageClient from './ArticlesPageClient';
import { ArticleParser } from '@/lib/articleParser';
import path from 'path';

export const metadata: Metadata = {
  title: '記事一覧 | 防衛情報インテリジェンス ニュースポータル',
  description: '防衛・安全保障関連の最新記事、分析レポート、インテリジェンス情報の一覧',
};

async function getArticles() {
  try {
    // pub/articlesディレクトリから記事を読み込む
    const articlesDir = path.join(process.cwd(), 'pub', 'articles');
    const articles = await ArticleParser.parseArticlesFromDirectory(articlesDir);
    return articles;
  } catch (error) {
    console.error('Failed to load articles:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <ArticlesPageClient articles={articles} />
  );
}