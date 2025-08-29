'use client';

/**
 * 記事詳細表示コンポーネント (CSS名前空間アプローチ)
 * 
 * HTMLファイルを自動的に名前空間化して表示
 * 元HTMLを最小限の加工で表示し、新規追加も容易
 */

import { useEffect, useState } from 'react';
import { Article } from '@/lib/types';

interface ArticleDetailProps {
  article: Article;
  relatedArticles?: Article[];
}

// HTMLパーサー: style, script, bodyコンテンツを分離 + フルスクリーン検出
function parseHTMLContent(html: string) {
  console.log(`[parseHTMLContent] Input HTML length: ${html.length}`);
  console.log(`[parseHTMLContent] Input HTML preview (first 1000 chars):`, html.substring(0, 1000));
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // DOMParserが正常に動作しているかチェック
  const parserErrors = doc.querySelectorAll('parsererror');
  if (parserErrors.length > 0) {
    console.warn('[parseHTMLContent] DOMParser encountered errors:', parserErrors[0].textContent);
  }
  
  
  // スタイル抽出（DOMParserの問題を回避するため、正規表現でも抽出）
  const styleElements = doc.querySelectorAll('style');
  let styles = '';
  console.log(`[parseHTMLContent] Found ${styleElements.length} style elements via querySelector`);
  
  // DOMParserで見つからない場合、正規表現で直接抽出
  if (styleElements.length === 0) {
    console.log(`[parseHTMLContent] No style elements found via DOM, trying regex extraction`);
    
    // まず、<style>タグがHTML内に存在するかチェック
    const styleTagCount = (html.match(/<style/gi) || []).length;
    const endStyleTagCount = (html.match(/<\/style>/gi) || []).length;
    console.log(`[parseHTMLContent] HTML contains ${styleTagCount} <style> tags and ${endStyleTagCount} </style> tags`);
    
    // 複数の正規表現パターンで試す
    const patterns = [
      /<style[^>]*>([\s\S]*?)<\/style>/gi,
      /<style>([\s\S]*?)<\/style>/gi,
      /<style\s+[^>]*>([\s\S]*?)<\/style>/gi
    ];
    
    let extractedAny = false;
    patterns.forEach((styleRegex, patternIndex) => {
      styleRegex.lastIndex = 0; // リセット
      let match;
      let matchCount = 0;
      while ((match = styleRegex.exec(html)) !== null) {
        matchCount++;
        const styleContent = match[1];
        if (styleContent && styleContent.trim()) {
          styles += styleContent;
          extractedAny = true;
          console.log(`[parseHTMLContent] Pattern ${patternIndex} match ${matchCount}: extracted ${styleContent.length} chars of CSS`);
          console.log(`[parseHTMLContent] CSS preview:`, styleContent.substring(0, 300));
        }
      }
      console.log(`[parseHTMLContent] Pattern ${patternIndex} found ${matchCount} matches`);
    });
    
    if (!extractedAny) {
      console.log(`[parseHTMLContent] No CSS extracted with any regex pattern`);
      // HTML内容の最初の1000文字を確認
      console.log(`[parseHTMLContent] HTML content sample for debugging:`, html.substring(0, 1000));
    }
  } else {
    // DOMParserで見つかった場合の通常処理
    styleElements.forEach((style, index) => {
      const styleContent = style.textContent || '';
      styles += styleContent;
      console.log(`[parseHTMLContent] Style ${index}: extracted ${styleContent.length} chars of CSS`);
      console.log(`[parseHTMLContent] Style ${index} preview:`, styleContent.substring(0, 300));
      style.remove();
    });
  }
  
  console.log(`[parseHTMLContent] Total CSS length: ${styles.length}`);
  
  // スクリプト抽出（JSON以外のインラインスクリプトのみ）
  const scriptElements = doc.querySelectorAll('script');
  let scripts = '';
  console.log(`[parseHTMLContent] Found ${scriptElements.length} script elements`);
  
  scriptElements.forEach((script, index) => {
    // 外部スクリプト（src属性有り）やJSONスクリプトは除外
    const type = script.getAttribute('type');
    const src = script.getAttribute('src');
    const content = script.textContent || '';
    
    console.log(`[parseHTMLContent] Script ${index}: type="${type}", src="${src}", content length=${content.length}`);
    
    if (!src && type !== 'application/json' && type !== 'application/ld+json') {
      scripts += content;
      console.log(`[parseHTMLContent] Added script ${index} to execution queue (${content.length} chars)`);
    } else {
      console.log(`[parseHTMLContent] Skipped script ${index} (external or JSON)`);
    }
    script.remove();
  });
  
  console.log(`[parseHTMLContent] Total script content length: ${scripts.length}`);
  if (scripts.length > 0) {
    console.log(`[parseHTMLContent] First 200 chars:`, scripts.substring(0, 200));
  }
  
  // 残りのHTML内容
  let bodyContent = '';
  if (doc.body) {
    // bodyの中身を取得（CSSが混入していないかチェック）
    bodyContent = doc.body.innerHTML;
    
    // bodyContentにCSSテキストが混入している場合のみ修正
    // （<style>タグは既に除外されているので、生のCSSテキストが残っている場合のみ）
    if (bodyContent.startsWith('* {') || (bodyContent.includes('margin: 0') && bodyContent.includes('padding: 0') && !bodyContent.includes('<'))) {
      console.log('[parseHTMLContent] Raw CSS text detected in body content, attempting to extract HTML only');
      
      // HTMLタグを探して、それ以降のみを取得
      const firstTagIndex = bodyContent.search(/<[a-zA-Z]/);
      if (firstTagIndex > 0) {
        bodyContent = bodyContent.substring(firstTagIndex);
        console.log('[parseHTMLContent] Extracted HTML after removing raw CSS, length:', bodyContent.length);
      } else {
        // HTMLタグが見つからない場合、bodyの子要素から直接取得
        const bodyElement = doc.body;
        if (bodyElement && bodyElement.children.length > 0) {
          bodyContent = Array.from(bodyElement.children).map(child => child.outerHTML).join('');
          console.log('[parseHTMLContent] Extracted HTML from body children as fallback, length:', bodyContent.length);
        }
      }
    }
  } else {
    // bodyタグがない場合は、全体のHTMLからhead部分を除外
    const headElement = doc.querySelector('head');
    if (headElement) {
      headElement.remove();
    }
    bodyContent = doc.documentElement.innerHTML || html;
  }
  
  // デバッグ用ログ
  console.log(`[parseHTMLContent] Body content length: ${bodyContent.length}`);
  if (bodyContent.length > 0) {
    console.log(`[parseHTMLContent] Body preview (first 200 chars):`, bodyContent.substring(0, 200));
  }
  
  return { styles, scripts, bodyContent };
}

