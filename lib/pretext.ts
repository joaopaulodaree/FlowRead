import { layout, prepare } from '@chenglou/pretext'

type WhiteSpaceMode = 'normal' | 'pre-wrap'
type WordBreakMode = 'normal' | 'keep-all'

export interface TextMeasurement {
  height: number
  lines: number
  isTruncated: boolean
}

export interface ArticleMeasurements {
  height: number
  readingTime: number
  wordCount: number
}

const preparedCache = new Map<string, ReturnType<typeof prepare>>()
const articleMeasurementsCache = new Map<string, ArticleMeasurements>()

const DEFAULT_FONT = '400 16px Inter'
const DEFAULT_LINE_HEIGHT = 26

/**
 * Melhora a estimativa de altura quando o Pretext não pode rodar (ex: SSR)
 */
function fallbackMeasureTextHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
): TextMeasurement {
  const fontSizeMatch = font.match(/(\d+)px/)
  const fontSize = fontSizeMatch ? Number.parseInt(fontSizeMatch[1], 10) : 16

  // Estimativa baseada na largura média de caracteres da Inter/Sans
  const avgCharWidth = fontSize * 0.52
  const charsPerLine = Math.max(10, Math.floor(maxWidth / avgCharWidth))

  // Lida com quebras de linha manuais no texto
  const linesArray = text.split('\n')
  let estimatedTotalLines = 0

  for (const line of linesArray) {
    const trimmedLine = line.trim()
    if (!trimmedLine) {
      estimatedTotalLines += 1 // Linha vazia ainda ocupa espaço
      continue
    }

    // Considera palavras, não apenas caracteres
    const words = trimmedLine.split(/\s+/)
    let currentLineChars = 0
    let linesForThisParagraph = 1

    for (const word of words) {
      const wordLength = word.length

      if (currentLineChars + wordLength + (currentLineChars > 0 ? 1 : 0) > charsPerLine) {
        // Nova linha necessária
        linesForThisParagraph += 1
        currentLineChars = wordLength
      } else {
        // Continua na mesma linha
        currentLineChars += wordLength + (currentLineChars > 0 ? 1 : 0)
      }
    }

    estimatedTotalLines += linesForThisParagraph
  }

  // Garante pelo menos uma linha
  estimatedTotalLines = Math.max(1, estimatedTotalLines)

  return {
    height: estimatedTotalLines * lineHeight,
    lines: estimatedTotalLines,
    isTruncated: false,
  }
}

function getPreparedText(
  text: string,
  font: string,
  whiteSpace: WhiteSpaceMode,
  wordBreak: WordBreakMode,
) {
  const key = `${font}__${whiteSpace}__${wordBreak}__${text}`

  let prepared = preparedCache.get(key)
  if (!prepared) {
    prepared = prepare(text, font, { whiteSpace, wordBreak })
    preparedCache.set(key, prepared)
  }

  return prepared
}

export function measureTextHeight(
  text: string,
  font: string = DEFAULT_FONT,
  maxWidth: number = 800,
  lineHeight: number = DEFAULT_LINE_HEIGHT,
  options?: {
    whiteSpace?: WhiteSpaceMode
    wordBreak?: WordBreakMode
  },
): TextMeasurement {
  const normalizedText = text ?? ''
  const safeWidth = Math.max(1, maxWidth)

  if (!normalizedText.trim()) {
    return {
      height: lineHeight,
      lines: 1,
      isTruncated: false,
    }
  }

  const whiteSpace = options?.whiteSpace ?? 'normal'
  const wordBreak = options?.wordBreak ?? 'normal'

  try {
    // Pretext necessita do ambiente do browser (canvas/DOM)
    if (typeof window === 'undefined') {
      return fallbackMeasureTextHeight(normalizedText, font, safeWidth, lineHeight)
    }

    const prepared = getPreparedText(normalizedText, font, whiteSpace, wordBreak)
    const result = layout(prepared, safeWidth, lineHeight)

    return {
      height: result.height,
      lines: result.lineCount,
      isTruncated: false,
    }
  } catch (e) {
    console.warn('Pretext layout failed, falling back to manual measurement', e)
    return fallbackMeasureTextHeight(normalizedText, font, safeWidth, lineHeight)
  }
}

export function measureArticleContent(
  content: string,
  maxWidth: number = 800,
  font: string = DEFAULT_FONT,
  lineHeight: number = DEFAULT_LINE_HEIGHT,
): ArticleMeasurements {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return {
    height: measureTextHeight(content, font, maxWidth, lineHeight, {
      whiteSpace: 'pre-wrap',
    }).height,
    readingTime: Math.max(1, Math.ceil(wordCount / 200)),
    wordCount,
  }
}

export function getCachedArticleMeasurements(
  articleId: string,
  content: string,
  maxWidth: number = 800,
  font: string = DEFAULT_FONT,
  lineHeight: number = DEFAULT_LINE_HEIGHT,
): ArticleMeasurements {
  // Arredonda a largura para evitar muitas chaves de cache diferentes
  const roundedWidth = Math.round(maxWidth / 10) * 10
  const cacheKey = `${articleId}-${roundedWidth}-${font}-${lineHeight}`

  let cached = articleMeasurementsCache.get(cacheKey)
  if (!cached) {
    cached = measureArticleContent(content, maxWidth, font, lineHeight)
    articleMeasurementsCache.set(cacheKey, cached)

    // Limita o cache para evitar vazamento de memória
    if (articleMeasurementsCache.size > 100) {
      // Remove as entradas mais antigas
      const firstKey = articleMeasurementsCache.keys().next().value
      if (firstKey) {
        articleMeasurementsCache.delete(firstKey)
      }
    }
  }

  return cached
}

export function clearPretextCache(): void {
  preparedCache.clear()
  articleMeasurementsCache.clear()
}