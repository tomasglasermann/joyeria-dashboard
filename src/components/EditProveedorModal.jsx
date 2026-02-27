import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const materialesOptions = ['Oro 10K', 'Oro 14K', 'Brillantería']
const frecuenciaOptions = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'anual', label: 'Anual' },
  { value: 'unico', label: 'Unico' },
]
const estadoOptions = [
  { value: 'al_dia', label: 'Al dia' },
  { value: 'proximo', label: 'Proximo' },
  { value: 'vencido', label: 'Vencido' },
]

const selectClass = 'w-full text-[13px] font-medium text-[#424245] bg-[#f5f5f7] border-0 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 appearance-none cursor-pointer'
const inputClass = 'w-full text-[13px] font-medium text-[#1d1d1f] bg-[#f5f5f7] border-0 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#9B7D2E]/30'
const labelClass = 'text-[12px] font-semibold text-[#48484a] uppercase tracking-wider mb-1.5 block'

export default function EditProveedorModal({ open, onClose, proveedor, tipo, categoriasGastos, onSave }) {
  const [form, setForm] = useState({})
  const [currentTipo, setCurrentTipo] = useState(tipo)

  useEffect(() => {
    if (proveedor) {
      setForm({ ...proveedor })
      setCurrentTipo(tipo)
    }
  }, [proveedor, tipo])

  if (!open || !proveedor) return null

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = () => {
    onSave(form, currentTipo, tipo)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f5]">
          <div>
            <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Editar Proveedor</h3>
            <p className="text-[13px] text-[#48484a] mt-0.5">{proveedor.nombre}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#f5f5f7] transition-colors">
            <X className="w-5 h-5 text-[#48484a]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Tipo */}
          <div>
            <label className={labelClass}>Tipo</label>
            <select
              value={currentTipo}
              onChange={(e) => setCurrentTipo(e.target.value)}
              className={selectClass}
            >
              <option value="mercancia">Mercancia</option>
              <option value="gastos">Gastos</option>
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className={labelClass}>Nombre</label>
            <input
              type="text"
              value={form.nombre || ''}
              onChange={(e) => set('nombre', e.target.value)}
              className={inputClass}
            />
          </div>

          {/* --- Campos Mercancia --- */}
          {currentTipo === 'mercancia' && (
            <>
              <div>
                <label className={labelClass}>Material</label>
                <select
                  value={form.material || 'Oro 10K'}
                  onChange={(e) => set('material', e.target.value)}
                  className={selectClass}
                >
                  {materialesOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Contacto</label>
                <input
                  type="text"
                  value={form.contacto || ''}
                  onChange={(e) => set('contacto', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Telefono</label>
                <input
                  type="text"
                  value={form.telefono || ''}
                  onChange={(e) => set('telefono', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Deuda ($)</label>
                <input
                  type="number"
                  value={form.deuda ?? 0}
                  onChange={(e) => set('deuda', Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Estado</label>
                <select
                  value={form.estado || 'al_dia'}
                  onChange={(e) => set('estado', e.target.value)}
                  className={selectClass}
                >
                  {estadoOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* --- Campos Gastos --- */}
          {currentTipo === 'gastos' && (
            <>
              <div>
                <label className={labelClass}>Categoria</label>
                <select
                  value={form.categoria || categoriasGastos[0]}
                  onChange={(e) => set('categoria', e.target.value)}
                  className={selectClass}
                >
                  {categoriasGastos.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Monto ($)</label>
                <input
                  type="number"
                  value={form.monto ?? 0}
                  onChange={(e) => set('monto', Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Frecuencia</label>
                <select
                  value={form.frecuencia || 'mensual'}
                  onChange={(e) => set('frecuencia', e.target.value)}
                  className={selectClass}
                >
                  {frecuenciaOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#f0f0f5]">
          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-[#1d1d1f] text-white text-[14px] font-semibold rounded-xl hover:bg-[#424245] transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