// CSS名前空間化: .article-content 内にスコープ + 特殊な背景処理
function namespaceCSS(css: string): string {
  if (!css) return '';
  
  console.log(`[namespaceCSS] Original CSS length: ${css.length}`);
  
  // 基本的なCSS名前空間化
  let namespacedCSS = css
    // *, *::before, *::after などのグローバルセレクタを制限
    .replace(/^\s*\*/gm, '.article-content *')
    // html セレクタも名前空間化
    .replace(/\bhtml\b/g, '.article-content');

  // body セレクタの特別処理：全画面表示をサポート
  namespacedCSS = namespacedCSS.replace(
    /body\s*\{([^}]*)\}/g, 
    (match, bodyContent) => {
      // bodyの内容を.article-contentに適用し、全画面表示に対応
      return `
        .article-content {${bodyContent}}
        .article-content { 
          min-height: 100vh; 
          width: 100vw; 
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          display: block;
          position: relative;
          box-sizing: border-box;
        }`;
    }
  );
  
  // 記事内の言語切り替え関連CSSを無効化
  namespacedCSS = namespacedCSS.replace(
    /\.en\s+\[lang="ja"\]\s*\{[^}]*display:\s*none[^}]*\}/g, 
    '/* Disabled language CSS */'
  );
  namespacedCSS = namespacedCSS.replace(
    /\[lang="en"\]\s*\{[^}]*display:\s*none[^}]*\}/g,
    '/* Disabled language CSS */'
  );

  console.log(`[namespaceCSS] Processed CSS length: ${namespacedCSS.length}`);
  
  return namespacedCSS;
}

