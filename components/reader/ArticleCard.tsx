'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { measureTextHeight } from '@/lib/pretext'
import type { ArticleMetadata } from '@/lib/types/article'

interface ArticleCardProps {
  article: ArticleMetadata
  currentWidth: number
  pretextEnabled: boolean
}

const CARD_FONT = '400 14px Inter, system-ui, sans-serif'
const CARD_PADDING = 48 // p-6 (24px) + p-6 (24px) = 48px total
const LINE_HEIGHT = 20
const MIN_EXCERPT_HEIGHT = 60 // Altura mínima para mostrar o texto

export default function ArticleCard({ article, currentWidth, pretextEnabled }: ArticleCardProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const excerptHeight = useMemo(() => {
    if (!isHydrated || !pretextEnabled || !currentWidth || currentWidth <= 0) {
      // Retorna altura mínima quando o pretext está desligado
      return MIN_EXCERPT_HEIGHT
    }

    // A largura do texto é a largura do card menos o padding total
    // Considera que o card tem padding horizontal de 24px (p-6) em cada lado
    const textWidth = Math.max(100, Math.floor(currentWidth - CARD_PADDING))

    try {
      const result = measureTextHeight(
        article.excerpt,
        CARD_FONT,
        textWidth,
        LINE_HEIGHT,
        {
          whiteSpace: 'normal',
          wordBreak: 'normal'
        }
      )
      // Retorna pelo menos a altura mínima
      return Math.max(MIN_EXCERPT_HEIGHT, Math.ceil(result.height) + 4)
    } catch (error) {
      console.warn('Failed to measure text height:', error)
      return MIN_EXCERPT_HEIGHT
    }
  }, [article.excerpt, currentWidth, isHydrated, pretextEnabled])

  return (
    <Link href={`/articles/${article.id}`} className="block h-full">
      <article className="group bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col">
        {article.coverImage && (
          <div className="h-44 w-full bg-muted overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold mb-2 leading-snug line-clamp-2">
            {article.title}
          </h2>

          <div
            style={{
              height: isHydrated && pretextEnabled && excerptHeight > 0 ? `${excerptHeight}px` : 'auto',
              minHeight: `${MIN_EXCERPT_HEIGHT}px`,
              lineHeight: `${LINE_HEIGHT}px`,
              fontSize: '14px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word'
            }}
            className="text-muted-foreground mb-4"
          >
            {article.excerpt}
          </div>

          <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
            <span>{article.author}</span>
            <span>{article.readTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  )
}