// ─── Transform QB Customers + Invoices + SalesReceipts → clientesVentas shape ───

export function transformCustomers(qbCustomers, qbInvoices, qbSalesReceipts, itemMappings) {
  return qbCustomers.map(customer => {
    const tipo = extractCustomerType(customer)
    const terminos = extractPaymentTermsDays(customer)

    // Get all transactions for this customer
    const customerInvoices = qbInvoices.filter(
      inv => inv.CustomerRef?.value === String(customer.Id)
    )
    const customerReceipts = qbSalesReceipts.filter(
      rcpt => rcpt.CustomerRef?.value === String(customer.Id)
    )

    const compras = [
      ...customerInvoices.map(inv => transformInvoiceToCompra(inv, itemMappings, tipo)),
      ...customerReceipts.map(rcpt => transformReceiptToCompra(rcpt, itemMappings, tipo)),
    ].sort((a, b) => b.fecha.localeCompare(a.fecha))

    return {
      id: `CLI-${customer.Id}`,
      nombre: customer.DisplayName || '',
      tipo,
      terminos,
      telefono: customer.PrimaryPhone?.FreeFormNumber || '',
      email: customer.PrimaryEmailAddr?.Address || '',
      compras,
    }
  })
}

// ─── Transform a single QB Invoice → compra + factura ───
function transformInvoiceToCompra(invoice, itemMappings, clienteTipo) {
  const desglose = computeDesglose(invoice.Line || [], itemMappings)
  const totalGramos = computeTotalGramos(invoice.Line || [], itemMappings)
  const canal = clienteTipo === 'mayorista' ? 'Al Mayor'
    : clienteTipo === 'shopify' ? 'Shopify' : 'Al Detal'

  const balance = invoice.Balance || 0
  const total = invoice.TotalAmt || 0
  const paid = total - balance

  let estado = 'pendiente'
  if (balance === 0 && total > 0) estado = 'pagada'
  else if (paid > 0 && balance > 0) estado = 'parcial'
  else if (balance > 0 && invoice.DueDate && new Date(invoice.DueDate) < new Date()) estado = 'vencida'

  const condicion = extractPaymentTermsDays(invoice)

  return {
    id: `CMP-${invoice.Id}`,
    fecha: invoice.TxnDate || '',
    canal,
    monto: total,
    pesoOroGramos: totalGramos,
    vendedor: extractVendedor(invoice),
    desglose,
    factura: {
      id: `FAC-${invoice.Id}`,
      fechaEmision: invoice.TxnDate || '',
      fechaVencimiento: invoice.DueDate || '',
      condicion,
      monto: total,
      montoPagado: paid,
      fechaPago: estado === 'pagada' ? (invoice.TxnDate || null) : null,
      estado,
      diasParaPago: estado === 'pagada' ? computeDiasParaPago(invoice) : null,
    },
  }
}

// ─── Transform a SalesReceipt → compra (paid immediately) ───
function transformReceiptToCompra(receipt, itemMappings, clienteTipo) {
  const desglose = computeDesglose(receipt.Line || [], itemMappings)
  const totalGramos = computeTotalGramos(receipt.Line || [], itemMappings)
  const total = receipt.TotalAmt || 0
  const canal = clienteTipo === 'shopify' ? 'Shopify' : 'Al Detal'

  return {
    id: `CMP-${receipt.Id}`,
    fecha: receipt.TxnDate || '',
    canal,
    monto: total,
    pesoOroGramos: totalGramos,
    vendedor: extractVendedor(receipt),
    desglose,
    factura: {
      id: `FAC-${receipt.Id}`,
      fechaEmision: receipt.TxnDate || '',
      fechaVencimiento: receipt.TxnDate || '',
      condicion: 0,
      monto: total,
      montoPagado: total,
      fechaPago: receipt.TxnDate || null,
      estado: 'pagada',
      diasParaPago: 0,
    },
  }
}

// ─── Compute material breakdown from line items ───
function computeDesglose(lines, itemMappings) {
  const result = {
    oro10k: { gramos: 0, monto: 0 },
    oro14k: { gramos: 0, monto: 0 },
    brillanteria: { piezas: 0, monto: 0 },
  }

  for (const line of lines) {
    if (line.DetailType !== 'SalesItemLineDetail') continue
    const itemId = line.SalesItemLineDetail?.ItemRef?.value
    const category = itemMappings[itemId] || guessCategory(line)
    const amount = line.Amount || 0
    const qty = line.SalesItemLineDetail?.Qty || 0

    if (category === 'oro10k') {
      result.oro10k.monto += amount
      result.oro10k.gramos += qty
    } else if (category === 'oro14k') {
      result.oro14k.monto += amount
      result.oro14k.gramos += qty
    } else if (category === 'brillanteria') {
      result.brillanteria.monto += amount
      result.brillanteria.piezas += Math.round(qty)
    }
    // 'otro' category is ignored in desglose
  }

  return result
}

