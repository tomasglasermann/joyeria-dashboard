import { useData } from '../contexts/DataContext'

export default function DataSourceBadge() {
  const { qbConnected, qbLoading, companyName } = useData()

  if (qbLoading) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-blue-700">Sincronizando...</span>
      </div>
    )
  }

  if (qbConnected) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-[10px] font-semibold text-green-700">QuickBooks</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
      <div className="w-2 h-2 rounded-full bg-amber-500" />
      <span className="text-[10px] font-semibold text-amber-700">Datos de prueba</span>
    </div>
  )
}
