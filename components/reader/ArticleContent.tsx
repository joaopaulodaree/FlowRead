'use client'

import { useEffect, useState } from 'react'

interface ArticleContentProps {
  content: string
  html?: string
}

const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'CITE',
  'DIV',
  'EM',
  'FIGCAPTION',
  'FIGURE',
  'H2',
  'H3',
  'H4',
  'HR',
  'I',
  'IMG',
  'LI',
  'OL',
  'P',
  'PICTURE',
  'SOURCE',
  'SPAN',
  'STRONG',
  'UL',
])

const ALLOWED_ATTRIBUTES = new Set([
  'alt',
  'class',
  'height',
  'href',
  'loading',
  'rel',
  'sizes',
  'src',
  'srcset',
  'target',
  'title',
  'width',
])

function isSafeUrl(value: string) {
  if (!value) return true

  try {
    const url = new URL(value, window.location.origin)
    return ['http:', 'https:', 'mailto:'].includes(url.protocol)
  } catch {
    return false
  }
}

function sanitizeHtml(rawHtml: string) {
  const document = new DOMParser().parseFromString(rawHtml, 'text/html')
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
  const nodes: Element[] = []

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Element)
  }

  for (const element of nodes.reverse()) {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      continue
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase()
      const value = attribute.value

      if (name.startsWith('on') || !ALLOWED_ATTRIBUTES.has(name)) {
        element.removeAttribute(attribute.name)
        continue
      }

      if ((name === 'href' || name === 'src' || name === 'srcset') && !isSafeUrl(value)) {
        element.removeAttribute(attribute.name)
      }
    }

    if (element.tagName === 'A') {
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noreferrer')
    }

    if (element.tagName === 'IMG') {
      element.setAttribute('loading', 'lazy')
    }
  }

  return document.body.innerHTML
}

export function ArticleContent({ content, html }: ArticleContentProps) {
  const [safeHtml, setSafeHtml] = useState('')

  useEffect(() => {
    if (!html) {
      setSafeHtml('')
      return
    }

    setSafeHtml(sanitizeHtml(html))
  }, [html])

  if (html && safeHtml) {
    return (
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    )
  }

  return (
    <div className="article-content whitespace-pre-wrap">
      {content}
    </div>
  )
}
