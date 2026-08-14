import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  attempts: number
  lockedUntil: number
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  attempts: 0,
  lockedUntil: 0,

  initialize: async () => {
    if (get().initialized) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user ?? null, initialized: true })

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null })
      })
    } catch {
      set({ initialized: true })
    }
  },

  login: async (email, password) => {
    const { lockedUntil, attempts } = get()
    if (lockedUntil > Date.now()) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 60000)
      return { error: `Demasiados intentos. Probá en ${remaining} min` }
    }

    set({ loading: true })
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        const newAttempts = attempts + 1
        const newLocked = newAttempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0
        set({ loading: false, attempts: newAttempts, lockedUntil: newLocked })
        if (newAttempts >= MAX_ATTEMPTS) {
          return { error: 'Demasiados intentos. Probá en 15 minutos' }
        }
        return { error: 'Credenciales incorrectas' }
      }
      set({ loading: false, attempts: 0, lockedUntil: 0 })
      return {}
    } catch {
      set({ loading: false })
      return { error: 'Error de conexión' }
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
