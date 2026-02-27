const colors = {
  'Alquiler':                      { bg: '#FFF4EB', text: '#B35C14', border: '#FDDCB5' },
  'Internet / Telecomunicaciones': { bg: '#EDF4FB', text: '#3A6E99', border: '#C3DBF0' },
  'Marketing / Publicidad':        { bg: '#F3E8FB', text: '#7B4EA3', border: '#D8C4F0' },
  'Seguros':                       { bg: '#E8FAF0', text: '#1A7F44', border: '#B8ECD0' },
  'Servicios Profesionales':       { bg: '#FFF8E7', text: '#92710D', border: '#F0DFA0' },
  'Software / Tecnologia':         { bg: '#EDF4FB', text: '#3A6E99', border: '#C3DBF0' },
  'Envio / Logistica':             { bg: '#FFF4EB', text: '#B35C14', border: '#FDDCB5' },
  'Mantenimiento':                 { bg: '#F5F5F7', text: '#48484a', border: '#E5E5EA' },
  'Suministros de Oficina':        { bg: '#F5F5F7', text: '#48484a', border: '#E5E5EA' },
  'Servicios Publicos':            { bg: '#EDF4FB', text: '#3A6E99', border: '#C3DBF0' },
  'Limpieza':                      { bg: '#E8FAF0', text: '#1A7F44', border: '#B8ECD0' },
  'Otros':                         { bg: '#F5F5F7', text: '#48484a', border: '#E5E5EA' },
}

export default function CategoriaBadge({ categoria }) {
  const c = colors[categoria] || { bg: '#F5F5F7', text: '#48484a', border: '#E5E5EA' }
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {categoria}
    </span>
  )
}
