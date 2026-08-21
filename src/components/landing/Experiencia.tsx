import { motion } from 'framer-motion'

export function Experiencia() {
  return (
    <section id="experiencia" className="relative min-h-svh flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/images/experiencia.jpg')" }}>
      {/* Overlay tenebrista más dramático */}
      <div className="absolute inset-0" style={{
        background: [
          'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(10,7,4,0.6) 0%, transparent 60%)',
          'linear-gradient(180deg, rgba(10,7,4,0.75) 0%, rgba(10,7,4,0.88) 50%, rgba(10,7,4,0.95) 100%)',
        ].join(', '),
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[3px] uppercase text-baroque-cream-muted font-semibold block mb-2"
        >
          Gastronomía y Arte
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold text-baroque-cream mb-6"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Un salón único con detalles que enamoran
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-baroque-cream-muted/70 font-light leading-relaxed mb-12 max-w-3xl mx-auto"
        >
          Disfruta de nuestros exquisitos platos vegetarianos, repostería artesanal,
          café de especialidad y opciones ideales para acompañar tus tardes. Cada
          plato está preparado con dedicación exclusiva.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            { emoji: '🍵', title: 'Casa de Té & Café', desc: 'Variedades de hebras, infusiones y delicias dulces caseras en un entorno mágico.' },
            { emoji: '🥗', title: 'Platos Vegetarianos', desc: 'Opciones saludables, sabrosas y elaboradas con ingredientes frescos y de calidad.' },
            { emoji: '🎨', title: 'Espacio de Arte', desc: 'Un concepto distinto donde la cultura y la gastronomía se funden en el Bar de la Maestra.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              whileHover={{ y: -5, rotate: 1, transition: { duration: 0.25 } }}
              className={`relative bg-baroque-dark/75 backdrop-blur-sm border-2 border-baroque-gold/20 p-8 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(184,134,11,0.2)] transition-shadow duration-500 overflow-hidden`}
              style={{
                backgroundImage: 'url(/images/ornaments/marco-cards.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'multiply'
              }}
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 200 }}
                className="text-4xl block mb-4 relative z-10 text-center"
              >
                {item.emoji}
              </motion.span>
              <h3 className="text-2xl font-bold mb-3 text-baroque-cream relative z-10 text-center" style={{ fontFamily: '"Cinzel", serif', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{item.title}</h3>
              <p className="text-baroque-cream/85 text-sm relative z-10 text-center leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
