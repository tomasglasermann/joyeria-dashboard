import { useState, useMemo, useEffect, useCallback } from 'react'
import { Wallet, Users, AlertTriangle, Search, Receipt, Tag, DollarSign, Pencil } from 'lucide-react'
import KPICard from '../components/KPICard'
import MaterialBadge from '../components/MaterialBadge'
import StatusBadge from '../components/StatusBadge'
import CategoriaBadge from '../components/CategoriaBadge'
import EditProveedorModal from '../components/EditProveedorModal'
import ColumnToggle from '../components/ColumnToggle'
import { useData } from '../contexts/DataContext'

const frecuenciaLabels = { mensual: 'Mensual', anual: 'Anual', unico: 'Unico' }

// Column definitions
const mercanciaColumns = [
  { key: 'nombre', label: 'Nombre', locked: true },
  { key: 'material', label: 'Material' },
  { key: 'contacto', label: 'Contacto' },
  { key: 'telefono', label: 'Telefono' },
  { key: 'deuda', label: 'Deuda' },
  { key: 'vencimiento', label: 'Vencimiento' },
  { key: 'ultimoPago', label: 'Ultimo Pago' },
  { key: 'estado', label: 'Estado' },
]

const gastosColumns = [
  { key: 'nombre', label: 'Nombre', locked: true },
  { key: 'categoria', label: 'Categoria' },
  { key: 'monto', label: 'Monto' },
  { key: 'frecuencia', label: 'Frecuencia' },
  { key: 'equivMensual', label: 'Equiv. Mensual' },
]

const LS_MERC = 'proveedores_mercancia'
const LS_GAST = 'proveedores_gastos'
const LS_COLS_MERC = 'proveedores_cols_mercancia'
const LS_COLS_GAST = 'proveedores_cols_gastos'
const LS_MATERIALES = 'proveedores_materiales'
const LS_CATEGORIAS = 'proveedores_categorias'

const defaultMateriales = ['Oro 10K', 'Oro 14K', 'Brillantería']

function loadLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}

