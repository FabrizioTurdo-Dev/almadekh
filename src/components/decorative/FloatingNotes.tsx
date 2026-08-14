import { useState } from 'react'
import { motion } from 'framer-motion'

const notes = ['♪', '♫', '♬', '♩', '🎵', '🎶', '♯', '♭', '𝄞']

interface FloatingNotesProps {
  count?: number
  colors?: string[]
  className?: string
}

export function FloatingNotes({
  count = 10,
  colors = ['text-almadekh-teal/20', 'text-almadekh-rose/20', 'text-almadekh-gold/20'],
  className = '',
}: FloatingNotesProps) {
  const [items] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      note: notes[i % notes.length],
      color: colors[i % colors.length],
      x: Math.random() * 100,
      size: 14 + Math.random() * 18,
      duration: 18 + Math.random() * 12,
      delay: Math.random() * 10,
      drift: -30 + Math.random() * 60,
    }))
  )

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {items.map((item) => (
        <motion.span
          key={item.id}
          className={`absolute ${item.color} select-none`}
          style={{
            left: `${item.x}%`,
            fontSize: item.size,
            bottom: '-5%',
            willChange: 'transform',
          }}
          animate={{
            y: [0, -800],
            x: [0, item.drift],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {item.note}
        </motion.span>
      ))}
    </div>
  )
}