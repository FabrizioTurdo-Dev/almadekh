import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { initialized, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-almadekh-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-almadekh-teal border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-almadekh-muted">Verificando sesión...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
