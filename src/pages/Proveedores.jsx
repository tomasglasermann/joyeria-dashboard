import { Wallet, Users, AlertTriangle } from 'lucide-react'
import KPICard from '../components/KPICard'
import MaterialBadge from '../components/MaterialBadge'
import StatusBadge from '../components/StatusBadge'
import { proveedoresKPIs, deudaPorMaterial, proveedores } from '../data/mockData'

export default function Proveedores() {
  const maxDeuda = Math.max(...deudaPorMaterial.map((d) => d.deuda))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Proveedores</h2>
        <p className="text-[15px] text-[#48484a] mt-1">Gestion de proveedores y cuentas por pagar</p>
      </div>

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
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Directorio de Proveedores</h3>
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
              {proveedores.map((p) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
