import Link from 'next/link'
import { getArticles } from '@/lib/data/articles'
import ArticleCard from '@/components/reader/ArticleCard'

export default function ArticlesPage() {
  const articles = getArticles()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            TextReader
          </Link>
          <span className="text-sm text-gray-400">
            {articles.length} articles
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Articles
        </h1>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block"
            >
              <ArticleCard article={article} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
