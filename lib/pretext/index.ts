'use client'

import { prepare, layout } from '@chenglou/pretext'

// Cache prepared text by key to avoid recomputation on resize.
const preparedCache = new Map<string, ReturnType<typeof prepare>>()

/*
 * Prepare text for layout measurement.
 * Caches the result so only `layout()` needs to run on width changes.
 */
export function prepareText(text: string, font: string, cacheKey?: string) {
  const key = cacheKey ?? `${font}::${text}`
  if (preparedCache.has(key)) {
    return preparedCache.get(key)!
  }
  const prepared = prepare(text, font)
  preparedCache.set(key, prepared)
  return prepared
}

/*
 * Measure the height and line count of a text block at a given width.
 * Fast enough to call on every resize — only arithmetic, no DOM reflow.
 */
export function measureTextHeight(
  text: string,
  font: string,
  containerWidth: number,
  lineHeight: number = 1.5,
) {
  const prepared = prepareText(text, font)
  const result = layout(prepared, containerWidth, lineHeight)
  return result
}

/*
 * Clear the prepared text cache.
 * Call this when fonts are loaded or when you want to free memory.
 */
export function clearPretextCache() {
  preparedCache.clear()
}
