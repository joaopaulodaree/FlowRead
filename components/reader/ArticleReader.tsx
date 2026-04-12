'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { getCachedArticleMeasurements } from '@/lib/pretext'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { PretextToggle } from '@/components/demo/PretextToggle'
import { WidthSlider } from '@/components/demo/WidthSlider'
import type { Article } from '@/lib/types/article'

interface ArticleReaderProps {
  article: Article
  maxWidth?: number
  font?: string
}

const DEFAULT_FONT = '400 16px Inter'
const DEFAULT_LINE_HEIGHT = 26

export function ArticleReader({
  article,
  maxWidth = 800,
  font = DEFAULT_FONT,
}: ArticleReaderProps) {
  const [pretextEnabled, setPretextEnabled] = useState(true)
  const [previewWidth, setPreviewWidth] = useState(maxWidth)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const wordCount = useMemo(() => {
    return article.content.trim().split(/\s+/).filter(Boolean).length
  }, [article.content])

  const measurements = useMemo(() => {
    if (!pretextEnabled || !isHydrated) {
      return {
        height: 0,
        readingTime: Math.max(1, Math.ceil(wordCount / 200)),
        wordCount,
      }
    }

    return getCachedArticleMeasurements(
      article.id,
      article.content,
      previewWidth,
      font,
      DEFAULT_LINE_HEIGHT,
    )
  }, [article.id, article.content, previewWidth, pretextEnabled, isHydrated, font, wordCount])

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
            <div className="h-4 w-px bg-border" />
            <PretextToggle enabled={pretextEnabled} setPretextEnabled={setPretextEnabled} />
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

          <div
            style={{
              width: previewWidth,
              height: isHydrated && pretextEnabled && measurements.height > 0 
                ? `${measurements.height}px` 
                : 'auto',
              overflow: 'hidden',
              position: 'relative',              
            }}
          >
            <div
              style={{
                font: font,
                lineHeight: `${DEFAULT_LINE_HEIGHT}px`,
                whiteSpace: 'pre-wrap',
                margin: 0,
                padding: 0,
                display: 'block'
              }}
            >
              {article.content}
            </div>
          </div>
        </div>
      </main>
    </article>
  )
}