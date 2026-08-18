import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BaroqueFrame } from '../decorative/BaroqueFrame'

const titleLine1 = 'Alma Dekh'
const titleLine2 = 'Mirada del Alma'
const titleLine3 = 'en Maschwitz'

export function Hero() {
  const navigate = useNavigate()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-scroll md:bg-fixed -mt-14 md:-mt-16" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
      {/* Overlay Tenebrista — estilo Caravaggio */}
      <div className="absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 40% 35% at 50% 40%, rgba(10,7,4,0.3) 0%, transparent 60%)',
          'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(10,7,4,0.15) 0%, rgba(10,7,4,0.35) 50%, rgba(10,7,4,0.5) 100%)',
          'linear-gradient(180deg, rgba(10,7,4,0.35) 0%, rgba(10,7,4,0.45) 40%, rgba(10,7,4,0.6) 100%)',
        ].join(', '),
      }} />

      {/* Marco SVG Ornamentado */}
      <BaroqueFrame />

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl mx-auto px-6 py-8 sm:px-10 sm:py-10 text-center"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block text-[10px] tracking-[3px] uppercase text-[#C9A876] font-semibold mb-4 px-4 py-1.5 rounded-full bg-[#0A0704]/50 border border-[#B8860B]/30 backdrop-blur-sm glow-pulse"
        >
          Restaurante · Café · Casa de Té · Espacio de Arte
        </motion.span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl leading-[1.1] mb-3" style={{ textShadow: '0 3px 20px rgba(114,47,55,0.6), 0 2px 10px rgba(0,0,0,0.8)' }}>
          <span className="block text-[#B8860B] tracking-[0.15em] uppercase" style={{ fontFamily: '"Cinzel", serif', fontWeight: 900 }}>
            {titleLine1.toUpperCase().split('').map((char, i) => (
              <motion.span
                key={`l1-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.04 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span
            className="block mt-2 text-sm sm:text-base md:text-lg italic tracking-[0.24em] text-[#C9A876] font-medium"
            style={{ fontFamily: '"Crimson Text", serif' }}
          >
            {titleLine2.split('').map((char, i) => (
              <motion.span
                key={`l2-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.04 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span
            className="block mt-2 text-base sm:text-lg md:text-[1.35rem] italic tracking-[0.28em] text-[#E8DCC8]/80 font-semibold"
            style={{ fontFamily: '"Crimson Text", serif' }}
          >
            {titleLine3.split('').map((char, i) => (
              <motion.span
                key={`l3-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 + i * 0.04 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-base sm:text-lg md:text-xl text-[#C9A876]/90 font-light leading-relaxed mb-8 max-w-2xl mx-auto"
          style={{ fontFamily: '"Cormorant Garamond", serif', textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}
        >
          Un lugar distinto en un lugar especial, atendido con el mayor esmero
          para brindarte una experiencia inolvidable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/menu')}
            className="w-full sm:w-auto btn-burgundy-gradient text-[#E8DCC8] font-bold py-4 px-8 rounded-xl transition-all border border-[#B8860B]/40 shadow-[0_8px_25px_rgba(184,134,11,0.2)] text-sm md:text-base btn-shimmer"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            Ver Menú Digital
          </button>
          <button
            onClick={() => {
              document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="w-full sm:w-auto bg-transparent hover:bg-[#B8860B]/10 text-[#C9A876] font-semibold py-4 px-8 rounded-xl transition-all border border-[#B8860B]/30 text-sm md:text-base hover:shadow-[0_0_20px_rgba(184,134,11,0.15)]"
          >
            Conocé el Lugar
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
