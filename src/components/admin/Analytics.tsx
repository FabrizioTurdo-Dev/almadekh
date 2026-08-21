import { useEffect, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useOrderStore } from '../../store/orderStore'
import { useMenuStore } from '../../store/menuStore'
import { formatPrice } from '../../lib/format'

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function Analytics() {
  const { orders, fetchOrders } = useOrderStore()
  const { categories } = useMenuStore()

  // `categories` ya lo mantiene al dia la suscripcion que abre `App`. Llamar
  // aca a `loadFromStorage()` derribaba ese canal y creaba otro, y ademas se
  // descartaba la funcion de baja que devuelve.
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Build category lookup: item name -> category name
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const cat of categories) {
      for (const item of cat.items) {
        map[item.name] = cat.name
      }
    }
    return map
  }, [categories])

  // Weekly data (last 7 days)
  const weeklyData = useMemo(() => {
    const now = new Date()
    const days: { day: string; orders: number; revenue: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const next = new Date(d)
      next.setDate(d.getDate() + 1)
      const dayOrders = orders.filter((o) => {
        const t = new Date(o.created_at)
        return t >= d && t < next
      })
      days.push({
        day: DAY_NAMES[d.getDay()],
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      })
    }
    return days
  }, [orders])

  // Category sales
  const categoryData = useMemo(() => {
    const catCount: Record<string, number> = {}
    for (const o of orders) {
      for (const item of o.items) {
        const catName = categoryMap[item.name] || 'Otros'
        catCount[catName] = (catCount[catName] || 0) + item.qty
      }
    }
    return Object.entries(catCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [orders, categoryMap])

  const maxCatValue = Math.max(...categoryData.map((c) => c.value), 1)

  return (
    <div className="pb-28">
      <h2 className="text-lg font-serif font-bold text-almadekh-text mb-5">Analytics</h2>

      <div className="bg-almadekh-surface border border-almadekh-border rounded-xl p-4 mb-5">
        <h3 className="text-xs font-semibold text-almadekh-text mb-3">Pedidos por día</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,134,11,0.12)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#C9A876' }} />
            <YAxis tick={{ fontSize: 10, fill: '#C9A876' }} />
            <Tooltip
              contentStyle={{
                background: '#1a0f0c',
                border: '1px solid rgba(184,134,11,0.25)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#E8DCC8' }}
            />
            <Line type="monotone" dataKey="orders" stroke="#B8860B" strokeWidth={2} dot={{ fill: '#d4a832', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-almadekh-surface border border-almadekh-border rounded-xl p-4 mb-5">
        <h3 className="text-xs font-semibold text-almadekh-text mb-3">Ingresos por día</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,134,11,0.12)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#C9A876' }} />
            <YAxis tick={{ fontSize: 10, fill: '#C9A876' }} />
            <Tooltip
              contentStyle={{
                background: '#1a0f0c',
                border: '1px solid rgba(184,134,11,0.25)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#E8DCC8' }}
              formatter={(value) => {
                if (typeof value === 'number') return [formatPrice(value), 'Ingresos']
                return [value, 'Ingresos']
              }}
            />
            <Bar dataKey="revenue" fill="#B8860B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-almadekh-surface border border-almadekh-border rounded-xl p-4">
        <h3 className="text-xs font-semibold text-almadekh-text mb-3">Categorías más vendidas</h3>
        {categoryData.length === 0 ? (
          <p className="text-center text-almadekh-muted text-sm py-6 italic">Sin datos aún.</p>
        ) : (
          <div className="space-y-2.5">
            {categoryData.map((cat) => {
              const pct = (cat.value / maxCatValue) * 100
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-almadekh-muted">{cat.name}</span>
                    <span className="text-almadekh-teal font-semibold">{cat.value}</span>
                  </div>
                  <div className="h-1.5 bg-almadekh-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-almadekh-teal to-almadekh-rose transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
