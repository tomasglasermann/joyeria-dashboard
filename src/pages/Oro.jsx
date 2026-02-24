import { useState, useEffect, useMemo, useCallback } from 'react'
import { RefreshCw, Wifi, WifiOff, Settings2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { useRole } from '../hooks/useRole'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import ChartContainer from '../components/ChartContainer'
import { historialOro10Dias } from '../data/mockData'

// ─── Constants ───
const PARAMS_KEY = 'vicenza_oro_params'
const DEFAULT_PARAMS = {
  incremento: 20,
  labor: 5,
  ganancia: 1.1,
  tarifaTurkia: 1.1,
  tarifaItalia: 1.16,
}

function roundTo5(n) {
  return Math.round(n / 5) * 5
}

function calcularPrecios(precioOnza, params) {
  const { incremento, labor, ganancia, tarifaTurkia, tarifaItalia } = params

  // ONZA
  const conIncremento = precioOnza + incremento
  const porGramo = conIncremento / 31.1035

  // 10 KT
  const ley10k = porGramo * 0.417
  const labor10k = ley10k + labor
  const ganancia10k = labor10k * ganancia
  const base10k = roundTo5(ganancia10k)

  // 14 KT
  const ley14k = porGramo * 0.585
  const labor14k = ley14k + labor
  const ganancia14k = labor14k * ganancia
  const base14k = roundTo5(ganancia14k)

  return {
    onza: { precioOnza, conIncremento, porGramo },
    kt10: { ley: ley10k, labor: labor10k, ganancia: ganancia10k, base: base10k },
    kt14: { ley: ley14k, labor: labor14k, ganancia: ganancia14k, base: base14k },
    tarifas10k: {
      domestico: base10k,
      turkia: Math.round(base10k * tarifaTurkia),
      italia: Math.round(base10k * tarifaItalia),
    },
    tarifas14k: {
      domestico: base14k,
      turkia: Math.round(base14k * tarifaTurkia),
      italia: Math.round(base14k * tarifaItalia),
    },
  }
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-lg border border-[#e5e5ea]">
      <p className="text-[12px] font-medium text-[#48484a] mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-[13px] font-semibold" style={{ color: entry.color }}>
          {entry.name}: ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  )
}

export default function Oro() {
  const { can } = useRole()
  const [precioOnza, setPrecioOnza] = useState(null)
  const [manualPrice, setManualPrice] = useState('')
  const [useManual, setUseManual] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [source, setSource] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [params, setParams] = useState(() => {
    try {
      const saved = localStorage.getItem(PARAMS_KEY)
      return saved ? { ...DEFAULT_PARAMS, ...JSON.parse(saved) } : DEFAULT_PARAMS
    } catch {
      return DEFAULT_PARAMS
    }
  })

  const fetchGoldPrice = useCallback(async () => {
    try {
      setRefreshing(true)
      const res = await fetch('/api/gold-price')
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (data.price && data.price > 0) {
        setPrecioOnza(data.price)
        setSource(data.source || 'API')
        setLastUpdated(new Date())
        setError(null)
        setUseManual(false)
      } else {
        throw new Error('Invalid price')
      }
    } catch (e) {
      setError('No se pudo obtener el precio en vivo')
      if (!precioOnza && !useManual) {
        setUseManual(true)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchGoldPrice()
    const interval = setInterval(fetchGoldPrice, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchGoldPrice])

  useEffect(() => {
    localStorage.setItem(PARAMS_KEY, JSON.stringify(params))
  }, [params])

  const activePrice = useManual ? parseFloat(manualPrice) || 0 : precioOnza
  const precios = useMemo(() => {
    if (!activePrice || activePrice <= 0) return null
    return calcularPrecios(activePrice, params)
  }, [activePrice, params])

  const updateParam = (key, value) => {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setParams(p => ({ ...p, [key]: num }))
    }
  }

  const formatTime = (date) => {
    if (!date) return ''
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Precio del Oro</h2>
          <p className="text-[15px] text-[#48484a] mt-1">Precios de venta por gramo calculados en vivo</p>
        </div>
        <a
          href="https://www.kitco.com/charts/gold"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-[#48484a] hover:text-[#1d1d1f] bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Kitco.com
        </a>
      </div>

      {/* Live Price Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              error && !useManual ? 'bg-[#FEECEC] text-[#FF3B30]' : 'bg-[#E8F8EC] text-[#34C759]'
            }`}>
              {error && !useManual ? (
                <><WifiOff className="w-3 h-3" /> Offline</>
              ) : (
                <><Wifi className="w-3 h-3" /> Live</>
              )}
            </div>
            {lastUpdated && !useManual && (
              <span className="text-[12px] text-[#aeaeb2] flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                {formatTime(lastUpdated)} &middot; {source}
              </span>
            )}
          </div>
          <button
            onClick={fetchGoldPrice}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[#424245] bg-[#f5f5f7] rounded-xl hover:bg-[#e5e5ea] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        <div className="text-center">
          <p className="text-[12px] font-semibold text-[#48484a] uppercase tracking-wider mb-2">
            Precio de la Onza XAU/USD
          </p>

          {loading && !precioOnza ? (
            <div className="flex items-center justify-center py-6">
              <RefreshCw className="w-6 h-6 text-[#48484a] animate-spin" />
            </div>
          ) : useManual || (error && !precioOnza) ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-[13px] text-[#48484a]">Ingresa el precio de Kitco manualmente:</p>
              <div className="flex items-center gap-2">
                <span className="text-[32px] font-semibold text-[#48484a]">$</span>
                <input
                  type="number"
                  value={manualPrice}
                  onChange={(e) => { setManualPrice(e.target.value); setUseManual(true) }}
                  placeholder="0.00"
                  className="text-[48px] font-semibold text-[#1d1d1f] tracking-tight bg-transparent outline-none w-[280px] text-center placeholder:text-[#e5e5ea]"
                />
              </div>
              {error && (
                <button
                  onClick={() => { setUseManual(false); fetchGoldPrice() }}
                  className="text-[12px] text-[#007AFF] font-medium hover:underline"
                >
                  Reintentar precio en vivo
                </button>
              )}
            </div>
          ) : (
            <div>
              <p className="text-[48px] font-semibold text-[#1d1d1f] tracking-tight">
                ${activePrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              {can('edit_oro_params') && (
                <button
                  onClick={() => { setManualPrice(precioOnza?.toString() || ''); setUseManual(true) }}
                  className="text-[12px] text-[#007AFF] font-medium hover:underline mt-2"
                >
                  Ingresar precio manualmente
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── TARIFA CARDS (THE STAR) ─── */}
      {precios && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 10 KT */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-[#B8942E]/10 to-[#D4A853]/5 border-b border-[#f0f0f5]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Oro 10 KT</h3>
                  <p className="text-[12px] text-[#48484a] mt-0.5">Ley 0.417</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Base</p>
                  <p className="text-[28px] font-bold text-[#B8942E] tracking-tight">${precios.kt10.base}</p>
                  <p className="text-[11px] text-[#48484a]">por gramo</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider mb-3">Tarifas por Gramo</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-[#f5f5f7] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#48484a] mb-1">Domestico</p>
                  <p className="text-[24px] font-bold text-[#1d1d1f]">${precios.tarifas10k.domestico}</p>
                </div>
                <div className="text-center p-3 bg-[#FFF8E7] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#B8942E] mb-1">Turkia</p>
                  <p className="text-[24px] font-bold text-[#1d1d1f]">${precios.tarifas10k.turkia}</p>
                </div>
                <div className="text-center p-3 bg-[#EDF4FB] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#5B8DB8] mb-1">Italia</p>
                  <p className="text-[24px] font-bold text-[#1d1d1f]">${precios.tarifas10k.italia}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 14 KT */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-[#D4A853]/10 to-[#E8D5A3]/5 border-b border-[#f0f0f5]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Oro 14 KT</h3>
                  <p className="text-[12px] text-[#48484a] mt-0.5">Ley 0.585</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Base</p>
                  <p className="text-[28px] font-bold text-[#D4A853] tracking-tight">${precios.kt14.base}</p>
                  <p className="text-[11px] text-[#48484a]">por gramo</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider mb-3">Tarifas por Gramo</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-[#f5f5f7] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#48484a] mb-1">Domestico</p>
                  <p className="text-[24px] font-bold text-[#1d1d1f]">${precios.tarifas14k.domestico}</p>
                </div>
                <div className="text-center p-3 bg-[#FFF8E7] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#B8942E] mb-1">Turkia</p>
                  <p className="text-[24px] font-bold text-[#1d1d1f]">${precios.tarifas14k.turkia}</p>
                </div>
                <div className="text-center p-3 bg-[#EDF4FB] rounded-xl">
                  <p className="text-[11px] font-semibold text-[#5B8DB8] mb-1">Italia</p>
                  <p className="text-[24px] font-bold text-[#1d1d1f]">${precios.tarifas14k.italia}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DESGLOSE DE CALCULO ─── */}
      {precios && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f9f9fb] transition-colors"
          >
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Desglose del Calculo</h3>
            {showBreakdown ? (
              <ChevronUp className="w-5 h-5 text-[#48484a]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#48484a]" />
            )}
          </button>

          {showBreakdown && (
            <div className="px-6 pb-6">
              {/* ONZA */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-[#48484a] uppercase tracking-wider mb-3">Onza</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-[#f5f5f7] rounded-xl">
                    <p className="text-[11px] text-[#48484a] mb-0.5">Precio del Dia</p>
                    <p className="text-[17px] font-semibold text-[#1d1d1f]">
                      ${precios.onza.precioOnza.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-3 bg-[#f5f5f7] rounded-xl">
                    <p className="text-[11px] text-[#48484a] mb-0.5">Incremento (+${params.incremento})</p>
                    <p className="text-[17px] font-semibold text-[#1d1d1f]">
                      ${precios.onza.conIncremento.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-3 bg-[#f5f5f7] rounded-xl">
                    <p className="text-[11px] text-[#48484a] mb-0.5">Por Gramo (/31.1035)</p>
                    <p className="text-[17px] font-semibold text-[#1d1d1f]">
                      ${precios.onza.porGramo.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 10K & 14K side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 10K Breakdown */}
                <div>
                  <p className="text-[11px] font-bold text-[#B8942E] uppercase tracking-wider mb-3">10 KT</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2.5 bg-[#f5f5f7] rounded-lg">
                      <span className="text-[12px] text-[#48484a]">x Ley (0.417)</span>
                      <span className="text-[13px] font-semibold text-[#1d1d1f]">${precios.kt10.ley.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-[#f5f5f7] rounded-lg">
                      <span className="text-[12px] text-[#48484a]">Labor Promedio (+${params.labor})</span>
                      <span className="text-[13px] font-semibold text-[#1d1d1f]">${precios.kt10.labor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-[#f5f5f7] rounded-lg">
                      <span className="text-[12px] text-[#48484a]">Ganancia (x ${params.ganancia})</span>
                      <span className="text-[13px] font-semibold text-[#1d1d1f]">${precios.kt10.ganancia.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-[#FFF8E7] rounded-lg border border-[#B8942E]/20">
                      <span className="text-[12px] font-bold text-[#B8942E]">BASE 10K</span>
                      <span className="text-[17px] font-bold text-[#B8942E]">${precios.kt10.base}</span>
                    </div>
                  </div>
                </div>

                {/* 14K Breakdown */}
                <div>
                  <p className="text-[11px] font-bold text-[#D4A853] uppercase tracking-wider mb-3">14 KT</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2.5 bg-[#f5f5f7] rounded-lg">
                      <span className="text-[12px] text-[#48484a]">x Ley (0.585)</span>
                      <span className="text-[13px] font-semibold text-[#1d1d1f]">${precios.kt14.ley.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-[#f5f5f7] rounded-lg">
                      <span className="text-[12px] text-[#48484a]">Labor Promedio (+${params.labor})</span>
                      <span className="text-[13px] font-semibold text-[#1d1d1f]">${precios.kt14.labor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-[#f5f5f7] rounded-lg">
                      <span className="text-[12px] text-[#48484a]">Ganancia (x ${params.ganancia})</span>
                      <span className="text-[13px] font-semibold text-[#1d1d1f]">${precios.kt14.ganancia.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-[#FFF8E7] rounded-lg border border-[#D4A853]/20">
                      <span className="text-[12px] font-bold text-[#D4A853]">BASE 14K</span>
                      <span className="text-[17px] font-bold text-[#D4A853]">${precios.kt14.base}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── PARAMETROS ─── */}
      {can('edit_oro_params') && (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#f9f9fb] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-[#48484a]" />
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Parametros de Calculo</h3>
          </div>
          {showSettings ? (
            <ChevronUp className="w-5 h-5 text-[#48484a]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#48484a]" />
          )}
        </button>

        {showSettings && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Incremento</label>
                <div className="flex items-center mt-1.5 bg-[#f5f5f7] rounded-xl px-3 py-2.5">
                  <span className="text-[13px] text-[#48484a] mr-1">+$</span>
                  <input
                    type="number"
                    value={params.incremento}
                    onChange={(e) => updateParam('incremento', e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[14px] font-semibold text-[#1d1d1f] w-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Labor</label>
                <div className="flex items-center mt-1.5 bg-[#f5f5f7] rounded-xl px-3 py-2.5">
                  <span className="text-[13px] text-[#48484a] mr-1">+$</span>
                  <input
                    type="number"
                    value={params.labor}
                    onChange={(e) => updateParam('labor', e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[14px] font-semibold text-[#1d1d1f] w-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Ganancia</label>
                <div className="flex items-center mt-1.5 bg-[#f5f5f7] rounded-xl px-3 py-2.5">
                  <span className="text-[13px] text-[#48484a] mr-1">x</span>
                  <input
                    type="number"
                    step="0.01"
                    value={params.ganancia}
                    onChange={(e) => updateParam('ganancia', e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[14px] font-semibold text-[#1d1d1f] w-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Tarifa Turkia</label>
                <div className="flex items-center mt-1.5 bg-[#FFF8E7] rounded-xl px-3 py-2.5">
                  <span className="text-[13px] text-[#B8942E] mr-1">x</span>
                  <input
                    type="number"
                    step="0.01"
                    value={params.tarifaTurkia}
                    onChange={(e) => updateParam('tarifaTurkia', e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[14px] font-semibold text-[#1d1d1f] w-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Tarifa Italia</label>
                <div className="flex items-center mt-1.5 bg-[#EDF4FB] rounded-xl px-3 py-2.5">
                  <span className="text-[13px] text-[#5B8DB8] mr-1">x</span>
                  <input
                    type="number"
                    step="0.01"
                    value={params.tarifaItalia}
                    onChange={(e) => updateParam('tarifaItalia', e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[14px] font-semibold text-[#1d1d1f] w-full"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => setParams(DEFAULT_PARAMS)}
              className="mt-4 text-[12px] text-[#FF3B30] font-medium hover:underline"
            >
              Restaurar valores por defecto
            </button>
          </div>
        )}
      </div>
      )}

      {/* ─── GRAFICO HISTORICO ─── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Historial — Ultimos 10 Dias</h3>
        <ChartContainer height={288}>
          {(w, h) => (
            <AreaChart width={w} height={h} data={historialOro10Dias}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9B7D2E" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#9B7D2E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
              <XAxis dataKey="fecha" tick={{ fill: '#48484a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#48484a', fontSize: 12 }} axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="xauUsd" stroke="#9B7D2E" strokeWidth={2} fill="url(#goldGrad)" name="XAU/USD" />
            </AreaChart>
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