// ─── Compute total grams from line items ───
function computeTotalGramos(lines, itemMappings) {
  let total = 0
  for (const line of lines) {
    if (line.DetailType !== 'SalesItemLineDetail') continue
    const itemId = line.SalesItemLineDetail?.ItemRef?.value
    const category = itemMappings[itemId] || guessCategory(line)
    if (category === 'oro10k' || category === 'oro14k') {
      total += line.SalesItemLineDetail?.Qty || 0
    }
  }
  return Math.round(total * 10) / 10
}

// ─── Guess material category from item name ───
function guessCategory(line) {
  const name = (line.SalesItemLineDetail?.ItemRef?.name || '').toLowerCase()
  const desc = (line.Description || '').toLowerCase()
  const text = `${name} ${desc}`

  if (text.includes('10k') || text.includes('10 k')) return 'oro10k'
  if (text.includes('14k') || text.includes('14 k')) return 'oro14k'
  if (text.includes('brillant') || text.includes('diamond') || text.includes('diamante')) return 'brillanteria'
  if (text.includes('oro') || text.includes('gold')) return 'oro14k' // default gold to 14k
  return 'otro'
}

// ─── Extract customer type from Notes or custom field ───
function extractCustomerType(customer) {
  const notes = (customer.Notes || '').toLowerCase()
  if (notes.includes('mayorista') || notes.includes('wholesale')) return 'mayorista'
  if (notes.includes('shopify') || notes.includes('online')) return 'shopify'
  if (notes.includes('detal') || notes.includes('retail')) return 'detal'
  // Default based on payment terms
  if (customer.SalesTermRef) return 'mayorista'
  return 'detal'
}

// ─── Extract payment terms in days ───
function extractPaymentTermsDays(entity) {
  // QB SalesTermRef maps to standard terms like "Net 30", "Net 60", "Due on receipt"
  const termName = entity.SalesTermRef?.name || ''
  const match = termName.match(/(\d+)/)
  if (match) return parseInt(match[1], 10)
  if (termName.toLowerCase().includes('receipt') || termName.toLowerCase().includes('due')) return 0
  return 0
}

// ─── Extract vendedor from custom field or Class ───
function extractVendedor(transaction) {
  // Try CustomField first
  if (transaction.CustomField) {
    for (const field of transaction.CustomField) {
      const name = (field.Name || '').toLowerCase()
      if (name.includes('vendedor') || name.includes('sales') || name.includes('rep')) {
        return field.StringValue || 'Tienda'
      }
    }
  }
  // Try ClassRef
  if (transaction.ClassRef?.name) return transaction.ClassRef.name
  return 'Tienda'
}

// ─── Compute days to payment ───
function computeDiasParaPago(invoice) {
  if (!invoice.TxnDate) return null
  const created = new Date(invoice.TxnDate)
  const now = new Date()
  return Math.max(0, Math.round((now - created) / (1000 * 60 * 60 * 24)))
}

// ─── Transform QB Vendors + Bills → proveedores shape ───
export function transformVendors(qbVendors, qbBills, qbBillPayments) {
  return qbVendors.map(vendor => {
    const vendorBills = qbBills.filter(
      b => b.VendorRef?.value === String(vendor.Id)
    )
    const vendorPayments = qbBillPayments.filter(
      p => p.VendorRef?.value === String(vendor.Id)
    )

    const deuda = vendorBills.reduce((sum, b) => sum + (b.Balance || 0), 0)
    const nextDue = vendorBills
      .filter(b => b.Balance > 0)
      .sort((a, b) => (a.DueDate || '').localeCompare(b.DueDate || ''))[0]

    const lastPayment = vendorPayments
      .sort((a, b) => (b.TxnDate || '').localeCompare(a.TxnDate || ''))[0]

    let estado = 'al_dia'
    if (nextDue?.DueDate) {
      const dueDate = new Date(nextDue.DueDate)
      const now = new Date()
      const daysUntilDue = Math.round((dueDate - now) / (1000 * 60 * 60 * 24))
      if (daysUntilDue < 0) estado = 'vencido'
      else if (daysUntilDue <= 7) estado = 'proximo'
    }

    // Guess material from vendor name or notes
    const material = guessVendorMaterial(vendor)

    return {
      nombre: vendor.DisplayName || '',
      material,
      contacto: vendor.GivenName ? `${vendor.GivenName} ${vendor.FamilyName || ''}`.trim() : vendor.DisplayName || '',
      telefono: vendor.PrimaryPhone?.FreeFormNumber || '',
      deuda,
      vencimiento: nextDue?.DueDate || null,
      ultimoPago: lastPayment?.TxnDate || null,
      estado,
    }
  })
}

