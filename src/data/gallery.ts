export interface GalleryImage {
  id: string
  /** JPG de 400px: solo lo pide un navegador sin soporte WebP. */
  src: string
  /** Variantes WebP servidas al 99% de los visitantes. */
  srcSetWebp: string
  alt: string
  /** Medidas del original: definen la relacion de aspecto, no el archivo servido. */
  width: number
  height: number
}

/**
 * Medidas reales de cada archivo, en orden.
 *
 * Son obligatorias. Sin `width`/`height` las `<img loading="lazy">` ocupan 0px
 * de alto dentro del contenedor `columns-2`, la galeria colapsa a ~200px y al
 * cargar las fotos el documento crece de golpe (~2.900px en un telefono de
 * 375px). El visitante pierde la posicion de scroll a mitad de la pagina.
 */
const SIZES: readonly (readonly [number, number])[] = [
  [1080, 1350], // evento-01
  [939, 1600], // evento-02
  [1078, 1582], // evento-03
  [1066, 1600], // evento-04
  [1204, 1600], // evento-05
  [1204, 1600], // evento-06
  [960, 1280], // evento-07
  [960, 1280], // evento-08
  [1204, 1600], // evento-09
  [960, 1280], // evento-10
  [738, 1600], // evento-11
  [1600, 1200], // evento-12
  [737, 1600], // evento-13
  [828, 1472], // evento-14
  [1025, 1600], // evento-15
  [1014, 1481], // evento-16
  [899, 1599], // evento-17
  [900, 1600], // evento-18
  [1054, 1492], // evento-19
  [1024, 1536], // evento-20
  [960, 1280], // evento-21
  [738, 1600], // evento-22
  [904, 1280], // evento-23
  [1054, 1492], // evento-24
  [1204, 1600], // evento-25
]

export const galleryImages: GalleryImage[] = SIZES.map(([width, height], i) => {
  const n = (i + 1).toString().padStart(2, '0')
  const base = `/images/eventos/evento-${n}`
  return {
    id: `gallery-${n}`,
    src: `${base}.jpg`,
    srcSetWebp: `${base}-400.webp 400w, ${base}-800.webp 800w`,
    alt: `Momento en Alma Dekh ${i + 1}`,
    width,
    height,
  }
})

/**
 * Ancho renderizado de cada foto, para que el navegador elija la variante.
 * El contenedor es `columns-2 sm:columns-3 lg:columns-4` dentro de un
 * `max-w-6xl px-6`, asi que en pantallas grandes la columna se estabiliza
 * en ~267px y no sigue creciendo con el viewport.
 */
export const GALLERY_SIZES = '(min-width: 1024px) 267px, (min-width: 640px) 30vw, 45vw'
