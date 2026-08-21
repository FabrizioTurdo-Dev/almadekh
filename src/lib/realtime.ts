import { supabase } from './supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Suscripcion realtime compartida, contada por referencias.
 *
 * Cada store guardaba su canal en una variable de modulo y lo pisaba en cada
 * llamada: si dos componentes se suscribian al mismo canal, el segundo
 * derribaba el del primero (abrir Analytics mataba la suscripcion al menu que
 * abre `App`). Aca el canal se crea una sola vez y se cierra recien cuando se
 * da de baja el ultimo suscriptor.
 */
export function createRealtimeChannel(name: string, tables: readonly string[]) {
  let channel: RealtimeChannel | null = null
  const listeners = new Set<() => void>()

  const notify = () => {
    for (const listener of listeners) listener()
  }

  return function subscribe(onChange: () => void): () => void {
    listeners.add(onChange)

    if (!channel) {
      let pending = supabase.channel(name)
      for (const table of tables) {
        pending = pending.on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          notify
        )
      }
      channel = pending.subscribe()
    }

    let released = false
    return () => {
      // La baja tiene que ser idempotente: React 19 en StrictMode monta,
      // desmonta y vuelve a montar los efectos en desarrollo.
      if (released) return
      released = true
      listeners.delete(onChange)
      if (listeners.size === 0 && channel) {
        supabase.removeChannel(channel)
        channel = null
      }
    }
  }
}
