import { motion } from 'framer-motion'

export function Poema() {
  return (
    <section id="poema" className="relative min-h-svh flex items-center justify-center bg-baroque-dark overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[3px] uppercase text-baroque-gold font-semibold block mb-3"
        >
          Poema
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-baroque-cream mb-10"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          La Mirada del Alma
        </motion.h2>

        {/* Esquina decorativa superior izquierda del bloque del poema.
            En movil va pegada al borde (sin offset negativo) y mas chica:
            con -left-20 quedaba media imagen fuera de pantalla. */}
        <img
          src="/images/ornaments/esquinaPoema.webp"
          alt=""
          className="absolute top-16 left-0 w-28 h-28 sm:w-56 sm:h-64 object-contain pointer-events-none opacity-80"
          loading="lazy"
          decoding="async"
        />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative rounded-2xl px-6 sm:px-12 py-12 overflow-hidden"
        >
          <div className="space-y-5 text-base sm:text-lg md:text-xl text-baroque-cream-muted/90 leading-relaxed md:leading-loose font-light relative z-10" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-baroque-gold">
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
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-xs tracking-[2px] uppercase text-baroque-cream-muted font-semibold"
        >
          — Ana Clara Amabile
        </motion.p>
      </div>
    </section>
  )
}
