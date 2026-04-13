'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { WidthSlider } from '@/components/demo/WidthSlider'
import { ArticleContent } from '@/components/reader/ArticleContent'
import type { Article } from '@/lib/types/article'

interface ArticleReaderProps {
  article: Article
  maxWidth?: number
  font?: string
}

const DEFAULT_FONT = '400 16px Arial'

export function ArticleReader({
  article,
  maxWidth = 800,
  font = DEFAULT_FONT,
}: ArticleReaderProps) {
  const [previewWidth, setPreviewWidth] = useState(maxWidth)

  return (
    <article className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/articles" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Articles
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <WidthSlider 
              value={previewWidth} 
              onChange={setPreviewWidth} 
              min={320} 
              max={1200} 
              step={1} 
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="px-6 py-10">
        <div className="mx-auto" style={{ width: previewWidth }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">{article.title}</h1>
            <p className="text-sm text-muted-foreground">
              {article.author} • {article.date}
            </p>
          </div>

          {article.leadHtml ? (
            <div className="mb-8">
              <ArticleContent content="" html={article.leadHtml} />
            </div>
          ) : article.coverImage && (
            <img
              src={article.coverImage}
              alt=""
              className="mb-8 aspect-video w-full rounded-lg object-cover"
            />
          )}

          <div style={{ font }}>
            <ArticleContent content={article.content} html={article.contentHtml} />
          </div>
        </div>
      </main>
    </article>
  )
}
