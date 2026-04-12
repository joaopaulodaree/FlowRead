'use client'

import { useMemo, useState } from 'react'
import ArticleCard from '@/components/reader/ArticleCard'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { PretextToggle } from '@/components/demo/PretextToggle'
import { WidthSlider } from '@/components/demo/WidthSlider'
import { getArticles } from '@/lib/data/articles'

export default function ArticlesPage() {
  const [pretextEnabled, setPretextEnabled] = useState(true)
  const [previewWidth, setPreviewWidth] = useState(1100)
  const articles = useMemo(() => getArticles(), [])

  const cardWidth = useMemo(() => {
    const gap = 24
    if (previewWidth >= 1280) return (previewWidth - (gap * 2)) / 3 
    if (previewWidth >= 640) return (previewWidth - gap) / 2       
    return previewWidth                                            
  }, [previewWidth])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Articles</h1>
            <ThemeToggle />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <PretextToggle enabled={pretextEnabled} setPretextEnabled={setPretextEnabled} />
            <WidthSlider 
              label="Grid width" 
              value={previewWidth} 
              onChange={setPreviewWidth} 
              min={400} 
              max={1400} 
              step={1} 
            />
          </div>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto" style={{ width: previewWidth }}>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                currentWidth={cardWidth}
                pretextEnabled={pretextEnabled}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}