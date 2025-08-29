import { Metadata } from 'next'
import { ArticleParser } from '@/lib/articleParser'
import HomePageClient from './HomePage'
import path from 'path'

export const metadata: Metadata = {
  title: '防衛情報インテリジェンス ニュースポータル | Defense Intelligence Portal',
  description: '防衛・安全保障関連の最新情報、分析レポート、インテリジェンス情報を提供 | Defense and security news, analysis and intelligence',
}

export default async function HomePage() {
  const allArticles = await ArticleParser.parseArticlesFromDirectory(path.join(process.cwd(), 'pub', 'articles'));
  const latestArticles = allArticles.slice(0, 3);
  
  return (
    <HomePageClient 
      allArticles={allArticles}
      latestArticles={latestArticles}
    />
  );
}