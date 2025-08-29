import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * HTMLファイルを完全にそのまま提供するAPIルート
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
    
    // HTMLファイルを読み込み
    const htmlContent = await fs.readFile(filePath, 'utf-8');
    
    // HTMLとして直接返す（完全にそのまま）
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Error serving raw HTML:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}