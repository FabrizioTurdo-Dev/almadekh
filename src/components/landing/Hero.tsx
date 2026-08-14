import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BaroqueOrnament } from '../decorative/BaroqueOrnament'

const titleLine1 = 'Alma Dekh'
const titleLine2 = 'Mirada del Alma'
const titleLine3 = 'en Maschwitz'

export function Hero() {
  const navigate = useNavigate()

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-scroll md:bg-fixed -mt-14 md:-mt-16" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
      <div className="absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 40% 35% at 70% 30%, rgba(201,168,76,0.24) 0%, transparent 60%)',
          'radial-gradient(ellipse 35% 30% at 25% 60%, rgba(201,168,76,0.16) 0%, transparent 55%)',
          'linear-gradient(180deg, rgba(15,12,10,0.55) 0%, rgba(15,12,10,0.72) 40%, rgba(15,12,10,0.88) 100%)',
        ].join(', '),
      }} />

      {/* Baroque scroll hanging from top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[3] hidden md:block">
        <BaroqueOrnament variant="scroll" color="gold" size={140} opacity={0.55} />
      </div>

      {/* Baroque leaf — top right */}
      <div className="absolute top-32 right-12 z-[3] hidden lg:block">
        <BaroqueOrnament variant="leaf" color="burgundy" size={65} rotation={15} opacity={0.35} />
      </div>

      {/* Baroque corner ornaments */}
      <div className="absolute top-24 left-8 z-[3] hidden md:block">
        <BaroqueOrnament variant="corner" color="gold" size={70} opacity={0.3} />
      </div>
      <div className="absolute top-24 right-8 z-[3] hidden md:block">
        <BaroqueOrnament variant="corner" color="gold" size={70} rotation={90} opacity={0.3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl mx-auto px-6 py-8 sm:px-10 sm:py-10 text-center rounded-[2rem] border border-white/20 bg-black/20 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-[2px]"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block text-[10px] tracking-[3px] uppercase text-white/90 font-semibold mb-4 px-4 py-1.5 rounded-full bg-black/30 border border-white/20 backdrop-blur-sm glow-pulse"
        >
          Restaurante · Café · Casa de Té · Espacio de Arte
        </motion.span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl leading-[1.1] mb-3 font-serif" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.55)' }}>
          <span className="block text-[var(--color-almadekh-gold)] tracking-[0.15em] uppercase" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
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
            className="block mt-2 text-sm sm:text-base md:text-lg italic tracking-[0.24em] text-white/70 font-medium"
            style={{ fontFamily: '"Playfair Display", serif' }}
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
            className="block mt-2 text-base sm:text-lg md:text-[1.35rem] italic tracking-[0.28em] text-white/80 font-semibold"
            style={{ fontFamily: '"Playfair Display", serif' }}
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
          className="text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed mb-8 max-w-2xl mx-auto"
          style={{ textShadow: '0 2px 14px rgba(0,0,0,0.45)' }}
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
            className="w-full sm:w-auto bg-almadekh-gold hover:bg-almadekh-gold-light text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-almadekh-gold/30 text-sm md:text-base btn-shimmer"
          >
            Ver Menú Digital
          </button>
          <button
            onClick={() => {
              document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white/90 font-semibold py-4 px-8 rounded-xl transition-all border border-white/30 text-sm md:text-base hover:shadow-lg"
          >
            Conocé el Lugar
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}