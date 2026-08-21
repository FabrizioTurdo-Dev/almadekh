import { TopNav, BottomNav } from '../components/layout/Navbar'
import { Hero } from '../components/landing/Hero'
import { Poema } from '../components/landing/Poema'
import { Espacio } from '../components/landing/Espacio'
import { Experiencia } from '../components/landing/Experiencia'
import { Eventos } from '../components/landing/Eventos'
import { Contacto } from '../components/landing/Contacto'
import { Footer } from '../components/layout/Footer'
import { OrnamentalDivider } from '../components/decorative/OrnamentalDivider'

export function LandingPage() {
  return (
    <div className="min-h-svh pt-14 md:pt-16 pb-mobile-nav bg-baroque-dark">
      <TopNav />
      <Hero />
      <Poema />
      <OrnamentalDivider variant="flourish" />
      <Espacio />
      <OrnamentalDivider variant="flourish" />
      <Experiencia />
      <OrnamentalDivider variant="flourish" />
      <Eventos />
      <OrnamentalDivider variant="flourish" />
      <Contacto />
      <OrnamentalDivider variant="flourish" />
      <Footer />
      <BottomNav />
    </div>
  )
}
