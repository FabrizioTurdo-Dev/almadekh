import { create } from 'zustand'
import type { Order } from '../types'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface OrderState {
  orders: Order[]
  loading: boolean
  fetchOrders: () => Promise<void>
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>
  getTodayOrders: () => Order[]
  getThisWeekOrders: () => Order[]
}

const cache = {
  save(orders: Order[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('almadekh_orders_data', JSON.stringify(orders))
    }
  },
  load(): Order[] | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('almadekh_orders_data')
    if (!stored) return null
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
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
    .channel('orders-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
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

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    customer_name: row.customer_name as string,
    items: row.items as Order['items'],
    total: row.total as number,
    delivery_type: row.delivery_type as string,
    notes: (row.notes as string) || undefined,
    status: row.status as Order['status'],
    created_at: row.created_at as string,
  }
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: cache.load() || [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const orders = (data || []).map(rowToOrder)
      set({ orders })
      cache.save(orders)
    } catch (e) {
      console.error('Error fetching orders:', e)
    } finally {
      set({ loading: false })
    }
  },

  updateOrderStatus: async (id, status) => {
    // Optimistic update
    const prev = get().orders
    set({ orders: prev.map((o) => (o.id === id ? { ...o, status } : o)) })

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)

      if (error) throw error
    } catch (e) {
      console.error('Error updating order:', e)
      set({ orders: prev })
    }
  },

  getTodayOrders: () => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return get().orders.filter((o) => new Date(o.created_at) >= startOfDay)
  },

  getThisWeekOrders: () => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    return get().orders.filter((o) => new Date(o.created_at) >= startOfWeek)
  },
}))

export function initOrdersRealtime() {
  return subscribeToRealtime(() => {
    useOrderStore.getState().fetchOrders()
  })
}
