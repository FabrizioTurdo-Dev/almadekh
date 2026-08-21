import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, Clock } from 'lucide-react'
import { BaroqueOrnament } from '../decorative/BaroqueOrnament'
import { loadSettings, getDisplayPhone, getTelPhone, getAddress, getHours } from '../../lib/settings'

// `import.meta.env.PROD` lo resuelve Vite en tiempo de compilacion, asi que en
// desarrollo el bloque entero se elimina del bundle. Antes esto era
// `window.location.hostname !== 'localhost'`, que daba `true` al entrar por
// 127.0.0.1 o por la IP de la LAN: el widget de terceros se cargaba en
// desarrollo y devolvia 404.
const isProd = import.meta.env.PROD

export function Contacto() {
  const [displayPhone, setDisplayPhone] = useState('011 6972-0415')
  const [telPhone, setTelPhone] = useState('01169720415')
  const [address, setAddress] = useState('La Pista 250, Ingeniero Maschwitz')
  const [telFijo, setTelFijo] = useState('3484662776')
  const [hours, setHours] = useState('Mar - Vier: 08:30 - 21:00 / Sábados 10:00 - 21:00 y más')

  useEffect(() => {
    loadSettings().then(() => {
      setDisplayPhone(getDisplayPhone())
      setTelPhone(getTelPhone())
      setAddress(getAddress())
      setHours(getHours())
    })
  }, [])

  useEffect(() => {
    if (!isProd) return
    if (document.querySelector('script[src*="sociablekit.com"]')) return
    const script = document.createElement('script')
    script.src = 'https://widgets.sociablekit.com/google-reviews/widget.js'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <section id="contacto" className="relative min-h-svh flex items-center justify-center px-6 bg-baroque-dark overflow-hidden">
      {/* Glow cálido dorado */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(184,134,11,0.06) 0%, transparent 60%)',
        }}
      />
      {/* Ornamento barroco */}
      <div className="absolute top-4 right-4 md:top-8 md:right-10 scale-[0.55] md:scale-100 origin-top-right" aria-hidden="true">
        <BaroqueOrnament variant="leaf" size={50} rotation={12} opacity={0.25} />
      </div>
      <div className="relative max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[3px] uppercase text-baroque-gold font-semibold block mb-2"
        >
          Encontranos
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-4xl leading-tight text-baroque-cream mb-6"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Visítanos en Ingeniero Maschwitz
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              title: 'Dirección',
              Icon: MapPin,
              content: (
                <p className="text-xs text-baroque-cream-muted leading-relaxed">
                  {address}
                </p>
              ),
            },
            {
              title: 'Teléfono',
              Icon: Phone,
              content: (
                <p className="text-xs text-baroque-cream-muted leading-relaxed">
                  <a href={`tel:${telPhone}`} className="inline-flex items-center min-h-11 text-baroque-gold hover:underline font-medium">
                   
                    <p>Si no contesta WhatsApp {displayPhone}, hacer sonar el siguiente teléfono fijo: {telFijo}</p>
                  </a>
                </p>
              ),
            },
            {
              title: 'Horarios',
              Icon: Clock,
              content: <p className="text-xs text-baroque-cream-muted leading-relaxed">{hours}</p>,
            },
          ].map((item, i) => {
            const { Icon } = item
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-baroque-dark-sec border-2 border-baroque-gold/15 rounded-2xl p-5 group cursor-default shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-baroque-gold/30 hover:shadow-[0_0_25px_rgba(184,134,11,0.1)] transition-all"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-5 h-5 text-baroque-gold mt-0.5 shrink-0 group-hover:text-baroque-gold-light transition-colors" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold text-baroque-cream mb-1">{item.title}</h3>
                    {item.content}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mapa de ubicación */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-8 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-2 border-baroque-gold/15"
        >
          {/* Relacion de aspecto en vez de 450px fijos: en un telefono de 375px
              el mapa quedaba mas alto que ancho y se comia media pantalla. */}
          <div className="aspect-[4/3] sm:aspect-[16/9]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3293.1229867222023!2d-58.749368100000005!3d-34.3727921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc9f584bda71b5%3A0x786d99b27cd38e64!2sAlma%20Dekh!5e0!3m2!1ses-419!2sar!4v1785765288329!5m2!1ses-419!2sar"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Ubicación de Alma Dekh"
              className="w-full h-full"
            />
          </div>
        </motion.div>

        {/* Widget de reseñas Google (SociableKIT) — solo en producción */}
        {isProd && (
          <div className="mt-12 mb-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] tracking-[3px] uppercase text-baroque-wine font-semibold block mb-2 text-center"
            >
              Lo que dicen de nosotros
            </motion.span>
            <div className="sk-ww-google-reviews max-w-4xl mx-auto" data-embed-id="25705919" />
          </div>
        )}

        {/* Reseña externa — Broccolino.com.ar (guía de restaurantes).
            Resumen propio, no reproduce el artículo original (derechos de autor);
            el link lleva a la reseña completa en la fuente. */}
        <motion.a
          href="https://broccolino.com.ar/restaurante/alma-dekh/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="block mt-8 mb-8 max-w-2xl mx-auto bg-baroque-dark-sec border-2 border-baroque-gold/15 rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-baroque-gold/30 hover:shadow-[0_0_25px_rgba(184,134,11,0.1)] transition-all group"
        >
          <span className="inline-block text-[10px] tracking-[2px] uppercase text-baroque-gold font-semibold mb-3">
            10/10 en Broccolino · 22 reseñas
          </span>
          <p className="text-sm text-baroque-cream-muted leading-relaxed mb-4">
            "Los pilares de la experiencia Alma Dekh:
            Un ambiente que cautiva.
            El principal atractivo que emana de las opiniones y las imágenes disponibles es su atmósfera. Lejos de la estética estandarizada de muchas cadenas de restaurantes, Alma Dekh apuesta por una ambientación que se siente como el living de una casa, pero con un toque bohemio y artístico. Los clientes destacan la sensación de estar "como en casa", un espacio donde los niños pueden jugar con libertad gracias a la disposición de juguetes, y los adultos pueden relajarse en un entorno que invita a la calma. Esta sensación de hogar, de "calor de hogar", es un tema recurrente y parece ser el resultado directo de una visión muy clara por parte de su propietaria."
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-baroque-gold font-semibold group-hover:underline">
            Leer la reseña completa en Broccolino →
          </span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <a
            href="https://maps.google.com/?q=La+Pista+250+Ingeniero+Maschwitz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-b from-baroque-wine to-baroque-wine-dark hover:from-baroque-wine-light hover:to-baroque-wine-deep text-baroque-cream font-bold py-4 rounded-xl transition-all text-center text-sm btn-shimmer border border-baroque-gold/30"
          >
            Cómo Llegar (Google Maps)
          </a>
          <a
            href={`tel:${telPhone}`}
            className="flex-1 bg-baroque-dark-sec hover:bg-baroque-dark text-baroque-cream font-semibold py-4 rounded-xl transition-all border-2 border-baroque-gold/20 text-center text-sm hover:border-baroque-gold/40 hover:shadow-[0_0_20px_rgba(184,134,11,0.1)]"
          >
            Llamar para Reservar
          </a>
        </motion.div>
      </div>
    </section>
  )
}
