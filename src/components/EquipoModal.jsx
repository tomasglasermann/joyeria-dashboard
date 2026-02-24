import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

const COLORES = ['#5B8DB8', '#B8942E', '#7B6DAF', '#34C759', '#FF6B6B', '#E8913A', '#4ECDC4', '#95A5C6']

export default function EquipoModal({ open, onClose, vendedores, onAdd, onRemove }) {
  const [nombre, setNombre] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  if (!open) return null

  const nextColor = COLORES[vendedores.length % COLORES.length]

  const handleAdd = () => {
    const trimmed = nombre.trim()
    if (!trimmed) return
    onAdd({
      id: 'V' + Date.now(),
      nombre: trimmed,
      color: nextColor,
      comision: 0.75,
    })
    setNombre('')
  }

  const handleRemove = (id) => {
    onRemove(id)
    setConfirmDelete(null)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f5]">
          <div>
            <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Gestionar Equipo</h3>
            <p className="text-[13px] text-[#48484a] mt-0.5">Agrega o elimina vendedores</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#f5f5f7] transition-colors">
            <X className="w-5 h-5 text-[#48484a]" />
          </button>
        </div>

        {/* Add new */}
        <div className="px-6 py-4 border-b border-[#f0f0f5]">
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1 bg-[#f5f5f7] rounded-xl px-3 py-2.5">
              <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: nextColor }} />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Nombre del vendedor..."
                className="flex-1 text-[14px] text-[#1d1d1f] bg-transparent outline-none placeholder:text-[#aeaeb2]"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!nombre.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1d1d1f] text-white text-[13px] font-semibold rounded-xl hover:bg-[#424245] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {vendedores.length === 0 ? (
            <p className="text-[14px] text-[#aeaeb2] text-center py-8">No hay vendedores. Agrega uno arriba.</p>
          ) : (
            <div className="space-y-1">
              {vendedores.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-3 border-b border-[#f5f5f7] last:border-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                      style={{ backgroundColor: v.color }}
                    >
                      {v.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-[14px] font-medium text-[#1d1d1f]">{v.nombre}</span>
                  </div>

                  {confirmDelete === v.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-[#FF3B30] font-medium">Eliminar?</span>
                      <button
                        onClick={() => handleRemove(v.id)}
                        className="px-3 py-1.5 bg-[#FF3B30] text-white text-[12px] font-semibold rounded-lg hover:bg-[#E0352B] transition-colors"
                      >
                        Si
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 bg-[#f5f5f7] text-[#424245] text-[12px] font-semibold rounded-lg hover:bg-[#e5e5ea] transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(v.id)}
                      className="p-2 rounded-xl text-[#aeaeb2] hover:text-[#FF3B30] hover:bg-[#FEECEC] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#f0f0f5]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1d1d1f] text-white text-[14px] font-semibold rounded-xl hover:bg-[#424245] transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  )
}
