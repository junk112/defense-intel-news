import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/hooks/useLanguage'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '防衛情報インテリジェンス ニュースポータル',
  description: '防衛・安全保障関連の最新情報と分析レポートを提供する専門ニュースサイト',
  keywords: '防衛, 安全保障, インテリジェンス, 軍事, 分析, ニュース',
  authors: [{ name: '防衛情報研究センター' }],
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-slate-50 to-blue-50`}>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}