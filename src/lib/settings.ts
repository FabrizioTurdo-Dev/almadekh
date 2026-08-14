import { supabase } from './supabase'

export interface Settings {
  phone: string
  address: string
}

const DEFAULTS: Settings = {
  phone: '5491169720415',
  address: 'La Pista 250, Ingeniero Maschwitz',
}

const cache = {
  save(settings: Settings) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('almadekh_settings', JSON.stringify(settings))
    }
  },
  load(): Settings | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('almadekh_settings')
    if (!stored) return null
    try {
      return JSON.parse(stored) as Settings
    } catch {}
    return null
  },
}

let loaded = false
let current: Settings = { ...DEFAULTS }

export async function loadSettings(): Promise<Settings> {
  try {
    const { data, error } = await supabase.from('settings').select('key, value')
    if (error) throw error

    const map = new Map<string, string>()
    for (const row of data || []) {
      map.set(row.key, row.value)
    }

    current = {
      phone: map.get('phone') || DEFAULTS.phone,
      address: map.get('address') || DEFAULTS.address,
    }
    cache.save(current)
    loaded = true
  } catch {
    const fromCache = cache.load()
    if (fromCache) current = fromCache
  }
  return current
}

export function getSettings(): Settings {
  if (loaded) return current
  const fromCache = cache.load()
  if (fromCache) return fromCache
  return { ...DEFAULTS }
}

export function getPhone(): string {
  return getSettings().phone
}

export function getDisplayPhone(): string {
  const raw = getPhone()
  // Strip country code (549 or 54) for display
  let local = raw
  if (raw.startsWith('549')) local = raw.slice(3)
  else if (raw.startsWith('54')) local = raw.slice(2)
  // Format: 011 6972-XXXX
  if (local.length === 10) {
    return `${local.slice(0, 3)} ${local.slice(3, 7)}-${local.slice(7)}`
  }
  return raw
}

export function getTelPhone(): string {
  const raw = getPhone()
  // For tel: links, strip country code
  if (raw.startsWith('549')) return raw.slice(3)
  if (raw.startsWith('54')) return raw.slice(2)
  return raw
}

export async function saveSetting(key: string, value: string): Promise<void> {
  try {
    await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' })
  } catch (e) {
    console.error('Error saving setting:', e)
  }
  // Update local cache
  current = { ...current, [key]: value } as Settings
  cache.save(current)
}

export function getAddress(): string {
  return getSettings().address
}
