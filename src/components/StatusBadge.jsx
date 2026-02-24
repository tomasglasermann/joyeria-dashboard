const statusConfig = {
  completada: { bg: '#E8FAF0', text: '#1A7F44', border: '#B8ECD0', label: 'Completada' },
  enviada: { bg: '#FFF8E7', text: '#92710D', border: '#F0DFA0', label: 'Enviada' },
  pendiente: { bg: '#FFF4EB', text: '#B35C14', border: '#FDDCB5', label: 'Pendiente' },
  vencido: { bg: '#FEECEC', text: '#CC2D2D', border: '#FDC4C4', label: 'Vencido' },
  vencida: { bg: '#FEECEC', text: '#CC2D2D', border: '#FDC4C4', label: 'Vencida' },
  pagada: { bg: '#E8FAF0', text: '#1A7F44', border: '#B8ECD0', label: 'Pagada' },
  parcial: { bg: '#FFF8E7', text: '#92710D', border: '#F0DFA0', label: 'Parcial' },
  al_dia: { bg: '#E8FAF0', text: '#1A7F44', border: '#B8ECD0', label: 'Al dia' },
  proximo: { bg: '#FFF8E7', text: '#92710D', border: '#F0DFA0', label: 'Proximo' },
}

export default function StatusBadge({ status }) {
  const c = statusConfig[status] || statusConfig.pendiente
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {c.label}
    </span>
  )
}
