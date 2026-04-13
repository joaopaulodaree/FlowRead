import { notFound } from 'next/navigation'
import { getArticleById } from '@/lib/data/articles'
import { ArticleReader } from '@/components/reader/ArticleReader'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const guardianId = decodeURIComponent(id)

  const article = await getArticleById(guardianId)

  if (!article) {
    notFound()
  }

  return <ArticleReader article={article} />
}