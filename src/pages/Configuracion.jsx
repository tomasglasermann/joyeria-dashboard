import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link2, Unlink, RefreshCw, CheckCircle2, AlertCircle, Clock, Package } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useRole } from '../hooks/useRole'
import * as qbService from '../services/quickbooksService'

export default function Configuracion() {
  const { qbConnected, companyName, lastSyncAt, qbLoading, qbError, refresh, resetToMock, checkConnection } = useData()
  const { can } = useRole()
  const [searchParams] = useSearchParams()
  const [syncing, setSyncing] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [toast, setToast] = useState(null)

  // Check for callback params
  useEffect(() => {
    const qbParam = searchParams.get('qb')
    if (qbParam === 'connected') {
      setToast({ type: 'success', message: `QuickBooks conectado: ${searchParams.get('company') || ''}` })
      checkConnection()
    } else if (qbParam === 'error') {
      setToast({ type: 'error', message: `Error conectando QuickBooks: ${searchParams.get('msg') || 'desconocido'}` })
    }
  }, [searchParams])

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleConnect = () => {
    window.location.href = '/api/qb/auth'
  }

  const handleDisconnect = async () => {
    if (!confirm('Estas seguro de desconectar QuickBooks? El dashboard volvera a mostrar datos de prueba.')) return
    setDisconnecting(true)
    try {
      await qbService.disconnectQB()
      resetToMock()
      setToast({ type: 'success', message: 'QuickBooks desconectado' })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    } finally {
      setDisconnecting(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const result = await qbService.triggerSync()
      setSyncResult(result)
      await refresh()
      setToast({ type: 'success', message: `Sincronizado: ${result.stats.clientes} clientes, ${result.stats.facturas} facturas` })
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    } finally {
      setSyncing(false)
    }
  }

  const loadItems = async () => {
    setLoadingItems(true)
    try {
      const data = await qbService.getQBItems()
      setItems(data.items || [])
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    } finally {
      setLoadingItems(false)
    }
  }

  const handleItemMapping = async (itemId, itemName, category) => {
    try {
      await qbService.saveItemMapping(itemId, itemName, category)
      setItems(prev => prev.map(i =>
        i.id === itemId ? { ...i, materialCategory: category } : i
      ))
    } catch (err) {
      setToast({ type: 'error', message: err.message })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Configuracion</h2>
        <p className="text-[15px] text-[#48484a] mt-1">Integraciones y ajustes del sistema</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-medium ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* QuickBooks Integration Card */}
      <div className="bg-white rounded-2xl border border-[#e5e5e7] p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* QB Logo */}
            <div className="w-14 h-14 rounded-2xl bg-[#2CA01C] flex items-center justify-center">
              <span className="text-white text-[22px] font-bold">QB</span>
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#1d1d1f]">QuickBooks Online</h3>
              <p className="text-[13px] text-[#48484a] mt-0.5">
                {qbConnected
                  ? `Conectado a ${companyName || 'QuickBooks'}`
                  : 'Conecta tu cuenta para sincronizar datos reales'
                }
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold ${
            qbConnected
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-100 text-[#48484a] border border-[#e5e5e7]'
          }`}>
            <div className={`w-2 h-2 rounded-full ${qbConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            {qbConnected ? 'Conectado' : 'Desconectado'}
          </div>
        </div>

        {/* Connected State */}
        {qbConnected && (
          <div className="mt-5 space-y-4">
            {/* Last Sync */}
            <div className="flex items-center gap-2 text-[13px] text-[#48484a]">
              <Clock className="w-4 h-4" />
              Ultima sincronizacion: {lastSyncAt ? new Date(lastSyncAt).toLocaleString('es-US') : 'Nunca'}
            </div>

            {/* Sync Result */}
            {syncResult && (
              <div className="bg-[#f5f5f7] rounded-xl px-4 py-3 text-[13px] text-[#1d1d1f]">
                <span className="font-medium">Resultado:</span> {syncResult.stats.clientes} clientes, {syncResult.stats.facturas} facturas, {syncResult.stats.recibos} recibos, {syncResult.stats.proveedores} proveedores
              </div>
            )}

            {/* Action Buttons */}
            {can('manage_integrations') && (
              <div className="flex gap-3">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#9B7D2E] text-white text-[13px] font-semibold rounded-xl hover:bg-[#8A6F28] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#FF3B30] text-[13px] font-semibold rounded-xl border border-[#FF3B30]/30 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Unlink className="w-4 h-4" />
                  {disconnecting ? 'Desconectando...' : 'Desconectar'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Disconnected State */}
        {!qbConnected && can('manage_integrations') && (
          <div className="mt-5">
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-5 py-3 bg-[#2CA01C] text-white text-[14px] font-semibold rounded-xl hover:bg-[#259217] transition-colors shadow-sm"
            >
              <Link2 className="w-5 h-5" />
              Conectar QuickBooks
            </button>
            <p className="text-[12px] text-[#86868b] mt-2">
              Seras redirigido a Intuit para autorizar el acceso a tu cuenta de QuickBooks.
            </p>
          </div>
        )}

        {!qbConnected && !can('manage_integrations') && (
          <div className="mt-5 px-4 py-3 bg-[#f5f5f7] rounded-xl text-[13px] text-[#48484a]">
            Solo un administrador puede conectar QuickBooks. Contacta al admin de tu equipo.
          </div>
        )}
      </div>

      {/* Item Mapping Section (only if connected and admin) */}
      {qbConnected && can('manage_integrations') && (
        <div className="bg-white rounded-2xl border border-[#e5e5e7] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#9B7D2E]" />
              <div>
                <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Mapeo de Productos</h3>
                <p className="text-[12px] text-[#48484a]">Asigna cada producto de QuickBooks a una categoria de material</p>
              </div>
            </div>
            <button
              onClick={loadItems}
              disabled={loadingItems}
              className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#9B7D2E] bg-[#FFF8E7] rounded-xl hover:bg-[#FFF0CC] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingItems ? 'animate-spin' : ''}`} />
              {loadingItems ? 'Cargando...' : 'Cargar Items'}
            </button>
          </div>

          {items.length > 0 && (
            <div className="border border-[#e5e5e7] rounded-xl overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-[#f5f5f7] text-[#48484a] text-left">
                    <th className="px-4 py-2.5 font-semibold">Producto QB</th>
                    <th className="px-4 py-2.5 font-semibold">Tipo</th>
                    <th className="px-4 py-2.5 font-semibold">Precio</th>
                    <th className="px-4 py-2.5 font-semibold">Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-t border-[#e5e5e7] hover:bg-[#fafafa]">
                      <td className="px-4 py-2.5 font-medium text-[#1d1d1f]">{item.name}</td>
                      <td className="px-4 py-2.5 text-[#48484a]">{item.type}</td>
                      <td className="px-4 py-2.5 text-[#48484a]">${item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-2.5">
                        <select
                          value={item.materialCategory || ''}
                          onChange={(e) => handleItemMapping(item.id, item.name, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-[#e5e5e7] text-[12px] bg-white"
                        >
                          <option value="">Sin asignar</option>
                          <option value="oro10k">Oro 10K</option>
                          <option value="oro14k">Oro 14K</option>
                          <option value="brillanteria">Brillanteria</option>
                          <option value="otro">Otro</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {items.length === 0 && !loadingItems && (
            <p className="text-[13px] text-[#86868b] text-center py-6">
              Haz clic en "Cargar Items" para ver los productos de QuickBooks
            </p>
          )}
        </div>
      )}

      {/* Data Source Info */}
      <div className="bg-white rounded-2xl border border-[#e5e5e7] p-6 shadow-sm">
        <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-3">Fuente de Datos</h3>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
          qbConnected ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className={`w-3 h-3 rounded-full ${qbConnected ? 'bg-green-500' : 'bg-amber-500'}`} />
          <div>
            <p className="text-[14px] font-medium text-[#1d1d1f]">
              {qbConnected ? 'Datos reales de QuickBooks' : 'Datos de prueba (Mock Data)'}
            </p>
            <p className="text-[12px] text-[#48484a]">
              {qbConnected
                ? 'El dashboard muestra datos sincronizados desde tu cuenta de QuickBooks'
                : 'El dashboard muestra datos de ejemplo. Conecta QuickBooks para ver datos reales.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Error display */}
      {qbError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-[14px] font-medium text-red-800">Error de QuickBooks</p>
            <p className="text-[12px] text-red-600">{qbError}</p>
          </div>
        </div>
      )}
    </div>
  )
}
