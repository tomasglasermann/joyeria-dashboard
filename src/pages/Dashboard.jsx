import { useState, useEffect, useMemo } from 'react'
import {
  DollarSign,
  ShoppingBag,
  CreditCard,
  Wifi,
  RefreshCw,
  Zap,
} from 'lucide-react'
import KPICard from '../components/KPICard'
import SparklineCard from '../components/SparklineCard'
import MaterialBadge from '../components/MaterialBadge'
import StatusBadge from '../components/StatusBadge'
import { useData } from '../contexts/DataContext'

const DAILY_SALES_KEY = 'vicenza_daily_sales'

function getDailySales() {
  try {
    const saved = JSON.parse(localStorage.getItem(DAILY_SALES_KEY))
    const today = new Date().toISOString().split('T')[0]
    if (saved && saved.date === today) return saved.amount
  } catch {}
  return 0
}

function saveDailySales(amount) {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem(DAILY_SALES_KEY, JSON.stringify({ date: today, amount }))
}

export default function Dashboard() {
  const { kpis, ventasPorMaterial, ultimasOrdenes } = useData()
  const [ventasDia, setVentasDia] = useState(getDailySales)
  const [goldPrice, setGoldPrice] = useState(null)
  const [goldLoading, setGoldLoading] = useState(true)

  // Check for date change every minute (auto-reset at midnight)
  useEffect(() => {
    const checkDate = () => {
      const current = getDailySales()
      if (current === 0 && ventasDia !== 0) setVentasDia(0)
    }
    const interval = setInterval(checkDate, 60 * 1000)
    return () => clearInterval(interval)
  }, [ventasDia])

  useEffect(() => {
    const fetchGold = async () => {
      try {
        const res = await fetch('/api/gold-price')
        if (res.ok) {
          const data = await res.json()
          if (data.price > 0) setGoldPrice(data.price)
        }
      } catch {}
      setGoldLoading(false)
    }
    fetchGold()
    const interval = setInterval(fetchGold, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const oroCalc = useMemo(() => {
    if (!goldPrice) return null
    const PARAMS_KEY = 'vicenza_oro_params'
    let params = { incremento: 20, labor: 5, ganancia: 1.1 }
    try {
      const saved = localStorage.getItem(PARAMS_KEY)
      if (saved) params = { ...params, ...JSON.parse(saved) }
    } catch {}
    const porGramo = (goldPrice + params.incremento) / 31.1035
    const roundTo5 = (n) => Math.round(n / 5) * 5
    const base10k = roundTo5((porGramo * 0.417 + params.labor) * params.ganancia)
    const base14k = roundTo5((porGramo * 0.585 + params.labor) * params.ganancia)
    return { xauUsd: goldPrice, base10k, base14k }
  }, [goldPrice])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">General Dashboard</h2>
        <p className="text-[15px] text-[#48484a] mt-1">Resumen ejecutivo de tu joyeria</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Ventas del Dia — LIVE */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium text-[#48484a]">Ventas del Dia</p>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#34C759]/10 text-[10px] text-[#34C759] font-bold uppercase">
                  <Wifi className="w-2.5 h-2.5" /> Live
                </span>
              </div>
              <p className="text-[26px] font-semibold text-[#1d1d1f] mt-1 tracking-tight">
                ${ventasDia.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[12px] text-[#aeaeb2] mt-2">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#34C759]/10">
              <Zap className="w-5 h-5 text-[#34C759]" strokeWidth={1.8} />
            </div>
          </div>
        </div>
        <KPICard title="Ventas del Mes" value={kpis.ventasMes} icon={DollarSign} cambio={8.2} />
        <KPICard title="Ventas al Mayor" value={kpis.ventasMayor} icon={ShoppingBag} cambio={15.3} />
        <KPICard title="Deuda Proveedores" value={kpis.deudaProveedores} icon={CreditCard} cambio={-5.1} />
      </div>

      {/* Material Cards + Oro Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {ventasPorMaterial.map((m) => (
          <SparklineCard
            key={m.material}
            title={m.material}
            value={m.total}
            cambio={m.cambio}
            color={m.color}
            sparkline={m.sparkline}
          />
        ))}

        {/* Oro Widget — Live */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-gold">Precio del Oro</p>
            {goldLoading ? (
              <RefreshCw className="w-3.5 h-3.5 text-[#48484a] animate-spin" />
            ) : oroCalc ? (
              <span className="flex items-center gap-1 text-[11px] text-[#34C759] font-bold uppercase">
                <Wifi className="w-3 h-3" /> Live
              </span>
            ) : (
              <span className="text-[11px] text-[#aeaeb2] font-medium">Offline</span>
            )}
          </div>
          <p className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
            ${(oroCalc?.xauUsd || kpis.precioOro).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-[#aeaeb2] mb-4">XAU/USD Oz Troy</p>
          <div className="space-y-2.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#48484a]">Base 10K /g</span>
              <span className="font-semibold text-[#B8942E]">${oroCalc ? oroCalc.base10k : '—'}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#48484a]">Base 14K /g</span>
              <span className="font-semibold text-[#D4A853]">${oroCalc ? oroCalc.base14k : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de ultimas ordenes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Ultimas Ordenes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#f0f0f5]">
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Orden</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Cliente</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Canal</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Material</th>
                <th className="text-right py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Monto</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Fecha</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimasOrdenes.map((o) => (
                <tr key={o.id} className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#1d1d1f]">{o.id}</td>
                  <td className="py-3.5 px-3 text-[#424245]">{o.cliente}</td>
                  <td className="py-3.5 px-3 text-[#424245]">{o.canal}</td>
                  <td className="py-3.5 px-3"><MaterialBadge material={o.material} /></td>
                  <td className="py-3.5 px-3 text-right font-semibold text-[#1d1d1f]">${o.monto.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-[#48484a]">{o.fecha}</td>
                  <td className="py-3.5 px-3"><StatusBadge status={o.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
