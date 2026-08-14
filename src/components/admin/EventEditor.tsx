import { useState } from 'react'
import { useEventStore } from '../../store/eventStore'
import { Calendar, Clock, Trash2, Plus, Image } from 'lucide-react'
import { AIUpload } from './AIUpload'
import { uploadImage } from '../../lib/upload'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const emptyForm = {
  title: '',
  date: '',
  time: '',
  description: '',
  type: 'future' as 'past' | 'future',
  image_url: '',
}

export function EventEditor() {
  const { events, addEvent, updateEvent, deleteEvent } = useEventStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<'all' | 'future' | 'past'>('all')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = () => {
    if (!form.title.trim() || !form.date) return

    const payload = {
      title: form.title.trim().slice(0, 150),
      date: form.date,
      time: form.time || undefined,
      description: form.description.trim().slice(0, 500),
      type: form.type,
      image_url: form.image_url || undefined,
    }

    if (editingId) {
      updateEvent(editingId, payload)
    } else {
      addEvent({
        id: 'evt_' + Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      })
    }

    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (id: string) => {
    const event = events.find((e) => e.id === id)
    if (!event) return
    setForm({
      title: event.title,
      date: event.date,
      time: event.time || '',
      description: event.description,
      type: event.type,
      image_url: event.image_url || '',
    })
    setEditingId(id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteEvent(id)
    if (editingId === id) {
      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    const url = await uploadImage(file, 'events')
    if (url) {
      setForm({ ...form, image_url: url })
    }
    setUploading(false)
  }

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter)

  return (
    <div className="pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-almadekh-text">Eventos</h2>
          <p className="text-[11px] text-almadekh-muted mt-0.5">
            {events.length} eventos
          </p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm)
            setEditingId(null)
            setShowForm(true)
          }}
          className="bg-almadekh-teal hover:bg-almadekh-teal-light text-white text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'future', 'past'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-2 rounded-full text-[11px] font-semibold transition-all ${
              filter === f
                ? 'bg-almadekh-teal text-white'
                : 'bg-almadekh-surface text-almadekh-subdued border border-almadekh-border hover:bg-almadekh-cream'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'future' ? 'Futuras' : 'Pasadas'}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-almadekh-muted text-sm py-12 italic">
          No hay eventos. Hacé clic en "+ Nuevo".
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-sm border border-almadekh-border rounded-xl p-3.5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-almadekh-surface shrink-0 flex items-center justify-center text-base overflow-hidden">
              {event.image_url ? (
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                event.type === 'future' ? '📅' : '✅'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-almadekh-text truncate">
                {event.title}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-almadekh-muted mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Calendar className="w-3 h-3" />
                  {formatDate(event.date)}
                </span>
                {event.time && (
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                )}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[8px] font-semibold ${
                    event.type === 'future'
                      ? 'bg-almadekh-teal/10 text-almadekh-teal'
                      : 'bg-almadekh-surface text-almadekh-muted'
                  }`}
                >
                  {event.type === 'future' ? 'Próximo' : 'Pasado'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleEdit(event.id)}
                className="text-almadekh-subdued hover:text-almadekh-teal transition-colors text-sm p-1"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="text-almadekh-subdued hover:text-almadekh-rose transition-colors text-sm p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-almadekh-bg border border-almadekh-border rounded-2xl w-full max-w-sm p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-serif font-bold text-almadekh-text mb-4">
              {editingId ? 'Editar Evento' : 'Nuevo Evento'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-almadekh-muted block mb-1">Título</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  maxLength={150}
                  className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text"
                  placeholder="Nombre del evento"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-almadekh-muted block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-almadekh-muted block mb-1">Hora (opcional)</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-almadekh-muted block mb-1">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  maxLength={500}
                  rows={3}
                  className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-2.5 text-sm text-almadekh-text resize-none"
                  placeholder="Descripción del evento"
                />
              </div>
              <div>
                <label className="text-[10px] text-almadekh-muted block mb-1">Imagen</label>
                <div className="flex items-center gap-3">
                  {form.image_url ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-almadekh-border">
                      <img src={form.image_url} alt="Vista previa" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setForm({ ...form, image_url: '' })}
                        className="absolute top-0.5 right-0.5 bg-almadekh-text/60 rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-almadekh-surface border border-almadekh-border flex items-center justify-center">
                      <Image className="w-5 h-5 text-almadekh-subdued" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <AIUpload onUpload={handleImageUpload} />
                    {uploading && (
                      <span className="text-[10px] text-almadekh-muted">Subiendo...</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-almadekh-muted block mb-1">Tipo</label>
                <div className="flex gap-2">
                  {(['future', 'past'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        form.type === t
                          ? 'bg-almadekh-teal text-white'
                          : 'bg-almadekh-surface text-almadekh-subdued border border-almadekh-border'
                      }`}
                    >
                      {t === 'future' ? 'Próximo' : 'Pasado'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setForm(emptyForm)
                  }}
                  className="flex-1 bg-almadekh-surface hover:bg-almadekh-border text-almadekh-text font-semibold py-2.5 rounded-xl transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-almadekh-teal hover:bg-almadekh-teal-light text-white font-bold py-2.5 rounded-xl transition-all text-sm"
                >
                  {editingId ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}