import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { buildWhatsAppMessage, buildWhatsAppUrl, openWhatsApp, reserveWhatsAppTab } from '../../lib/whatsapp'
import { formatPrice } from '../../lib/format'
import { createOrder } from '../../lib/orders'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: Props) {
  const { items, updateQty, totalItems, totalPrice, clearCart } = useCartStore()
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  // Enlace de rescate: si el navegador bloquea la pestana, el pedido ya quedo
  // registrado y hay que dejarle al cliente una forma manual de abrir el chat.
  const [fallbackUrl, setFallbackUrl] = useState('')

  const cartItems = Object.values(items)
  const total = totalPrice()

  const handleSend = async () => {
    if (!name.trim() || !type || cartItems.length === 0 || sending) return

    // Antes de cualquier await: es el unico momento en que iOS deja abrir
    // una pestana. Ver `reserveWhatsAppTab`.
    const waTab = reserveWhatsAppTab()

    setSending(true)
    setError('')
    setFallbackUrl('')

    // Solo se mandan ids y cantidades: el servidor calcula precios y total.
    const result = await createOrder({
      customerName: name.trim(),
      deliveryType: type,
      notes: notes.trim(),
      items: cartItems.map((ci) => ({ id: ci.item.id, qty: ci.qty })),
    })

    setSending(false)

    if ('error' in result) {
      // No se abre WhatsApp ni se vacía el carrito: el pedido no quedó registrado.
      waTab?.close()
      setError(result.error)
      return
    }

    // El mensaje usa las líneas y el total que devolvió el servidor,
    // así lo que ve el cliente coincide con lo que quedó guardado.
    const msg = buildWhatsAppMessage(
      result.data.lines,
      name.trim(),
      type,
      notes.trim(),
      result.data.total
    )

    if (!openWhatsApp(msg, waTab)) {
      // El pedido SI quedo registrado: no se vacia el carrito ni se cierra la
      // hoja hasta que el cliente use el enlace.
      setFallbackUrl(buildWhatsAppUrl(msg))
      return
    }

    clearCart()
    onClose()
    setName('')
    setType('')
    setNotes('')
  }

  const handleFallbackUsed = () => {
    setFallbackUrl('')
    clearCart()
    onClose()
    setName('')
    setType('')
    setNotes('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-baroque-dark/98 backdrop-blur-2xl rounded-t-3xl border-t-2 border-baroque-gold/20 max-h-[85dvh] sm:max-h-[80vh] flex flex-col md:left-auto md:top-0 md:bottom-0 md:right-0 md:w-96 md:max-h-none md:rounded-none md:rounded-l-2xl"
          >
            <div className="w-9 h-1 bg-baroque-gold/30 rounded-full mx-auto mt-3 mb-2 md:hidden" />
            <div className="flex items-center justify-between px-5 pb-3 pt-4 border-b border-baroque-gold/15">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-baroque-gold" />
                <h3 className="text-lg font-bold text-baroque-cream" style={{ fontFamily: '"Cinzel", serif' }}>Tu Pedido</h3>
              </div>
              <button onClick={onClose} aria-label="Cerrar carrito" className="text-baroque-cream-muted/60 hover:text-baroque-cream transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1">
              {cartItems.length === 0 ? (
                <p className="text-center text-baroque-cream-muted/60 text-sm py-8 italic">
                  El carrito está vacío.<br />Seleccioná platos para comenzar.
                </p>
              ) : (
                cartItems.map((ci) => (
                  <div key={ci.item.id} className="flex items-center justify-between py-2.5 border-b border-baroque-gold/10 last:border-0">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-medium text-baroque-cream truncate">
                        {ci.item.name}
                      </p>
                      <span className="text-[11px] text-baroque-cream-muted/50">
                        {ci.qty} × {formatPrice(ci.item.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-baroque-gold">
                        {formatPrice(ci.item.price * ci.qty)}
                      </span>
                      <button
                        onClick={() => updateQty(ci.item.id, -1)}
                        aria-label={`Eliminar ${ci.item.name} del carrito`}
                        className="text-[10px] text-baroque-wine hover:text-baroque-wine-light font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-baroque-gold/15 px-5 pt-3 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-baroque-cream-muted/60">{totalItems()} ítems</span>
                  <span className="text-lg font-bold text-baroque-gold" style={{ fontFamily: '"Cinzel", serif' }}>
                    {formatPrice(total)}
                  </span>
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre *"
                  aria-label="Tu nombre"
                  className="w-full bg-baroque-dark-sec border border-baroque-gold/15 rounded-xl px-4 py-2.5 text-sm text-baroque-cream placeholder-baroque-cream-muted/40"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  aria-label="Modalidad de entrega"
                  className="w-full bg-baroque-dark-sec border border-baroque-gold/15 rounded-xl px-4 py-2.5 text-sm text-baroque-cream"
                >
                  <option value="" disabled>Modalidad *</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Para llevar">Para llevar</option>
                  <option value="Comer en el local">Comer en el local</option>
                </select>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dirección / Notas"
                  aria-label="Dirección o notas"
                  rows={2}
                  className="w-full bg-baroque-dark-sec border border-baroque-gold/15 rounded-xl px-4 py-2.5 text-sm text-baroque-cream placeholder-baroque-cream-muted/40 resize-none"
                />
                {error && (
                  <p role="alert" className="text-[11px] text-status-pending leading-snug">
                    {error}
                  </p>
                )}
                {fallbackUrl ? (
                  <div role="alert" className="space-y-2">
                    <p className="text-[11px] text-baroque-cream-muted leading-snug">
                      Tu pedido quedó registrado, pero el navegador bloqueó la
                      apertura de WhatsApp. Tocá acá para enviarlo:
                    </p>
                    <a
                      href={fallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleFallbackUsed}
                      className="block w-full btn-burgundy-gradient text-baroque-cream font-bold py-3 rounded-xl transition-all text-sm border border-baroque-gold/30 text-center"
                    >
                      Abrir WhatsApp
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!name.trim() || !type || sending}
                    className="w-full btn-burgundy-gradient disabled:opacity-40 disabled:cursor-not-allowed text-baroque-cream font-bold py-3 rounded-xl transition-all text-sm border border-baroque-gold/30"
                  >
                    {sending ? 'Registrando pedido...' : 'Enviar Pedido por WhatsApp'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
