import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useMenuStore } from './store/menuStore'
import { useEventStore } from './store/eventStore'
import { SplashScreen } from './components/layout/SplashScreen'
import { VintageBackground } from './components/decorative/VintageBackground'
import { ProtectedRoute } from './components/admin/ProtectedRoute'

const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })))
const MenuPage = lazy(() => import('./pages/MenuPage').then(m => ({ default: m.MenuPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

const SPLASH_SEEN_KEY = 'almadekh_splash_seen'

export default function App() {
  const loadMenu = useMenuStore((s) => s.loadFromStorage)
  const loadEvents = useEventStore((s) => s.loadFromStorage)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem(SPLASH_SEEN_KEY)
    if (hasSeenSplash) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashFinish = () => {
    sessionStorage.setItem(SPLASH_SEEN_KEY, 'true')
    setShowSplash(false)
  }

  useEffect(() => {
    const unsubMenu = loadMenu()
    const unsubEvents = loadEvents()
    return () => {
      unsubMenu()
      unsubEvents()
    }
  }, [loadMenu, loadEvents])

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <BrowserRouter>
        <VintageBackground>
          <Suspense fallback={
            <div className="min-h-screen bg-almadekh-bg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-baroque-gold/30 border-t-baroque-gold rounded-full animate-spin" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </VintageBackground>
      </BrowserRouter>
    </>
  )
}