import { Article } from '@/lib/types/article'

const GUARDIAN_API_BASE = 'https://content.guardianapis.com'

type GuardianResult = {
  id: string
  webTitle: string
  webPublicationDate?: string
  fields?: {
    trailText?: string
    body?: string
    bodyText?: string
    main?: string
    thumbnail?: string
    byline?: string
    wordcount?: string | number
  }
}

function stripHtml(value?: string) {
  if (!value) return ''
  return value.replace(/<[^>]*>/g, '').trim()
}

function getGuardianApiKey() {
  return process.env.GUARDIAN_KEY
}

function mapGuardianArticle(item: GuardianResult): Article {
  const fields = item.fields ?? {}
  const wordCount = Number(fields.wordcount ?? 0)

  return {
    id: item.id,
    title: item.webTitle,
    excerpt: stripHtml(fields.trailText),
    content: fields.bodyText ?? '',
    contentHtml: fields.body,
    leadHtml: fields.main,
    author: fields.byline || 'The Guardian',
    date: item.webPublicationDate?.split('T')[0] ?? '',
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
    tags: [],
    coverImage: fields.thumbnail,
  }
}

export async function fetchGuardianArticles(): Promise<Article[]> {
  const apiKey = getGuardianApiKey()

  if (!apiKey) {
    console.warn('Guardian API key not set')
    return []
  }

  const params = new URLSearchParams({
    'api-key': apiKey,
    'page-size': '10',
    'order-by': 'newest',
    'show-fields': 'trailText,body,bodyText,main,thumbnail,byline,wordcount',
  })

  const res = await fetch(`${GUARDIAN_API_BASE}/search?${params.toString()}`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    console.error('Failed to fetch Guardian articles', res.status)
    return []
  }

  const data = await res.json()
  const results: GuardianResult[] = data?.response?.results ?? []

  return results.map(mapGuardianArticle)
}

export async function fetchGuardianArticleById(id: string): Promise<Article | undefined> {
  const apiKey = getGuardianApiKey()

  if (!apiKey) {
    console.warn('Guardian API key not set')
    return undefined
  }

  const params = new URLSearchParams({
    'api-key': apiKey,
    'show-fields': 'trailText,body,bodyText,main,thumbnail,byline,wordcount',
  })

  const res = await fetch(
    `${GUARDIAN_API_BASE}/${id}?${params.toString()}`,
    { next: { revalidate: 300 } }
  )

  if (res.status === 404) {
    return undefined
  }

  if (!res.ok) {
    console.error('Failed to fetch Guardian article', res.status)
    return undefined
  }

  const data = await res.json()
  const content: GuardianResult | undefined = data?.response?.content

  return content ? mapGuardianArticle(content) : undefined
}
