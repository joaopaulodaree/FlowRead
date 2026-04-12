'use client'

import { Dispatch, SetStateAction } from 'react'

interface PretextToggleProps {
  enabled: boolean
  setPretextEnabled: Dispatch<SetStateAction<boolean>>
}

export function PretextToggle({ enabled, setPretextEnabled }: PretextToggleProps) {
  return (
    <button
      type="button"
      // Agora o (prev => !prev) funciona com a tipagem Dispatch
      onClick={() => setPretextEnabled((prev) => !prev)}
      aria-pressed={enabled}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all active:scale-95 ${enabled
          ? 'bg-foreground text-background border-foreground'
          : 'bg-background text-foreground border-border hover:bg-accent'
        }`}
    >
      <span
        className={`h-2 w-2 rounded-full transition-colors ${enabled
            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
            : 'bg-gray-400'
          }`}
      />
      Pretext
      <span className="sr-only">{enabled ? 'Desativar' : 'Ativar'}</span>
    </button>
  )
}