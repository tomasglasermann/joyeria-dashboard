import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronRight, User, Phone, Mail, FileText, Clock, ShoppingBag, Scale, AlertCircle } from 'lucide-react'
import SparklineCard from '../components/SparklineCard'
import StatusBadge from '../components/StatusBadge'
import { useData } from '../contexts/DataContext'

const tipoLabels = { mayorista: 'Mayorista', detal: 'Al Detal', shopify: 'Shopify' }
const tipoColors = {
  mayorista: { bg: '#FFF8E7', text: '#92710D', border: '#F0DFA0' },
  detal: { bg: '#EDF4FB', text: '#3A6E99', border: '#C4DBEF' },
  shopify: { bg: '#E8FAF0', text: '#1A7F44', border: '#B8ECD0' },
}

function TipoBadge({ tipo }) {
  const c = tipoColors[tipo] || tipoColors.detal
  return (
    <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}>
      {tipoLabels[tipo] || tipo}
    </span>
  )
}

function getInvoiceInfo(factura) {
  const hoy = new Date('2026-02-23')
  const venc = new Date(factura.fechaVencimiento)

  if (factura.estado === 'pagada') {
    const dias = factura.diasParaPago
    if (factura.condicion === 0) return { texto: 'Contado', color: '#34C759' }
    const late = dias > factura.condicion
    return { texto: `${dias}d`, color: late ? '#FF9500' : '#34C759' }
  }

  if (factura.estado === 'vencida') {
    const diff = Math.round((hoy - venc) / (1000 * 60 * 60 * 24))
    return { texto: `Vencida ${diff}d`, color: '#FF3B30' }
  }

  // pendiente
  const rest = Math.round((venc - hoy) / (1000 * 60 * 60 * 24))
  if (rest <= 7) return { texto: `${rest}d restantes`, color: '#FF9500' }
  return { texto: `${rest}d restantes`, color: '#48484a' }
}

