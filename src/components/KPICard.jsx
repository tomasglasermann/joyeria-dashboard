import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KPICard({ title, value, icon: Icon, prefix = '$', cambio, subtitle }) {
  const formattedValue = typeof value === 'number'
    ? `${prefix}${value.toLocaleString('en-US', { minimumFractionDigits: prefix === '$' ? 2 : 0, maximumFractionDigits: 2 })}`
    : value

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[#48484a]">{title}</p>
          <p className="text-[26px] font-semibold text-[#1d1d1f] mt-1 tracking-tight">{formattedValue}</p>
          {cambio !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-[12px] font-medium ${cambio >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
              {cambio >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {cambio >= 0 ? '+' : ''}{cambio}% vs mes anterior
            </div>
          )}
          {subtitle && <p className="text-[12px] text-[#aeaeb2] mt-2">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-[#f5f5f7]">
            <Icon className="w-5 h-5 text-[#48484a]" strokeWidth={1.8} />
          </div>
        )}
      </div>
    </div>
  )
}
