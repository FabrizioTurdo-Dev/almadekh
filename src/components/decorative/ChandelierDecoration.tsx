import { motion } from 'framer-motion'

interface ChandelierDecorationProps {
  variant?: 'hero' | 'section' | 'corner'
  className?: string
}

const sizes = {
  hero: { width: 220, height: 250 },
  section: { width: 120, height: 140 },
  corner: { width: 80, height: 90 },
}

export function ChandelierDecoration({
  variant = 'section',
  className = '',
}: ChandelierDecorationProps) {
  const { width, height } = sizes[variant]
  const strokeColor = 'var(--color-almadekh-gold)'
  const opacity = variant === 'hero' ? 0.50 : variant === 'section' ? 0.22 : 0.18

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      animate={{ y: [0, -5, 0, 4, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 180 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        {/* Chain from ceiling */}
        <line x1="90" y1="0" x2="90" y2="35" stroke={strokeColor} strokeWidth="1.5" />
        <circle cx="90" cy="10" r="3" stroke={strokeColor} strokeWidth="1" fill="none" />
        <circle cx="90" cy="22" r="2.5" stroke={strokeColor} strokeWidth="1" fill="none" />

        {/* Top ornament */}
        <path
          d="M80 35 Q90 28 100 35"
          stroke={strokeColor}
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="90" cy="35" r="4" fill={strokeColor} fillOpacity="0.3" stroke={strokeColor} strokeWidth="1" />

        {/* Main body */}
        <path
          d="M75 45 Q90 40 105 45 L100 55 Q90 52 80 55 Z"
          fill={strokeColor}
          fillOpacity="0.2"
          stroke={strokeColor}
          strokeWidth="1"
        />

        {/* Left arm */}
        <path
          d="M80 55 Q60 60 45 75"
          stroke={strokeColor}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M45 75 Q42 70 38 75 Q35 80 40 82 Q45 84 48 80 Q50 76 45 75"
          fill={strokeColor}
          fillOpacity="0.25"
          stroke={strokeColor}
          strokeWidth="1"
        />
        {/* Left candle */}
        <rect x="43" y="60" width="4" height="15" rx="1" fill={strokeColor} fillOpacity="0.3" stroke={strokeColor} strokeWidth="0.8" />
        <ellipse cx="45" cy="58" rx="3" ry="5" fill="#c9a84c" fillOpacity="0.5" />

        {/* Center arm */}
        <line x1="90" y1="55" x2="90" y2="70" stroke={strokeColor} strokeWidth="1.5" />
        <path
          d="M85 70 Q90 65 95 70 Q92 75 88 75 Q85 73 85 70"
          fill={strokeColor}
          fillOpacity="0.25"
          stroke={strokeColor}
          strokeWidth="1"
        />
        {/* Center candle */}
        <rect x="88" y="55" width="4" height="15" rx="1" fill={strokeColor} fillOpacity="0.3" stroke={strokeColor} strokeWidth="0.8" />
        <ellipse cx="90" cy="53" rx="3" ry="5" fill="#c9a84c" fillOpacity="0.5" />

        {/* Right arm */}
        <path
          d="M100 55 Q120 60 135 75"
          stroke={strokeColor}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M135 75 Q138 70 142 75 Q145 80 140 82 Q135 84 132 80 Q130 76 135 75"
          fill={strokeColor}
          fillOpacity="0.25"
          stroke={strokeColor}
          strokeWidth="1"
        />
        {/* Right candle */}
        <rect x="133" y="60" width="4" height="15" rx="1" fill={strokeColor} fillOpacity="0.3" stroke={strokeColor} strokeWidth="0.8" />
        <ellipse cx="135" cy="58" rx="3" ry="5" fill="#c9a84c" fillOpacity="0.5" />

        {/* Decorative drops */}
        <circle cx="50" cy="88" r="2" fill={strokeColor} fillOpacity="0.2" />
        <circle cx="70" cy="92" r="1.5" fill={strokeColor} fillOpacity="0.15" />
        <circle cx="90" cy="85" r="2.5" fill={strokeColor} fillOpacity="0.22" />
        <circle cx="110" cy="92" r="1.5" fill={strokeColor} fillOpacity="0.15" />
        <circle cx="130" cy="88" r="2" fill={strokeColor} fillOpacity="0.2" />

        {/* Bottom flourish */}
        <path
          d="M60 95 Q90 105 120 95"
          stroke={strokeColor}
          strokeWidth="1"
          fill="none"
          strokeDasharray="3 3"
        />
        <path
          d="M70 100 Q90 108 110 100"
          stroke={strokeColor}
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="2 4"
        />
      </svg>
    </motion.div>
  )
}