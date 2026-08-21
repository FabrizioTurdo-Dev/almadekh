import { useLocation, useNavigate } from 'react-router-dom'
import { Home, ClipboardList, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/menu', icon: ClipboardList, label: 'Menú' },
  { path: '/admin', icon: User, label: 'Admin' },
]

const sectionLinks = [
  { id: 'hero', label: 'Inicio' },
  { id: 'espacio', label: 'Espacio' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'contacto', label: 'Contacto' },
]

const navbarRoot = typeof document !== 'undefined'
  ? document.getElementById('navbar-portal')
  : null

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(path)
    }
  }

  if (!navbarRoot) return null

  return createPortal(
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] backdrop-blur-xl border-t pb-safe pt-2 md:hidden transition-all duration-500 bg-baroque-dark/95 border-baroque-gold/30">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all duration-500 px-4 py-1 ${
                isActive ? 'text-baroque-gold' : 'text-baroque-cream-muted/60'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>,
    navbarRoot
  )
}

export function TopNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenu, setMobileMenu] = useState(false)

  const isLanding = location.pathname === '/'

  const handleNavClick = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(path)
    }
  }

  const handleMobileNav = (sectionId: string) => {
    setMobileMenu(false)
    if (isLanding) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  if (!navbarRoot) return null

  return createPortal(
    <>
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-[9999] h-14 items-center justify-between px-6 transition-all duration-500 bg-gradient-to-r from-baroque-dark via-baroque-dark-sec to-baroque-dark backdrop-blur-md border-b-2 border-baroque-gold shadow-[0_8px_25px_rgba(184,134,11,0.15)]">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-baroque-gold/30">
            <img src="/images/logo.jpg" alt="Alma Dekh" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg tracking-[0.1em] text-baroque-cream" style={{ fontFamily: '"Cinzel", serif' }}>
            Alma Dekh
          </span>
        </button>
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-500 ${
                    isActive
                      ? 'bg-baroque-gold/15 text-baroque-gold shadow-[0_0_15px_rgba(184,134,11,0.2)]'
                      : 'text-baroque-cream-muted/70 hover:text-baroque-cream hover:bg-baroque-gold/8'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
        </div>
      </nav>

      {!location.pathname.startsWith('/admin') && (
        <button
          onClick={() => setMobileMenu(true)}
          aria-label="Abrir menú"
          className="fixed top-3 right-3 z-[9999] md:hidden backdrop-blur-xl p-2.5 rounded-xl transition-all duration-500 bg-baroque-dark/80 border border-baroque-gold/20 min-w-11 min-h-11 flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-baroque-cream" />
        </button>
      )}

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenu(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-baroque-dark border-l-2 border-baroque-gold/30 p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-baroque-gold tracking-[0.1em]" style={{ fontFamily: '"Cinzel", serif' }}>Alma Dekh</span>
                <button
                  onClick={() => setMobileMenu(false)}
                  className="text-baroque-cream-muted/60 hover:text-baroque-cream transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-[10px] tracking-[2px] uppercase text-baroque-gold font-semibold mb-3">
                  Secciones
                </p>
                <div className="space-y-1">
                  {sectionLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleMobileNav(link.id)}
                      className="block w-full text-left px-3 py-2.5 rounded-xl text-sm text-baroque-cream hover:bg-baroque-gold/10 hover:text-baroque-gold transition-all font-medium"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    navbarRoot
  )
}
