import { notFound } from 'next/navigation'
import { getArticleById } from '@/lib/data/articles'
import { ArticleReader } from '@/components/reader/ArticleReader'

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const article = getArticleById(id)

  if (!article) {
    notFound()
  }

  return <ArticleReader article={article} />
}