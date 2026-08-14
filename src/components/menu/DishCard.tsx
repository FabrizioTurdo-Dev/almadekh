import type { MenuItem } from '../../types'
import { formatPrice } from '../../lib/format'

interface Props {
  item: MenuItem
  qty: number
  isSpecial?: boolean
  onAdd: () => void
  onRemove: () => void
}

const gradients: Record<string, string> = {
  'c': 'linear-gradient(135deg,#5a9e94,#7ab8ac)',
  's': 'linear-gradient(135deg,#c47a8a,#d89aa8)',
  'p': 'linear-gradient(135deg,#c9a84c,#d4b86e)',
  'sal': 'linear-gradient(135deg,#c9a84c,#d4b86e)',
  'sw': 'linear-gradient(135deg,#5a9e94,#7ab8ac)',
  'ent': 'linear-gradient(135deg,#c47a8a,#d89aa8)',
  'ens': 'linear-gradient(135deg,#5a9e94,#7ab8ac)',
  'mil': 'linear-gradient(135deg,#c47a8a,#d89aa8)',
  'pl': 'linear-gradient(135deg,#c9a84c,#d4b86e)',
  'pas': 'linear-gradient(135deg,#c9a84c,#d4b86e)',
  'ar': 'linear-gradient(135deg,#c9a84c,#d4b86e)',
  'piz': 'linear-gradient(135deg,#c47a8a,#d89aa8)',
  'emp': 'linear-gradient(135deg,#c47a8a,#d89aa8)',
  'b': 'linear-gradient(135deg,#5a9e94,#7ab8ac)',
  'pos': 'linear-gradient(135deg,#c47a8a,#d89aa8)',
}

function getGradient(id: string): string {
  const prefix = id.split(/\d/)[0]
  return gradients[prefix] || 'linear-gradient(135deg,#a89e94,#c4b8a8)'
}

const emojiMap: Record<string, string> = {
  'c': '☕', 's': '🥐', 'p': '🍰', 'sal': '🥟', 'sw': '🥪',
  'ent': '🧀', 'ens': '🥗', 'mil': '🥩', 'pl': '🥩', 'pas': '🍝',
  'ar': '🍚', 'piz': '🍕', 'emp': '🥟', 'b': '🥤', 'pos': '🍨',
}

function getEmoji(id: string): string {
  const prefix = id.split(/\d/)[0]
  return emojiMap[prefix] || '🍽️'
}

export function DishCard({ item, qty, isSpecial, onAdd, onRemove }: Props) {
  return (
    <div className={`relative flex gap-3 p-3.5 bg-white shadow-sm rounded-2xl items-center transition-colors ${
      isSpecial
        ? 'border-2 border-almadekh-gold/50 hover:border-almadekh-gold'
        : 'border border-almadekh-border hover:border-almadekh-teal/30'
    }`}>
      {isSpecial && (
        <span className="absolute -top-2 -right-2 bg-almadekh-gold text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          ⭐ Especial
        </span>
      )}
      <div
        className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-2xl"
        style={{ background: item.image_url ? 'transparent' : getGradient(item.id) }}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span className="opacity-60">{getEmoji(item.id)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-almadekh-text truncate">{item.name}</h4>
        {item.desc && (
          <p className="text-[11px] text-almadekh-muted font-light truncate">{item.desc}</p>
        )}
        <span className="text-sm font-bold text-almadekh-teal mt-1 block">
          {formatPrice(item.price)}
        </span>
      </div>
      <div className="shrink-0">
        {qty > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onRemove}
              aria-label={`Quitar ${item.name}`}
              className="w-8 h-8 rounded-full bg-almadekh-surface hover:bg-almadekh-border text-almadekh-text font-bold flex items-center justify-center text-sm transition-all active:scale-90"
            >
              −
            </button>
            <span className="text-sm font-bold text-almadekh-teal w-5 text-center">{qty}</span>
            <button
              onClick={onAdd}
              aria-label={`Agregar ${item.name}`}
              className="w-8 h-8 rounded-full bg-almadekh-teal hover:bg-almadekh-teal-light text-white font-bold flex items-center justify-center text-sm transition-all active:scale-90"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            aria-label={`Agregar ${item.name}`}
            className="w-9 h-9 rounded-full bg-almadekh-teal hover:bg-almadekh-teal-light text-white font-bold flex items-center justify-center text-lg transition-all active:scale-90 shadow-lg shadow-almadekh-teal/20"
          >
            +
          </button>
        )}
      </div>
    </div>
  )
}