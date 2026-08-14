import { create } from 'zustand'
import type { Category } from '../types'
import { DEFAULT_MENU } from '../data/menuData'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface MenuState {
  categories: Category[]
  activeCategory: number
  setCategories: (cats: Category[]) => void
  setActiveCategory: (idx: number) => void
  loadFromStorage: () => () => void
}

async function pushToSupabase() {
  const cats = useMenuStore.getState().categories
  const categoriesData = cats.map((c, i) => ({
    id: c.id,
    name: c.name,
    sort_order: c.sort_order ?? i,
    is_special: c.is_special ?? false,
  }))

  const itemsData = cats.flatMap((c) =>
    c.items.map((item, i) => ({
      id: item.id,
      category_id: c.id,
      name: item.name,
      description: item.desc,
      price: item.price,
      image_url: item.image_url || null,
      is_available: item.is_available ?? true,
      sort_order: item.sort_order ?? i,
    }))
  )

  const { error: catErr } = await supabase.from('categories').upsert(categoriesData, {
    onConflict: 'id',
    ignoreDuplicates: false,
  })
  if (catErr) throw catErr

  if (itemsData.length > 0) {
    const { error: itemErr } = await supabase.from('menu_items').upsert(itemsData, {
      onConflict: 'id',
      ignoreDuplicates: false,
    })
    if (itemErr) throw itemErr
  }
}

async function pullFromSupabase(): Promise<Category[] | null> {
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (catErr) {
    console.error('[MenuStore] Categories query error:', catErr.message, catErr.details)
    return null
  }
  if (!cats || cats.length === 0) {
    console.warn('[MenuStore] No categories found in Supabase')
    return null
  }

  const { data: items, error: itemErr } = await supabase
    .from('menu_items')
    .select('*')
    .order('sort_order')

  if (itemErr) {
    console.error('[MenuStore] Menu items query error:', itemErr.message, itemErr.details)
    return null
  }
  if (!items) return null

  const itemsByCategory = new Map<string, typeof items>()
  for (const item of items) {
    const list = itemsByCategory.get(item.category_id) || []
    list.push(item)
    itemsByCategory.set(item.category_id, list)
  }

  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    sort_order: c.sort_order,
    is_special: c.is_special ?? false,
    items: (itemsByCategory.get(c.id) || []).map((item) => ({
      id: item.id,
      name: item.name,
      desc: item.description,
      price: item.price,
      image_url: item.image_url || undefined,
      is_available: item.is_available,
      sort_order: item.sort_order,
    })),
  }))
}

const cache = {
  save(cats: Category[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('almadekh_menu_data', JSON.stringify(cats))
    }
  },
  load(): Category[] | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('almadekh_menu_data')
    if (!stored) return null
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {}
    return null
  },
}

let realtimeChannel: RealtimeChannel | null = null

function subscribeToRealtime(onChange: () => void) {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }

  realtimeChannel = supabase
    .channel('menu-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'categories' },
      () => onChange()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'menu_items' },
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

export const useMenuStore = create<MenuState>((set) => ({
  categories: DEFAULT_MENU,
  activeCategory: 0,
  setCategories: async (cats) => {
    set({ categories: cats })
    cache.save(cats)
    try {
      await pushToSupabase()
    } catch (e) {
      console.error('[MenuStore] Supabase sync error:', e)
    }
  },
  setActiveCategory: (idx) => set({ activeCategory: idx }),
  loadFromStorage: () => {
    const refreshFromRemote = async () => {
      try {
        const fromRemote = await pullFromSupabase()
        if (fromRemote) {
          set({ categories: fromRemote })
          cache.save(fromRemote)
        }
      } catch (e) {
        console.error('[MenuStore] Supabase fetch error:', e)
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
