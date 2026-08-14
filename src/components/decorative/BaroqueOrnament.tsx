import { motion } from 'framer-motion'

interface BaroqueOrnamentProps {
  variant?: 'scroll' | 'floral' | 'leaf' | 'corner'
  color?: string
  size?: number
  rotation?: number
  opacity?: number
  className?: string
}

const colorMap: Record<string, string> = {
  gold: 'var(--color-baroque-gold)',
  burgundy: 'var(--color-baroque-burgundy)',
  olive: 'var(--color-baroque-olive)',
  cream: 'var(--color-baroque-cream)',
  rust: 'var(--color-baroque-rust)',
}

function resolveColor(color: string): string {
  return colorMap[color] || color
}

function ScrollSVG({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {/* Main S-curve scroll */}
      <path
        d="M60 10 Q30 30 35 60 Q40 85 25 100 Q15 110 20 125 Q25 140 40 145"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Top spiral */}
      <path
        d="M60 10 Q75 5 80 15 Q85 25 72 30 Q60 33 55 25 Q52 18 58 14"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Bottom spiral */}
      <path
        d="M40 145 Q25 150 20 140 Q15 130 28 126 Q38 123 42 132 Q44 138 38 142"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Mid leaf flourish */}
      <path
        d="M35 60 Q20 50 15 60 Q12 70 22 75 Q32 78 38 68 Q40 62 35 60"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1"
      />
      {/* Small accent dot */}
      <circle cx="18" cy="67" r="2" fill={color} fillOpacity="0.3" />
      {/* Side tendril */}
      <path
        d="M25 100 Q10 95 8 105 Q7 112 15 114"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tiny bud */}
      <circle cx="8" cy="108" r="1.5" fill={color} fillOpacity="0.25" />
    </svg>
  )
}

function FloralSVG({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {/* Center bud */}
      <circle cx="50" cy="50" r="5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
      <circle cx="50" cy="50" r="2.5" fill={color} fillOpacity="0.5" />
      {/* Petals — curved, organic */}
      <path d="M50 45 Q45 30 50 20 Q55 30 50 45" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.8" />
      <path d="M55 48 Q70 40 78 45 Q68 50 55 48" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.8" />
      <path d="M50 55 Q55 70 50 80 Q45 70 50 55" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.8" />
      <path d="M45 52 Q30 60 22 55 Q32 50 45 52" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.8" />
      {/* Diagonal petals */}
      <path d="M54 46 Q65 32 72 28 Q64 40 54 46" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="0.6" />
      <path d="M54 54 Q68 62 75 70 Q64 62 54 54" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="0.6" />
      <path d="M46 54 Q32 68 28 75 Q36 64 46 54" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="0.6" />
      <path d="M46 46 Q32 38 25 30 Q36 38 46 46" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="0.6" />
      {/* Curling tendrils */}
      <path d="M50 20 Q48 12 42 8" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M78 45 Q85 42 90 48" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M50 80 Q52 88 58 92" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M22 55 Q15 58 10 52" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* Small buds on tendrils */}
      <circle cx="42" cy="8" r="1.5" fill={color} fillOpacity="0.3" />
      <circle cx="90" cy="48" r="1.5" fill={color} fillOpacity="0.3" />
      <circle cx="58" cy="92" r="1.5" fill={color} fillOpacity="0.3" />
      <circle cx="10" cy="52" r="1.5" fill={color} fillOpacity="0.3" />
    </svg>
  )
}

function LeafSVG({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {/* Main stem */}
      <path d="M30 5 Q29 50 30 95" stroke={color} strokeWidth="1.2" fill="none" />
      {/* Left lobes — acanthus-style curved */}
      <path d="M30 15 Q18 10 10 18 Q8 25 16 28 Q24 30 30 22" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.8" />
      <path d="M30 28 Q15 22 6 32 Q4 40 14 42 Q24 43 30 35" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.8" />
      <path d="M30 42 Q14 36 5 48 Q3 56 14 57 Q25 57 30 48" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.8" />
      <path d="M30 56 Q16 52 8 62 Q6 70 16 70 Q26 69 30 62" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.8" />
      <path d="M30 70 Q20 67 14 74 Q12 80 20 80 Q28 79 30 74" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="0.7" />
      {/* Right lobes */}
      <path d="M30 15 Q42 10 50 18 Q52 25 44 28 Q36 30 30 22" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.8" />
      <path d="M30 28 Q45 22 54 32 Q56 40 46 42 Q36 43 30 35" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.8" />
      <path d="M30 42 Q46 36 55 48 Q57 56 46 57 Q35 57 30 48" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.8" />
      <path d="M30 56 Q44 52 52 62 Q54 70 44 70 Q34 69 30 62" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.8" />
      <path d="M30 70 Q40 67 46 74 Q48 80 40 80 Q32 79 30 74" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="0.7" />
      {/* Tip curl */}
      <path d="M30 95 Q28 98 30 100" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  )
}

function CornerSVG({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {/* Main corner scroll */}
      <path
        d="M5 5 Q5 30 20 40 Q35 48 50 40 Q60 34 65 20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Inner spiral at corner */}
      <path
        d="M5 5 Q15 8 18 18 Q20 28 12 32 Q6 34 4 26 Q3 20 8 17"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaf at curve peak */}
      <path
        d="M20 40 Q12 35 8 42 Q6 48 14 50 Q20 51 22 44 Q23 40 20 40"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="0.8"
      />
      {/* Terminal dot */}
      <circle cx="65" cy="20" r="2" fill={color} fillOpacity="0.3" />
      {/* Small tendril */}
      <path d="M50 40 Q55 50 48 58" stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="58" r="1.5" fill={color} fillOpacity="0.25" />
    </svg>
  )
}

const variantComponents = {
  scroll: ScrollSVG,
  floral: FloralSVG,
  leaf: LeafSVG,
  corner: CornerSVG,
}

const defaultSizes = {
  scroll: { w: 80, h: 110 },
  floral: { w: 70, h: 70 },
  leaf: { w: 45, h: 75 },
  corner: { w: 55, h: 55 },
}

export function BaroqueOrnament({
  variant = 'scroll',
  color = 'gold',
  size,
  rotation = 0,
  opacity = 0.2,
  className = '',
}: BaroqueOrnamentProps) {
  const resolvedColor = resolveColor(color)
  const dims = defaultSizes[variant]
  const w = size || dims.w
  const h = size ? size * (dims.h / dims.w) : dims.h
  const Comp = variantComponents[variant]

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{ width: w, height: h, transform: `rotate(${rotation}deg)` }}
      animate={{ rotate: [rotation, rotation + 2, rotation, rotation - 1.5, rotation] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Comp color={resolvedColor} opacity={opacity} />
    </motion.div>
  )
}
