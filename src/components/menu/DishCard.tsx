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
  'c': 'linear-gradient(135deg,#B8860B,#d4a832)',
  's': 'linear-gradient(135deg,#722F37,#8a3a44)',
  'p': 'linear-gradient(135deg,#B8860B,#d4a832)',
  'sal': 'linear-gradient(135deg,#B8860B,#d4a832)',
  'sw': 'linear-gradient(135deg,#704214,#8a5520)',
  'ent': 'linear-gradient(135deg,#722F37,#8a3a44)',
  'ens': 'linear-gradient(135deg,#704214,#8a5520)',
  'mil': 'linear-gradient(135deg,#722F37,#8a3a44)',
  'pl': 'linear-gradient(135deg,#B8860B,#d4a832)',
  'pas': 'linear-gradient(135deg,#B8860B,#d4a832)',
  'ar': 'linear-gradient(135deg,#B8860B,#d4a832)',
  'piz': 'linear-gradient(135deg,#722F37,#8a3a44)',
  'emp': 'linear-gradient(135deg,#722F37,#8a3a44)',
  'b': 'linear-gradient(135deg,#704214,#8a5520)',
  'pos': 'linear-gradient(135deg,#722F37,#8a3a44)',
}

function getGradient(id: string): string {
  const prefix = id.split(/\d/)[0]
  return gradients[prefix] || 'linear-gradient(135deg,#704214,#8a5520)'
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
    <div className={`relative flex gap-3 p-3.5 bg-baroque-dark-sec rounded-2xl items-center transition-all duration-300 ${
      isSpecial
        ? 'border-2 border-baroque-gold/40 hover:border-baroque-gold hover:shadow-[0_0_30px_rgba(184,134,11,0.15)]'
        : 'border border-baroque-gold/10 hover:border-baroque-gold/30 hover:shadow-[0_0_20px_rgba(184,134,11,0.1)]'
    } shadow-[0_4px_15px_rgba(0,0,0,0.3)]`}>
      {isSpecial && (
        <span className="absolute -top-2 -right-2 bg-baroque-gold text-baroque-dark text-[9px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(184,134,11,0.4)]">
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
        <h4 className="text-sm font-semibold text-baroque-cream line-clamp-2">{item.name}</h4>
        {item.desc && (
          <p className="text-[11px] text-baroque-cream-muted/60 font-light line-clamp-2">{item.desc}</p>
        )}
        <span className="text-sm font-bold text-baroque-gold mt-1 block">
          {formatPrice(item.price)}
        </span>
      </div>
      <div className="shrink-0">
        {qty > 0 ? (
          <div className="flex items-center gap-1">
            <button
              onClick={onRemove}
              aria-label={`Quitar ${item.name}`}
              className="w-11 h-11 rounded-full bg-baroque-dark hover:bg-baroque-gold/10 text-baroque-cream font-bold flex items-center justify-center text-sm transition-all active:scale-90 border border-baroque-gold/20"
            >
              −
            </button>
            <span className="text-sm font-bold text-baroque-gold w-5 text-center">{qty}</span>
            <button
              onClick={onAdd}
              aria-label={`Agregar ${item.name}`}
              className="w-11 h-11 rounded-full btn-burgundy-gradient text-baroque-cream font-bold flex items-center justify-center text-sm transition-all active:scale-90 border border-baroque-gold/20"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            aria-label={`Agregar ${item.name}`}
            className="w-11 h-11 rounded-full btn-burgundy-gradient text-baroque-cream font-bold flex items-center justify-center text-lg transition-all active:scale-90 shadow-[0_4px_15px_rgba(114,47,55,0.3)] border border-baroque-gold/20"
          >
            +
          </button>
        )}
      </div>
    </div>
  )
}
