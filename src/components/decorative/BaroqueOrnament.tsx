import { motion } from 'framer-motion'

interface BaroqueOrnamentProps {
  variant?: 'scroll' | 'floral' | 'leaf' | 'corner'
  size?: number
  rotation?: number
  opacity?: number
  className?: string
}

const ornamentImages: Record<string, string> = {
  scroll: '/images/ornaments/esquinas.jpg',
  floral: '/images/ornaments/esquinas.jpg',
  leaf: '/images/ornaments/esquinas.jpg',
  corner: '/images/ornaments/esquinas.jpg',
}

const ornamentBlendModes: Record<string, React.CSSProperties['mixBlendMode']> = {
  scroll: 'luminosity',
  floral: 'luminosity',
  leaf: 'multiply',
  corner: 'luminosity',
}

const defaultSizes = {
  scroll: { w: 80, h: 120 },
  floral: { w: 80, h: 120 },
  leaf: { w: 60, h: 100 },
  corner: { w: 100, h: 100 },
}

export function BaroqueOrnament({
  variant = 'scroll',
  size,
  rotation = 0,
  opacity = 0.55,
  className = '',
}: BaroqueOrnamentProps) {
  const src = ornamentImages[variant]
  const dims = defaultSizes[variant]
  const w = size || dims.w
  const h = variant === 'corner' ? w : size ? size * (dims.h / dims.w) : dims.h

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{ width: w, height: h, transform: `rotate(${rotation}deg)` }}
      animate={{ rotate: [rotation, rotation + 2, rotation, rotation - 1.5, rotation] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain"
        style={{ opacity, mixBlendMode: ornamentBlendModes[variant] }}
        loading="lazy"
        decoding="async"
      />
    </motion.div>
  )
}
