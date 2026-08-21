import { motion } from 'framer-motion'
import { galleryImages, GALLERY_SIZES } from '../../data/gallery'

interface Props {
  onPreview: (src: string) => void
}

export function Gallery({ onPreview }: Props) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
      {galleryImages.map((img, i) => (
        <motion.button
          key={img.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: 0.04 * (i % 8), duration: 0.4 }}
          onClick={() => onPreview(img.src)}
          className="group relative block w-full mb-3 break-inside-avoid overflow-hidden rounded-xl border-2 border-baroque-gold/20 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-baroque-gold/60 hover:border-baroque-gold/50 transition-all duration-500 hover:shadow-[0_0_25px_rgba(184,134,11,0.2)]"
          aria-label={`Ampliar ${img.alt}`}
        >
          <picture>
            <source type="image/webp" srcSet={img.srcSetWebp} sizes={GALLERY_SIZES} />
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              width={img.width}
              height={img.height}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </picture>
          {/* Overlay oscuro en hover */}
          <div className="absolute inset-0 bg-baroque-dark/0 group-hover:bg-baroque-dark/40 transition-all duration-500 flex items-center justify-center">
            <span className="text-baroque-gold text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-widest" style={{ fontFamily: '"Cinzel", serif' }}>
              ✦
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
