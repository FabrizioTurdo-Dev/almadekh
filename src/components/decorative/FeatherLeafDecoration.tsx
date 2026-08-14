import { motion } from 'framer-motion'

interface FeatherLeafDecorationProps {
  color?: 'teal' | 'rose' | 'gold'
  size?: number
  rotation?: number
  className?: string
}

const colorMap = {
  teal: 'var(--color-almadekh-teal)',
  rose: 'var(--color-almadekh-rose)',
  gold: 'var(--color-almadekh-gold)',
}

export function FeatherLeafDecoration({
  color = 'gold',
  size = 50,
  rotation = 0,
  className = '',
}: FeatherLeafDecorationProps) {
  const strokeColor = colorMap[color]

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
      animate={{ rotate: [rotation, rotation + 3, rotation, rotation - 2, rotation] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width={size}
        height={size * 1.4}
        viewBox="0 0 50 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.18 }}
      >
        {/* Main stem */}
        <path
          d="M25 5 Q24 35 25 65"
          stroke={strokeColor}
          strokeWidth="1.2"
          fill="none"
        />

        {/* Left barbs */}
        <path d="M25 12 Q18 10 12 14" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 18 Q16 15 8 20" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 25 Q15 22 6 28" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 32 Q16 30 7 36" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 39 Q18 38 10 43" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 46 Q19 46 13 50" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 53 Q21 54 17 56" stroke={strokeColor} strokeWidth="0.8" fill="none" />

        {/* Right barbs */}
        <path d="M25 12 Q32 10 38 14" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 18 Q34 15 42 20" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 25 Q35 22 44 28" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 32 Q34 30 43 36" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 39 Q32 38 40 43" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 46 Q31 46 37 50" stroke={strokeColor} strokeWidth="0.8" fill="none" />
        <path d="M25 53 Q29 54 33 56" stroke={strokeColor} strokeWidth="0.8" fill="none" />

        {/* Tip */}
        <path
          d="M25 65 Q24 68 25 70"
          stroke={strokeColor}
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </motion.div>
  )
}
