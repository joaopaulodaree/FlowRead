'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground"
      >
        Tema
      </button>
    )
  }

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted transition"
    >
      {isDark ? '☀ Claro' : '🌙 Escuro'}
    </button>
  )
}