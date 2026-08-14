import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useOrderStore } from '../../store/orderStore'
import { formatPrice } from '../../lib/format'
import type { Order } from '../../types'

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparation: 'Preparación',
  ready: 'Listo',
  cancelled: 'Cancelado',
}

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-almadekh-rose/15 text-almadekh-rose',
  confirmed: 'bg-almadekh-gold/15 text-almadekh-gold',
  preparation: 'bg-blue-100 text-blue-600',
  ready: 'bg-almadekh-teal/15 text-almadekh-teal',
  cancelled: 'bg-gray-100 text-gray-400',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `${mins}min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

export function OrderManager() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrderStore()
  const [filter, setFilter] = useState<'all' | Order['status']>('all')

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const nextStatus: Record<Order['status'], Order['status'] | null> = {
    pending: 'confirmed',
    confirmed: 'preparation',
    preparation: 'ready',
    ready: null,
    cancelled: null,
  }

  const canCancel = (status: Order['status']) => status !== 'ready' && status !== 'cancelled'

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-almadekh-text">Pedidos</h2>
          <p className="text-[11px] text-almadekh-muted mt-0.5">
            {loading ? 'Cargando...' : `${orders.length} pedidos totales`}
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-4 pb-1" style={{ scrollbarWidth: 'none' }}>
        {(['all', 'pending', 'confirmed', 'preparation', 'ready', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-semibold transition-all ${
              filter === f
                ? 'bg-almadekh-teal text-white'
                : 'bg-almadekh-surface text-almadekh-subdued border border-almadekh-border hover:bg-almadekh-cream'
            }`}
          >
            {f === 'all' ? 'Todos' : STATUS_LABELS[f]} ({f === 'all' ? orders.length : orders.filter((o) => o.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-almadekh-muted text-sm py-12 italic">
          {loading ? 'Cargando pedidos...' : 'No hay pedidos para mostrar.'}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((o, i) => {
            const ns = nextStatus[o.status]
            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white shadow-sm border border-almadekh-border rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-almadekh-text">{o.customer_name}</span>
                    <span className="text-[10px] text-almadekh-subdued">{timeAgo(o.created_at)}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}
                  >
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>

                <div className="text-xs text-almadekh-muted mb-1.5">
                  {o.items.map((it) => `${it.qty}x ${it.name}`).join(' · ')}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-almadekh-muted">
                    <span className="font-medium text-almadekh-text">{o.delivery_type}</span>
                    {o.notes && <span className="ml-2">· {o.notes}</span>}
                  </div>
                  <span className="text-sm font-bold text-almadekh-teal font-serif">
                    {formatPrice(o.total)}
                  </span>
                </div>

                {ns && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updateOrderStatus(o.id, ns)}
                      className="flex-1 text-[11px] font-semibold py-2 rounded-lg bg-almadekh-surface hover:bg-almadekh-teal/10 text-almadekh-teal border border-almadekh-border transition-all"
                    >
                      Marcar como {STATUS_LABELS[ns]}
                    </button>
                    {canCancel(o.status) && (
                      <button
                        onClick={() => updateOrderStatus(o.id, 'cancelled')}
                        className="text-[11px] font-semibold py-2 px-3 rounded-lg bg-almadekh-surface hover:bg-almadekh-rose/10 text-almadekh-rose border border-almadekh-border transition-all"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