function formatDate(d) {
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y.slice(2)}`
}

function MiniKPI({ label, value, icon: Icon }) {
  return (
    <div className="bg-[#f5f5f7] rounded-xl p-3.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-[#9B7D2E]" />
        <span className="text-[11px] text-[#48484a] font-medium">{label}</span>
      </div>
      <p className="text-[18px] font-semibold text-[#1d1d1f] tracking-tight">{value}</p>
    </div>
  )
}

function ClientDetail({ cliente }) {
  const totals = useMemo(() => {
    let monto = 0, oroGramos = 0, compras = cliente.compras.length, abiertas = 0
    for (const c of cliente.compras) {
      monto += c.monto
      oroGramos += c.pesoOroGramos
      if (c.factura.estado === 'pendiente' || c.factura.estado === 'vencida') abiertas++
    }
    return { monto, oroGramos, compras, abiertas }
  }, [cliente])

  return (
    <div className="bg-[#f9f9fb] rounded-xl p-5 border-l-[3px] border-[#9B7D2E] space-y-5">
      {/* Client Info + Mini KPIs */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Info */}
        <div className="flex items-start gap-3 min-w-[220px]">
          <div className="w-10 h-10 rounded-full bg-[#9B7D2E] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[14px] font-bold">
              {cliente.nombre.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1d1d1f]">{cliente.nombre}</p>
            <div className="flex items-center gap-3 mt-1 text-[12px] text-[#48484a]">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{cliente.telefono}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{cliente.email}</span>
            </div>
          </div>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          <MiniKPI label="Total Comprado" value={`$${totals.monto.toLocaleString()}`} icon={ShoppingBag} />
          <MiniKPI label="Compras" value={totals.compras} icon={FileText} />
          <MiniKPI label="Oro Total" value={`${totals.oroGramos.toFixed(1)}g`} icon={Scale} />
          <MiniKPI label="Fact. Abiertas" value={totals.abiertas} icon={totals.abiertas > 0 ? AlertCircle : Clock} />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider mb-3">Historial de Compras</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#f0f0f5]">
                <th className="text-left py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Fecha</th>
                <th className="text-left py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Canal</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Monto</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Oro 10K</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Oro 14K</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Brillant.</th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Oro (g)</th>
                <th className="text-center py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Factura</th>
                <th className="text-center py-2 px-2 text-[10px] font-semibold text-[#48484a] uppercase tracking-wider">Pago</th>
              </tr>
            </thead>
            <tbody>
              {cliente.compras.map((c) => {
                const inv = getInvoiceInfo(c.factura)
                return (
                  <tr key={c.id} className="border-b border-[#f5f5f7]">
                    <td className="py-2.5 px-2 text-[#1d1d1f] font-medium">{formatDate(c.fecha)}</td>
                    <td className="py-2.5 px-2 text-[#48484a]">{c.canal}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-[#1d1d1f]">${c.monto.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right text-[#48484a]">
                      {c.desglose.oro10k.gramos > 0 ? (
                        <span>{c.desglose.oro10k.gramos}g <span className="text-[#aeaeb2]">(${c.desglose.oro10k.monto.toLocaleString()})</span></span>
                      ) : <span className="text-[#d1d1d6]">—</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-[#48484a]">
                      {c.desglose.oro14k.gramos > 0 ? (
                        <span>{c.desglose.oro14k.gramos}g <span className="text-[#aeaeb2]">(${c.desglose.oro14k.monto.toLocaleString()})</span></span>
                      ) : <span className="text-[#d1d1d6]">—</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-[#48484a]">
                      {c.desglose.brillanteria.piezas > 0 ? (
                        <span>{c.desglose.brillanteria.piezas}pz <span className="text-[#aeaeb2]">(${c.desglose.brillanteria.monto.toLocaleString()})</span></span>
                      ) : <span className="text-[#d1d1d6]">—</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right font-medium text-[#9B7D2E]">
                      {c.pesoOroGramos > 0 ? `${c.pesoOroGramos}g` : <span className="text-[#d1d1d6]">—</span>}
                    </td>
                    <td className="py-2.5 px-2 text-center"><StatusBadge status={c.factura.estado} /></td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="text-[11px] font-semibold" style={{ color: inv.color }}>{inv.texto}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function Ventas() {
  const { ventasPorCanalDetalle, clientesVentas } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [expandedId, setExpandedId] = useState(null)
  const [editingTerminos, setEditingTerminos] = useState(null) // client id being edited
  const [terminosMap, setTerminosMap] = useState(() => {
    const map = {}
    for (const c of clientesVentas) map[c.id] = c.terminos
    return map
  })

  const handleTerminosChange = (clienteId, value) => {
    setTerminosMap(prev => ({ ...prev, [clienteId]: Number(value) }))
    setEditingTerminos(null)
  }

  const clientesFiltrados = useMemo(() => {
    return clientesVentas.filter(c => {
      const matchNombre = c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      const matchTipo = filtroTipo === 'todos' || c.tipo === filtroTipo
      return matchNombre && matchTipo
    })
  }, [searchTerm, filtroTipo])

  // Compute per-client totals
  const clienteTotals = useMemo(() => {
    const map = {}
    for (const c of clientesVentas) {
      let monto = 0, compras = c.compras.length, pendientes = 0
      for (const comp of c.compras) {
        monto += comp.monto
        if (comp.factura.estado === 'pendiente' || comp.factura.estado === 'vencida') pendientes++
      }
      map[c.id] = { monto, compras, pendientes }
    }
    return map
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Ventas</h2>
        <p className="text-[15px] text-[#48484a] mt-1">Gestion de ventas y clientes</p>
      </div>

      {/* Channel KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ventasPorCanalDetalle.map((c) => (
          <SparklineCard
            key={c.canal}
            title={c.canal}
            value={c.total}
            cambio={c.cambio}
            color={c.color}
          />
        ))}
      </div>

      {/* Clients Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-[13px] font-medium text-[#1d1d1f] bg-[#f5f5f7] rounded-xl outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 transition-all"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-4 py-2.5 text-[13px] font-medium text-[#1d1d1f] bg-[#f5f5f7] rounded-xl outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 cursor-pointer"
          >
            <option value="todos">Todos los tipos</option>
            <option value="mayorista">Mayorista</option>
            <option value="detal">Al Detal</option>
            <option value="shopify">Shopify</option>
          </select>
        </div>

        {/* Client List */}
        <div className="space-y-0">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-2 border-b border-[#f0f0f5]">
            <div className="col-span-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Cliente</div>
            <div className="col-span-2 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Tipo</div>
            <div className="col-span-1 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider text-center">Terminos</div>
            <div className="col-span-1 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider text-center">Compras</div>
            <div className="col-span-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider text-right">Total Comprado</div>
            <div className="col-span-2 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider text-center">Pendientes</div>
          </div>

          {clientesFiltrados.map((cliente) => {
            const t = clienteTotals[cliente.id]
            const isExpanded = expandedId === cliente.id
            return (
              <div key={cliente.id}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : cliente.id)}
                  className={`w-full grid grid-cols-1 md:grid-cols-12 gap-2 items-center px-3 py-3.5 border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors text-left ${isExpanded ? 'bg-[#f9f9fb]' : ''}`}
                >
                  <div className="col-span-3 flex items-center gap-2.5">
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-[#9B7D2E] flex-shrink-0" />
                      : <ChevronRight className="w-4 h-4 text-[#aeaeb2] flex-shrink-0" />
                    }
                    <div className="w-8 h-8 rounded-full bg-[#9B7D2E]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-[#9B7D2E]">
                        {cliente.nombre.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1d1d1f]">{cliente.nombre}</span>
                  </div>
                  <div className="col-span-2"><TipoBadge tipo={cliente.tipo} /></div>
                  <div className="col-span-1 text-center text-[13px] font-medium text-[#48484a]"
                    onClick={(e) => { e.stopPropagation(); setEditingTerminos(cliente.id) }}
                  >
                    {editingTerminos === cliente.id ? (
                      <select
                        autoFocus
                        value={terminosMap[cliente.id]}
                        onChange={(e) => handleTerminosChange(cliente.id, e.target.value)}
                        onBlur={() => setEditingTerminos(null)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-1.5 py-1 text-[12px] font-medium text-[#1d1d1f] bg-white border border-[#9B7D2E] rounded-lg outline-none text-center cursor-pointer"
                      >
                        <option value={0}>Contado</option>
                        <option value={30}>30 dias</option>
                        <option value={60}>60 dias</option>
                        <option value={90}>90 dias</option>
                        <option value={120}>120 dias</option>
                      </select>
                    ) : terminosMap[cliente.id] === 0 ? (
                      <span className="text-[#34C759] cursor-pointer hover:underline">Contado</span>
                    ) : (
                      <span className="cursor-pointer hover:underline">{terminosMap[cliente.id]}d</span>
                    )}
                  </div>
                  <div className="col-span-1 text-center text-[13px] font-medium text-[#48484a]">{t.compras}</div>
                  <div className="col-span-3 text-right text-[14px] font-semibold text-[#1d1d1f]">${t.monto.toLocaleString()}</div>
                  <div className="col-span-2 text-center">
                    {t.pendientes > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF4EB] text-[11px] font-semibold text-[#B35C14]">
                        {t.pendientes}
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#34C759] font-medium">Al dia</span>
                    )}
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-3 py-4">
                    <ClientDetail cliente={cliente} />
                  </div>
                )}
              </div>
            )
          })}

          {clientesFiltrados.length === 0 && (
            <div className="py-12 text-center">
              <User className="w-8 h-8 text-[#d1d1d6] mx-auto mb-2" />
              <p className="text-[13px] text-[#aeaeb2]">No se encontraron clientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
