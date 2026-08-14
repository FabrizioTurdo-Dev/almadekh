import { BaroqueOrnament } from './BaroqueOrnament'

interface VintageBackgroundProps {
  children: React.ReactNode
}

export function VintageBackground({ children }: VintageBackgroundProps) {
  return (
    <div className="relative overflow-hidden">
      {/* ===== TEXTURE LAYERS — all position:fixed, z-[1] ===== */}

      {/* Noise grain — paper surface roughness */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.18,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Fiber texture — hidden on mobile for performance */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] hidden sm:block"
        aria-hidden="true"
        style={{
          backgroundImage: [
            'repeating-linear-gradient(0deg, rgba(120,100,60,0.15) 0px, transparent 1px, transparent 4px)',
            'repeating-linear-gradient(90deg, rgba(120,100,60,0.10) 0px, transparent 1px, transparent 6px)',
          ].join(', '),
          opacity: 0.15,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Scratch marks — hidden on mobile for performance */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] hidden md:block"
        aria-hidden="true"
        style={{
          backgroundImage: [
            'repeating-linear-gradient(35deg, transparent 0px, transparent 8px, rgba(100,80,40,0.20) 8px, rgba(100,80,40,0.20) 9px, transparent 9px, transparent 40px)',
            'repeating-linear-gradient(-25deg, transparent 0px, transparent 12px, rgba(90,70,35,0.15) 12px, rgba(90,70,35,0.15) 13px, transparent 13px, transparent 55px)',
            'repeating-linear-gradient(50deg, transparent 0px, transparent 15px, rgba(110,90,50,0.12) 15px, rgba(110,90,50,0.12) 16px, transparent 16px, transparent 70px)',
          ].join(', '),
          opacity: 0.20,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Large aged stain spots — prominent amber/brown patches */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse 400px 350px at 10% 15%, rgba(160,130,80,0.35) 0%, transparent 70%)',
            'radial-gradient(ellipse 350px 300px at 90% 70%, rgba(140,110,65,0.30) 0%, transparent 65%)',
            'radial-gradient(ellipse 300px 280px at 40% 85%, rgba(130,100,60,0.28) 0%, transparent 60%)',
            'radial-gradient(ellipse 280px 250px at 75% 10%, rgba(150,120,75,0.25) 0%, transparent 55%)',
            'radial-gradient(ellipse 320px 300px at 25% 50%, rgba(145,115,70,0.22) 0%, transparent 60%)',
            'radial-gradient(ellipse 260px 240px at 60% 35%, rgba(170,140,90,0.20) 0%, transparent 50%)',
          ].join(', '),
        }}
      />

      {/* Edge and corner darkening — reduced on mobile */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background: [
            'radial-gradient(ellipse at 0% 0%, rgba(100,80,45,0.25) 0%, transparent 40%)',
            'radial-gradient(ellipse at 100% 0%, rgba(100,80,45,0.22) 0%, transparent 35%)',
            'radial-gradient(ellipse at 0% 100%, rgba(100,80,45,0.22) 0%, transparent 35%)',
            'radial-gradient(ellipse at 100% 100%, rgba(100,80,45,0.25) 0%, transparent 40%)',
          ].join(', '),
        }}
      />

      {/* Golden vignette — center bright, edges warm */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(160,130,70,0.30) 100%)',
        }}
      />

      {/* Candle glow overlay — warm animated lights */}
      <div
        className="candle-glow fixed inset-0 pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* ===== CONTENT + FLOATING BAROQUE ORNAMENTS ===== */}
      <div className="relative z-[2]">
        {children}

        {/* 5 Floating baroque ornaments — position:absolute (scrolls with page) */}
        <div className="absolute pointer-events-none" style={{ left: '6%', top: '350px' }}>
          <BaroqueOrnament variant="scroll" color="gold" size={130} opacity={0.4} />
        </div>
        <div className="absolute pointer-events-none" style={{ right: '5%', top: '180px' }}>
          <BaroqueOrnament variant="floral" color="burgundy" size={110} opacity={0.38} />
        </div>
        <div className="absolute pointer-events-none" style={{ left: '42%', top: '55vh' }}>
          <BaroqueOrnament variant="leaf" color="olive" size={85} opacity={0.3} />
        </div>
        <div className="absolute pointer-events-none" style={{ left: '4%', top: '140vh' }}>
          <BaroqueOrnament variant="scroll" color="rust" size={120} opacity={0.35} rotation={-15} />
        </div>
        <div className="absolute pointer-events-none" style={{ right: '6%', top: '160vh' }}>
          <BaroqueOrnament variant="floral" color="gold" size={100} opacity={0.4} />
        </div>
      </div>
    </div>
  )
}