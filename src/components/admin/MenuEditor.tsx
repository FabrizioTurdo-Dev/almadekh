import { useState } from 'react'
import { useMenuStore } from '../../store/menuStore'
import { FIXED_CATEGORY_IDS } from '../../data/menuData'
import { AIUpload } from './AIUpload'
import { uploadImage } from '../../lib/upload'
import { removeBackground } from '../../lib/ai'
import { formatPrice } from '../../lib/format'
import { SaveError } from './SaveError'
import type { Category, MenuItem } from '../../types'

type UploadStatus = { state: 'idle' } | { state: 'processing'; step: string }

/**
 * Helpers de actualizacion inmutable.
 *
 * Antes cada handler hacia `const newCats = [...categories]` (copia
 * superficial) y despues mutaba en profundidad: asignaba sobre
 * `newCats[i].items[j]` y llamaba a `.push()` y `.splice()` sobre el mismo
 * array que seguia referenciando el estado anterior. Eso dejaba el estado
 * previo alterado, rompia cualquier comparacion por referencia y no dejaba
 * ningun snapshot al que volver si fallaba el guardado remoto.
 */
function replaceItem(
  cats: Category[],
  catIdx: number,
  itemIdx: number,
  patch: Partial<MenuItem>
): Category[] {
  return cats.map((cat, ci) =>
    ci !== catIdx
      ? cat
      : {
          ...cat,
          items: cat.items.map((item, ii) => (ii !== itemIdx ? item : { ...item, ...patch })),
        }
  )
}

function removeItem(cats: Category[], catIdx: number, itemIdx: number): Category[] {
  return cats.map((cat, ci) =>
    ci !== catIdx ? cat : { ...cat, items: cat.items.filter((_, ii) => ii !== itemIdx) }
  )
}

function appendItem(cats: Category[], catIdx: number, item: MenuItem): Category[] {
  return cats.map((cat, ci) => (ci !== catIdx ? cat : { ...cat, items: [...cat.items, item] }))
}

