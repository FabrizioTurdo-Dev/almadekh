import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { LoginForm } from './LoginForm'

/**
 * Gate de autenticación del panel.
 *
 * Los children NO se montan hasta que hay sesión válida. Esto importa porque
 * `AdminPage` abre una suscripción realtime a `orders` en un `useEffect`, y los
 * hooks corren antes de cualquier chequeo interno: si el gate no cortara acá,
 * un visitante anónimo en /admin abriría ese canal igual.
 *
 * La defensa real sigue siendo RLS del lado del servidor; esto evita el pedido
 * innecesario y no expone la UI del panel.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { initialized, initialize, user } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-almadekh-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-almadekh-teal border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-almadekh-muted">Verificando sesión...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <>{children}</>
}
