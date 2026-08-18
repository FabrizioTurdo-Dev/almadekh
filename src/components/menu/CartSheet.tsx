import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { buildWhatsAppMessage, openWhatsApp } from '../../lib/whatsapp'
import { formatPrice } from '../../lib/format'
import { supabase } from '../../lib/supabase'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: Props) {
  const { items, updateQty, totalItems, totalPrice, clearCart } = useCartStore()
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')

  const cartItems = Object.values(items)
  const total = totalPrice()

  const handleSend = async () => {
    if (!name.trim() || !type || cartItems.length === 0) return
    const lines = cartItems.map((ci) => ({
      name: ci.item.name,
      qty: ci.qty,
      price: ci.item.price,
    }))

    // Save order to Supabase
    try {
      await supabase.from('orders').insert({
        customer_name: name.trim(),
        items: lines,
        total,
        delivery_type: type,
        notes: notes.trim() || null,
        status: 'pending',
      })
    } catch (e) {
      console.error('Error saving order:', e)
    }

    // Open WhatsApp
    const msg = buildWhatsAppMessage(lines, name.trim(), type, notes.trim())
    openWhatsApp(msg)
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0704]/98 backdrop-blur-2xl rounded-t-3xl border-t-2 border-[#B8860B]/20 max-h-[85dvh] sm:max-h-[80vh] flex flex-col md:left-auto md:top-0 md:bottom-0 md:right-0 md:w-96 md:max-h-none md:rounded-none md:rounded-l-2xl"
          >
            <div className="w-9 h-1 bg-[#B8860B]/30 rounded-full mx-auto mt-3 mb-2 md:hidden" />
            <div className="flex items-center justify-between px-5 pb-3 pt-4 border-b border-[#B8860B]/15">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#B8860B]" />
                <h3 className="text-lg font-bold text-[#E8DCC8]" style={{ fontFamily: '"Cinzel", serif' }}>Tu Pedido</h3>
              </div>
              <button onClick={onClose} aria-label="Cerrar carrito" className="text-[#C9A876]/60 hover:text-[#E8DCC8] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1">
              {cartItems.length === 0 ? (
                <p className="text-center text-[#C9A876]/60 text-sm py-8 italic">
                  El carrito está vacío.<br />Seleccioná platos para comenzar.
                </p>
              ) : (
                cartItems.map((ci) => (
                  <div key={ci.item.id} className="flex items-center justify-between py-2.5 border-b border-[#B8860B]/10 last:border-0">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-medium text-[#E8DCC8] truncate">
                        {ci.item.name}
                      </p>
                      <span className="text-[11px] text-[#C9A876]/50">
                        {ci.qty} × {formatPrice(ci.item.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-[#B8860B]">
                        {formatPrice(ci.item.price * ci.qty)}
                      </span>
                      <button
                        onClick={() => updateQty(ci.item.id, -1)}
                        aria-label={`Eliminar ${ci.item.name} del carrito`}
                        className="text-[10px] text-[#722F37] hover:text-[#8a3a44] font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-[#B8860B]/15 px-5 pt-3 pb-20 sm:pb-6 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#C9A876]/60">{totalItems()} ítems</span>
                  <span className="text-lg font-bold text-[#B8860B]" style={{ fontFamily: '"Cinzel", serif' }}>
                    {formatPrice(total)}
                  </span>
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre *"
                  aria-label="Tu nombre"
                  className="w-full bg-[#1a0f0c] border border-[#B8860B]/15 rounded-xl px-4 py-2.5 text-sm text-[#E8DCC8] placeholder-[#C9A876]/40"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  aria-label="Modalidad de entrega"
                  className="w-full bg-[#1a0f0c] border border-[#B8860B]/15 rounded-xl px-4 py-2.5 text-sm text-[#E8DCC8]"
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
                  className="w-full bg-[#1a0f0c] border border-[#B8860B]/15 rounded-xl px-4 py-2.5 text-sm text-[#E8DCC8] placeholder-[#C9A876]/40 resize-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!name.trim() || !type}
                  className="w-full btn-burgundy-gradient disabled:opacity-40 disabled:cursor-not-allowed text-[#E8DCC8] font-bold py-3 rounded-xl transition-all text-sm border border-[#B8860B]/30"
                >
                  Enviar Pedido por WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
