import { useState, useMemo, useCallback } from 'react'
import { DollarSign, Users, Percent, Download, Settings2, ChevronDown, Pencil, Check, UserPlus } from 'lucide-react'
import KPICard from '../components/KPICard'
import MaterialBadge from '../components/MaterialBadge'
import AsignacionModal from '../components/AsignacionModal'
import EquipoModal from '../components/EquipoModal'
import { exportarCSV } from '../utils/exportCSV'
import { useRole } from '../hooks/useRole'
import { useData } from '../contexts/DataContext'

const STORAGE_ASIGNACIONES = 'vicenza_asignaciones'
const STORAGE_TASAS = 'vicenza_tasas_comision'
const STORAGE_VENDEDORES = 'vicenza_vendedores'

function saveVendedores(data) {
  localStorage.setItem(STORAGE_VENDEDORES, JSON.stringify(data))
}

function saveAsignaciones(data) {
  localStorage.setItem(STORAGE_ASIGNACIONES, JSON.stringify(data))
}

function saveTasas(data) {
  localStorage.setItem(STORAGE_TASAS, JSON.stringify(data))
}

export default function Comisiones() {
  const { can } = useRole()
  const { vendedoresEquipo: vendedoresDefault, ventasComisiones, clienteVendedorDefault } = useData()

  const [vendedores, setVendedores] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VENDEDORES)
      return saved ? JSON.parse(saved) : [...vendedoresDefault]
    } catch { return [...vendedoresDefault] }
  })
  const [asignaciones, setAsignaciones] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ASIGNACIONES)
      return saved ? JSON.parse(saved) : { ...clienteVendedorDefault }
    } catch { return { ...clienteVendedorDefault } }
  })
  const [tasas, setTasas] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TASAS)
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    const defaults = {}
    vendedoresDefault.forEach(v => { defaults[v.id] = v.comision })
    return defaults
  })
  const [filtroVendedor, setFiltroVendedor] = useState('todos')
  const [modalAsignacion, setModalAsignacion] = useState(false)
  const [modalEquipo, setModalEquipo] = useState(false)
  const [editingRate, setEditingRate] = useState(null)
  const [editValue, setEditValue] = useState('')

  const clientes = useMemo(() => {
    const set = new Set(ventasComisiones.map(v => v.cliente))
    return [...set].sort()
  }, [])

  const handleAsignacion = useCallback((cliente, vendedorId) => {
    setAsignaciones(prev => {
      const next = { ...prev, [cliente]: vendedorId }
      saveAsignaciones(next)
      return next
    })
  }, [])

  const handleAddVendedor = useCallback((nuevoVendedor) => {
    setVendedores(prev => {
      const next = [...prev, nuevoVendedor]
      saveVendedores(next)
      return next
    })
    setTasas(prev => {
      const next = { ...prev, [nuevoVendedor.id]: nuevoVendedor.comision }
      saveTasas(next)
      return next
    })
  }, [])

  const handleRemoveVendedor = useCallback((id) => {
    setVendedores(prev => {
      const next = prev.filter(v => v.id !== id)
      saveVendedores(next)
      return next
    })
    setAsignaciones(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(cliente => {
        if (next[cliente] === id) next[cliente] = ''
      })
      saveAsignaciones(next)
      return next
    })
    setTasas(prev => {
      const next = { ...prev }
      delete next[id]
      saveTasas(next)
      return next
    })
    if (filtroVendedor === id) setFiltroVendedor('todos')
  }, [filtroVendedor])

  const startEditRate = (vendorId, currentRate) => {
    setEditingRate(vendorId)
    setEditValue(currentRate.toString())
  }

  const saveRate = (vendorId) => {
    const val = parseFloat(editValue)
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setTasas(prev => {
        const next = { ...prev, [vendorId]: val }
        saveTasas(next)
        return next
      })
    }
    setEditingRate(null)
  }

  const getTasa = (vendorId) => tasas[vendorId] ?? 0.75

  const resumenVendedores = useMemo(() => {
    return vendedores.map(v => {
      const ventas = ventasComisiones.filter(
        venta => asignaciones[venta.cliente] === v.id
      )
      const tasa = getTasa(v.id) / 100
      const totalVentas = ventas.reduce((s, vt) => s + vt.monto, 0)
      return {
        ...v,
        ventas: ventas.length,
        totalVentas,
        tasaPct: getTasa(v.id),
        comision: totalVentas * tasa,
      }
    })
  }, [vendedores, asignaciones, tasas])

  const totalVentasEquipo = resumenVendedores.reduce((s, v) => s + v.totalVentas, 0)
  const totalComisiones = resumenVendedores.reduce((s, v) => s + v.comision, 0)
  const maxVentas = Math.max(...resumenVendedores.map(v => v.totalVentas), 1)

  const ventasFiltradas = useMemo(() => {
    if (filtroVendedor === 'todos') return ventasComisiones
    return ventasComisiones.filter(v => asignaciones[v.cliente] === filtroVendedor)
  }, [filtroVendedor, asignaciones])

  const getVendor = (cliente) => {
    const vid = asignaciones[cliente]
    return vendedores.find(x => x.id === vid)
  }

  const getVendorName = (cliente) => {
    const v = getVendor(cliente)
    return v ? v.nombre : 'Sin asignar'
  }

  const getVendorColor = (cliente) => {
    const v = getVendor(cliente)
    return v ? v.color : '#aeaeb2'
  }

  const getComisionVenta = (venta) => {
    const v = getVendor(venta.cliente)
    if (!v) return 0
    return venta.monto * (getTasa(v.id) / 100)
  }

  const totalComisionFiltradas = ventasFiltradas.reduce((s, v) => s + getComisionVenta(v), 0)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Comisiones</h2>
          <p className="text-[15px] text-[#48484a] mt-1">Calculo de comisiones por vendedor — porcentaje individual</p>
        </div>
        <div className="flex items-center gap-2">
          {can('manage_vendors') && (
            <button
              onClick={() => setModalEquipo(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] text-[13px] font-semibold rounded-xl hover:bg-[#e5e5ea] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Equipo
            </button>
          )}
          {can('edit_assignments') && (
            <button
              onClick={() => setModalAsignacion(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1d1d1f] text-white text-[13px] font-semibold rounded-xl hover:bg-[#424245] transition-colors"
            >
              <Settings2 className="w-4 h-4" />
              Asignaciones
            </button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="Ventas del Equipo" value={totalVentasEquipo} icon={DollarSign} />
        <KPICard title="Total Comisiones" value={totalComisiones} icon={Percent} />
        <KPICard title="Vendedores Activos" value={vendedores.length} icon={Users} prefix="" />
      </div>

      {/* Resumen por Vendedor */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Resumen por Vendedor</h3>
        {resumenVendedores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[14px] text-[#aeaeb2]">No hay vendedores. Haz clic en "Equipo" para agregar.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {resumenVendedores.map((v) => (
              <div key={v.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                      style={{ backgroundColor: v.color }}
                    >
                      {v.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#1d1d1f]">{v.nombre}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] text-[#48484a]">{v.ventas} ventas</p>
                        <span className="text-[12px] text-[#48484a]">·</span>
                        {editingRate === v.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveRate(v.id)}
                              step="0.01"
                              min="0"
                              max="100"
                              className="w-16 text-[12px] font-semibold text-[#1d1d1f] bg-[#f5f5f7] rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#9B7D2E]/30"
                              autoFocus
                            />
                            <span className="text-[12px] text-[#48484a]">%</span>
                            <button onClick={() => saveRate(v.id)} className="p-0.5 rounded-md hover:bg-[#f5f5f7]">
                              <Check className="w-3.5 h-3.5 text-[#34C759]" />
                            </button>
                          </div>
                        ) : can('edit_commission_rates') ? (
                          <button
                            onClick={() => startEditRate(v.id, v.tasaPct)}
                            className="flex items-center gap-1 text-[12px] font-semibold text-[#9B7D2E] hover:text-[#7A6222] transition-colors"
                          >
                            {v.tasaPct}%
                            <Pencil className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[12px] font-semibold text-[#9B7D2E]">{v.tasaPct}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-semibold text-[#1d1d1f]">${v.totalVentas.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[12px] font-semibold text-[#34C759]">Comision: ${v.comision.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#f2f2f7] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(v.totalVentas / maxVentas) * 100}%`,
                      backgroundColor: v.color,
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detalle de Ventas */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Detalle de Ventas</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={filtroVendedor}
                onChange={(e) => setFiltroVendedor(e.target.value)}
                className="text-[13px] font-medium text-[#424245] bg-[#f5f5f7] border-0 rounded-xl px-4 py-2.5 pr-8 outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 appearance-none cursor-pointer"
              >
                <option value="todos">Todos los vendedores</option>
                {vendedores.map(v => (
                  <option key={v.id} value={v.id}>{v.nombre}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#48484a] pointer-events-none" />
            </div>
            <button
              onClick={() => exportarCSV(ventasFiltradas, vendedores, asignaciones, tasas)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] text-[13px] font-semibold rounded-xl hover:bg-[#e5e5ea] transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#f0f0f5]">
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Vendedor</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Cliente</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Canal</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Material</th>
                <th className="text-right py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Monto</th>
                <th className="text-right py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">%</th>
                <th className="text-right py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Comision</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((v) => {
                const vendor = getVendor(v.cliente)
                const tasa = vendor ? getTasa(vendor.id) : 0
                return (
                  <tr key={v.id} className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getVendorColor(v.cliente) }} />
                        <span className="font-medium text-[#1d1d1f]">{getVendorName(v.cliente)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-[#424245]">{v.cliente}</td>
                    <td className="py-3.5 px-3 text-[#424245]">{v.canal}</td>
                    <td className="py-3.5 px-3"><MaterialBadge material={v.material} /></td>
                    <td className="py-3.5 px-3 text-right font-semibold text-[#1d1d1f]">${v.monto.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-right text-[#48484a]">{tasa}%</td>
                    <td className="py-3.5 px-3 text-right font-semibold text-[#34C759]">${getComisionVenta(v).toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-[#48484a]">{v.fecha}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#e5e5ea]">
                <td colSpan={4} className="py-3.5 px-3 font-semibold text-[#1d1d1f]">Total</td>
                <td className="py-3.5 px-3 text-right font-bold text-[#1d1d1f]">
                  ${ventasFiltradas.reduce((s, v) => s + v.monto, 0).toLocaleString()}
                </td>
                <td />
                <td className="py-3.5 px-3 text-right font-bold text-[#34C759]">
                  ${totalComisionFiltradas.toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AsignacionModal
        open={modalAsignacion}
        onClose={() => setModalAsignacion(false)}
        clientes={clientes}
        vendedores={vendedores}
        asignaciones={asignaciones}
        onChange={handleAsignacion}
      />
      <EquipoModal
        open={modalEquipo}
        onClose={() => setModalEquipo(false)}
        vendedores={vendedores}
        onAdd={handleAddVendedor}
        onRemove={handleRemoveVendedor}
      />
    </div>
  )
}
