import { sampleArticles, Article, ArticleMetadata } from '@/lib/types/article'

/**
 * Get all articles with their metadata.
 * In production, this would fetch from a CMS or MDX files.
 */
export function getArticles(): ArticleMetadata[] {
  return sampleArticles.map(({ content, ...meta }) => meta)
}

/**
 * Get a single article by ID.
 */
export function getArticleById(id: string): Article | undefined {
  return sampleArticles.find((a) => a.id === id)
}

/**
 * Get all article IDs for static params.
 */
export function getArticleIds(): string[] {
  return sampleArticles.map((a) => a.id)
}