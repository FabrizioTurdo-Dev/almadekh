import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Solo glifos tipograficos: los emoji (🎵 🎶) ignoran el `color` de CSS y
// saldrian en su color propio, rompiendo la paleta dorada.
const notes = ['♪', '♫', '♬', '♩', '♯', '♭', '𝄞']

interface FloatingNotesProps {
  count?: number
  colors?: string[]
  className?: string
}

export function FloatingNotes({
  count = 10,
  colors = ['text-baroque-gold/60', 'text-baroque-gold-light/50', 'text-baroque-cream-muted/45'],
  className = '',
}: FloatingNotesProps) {
  const reduceMotion = useReducedMotion()

  // Distancia que recorre cada nota. Se calcula una vez sobre el alto de la
  // ventana para que la animacion cubra la franja visible en cualquier pantalla.
  const [travel] = useState(() =>
    typeof window === 'undefined' ? 800 : window.innerHeight + 120
  )

  // Las posiciones se calculan una sola vez: si se recalcularan en cada render,
  // las notas saltarian de lugar cada vez que el componente se vuelve a pintar.
  const [items] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      note: notes[i % notes.length],
      color: colors[i % colors.length],
      // Acotado: con 0-100 el borde izquierdo del glifo caia justo sobre el
      // limite del contenedor y las notas se veian partidas contra el borde.
      x: 4 + Math.random() * 88,
      size: 14 + Math.random() * 18,
      duration: 18 + Math.random() * 12,
      delay: Math.random() * 10,
      drift: -30 + Math.random() * 60,
    }))
  )

  // La regla global de `prefers-reduced-motion` en index.css solo frena
  // animaciones CSS; framer-motion anima por JS, asi que hay que cortar aca.
  if (reduceMotion) return null

  return (
    // El contenedor se limita al primer alto de pantalla de la seccion.
    // Con `inset-0` cubria la seccion entera (que con la galeria mide varios
    // miles de px), asi que las notas nacian al pie de todo y nunca subian
    // hasta la zona visible.
    <div
      className={`absolute inset-x-0 top-0 h-svh overflow-hidden pointer-events-none ${className}`}
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
            y: [0, -travel],
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