// JavaScript実行: シンプルで安全な方法で実行
function executeScripts(scripts: string, articleId?: string) {
  if (!scripts) {
    console.log('[ArticleRenderer] No scripts to execute');
    return;
  }
  
  // すでに実行済みかチェック（同じ記事で複数回実行を防ぐ）
  const scriptId = `script-${articleId || 'unknown'}`;
  if ((window as any)[`__${scriptId}_executed`]) {
    console.log('[ArticleRenderer] Scripts already executed for this article');
    return;
  }
  
  console.log('[ArticleRenderer] Executing scripts...');
  
  try {
    // React側の言語設定を取得
    const storedLang = typeof window !== 'undefined' 
      ? (localStorage.getItem('defense-intel-language') || 'ja')
      : 'ja';
    
    // currentLang宣言を削除して、window.currentLangを使うように修正
    let modifiedScript = scripts;
    
    // 既存のcurrentLang宣言を削除
    modifiedScript = modifiedScript.replace(/\b(let|const|var)\s+currentLang\s*=\s*['"]ja['"];?/gm, '');
    modifiedScript = modifiedScript.replace(/\b(let|const|var)\s+currentLang\s*=\s*['"]en['"];?/gm, '');
    
    // observer変数も重複を防ぐ
    modifiedScript = modifiedScript.replace(/\b(let|const|var)\s+observer\s*=/g, 'window.observer =');
    modifiedScript = modifiedScript.replace(/\bobserver\s*=/g, 'window.observer =');
    
    // currentLang = 'xx' の形式も window.currentLang に変更
    modifiedScript = modifiedScript.replace(/\bcurrentLang\s*=/g, 'window.currentLang =');
    
    // currentLang の参照を window.currentLang に変更
    modifiedScript = modifiedScript.replace(/\(currentLang/g, '(window.currentLang');
    modifiedScript = modifiedScript.replace(/\s+currentLang/g, ' window.currentLang');
    
    // setLanguage関数の引数問題を修正
    modifiedScript = modifiedScript.replace(
      /function\s+setLanguage\s*\(\s*lang\s*\)\s*{/g,
      'function setLanguage(lang, event) {'
    );
    
    // event.target参照を安全にする
    modifiedScript = modifiedScript.replace(
      /event\.target/g,
      '(event && event.target ? event.target : document.activeElement)'
    );
    
    // グローバルに初期値を設定
    (window as any).currentLang = storedLang;
    
    // スクリプトを直接実行
    const scriptElement = document.createElement('script');
    scriptElement.textContent = modifiedScript;
    scriptElement.setAttribute('data-article-script', 'true');
    document.body.appendChild(scriptElement);
    
    // 実行フラグを設定
    (window as any)[`__${scriptId}_executed`] = true;
    
    console.log('[ArticleRenderer] Scripts executed successfully');
    
    // 言語切り替え関数が存在する場合、初期言語を設定
    setTimeout(() => {
      console.log(`[ArticleRenderer] Setting up language display for: ${storedLang}`);
      
      // 言語に応じてbodyのクラスを設定（記事内のJavaScriptが期待する方法）
      if (storedLang === 'en') {
        document.body.className = 'en';
        console.log('[ArticleRenderer] Applied "en" class to document.body');
      } else {
        document.body.className = '';
        console.log('[ArticleRenderer] Removed language classes from document.body (Japanese mode)');
      }
      
      // article-content要素にも直接クラスを適用
      const articleContentElement = document.querySelector('.article-content');
      if (articleContentElement) {
        if (storedLang === 'en') {
          articleContentElement.classList.add('en');
          console.log('[ArticleRenderer] Added "en" class to .article-content element');
        } else {
          articleContentElement.classList.remove('en');
          console.log('[ArticleRenderer] Removed "en" class from .article-content element');
        }
      }
      
      // イベントオブジェクトを作成して関数を呼び出す
      const mockEvent = { 
        target: { 
          textContent: storedLang === 'ja' ? '日本語' : 'English',
          classList: { add: () => {}, remove: () => {} }
        },
        preventDefault: () => {}
      };
      
      // 記事内の言語切り替え関数を呼び出す
      if (typeof (window as any).setLang === 'function') {
        try {
          (window as any).setLang(storedLang);
          console.log(`[ArticleRenderer] Successfully called setLang(${storedLang})`);
        } catch (e) {
          console.log('[ArticleRenderer] setLang failed:', e);
        }
      }
      
      if (typeof (window as any).setLanguage === 'function') {
        try {
          (window as any).setLanguage(storedLang, mockEvent);
          console.log(`[ArticleRenderer] Successfully called setLanguage(${storedLang}) with mock event`);
        } catch (e) {
          console.log('[ArticleRenderer] setLanguage with event failed, trying without event:', e);
          try {
            (window as any).setLanguage(storedLang);
            console.log(`[ArticleRenderer] Successfully called setLanguage(${storedLang}) without event`);
          } catch (e2) {
            console.log('[ArticleRenderer] setLanguage completely failed:', e2);
          }
        }
      }
      
      // 言語表示確認のためのデバッグ
      const visibleJaElements = document.querySelectorAll('.article-content [lang="ja"]:not([style*="display: none"])');
      const visibleEnElements = document.querySelectorAll('.article-content [lang="en"]:not([style*="display: none"])');
      console.log(`[ArticleRenderer] Language display verification - Visible JA elements: ${visibleJaElements.length}, Visible EN elements: ${visibleEnElements.length}`);
    }, 300); // 少し長めの遅延でDOM要素が確実に存在するようにする
    
  } catch (error) {
    console.error('[ArticleRenderer] Script execution failed:', error);
  }
}

export default function ArticleDetail({ article, relatedArticles }: ArticleDetailProps) {
  const [displayMode, setDisplayMode] = useState<'namespaced' | 'raw'>('namespaced');
  const [parsedContent, setParsedContent] = useState<{
    styles: string;
    scripts: string;
    bodyContent: string;
  } | null>(null);
  
  // React側の言語設定を取得（ローカルストレージから）
  const [currentLanguage, setCurrentLanguage] = useState<string>('ja');
  
  useEffect(() => {
    const storedLang = localStorage.getItem('defense-intel-language');
    if (storedLang) {
      setCurrentLanguage(storedLang);
      // 記事内のcurrentLang変数を同期
      if (typeof window !== 'undefined') {
        (window as any).currentLang = storedLang;
      }
    }

    // localStorage変更を監視して言語変更を即座に反映
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'defense-intel-language' && e.newValue) {
        console.log('[ArticleDetail] Language changed via localStorage:', e.newValue);
        setCurrentLanguage(e.newValue);
        (window as any).currentLang = e.newValue;
        
        // 記事内の言語表示を即座に更新
        if (e.newValue === 'en') {
          document.body.className = 'en';
          document.querySelector('.article-content')?.classList.add('en');
        } else {
          document.body.className = '';
          document.querySelector('.article-content')?.classList.remove('en');
        }
        
        // 記事内の言語切り替え関数も呼び出す
        if (typeof (window as any).setLanguage === 'function') {
          try {
            (window as any).setLanguage(e.newValue);
            console.log(`[ArticleDetail] Called setLanguage(${e.newValue}) after storage change`);
          } catch (error) {
            console.log('[ArticleDetail] Failed to call setLanguage after storage change');
          }
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // HTMLコンテンツ解析
  useEffect(() => {
    if (article?.content) {
      console.log(`[ArticleDetail] Processing article: ${article.title}`);
      console.log(`[ArticleDetail] Article content length: ${article.content.length}`);
      console.log(`[ArticleDetail] Article content starts with:`, article.content.substring(0, 200));
      
      const parsed = parseHTMLContent(article.content);
      setParsedContent(parsed);
      
      console.log(`[ArticleDetail] Parsing complete. Styles: ${parsed.styles.length} chars, Scripts: ${parsed.scripts.length} chars, Body: ${parsed.bodyContent.length} chars`);
    }
  }, [article?.content]);

  // JavaScript実行 (クライアントサイドのみ)
  useEffect(() => {
    if (parsedContent?.scripts && displayMode === 'namespaced') {
      // スクリプト実行を少し遅延させてDOM要素が確実に存在するようにする
      setTimeout(() => {
        // React側の言語設定を記事内に同期
        const storedLang = localStorage.getItem('defense-intel-language') || 'ja';
        (window as any).currentLang = storedLang;
        
        executeScripts(parsedContent.scripts, article?.id);
        
        // onclick属性を持つ要素を確認してイベントリスナーを再設定
        const clickableElements = document.querySelectorAll('.article-content [onclick]');
        console.log(`[ArticleRenderer] Found ${clickableElements.length} clickable elements`);
      }, 100);
    }
    
    // コンポーネントがアンマウントされた時にフラグをリセット
    return () => {
      if (article?.id) {
        (window as any)[`__script-${article.id}_executed`] = false;
      }
    };
  }, [parsedContent?.scripts, displayMode, article?.id]);

  if (!article || !parsedContent) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">記事を読み込んでいます...</div>
      </div>
    );
  }

  const { styles, scripts, bodyContent } = parsedContent;

  return (
    <>
      {/* 表示モード切替 */}
      <div className="mb-6 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">表示モード:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDisplayMode('namespaced')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              displayMode === 'namespaced'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎨 CSS名前空間
          </button>
          <button
            onClick={() => setDisplayMode('raw')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              displayMode === 'raw'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📄 Raw表示
          </button>
        </div>
        <span className="text-xs text-gray-500 ml-auto">
          {displayMode === 'namespaced' 
            ? 'CSS名前空間でTailwindと共存' 
            : '元HTMLをそのまま表示'
          }
        </span>
      </div>

      {/* メインコンテンツ表示 */}
      <div className="article-display-container">
        {displayMode === 'namespaced' && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            ✅ CSS名前空間使用 - 元HTMLデザインを保持（自動追加対応）
            <a 
              href={`/raw/${article.slug}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-auto text-green-600 hover:text-green-800 underline"
            >
              元HTMLファイル表示 ↗
            </a>
          </div>
        )}

        {displayMode === 'raw' && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            📄 Raw表示モード - 完全無加工表示
          </div>
        )}

        {/* CSS名前空間表示 */}
        {displayMode === 'namespaced' && (
          <>
            {/* 名前空間化されたCSS */}
            {styles && (
              <style>
                {(() => {
                  console.log('[ArticleDetail] Original styles length:', styles.length);
                  console.log('[ArticleDetail] Original styles preview:', styles.substring(0, 300));
                  const namespacedStyles = namespaceCSS(styles);
                  console.log('[ArticleDetail] Namespaced styles length:', namespacedStyles.length);
                  console.log('[ArticleDetail] First 500 chars of namespaced CSS:', namespacedStyles.substring(0, 500));
                  return namespacedStyles;
                })()}
                {/* 追加のレイアウト修正CSS */}
                {`
                  .article-display-container .article-content {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    min-height: 100vh !important;
                    box-sizing: border-box !important;
                  }
                  
                  /* 親コンテナからの制約を解除 */
                  .article-display-container {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100vw !important;
                    max-width: none !important;
                    margin-left: calc(-50vw + 50%) !important;
                    margin-right: calc(-50vw + 50%) !important;
                  }
                  
                  /* ページ全体レイアウトの上書き */
                  body {
                    overflow-x: hidden;
                  }

                  /* グリッドレイアウト修正の強制適用 */
                  .article-content .grid-container {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important;
                    gap: 25px !important;
                    margin-bottom: 30px !important;
                  }

                  .article-content .decision-cycle {
                    display: grid !important;
                    grid-template-columns: repeat(4, 1fr) !important;
                    gap: 20px !important;
                    margin: 20px 0 !important;
                  }

                  .article-content .capability-grid {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
                    gap: 15px !important;
                    margin: 20px 0 !important;
                  }

                  .article-content .tech-detail-grid {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
                    gap: 20px !important;
                    margin: 20px 0 !important;
                  }

                  .article-content .stats-container {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
                    gap: 20px !important;
                    margin: 30px 0 !important;
                  }

                  /* 記事内言語切り替えボタンを小さく調整（機能は維持） */
                  .article-content .language-switcher,
                  .article-content .lang-toggle,
                  .article-content .language-toggle,
                  .article-content .lang {
                    position: fixed !important;
                    top: 10px !important;
                    right: 10px !important;
                    z-index: 100 !important;
                    transform: scale(0.6) !important;
                    opacity: 0.7 !important;
                    background: rgba(255, 255, 255, 0.95) !important;
                    border-radius: 8px !important;
                    padding: 4px !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
                    transition: all 0.3s ease !important;
                  }
                  
                  .article-content .language-switcher:hover,
                  .article-content .lang-toggle:hover,
                  .article-content .language-toggle:hover,
                  .article-content .lang:hover {
                    opacity: 1 !important;
                    transform: scale(0.7) !important;
                  }

                  .article-content .lang-btn {
                    font-size: 11px !important;
                    padding: 4px 8px !important;
                    margin: 0 2px !important;
                    border-radius: 4px !important;
                    border: 1px solid #ddd !important;
                    background: #f8f9fa !important;
                    color: #666 !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                  }
                  
                  .article-content .lang-btn.active {
                    background: #007bff !important;
                    color: white !important;
                  }
                  
                  .article-content .lang-btn:hover {
                    background: #e9ecef !important;
                  }
                  
                  .article-content .lang-btn.active:hover {
                    background: #0056b3 !important;
                  }
                  
                  /* 記事内の言語切り替え機能を有効化 */
                  .article-content [lang="en"] {
                    display: none !important;
                  }
                  
                  .article-content [lang="ja"] {
                    display: block !important;
                  }
                  
                  /* 英語モード時の表示切り替え */
                  .article-content.en [lang="ja"],
                  body.en .article-content [lang="ja"] {
                    display: none !important;
                  }
                  
                  .article-content.en [lang="en"],
                  body.en .article-content [lang="en"] {
                    display: block !important;
                  }

                  /* レスポンシブ対応 */
                  @media (max-width: 768px) {
                    .article-content .grid-container {
                      grid-template-columns: 1fr !important;
                    }
                    .article-content .decision-cycle {
                      grid-template-columns: 1fr !important;
                    }
                    
                    /* モバイルでは記事内言語ボタンをより小さく */
                    .article-content .language-switcher,
                    .article-content .lang-toggle,
                    .article-content .lang {
                      transform: scale(0.6) !important;
                      top: 5px !important;
                      right: 5px !important;
                    }
                  }
                `}
              </style>
            )}
            
            {/* 名前空間化されたHTML */}
            <div 
              className={`article-content ${currentLanguage === 'en' ? 'en' : ''}`}
              style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}
              dangerouslySetInnerHTML={{ 
                __html: (() => {
                  console.log('[ArticleDetail] Rendering HTML content, length:', bodyContent.length);
                  console.log('[ArticleDetail] Current language for article display:', currentLanguage);
                  console.log('[ArticleDetail] Article content div will have class:', `article-content ${currentLanguage === 'en' ? 'en' : ''}`);
                  console.log('[ArticleDetail] First 500 chars of body content:', bodyContent.substring(0, 500));
                  return bodyContent;
                })()
              }}
            />
          </>
        )}

        {/* Raw表示 */}
        {displayMode === 'raw' && (
          <div className="bg-white rounded border">
            <iframe
              src={`/raw/${article.slug}`}
              className="w-full h-[800px] border-0"
              title={article.title}
            />
          </div>
        )}

      </div>
    </>
  );
}