import { TrendingUp, TrendingDown } from 'lucide-react'

export default function SparklineCard({ title, value, cambio, color, prefix = '$' }) {
  const formattedValue = `${prefix}${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <p className="text-[13px] font-medium text-[#48484a] mb-1">{title}</p>
      <p className="text-[26px] font-semibold text-[#1d1d1f] tracking-tight">{formattedValue}</p>
      <div className={`flex items-center gap-1 mt-1 text-[12px] font-medium ${cambio >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
        {cambio >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {cambio >= 0 ? '+' : ''}{cambio}%
      </div>
    </div>
  )
}
