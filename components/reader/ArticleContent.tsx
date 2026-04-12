import ReactMarkdown from 'react-markdown'
import type { Article } from '@/lib/types/article'

interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose lg:prose-xl mx-auto">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}