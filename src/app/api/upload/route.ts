import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // ファイルの検証
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }
    
    if (!file.name.endsWith('.html')) {
      return NextResponse.json(
        { error: 'HTMLファイルのみアップロード可能です' },
        { status: 400 }
      );
    }
    
    // ファイル名の検証（YYYY-MM-DD-slug.html形式）
    const datePattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.html$/;
    if (!datePattern.test(file.name)) {
      return NextResponse.json(
        { 
          error: 'ファイル名は YYYY-MM-DD-slug.html 形式にしてください',
          example: '2025-08-24-my-article.html'
        },
        { status: 400 }
      );
    }
    
    // ファイルサイズの制限（10MB）
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'ファイルサイズは10MB以下にしてください' },
        { status: 400 }
      );
    }
    
    // ファイル内容の取得
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // HTMLの基本的な検証（CSS隔離システム対応）
    const content = buffer.toString('utf-8');
    
    // 必須要素のチェック
    if (!content.includes('<title>') || !content.includes('</title>')) {
      return NextResponse.json(
        { 
          error: 'HTMLファイルには<title>タグが必要です',
          details: 'CSS隔離システムが記事タイトルを正しく抽出するため'
        },
        { status: 400 }
      );
    }

    // CSS隔離システム対応の詳細検証
    const htmlStructure = {
      hasTitle: /<title[^>]*>(.+?)<\/title>/i.test(content),
      hasBody: /<body[^>]*>[\s\S]*<\/body>/i.test(content),
      hasStyles: /<style[^>]*>[\s\S]*?<\/style>/i.test(content),
      hasScripts: /<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/i.test(content),
      hasExternalCSS: /<link[^>]*rel=["']stylesheet["'][^>]*>/i.test(content)
    };

    // 記事品質の評価
    const qualityScore = Object.values(htmlStructure).filter(Boolean).length;
    
    // 危険なスクリプトのチェック（強化版）
    const dangerousPatterns = [
      {
        pattern: /<script[^>]*src=["']https?:\/\/[^"']*["'][^>]*>/gi,
        description: '外部スクリプトファイル'
      },
      {
        pattern: /eval\s*\(/gi,
        description: 'eval関数の使用'
      },
      {
        pattern: /document\.cookie/gi,
        description: 'クッキー操作'
      },
      {
        pattern: /window\.location\.href\s*=/gi,
        description: 'リダイレクト処理'
      },
      {
        pattern: /innerHTML\s*=\s*[^;]*</gi,
        description: '動的HTML挿入'
      },
      {
        pattern: /xhr\.|XMLHttpRequest|fetch\(/gi,
        description: 'HTTP通信機能'
      }
    ];
    
    const securityIssues = [];
    for (const check of dangerousPatterns) {
      if (check.pattern.test(content)) {
        securityIssues.push(check.description);
      }
    }
    
    if (securityIssues.length > 0) {
      return NextResponse.json(
        { 
          error: 'セキュリティ上の理由により、このHTMLファイルはアップロードできません',
          issues: securityIssues,
          recommendation: 'CSS隔離システムにより安全に表示するため、これらの機能は制限されています'
        },
        { status: 400 }
      );
    }
    
    // pub/articlesディレクトリの確認と作成
    const articlesDir = path.join(process.cwd(), 'pub', 'articles');
    if (!existsSync(articlesDir)) {
      await mkdir(articlesDir, { recursive: true });
    }
    
    // ファイルの保存
    const filepath = path.join(articlesDir, file.name);
    
    // 既存ファイルのチェック
    if (existsSync(filepath)) {
      return NextResponse.json(
        { 
          error: '同名のファイルが既に存在します',
          suggestion: 'ファイル名を変更してください'
        },
        { status: 409 }
      );
    }
    
    await writeFile(filepath, buffer);
    
    // URLスラッグの生成
    const slug = file.name.replace('.html', '');
    
    // 記事情報の詳細分析
    const titleMatch = content.match(/<title[^>]*>(.+?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'タイトル不明';
    
    return NextResponse.json({ 
      success: true,
      message: '記事が正常にアップロードされました',
      data: {
        filename: file.name,
        title: title,
        slug: slug,
        size: file.size,
        url: `/articles/${slug}`,
        uploadedAt: new Date().toISOString(),
        htmlStructure: htmlStructure,
        qualityScore: qualityScore,
        cssIsolation: {
          enabled: true,
          description: 'CSS隔離システムにより、元のHTMLスタイルが完全に保持されます',
          features: [
            '元のCSSスタイルを最高優先度で適用',
            'Tailwind CSSとの競合を自動解決',
            'インラインスクリプトの安全な実行',
            'レスポンシブデザインの維持'
          ]
        }
      },
      tips: [
        '記事は自動的にCSS隔離システムで処理されます',
        '元のHTMLデザインがそのまま維持されます',
        'スタイル競合の心配はありません',
        `記事は${slug}として公開されています`
      ]
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'アップロード中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ファイル一覧取得API
export async function GET() {
  try {
    const { readdir, stat } = await import('fs/promises');
    const articlesDir = path.join(process.cwd(), 'pub', 'articles');
    
    if (!existsSync(articlesDir)) {
      return NextResponse.json({ articles: [] });
    }
    
    const files = await readdir(articlesDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    const articles = await Promise.all(
      htmlFiles.map(async (filename) => {
        const filepath = path.join(articlesDir, filename);
        const stats = await stat(filepath);
        const slug = filename.replace('.html', '');
        
        return {
          filename,
          slug,
          url: `/articles/${slug}`,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
    );
    
    // 日付順にソート（新しい順）
    articles.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
    
    return NextResponse.json({ 
      articles,
      total: articles.length
    });
    
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { error: 'ファイル一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}