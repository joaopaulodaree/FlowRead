import { Article, ArticleMetadata } from '@/lib/types/article'
import { fetchGuardianArticleById, fetchGuardianArticles } from './guardian'

export async function getArticles(): Promise<ArticleMetadata[]> {
  const guardianArticles = await fetchGuardianArticles()
  return guardianArticles.map(({ content, contentHtml, leadHtml, ...meta }) => meta)
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  return fetchGuardianArticleById(id)
}

export async function getArticleIds(): Promise<string[]> {
  const articles = await fetchGuardianArticles()
  return articles.map((article) => article.id)
}
