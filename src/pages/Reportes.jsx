import { useState, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, ChevronRight, Download, FileSpreadsheet, FileText, Loader2,
} from 'lucide-react'
import { useData } from '../contexts/DataContext'
import {
  loadLogoAsBase64, createPDFDocument, addHeader, addFooter,
  addSectionTitle, addKPIBoxes, addStyledTable, fmtMoney, savePDF,
} from '../utils/exportPDF'

const MONTHS = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTHS_FULL = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
// YEARS is now computed inside the component via useMemo
const MATERIALS = [
  { key: 'oro10k', label: 'Oro 10K', color: '#D4A853' },
  { key: 'oro14k', label: 'Oro 14K', color: '#C9A84C' },
  { key: 'brillanteria', label: 'Brillanteria', color: '#7EB5D6' },
]

function pct(cur, prev) {
  if (!prev) return null
  return ((cur - prev) / prev * 100)
}

function Change({ value, size = 'sm' }) {
  if (value === null || value === undefined) return <span className="text-[#aeaeb2]">—</span>
  const up = value >= 0
  const cls = size === 'lg'
    ? `inline-flex items-center gap-1 text-[14px] font-bold ${up ? 'text-[#34C759]' : 'text-[#FF3B30]'}`
    : `inline-flex items-center gap-0.5 text-[12px] font-semibold ${up ? 'text-[#34C759]' : 'text-[#FF3B30]'}`
  return (
    <span className={cls}>
      {up ? <TrendingUp className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} /> : <TrendingDown className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />}
      {up ? '+' : ''}{value.toFixed(1)}%
    </span>
  )
}

function $$(n) { return '$' + (n || 0).toLocaleString() }

