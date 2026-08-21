interface OrnamentalDividerProps {
  className?: string
  variant?: 'flourish' | 'simple' | 'floral'
}

const maskFade = {
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
  maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
} as React.CSSProperties

export function OrnamentalDivider({
  className = '',
  variant = 'flourish',
}: OrnamentalDividerProps) {
  const getHeight = () => {
    switch (variant) {
      case 'simple':
        return 50
      case 'floral':
        return 55
      default:
        return 60
    }
  }

  return (
    <div className={`flex items-center justify-center py-2 ${className}`}>
      <div
        className="w-full overflow-hidden"
        style={{ height: getHeight() }}
      >
        <img
          src="/images/ornaments/divisorSecciones.jpg"
          alt="Divisor de sección"
          className="w-full h-full object-cover object-center"
          style={maskFade}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  )
}
