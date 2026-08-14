import { motion } from 'framer-motion'
import { BaroqueOrnament } from '../decorative/BaroqueOrnament'

export function Poema() {
  return (
    <section id="poema" className="relative py-20 md:py-28 bg-baroque-cream/40 overflow-hidden">
      {/* Decorative baroque leaf in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        <BaroqueOrnament variant="leaf" color="gold" size={300} opacity={0.06} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[3px] uppercase text-baroque-burgundy font-semibold block mb-3"
        >
          Poema
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-baroque-burgundy mb-10"
        >
          La Mirada del Alma
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative"
        >
          {/* Opening quote */}
          <span
            className="absolute -top-6 -left-2 text-6xl font-serif leading-none select-none pointer-events-none text-baroque-gold/20"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <div className="space-y-5 text-base sm:text-lg md:text-xl text-almadekh-text/85 leading-relaxed md:leading-loose font-light" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            <p>
              Una tenue luz que crece y enciende senderos muertos, relámpagos de sueños
              gestándose, chispas de amor que invaden almas en el destierro.
            </p>
            <p>
              Aquí la energía clava sus agujas sanadoras, una poderosa paz entra sin aviso
              para calmar angustias y ansiedades apuradas.
            </p>
            <p>
              Espacio de magia que emerge de pronto, maravilla de gestas colectivas,
              encanto de sitio dueño de caricias y abrazos desamparados.
            </p>
            <p>
              Eso y tanto más; este refugio contiene el amor y la fe renovados siempre
              al calor de las miradas detenidas, que festejan la gloria.
            </p>
            <p>
              Alma que recibe corazones anhelantes, alma que silenciosa mira el aura
              esperanzada, alma que es antorcha abre caminos a quien no detiene su eterno
              renacer.
            </p>
            <p>
              La mirada del alma se me eterniza en cada momento atrapando sonrisas, la
              emoción escapa a todo intento de olvido, el encuentro es espejo de alegría
              y vida recuperadas.
            </p>
          </div>

          {/* Closing quote */}
          <span
            className="absolute -bottom-8 -right-2 text-6xl font-serif leading-none select-none pointer-events-none text-baroque-gold/20"
            aria-hidden="true"
          >
            &rdquo;
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-xs tracking-[2px] uppercase text-baroque-rust font-semibold"
        >
          — Ana Clara Amabile
        </motion.p>
      </div>
    </section>
  )
}