function downloadCSV(filename, headers, rows) {
  const bom = '\uFEFF'
  const csv = bom + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Shared data computation helpers ───

function getComprasForDate(fecha) {
  const results = []
  for (const cli of clientesVentas) {
    for (const c of cli.compras) {
      if (c.fecha === fecha) {
        results.push({ cliente: cli.nombre, tipo: cli.tipo, ...c })
      }
    }
  }
  return results
}

function getComprasForMonth(year, month) {
  const results = []
  for (const cli of clientesVentas) {
    for (const c of cli.compras) {
      const [y, m] = c.fecha.split('-').map(Number)
      if (y === year && m === month) {
        results.push({ cliente: cli.nombre, tipo: cli.tipo, ...c })
      }
    }
  }
  return results
}

function computeGramos(compras) {
  const totalGramos = compras.reduce((a, c) => a + c.pesoOroGramos, 0)
  const totalOroMonto = compras.reduce((a, c) => a + c.desglose.oro10k.monto + c.desglose.oro14k.monto, 0)
  const avgPorGramo = totalGramos > 0 ? (totalOroMonto / totalGramos).toFixed(2) : '0'
  return { totalGramos, totalOroMonto, avgPorGramo }
}

function groupByCliente(compras) {
  const porCliente = {}
  for (const c of compras) {
    if (!porCliente[c.cliente]) {
      porCliente[c.cliente] = { tipo: c.tipo, compras: 0, totalComprado: 0, pendiente: 0, pagado: 0, gramos: 0 }
    }
    const cli = porCliente[c.cliente]
    cli.compras++
    cli.totalComprado += c.monto
    cli.gramos += c.pesoOroGramos
    if (c.factura.estado === 'pagada') {
      cli.pagado += c.factura.montoPagado
    } else {
      cli.pendiente += (c.factura.monto - c.factura.montoPagado)
    }
  }
  return porCliente
}

function groupByVendedor(compras) {
  const porVendedor = {}
  for (const c of compras) {
    const v = c.vendedor || 'Sin asignar'
    if (!porVendedor[v]) porVendedor[v] = { ventas: 0, monto: 0, gramos: 0 }
    porVendedor[v].ventas++
    porVendedor[v].monto += c.monto
    porVendedor[v].gramos += c.pesoOroGramos
  }
  return porVendedor
}

export default function Reportes() {
  const { datosMensuales, ventasDiarias, clientesVentas } = useData()
  const YEARS = useMemo(() => [...new Set(datosMensuales.map(d => d.year))].sort(), [datosMensuales])
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const prevYear = selectedYear - 1

  // Download state
  const [dlFecha, setDlFecha] = useState('2026-02-23')
  const [dlMesYear, setDlMesYear] = useState(2026)
  const [dlMes, setDlMes] = useState(2)
  const [dlAnoYear, setDlAnoYear] = useState(2026)
  const [pdfLoading, setPdfLoading] = useState(null)

  // ─── CSV Handlers ───

  const handleDownloadDiario = () => {
    const compras = getComprasForDate(dlFecha)
    const dia = ventasDiarias.find(d => d.fecha === dlFecha)
    const { totalGramos, totalOroMonto, avgPorGramo } = computeGramos(compras)

    const rows = []
    rows.push(['REPORTE DIARIO - VICENZA MIAMI'])
    rows.push([`Fecha: ${dlFecha}`])
    rows.push([])
    if (dia) {
      rows.push(['RESUMEN DEL DIA'])
      rows.push(['Oro 10K ($)', 'Oro 14K ($)', 'Brillanteria ($)', 'Total ($)'])
      rows.push([dia.oro10k, dia.oro14k, dia.brillanteria, dia.total])
      rows.push([])
    }
    if (compras.length > 0) {
      rows.push(['RESUMEN DE GRAMOS'])
      rows.push(['Total Gramos Oro', 'Total Oro ($)', 'Promedio $/Gramo'])
      rows.push([totalGramos.toFixed(1), totalOroMonto, avgPorGramo])
      rows.push([])
    }
    rows.push(['DETALLE POR CLIENTE'])
    rows.push(['Cliente', 'Tipo', 'Canal', 'Vendedor', 'Monto ($)', 'Gramos Oro', 'Oro 10K (g)', 'Oro 10K ($)', 'Oro 14K (g)', 'Oro 14K ($)', 'Brillanteria (pz)', 'Brillanteria ($)', 'Factura', 'Estado'])
    if (compras.length > 0) {
      for (const c of compras) {
        rows.push([c.cliente, c.tipo, c.canal, c.vendedor || '', c.monto, c.pesoOroGramos, c.desglose.oro10k.gramos, c.desglose.oro10k.monto, c.desglose.oro14k.gramos, c.desglose.oro14k.monto, c.desglose.brillanteria.piezas, c.desglose.brillanteria.monto, c.factura.id, c.factura.estado])
      }
      rows.push([])
      rows.push(['TOTAL', '', '', '', compras.reduce((a, c) => a + c.monto, 0), totalGramos.toFixed(1)])
    } else {
      rows.push(['Sin ventas registradas este dia'])
    }
    downloadCSV(`Vicenza_Reporte_${dlFecha}.csv`, [], rows)
  }

  const handleDownloadMensual = () => {
    const mesStr = MONTHS_FULL[dlMes]
    const compras = getComprasForMonth(dlMesYear, dlMes)
    const resumen = datosMensuales.find(d => d.year === dlMesYear && d.month === dlMes)
    const porCliente = groupByCliente(compras)
    const porVendedor = groupByVendedor(compras)
    const { totalGramos: totalGramosMes, totalOroMonto: totalOroMontoMes, avgPorGramo: avgPorGramoMes } = computeGramos(compras)

    const rows = []
    rows.push([`REPORTE MENSUAL - VICENZA MIAMI`])
    rows.push([`Periodo: ${mesStr} ${dlMesYear}`])
    rows.push([])
    if (resumen) {
      rows.push(['RESUMEN DEL MES'])
      rows.push(['Oro 10K ($)', 'Oro 14K ($)', 'Brillanteria ($)', 'Total ($)'])
      rows.push([resumen.oro10k, resumen.oro14k, resumen.brillanteria, resumen.total])
      rows.push([])
    }
    rows.push(['RESUMEN DE GRAMOS'])
    rows.push(['Total Gramos Oro', 'Total Oro ($)', 'Promedio $/Gramo'])
    rows.push([totalGramosMes.toFixed(1), totalOroMontoMes, avgPorGramoMes])
    rows.push([])
    rows.push(['RESUMEN POR VENDEDOR'])
    rows.push(['Vendedor', '# Ventas', 'Monto Total ($)', 'Gramos Oro'])
    for (const v of Object.keys(porVendedor).sort()) {
      rows.push([v, porVendedor[v].ventas, porVendedor[v].monto, porVendedor[v].gramos.toFixed(1)])
    }
    rows.push([])
    rows.push(['RESUMEN POR CLIENTE'])
    rows.push(['Cliente', 'Tipo', '# Compras', 'Total Comprado ($)', 'Gramos Oro', 'Pagado ($)', 'Pendiente por Pagar ($)'])
    for (const nombre of Object.keys(porCliente).sort()) {
      const c = porCliente[nombre]
      rows.push([nombre, c.tipo, c.compras, c.totalComprado, c.gramos.toFixed(1), c.pagado, c.pendiente])
    }
    const totComp = compras.reduce((a, c) => a + c.monto, 0)
    const totPend = Object.values(porCliente).reduce((a, c) => a + c.pendiente, 0)
    const totPag = Object.values(porCliente).reduce((a, c) => a + c.pagado, 0)
    rows.push(['TOTAL', '', compras.length, totComp, totalGramosMes.toFixed(1), totPag, totPend])
    rows.push([])
    rows.push(['DETALLE DE COMPRAS'])
    rows.push(['Fecha', 'Cliente', 'Canal', 'Vendedor', 'Monto ($)', 'Gramos Oro', 'Oro 10K (g)', 'Oro 10K ($)', 'Oro 14K (g)', 'Oro 14K ($)', 'Brillant. (pz)', 'Brillant. ($)', 'Factura', 'Estado', 'Pendiente ($)'])
    const sorted = [...compras].sort((a, b) => a.fecha.localeCompare(b.fecha))
    for (const c of sorted) {
      const pend = c.factura.estado === 'pagada' ? 0 : (c.factura.monto - c.factura.montoPagado)
      rows.push([c.fecha, c.cliente, c.canal, c.vendedor || '', c.monto, c.pesoOroGramos, c.desglose.oro10k.gramos, c.desglose.oro10k.monto, c.desglose.oro14k.gramos, c.desglose.oro14k.monto, c.desglose.brillanteria.piezas, c.desglose.brillanteria.monto, c.factura.id, c.factura.estado, pend])
    }
    downloadCSV(`Vicenza_Reporte_${mesStr}_${dlMesYear}.csv`, [], rows)
  }

  const handleDownloadAnual = () => {
    const data = datosMensuales.filter(d => d.year === dlAnoYear)
    const comprasAnuales = []
    for (const cli of clientesVentas) {
      for (const c of cli.compras) {
        if (Number(c.fecha.split('-')[0]) === dlAnoYear) {
          comprasAnuales.push({ cliente: cli.nombre, tipo: cli.tipo, ...c })
        }
      }
    }
    const porCliente = {}
    for (const c of comprasAnuales) {
      if (!porCliente[c.cliente]) porCliente[c.cliente] = { tipo: c.tipo, compras: 0, total: 0, gramos: 0, pendiente: 0 }
      porCliente[c.cliente].compras++
      porCliente[c.cliente].total += c.monto
      porCliente[c.cliente].gramos += c.pesoOroGramos
      if (c.factura.estado !== 'pagada') porCliente[c.cliente].pendiente += (c.factura.monto - c.factura.montoPagado)
    }
    const porVendedor = groupByVendedor(comprasAnuales)
    const { totalGramos, totalOroMonto, avgPorGramo } = computeGramos(comprasAnuales)

    const rows = []
    rows.push([`REPORTE ANUAL - VICENZA MIAMI`])
    rows.push([`Ano: ${dlAnoYear}`])
    rows.push([])
    rows.push(['RESUMEN POR MES'])
    rows.push(['Mes', 'Oro 10K ($)', 'Oro 14K ($)', 'Brillanteria ($)', 'Total ($)'])
    for (const d of data) rows.push([d.mes, d.oro10k, d.oro14k, d.brillanteria, d.total])
    const totals = data.reduce((a, d) => ({ oro10k: a.oro10k + d.oro10k, oro14k: a.oro14k + d.oro14k, brillanteria: a.brillanteria + d.brillanteria, total: a.total + d.total }), { oro10k: 0, oro14k: 0, brillanteria: 0, total: 0 })
    rows.push([`TOTAL ${dlAnoYear}`, totals.oro10k, totals.oro14k, totals.brillanteria, totals.total])
    rows.push([])
    rows.push(['RESUMEN DE GRAMOS'])
    rows.push(['Total Gramos Oro', 'Total Oro ($)', 'Promedio $/Gramo'])
    rows.push([totalGramos.toFixed(1), totalOroMonto, avgPorGramo])
    rows.push([])
    rows.push(['RESUMEN POR VENDEDOR'])
    rows.push(['Vendedor', '# Ventas', 'Monto Total ($)', 'Gramos Oro'])
    for (const v of Object.keys(porVendedor).sort()) rows.push([v, porVendedor[v].ventas, porVendedor[v].monto, porVendedor[v].gramos.toFixed(1)])
    rows.push([])
    rows.push(['RESUMEN POR CLIENTE'])
    rows.push(['Cliente', 'Tipo', '# Compras', 'Total Comprado ($)', 'Gramos Oro', 'Pendiente ($)'])
    for (const nombre of Object.keys(porCliente).sort()) {
      const c = porCliente[nombre]
      rows.push([nombre, c.tipo, c.compras, c.total, c.gramos.toFixed(1), c.pendiente])
    }
    downloadCSV(`Vicenza_Reporte_${dlAnoYear}.csv`, [], rows)
  }

  // ─── PDF Handlers ───
  const $ = fmtMoney // local alias for PDF money formatting

  const handleDownloadDiarioPDF = async () => {
    setPdfLoading('diario')
    try {
      const logoBase64 = await loadLogoAsBase64()
      const compras = getComprasForDate(dlFecha)
      const dia = ventasDiarias.find(d => d.fecha === dlFecha)
      const { totalGramos, totalOroMonto, avgPorGramo } = computeGramos(compras)

      const doc = createPDFDocument('landscape')
      let y = addHeader(doc, logoBase64, 'REPORTE DIARIO', 'Detalle de ventas del dia', `Fecha: ${dlFecha}`)

      // KPI Boxes
      if (dia) {
        y = addKPIBoxes(doc, [
          { label: 'Total del Dia', value: $(dia.total) },
          { label: 'Oro 10K', value: $(dia.oro10k) },
          { label: 'Oro 14K', value: $(dia.oro14k) },
          { label: 'Brillanteria', value: $(dia.brillanteria) },
        ], y)
      }

      // Gramos summary
      if (compras.length > 0) {
        y = addSectionTitle(doc, 'RESUMEN DE GRAMOS', y)
        y = addKPIBoxes(doc, [
          { label: 'Total Gramos Oro', value: totalGramos.toFixed(1), subtext: 'gramos' },
          { label: 'Total Oro ($)', value: $(totalOroMonto) },
          { label: 'Promedio $/Gramo', value: `$${avgPorGramo}` },
        ], y)
      }

      // Client detail table
      y = addSectionTitle(doc, 'DETALLE POR CLIENTE', y)
      if (compras.length > 0) {
        const cols = ['Cliente', 'Tipo', 'Canal', 'Vendedor', 'Monto ($)', 'Gramos', '10K (g)', '10K ($)', '14K (g)', '14K ($)', 'Brill.', 'Brill. ($)', 'Factura', 'Estado']
        const tableRows = compras.map(c => [
          c.cliente, c.tipo, c.canal, c.vendedor || '',
          $(c.monto), c.pesoOroGramos.toFixed(1),
          c.desglose.oro10k.gramos, $(c.desglose.oro10k.monto),
          c.desglose.oro14k.gramos, $(c.desglose.oro14k.monto),
          c.desglose.brillanteria.piezas, $(c.desglose.brillanteria.monto),
          c.factura.id, c.factura.estado,
        ])
        const totalMonto = compras.reduce((a, c) => a + c.monto, 0)
        y = addStyledTable(doc, cols, tableRows, y, {
          footRow: ['TOTAL', '', '', '', $(totalMonto), totalGramos.toFixed(1), '', '', '', '', '', '', '', ''],
        })
      } else {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(10)
        doc.setTextColor(150, 150, 150)
        doc.text('Sin ventas registradas este dia', 14, y)
      }

      addFooter(doc)
      savePDF(doc, `Vicenza_Reporte_${dlFecha}.pdf`)
    } finally {
      setPdfLoading(null)
    }
  }

  const handleDownloadMensualPDF = async () => {
    setPdfLoading('mensual')
    try {
      const logoBase64 = await loadLogoAsBase64()
      const mesStr = MONTHS_FULL[dlMes]
      const compras = getComprasForMonth(dlMesYear, dlMes)
      const resumen = datosMensuales.find(d => d.year === dlMesYear && d.month === dlMes)
      const porCliente = groupByCliente(compras)
      const porVendedor = groupByVendedor(compras)
      const { totalGramos, totalOroMonto, avgPorGramo } = computeGramos(compras)

      const doc = createPDFDocument('landscape')
      let y = addHeader(doc, logoBase64, 'REPORTE MENSUAL', 'Detalle de ventas del mes', `Periodo: ${mesStr} ${dlMesYear}`)

      // KPI Boxes
      if (resumen) {
        y = addKPIBoxes(doc, [
          { label: 'Total del Mes', value: $(resumen.total) },
          { label: 'Oro 10K', value: $(resumen.oro10k) },
          { label: 'Oro 14K', value: $(resumen.oro14k) },
          { label: 'Brillanteria', value: $(resumen.brillanteria) },
        ], y)
      }

      // Gramos
      y = addSectionTitle(doc, 'RESUMEN DE GRAMOS', y)
      y = addKPIBoxes(doc, [
        { label: 'Total Gramos Oro', value: totalGramos.toFixed(1), subtext: 'gramos' },
        { label: 'Total Oro ($)', value: $(totalOroMonto) },
        { label: 'Promedio $/Gramo', value: `$${avgPorGramo}` },
      ], y)

      // Vendedor table
      y = addSectionTitle(doc, 'RESUMEN POR VENDEDOR', y)
      const vendedorRows = Object.keys(porVendedor).sort().map(v => [
        v, porVendedor[v].ventas, $(porVendedor[v].monto), porVendedor[v].gramos.toFixed(1),
      ])
      y = addStyledTable(doc, ['Vendedor', '# Ventas', 'Monto Total ($)', 'Gramos Oro'], vendedorRows, y, { fontSize: 8.5 })

      // Cliente summary table
      y = addSectionTitle(doc, 'RESUMEN POR CLIENTE', y)
      const clienteNames = Object.keys(porCliente).sort()
      const clienteRows = clienteNames.map(nombre => {
        const c = porCliente[nombre]
        return [nombre, c.tipo, c.compras, $(c.totalComprado), c.gramos.toFixed(1), $(c.pagado), $(c.pendiente)]
      })
      const totComp = compras.reduce((a, c) => a + c.monto, 0)
      const totPag = Object.values(porCliente).reduce((a, c) => a + c.pagado, 0)
      const totPend = Object.values(porCliente).reduce((a, c) => a + c.pendiente, 0)
      y = addStyledTable(doc,
        ['Cliente', 'Tipo', '# Compras', 'Total ($)', 'Gramos', 'Pagado ($)', 'Pendiente ($)'],
        clienteRows, y, {
          fontSize: 8,
          footRow: ['TOTAL', '', compras.length, $(totComp), totalGramos.toFixed(1), $(totPag), $(totPend)],
        }
      )

      // Detail table
      y = addSectionTitle(doc, 'DETALLE DE COMPRAS', y)
      const sorted = [...compras].sort((a, b) => a.fecha.localeCompare(b.fecha))
      const detailRows = sorted.map(c => {
        const pend = c.factura.estado === 'pagada' ? 0 : (c.factura.monto - c.factura.montoPagado)
        return [
          c.fecha, c.cliente, c.canal, c.vendedor || '', $(c.monto), c.pesoOroGramos.toFixed(1),
          c.desglose.oro10k.gramos, $(c.desglose.oro10k.monto),
          c.desglose.oro14k.gramos, $(c.desglose.oro14k.monto),
          c.desglose.brillanteria.piezas, $(c.desglose.brillanteria.monto),
          c.factura.id, c.factura.estado, $(pend),
        ]
      })
      y = addStyledTable(doc,
        ['Fecha', 'Cliente', 'Canal', 'Vendedor', 'Monto', 'Gramos', '10K (g)', '10K ($)', '14K (g)', '14K ($)', 'Brill.', 'Brill. ($)', 'Factura', 'Estado', 'Pend.'],
        detailRows, y, { fontSize: 7 }
      )

      addFooter(doc)
      savePDF(doc, `Vicenza_Reporte_${mesStr}_${dlMesYear}.pdf`)
    } finally {
      setPdfLoading(null)
    }
  }

  const handleDownloadAnualPDF = async () => {
    setPdfLoading('anual')
    try {
      const logoBase64 = await loadLogoAsBase64()
      const data = datosMensuales.filter(d => d.year === dlAnoYear)
      const comprasAnuales = []
      for (const cli of clientesVentas) {
        for (const c of cli.compras) {
          if (Number(c.fecha.split('-')[0]) === dlAnoYear) {
            comprasAnuales.push({ cliente: cli.nombre, tipo: cli.tipo, ...c })
          }
        }
      }
      const porCliente = {}
      for (const c of comprasAnuales) {
        if (!porCliente[c.cliente]) porCliente[c.cliente] = { tipo: c.tipo, compras: 0, total: 0, gramos: 0, pendiente: 0 }
        porCliente[c.cliente].compras++
        porCliente[c.cliente].total += c.monto
        porCliente[c.cliente].gramos += c.pesoOroGramos
        if (c.factura.estado !== 'pagada') porCliente[c.cliente].pendiente += (c.factura.monto - c.factura.montoPagado)
      }
      const porVendedor = groupByVendedor(comprasAnuales)
      const { totalGramos, totalOroMonto, avgPorGramo } = computeGramos(comprasAnuales)

      const doc = createPDFDocument('landscape')
      let y = addHeader(doc, logoBase64, 'REPORTE ANUAL', 'Resumen de ventas del ano', `Ano: ${dlAnoYear}`)

      // Year totals
      const totals = data.reduce((a, d) => ({
        oro10k: a.oro10k + d.oro10k, oro14k: a.oro14k + d.oro14k,
        brillanteria: a.brillanteria + d.brillanteria, total: a.total + d.total
      }), { oro10k: 0, oro14k: 0, brillanteria: 0, total: 0 })

      y = addKPIBoxes(doc, [
        { label: `Total ${dlAnoYear}`, value: $(totals.total) },
        { label: 'Oro 10K', value: $(totals.oro10k) },
        { label: 'Oro 14K', value: $(totals.oro14k) },
        { label: 'Brillanteria', value: $(totals.brillanteria) },
      ], y)

      // Monthly breakdown table
      y = addSectionTitle(doc, 'RESUMEN POR MES', y)
      const monthTableRows = data.map(d => [d.mes, $(d.oro10k), $(d.oro14k), $(d.brillanteria), $(d.total)])
      y = addStyledTable(doc,
        ['Mes', 'Oro 10K ($)', 'Oro 14K ($)', 'Brillanteria ($)', 'Total ($)'],
        monthTableRows, y, {
          fontSize: 9,
          footRow: [`TOTAL ${dlAnoYear}`, $(totals.oro10k), $(totals.oro14k), $(totals.brillanteria), $(totals.total)],
        }
      )

      // Gramos
      y = addSectionTitle(doc, 'RESUMEN DE GRAMOS', y)
      y = addKPIBoxes(doc, [
        { label: 'Total Gramos Oro', value: totalGramos.toFixed(1), subtext: 'gramos' },
        { label: 'Total Oro ($)', value: $(totalOroMonto) },
        { label: 'Promedio $/Gramo', value: `$${avgPorGramo}` },
      ], y)

      // Vendedor table
      y = addSectionTitle(doc, 'RESUMEN POR VENDEDOR', y)
      const vendedorRows = Object.keys(porVendedor).sort().map(v => [
        v, porVendedor[v].ventas, $(porVendedor[v].monto), porVendedor[v].gramos.toFixed(1),
      ])
      y = addStyledTable(doc, ['Vendedor', '# Ventas', 'Monto Total ($)', 'Gramos Oro'], vendedorRows, y, { fontSize: 8.5 })

      // Cliente table
      y = addSectionTitle(doc, 'RESUMEN POR CLIENTE', y)
      const clienteRows = Object.keys(porCliente).sort().map(nombre => {
        const c = porCliente[nombre]
        return [nombre, c.tipo, c.compras, $(c.total), c.gramos.toFixed(1), $(c.pendiente)]
      })
      y = addStyledTable(doc,
        ['Cliente', 'Tipo', '# Compras', 'Total ($)', 'Gramos Oro', 'Pendiente ($)'],
        clienteRows, y, { fontSize: 8.5 }
      )

      addFooter(doc)
      savePDF(doc, `Vicenza_Reporte_${dlAnoYear}.pdf`)
    } finally {
      setPdfLoading(null)
    }
  }

  // ─── Year comparison data ───
  const yearData = useMemo(() => datosMensuales.filter(d => d.year === selectedYear), [selectedYear])
  const prevYearData = useMemo(() => datosMensuales.filter(d => d.year === prevYear), [prevYear])

  const yearTotal = yearData.reduce((a, r) => a + r.total, 0)
  const prevYearTotal = prevYearData.reduce((a, r) => a + r.total, 0)
  const yearAvg = yearData.length ? Math.round(yearTotal / yearData.length) : 0
  const prevYearAvg = prevYearData.length ? Math.round(prevYearTotal / prevYearData.length) : 0

  const bestMonth = yearData.length ? yearData.reduce((a, b) => a.total > b.total ? a : b) : null
  const worstMonth = yearData.length ? yearData.reduce((a, b) => a.total < b.total ? a : b) : null

  const monthRows = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1
      const cur = yearData.find(d => d.month === m)
      const prev = prevYearData.find(d => d.month === m)
      return {
        month: m,
        label: MONTHS[m],
        labelFull: MONTHS_FULL[m],
        cur,
        prev,
        curTotal: cur?.total || 0,
        prevTotal: prev?.total || 0,
        diff: cur && prev ? pct(cur.total, prev.total) : null,
        hasCur: !!cur,
        hasPrev: !!prev,
      }
    })
  }, [yearData, prevYearData])

  const monthDetail = selectedMonth ? monthRows[selectedMonth - 1] : null
  const maxMonthVal = Math.max(...monthRows.map(r => Math.max(r.curTotal, r.prevTotal)), 1)

  // ─── Download button component ───
  const DownloadButtons = ({ onCSV, onPDF, loadingKey }) => (
    <div className="flex gap-2">
      <button
        onClick={onCSV}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] text-[12px] font-semibold rounded-xl hover:bg-[#e8e8ed] transition-colors"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
      </button>
      <button
        onClick={onPDF}
        disabled={pdfLoading === loadingKey}
        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#9B7D2E] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8A6E28] transition-colors disabled:opacity-60"
      >
        {pdfLoading === loadingKey ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generando...</>
        ) : (
          <><FileText className="w-3.5 h-3.5" /> PDF</>
        )}
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header + Year Selector */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Reportes</h2>
          <p className="text-[15px] text-[#48484a] mt-1">Resumen y comparacion de ventas</p>
        </div>
        <div className="flex bg-[#f5f5f7] rounded-xl p-1 gap-0.5">
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => { setSelectedYear(y); setSelectedMonth(null) }}
              className={`px-5 py-2 text-[14px] font-semibold rounded-lg transition-all ${
                selectedYear === y ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#48484a] hover:text-[#1d1d1f]'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Descargar Reportes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Download className="w-5 h-5 text-[#9B7D2E]" />
          <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Descargar Reportes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Diario */}
          <div className="bg-[#f9f9fb] rounded-xl p-4">
            <p className="text-[13px] font-semibold text-[#1d1d1f] mb-1">Reporte Diario</p>
            <p className="text-[11px] text-[#aeaeb2] mb-3">Ventas de un dia especifico</p>
            <input
              type="date"
              value={dlFecha}
              onChange={(e) => setDlFecha(e.target.value)}
              className="w-full px-3 py-2 text-[13px] font-medium text-[#1d1d1f] bg-white rounded-lg border border-[#e5e5ea] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 mb-3"
            />
            <DownloadButtons onCSV={handleDownloadDiario} onPDF={handleDownloadDiarioPDF} loadingKey="diario" />
          </div>

          {/* Mensual */}
          <div className="bg-[#f9f9fb] rounded-xl p-4">
            <p className="text-[13px] font-semibold text-[#1d1d1f] mb-1">Reporte Mensual</p>
            <p className="text-[11px] text-[#aeaeb2] mb-3">Desglose diario de un mes</p>
            <div className="flex gap-2 mb-3">
              <select
                value={dlMes}
                onChange={(e) => setDlMes(Number(e.target.value))}
                className="flex-1 px-3 py-2 text-[13px] font-medium text-[#1d1d1f] bg-white rounded-lg border border-[#e5e5ea] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30"
              >
                {MONTHS_FULL.slice(1).map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={dlMesYear}
                onChange={(e) => setDlMesYear(Number(e.target.value))}
                className="w-24 px-3 py-2 text-[13px] font-medium text-[#1d1d1f] bg-white rounded-lg border border-[#e5e5ea] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30"
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <DownloadButtons onCSV={handleDownloadMensual} onPDF={handleDownloadMensualPDF} loadingKey="mensual" />
          </div>

          {/* Anual */}
          <div className="bg-[#f9f9fb] rounded-xl p-4">
            <p className="text-[13px] font-semibold text-[#1d1d1f] mb-1">Reporte Anual</p>
            <p className="text-[11px] text-[#aeaeb2] mb-3">Resumen mensual del ano</p>
            <select
              value={dlAnoYear}
              onChange={(e) => setDlAnoYear(Number(e.target.value))}
              className="w-full px-3 py-2 text-[13px] font-medium text-[#1d1d1f] bg-white rounded-lg border border-[#e5e5ea] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 mb-3"
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <DownloadButtons onCSV={handleDownloadAnual} onPDF={handleDownloadAnualPDF} loadingKey="anual" />
          </div>
        </div>
      </div>

      {/* Year Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#9B7D2E]" />
            <p className="text-[12px] text-[#48484a] font-medium">Total {selectedYear}</p>
          </div>
          <p className="text-[24px] font-bold text-[#1d1d1f] tracking-tight">{$$(yearTotal)}</p>
          <div className="mt-1">
            <Change value={pct(yearTotal, prevYearTotal)} />
            <span className="text-[11px] text-[#aeaeb2] ml-1">vs {prevYear}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#9B7D2E]" />
            <p className="text-[12px] text-[#48484a] font-medium">Promedio Mensual</p>
          </div>
          <p className="text-[24px] font-bold text-[#1d1d1f] tracking-tight">{$$(yearAvg)}</p>
          <div className="mt-1">
            <Change value={pct(yearAvg, prevYearAvg)} />
            <span className="text-[11px] text-[#aeaeb2] ml-1">vs {prevYear}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#34C759]" />
            <p className="text-[12px] text-[#48484a] font-medium">Mejor Mes</p>
          </div>
          <p className="text-[24px] font-bold text-[#1d1d1f] tracking-tight">{bestMonth ? $$(bestMonth.total) : '—'}</p>
          <p className="text-[12px] text-[#48484a] mt-1">{bestMonth ? bestMonth.mes : ''}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-[#FF3B30]" />
            <p className="text-[12px] text-[#48484a] font-medium">Peor Mes</p>
          </div>
          <p className="text-[24px] font-bold text-[#1d1d1f] tracking-tight">{worstMonth ? $$(worstMonth.total) : '—'}</p>
          <p className="text-[12px] text-[#48484a] mt-1">{worstMonth ? worstMonth.mes : ''}</p>
        </div>
      </div>

      {/* Month Pills - Click to select */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-[#1d1d1f]">{selectedYear} vs {prevYear} — Mes a Mes</h3>
          {selectedMonth && (
            <button onClick={() => setSelectedMonth(null)} className="text-[12px] font-semibold text-[#9B7D2E] hover:underline">
              Ver todos los meses
            </button>
          )}
        </div>
        <div className="grid grid-cols-12 gap-1.5 mb-1">
          {monthRows.map((r) => {
            const isSelected = selectedMonth === r.month
            const hasData = r.hasCur || r.hasPrev
            return (
              <button
                key={r.month}
                onClick={() => setSelectedMonth(isSelected ? null : r.month)}
                disabled={!hasData}
                className={`py-2.5 rounded-xl text-[12px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#9B7D2E] text-white shadow-sm'
                    : hasData
                      ? 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                      : 'bg-[#fafafa] text-[#d1d1d6] cursor-default'
                }`}
              >
                {r.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* MONTH DETAIL VIEW */}
      {monthDetail && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-5">{monthDetail.labelFull}</h3>

          {/* Side by side year cards */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div className="rounded-xl p-5 bg-[#f9f9fb] border-l-4 border-[#9B7D2E]">
              <p className="text-[12px] font-bold text-[#48484a] uppercase tracking-wider mb-2">{prevYear}</p>
              <p className="text-[28px] font-bold text-[#1d1d1f]">{monthDetail.hasPrev ? $$(monthDetail.prevTotal) : '—'}</p>
              {monthDetail.hasPrev && (
                <div className="mt-3 space-y-1.5">
                  {MATERIALS.map(mat => (
                    <div key={mat.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mat.color }} />
                        <span className="text-[12px] text-[#48484a]">{mat.label}</span>
                      </div>
                      <span className="text-[12px] font-semibold text-[#1d1d1f]">{$$(monthDetail.prev?.[mat.key])}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-xl p-5 bg-[#f9f9fb] border-l-4 border-[#5B8DB8]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-bold text-[#48484a] uppercase tracking-wider">{selectedYear}</p>
                {monthDetail.diff !== null && <Change value={monthDetail.diff} size="lg" />}
              </div>
              <p className="text-[28px] font-bold text-[#1d1d1f]">{monthDetail.hasCur ? $$(monthDetail.curTotal) : '—'}</p>
              {monthDetail.hasCur && (
                <div className="mt-3 space-y-1.5">
                  {MATERIALS.map(mat => {
                    const curVal = monthDetail.cur?.[mat.key] || 0
                    const prevVal = monthDetail.prev?.[mat.key] || 0
                    const change = prevVal ? pct(curVal, prevVal) : null
                    return (
                      <div key={mat.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mat.color }} />
                          <span className="text-[12px] text-[#48484a]">{mat.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-[#1d1d1f]">{$$(curVal)}</span>
                          {change !== null && <Change value={change} />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Material bar comparison */}
          <div className="space-y-4">
            {MATERIALS.map(mat => {
              const curVal = monthDetail.cur?.[mat.key] || 0
              const prevVal = monthDetail.prev?.[mat.key] || 0
              const maxBar = Math.max(curVal, prevVal, 1)
              return (
                <div key={mat.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-[#1d1d1f]">{mat.label}</span>
                    {prevVal > 0 && curVal > 0 && <Change value={pct(curVal, prevVal)} />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#aeaeb2] w-8">{prevYear}</span>
                      <div className="flex-1 h-3 bg-[#f2f2f7] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(prevVal / maxBar) * 100}%`, backgroundColor: mat.color, opacity: 0.4 }} />
                      </div>
                      <span className="text-[11px] font-medium text-[#48484a] w-16 text-right">{$$(prevVal)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#aeaeb2] w-8">{selectedYear}</span>
                      <div className="flex-1 h-3 bg-[#f2f2f7] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(curVal / maxBar) * 100}%`, backgroundColor: mat.color }} />
                      </div>
                      <span className="text-[11px] font-semibold text-[#1d1d1f] w-16 text-right">{$$(curVal)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* YEAR COMPARISON TABLE - Always visible */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <BarChart3 className="w-5 h-5 text-[#9B7D2E]" />
          <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Comparacion Anual</h3>
        </div>

        <div className="space-y-2.5">
          {monthRows.map((r) => {
            const isSelected = selectedMonth === r.month
            if (!r.hasCur && !r.hasPrev) return null
            return (
              <button
                key={r.month}
                onClick={() => setSelectedMonth(isSelected ? null : r.month)}
                className={`w-full text-left rounded-xl p-4 transition-all ${
                  isSelected ? 'bg-[#9B7D2E]/5 ring-1 ring-[#9B7D2E]/20' : 'bg-[#f9f9fb] hover:bg-[#f2f2f7]'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#1d1d1f] w-24">{r.labelFull}</span>
                    {r.diff !== null && <Change value={r.diff} />}
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#aeaeb2] transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-[#aeaeb2] w-8 text-right shrink-0">{prevYear}</span>
                  <div className="flex-1 h-2.5 bg-[#e8e8ed] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#9B7D2E]/30 transition-all duration-500"
                      style={{ width: `${(r.prevTotal / maxMonthVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-medium text-[#48484a] w-20 text-right shrink-0">
                    {r.hasPrev ? $$(r.prevTotal) : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold text-[#48484a] w-8 text-right shrink-0">{selectedYear}</span>
                  <div className="flex-1 h-2.5 bg-[#e8e8ed] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#9B7D2E] transition-all duration-500"
                      style={{ width: `${(r.curTotal / maxMonthVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-bold text-[#1d1d1f] w-20 text-right shrink-0">
                    {r.hasCur ? $$(r.curTotal) : '—'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Year totals footer */}
        <div className="mt-4 pt-4 border-t border-[#f0f0f5]">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-[#1d1d1f]">Total</span>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[11px] text-[#aeaeb2] font-semibold">{prevYear}</p>
                <p className="text-[16px] font-bold text-[#48484a]">{$$(prevYearTotal)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#48484a] font-semibold">{selectedYear}</p>
                <p className="text-[16px] font-bold text-[#9B7D2E]">{$$(yearTotal)}</p>
              </div>
              <div className="w-px h-8 bg-[#e5e5ea]" />
              <Change value={pct(yearTotal, prevYearTotal)} size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Material Mix for the year */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Mix de Materiales — {selectedYear}</h3>
        <div className="space-y-5">
          {MATERIALS.map(mat => {
            const curTotal = yearData.reduce((a, r) => a + (r[mat.key] || 0), 0)
            const prevTotal = prevYearData.reduce((a, r) => a + (r[mat.key] || 0), 0)
            const grand = yearData.reduce((a, r) => a + r.total, 0) || 1
            const porcentaje = ((curTotal / grand) * 100).toFixed(1)
            return (
              <div key={mat.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mat.color }} />
                    <span className="text-[14px] font-semibold text-[#1d1d1f]">{mat.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] text-[#48484a]">{$$(curTotal)}</span>
                    <span className="text-[14px] font-bold text-[#1d1d1f]">{porcentaje}%</span>
                    <Change value={pct(curTotal, prevTotal)} />
                  </div>
                </div>
                <div className="w-full h-2.5 bg-[#f2f2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${porcentaje}%`, backgroundColor: mat.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
