export interface GalleryImage {
  id: string
  src: string
  alt: string
}

const IMAGE_COUNT = 25

export const galleryImages: GalleryImage[] = Array.from({ length: IMAGE_COUNT }, (_, i) => {
  const n = (i + 1).toString().padStart(2, '0')
  return {
    id: `gallery-${n}`,
    src: `/images/eventos/evento-${n}.jpg`,
    alt: `Momento en Alma Dekh ${i + 1}`,
  }
})
