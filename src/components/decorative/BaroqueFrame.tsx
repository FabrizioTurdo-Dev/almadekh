export function BaroqueFrame() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[3]" aria-hidden="true">
      <img
        src="/images/ornaments/esquinaDorada.webp"
        alt=""
        className="absolute top-4 left-4 w-28 h-28 md:w-40 md:h-40 object-contain"
        style={{ opacity: 0.75, mixBlendMode: 'luminosity' }}
        loading="lazy"
        decoding="async"
      />
      <img
        src="/images/ornaments/esquinaDorada.webp"
        alt=""
        className="absolute top-4 right-4 w-28 h-28 md:w-40 md:h-40 object-contain"
        style={{ transform: 'scaleX(-1)', opacity: 0.75, mixBlendMode: 'luminosity' }}
        loading="lazy"
        decoding="async"
      />
      <img
        src="/images/ornaments/esquinaDorada.webp"
        alt=""
        className="absolute bottom-4 left-4 w-28 h-28 md:w-40 md:h-40 object-contain"
        style={{ transform: 'scaleY(-1)', opacity: 0.75, mixBlendMode: 'luminosity' }}
        loading="lazy"
        decoding="async"
      />
      <img
        src="/images/ornaments/esquinaDorada.webp"
        alt=""
        className="absolute bottom-4 right-4 w-28 h-28 md:w-40 md:h-40 object-contain"
        style={{ transform: 'scale(-1)', opacity: 0.75, mixBlendMode: 'luminosity' }}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