function guessVendorMaterial(vendor) {
  const text = `${vendor.DisplayName || ''} ${vendor.Notes || ''}`.toLowerCase()
  if (text.includes('10k')) return 'Oro 10K'
  if (text.includes('14k')) return 'Oro 14K'
  if (text.includes('brillant') || text.includes('diamond')) return 'Brillanteria'
  if (text.includes('oro') || text.includes('gold')) return 'Oro 14K'
  return 'Mixto'
}

// ─── Compute aggregated KPIs and chart data from clientesVentas ───
export function computeAggregates(clientesVentas) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Flatten all compras
  const allCompras = clientesVentas.flatMap(c => c.compras || [])

  // Current month sales
  const currentMonthCompras = allCompras.filter(c => {
    const d = new Date(c.fecha)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const ventasMes = currentMonthCompras.reduce((s, c) => s + c.monto, 0)
  const ventasMayor = currentMonthCompras
    .filter(c => c.canal === 'Al Mayor')
    .reduce((s, c) => s + c.monto, 0)

  // KPIs
  const kpis = {
    ventasMes,
    ventasMayor,
    deudaProveedores: 0, // Set from vendors data
    precioOro: 0, // Set from gold price API
  }

  // Ventas por material
  const materialTotals = { oro10k: 0, oro14k: 0, brillanteria: 0 }
  for (const c of currentMonthCompras) {
    materialTotals.oro10k += c.desglose?.oro10k?.monto || 0
    materialTotals.oro14k += c.desglose?.oro14k?.monto || 0
    materialTotals.brillanteria += c.desglose?.brillanteria?.monto || 0
  }

  const ventasPorMaterial = [
    { material: 'Oro 10K', color: '#D4A853', total: materialTotals.oro10k, cambio: 0, sparkline: [] },
    { material: 'Oro 14K', color: '#E8D5A3', total: materialTotals.oro14k, cambio: 0, sparkline: [] },
    { material: 'Brillanteria', color: '#A8C4E0', total: materialTotals.brillanteria, cambio: 0, sparkline: [] },
  ]

  // Ventas por canal
  const canalTotals = { mayor: 0, detal: 0, shopify: 0 }
  for (const c of currentMonthCompras) {
    if (c.canal === 'Al Mayor') canalTotals.mayor += c.monto
    else if (c.canal === 'Al Detal') canalTotals.detal += c.monto
    else if (c.canal === 'Shopify') canalTotals.shopify += c.monto
  }

  const ventasPorCanalDetalle = [
    { canal: 'Al Mayor', total: canalTotals.mayor, cambio: 0, color: '#C9A84C', sparkline: [] },
    { canal: 'Al Detal', total: canalTotals.detal, cambio: 0, color: '#8B7EC8', sparkline: [] },
    { canal: 'Shopify', total: canalTotals.shopify, cambio: 0, color: '#4CABAB', sparkline: [] },
  ]

  // Monthly data (last 6 months)
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1)
    const monthCompras = allCompras.filter(c => {
      const cd = new Date(c.fecha)
      return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear()
    })

    const mesNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    let oro10k = 0, oro14k = 0, brillanteria = 0, mayor = 0, detal = 0, shopify = 0
    for (const c of monthCompras) {
      oro10k += c.desglose?.oro10k?.monto || 0
      oro14k += c.desglose?.oro14k?.monto || 0
      brillanteria += c.desglose?.brillanteria?.monto || 0
      if (c.canal === 'Al Mayor') mayor += c.monto
      else if (c.canal === 'Al Detal') detal += c.monto
      else if (c.canal === 'Shopify') shopify += c.monto
    }

    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      mes: mesNames[d.getMonth()],
      oro10k, oro14k, brillanteria,
      total: oro10k + oro14k + brillanteria,
      mayor, detal, shopify,
    })
  }

  const ventasPorCanal6Meses = months.map(m => ({
    mes: m.mes, mayor: m.mayor, detal: m.detal, shopify: m.shopify,
  }))

  const ventasPorMaterial6Meses = months.map(m => ({
    mes: m.mes, oro10k: m.oro10k, oro14k: m.oro14k, brillanteria: m.brillanteria,
  }))

  const datosMensuales = months.map(m => ({
    year: m.year, month: m.month, mes: m.mes,
    oro10k: m.oro10k, oro14k: m.oro14k, brillanteria: m.brillanteria, total: m.total,
  }))

  // Daily sales for current month
  const ventasDiarias = []
  const dailyMap = {}
  for (const c of allCompras) {
    if (!dailyMap[c.fecha]) {
      dailyMap[c.fecha] = { fecha: c.fecha, oro10k: 0, oro14k: 0, brillanteria: 0, total: 0 }
    }
    dailyMap[c.fecha].oro10k += c.desglose?.oro10k?.monto || 0
    dailyMap[c.fecha].oro14k += c.desglose?.oro14k?.monto || 0
    dailyMap[c.fecha].brillanteria += c.desglose?.brillanteria?.monto || 0
    dailyMap[c.fecha].total += c.monto
  }
  ventasDiarias.push(...Object.values(dailyMap).sort((a, b) => a.fecha.localeCompare(b.fecha)))

  // Ultimas ordenes (last 8)
  const ultimasOrdenes = allCompras.slice(0, 8).map(c => {
    const cliente = clientesVentas.find(cl => cl.compras.some(cp => cp.id === c.id))
    return {
      id: c.id.replace('CMP', 'ORD'),
      cliente: cliente?.nombre || '',
      canal: c.canal,
      material: getMaterialPrincipal(c.desglose),
      monto: c.monto,
      fecha: c.fecha,
      estado: c.factura?.estado || 'pendiente',
    }
  })

  // Ventas para comisiones
  const ventasComisiones = allCompras.slice(0, 16).map(c => {
    const cliente = clientesVentas.find(cl => cl.compras.some(cp => cp.id === c.id))
    return {
      id: c.id,
      cliente: cliente?.nombre || '',
      canal: c.canal,
      material: getMaterialPrincipal(c.desglose),
      monto: c.monto,
      fecha: c.fecha,
    }
  })

  // Distribution and breakdown
  const totalMaterial = materialTotals.oro10k + materialTotals.oro14k + materialTotals.brillanteria
  const distribucionMesMaterial = [
    { name: 'Oro 10K', value: materialTotals.oro10k, color: '#D4A853' },
    { name: 'Oro 14K', value: materialTotals.oro14k, color: '#E8D5A3' },
    { name: 'Brillanteria', value: materialTotals.brillanteria, color: '#A8C4E0' },
  ]

  const mixMateriales = [
    { material: 'Oro 10K', porcentaje: totalMaterial > 0 ? Math.round(materialTotals.oro10k / totalMaterial * 100) : 0, color: '#D4A853' },
    { material: 'Oro 14K', porcentaje: totalMaterial > 0 ? Math.round(materialTotals.oro14k / totalMaterial * 100) : 0, color: '#E8D5A3' },
    { material: 'Brillanteria', porcentaje: totalMaterial > 0 ? Math.round(materialTotals.brillanteria / totalMaterial * 100) : 0, color: '#A8C4E0' },
  ]

  // Report KPIs
  const monthlyTotals = months.map(m => m.total)
  const reporteKPIs = {
    promedioMensual: monthlyTotals.length > 0 ? Math.round(monthlyTotals.reduce((s, v) => s + v, 0) / monthlyTotals.length) : 0,
    mejorMes: Math.max(...monthlyTotals, 0),
    peorMes: Math.min(...monthlyTotals.filter(v => v > 0), 0),
    totalAcumulado: monthlyTotals.reduce((s, v) => s + v, 0),
  }

  return {
    kpis,
    ventasPorMaterial,
    ventasPorCanalDetalle,
    ventasPorCanal6Meses,
    ventasPorMaterial6Meses,
    datosMensuales,
    ventasDiarias,
    ultimasOrdenes,
    ventasComisiones,
    distribucionMesMaterial,
    mixMateriales,
    reporteKPIs,
  }
}

