import { useState } from 'react'
import { useMenuStore } from '../../store/menuStore'
import { FIXED_CATEGORY_IDS } from '../../data/menuData'
import { AIUpload } from './AIUpload'
import { uploadImage } from '../../lib/upload'
import { removeBackground } from '../../lib/ai'
import { formatPrice } from '../../lib/format'

export function MenuEditor() {
  const { categories, activeCategory, setActiveCategory, setCategories } = useMenuStore()
  const [editingItem, setEditingItem] = useState<{ catIdx: number; itemIdx: number } | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [deletingItem, setDeletingItem] = useState<{ catIdx: number; itemIdx: number } | null>(null)
  const [showCatModal, setShowCatModal] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatSpecial, setNewCatSpecial] = useState(true)

  const cat = categories[activeCategory]

  const handleSaveItem = () => {
    if (!editingItem || !editName || !editPrice) return
    const price = parseInt(editPrice)
    if (isNaN(price) || price < 0) return
    const newCats = [...categories]
    const item = newCats[editingItem.catIdx].items[editingItem.itemIdx]
    item.name = editName.trim().slice(0, 100)
    item.desc = editDesc.trim().slice(0, 300)
    item.price = price
    setCategories(newCats)
    setEditingItem(null)
  }

  const handleDeleteItem = (catIdx: number, itemIdx: number) => {
    const newCats = [...categories]
    newCats[catIdx].items.splice(itemIdx, 1)
    setCategories(newCats)
  }

  const handleAddItem = () => {
    const newCats = [...categories]
    const newId = 'item_' + Date.now()
    newCats[activeCategory].items.push({ id: newId, name: 'Nuevo plato', desc: '', price: 0 })
    setCategories(newCats)
    const idx = newCats[activeCategory].items.length - 1
    setEditingItem({ catIdx: activeCategory, itemIdx: idx })
    setEditName('Nuevo plato')
    setEditDesc('')
    setEditPrice('')
  }

  const handleImageUpload = async (catIdx: number, itemIdx: number, file: File) => {
    const url = await uploadImage(file, 'menu')
    if (!url) return

    const result = await removeBackground(url, 'menu')

    const freshCats = [...useMenuStore.getState().categories]
    if ('url' in result) {
      freshCats[catIdx].items[itemIdx].image_url = result.url
    } else {
      console.warn('removeBackground error:', result.error)
      freshCats[catIdx].items[itemIdx].image_url = url
    }
    setCategories(freshCats)
  }

  const handleAddCategory = () => {
    if (!newCatName.trim()) return
    const newCat = {
      id: 'cat_' + Date.now(),
      name: newCatName.trim(),
      sort_order: categories.length,
      is_special: newCatSpecial,
      items: [],
    }
    setCategories([...categories, newCat])
    setActiveCategory(categories.length)
    setNewCatName('')
    setNewCatSpecial(true)
    setShowCatModal(false)
  }

  return (
    <div className="pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-almadekh-text">Editor de Menú</h2>
          <p className="text-[11px] text-almadekh-muted mt-0.5">
            {cat?.items.length || 0} platos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCatModal(true)}
            className="bg-almadekh-gold hover:bg-almadekh-gold-light text-white text-xs font-bold px-4 py-2 rounded-full transition-all"
          >
            + Categoría
          </button>
          <button
            onClick={handleAddItem}
            className="bg-almadekh-teal hover:bg-almadekh-teal-light text-white text-xs font-bold px-4 py-2 rounded-full transition-all"
          >
            + Agregar
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-4 pb-1" style={{ scrollbarWidth: 'none' }}>
        {categories.map((c, idx) => {
          const isFixed = FIXED_CATEGORY_IDS.includes(c.id)
          return (
            <div key={c.id} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveCategory(idx)}
                className={`px-3.5 py-2 rounded-full text-[11px] font-semibold transition-all ${
                  idx === activeCategory
                    ? c.is_special
                      ? 'bg-almadekh-gold text-white'
                      : 'bg-almadekh-teal text-white'
                    : 'bg-almadekh-surface text-almadekh-subdued border border-almadekh-border hover:bg-almadekh-cream'
                }`}
              >
                {c.is_special && '⭐ '}{c.name} ({c.items.length})
              </button>
              {!isFixed && (
                <button
                  onClick={() => {
                    const newCats = [...categories]
                    newCats[idx].is_special = !newCats[idx].is_special
                    setCategories(newCats)
                  }}
                  className={`text-xs px-1.5 py-1 rounded-full transition-all ${
                    c.is_special
                      ? 'bg-almadekh-gold/20 text-almadekh-gold'
                      : 'bg-almadekh-surface text-almadekh-subdued hover:bg-almadekh-gold/10 hover:text-almadekh-gold'
                  }`}
                  title={c.is_special ? 'Quitar de especiales' : 'Marcar como especial'}
                >
                  ⭐
                </button>
              )}
            </div>
          )
        })}
      </div>

      {cat?.items.map((item, idx) => (
        <div
          key={item.id}
          className="bg-white shadow-sm border border-almadekh-border rounded-xl p-3.5 mb-2 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-almadekh-surface shrink-0 flex items-center justify-center text-lg overflow-hidden">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <span className="opacity-40 text-base">🍽️</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-almadekh-text truncate">{item.name}</p>
            <span className="text-[10px] text-almadekh-muted">{formatPrice(item.price)}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <AIUpload
              onUpload={(file) => handleImageUpload(activeCategory, idx, file)}
            />
            <button
              onClick={() => {
                setEditingItem({ catIdx: activeCategory, itemIdx: idx })
                setEditName(item.name)
                setEditDesc(item.desc)
                setEditPrice(item.price.toString())
              }}
              className="text-almadekh-subdued hover:text-almadekh-teal transition-colors text-sm p-1"
            >
              ✏️
            </button>
            <button
              onClick={() => setDeletingItem({ catIdx: activeCategory, itemIdx: idx })}
              className="text-almadekh-subdued hover:text-almadekh-rose transition-colors text-sm p-1"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}

      {cat?.items.length === 0 && (
        <p className="text-center text-almadekh-muted text-sm py-12 italic">
          Esta categoría no tiene platos. Hacé clic en "+ Agregar".
        </p>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setEditingItem(null)}>
          <div
            className="bg-almadekh-bg border border-almadekh-border rounded-2xl w-full max-w-sm p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-serif font-bold text-almadekh-text mb-4">Editar Plato</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-almadekh-muted block mb-1">Nombre</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={100}
                  className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text"
                />
              </div>
              <div>
                <label className="text-[10px] text-almadekh-muted block mb-1">Descripción</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  maxLength={300}
                  rows={2}
                  className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-almadekh-muted block mb-1">Precio ($)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-almadekh-surface hover:bg-almadekh-border text-almadekh-text font-semibold py-2.5 rounded-xl transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveItem}
                  className="flex-1 bg-almadekh-teal hover:bg-almadekh-teal-light text-white font-bold py-2.5 rounded-xl transition-all text-sm"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setDeletingItem(null)}>
          <div
            className="bg-almadekh-bg border border-almadekh-border rounded-2xl w-full max-w-sm p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-serif font-bold text-almadekh-text mb-2">Eliminar plato</h3>
            <p className="text-sm text-almadekh-muted mb-5">
              ¿Seguro que querés eliminar <strong className="text-almadekh-text">{categories[deletingItem.catIdx]?.items[deletingItem.itemIdx]?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 bg-almadekh-surface hover:bg-almadekh-border text-almadekh-text font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDeleteItem(deletingItem.catIdx, deletingItem.itemIdx)
                  setDeletingItem(null)
                }}
                className="flex-1 bg-almadekh-rose hover:bg-almadekh-rose-light text-white font-bold py-2.5 rounded-xl transition-all text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setShowCatModal(false)}>
          <div
            className="bg-almadekh-bg border border-almadekh-border rounded-2xl w-full max-w-sm p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-serif font-bold text-almadekh-text mb-4">Nueva Categoría</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-almadekh-muted block mb-1">Nombre</label>
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ej: Tortas, Bebidas, Especiales..."
                  autoFocus
                  className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text placeholder:text-almadekh-muted/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              <button
                onClick={() => setNewCatSpecial(!newCatSpecial)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                  newCatSpecial
                    ? 'bg-almadekh-gold/10 border-almadekh-gold/40 text-almadekh-gold'
                    : 'bg-almadekh-surface border-almadekh-border text-almadekh-muted'
                }`}
              >
                <span className="text-sm font-medium">⭐ Categoría Especial</span>
                <div className={`w-10 h-5 rounded-full transition-all relative ${newCatSpecial ? 'bg-almadekh-gold' : 'bg-almadekh-border'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${newCatSpecial ? 'left-5.5' : 'left-0.5'}`} />
                </div>
              </button>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowCatModal(false); setNewCatName(''); setNewCatSpecial(true) }}
                  className="flex-1 bg-almadekh-surface hover:bg-almadekh-border text-almadekh-text font-semibold py-2.5 rounded-xl transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCatName.trim()}
                  className="flex-1 bg-almadekh-gold hover:bg-almadekh-gold-light text-white font-bold py-2.5 rounded-xl transition-all text-sm disabled:opacity-40"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}