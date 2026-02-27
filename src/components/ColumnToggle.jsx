import { useState, useRef, useEffect } from 'react'
import { SlidersHorizontal } from 'lucide-react'

export default function ColumnToggle({ columns, visibleColumns, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const toggle = (key) => {
    const next = visibleColumns.includes(key)
      ? visibleColumns.filter(k => k !== key)
      : [...visibleColumns, key]
    onChange(next)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`p-2.5 rounded-xl transition-colors ${open ? 'bg-[#e8e8ed]' : 'bg-[#f5f5f7] hover:bg-[#e8e8ed]'}`}
        title="Columnas visibles"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#48484a]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#f0f0f5] py-2 min-w-[200px] z-50">
          <p className="px-3 py-1.5 text-[11px] font-semibold text-[#aeaeb2] uppercase tracking-wider">Columnas</p>
          {columns.map(col => (
            <label
              key={col.key}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#f9f9fb] cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.key)}
                onChange={() => toggle(col.key)}
                disabled={col.locked}
                className="w-3.5 h-3.5 rounded accent-[#9B7D2E]"
              />
              <span className={`text-[13px] ${col.locked ? 'text-[#aeaeb2]' : 'text-[#1d1d1f]'} font-medium`}>
                {col.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
