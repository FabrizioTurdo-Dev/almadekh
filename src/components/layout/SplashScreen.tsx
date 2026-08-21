import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const finishedRef = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true
        setShowSplash(false)
        onFinish()
      }
    }, 3500)
    return () => clearTimeout(timer)
  }, [onFinish])

  const handleVideoEnd = () => {
    if (!finishedRef.current) {
      finishedRef.current = true
      setTimeout(() => {
        setShowSplash(false)
        onFinish()
      }, 300)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-baroque-dark"
          role="presentation"
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover md:object-contain"
            autoPlay
            playsInline
            muted
            onEnded={handleVideoEnd}
            poster="/images/hero.jpg"
            preload="auto"
          >
            <source src={isMobile ? '/preloadVertical.mp4' : '/preloadHorizontal.mp4'} type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
