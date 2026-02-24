export function exportarCSV(ventas, vendedores, clienteVendedor, tasasComision) {
  const getVendor = (cliente) => {
    const vendorId = clienteVendedor[cliente]
    return vendedores.find(v => v.id === vendorId)
  }

  const headers = ['Vendedor', '% Comision', 'Cliente', 'Canal', 'Material', 'Monto', 'Comision', 'Fecha']
  let totalComision = 0

  const rows = ventas.map(v => {
    const vendor = getVendor(v.cliente)
    const tasa = vendor ? (tasasComision[vendor.id] ?? vendor.comision) / 100 : 0
    const comision = v.monto * tasa
    totalComision += comision
    return [
      vendor ? vendor.nombre : 'Sin asignar',
      vendor ? `${(tasasComision[vendor.id] ?? vendor.comision).toFixed(2)}%` : '0%',
      v.cliente,
      v.canal,
      v.material,
      v.monto.toFixed(2),
      comision.toFixed(2),
      v.fecha,
    ]
  })

  const totalMonto = ventas.reduce((s, v) => s + v.monto, 0)
  rows.push(['', '', '', '', 'TOTAL', totalMonto.toFixed(2), totalComision.toFixed(2), ''])

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `comisiones_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