export default function Proveedores() {
  const {
    proveedores: ctxProveedores,
    proveedoresGastos: ctxGastos,
    categoriasGastos,
  } = useData()

  // Local editable state — init from localStorage or context
  const [localMerc, setLocalMerc] = useState(() => loadLS(LS_MERC) || ctxProveedores)
  const [localGast, setLocalGast] = useState(() => loadLS(LS_GAST) || ctxGastos)

  // Dynamic categories/materials lists
  const [materiales, setMateriales] = useState(() => loadLS(LS_MATERIALES) || defaultMateriales)
  const [categorias, setCategorias] = useState(() => loadLS(LS_CATEGORIAS) || categoriasGastos)

  // Column visibility
  const [colsMerc, setColsMerc] = useState(() => loadLS(LS_COLS_MERC) || mercanciaColumns.map(c => c.key))
  const [colsGast, setColsGast] = useState(() => loadLS(LS_COLS_GAST) || gastosColumns.map(c => c.key))

  // Persist to localStorage
  useEffect(() => { localStorage.setItem(LS_MERC, JSON.stringify(localMerc)) }, [localMerc])
  useEffect(() => { localStorage.setItem(LS_GAST, JSON.stringify(localGast)) }, [localGast])
  useEffect(() => { localStorage.setItem(LS_MATERIALES, JSON.stringify(materiales)) }, [materiales])
  useEffect(() => { localStorage.setItem(LS_CATEGORIAS, JSON.stringify(categorias)) }, [categorias])
  useEffect(() => { localStorage.setItem(LS_COLS_MERC, JSON.stringify(colsMerc)) }, [colsMerc])
  useEffect(() => { localStorage.setItem(LS_COLS_GAST, JSON.stringify(colsGast)) }, [colsGast])

  const [activeTab, setActiveTab] = useState('mercancia')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermGastos, setSearchTermGastos] = useState('')

  // Modal state
  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [editTipo, setEditTipo] = useState('mercancia')

  // Computed KPIs
  const mercKPIs = useMemo(() => {
    const activos = localMerc.length
    const deudaTotal = localMerc.reduce((s, p) => s + (p.deuda || 0), 0)
    const vencidos = localMerc.filter(p => p.estado === 'vencido').length
    return { deudaTotal, proveedoresActivos: activos, pagosVencidos: vencidos }
  }, [localMerc])

  const deudaPorMaterial = useMemo(() => {
    const map = {}
    localMerc.forEach(p => {
      if (!map[p.material]) map[p.material] = 0
      map[p.material] += (p.deuda || 0)
    })
    const colors = { 'Oro 10K': '#D4A853', 'Oro 14K': '#E8D5A3', 'Brillantería': '#A8C4E0' }
    return Object.entries(map).map(([material, deuda]) => ({
      material, deuda, color: colors[material] || '#ccc'
    }))
  }, [localMerc])

  const gastKPIs = useMemo(() => {
    const total = localGast.reduce((s, g) => {
      return s + (g.frecuencia === 'anual' ? Math.round(g.monto / 12) : g.monto)
    }, 0)
    // Find category with highest monthly spend
    const catMap = {}
    localGast.forEach(g => {
      const m = g.frecuencia === 'anual' ? Math.round(g.monto / 12) : g.monto
      catMap[g.categoria] = (catMap[g.categoria] || 0) + m
    })
    const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1])
    return {
      gastoTotalMensual: total,
      cantidadGastos: localGast.length,
      categoriaMayorGasto: sorted[0]?.[0] || '-',
    }
  }, [localGast])

  const maxDeuda = deudaPorMaterial.length > 0 ? Math.max(...deudaPorMaterial.map(d => d.deuda)) : 1

  const proveedoresFiltrados = useMemo(() => {
    if (!searchTerm) return localMerc
    const term = searchTerm.toLowerCase()
    return localMerc.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      (p.contacto || '').toLowerCase().includes(term) ||
      (p.material || '').toLowerCase().includes(term)
    )
  }, [searchTerm, localMerc])

  const gastosFiltrados = useMemo(() => {
    if (!searchTermGastos) return localGast
    const term = searchTermGastos.toLowerCase()
    return localGast.filter(g =>
      g.nombre.toLowerCase().includes(term) ||
      (g.categoria || '').toLowerCase().includes(term)
    )
  }, [searchTermGastos, localGast])

  // Open edit modal
  const openEdit = useCallback((item, tipo) => {
    setEditItem(item)
    setEditTipo(tipo)
    setEditOpen(true)
  }, [])

  // Add new material/category
  const handleAddMaterial = useCallback((name) => {
    setMateriales(prev => prev.includes(name) ? prev : [...prev, name])
  }, [])

  const handleAddCategoria = useCallback((name) => {
    setCategorias(prev => prev.includes(name) ? prev : [...prev, name])
  }, [])

  // Save handler — handles edits AND type changes (mercancia↔gastos)
  const handleSave = useCallback((updatedItem, newTipo, originalTipo) => {
    if (newTipo === originalTipo) {
      // Same tab — just update in place
      if (originalTipo === 'mercancia') {
        setLocalMerc(prev => prev.map(p => p.nombre === editItem.nombre ? { ...updatedItem } : p))
      } else {
        setLocalGast(prev => prev.map(g => g.id === editItem.id ? { ...updatedItem } : g))
      }
    } else {
      // Moving between tabs
      if (originalTipo === 'mercancia' && newTipo === 'gastos') {
        // Remove from mercancia, add to gastos
        setLocalMerc(prev => prev.filter(p => p.nombre !== editItem.nombre))
        setLocalGast(prev => [...prev, {
          id: 'G' + Date.now(),
          nombre: updatedItem.nombre,
          categoria: updatedItem.categoria || categorias[0],
          monto: updatedItem.monto || 0,
          frecuencia: updatedItem.frecuencia || 'mensual',
        }])
      } else {
        // Remove from gastos, add to mercancia
        setLocalGast(prev => prev.filter(g => g.id !== editItem.id))
        setLocalMerc(prev => [...prev, {
          nombre: updatedItem.nombre,
          material: updatedItem.material || 'Oro 10K',
          contacto: updatedItem.contacto || '',
          telefono: updatedItem.telefono || '',
          deuda: updatedItem.deuda || 0,
          vencimiento: updatedItem.vencimiento || '-',
          ultimoPago: updatedItem.ultimoPago || '-',
          estado: updatedItem.estado || 'al_dia',
        }])
      }
    }
  }, [editItem, categoriasGastos])

  // Column visibility helpers
  const isColVisible = (cols, key) => cols.includes(key)
  const thClass = (align = 'left') => `text-${align} py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider`

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
            <KPICard title="Deuda Total" value={mercKPIs.deudaTotal} icon={Wallet} />
            <KPICard title="Proveedores Activos" value={mercKPIs.proveedoresActivos} icon={Users} prefix="" />
            <KPICard title="Pagos Vencidos" value={mercKPIs.pagosVencidos} icon={AlertTriangle} prefix="" />
          </div>

          {/* Deuda por Material */}
          {deudaPorMaterial.length > 0 && (
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
          )}

          {/* Directorio de Proveedores */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Directorio de Proveedores</h3>
              <div className="flex items-center gap-2">
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
                <ColumnToggle columns={mercanciaColumns} visibleColumns={colsMerc} onChange={setColsMerc} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#f0f0f5]">
                    {isColVisible(colsMerc, 'nombre') && <th className={thClass()}>Nombre</th>}
                    {isColVisible(colsMerc, 'material') && <th className={thClass()}>Material</th>}
                    {isColVisible(colsMerc, 'contacto') && <th className={thClass()}>Contacto</th>}
                    {isColVisible(colsMerc, 'telefono') && <th className={thClass()}>Telefono</th>}
                    {isColVisible(colsMerc, 'deuda') && <th className={thClass('right')}>Deuda</th>}
                    {isColVisible(colsMerc, 'vencimiento') && <th className={thClass()}>Vencimiento</th>}
                    {isColVisible(colsMerc, 'ultimoPago') && <th className={thClass()}>Ultimo Pago</th>}
                    {isColVisible(colsMerc, 'estado') && <th className={thClass()}>Estado</th>}
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {proveedoresFiltrados.map((p) => (
                    <tr key={p.nombre} className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors group">
                      {isColVisible(colsMerc, 'nombre') && <td className="py-3.5 px-3 font-semibold text-[#1d1d1f]">{p.nombre}</td>}
                      {isColVisible(colsMerc, 'material') && <td className="py-3.5 px-3"><MaterialBadge material={p.material} /></td>}
                      {isColVisible(colsMerc, 'contacto') && <td className="py-3.5 px-3 text-[#424245]">{p.contacto}</td>}
                      {isColVisible(colsMerc, 'telefono') && <td className="py-3.5 px-3 text-[#48484a]">{p.telefono}</td>}
                      {isColVisible(colsMerc, 'deuda') && (
                        <td className="py-3.5 px-3 text-right font-semibold text-[#1d1d1f]">
                          {p.deuda > 0 ? `$${p.deuda.toLocaleString()}` : '—'}
                        </td>
                      )}
                      {isColVisible(colsMerc, 'vencimiento') && <td className="py-3.5 px-3 text-[#48484a]">{p.vencimiento}</td>}
                      {isColVisible(colsMerc, 'ultimoPago') && <td className="py-3.5 px-3 text-[#48484a]">{p.ultimoPago}</td>}
                      {isColVisible(colsMerc, 'estado') && <td className="py-3.5 px-3"><StatusBadge status={p.estado} /></td>}
                      <td className="py-3.5 px-1">
                        <button
                          onClick={() => openEdit(p, 'mercancia')}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#f0f0f5] transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#aeaeb2]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {proveedoresFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={colsMerc.length + 1} className="py-12 text-center">
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
            <KPICard title="Gasto Total Mensual" value={gastKPIs.gastoTotalMensual} icon={Receipt} />
            <KPICard title="Cantidad de Gastos" value={gastKPIs.cantidadGastos} icon={Tag} prefix="" />
            <KPICard title="Categoria Mayor Gasto" value={gastKPIs.categoriaMayorGasto} icon={DollarSign} prefix="" />
          </div>

          {/* Gastos Operativos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Gastos Operativos</h3>
              <div className="flex items-center gap-2">
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
                <ColumnToggle columns={gastosColumns} visibleColumns={colsGast} onChange={setColsGast} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#f0f0f5]">
                    {isColVisible(colsGast, 'nombre') && <th className={thClass()}>Nombre</th>}
                    {isColVisible(colsGast, 'categoria') && <th className={thClass()}>Categoria</th>}
                    {isColVisible(colsGast, 'monto') && <th className={thClass('right')}>Monto</th>}
                    {isColVisible(colsGast, 'frecuencia') && <th className={thClass()}>Frecuencia</th>}
                    {isColVisible(colsGast, 'equivMensual') && <th className={thClass('right')}>Equiv. Mensual</th>}
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {gastosFiltrados.map((g) => (
                    <tr key={g.id} className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors group">
                      {isColVisible(colsGast, 'nombre') && <td className="py-3.5 px-3 font-semibold text-[#1d1d1f]">{g.nombre}</td>}
                      {isColVisible(colsGast, 'categoria') && <td className="py-3.5 px-3"><CategoriaBadge categoria={g.categoria} /></td>}
                      {isColVisible(colsGast, 'monto') && (
                        <td className="py-3.5 px-3 text-right font-semibold text-[#1d1d1f]">
                          ${g.monto.toLocaleString()}
                        </td>
                      )}
                      {isColVisible(colsGast, 'frecuencia') && (
                        <td className="py-3.5 px-3 text-[#48484a]">
                          {frecuenciaLabels[g.frecuencia] || g.frecuencia}
                        </td>
                      )}
                      {isColVisible(colsGast, 'equivMensual') && (
                        <td className="py-3.5 px-3 text-right text-[#48484a]">
                          ${(g.frecuencia === 'anual' ? Math.round(g.monto / 12) : g.monto).toLocaleString()}/mes
                        </td>
                      )}
                      <td className="py-3.5 px-1">
                        <button
                          onClick={() => openEdit(g, 'gastos')}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#f0f0f5] transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#aeaeb2]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {gastosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={colsGast.length + 1} className="py-12 text-center">
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

      {/* Edit Modal */}
      <EditProveedorModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        proveedor={editItem}
        tipo={editTipo}
        materialesOptions={materiales}
        categoriasGastos={categorias}
        onSave={handleSave}
        onAddMaterial={handleAddMaterial}
        onAddCategoria={handleAddCategoria}
      />
    </div>
  )
}
