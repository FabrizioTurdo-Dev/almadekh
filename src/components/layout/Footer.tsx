import { useState, useEffect } from 'react'
import { loadSettings, getHours } from '../../lib/settings'

const DEV_WHATSAPP_URL =
  'https://wa.me/5491154922800?text=' +
  encodeURIComponent('Hola, vi la página de Vero, me gustó. ¡Quiero una!')

export function Footer() {
  const [hours, setHours] = useState('Mar - Vier: 08:30 - 21:00 / Sábados 10:00 - 21:00 y más')

  useEffect(() => {
    loadSettings().then(() => setHours(getHours()))
  }, [])

  return (
    <footer className="bg-gradient-to-r from-baroque-dark via-baroque-dark-sec to-baroque-dark border-t-2 border-baroque-gold/30 py-12">
      <div className="container mx-auto px-6">

        {/* Grid de info */}
        {/* En 3 columnas el email no entra en pantallas de teléfono
            (necesita ~145px y recibe ~90px), así que se apila hasta sm. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 text-center">
          <div>
            <h4 className="text-baroque-gold tracking-widest mb-2 text-xs" style={{ fontFamily: '"Cinzel", serif' }}>UBICACIÓN</h4>
            <p className="text-baroque-cream-muted text-sm">Ingeniero Maschwitz, Buenos Aires, Argentina</p>
          </div>
          <div>
            <h4 className="text-baroque-gold tracking-widest mb-2 text-xs" style={{ fontFamily: '"Cinzel", serif' }}>HORARIO</h4>
            <p className="text-baroque-cream-muted text-sm">{hours}</p>
          </div>
          <div>
            <h4 className="text-baroque-gold tracking-widest mb-2 text-xs" style={{ fontFamily: '"Cinzel", serif' }}>CONTACTO</h4>
            <p className="text-baroque-cream-muted text-sm">v.garcia@bue.edu.ar</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-baroque-gold/15 pt-8 text-center">
          <p className="text-baroque-cream-muted/60 text-xs tracking-widest">
            © 2024 ALMA DEKH — Una Experiencia Gastronómica
          </p>
          <p className="text-baroque-cream-muted/40 text-[11px] tracking-wide mt-2">
            Sitio hecho por{' '}
            <a
              href={DEV_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-baroque-gold hover:underline"
            >
              Fabrizio Turdo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
