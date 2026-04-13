// Article schema definition

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  contentHtml?: string
  leadHtml?: string
  author: string
  date: string
  readTime: number
  tags: string[]
  coverImage?: string
}

export interface ArticleMetadata {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: number
  tags: string[]
  coverImage?: string
}