export function MenuEditor() {
  const { categories, activeCategory, setActiveCategory, setCategories } = useMenuStore()
  const [editingItem, setEditingItem] = useState<{ catIdx: number; itemIdx: number } | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [deletingItem, setDeletingItem] = useState<{ catIdx: number; itemIdx: number } | null>(null)
  const [showCatModal, setShowCatModal] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<number | null>(null)
  const [newCatName, setNewCatName] = useState('')
  const [newCatSpecial, setNewCatSpecial] = useState(true)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ state: 'idle' })
  const [saveError, setSaveError] = useState('')

  const cat = categories[activeCategory]

  const save = async (cats: Category[]) => {
    setSaveError('')
    const result = await setCategories(cats)
    if (result.error) setSaveError(result.error)
  }

  const handleSaveItem = () => {
    if (!editingItem || !editName || !editPrice) return
    const price = parseInt(editPrice)
    if (isNaN(price) || price < 0) return
    const next = replaceItem(categories, editingItem.catIdx, editingItem.itemIdx, {
      name: editName.trim().slice(0, 100),
      desc: editDesc.trim().slice(0, 300),
      price,
    })
    setEditingItem(null)
    void save(next)
  }

  const handleDeleteItem = (catIdx: number, itemIdx: number) => {
    void save(removeItem(categories, catIdx, itemIdx))
  }

  const handleAddItem = () => {
    const newItem = { id: 'item_' + Date.now(), name: 'Nuevo plato', desc: '', price: 0 }
    const next = appendItem(categories, activeCategory, newItem)
    setEditingItem({
      catIdx: activeCategory,
      itemIdx: next[activeCategory].items.length - 1,
    })
    setEditName('Nuevo plato')
    setEditDesc('')
    setEditPrice('')
    void save(next)
  }

  const handleImageUpload = async (catIdx: number, itemIdx: number, file: File) => {
    setUploadStatus({ state: 'processing', step: 'Procesando imagen...' })
    const url = await uploadImage(file, 'menu', (step) => {
      setUploadStatus({ state: 'processing', step })
    })
    if (!url) { setUploadStatus({ state: 'idle' }); return }

    setUploadStatus({ state: 'processing', step: 'Aplicando fondo...' })
    const result = await removeBackground(url, 'menu')

    // Se relee el estado: entre el `await` de la subida y el de la IA el menu
    // pudo haber cambiado por realtime.
    const fresh = useMenuStore.getState().categories
    if (!('url' in result)) console.warn('removeBackground error:', result.error)
    const next = replaceItem(fresh, catIdx, itemIdx, {
      image_url: 'url' in result ? result.url : url,
    })
    setUploadStatus({ state: 'idle' })
    await save(next)
  }

  const handleApplyBackground = async (catIdx: number, itemIdx: number) => {
    const item = categories[catIdx]?.items[itemIdx]
    if (!item?.image_url) return
    setUploadStatus({ state: 'processing', step: 'Aplicando fondo...' })
    const result = await removeBackground(item.image_url, 'menu')
    const fresh = useMenuStore.getState().categories
    setUploadStatus({ state: 'idle' })
    if (!('url' in result)) {
      console.warn('removeBackground error:', result.error)
      setSaveError(result.error)
      return
    }
    await save(replaceItem(fresh, catIdx, itemIdx, { image_url: result.url }))
  }

  const handleDeleteCategory = (idx: number) => {
    const next = categories.filter((_, ci) => ci !== idx)
    void save(next)
    if (idx <= activeCategory) {
      setActiveCategory(Math.max(0, activeCategory - 1))
    }
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
    void save([...categories, newCat])
    setActiveCategory(categories.length)
    setNewCatName('')
    setNewCatSpecial(true)
    setShowCatModal(false)
  }

  return (
    <div className="pb-28">
      <SaveError message={saveError} />

      {uploadStatus.state === 'processing' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-almadekh-teal text-almadekh-bg text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
          <span className="inline-block animate-spin">⏳</span>
          {uploadStatus.step}
        </div>
      )}

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
            className="bg-almadekh-gold hover:bg-almadekh-gold-light text-almadekh-bg text-xs font-bold px-4 py-2 rounded-full transition-all"
          >
            + Categoría
          </button>
          <button
            onClick={handleAddItem}
            className="bg-almadekh-teal hover:bg-almadekh-teal-light text-almadekh-bg text-xs font-bold px-4 py-2 rounded-full transition-all"
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
                      ? 'bg-almadekh-gold text-almadekh-bg'
                      : 'bg-almadekh-teal text-almadekh-bg'
                    : 'bg-almadekh-surface text-almadekh-subdued border border-almadekh-border hover:bg-almadekh-gold/10'
                }`}
              >
                {c.is_special && '⭐ '}{c.name} ({c.items.length})
              </button>
              {!isFixed && (
                <button
                  onClick={() => {
                    void save(
                      categories.map((c2, ci) =>
                        ci !== idx ? c2 : { ...c2, is_special: !c2.is_special }
                      )
                    )
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
              <button
                onClick={() => setDeletingCategory(idx)}
                className="text-xs px-1.5 py-1 rounded-full bg-almadekh-surface text-almadekh-subdued hover:bg-almadekh-rose/10 hover:text-almadekh-rose transition-all"
                title="Eliminar categoría"
              >
                🗑️
              </button>
            </div>
          )
        })}
      </div>

      {cat?.items.map((item, idx) => (
        <div
          key={item.id}
          className="bg-almadekh-surface border border-almadekh-border rounded-xl p-3.5 mb-2 flex items-center gap-3"
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
            {item.image_url && (
              <button
                onClick={() => handleApplyBackground(activeCategory, idx)}
                disabled={uploadStatus.state === 'processing'}
                className="text-almadekh-subdued hover:text-almadekh-gold transition-colors text-sm p-1"
                title="Aplicar fondo"
              >
                🎨
              </button>
            )}
            <AIUpload
              onUpload={(file) => handleImageUpload(activeCategory, idx, file)}
              progress={uploadStatus.state === 'processing' ? uploadStatus.step : undefined}
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
                  className="flex-1 bg-almadekh-teal hover:bg-almadekh-teal-light text-almadekh-bg font-bold py-2.5 rounded-xl transition-all text-sm"
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

      {deletingCategory !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setDeletingCategory(null)}>
          <div
            className="bg-almadekh-bg border border-almadekh-border rounded-2xl w-full max-w-sm p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-serif font-bold text-almadekh-text mb-2">Eliminar categoría</h3>
            <p className="text-sm text-almadekh-muted mb-5">
              ¿Seguro que querés eliminar <strong className="text-almadekh-text">{categories[deletingCategory]?.name}</strong>
              {categories[deletingCategory]?.items.length
                ? <> y sus <strong className="text-almadekh-text">{categories[deletingCategory]?.items.length}</strong> platos</>
                : null}? Esta acción no se puede deshacer.
              {FIXED_CATEGORY_IDS.includes(categories[deletingCategory]?.id ?? '') && (
                <> Es una categoría original del menú.</>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingCategory(null)}
                className="flex-1 bg-almadekh-surface hover:bg-almadekh-border text-almadekh-text font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDeleteCategory(deletingCategory)
                  setDeletingCategory(null)
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
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-almadekh-surface shadow transition-all ${newCatSpecial ? 'left-5.5' : 'left-0.5'}`} />
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
                  className="flex-1 bg-almadekh-gold hover:bg-almadekh-gold-light text-almadekh-bg font-bold py-2.5 rounded-xl transition-all text-sm disabled:opacity-40"
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