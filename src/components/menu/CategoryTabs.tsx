import { useRef, useEffect } from 'react'
import type { Category } from '../../types'

interface Props {
  categories: Category[]
  activeIndex: number
  onSelect: (idx: number) => void
}

export function CategoryTabs({ categories, activeIndex, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const active = containerRef.current.children[activeIndex] as HTMLElement
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeIndex])

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto px-5 py-3 sticky top-0 md:top-14 z-20 bg-baroque-dark/95 backdrop-blur-xl border-b border-baroque-gold/15 scrollbar-hide"
      style={{ scrollbarWidth: 'none' }}
    >
      {categories.map((cat, idx) => (
        <button
          key={cat.id}
          onClick={() => onSelect(idx)}
          className={`inline-flex items-center min-h-11 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
            idx === activeIndex
              ? cat.is_special
                ? 'bg-baroque-gold text-baroque-dark'
                : 'bg-gradient-to-b from-baroque-wine to-baroque-wine-dark text-baroque-cream border border-baroque-gold/30'
              : cat.is_special
              ? 'bg-baroque-gold/10 text-baroque-gold border border-baroque-gold/30 hover:bg-baroque-gold/20'
              : 'bg-baroque-dark-sec text-baroque-cream-muted/60 border border-baroque-gold/10 hover:bg-baroque-dark-sec hover:text-baroque-cream-muted'
          }`}
        >
          {cat.is_special && '⭐ '}{cat.name}
        </button>
      ))}
    </div>
  )
}
