import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, ArrowRight, X } from 'lucide-react'
import { useEventStore } from '../../store/eventStore'
import { Gallery } from './Gallery'
import { loadSettings, getTelPhone } from '../../lib/settings'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function Eventos() {
  const { events } = useEventStore()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [telPhone, setTelPhone] = useState('01169720415')

  useEffect(() => {
    loadSettings().then(() => setTelPhone(getTelPhone()))
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewUrl(null)
    },
    []
  )

  useEffect(() => {
    if (previewUrl) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [previewUrl, handleKeyDown])

  const future = events.filter((e) => e.type === 'future')
  const past = events.filter((e) => e.type === 'past')

  return (
    <section id="eventos" className="relative py-28 bg-[#1a0f0c] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[3px] uppercase text-[#B8860B] font-semibold block mb-2"
        >
          Encuentros
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold text-[#E8DCC8] mb-4"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Próximos Encuentros
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-[#C9A876] font-light leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          En Alma Dekh creemos en el arte y la cultura. Organizamos exposiciones, música en vivo, talleres y experiencias únicas.
        </motion.p>

        {future.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20 justify-items-center">
            {future.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group bg-[#0A0704] border-2 border-[#B8860B]/15 rounded-2xl overflow-hidden hover:border-[#B8860B]/40 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(184,134,11,0.15)]"
              >
                {event.image_url && (
                  <div
                    className="h-40 overflow-hidden cursor-pointer"
                    onClick={() => setPreviewUrl(event.image_url!)}
                  >
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={160}
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-[#C9A876]/60 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(event.date)}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#E8DCC8] mb-1.5 group-hover:text-[#B8860B] transition-colors" style={{ fontFamily: '"Cinzel", serif' }}>
                    {event.title}
                  </h3>
                  <p className="text-xs text-[#C9A876]/60 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-[#E8DCC8] mb-6"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              Encuentros Anteriores
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {past.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="bg-[#0A0704] border border-[#B8860B]/10 rounded-xl p-4 hover:border-[#B8860B]/30 transition-all"
                >
                  {event.image_url && (
                    <div
                      className="h-28 rounded-lg overflow-hidden mb-3 cursor-pointer"
                      onClick={() => setPreviewUrl(event.image_url!)}
                    >
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={300}
                        height={112}
                      />
                    </div>
                  )}
                  <div className="text-[10px] text-[#C9A876]/50 mb-1">
                    {formatDate(event.date)}
                  </div>
                  <h4 className="text-xs font-semibold text-[#E8DCC8] mb-1">
                    {event.title}
                  </h4>
                  <p className="text-[10px] text-[#C9A876]/50 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-20"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] tracking-[3px] uppercase text-[#B8860B] font-semibold block mb-2"
          >
            Memorias
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold text-[#E8DCC8] mb-6"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            Galería de Encuentros
          </motion.h3>
          <Gallery onPreview={setPreviewUrl} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#C9A876] mb-4">
            ¿Querés organizar un evento en Alma Dekh?
          </p>
          <a
            href={`tel:${telPhone}`}
            className="inline-flex items-center gap-2 btn-burgundy-gradient text-[#E8DCC8] font-bold py-3.5 px-7 rounded-xl transition-all text-sm border border-[#B8860B]/30"
          >
            Contactanos
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 border border-[#B8860B]/20"
            onClick={() => setPreviewUrl(null)}
          >
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 z-10 text-[#C9A876]/60 hover:text-[#E8DCC8] transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={previewUrl}
              alt=""
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
