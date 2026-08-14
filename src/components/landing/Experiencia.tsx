import { motion } from 'framer-motion'
import { BaroqueOrnament } from '../decorative/BaroqueOrnament'

const emojis = ['🍵', '🥗', '🎨']

const colorMap: Record<string, string> = {
  'almadekh-teal': 'text-almadekh-teal',
  'almadekh-rose': 'text-almadekh-rose',
  'almadekh-gold': 'text-almadekh-gold',
}

export function Experiencia() {
  return (
    <section id="experiencia" className="relative py-28 bg-almadekh-surface/80 overflow-hidden">
      {/* Decorative baroque ornaments */}
      <div className="absolute top-12 left-8 hidden md:block" aria-hidden="true">
        <BaroqueOrnament variant="leaf" color="olive" size={55} rotation={-20} opacity={0.32} />
      </div>
      <div className="absolute bottom-16 right-10 hidden md:block" aria-hidden="true">
        <BaroqueOrnament variant="floral" color="burgundy" size={50} rotation={25} opacity={0.3} />
      </div>
      <div className="absolute top-1/2 right-4 hidden lg:block" aria-hidden="true">
        <BaroqueOrnament variant="scroll" color="gold" size={45} rotation={-10} opacity={0.28} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[3px] uppercase text-almadekh-rose font-semibold block mb-2"
        >
          Gastronomía y Arte
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-serif font-bold text-almadekh-text mb-6"
        >
          Un salón único con detalles que enamoran
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-almadekh-muted font-light leading-relaxed mb-12 max-w-3xl mx-auto"
        >
          Disfruta de nuestros exquisitos platos vegetarianos, repostería artesanal,
          café de especialidad y opciones ideales para acompañar tus tardes. Cada
          plato está preparado con dedicación exclusiva.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            { title: 'Casa de Té & Café', desc: 'Variedades de hebras, infusiones y delicias dulces caseras en un entorno mágico.', color: 'almadekh-teal', gradient: 'from-almadekh-teal/5 to-transparent' },
            { title: 'Platos Vegetarianos', desc: 'Opciones saludables, sabrosas y elaboradas con ingredientes frescos y de calidad.', color: 'almadekh-rose', gradient: 'from-almadekh-rose/5 to-transparent' },
            { title: 'Espacio de Arte', desc: 'Un concepto distinto donde la cultura y la gastronomía se funden en el Bar de la Maestra.', color: 'almadekh-gold', gradient: 'from-almadekh-gold/5 to-transparent' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              whileHover={{ y: -5, rotate: 1, transition: { duration: 0.25 } }}
              className={`bg-white shadow-sm border border-almadekh-border p-8 rounded-2xl bg-gradient-to-br ${item.gradient}`}
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 200 }}
                className="text-3xl block mb-3"
              >
                {emojis[i]}
              </motion.span>
              <h3 className={`text-xl font-bold mb-2 font-serif ${colorMap[item.color]}`}>{item.title}</h3>
              <p className="text-almadekh-muted text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}