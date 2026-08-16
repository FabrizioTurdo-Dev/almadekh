import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, Clock } from 'lucide-react'
import { BaroqueOrnament } from '../decorative/BaroqueOrnament'
import { loadSettings, getDisplayPhone, getTelPhone, getAddress } from '../../lib/settings'

const icons = [MapPin, Phone, Clock]
const isProd = window.location.hostname !== 'localhost'

export function Contacto() {
  const [displayPhone, setDisplayPhone] = useState('011 6972-0415')
  const [telPhone, setTelPhone] = useState('01169720415')
  const [address, setAddress] = useState('La Pista 250, Ingeniero Maschwitz')

  useEffect(() => {
    loadSettings().then(() => {
      setDisplayPhone(getDisplayPhone())
      setTelPhone(getTelPhone())
      setAddress(getAddress())
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
    <section id="contacto" className="relative py-16 md:py-24 px-6 bg-almadekh-surface/80 overflow-hidden">
      {/* Warm glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
        }}
      />
      {/* Decorative baroque ornament */}
      <div className="absolute top-8 right-10 hidden md:block" aria-hidden="true">
        <BaroqueOrnament variant="leaf" color="burgundy" size={50} rotation={12} opacity={0.32} />
      </div>
      <div className="relative max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[3px] uppercase text-almadekh-teal font-semibold block mb-2"
        >
          Encontranos
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-4xl leading-tight text-almadekh-text mb-6"
        >
          Visítanos en Ingeniero Maschwitz
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              title: 'Dirección',
              content: (
                <p className="text-xs text-almadekh-muted leading-relaxed">
                  {address}
                </p>
              ),
            },
            {
              title: 'Teléfono',
              content: (
                <p className="text-xs text-almadekh-muted leading-relaxed">
                  <a href={`tel:${telPhone}`} className="text-almadekh-teal hover:underline font-medium">
                    {displayPhone}
                  </a>
                </p>
              ),
            },
            {
              title: 'Horarios',
              content: <p className="text-xs text-almadekh-muted leading-relaxed">Abierto todos los días.</p>,
            },
          ].map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-white shadow-sm border border-almadekh-border rounded-2xl p-5 group cursor-default"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-5 h-5 text-almadekh-teal mt-0.5 shrink-0 group-hover:text-almadekh-teal-light transition-colors" />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold text-almadekh-text mb-1">{item.title}</h3>
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
          className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-almadekh-border"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3293.1229867222023!2d-58.749368100000005!3d-34.3727921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc9f584bda71b5%3A0x786d99b27cd38e64!2sAlma%20Dekh!5e0!3m2!1ses-419!2sar!4v1785765288329!5m2!1ses-419!2sar"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Ubicación de Alma Dekh"
            className="w-full"
          />
        </motion.div>

        {/* Widget de reseñas Google (SociableKIT) — solo en producción */}
        {isProd && (
          <div className="mt-12 mb-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[10px] tracking-[3px] uppercase text-almadekh-rose font-semibold block mb-2 text-center"
            >
              Lo que dicen de nosotros
            </motion.span>
            <div className="sk-ww-google-reviews max-w-4xl mx-auto" data-embed-id="25705919" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 max-w-lg"
        >
          <a
            href="https://maps.google.com/?q=La+Pista+250+Ingeniero+Maschwitz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-almadekh-teal hover:bg-almadekh-teal-light text-white font-bold py-4 rounded-xl transition-all text-center text-sm btn-shimmer"
          >
            Cómo Llegar (Google Maps)
          </a>
          <a
            href={`tel:${telPhone}`}
            className="flex-1 bg-white hover:bg-almadekh-surface text-almadekh-text font-semibold py-4 rounded-xl transition-all border border-almadekh-border text-center text-sm hover:shadow-md"
          >
            Llamar para Reservar
          </a>
        </motion.div>
      </div>
    </section>
  )
}
