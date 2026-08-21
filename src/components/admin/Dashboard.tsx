import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useOrderStore, ordersToday, ordersThisWeek } from '../../store/orderStore'
import { formatPrice } from '../../lib/format'

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function getHourLabel(dateStr: string) {
  const h = new Date(dateStr).getHours()
  return `${h}:00`
}

export function Dashboard() {
  const { orders, loading, fetchOrders } = useOrderStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const todayOrders = useMemo(() => ordersToday(orders), [orders])
  const weekOrders = useMemo(() => ordersThisWeek(orders), [orders])

  // Stats
  const totalToday = todayOrders.length
  const revenueToday = todayOrders.reduce((sum, o) => sum + o.total, 0)

  const topDish = useMemo(() => {
    const freq: Record<string, number> = {}
    for (const o of weekOrders) {
      for (const item of o.items) {
        freq[item.name] = (freq[item.name] || 0) + item.qty
      }
    }
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] || '—'
  }, [weekOrders])

  const peakHour = useMemo(() => {
    const hourFreq: Record<string, number> = {}
    for (const o of todayOrders) {
      const label = getHourLabel(o.created_at)
      hourFreq[label] = (hourFreq[label] || 0) + 1
    }
    const sorted = Object.entries(hourFreq).sort((a, b) => b[1] - a[1])
    if (sorted.length === 0) return '—'
    return `${sorted[0][0]}`
  }, [todayOrders])

  // Weekly chart data (last 7 days)
  const weeklyChart = useMemo(() => {
    const now = new Date()
    const days: { label: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const next = new Date(d)
      next.setDate(d.getDate() + 1)
      const count = orders.filter((o) => {
        const t = new Date(o.created_at)
        return t >= d && t < next
      }).length
      days.push({ label: DAY_NAMES[d.getDay()], count })
    }
    return days
  }, [orders])

  const maxWeekCount = Math.max(...weeklyChart.map((d) => d.count), 1)

  const stats = [
    { num: totalToday.toString(), label: 'Pedidos Hoy' },
    { num: formatPrice(revenueToday), label: 'Ventas Hoy' },
    { num: topDish, label: 'Más pedido' },
    { num: peakHour, label: 'Horario pico' },
  ]

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-serif font-bold text-almadekh-text">Dashboard</h2>
        <span className="text-[11px] text-almadekh-muted">
          {loading ? 'Cargando...' : `Hoy · ${totalToday} pedidos`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-almadekh-surface border border-almadekh-border rounded-xl p-4 text-center"
          >
            <div className="text-xl font-bold text-almadekh-teal truncate">{s.num}</div>
            <div className="text-[10px] text-almadekh-muted uppercase tracking-wider mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-almadekh-surface border border-almadekh-border rounded-xl p-4 mb-5 h-36 flex flex-col justify-center items-center">
        <div className="flex items-end gap-2 w-full max-w-[260px] h-20">
          {weeklyChart.map((d, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md transition-all"
              style={{
                height: `${d.count > 0 ? (d.count / maxWeekCount) * 100 : 4}%`,
                background: `rgba(184,134,11,${0.25 + i * 0.09})`,
              }}
            />
          ))}
        </div>
        <span className="text-[10px] text-almadekh-muted mt-3">Pedidos esta semana</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-almadekh-text">Últimos pedidos</h3>
      </div>

      {todayOrders.length === 0 ? (
        <p className="text-center text-almadekh-muted text-sm py-8 italic">
          {loading ? 'Cargando pedidos...' : 'No hay pedidos hoy todavía.'}
        </p>
      ) : (
        <div className="space-y-1.5">
          {todayOrders.slice(0, 8).map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between bg-almadekh-surface border border-almadekh-border rounded-xl px-3.5 py-2.5 text-xs"
            >
              <span className="font-medium text-almadekh-text min-w-[80px]">{o.customer_name}</span>
              <span className="text-almadekh-muted flex-1 truncate px-2">
                {o.items.map((it) => `${it.qty}x ${it.name}`).join(', ')}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  o.status === 'ready'
                    ? 'bg-status-ready/15 text-status-ready'
                    : o.status === 'confirmed'
                    ? 'bg-status-confirmed/15 text-status-confirmed'
                    : o.status === 'preparation'
                    ? 'bg-status-prep/15 text-status-prep'
                    : 'bg-status-pending/15 text-status-pending'
                }`}
              >
                {o.status === 'ready' ? 'Listo' : o.status === 'confirmed' ? 'Confirmado' : o.status === 'preparation' ? 'Preparación' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
