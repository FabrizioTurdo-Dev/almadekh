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
      className="flex gap-2 overflow-x-auto px-5 py-3 sticky top-0 z-20 bg-almadekh-bg/95 backdrop-blur-xl border-b border-almadekh-border scrollbar-hide"
      style={{ scrollbarWidth: 'none' }}
    >
      {categories.map((cat, idx) => (
        <button
          key={cat.id}
          onClick={() => onSelect(idx)}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
            idx === activeIndex
              ? cat.is_special
                ? 'bg-almadekh-gold text-white'
                : 'bg-almadekh-teal text-white'
              : cat.is_special
              ? 'bg-almadekh-gold/10 text-almadekh-gold border border-almadekh-gold/30 hover:bg-almadekh-gold/20'
              : 'bg-almadekh-surface text-almadekh-subdued border border-almadekh-border hover:bg-almadekh-cream'
          }`}
        >
          {cat.is_special && '⭐ '}{cat.name}
        </button>
      ))}
    </div>
  )
}