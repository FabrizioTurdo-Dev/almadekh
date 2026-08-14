import { useLocation, useNavigate } from 'react-router-dom'
import { Home, ClipboardList, User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

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
  const { user } = useAuthStore()
  const [isOverHero, setIsOverHero] = useState(true)

  const visibleNavItems = navItems.filter(
    (item) => item.path !== '/admin' || user
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsOverHero(window.scrollY < 100)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!navbarRoot) return null

  return createPortal(
    <nav className={`fixed bottom-0 left-0 right-0 z-[9999] backdrop-blur-xl border-t pb-5 pt-2 md:hidden transition-all duration-500 ${
      isOverHero
        ? 'bg-black/40 border-white/10'
        : 'bg-almadekh-bg/95 border-almadekh-border'
    }`}>
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all duration-500 px-4 py-1 ${
                isOverHero
                  ? isActive ? 'text-white' : 'text-white/70'
                  : isActive ? 'text-almadekh-teal' : 'text-almadekh-subdued'
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
  const [isOverHero, setIsOverHero] = useState(true)
  const { user } = useAuthStore()

  const isLanding = location.pathname === '/'

  useEffect(() => {
    if (!isLanding) {
      setIsOverHero(false)
      return
    }
    const handleScroll = () => {
      setIsOverHero(window.scrollY < 100)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLanding])

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

  const handlePageNav = (path: string) => {
    setMobileMenu(false)
    navigate(path)
  }

  if (!navbarRoot) return null

  return createPortal(
    <>
      <nav className={`hidden md:flex fixed top-0 left-0 right-0 z-[9999] backdrop-blur-xl h-14 items-center justify-between px-6 transition-all duration-500 ${
        isOverHero
          ? 'bg-black/30 border-b border-white/10'
          : 'bg-almadekh-bg/95 border-b border-almadekh-border'
      }`}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white">
            <img src="/images/logo.jpg" alt="Alma Dekh" className="w-full h-full object-contain" />
          </div>
          <span className={`font-serif font-bold text-lg tracking-wide transition-colors duration-500 ${
            isOverHero ? 'text-white' : 'text-almadekh-teal'
          }`}>Alma Dekh</span>
        </button>
        <div className="flex items-center gap-1">
          {navItems
            .filter((item) => item.path !== '/admin' || user)
            .map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-500 ${
                    isOverHero
                      ? isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      : isActive
                        ? 'bg-almadekh-teal/10 text-almadekh-teal'
                        : 'text-almadekh-subdued hover:text-almadekh-text hover:bg-almadekh-surface'
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
          className={`fixed top-3 right-3 z-[9999] md:hidden backdrop-blur-xl p-2 rounded-xl transition-all duration-500 ${
            isOverHero
              ? 'bg-black/30 border border-white/10'
              : 'bg-almadekh-bg/80 border border-almadekh-border'
          }`}
        >
          <Menu className={`w-5 h-5 transition-colors duration-500 ${isOverHero ? 'text-white' : 'text-almadekh-text'}`} />
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
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenu(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-almadekh-bg border-l border-almadekh-border p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-almadekh-teal font-serif">Alma Dekh</span>
                <button
                  onClick={() => setMobileMenu(false)}
                  className="text-almadekh-subdued hover:text-almadekh-text transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-[10px] tracking-[2px] uppercase text-almadekh-muted font-semibold mb-3">
                  Secciones
                </p>
                <div className="space-y-1">
                  {sectionLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleMobileNav(link.id)}
                      className="block w-full text-left px-3 py-2.5 rounded-xl text-sm text-almadekh-text hover:bg-almadekh-surface hover:text-almadekh-teal transition-all font-medium"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] tracking-[2px] uppercase text-almadekh-muted font-semibold mb-3">
                  Páginas
                </p>
                <div className="space-y-1">
                  {navItems
                    .filter((item) => item.path !== '/admin' || user)
                    .map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.path}
                          onClick={() => handlePageNav(item.path)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-almadekh-text hover:bg-almadekh-surface hover:text-almadekh-teal transition-all font-medium"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      )
                    })}
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
