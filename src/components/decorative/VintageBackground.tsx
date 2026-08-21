interface VintageBackgroundProps {
  children: React.ReactNode
}

export function VintageBackground({ children }: VintageBackgroundProps) {
  return (
    // `overflow-hidden` aca convertia a este div en el contenedor de scroll de
    // toda la app y dejaba `position: sticky` sin efecto (las solapas de
    // categoria del menu no se fijaban). `overflow-x: clip` recorta igual el
    // desborde lateral de los ornamentos sin crear contexto de scroll.
    <div className="relative [overflow-x:clip]">
      {/* ===== TEXTURAS OSCURAS DAMASCO ===== */}

      {/* Noise grain — textura sutil oscura */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.08,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Patrón damasco sutil */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          backgroundImage: [
            'repeating-linear-gradient(0deg, rgba(184,134,11,0.04) 0px, transparent 1px, transparent 4px)',
            'repeating-linear-gradient(90deg, rgba(184,134,11,0.03) 0px, transparent 1px, transparent 6px)',
          ].join(', '),
          opacity: 0.4,
        }}
      />

      {/* Manchas oscuras sutiles */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 400px 350px at 10% 15%, rgba(26,15,12,0.6) 0%, transparent 70%)',
            'radial-gradient(ellipse 350px 300px at 90% 70%, rgba(26,15,12,0.5) 0%, transparent 65%)',
            'radial-gradient(ellipse 300px 280px at 40% 85%, rgba(26,15,12,0.45) 0%, transparent 60%)',
            'radial-gradient(ellipse 280px 250px at 75% 10%, rgba(26,15,12,0.4) 0%, transparent 55%)',
          ].join(', '),
        }}
      />

      {/* Oscurecimiento de bordes */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse at 0% 0%, rgba(10,7,4,0.5) 0%, transparent 40%)',
            'radial-gradient(ellipse at 100% 0%, rgba(10,7,4,0.45) 0%, transparent 35%)',
            'radial-gradient(ellipse at 0% 100%, rgba(10,7,4,0.45) 0%, transparent 35%)',
            'radial-gradient(ellipse at 100% 100%, rgba(10,7,4,0.5) 0%, transparent 40%)',
          ].join(', '),
        }}
      />

      {/* Vignette dorado */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(184,134,11,0.03) 0%, transparent 50%, rgba(10,7,4,0.4) 100%)',
        }}
      />

      {/* Candle glow overlay */}
      <div
        className="candle-glow fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* ===== CONTENIDO ===== */}
      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  )
}
