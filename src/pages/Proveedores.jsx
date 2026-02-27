import { useState, useMemo } from 'react'
import { Wallet, Users, AlertTriangle, Search, Receipt, Tag, DollarSign } from 'lucide-react'
import KPICard from '../components/KPICard'
import MaterialBadge from '../components/MaterialBadge'
import StatusBadge from '../components/StatusBadge'
import CategoriaBadge from '../components/CategoriaBadge'
import { useData } from '../contexts/DataContext'

const frecuenciaLabels = { mensual: 'Mensual', anual: 'Anual', unico: 'Unico' }

export default function Proveedores() {
  const {
    proveedoresKPIs, deudaPorMaterial, proveedores,
    proveedoresGastos, gastosKPIs,
  } = useData()

  const [activeTab, setActiveTab] = useState('mercancia')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermGastos, setSearchTermGastos] = useState('')

  const maxDeuda = Math.max(...deudaPorMaterial.map((d) => d.deuda))

  const proveedoresFiltrados = useMemo(() => {
    if (!searchTerm) return proveedores
    const term = searchTerm.toLowerCase()
    return proveedores.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.contacto.toLowerCase().includes(term) ||
      p.material.toLowerCase().includes(term)
    )
  }, [searchTerm, proveedores])

  const gastosFiltrados = useMemo(() => {
    if (!searchTermGastos) return proveedoresGastos
    const term = searchTermGastos.toLowerCase()
    return proveedoresGastos.filter(g =>
      g.nombre.toLowerCase().includes(term) ||
      g.categoria.toLowerCase().includes(term)
    )
  }, [searchTermGastos, proveedoresGastos])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Proveedores</h2>
        <p className="text-[15px] text-[#48484a] mt-1">Gestion de proveedores y cuentas por pagar</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-[#f5f5f7] rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('mercancia')}
          className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
            activeTab === 'mercancia'
              ? 'bg-white text-[#1d1d1f] shadow-sm'
              : 'text-[#48484a] hover:text-[#1d1d1f]'
          }`}
        >
          Mercancia
        </button>
        <button
          onClick={() => setActiveTab('gastos')}
          className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
            activeTab === 'gastos'
              ? 'bg-white text-[#1d1d1f] shadow-sm'
              : 'text-[#48484a] hover:text-[#1d1d1f]'
          }`}
        >
          Gastos
        </button>
      </div>

      {/* ─── Tab: Mercancia ─── */}
      {activeTab === 'mercancia' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <KPICard title="Deuda Total" value={proveedoresKPIs.deudaTotal} icon={Wallet} />
            <KPICard title="Proveedores Activos" value={proveedoresKPIs.proveedoresActivos} icon={Users} prefix="" />
            <KPICard title="Pagos Vencidos" value={proveedoresKPIs.pagosVencidos} icon={AlertTriangle} prefix="" />
          </div>

          {/* Deuda por Material */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Deuda por Material</h3>
            <div className="space-y-5">
              {deudaPorMaterial.map((d) => (
                <div key={d.material}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[14px] text-[#424245]">{d.material}</span>
                    </div>
                    <span className="text-[14px] font-semibold text-[#1d1d1f]">${d.deuda.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-[#f2f2f7] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(d.deuda / maxDeuda) * 100}%`,
                        backgroundColor: d.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directorio de Proveedores */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Directorio de Proveedores</h3>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
                <input
                  type="text"
                  placeholder="Buscar proveedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] font-medium text-[#1d1d1f] bg-[#f5f5f7] rounded-xl outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 transition-all"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#f0f0f5]">
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Nombre</th>
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Material</th>
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Contacto</th>
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Telefono</th>
                    <th className="text-right py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Deuda</th>
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Vencimiento</th>
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Ultimo Pago</th>
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedoresFiltrados.map((p) => (
                    <tr key={p.nombre} className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-[#1d1d1f]">{p.nombre}</td>
                      <td className="py-3.5 px-3"><MaterialBadge material={p.material} /></td>
                      <td className="py-3.5 px-3 text-[#424245]">{p.contacto}</td>
                      <td className="py-3.5 px-3 text-[#48484a]">{p.telefono}</td>
                      <td className="py-3.5 px-3 text-right font-semibold text-[#1d1d1f]">
                        {p.deuda > 0 ? `$${p.deuda.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-[#48484a]">{p.vencimiento}</td>
                      <td className="py-3.5 px-3 text-[#48484a]">{p.ultimoPago}</td>
                      <td className="py-3.5 px-3"><StatusBadge status={p.estado} /></td>
                    </tr>
                  ))}
                  {proveedoresFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <Users className="w-8 h-8 text-[#d1d1d6] mx-auto mb-2" />
                        <p className="text-[13px] text-[#aeaeb2]">No se encontraron proveedores</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── Tab: Gastos ─── */}
      {activeTab === 'gastos' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <KPICard title="Gasto Total Mensual" value={gastosKPIs.gastoTotalMensual} icon={Receipt} />
            <KPICard title="Cantidad de Gastos" value={gastosKPIs.cantidadGastos} icon={Tag} prefix="" />
            <KPICard title="Categoria Mayor Gasto" value={gastosKPIs.categoriaMayorGasto} icon={DollarSign} prefix="" />
          </div>

          {/* Gastos Operativos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Gastos Operativos</h3>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
                <input
                  type="text"
                  placeholder="Buscar gasto..."
                  value={searchTermGastos}
                  onChange={(e) => setSearchTermGastos(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] font-medium text-[#1d1d1f] bg-[#f5f5f7] rounded-xl outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 transition-all"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#f0f0f5]">
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Nombre</th>
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Categoria</th>
                    <th className="text-right py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Monto</th>
                    <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Frecuencia</th>
                    <th className="text-right py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Equiv. Mensual</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosFiltrados.map((g) => (
                    <tr key={g.id} className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-[#1d1d1f]">{g.nombre}</td>
                      <td className="py-3.5 px-3"><CategoriaBadge categoria={g.categoria} /></td>
                      <td className="py-3.5 px-3 text-right font-semibold text-[#1d1d1f]">
                        ${g.monto.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-[#48484a]">
                        {frecuenciaLabels[g.frecuencia] || g.frecuencia}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#48484a]">
                        ${(g.frecuencia === 'anual' ? Math.round(g.monto / 12) : g.monto).toLocaleString()}/mes
                      </td>
                    </tr>
                  ))}
                  {gastosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <Receipt className="w-8 h-8 text-[#d1d1d6] mx-auto mb-2" />
                        <p className="text-[13px] text-[#aeaeb2]">No se encontraron gastos</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
