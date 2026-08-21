import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMenuStore } from '../store/menuStore'
import { useCartStore } from '../store/cartStore'
import { CategoryTabs } from '../components/menu/CategoryTabs'
import { DishCard } from '../components/menu/DishCard'
import { CartSheet } from '../components/menu/CartSheet'
import { TopNav, BottomNav } from '../components/layout/Navbar'
import { OrnamentalDivider } from '../components/decorative/OrnamentalDivider'

export function MenuPage() {
  const { categories, activeCategory, setActiveCategory } = useMenuStore()
  const { items: cartItems, addItem, updateQty } = useCartStore()
  const [cartOpen, setCartOpen] = useState(false)

  const cat = categories[activeCategory]
  const totalItems = Object.values(cartItems).reduce((s, c) => s + c.qty, 0)

  return (
    <div className="min-h-svh bg-baroque-dark pt-14 md:pt-16">
      <TopNav />

      {/* Header con logo */}
      <div className="px-5 pt-8 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <img
            src="/images/logo.jpg"
            alt="Alma Dekh"
            className="w-20 h-20 md:w-24 md:h-24 mx-auto object-contain rounded-full border-2 border-baroque-gold/30 shadow-[0_0_20px_rgba(184,134,11,0.15)]"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-baroque-cream"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Nuestro Menú
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs md:text-sm text-baroque-cream-muted mt-1"
        >
          Seleccioná tus platos y envianos tu pedido por WhatsApp
        </motion.p>
      </div>

      <OrnamentalDivider variant="simple" />

      <CategoryTabs
        categories={categories}
        activeIndex={activeCategory}
        onSelect={(idx) => {
          setActiveCategory(idx)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

      <div className="px-5 pt-4 pb-mobile-nav grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 max-w-6xl mx-auto">
        {cat?.items.map((item) => {
          const qty = cartItems[item.id]?.qty || 0
          return (
            <DishCard
              key={item.id}
              item={item}
              qty={qty}
              isSpecial={cat?.is_special}
              onAdd={() => addItem(item)}
              onRemove={() => updateQty(item.id, -1)}
            />
          )
        })}
        {cat?.items.length === 0 && (
          <div className="col-span-full text-center py-16">
            <span className="text-4xl block mb-3">🍽️</span>
            <p className="text-sm text-baroque-cream-muted/60 italic">
              No hay platos en esta categoría
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setCartOpen(true)}
        aria-label="Abrir carrito"
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-5 z-40 w-14 h-14 rounded-full btn-burgundy-gradient text-baroque-cream shadow-[0_8px_25px_rgba(114,47,55,0.4)] flex items-center justify-center transition-all active:scale-90 border border-baroque-gold/30"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-baroque-gold text-baroque-dark text-[10px] font-bold flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <BottomNav />
    </div>
  )
}
