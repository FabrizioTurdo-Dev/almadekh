import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { BaroqueOrnament } from '../decorative/BaroqueOrnament'

export function Espacio() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Recorrido del parallax en px. El marco recorta y la imagen lleva 2x este
  // valor de alto extra (`h-[calc(...+5rem)]` con `-mt-10`), asi que en ningun
  // punto del scroll se ve el fondo dentro del marco.
  const PARALLAX_TRAVEL = 40
  const imageY = useTransform(scrollYProgress, [0, 1], [PARALLAX_TRAVEL, -PARALLAX_TRAVEL])

  return (
    <section id="espacio" ref={sectionRef} className="relative min-h-svh flex items-center justify-center bg-baroque-dark">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] tracking-[3px] uppercase text-baroque-gold font-semibold block mb-2"
            >
              Nuestro Entorno
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-bold text-baroque-cream mb-6"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              Galerías al aire libre y calidez natural
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-baroque-cream-muted font-light leading-relaxed mb-6"
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
                  className="flex items-center gap-3 text-baroque-cream-muted"
                >
                  <span className="w-2 h-2 rounded-full bg-baroque-gold shrink-0" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Imagen con parallax */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative"
          >
            {/* El marco define el alto visible; la imagen es PARALLAX_TRAVEL mas
                alta a cada lado para que el desplazamiento nunca descubra el
                fondo. Con la imagen del mismo alto que el marco quedaba una
                franja vacia de hasta 42px abajo. */}
            <div className="overflow-hidden rounded-3xl shadow-xl border-2 border-baroque-gold/30 h-80 md:h-[28rem]">
              <motion.img
                src="/images/espacio.jpg"
                alt="Galería exterior de Alma Dekh"
                className="w-full h-[calc(20rem+5rem)] md:h-[calc(28rem+5rem)] -mt-10 object-cover"
                loading="lazy"
                decoding="async"
                width={800}
                height={500}
                style={{ y: imageY }}
              />
            </div>
            {/* Ornamento superior-izquierdo: se escala en mobile en vez de
                ocultarse. El inferior-derecho se oculta directamente en
                mobile por decisión de diseño y solo aparece desde `md:`. */}
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 z-10 origin-top-left scale-[0.55] md:scale-100" aria-hidden="true">
              <BaroqueOrnament variant="corner" size={100} opacity={0.5} />
            </div>
            <div className="absolute hidden md:block md:-bottom-6 md:-right-6 z-10 origin-bottom-right md:scale-100" aria-hidden="true">
              <BaroqueOrnament variant="corner" size={100} rotation={180} opacity={0.5} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
