import { create } from 'zustand'
import type { Order } from '../types'
import { supabase } from '../lib/supabase'
import { createRealtimeChannel } from '../lib/realtime'

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

const subscribeToRealtime = createRealtimeChannel('orders-changes', ['orders'])

/**
 * Filtros de fecha puros.
 *
 * Viven fuera del store para que `Dashboard` pueda usarlos dentro de un
 * `useMemo` con `orders` como unica dependencia. Como metodos del store leian
 * `get().orders` por dentro, y el `useMemo` declaraba una dependencia que el
 * linter no podia verificar.
 */
export function ordersToday(orders: Order[]): Order[] {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return orders.filter((o) => new Date(o.created_at) >= startOfDay)
}

export function ordersThisWeek(orders: Order[]): Order[] {
  const now = new Date()
  const startOfWeek = new Date(now)
  // getDay() da 0 para domingo: la semana arrancaba en domingo. Aca se corre
  // al lunes, que es como se cuenta la semana comercial.
  const daysSinceMonday = (now.getDay() + 6) % 7
  startOfWeek.setDate(now.getDate() - daysSinceMonday)
  startOfWeek.setHours(0, 0, 0, 0)
  return orders.filter((o) => new Date(o.created_at) >= startOfWeek)
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

  getTodayOrders: () => ordersToday(get().orders),
  getThisWeekOrders: () => ordersThisWeek(get().orders),
}))

export function initOrdersRealtime() {
  return subscribeToRealtime(() => {
    useOrderStore.getState().fetchOrders()
  })
}
