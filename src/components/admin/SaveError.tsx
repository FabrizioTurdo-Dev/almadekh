import { AlertTriangle } from 'lucide-react'

/**
 * Aviso de guardado fallido.
 *
 * Los stores aplican el cambio de forma optimista, asi que sin esto un fallo
 * de red o de RLS dejaba el plato o el evento "guardado" en pantalla sin que
 * hubiera llegado al servidor.
 */
export function SaveError({ message }: { message: string }) {
  if (!message) return null
  return (
    <div
      role="alert"
      className="flex items-start gap-2 mb-4 rounded-xl border border-status-pending/40 bg-status-pending/10 px-3.5 py-2.5"
    >
      <AlertTriangle className="w-4 h-4 text-status-pending shrink-0 mt-0.5" />
      <p className="text-[11px] leading-snug text-status-pending">{message}</p>
    </div>
  )
}
