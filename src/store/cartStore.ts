import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, MenuItem } from '../types'

interface CartState {
  items: Record<string, CartItem>
  addItem: (item: MenuItem, qty?: number) => void
  removeItem: (itemId: string) => void
  updateQty: (itemId: string, delta: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (item, qty = 1) => {
        set((state) => {
          const existing = state.items[item.id]
          if (existing) {
            return {
              items: {
                ...state.items,
                [item.id]: { ...existing, qty: existing.qty + qty },
              },
            }
          }
          return { items: { ...state.items, [item.id]: { item, qty } } }
        })
      },
      removeItem: (itemId) => {
        set((state) => {
          const { [itemId]: _, ...rest } = state.items
          return { items: rest }
        })
      },
      updateQty: (itemId, delta) => {
        set((state) => {
          const existing = state.items[itemId]
          if (!existing) return state
          const newQty = existing.qty + delta
          if (newQty <= 0) {
            const { [itemId]: _, ...rest } = state.items
            return { items: rest }
          }
          return {
            items: {
              ...state.items,
              [itemId]: { ...existing, qty: newQty },
            },
          }
        })
      },
      clearCart: () => set({ items: {} }),
      totalItems: () => {
        return Object.values(get().items).reduce((sum, ci) => sum + ci.qty, 0)
      },
      totalPrice: () => {
        return Object.values(get().items).reduce(
          (sum, ci) => sum + ci.item.price * ci.qty,
          0
        )
      },
    }),
    { name: 'almadekh_cart' }
  )
)
