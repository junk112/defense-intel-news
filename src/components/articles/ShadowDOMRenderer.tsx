/**
 * Shadow DOM Renderer (保管用)
 * 
 * この実装は完全なShadow DOM分離アプローチです。
 * 元HTMLのデザイン・機能を100%保持しますが、複雑性が高いため現在は未使用。
 * 将来的に完全分離が必要な場合に利用可能。
 */

import { useEffect, useRef, useState } from 'react';

interface ShadowDOMRendererProps {
  content: string;
  onError?: (error: Error) => void;
}

export function ShadowDOMRenderer({ content, onError }: ShadowDOMRendererProps) {
  const [mounted, setMounted] = useState(false);
  const shadowHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper functions for Shadow DOM
  const unescapeFromAttribute = (str: string): string => {
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&#10;/g, '\n');
  };

  // Shadow DOM setup
  useEffect(() => {
    if (!mounted || !shadowHostRef.current || !content.includes('shadow-dom-container')) {
      return;
    }

    try {
      console.log('[ShadowDOM] Setting up Shadow DOM for article...');
      
      const shadowHost = shadowHostRef.current.querySelector('.shadow-host') as HTMLElement;
      if (!shadowHost) {
        console.warn('[ShadowDOM] Shadow host not found');
        return;
      }

      const shadowRoot = shadowHostRef.current.attachShadow({ mode: 'open' });

      // Extract data
      const stylesData = shadowHost.getAttribute('data-shadow-styles');
      const scriptsData = shadowHost.getAttribute('data-shadow-scripts');

      // Inject styles
      if (stylesData) {
        const styles = unescapeFromAttribute(stylesData);
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        shadowRoot.appendChild(styleElement);
        console.log('[ShadowDOM] Injected original styles');
      }

      // Create content wrapper
      const contentWrapper = document.createElement('div');
      contentWrapper.innerHTML = shadowHost.innerHTML;
      shadowRoot.appendChild(contentWrapper);

      // Shadow DOM document proxy
      const shadowDocumentProxy = new Proxy(document, {
        get(target, prop) {
          if (prop === 'querySelector') {
            return (selector: any) => shadowRoot.querySelector(selector);
          }
          if (prop === 'querySelectorAll') {
            return (selector: any) => shadowRoot.querySelectorAll(selector);
          }
          if (prop === 'getElementById') {
            return (id: any) => shadowRoot.querySelector(`#${id}`);
          }
          return (target as any)[prop];
        }
      });

      // Execute scripts
      if (scriptsData) {
        const scripts = unescapeFromAttribute(scriptsData);
        
        try {
          console.log('[ShadowDOM] Setting up scripts and event handlers');
          
          // Execute script with shadow context
          const executeScript = new Function('document', 'shadowRoot', 'window', `
            ${scripts}
            console.log('[ShadowDOM] Functions registered with shadow context');
          `);
          
          executeScript(shadowDocumentProxy, shadowRoot, window);
          
          // Register functions globally
          try {
            const globalScript = document.createElement('script');
            globalScript.textContent = scripts;
            document.head.appendChild(globalScript);
            console.log('[ShadowDOM] Global functions registered via script tag');
          } catch (fallbackError) {
            console.warn('[ShadowDOM] Global registration failed:', fallbackError);
          }
          
          // Setup event handlers
          setTimeout(() => {
            const shadowDoc = shadowDocumentProxy;
            const clickableElements = shadowRoot.querySelectorAll('[onclick]');
            console.log(`[ShadowDOM] Found ${clickableElements.length} clickable elements`);
            
            clickableElements.forEach((element, index) => {
              if (!(element instanceof HTMLElement)) {
                console.warn(`[ShadowDOM] Skipping non-HTMLElement at index ${index}`);
                return;
              }
              
              const onclickAttr = element.getAttribute('onclick');
              if (!onclickAttr) return;
              
              console.log(`[ShadowDOM] Setting up click handler ${index + 1}: ${onclickAttr.substring(0, 50)}...`);
              
              element.removeAttribute('onclick');
              
              try {
                element.addEventListener('click', (e) => {
                  try {
                    console.log(`[ShadowDOM] Executing click handler: ${onclickAttr}`);
                    
                    // Handle different function types
                    if (onclickAttr.includes('showTab')) {
                      const match = onclickAttr.match(/showTab\('([^']+)'\)/);
                      if (match) {
                        const tabId = match[1];
                        console.log(`[ShadowDOM] Showing tab: ${tabId}`);
                        
                        shadowRoot.querySelectorAll('.tab-content, .tab, [class*="tab-content"]').forEach(content => {
                          content.classList.remove('active');
                          if (content instanceof HTMLElement && content.style) content.style.display = 'none';
                        });
                        
                        const targetTab = shadowRoot.querySelector(`#${tabId}, .${tabId}, [data-tab="${tabId}"]`);
                        if (targetTab) {
                          targetTab.classList.add('active');
                          if (targetTab instanceof HTMLElement && targetTab.style) targetTab.style.display = 'block';
                        }
                        
                        shadowRoot.querySelectorAll('.tab, .tab-button, [class*="tab"]').forEach(btn => {
                          btn.classList.remove('active');
                        });
                        element.classList.add('active');
                        
                        console.log(`[ShadowDOM] Tab show completed: ${tabId}`);
                      }
                    } else if (onclickAttr.includes('switchTab')) {
                      const match = onclickAttr.match(/switchTab\('([^']+)',\s*this\)/);
                      if (match) {
                        const tabId = match[1];
                        console.log(`[ShadowDOM] Switching to tab: ${tabId}`);
                        
                        const contents = shadowRoot.querySelectorAll('.tab-content');
                        contents.forEach(content => {
                          content.classList.remove('active');
                        });
                        
                        const buttons = shadowRoot.querySelectorAll('.tab-button');
                        buttons.forEach(button => {
                          button.classList.remove('active');
                        });
                        
                        const targetTab = shadowRoot.querySelector(`#${tabId}`);
                        if (targetTab) {
                          targetTab.classList.add('active');
                        }
                        
                        element.classList.add('active');
                        
                        console.log(`[ShadowDOM] Tab switch completed: ${tabId}`);
                      }
                    } else if (onclickAttr.includes('toggleTimelineDetail')) {
                      const match = onclickAttr.match(/toggleTimelineDetail\((\d+)\)/);
                      if (match) {
                        const index = parseInt(match[1]);
                        const detail = shadowRoot.querySelector(`#timeline-detail-${index}`);
                        if (detail instanceof HTMLElement && detail.style) {
                          detail.style.display = detail.style.display === 'block' ? 'none' : 'block';
                          console.log(`[ShadowDOM] Timeline detail ${index} toggled`);
                        }
                      }
                    } else if (onclickAttr.includes('setLanguage')) {
                      const match = onclickAttr.match(/setLanguage\('([^']+)'\)/);
                      if (match) {
                        const lang = match[1];
                        console.log(`[ShadowDOM] Switching language to: ${lang}`);
                        
                        shadowRoot.querySelectorAll('.lang-btn').forEach(btn => {
                          btn.classList.remove('active');
                        });
                        element.classList.add('active');
                        
                        shadowRoot.querySelectorAll('[data-ja]').forEach(elem => {
                          if (elem.hasAttribute('data-' + lang)) {
                            elem.textContent = elem.getAttribute('data-' + lang);
                          }
                        });
                        
                        console.log(`[ShadowDOM] Language switch completed: ${lang}`);
                      }
                    } else if (onclickAttr.includes('showDetail')) {
                      const match = onclickAttr.match(/showDetail\('([^']+)'\)/);
                      if (match) {
                        const detailId = match[1];
                        console.log(`[ShadowDOM] Showing detail for: ${detailId}`);
                        
                        const modal = shadowRoot.querySelector('#modal') || shadowRoot.querySelector('.modal');
                        const modalTitle = shadowRoot.querySelector('#modal-title') || shadowRoot.querySelector('.modal-header h2');
                        const modalBody = shadowRoot.querySelector('#modal-body') || shadowRoot.querySelector('.modal-body');
                        
                        if (modal) {
                          try {
                            const scriptEval = new Function('return typeof detailData !== "undefined" ? detailData : null');
                            const detailData = scriptEval();
                            
                            if (detailData && detailData[detailId]) {
                              const data = detailData[detailId];
                              const lang = shadowRoot.querySelector('.lang-btn.active')?.getAttribute('data-lang') || 'ja';
                              
                              if (modalTitle && data.title) {
                                modalTitle.innerHTML = data.title[lang] || data.title.ja || '';
                              }
                              if (modalBody && data.content) {
                                modalBody.innerHTML = data.content[lang] || data.content.ja || '';
                              }
                            }
                          } catch (err) {
                            console.warn('[ShadowDOM] Could not access detailData:', err);
                          }
                          
                          modal.classList.add('active');
                          console.log(`[ShadowDOM] Modal activated for ${detailId}`);
                        } else {
                          console.warn(`[ShadowDOM] Modal not found for detail ${detailId}`);
                        }
                      }
                    } else if (onclickAttr.includes('closeModal')) {
                      console.log(`[ShadowDOM] Closing modal`);
                      const modal = shadowRoot.querySelector('#modal') || shadowRoot.querySelector('.modal');
                      if (modal) {
                        modal.classList.remove('active');
                      }
                    } else if (onclickAttr.includes('toggleScenario')) {
                      const match = onclickAttr.match(/toggleScenario\('([^']+)'\)/);
                      if (match) {
                        const scenarioId = match[1];
                        const details = shadowRoot.querySelector(`#details-${scenarioId}`);
                        const arrow = shadowRoot.querySelector(`#arrow-${scenarioId}`);
                        
                        if (details) {
                          if (details.classList.contains('active')) {
                            details.classList.remove('active');
                            if (arrow instanceof HTMLElement && arrow.style) arrow.style.transform = 'rotate(0deg)';
                          } else {
                            shadowRoot.querySelectorAll('.scenario-details').forEach(d => {
                              d.classList.remove('active');
                            });
                            shadowRoot.querySelectorAll('[id^="arrow-"]').forEach(a => {
                              if (a instanceof HTMLElement && a.style) a.style.transform = 'rotate(0deg)';
                            });
                            
                            details.classList.add('active');
                            if (arrow instanceof HTMLElement && arrow.style) arrow.style.transform = 'rotate(90deg)';
                          }
                          console.log(`[ShadowDOM] Scenario ${scenarioId} toggled`);
                        }
                      }
                    } else {
                      // Generic evaluation
                      try {
                        const contextualEval = new Function('document', 'shadowRoot', onclickAttr);
                        contextualEval(shadowDoc, shadowRoot);
                      } catch (evalError) {
                        console.warn('[ShadowDOM] Contextual eval failed, trying global:', evalError);
                        (0, eval)(onclickAttr);
                      }
                    }
                    
                  } catch (error) {
                    console.error('[ShadowDOM] Click handler execution failed:', error, 'Handler:', onclickAttr);
                  }
                });
                
                element.setAttribute('data-original-onclick', onclickAttr);
                
              } catch (addListenerError) {
                console.error(`[ShadowDOM] Failed to add event listener at index ${index}:`, addListenerError);
                element.setAttribute('onclick', onclickAttr);
              }
            });
            
            console.log('[ShadowDOM] Event handlers setup completed');
          }, 200);
          
        } catch (error) {
          console.error('[ShadowDOM] Script setup failed:', error);
          onError?.(error as Error);
        }
      }
      
      console.log('[ShadowDOM] Article setup completed successfully');
      
    } catch (error) {
      console.error('[ShadowDOM] Failed to setup Shadow DOM:', error);
      onError?.(error as Error);
    }
  }, [mounted, content, onError]);

  if (!mounted) {
    return null;
  }

  return (
    <div ref={shadowHostRef} className="shadow-dom-root">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default ShadowDOMRenderer;