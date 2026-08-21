import { supabase } from './supabase'
import type { OrderItem } from '../types'

export interface CreateOrderInput {
  customerName: string
  deliveryType: string
  notes?: string
  items: { id: string; qty: number }[]
}

export interface CreateOrderResult {
  id: string
  total: number
  lines: OrderItem[]
}

/**
 * Registra el pedido a traves de la Edge Function `create-order`.
 *
 * Solo se mandan ids y cantidades: los precios y el total los calcula el
 * servidor leyendo `menu_items`. El cliente nunca decide cuanto sale un pedido.
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<{ data: CreateOrderResult } | { error: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: {
        customer_name: input.customerName,
        delivery_type: input.deliveryType,
        notes: input.notes || undefined,
        items: input.items,
      },
    })

    if (error) {
      // Las Edge Functions devuelven el detalle en el cuerpo de la respuesta
      const context = (error as { context?: Response }).context
      if (context && typeof context.json === 'function') {
        try {
          const body = await context.json()
          if (body?.error) return { error: body.error as string }
        } catch {
          // sin cuerpo util, se usa el mensaje generico
        }
      }
      return { error: 'No pudimos registrar el pedido. Intentá de nuevo.' }
    }

    if (!data || typeof data.total !== 'number' || !Array.isArray(data.lines)) {
      return { error: 'No pudimos registrar el pedido. Intentá de nuevo.' }
    }

    return { data: data as CreateOrderResult }
  } catch {
    return { error: 'Error de conexión. Revisá tu internet e intentá de nuevo.' }
  }
}