function getMaterialPrincipal(desglose) {
  if (!desglose) return 'Oro 14K'
  const { oro10k, oro14k, brillanteria } = desglose
  const max = Math.max(oro10k?.monto || 0, oro14k?.monto || 0, brillanteria?.monto || 0)
  if (max === (oro10k?.monto || 0)) return 'Oro 10K'
  if (max === (oro14k?.monto || 0)) return 'Oro 14K'
  return 'Brillanteria'
}

// ─── Compute proveedores KPIs ───
export function computeProveedoresKPIs(proveedores) {
  const deudaTotal = proveedores.reduce((s, p) => s + p.deuda, 0)
  const proveedoresActivos = proveedores.filter(p => p.deuda > 0).length
  const pagosVencidos = proveedores.filter(p => p.estado === 'vencido').length

  const deudaPorMaterial = []
  const materialDeuda = {}
  const materialColors = { 'Oro 10K': '#D4A853', 'Oro 14K': '#E8D5A3', 'Brillanteria': '#A8C4E0', 'Mixto': '#999' }

  for (const p of proveedores) {
    if (!materialDeuda[p.material]) materialDeuda[p.material] = 0
    materialDeuda[p.material] += p.deuda
  }
  for (const [material, deuda] of Object.entries(materialDeuda)) {
    deudaPorMaterial.push({ material, deuda, color: materialColors[material] || '#999' })
  }

  return {
    proveedoresKPIs: { deudaTotal, proveedoresActivos, pagosVencidos },
    deudaPorMaterial,
  }
}
