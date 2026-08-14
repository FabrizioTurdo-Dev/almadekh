import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { BaroqueOrnament } from '../decorative/BaroqueOrnament'

export function Espacio() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section id="espacio" ref={sectionRef} className="relative py-28 bg-almadekh-bg/80">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] tracking-[3px] uppercase text-almadekh-teal font-semibold block mb-2"
            >
              Nuestro Entorno
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-serif font-bold text-almadekh-text mb-6"
            >
              Galerías al aire libre y calidez natural
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-almadekh-muted font-light leading-relaxed mb-6"
            >
              Ubicados en Ingeniero Maschwitz, te ofrecemos un espacio pensado para
              relajarte y disfrutar. Contamos con asientos al aire libre, un ambiente
              cálido apto para chicos y adaptado, donde cada rincón respira arte y
              buena energía.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-3 text-sm"
            >
              {[
                'Asientos al aire libre en galería y jardín',
                'Comedor privado y ambiente familiar',
                'Espacio apto para chicos y silla de ruedas',
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-almadekh-muted"
                >
                  <span className="w-2 h-2 rounded-full bg-almadekh-teal shrink-0" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Image with parallax */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <motion.img
                src="/images/espacio.jpg"
                alt="Galería exterior de Alma Dekh"
                className="w-full h-80 md:h-[28rem] object-cover"
                loading="lazy"
                decoding="async"
                width={800}
                height={500}
                style={{ y: imageY }}
              />
            </div>
        {/* Decorative corner frame with baroque leaf */}
        <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-baroque-gold/50 rounded-tr-2xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-2 border-l-2 border-baroque-gold/50 rounded-bl-2xl pointer-events-none" />
        <div className="absolute -top-4 -left-4 z-10 hidden md:block" aria-hidden="true">
          <BaroqueOrnament variant="corner" color="gold" size={60} opacity={0.35} />
        </div>
        <div className="absolute -bottom-4 -right-4 z-10 hidden md:block" aria-hidden="true">
          <BaroqueOrnament variant="corner" color="gold" size={60} rotation={180} opacity={0.35} />
        </div>
          </motion.div>
        </div>

        {/* Quote card with ornamental border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="relative bg-white shadow-sm border border-almadekh-border p-8 md:p-10 rounded-3xl text-center">
            {/* Corner ornaments */}
            <div className="absolute top-3 left-3 text-almadekh-gold/25 text-lg font-serif select-none" aria-hidden="true">❧</div>
            <div className="absolute top-3 right-3 text-almadekh-gold/25 text-lg font-serif select-none" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}>❧</div>
            <div className="absolute bottom-3 left-3 text-almadekh-gold/25 text-lg font-serif select-none rotate-180" aria-hidden="true" style={{ transform: 'scaleX(-1) scaleY(-1)' }}>❧</div>
            <div className="absolute bottom-3 right-3 text-almadekh-gold/25 text-lg font-serif select-none rotate-180" aria-hidden="true" style={{ transform: 'scaleY(-1)' }}>❧</div>

            <p className="italic text-almadekh-rose text-lg md:text-xl font-serif mb-4 leading-relaxed">
              "Vero, con una dulzura única, estuvo atenta a cada detalle. Muy buen lugar y todo muy rico."
            </p>
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-almadekh-gold text-sm">★</span>
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-almadekh-muted font-semibold">
              — Opinión de Google
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}