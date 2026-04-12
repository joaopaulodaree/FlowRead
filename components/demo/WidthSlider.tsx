'use client'

interface WidthSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
}

export function WidthSlider({
  value,
  onChange,
  min = 320,
  max = 1400,
  step = 1,
  label = 'Width',
}: WidthSliderProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />

      <span className="text-sm font-mono text-muted-foreground min-w-[64px]">
        {value}px
      </span>
    </div>
  )
}