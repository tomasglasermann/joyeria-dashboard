import { Settings } from 'lucide-react'

export default function Configuracion() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-7 h-7 text-[#9B7D2E]" strokeWidth={1.8} />
        <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">Configuracion</h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e5e7] p-8 shadow-sm">
        <p className="text-[#48484a] text-[15px]">Pagina de configuracion en desarrollo.</p>
      </div>
    </div>
  )
}
