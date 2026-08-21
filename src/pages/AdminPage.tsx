import { lazy, useState, useEffect } from 'react'
import { LogOut, LayoutDashboard, ClipboardList, BarChart3, Settings, Calendar, ShoppingBag } from 'lucide-react'
import { TopNav } from '../components/layout/Navbar'
import { useAuthStore } from '../store/authStore'
import { initOrdersRealtime } from '../store/orderStore'
import { loadSettings, saveSetting } from '../lib/settings'
import { formatDisplayPhone } from '../lib/phone'

const Dashboard = lazy(() => import('../components/admin/Dashboard').then(m => ({ default: m.Dashboard })))
const MenuEditor = lazy(() => import('../components/admin/MenuEditor').then(m => ({ default: m.MenuEditor })))
const Analytics = lazy(() => import('../components/admin/Analytics').then(m => ({ default: m.Analytics })))
const EventEditor = lazy(() => import('../components/admin/EventEditor').then(m => ({ default: m.EventEditor })))
const OrderManager = lazy(() => import('../components/admin/OrderManager').then(m => ({ default: m.OrderManager })))

const tabs = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders', icon: ShoppingBag, label: 'Pedidos' },
  { id: 'menu', icon: ClipboardList, label: 'Menú' },
  { id: 'eventos', icon: Calendar, label: 'Eventos' },
  { id: 'analytics', icon: BarChart3, label: 'Stats' },
  { id: 'settings', icon: Settings, label: 'Ajustes' },
]

export function AdminPage() {
  const logout = useAuthStore((s) => s.logout)
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    const unsub = initOrdersRealtime()
    return () => unsub()
  }, [])

  return (
    <div className="bg-almadekh-bg flex flex-col">
      <TopNav />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 flex-col border-r border-almadekh-border bg-almadekh-bg/95 p-3 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-almadekh-teal/10 text-almadekh-teal'
                  : 'text-almadekh-subdued hover:text-almadekh-text hover:bg-almadekh-surface'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
        <div className="flex-1" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-almadekh-rose hover:bg-almadekh-rose/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-almadekh-bg/95 backdrop-blur-xl border-b border-almadekh-border px-5 h-12 flex items-center justify-between">
        <h2 className="text-sm font-bold text-almadekh-teal">Admin</h2>
        <div className="flex items-center gap-3">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="text-[11px] bg-almadekh-surface border border-almadekh-border rounded-lg px-2 py-1.5 text-almadekh-text font-medium"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
          <button
            onClick={handleLogout}
            className="text-almadekh-subdued hover:text-almadekh-rose transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-almadekh-bg/95 backdrop-blur-xl border-t border-almadekh-border pb-safe pt-1">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors px-3 py-1 ${
                  isActive ? 'text-almadekh-teal' : 'text-almadekh-subdued'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-14 md:pt-16 md:ml-56 px-5 pb-28 md:pb-6 max-w-5xl flex-1">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'menu' && <MenuEditor />}
        {activeTab === 'eventos' && <EventEditor />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  )
}

function SettingsPanel() {
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  // Se arma con el dominio en el que corre la app: antes era el literal
  // 'almadekh.com/menu', que quedaba mal en cualquier otro despliegue.
  const menuUrl = `${window.location.origin}/menu`

  useEffect(() => {
    loadSettings().then((s) => {
      setPhone(s.phone)
      setAddress(s.address)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await Promise.all([
      saveSetting('phone', phone),
      saveSetting('address', address),
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-serif font-bold text-almadekh-text">Configuración</h2>

      <div className="bg-almadekh-surface border border-almadekh-border rounded-xl p-4">
        <h3 className="text-xs font-semibold text-almadekh-text mb-3">Contacto</h3>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-almadekh-muted block mb-1">WhatsApp (solo números, con código de país)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="5491169720415"
              className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text"
            />
            <span className="text-[10px] text-almadekh-subdued mt-1 block">
              Se muestra como: {formatDisplayPhone(phone)}
            </span>
          </div>
          <div>
            <label className="text-[10px] text-almadekh-muted block mb-1">Dirección</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="La Pista 250, Ingeniero Maschwitz"
              className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-almadekh-teal hover:bg-almadekh-teal-light text-almadekh-bg font-bold py-2.5 rounded-xl transition-all text-sm disabled:opacity-50"
          >
            {saving ? 'Guardando...' : saved ? 'Guardado ✓' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <div className="bg-almadekh-surface border border-almadekh-border rounded-xl p-4">
        <h3 className="text-xs font-semibold text-almadekh-text mb-3">Menú QR</h3>
        <p className="text-xs text-almadekh-muted mb-3">
          Compartí el link del menú digital con tus clientes.
        </p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={menuUrl.replace(/^https?:\/\//, '')}
            className="flex-1 bg-almadekh-surface border border-almadekh-border rounded-lg px-3 py-2 text-xs text-almadekh-text"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(menuUrl)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="bg-almadekh-teal hover:bg-almadekh-teal-light text-almadekh-bg text-xs font-bold px-3 py-2 rounded-lg transition-all"
          >
            {copied ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="bg-almadekh-surface border border-almadekh-border rounded-xl p-4">
        <h3 className="text-xs font-semibold text-almadekh-text mb-3">Sistema</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-almadekh-muted">Versión</span>
            <span className="text-almadekh-text">1.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-almadekh-muted">Almacenamiento</span>
            <span className="text-almadekh-text">Supabase</span>
          </div>
        </div>
      </div>
    </div>
  )
}