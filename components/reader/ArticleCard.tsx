'use client'

import { useEffect, useState } from 'react'
import { measureTextHeight } from '@/lib/pretext'
import type { ArticleMetadata } from '@/lib/types/article'

interface ArticleCardProps {
  article: ArticleMetadata
}

const CARD_FONT = '16px system-ui, sans-serif'
const CARD_PADDING_X = 48 // 24px each side
const TAG_LINE_HEIGHT = 32 // approximate tag row height

export default function ArticleCard({ article }: ArticleCardProps) {
  const [excerptHeight, setExcerptHeight] = useState<number | null>(null)

  useEffect(() => {
    // Measure excerpt text height using Pretext (no DOM reflow)
    const cardWidth = 320 // fallback estimate
    const textWidth = cardWidth - CARD_PADDING_X
    try {
      const result = measureTextHeight(
        article.excerpt,
        CARD_FONT,
        textWidth,
        1.6,
      )
      setExcerptHeight(result.height)
    } catch {
      // Pretext may fail in SSR or before font load — graceful fallback
      setExcerptHeight(null)
    }
  }, [article.excerpt])

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      {article.coverImage && (
        <div className="h-44 w-full bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
          {article.title}
        </h2>
        <p
          className="text-gray-500 text-sm leading-relaxed mb-4"
          style={
            excerptHeight
              ? {
                  height: excerptHeight,
                  overflow: 'hidden',
                }
              : undefined
          }
        >
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {article.author} &middot; {article.date}
          </span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </article>
  )
}
