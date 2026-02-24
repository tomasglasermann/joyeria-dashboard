const colors = {
  'Oro 10K': { bg: '#FFF8E7', text: '#92710D', border: '#F0DFA0' },
  'Oro 14K': { bg: '#FFF3D6', text: '#7A6209', border: '#E8D5A3' },
  'Brillantería': { bg: '#EDF4FB', text: '#3A6E99', border: '#C3DBF0' },
}

export default function MaterialBadge({ material }) {
  const c = colors[material] || { bg: '#F5F5F7', text: '#48484a', border: '#E5E5EA' }
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {material}
    </span>
  )
}
