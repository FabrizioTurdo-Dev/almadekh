import { motion } from 'framer-motion'

interface OrnamentalDividerProps {
  color?: string
  className?: string
  variant?: 'flourish' | 'simple' | 'floral'
}

export function OrnamentalDivider({
  color = 'currentColor',
  className = '',
  variant = 'flourish',
}: OrnamentalDividerProps) {
  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-px flex-1 max-w-[120px]"
          style={{ background: `linear-gradient(to right, transparent, ${color})` }}
        />
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg"
          style={{ color }}
        >
          ✦
        </motion.span>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-px flex-1 max-w-[120px]"
          style={{ background: `linear-gradient(to left, transparent, ${color})` }}
        />
      </div>
    )
  }

  if (variant === 'floral') {
    return (
      <div className={`flex items-center justify-center py-6 ${className}`}>
        <motion.svg
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          width="280"
          height="40"
          viewBox="0 0 280 40"
          fill="none"
          className="w-full max-w-xs"
        >
          {/* Left flourish */}
          <motion.path
            d="M10 20 Q40 5 70 20 Q100 35 130 20"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          {/* Center flower */}
          <motion.circle
            cx="140"
            cy="20"
            r="4"
            fill={color}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
          <motion.circle
            cx="140"
            cy="20"
            r="8"
            stroke={color}
            strokeWidth="1"
            fill="none"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
          />
          {/* Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <motion.ellipse
              key={angle}
              cx="140"
              cy="20"
              rx="2"
              ry="6"
              fill={color}
              fillOpacity="0.3"
              transform={`rotate(${angle} 140 20)`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1 + angle / 1000 }}
            />
          ))}
          {/* Right flourish */}
          <motion.path
            d="M150 20 Q180 5 210 20 Q240 35 270 20"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
          />
        </motion.svg>
      </div>
    )
  }

  // Default: flourish
  return (
    <div className={`flex items-center justify-center py-6 ${className}`}>
      <motion.svg
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        width="320"
        height="50"
        viewBox="0 0 320 50"
        fill="none"
        className="w-full max-w-md"
      >
        {/* Left swirl */}
        <motion.path
          d="M20 25 C40 10, 60 10, 80 25 C100 40, 120 40, 140 25"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        {/* Left leaf */}
        <motion.path
          d="M60 18 Q70 8 80 18 Q70 28 60 18"
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="0.8"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ transformOrigin: '70px 18px' }}
        />
        {/* Center diamond */}
        <motion.path
          d="M150 15 L160 25 L150 35 L140 25 Z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{ transformOrigin: '150px 25px' }}
        />
        <motion.circle
          cx="150"
          cy="25"
          r="3"
          fill={color}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.2 }}
        />
        {/* Right leaf */}
        <motion.path
          d="M240 18 Q250 8 260 18 Q250 28 240 18"
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="0.8"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ transformOrigin: '250px 18px' }}
        />
        {/* Right swirl */}
        <motion.path
          d="M160 25 C180 10, 200 10, 220 25 C240 40, 260 40, 280 25"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
        />
        {/* Small dots */}
        {[40, 100, 180, 240].map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy="25"
            r="2"
            fill={color}
            fillOpacity="0.4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 1.4 + i * 0.1 }}
          />
        ))}
      </motion.svg>
    </div>
  )
}