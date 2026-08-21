import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { BaroqueOrnament } from '../decorative/BaroqueOrnament'
import { espacioImages } from '../../data/espacioGallery'

const SLIDE_INTERVAL = 4500

export function Espacio() {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const startAutoplay = useCallback(() => {
    stopAutoplay()
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % espacioImages.length)
    }, SLIDE_INTERVAL)
  }, [stopAutoplay])

  // El autoplay del marco chico se pausa mientras el lightbox esta abierto,
  // para no cambiar la foto ampliada mientras el usuario la esta mirando.
  useEffect(() => {
    if (lightboxOpen) {
      stopAutoplay()
    } else {
      startAutoplay()
    }
    return stopAutoplay
  }, [lightboxOpen, startAutoplay, stopAutoplay])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % espacioImages.length)
  }, [])

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + espacioImages.length) % espacioImages.length)
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, goNext, goPrev])

  return (
    <section id="espacio" className="relative min-h-svh flex items-center justify-center bg-baroque-dark">
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

          {/* Carrusel de fotos del espacio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Ampliar galería del espacio"
              className="relative block w-full overflow-hidden rounded-3xl shadow-xl border-2 border-baroque-gold/30 h-80 md:h-[28rem] cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-baroque-gold/60"
            >
              <AnimatePresence>
                <motion.img
                  key={espacioImages[index].src}
                  src={espacioImages[index].src}
                  alt={espacioImages[index].alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={espacioImages[index].width}
                  height={espacioImages[index].height}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              </AnimatePresence>
            </button>
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

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 text-baroque-cream-muted/60 hover:text-baroque-cream transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              aria-label="Foto anterior"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 text-baroque-cream-muted/60 hover:text-baroque-gold transition-colors p-2"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={espacioImages[index].src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                src={espacioImages[index].src}
                alt={espacioImages[index].alt}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
              />
            </AnimatePresence>

            <button
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              aria-label="Foto siguiente"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 text-baroque-cream-muted/60 hover:text-baroque-gold transition-colors p-2"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-baroque-cream-muted/60 tracking-widest">
              {index + 1} / {espacioImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
