import { getArticles } from '@/lib/data/articles'
import { ArticlesPageClient } from '@/components/reader/ArticlesPageClient'

export default async function ArticlesPage() {
  const articles = await getArticles()

  return <ArticlesPageClient initialArticles={articles} />
}
