import { TopNav, BottomNav } from '../components/layout/Navbar'
import { Hero } from '../components/landing/Hero'
import { Poema } from '../components/landing/Poema'
import { Espacio } from '../components/landing/Espacio'
import { Experiencia } from '../components/landing/Experiencia'
import { Eventos } from '../components/landing/Eventos'
import { Contacto } from '../components/landing/Contacto'
import { OrnamentalDivider } from '../components/decorative/OrnamentalDivider'
import { BaroqueOrnament } from '../components/decorative/BaroqueOrnament'

export function LandingPage() {
  return (
    <div className="min-h-screen pt-14 md:pt-16">
      <TopNav />
      <Hero />
      <OrnamentalDivider color="var(--color-baroque-gold)" variant="flourish" />
      <Poema />
      <Espacio />
      <OrnamentalDivider color="var(--color-baroque-burgundy)" variant="floral" />
      <Experiencia />
      <div className="flex justify-center py-4">
        <BaroqueOrnament variant="scroll" color="gold" size={110} opacity={0.4} rotation={90} />
      </div>
      <Eventos />
      <OrnamentalDivider color="var(--color-baroque-gold)" variant="flourish" />
      <Contacto />
      <BottomNav />
    </div>
  )
}