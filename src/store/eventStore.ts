import { create } from 'zustand'
import type { Event as EventType } from '../types'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

const DEFAULT_EVENTS: EventType[] = [
  {
    id: 'evt1',
    title: 'Noche de Música en Vivo',
    date: '2026-08-22',
    time: '20:00',
    description: 'Una velada especial con artistas locales en nuestro salón. Música, buena comida y el mejor ambiente.',
    type: 'future',
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt2',
    title: 'Exposición de Arte: "Colores del Alma"',
    date: '2026-07-15',
    time: '18:00',
    description: 'Muestra colectiva de artistas de Maschwitz con obras en óleo, acrílico y acuarela.',
    type: 'past',
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt3',
    title: 'Taller de Cerámica',
    date: '2026-08-10',
    time: '15:00',
    description: 'Taller abierto a la comunidad. No se necesita experiencia previa. Materiales incluidos.',
    type: 'future',
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt4',
    title: 'Brunch de Fin de Semana',
    date: '2026-06-30',
    description: 'Brunch especial con degustación de nuestra pastelería artesanal y café de especialidad.',
    type: 'past',
    created_at: new Date().toISOString(),
  },
]

interface EventState {
  events: EventType[]
  setEvents: (events: EventType[]) => void
  addEvent: (event: EventType) => void
  updateEvent: (id: string, data: Partial<EventType>) => void
  deleteEvent: (id: string) => void
  loadFromStorage: () => () => void
}

const cache = {
  save(events: EventType[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('almadekh_events_data', JSON.stringify(events))
    }
  },
  load(): EventType[] | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('almadekh_events_data')
    if (!stored) return null
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {}
    return null
  },
}

async function pullEventsFromSupabase(): Promise<EventType[] | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[EventStore] Supabase query error:', error.message, error.details)
    return null
  }
  if (!data || data.length === 0) {
    console.warn('[EventStore] No events found in Supabase')
    return null
  }
  return data.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time || undefined,
    description: e.description,
    image_url: e.image_url || undefined,
    type: e.type as 'past' | 'future',
    created_at: e.created_at,
  }))
}

let realtimeChannel: RealtimeChannel | null = null

function subscribeToRealtime(onChange: () => void) {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }

  realtimeChannel = supabase
    .channel('events-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'events' },
      () => onChange()
    )
    .subscribe()

  return () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
    }
  }
}

export const useEventStore = create<EventState>((set, get) => ({
  events: DEFAULT_EVENTS,
  setEvents: async (events) => {
    set({ events })
    cache.save(events)
    try {
      const { error } = await supabase.from('events').upsert(
        events.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time || null,
          description: e.description,
          image_url: e.image_url || null,
          type: e.type,
        })),
        { onConflict: 'id', ignoreDuplicates: false }
      )
      if (error) throw error
    } catch (e) {
      console.error('[EventStore] Supabase sync error:', e)
    }
  },
  addEvent: async (event) => {
    const updated = [...get().events, event]
    set({ events: updated })
    cache.save(updated)
    try {
      const { error } = await supabase.from('events').insert({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time || null,
        description: event.description,
        image_url: event.image_url || null,
        type: event.type,
      })
      if (error) throw error
    } catch (e) {
      console.error('[EventStore] Supabase insert error:', e)
    }
  },
  updateEvent: async (id, data) => {
    const updated = get().events.map((e) =>
      e.id === id ? { ...e, ...data } : e
    )
    set({ events: updated })
    cache.save(updated)
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: data.title,
          date: data.date,
          time: data.time || null,
          description: data.description,
          image_url: data.image_url || null,
          type: data.type,
        })
        .eq('id', id)
      if (error) throw error
    } catch (e) {
      console.error('[EventStore] Supabase update error:', e)
    }
  },
  deleteEvent: async (id) => {
    const updated = get().events.filter((e) => e.id !== id)
    set({ events: updated })
    cache.save(updated)
    try {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    } catch (e) {
      console.error('[EventStore] Supabase delete error:', e)
    }
  },
  loadFromStorage: () => {
    const refreshFromRemote = async () => {
      try {
        const fromRemote = await pullEventsFromSupabase()
        if (fromRemote) {
          set({ events: fromRemote })
          cache.save(fromRemote)
        }
      } catch (e) {
        console.error('[EventStore] Supabase fetch error:', e)
      }
    }

    // Initial load
    refreshFromRemote()

    // Subscribe to realtime changes
    const unsubscribe = subscribeToRealtime(() => {
      refreshFromRemote()
    })

    return unsubscribe
  },
}))
