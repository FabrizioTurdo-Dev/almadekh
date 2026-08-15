import { motion } from 'framer-motion'
import { galleryImages } from '../../data/gallery'

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
          className="group relative block w-full mb-3 break-inside-avoid overflow-hidden rounded-xl border border-almadekh-border cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-almadekh-teal/60"
          aria-label={`Ampliar ${img.alt}`}
        >
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </motion.button>
      ))}
    </div>
  )
}
