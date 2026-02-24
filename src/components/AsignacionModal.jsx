import { X } from 'lucide-react'

export default function AsignacionModal({ open, onClose, clientes, vendedores, asignaciones, onChange }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f5]">
          <div>
            <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Asignar Clientes a Vendedores</h3>
            <p className="text-[13px] text-[#48484a] mt-0.5">Los cambios se guardan automaticamente</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f5f5f7] transition-colors"
          >
            <X className="w-5 h-5 text-[#48484a]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {clientes.map((cliente) => (
              <div key={cliente} className="flex items-center justify-between gap-4 py-2.5 border-b border-[#f5f5f7] last:border-0">
                <span className="text-[14px] font-medium text-[#1d1d1f] min-w-0 truncate">{cliente}</span>
                <select
                  value={asignaciones[cliente] || ''}
                  onChange={(e) => onChange(cliente, e.target.value)}
                  className="text-[13px] font-medium text-[#424245] bg-[#f5f5f7] border-0 rounded-xl px-3 py-2 min-w-[160px] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 appearance-none cursor-pointer"
                >
                  <option value="">Sin asignar</option>
                  {vendedores.map((v) => (
                    <option key={v.id} value={v.id}>{v.nombre}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
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
