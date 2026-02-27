// ─── KPIs Dashboard General ───
export const kpis = {
  ventasMes: 487650,
  ventasMayor: 312400,
  deudaProveedores: 89200,
  precioOro: 2342.50,
}

// ─── Ventas por Material (con sparkline data) ───
export const ventasPorMaterial = [
  {
    material: 'Oro 10K',
    color: '#D4A853',
    total: 198500,
    cambio: 12.4,
    sparkline: [32, 40, 35, 50, 49, 60, 55, 65, 70, 68, 75, 80],
  },
  {
    material: 'Oro 14K',
    color: '#E8D5A3',
    total: 215300,
    cambio: 8.7,
    sparkline: [28, 35, 42, 38, 45, 50, 48, 55, 58, 62, 60, 67],
  },
  {
    material: 'Brillantería',
    color: '#A8C4E0',
    total: 73850,
    cambio: -3.2,
    sparkline: [20, 25, 22, 30, 28, 24, 26, 22, 20, 18, 22, 19],
  },
]

// ─── Ventas por Canal últimos 6 meses ───
export const ventasPorCanal6Meses = [
  { mes: 'Sep', mayor: 48000, detal: 22000, shopify: 15000 },
  { mes: 'Oct', mayor: 52000, detal: 25000, shopify: 18000 },
  { mes: 'Nov', mayor: 61000, detal: 30000, shopify: 22000 },
  { mes: 'Dic', mayor: 75000, detal: 38000, shopify: 28000 },
  { mes: 'Ene', mayor: 55000, detal: 27000, shopify: 20000 },
  { mes: 'Feb', mayor: 62000, detal: 31000, shopify: 24000 },
]

// ─── Precio del Oro Widget ───
export const precioOroWidget = {
  xauUsd: 2342.50,
  cambio24h: 1.2,
  porGramo24K: 75.31,
  porGramo14K: 44.14,
  porGramo10K: 31.38,
  porOzTroy: 2342.50,
}

// ─── Últimas Órdenes ───
export const ultimasOrdenes = [
  { id: 'ORD-001', cliente: 'María González', canal: 'Al Mayor', material: 'Oro 14K', monto: 12500, fecha: '2026-02-22', estado: 'completada' },
  { id: 'ORD-002', cliente: 'Carlos Rodríguez', canal: 'Shopify', material: 'Brillantería', monto: 3200, fecha: '2026-02-22', estado: 'enviada' },
  { id: 'ORD-003', cliente: 'Ana Martínez', canal: 'Al Detal', material: 'Oro 10K', monto: 1850, fecha: '2026-02-21', estado: 'pendiente' },
  { id: 'ORD-004', cliente: 'Roberto Díaz', canal: 'Al Mayor', material: 'Oro 14K', monto: 28700, fecha: '2026-02-21', estado: 'completada' },
  { id: 'ORD-005', cliente: 'Laura Sánchez', canal: 'Shopify', material: 'Oro 10K', monto: 2100, fecha: '2026-02-20', estado: 'enviada' },
  { id: 'ORD-006', cliente: 'Pedro Fernández', canal: 'Al Mayor', material: 'Brillantería', monto: 15800, fecha: '2026-02-20', estado: 'completada' },
  { id: 'ORD-007', cliente: 'Isabel Torres', canal: 'Al Detal', material: 'Oro 14K', monto: 4300, fecha: '2026-02-19', estado: 'pendiente' },
  { id: 'ORD-008', cliente: 'Miguel López', canal: 'Shopify', material: 'Oro 10K', monto: 1750, fecha: '2026-02-19', estado: 'completada' },
]

// ─── Ventas por Canal (con sparkline) ───
export const ventasPorCanalDetalle = [
  {
    canal: 'Al Mayor',
    total: 312400,
    cambio: 15.3,
    color: '#C9A84C',
    sparkline: [40, 48, 52, 61, 55, 62],
  },
  {
    canal: 'Al Detal',
    total: 112500,
    cambio: 6.8,
    color: '#8B7EC8',
    sparkline: [22, 25, 30, 38, 27, 31],
  },
  {
    canal: 'Shopify',
    total: 62750,
    cambio: 22.1,
    color: '#5EBD73',
    sparkline: [15, 18, 22, 28, 20, 24],
  },
]

// ─── Ventas por Material últimos 6 meses (para barras) ───
export const ventasPorMaterial6Meses = [
  { mes: 'Sep', oro10k: 30000, oro14k: 35000, brillanteria: 12000 },
  { mes: 'Oct', oro10k: 33000, oro14k: 38000, brillanteria: 14000 },
  { mes: 'Nov', oro10k: 40000, oro14k: 45000, brillanteria: 16000 },
  { mes: 'Dic', oro10k: 50000, oro14k: 55000, brillanteria: 20000 },
  { mes: 'Ene', oro10k: 35000, oro14k: 40000, brillanteria: 13000 },
  { mes: 'Feb', oro10k: 42000, oro14k: 48000, brillanteria: 15000 },
]

// ─── Distribución del Mes (Donut) ───
export const distribucionMesMaterial = [
  { name: 'Oro 10K', value: 198500, color: '#D4A853' },
  { name: 'Oro 14K', value: 215300, color: '#E8D5A3' },
  { name: 'Brillantería', value: 73850, color: '#A8C4E0' },
]

// ─── Desglose Mensual (legacy) ───
export const desgloseMensual = [
  { mes: 'Septiembre', oro10k: 30000, oro14k: 35000, brillanteria: 12000, total: 77000 },
  { mes: 'Octubre', oro10k: 33000, oro14k: 38000, brillanteria: 14000, total: 85000 },
  { mes: 'Noviembre', oro10k: 40000, oro14k: 45000, brillanteria: 16000, total: 101000 },
  { mes: 'Diciembre', oro10k: 50000, oro14k: 55000, brillanteria: 20000, total: 125000 },
  { mes: 'Enero', oro10k: 35000, oro14k: 40000, brillanteria: 13000, total: 88000 },
  { mes: 'Febrero', oro10k: 42000, oro14k: 48000, brillanteria: 15000, total: 105000 },
]

// ─── Datos Mensuales con Año (para comparaciones) ───
export const datosMensuales = [
  // 2025
  { year: 2025, month: 1,  mes: 'Enero',      oro10k: 22000, oro14k: 26000, brillanteria: 8000,  total: 56000 },
  { year: 2025, month: 2,  mes: 'Febrero',     oro10k: 24000, oro14k: 28000, brillanteria: 9000,  total: 61000 },
  { year: 2025, month: 3,  mes: 'Marzo',       oro10k: 26000, oro14k: 30000, brillanteria: 10000, total: 66000 },
  { year: 2025, month: 4,  mes: 'Abril',       oro10k: 25000, oro14k: 29000, brillanteria: 9500,  total: 63500 },
  { year: 2025, month: 5,  mes: 'Mayo',        oro10k: 28000, oro14k: 32000, brillanteria: 11000, total: 71000 },
  { year: 2025, month: 6,  mes: 'Junio',       oro10k: 27000, oro14k: 31000, brillanteria: 10500, total: 68500 },
  { year: 2025, month: 7,  mes: 'Julio',       oro10k: 24000, oro14k: 27000, brillanteria: 9000,  total: 60000 },
  { year: 2025, month: 8,  mes: 'Agosto',      oro10k: 26000, oro14k: 30000, brillanteria: 10000, total: 66000 },
  { year: 2025, month: 9,  mes: 'Septiembre',  oro10k: 30000, oro14k: 35000, brillanteria: 12000, total: 77000 },
  { year: 2025, month: 10, mes: 'Octubre',     oro10k: 33000, oro14k: 38000, brillanteria: 14000, total: 85000 },
  { year: 2025, month: 11, mes: 'Noviembre',   oro10k: 40000, oro14k: 45000, brillanteria: 16000, total: 101000 },
  { year: 2025, month: 12, mes: 'Diciembre',   oro10k: 50000, oro14k: 55000, brillanteria: 20000, total: 125000 },
  // 2026
  { year: 2026, month: 1,  mes: 'Enero',       oro10k: 35000, oro14k: 40000, brillanteria: 13000, total: 88000 },
  { year: 2026, month: 2,  mes: 'Febrero',     oro10k: 42000, oro14k: 48000, brillanteria: 15000, total: 105000 },
]

// ─── Proveedores ───
export const proveedoresKPIs = {
  deudaTotal: 89200,
  proveedoresActivos: 8,
  pagosVencidos: 2,
}

export const deudaPorMaterial = [
  { material: 'Oro 10K', deuda: 35000, color: '#D4A853' },
  { material: 'Oro 14K', deuda: 42000, color: '#E8D5A3' },
  { material: 'Brillantería', deuda: 12200, color: '#A8C4E0' },
]

export const proveedores = [
  { nombre: 'Gold Supply Corp', material: 'Oro 10K', contacto: 'Juan Pérez', telefono: '+58 412-555-0101', deuda: 18000, vencimiento: '2026-03-05', ultimoPago: '2026-02-10', estado: 'al_dia' },
  { nombre: 'Premium Gold LLC', material: 'Oro 14K', contacto: 'Ana García', telefono: '+58 414-555-0202', deuda: 25000, vencimiento: '2026-02-28', ultimoPago: '2026-02-01', estado: 'proximo' },
  { nombre: 'DiamondSource Int.', material: 'Brillantería', contacto: 'Carlos Mendoza', telefono: '+58 416-555-0303', deuda: 12200, vencimiento: '2026-02-15', ultimoPago: '2026-01-20', estado: 'vencido' },
  { nombre: 'Refinery Direct', material: 'Oro 10K', contacto: 'Pedro Rojas', telefono: '+58 412-555-0404', deuda: 17000, vencimiento: '2026-03-10', ultimoPago: '2026-02-15', estado: 'al_dia' },
  { nombre: 'Karat Masters', material: 'Oro 14K', contacto: 'María Torres', telefono: '+58 414-555-0505', deuda: 17000, vencimiento: '2026-02-20', ultimoPago: '2026-01-25', estado: 'vencido' },
  { nombre: 'BrightStone Co.', material: 'Brillantería', contacto: 'Luis Vargas', telefono: '+58 416-555-0606', deuda: 0, vencimiento: '-', ultimoPago: '2026-02-18', estado: 'al_dia' },
  { nombre: 'Pure Metals SA', material: 'Oro 10K', contacto: 'Rosa Hernández', telefono: '+58 412-555-0707', deuda: 0, vencimiento: '-', ultimoPago: '2026-02-20', estado: 'al_dia' },
  { nombre: 'GemWorld Trading', material: 'Brillantería', contacto: 'Diego Mora', telefono: '+58 424-555-0808', deuda: 0, vencimiento: '-', ultimoPago: '2026-02-12', estado: 'al_dia' },
]

// ─── Gastos Operativos ───
export const categoriasGastos = [
  'Alquiler',
  'Internet / Telecomunicaciones',
  'Marketing / Publicidad',
  'Seguros',
  'Servicios Profesionales',
  'Software / Tecnologia',
  'Envio / Logistica',
  'Mantenimiento',
  'Suministros de Oficina',
  'Servicios Publicos',
  'Limpieza',
  'Otros',
]

export const proveedoresGastos = [
  { id: 'G1', nombre: 'Comcast Business', categoria: 'Internet / Telecomunicaciones', monto: 450, frecuencia: 'mensual' },
  { id: 'G2', nombre: 'Brilliance Marketing Group', categoria: 'Marketing / Publicidad', monto: 2500, frecuencia: 'mensual' },
  { id: 'G3', nombre: 'State Farm Insurance', categoria: 'Seguros', monto: 18000, frecuencia: 'anual' },
  { id: 'G4', nombre: 'Brickell Office Leasing', categoria: 'Alquiler', monto: 6800, frecuencia: 'mensual' },
  { id: 'G5', nombre: 'Garcia & Asociados CPA', categoria: 'Servicios Profesionales', monto: 1200, frecuencia: 'mensual' },
  { id: 'G6', nombre: 'FedEx Shipping', categoria: 'Envio / Logistica', monto: 800, frecuencia: 'mensual' },
  { id: 'G7', nombre: 'QuickBooks Online', categoria: 'Software / Tecnologia', monto: 85, frecuencia: 'mensual' },
  { id: 'G8', nombre: 'Office Depot', categoria: 'Suministros de Oficina', monto: 350, frecuencia: 'mensual' },
]

export const gastosKPIs = {
  gastoTotalMensual: 13685,
  cantidadGastos: 8,
  categoriaMayorGasto: 'Alquiler',
}

// ─── Oro: Historial 10 días ───
export const historialOro10Dias = [
  { fecha: '14 Feb', xauUsd: 2310.20, gramo10k: 30.90, gramo14k: 43.45 },
  { fecha: '15 Feb', xauUsd: 2318.50, gramo10k: 31.01, gramo14k: 43.60 },
  { fecha: '16 Feb', xauUsd: 2325.80, gramo10k: 31.11, gramo14k: 43.74 },
  { fecha: '17 Feb', xauUsd: 2320.00, gramo10k: 31.03, gramo14k: 43.63 },
  { fecha: '18 Feb', xauUsd: 2335.60, gramo10k: 31.24, gramo14k: 43.92 },
  { fecha: '19 Feb', xauUsd: 2328.40, gramo10k: 31.14, gramo14k: 43.79 },
  { fecha: '20 Feb', xauUsd: 2340.10, gramo10k: 31.30, gramo14k: 44.01 },
  { fecha: '21 Feb', xauUsd: 2338.00, gramo10k: 31.27, gramo14k: 43.97 },
  { fecha: '22 Feb', xauUsd: 2345.20, gramo10k: 31.37, gramo14k: 44.10 },
  { fecha: '23 Feb', xauUsd: 2342.50, gramo10k: 31.38, gramo14k: 44.14 },
]

// ─── Reportes ───
export const reporteKPIs = {
  promedioMensual: 96833,
  mejorMes: { mes: 'Diciembre', total: 125000 },
  peorMes: { mes: 'Septiembre', total: 77000 },
  totalAcumulado: 581000,
}

export const mixMateriales = [
  { material: 'Oro 10K', porcentaje: 39.6, color: '#D4A853' },
  { material: 'Oro 14K', porcentaje: 44.9, color: '#E8D5A3' },
  { material: 'Brillantería', porcentaje: 15.5, color: '#A8C4E0' },
]

export const reporteMensual = {
  mes: 'Febrero 2026',
  resumen: 'Las ventas de febrero alcanzaron $105,000, un 19.3% por encima del promedio de $96,833. El canal Al Mayor representó el 59% de las ventas totales. Oro 14K sigue siendo el material líder con 45.7% del volumen. Se recomienda aumentar el inventario de Oro 14K para marzo y evaluar estrategias de crecimiento en el canal Shopify que mostró un crecimiento del 22.1%.',
  ventasTotales: 105000,
  variacion: 19.3,
  canalLider: 'Al Mayor',
  materialLider: 'Oro 14K',
}

// ─── Comisiones: Vendedores ───
export const vendedoresEquipo = [
  { id: 'V1', nombre: 'Alejandro Ruiz', color: '#5B8DB8', comision: 0.75 },
  { id: 'V2', nombre: 'Valentina Mora', color: '#B8942E', comision: 0.75 },
  { id: 'V3', nombre: 'Diego Paredes', color: '#7B6DAF', comision: 0.75 },
]

export const clienteVendedorDefault = {
  'María González': 'V1',
  'Carlos Rodríguez': 'V2',
  'Ana Martínez': 'V3',
  'Roberto Díaz': 'V1',
  'Laura Sánchez': 'V2',
  'Pedro Fernández': 'V3',
  'Isabel Torres': 'V1',
  'Miguel López': 'V2',
  'Sofía Herrera': 'V3',
  'Andrés Castillo': 'V1',
  'Carmen Vega': 'V2',
  'Javier Ramos': 'V3',
}

export const ventasComisiones = [
  { id: 'VC-001', cliente: 'María González', canal: 'Al Mayor', material: 'Oro 14K', monto: 12500, fecha: '2026-02-22' },
  { id: 'VC-002', cliente: 'Carlos Rodríguez', canal: 'Shopify', material: 'Brillantería', monto: 3200, fecha: '2026-02-22' },
  { id: 'VC-003', cliente: 'Ana Martínez', canal: 'Al Detal', material: 'Oro 10K', monto: 1850, fecha: '2026-02-21' },
  { id: 'VC-004', cliente: 'Roberto Díaz', canal: 'Al Mayor', material: 'Oro 14K', monto: 28700, fecha: '2026-02-21' },
  { id: 'VC-005', cliente: 'Laura Sánchez', canal: 'Shopify', material: 'Oro 10K', monto: 2100, fecha: '2026-02-20' },
  { id: 'VC-006', cliente: 'Pedro Fernández', canal: 'Al Mayor', material: 'Brillantería', monto: 15800, fecha: '2026-02-20' },
  { id: 'VC-007', cliente: 'Isabel Torres', canal: 'Al Detal', material: 'Oro 14K', monto: 4300, fecha: '2026-02-19' },
  { id: 'VC-008', cliente: 'Miguel López', canal: 'Shopify', material: 'Oro 10K', monto: 1750, fecha: '2026-02-19' },
  { id: 'VC-009', cliente: 'Sofía Herrera', canal: 'Al Mayor', material: 'Oro 14K', monto: 18900, fecha: '2026-02-18' },
  { id: 'VC-010', cliente: 'Andrés Castillo', canal: 'Al Detal', material: 'Oro 10K', monto: 3400, fecha: '2026-02-17' },
  { id: 'VC-011', cliente: 'Carmen Vega', canal: 'Al Mayor', material: 'Brillantería', monto: 9200, fecha: '2026-02-16' },
  { id: 'VC-012', cliente: 'Javier Ramos', canal: 'Shopify', material: 'Oro 14K', monto: 5600, fecha: '2026-02-15' },
  { id: 'VC-013', cliente: 'María González', canal: 'Al Mayor', material: 'Oro 10K', monto: 8500, fecha: '2026-02-14' },
  { id: 'VC-014', cliente: 'Roberto Díaz', canal: 'Al Mayor', material: 'Oro 14K', monto: 22300, fecha: '2026-02-13' },
  { id: 'VC-015', cliente: 'Laura Sánchez', canal: 'Shopify', material: 'Brillantería', monto: 4800, fecha: '2026-02-12' },
  { id: 'VC-016', cliente: 'Pedro Fernández', canal: 'Al Mayor', material: 'Oro 10K', monto: 11200, fecha: '2026-02-11' },
]


// ─── Clientes con Compras y Facturas ───
export const clientesVentas = [
  {
    id: 'CLI-001',
    nombre: 'Maria Gonzalez',
    tipo: 'mayorista',
    terminos: 30,
    telefono: '+1 786-555-0101',
    email: 'maria@goldworld.com',
    compras: [
      {
        id: 'CMP-170', fecha: '2026-02-23', canal: 'Al Mayor', monto: 15500, pesoOroGramos: 55.7, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 23.8, monto: 6610 }, oro14k: { gramos: 31.9, monto: 8392 }, brillanteria: { piezas: 1, monto: 498 } },
        factura: { id: 'FAC-170', fechaEmision: '2026-02-23', fechaVencimiento: '2026-03-25', condicion: 30, monto: 15500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-165', fecha: '2026-02-22', canal: 'Al Mayor', monto: 19200, pesoOroGramos: 65.5, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 23.1, monto: 5821 }, oro14k: { gramos: 42.4, monto: 11669 }, brillanteria: { piezas: 3, monto: 1710 } },
        factura: { id: 'FAC-165', fechaEmision: '2026-02-22', fechaVencimiento: '2026-03-24', condicion: 30, monto: 19200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-149', fecha: '2026-02-21', canal: 'Al Mayor', monto: 28800, pesoOroGramos: 99.2, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 33.5, monto: 8689 }, oro14k: { gramos: 65.7, monto: 18579 }, brillanteria: { piezas: 2, monto: 1532 } },
        factura: { id: 'FAC-149', fechaEmision: '2026-02-21', fechaVencimiento: '2026-03-23', condicion: 30, monto: 28800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-141', fecha: '2026-02-20', canal: 'Al Mayor', monto: 11400, pesoOroGramos: 39.1, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 23.7, monto: 6156 }, oro14k: { gramos: 15.4, monto: 4462 }, brillanteria: { piezas: 2, monto: 782 } },
        factura: { id: 'FAC-141', fechaEmision: '2026-02-20', fechaVencimiento: '2026-03-22', condicion: 30, monto: 11400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-128', fecha: '2026-02-19', canal: 'Al Mayor', monto: 13300, pesoOroGramos: 48.9, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 19.2, monto: 4932 }, oro14k: { gramos: 29.7, monto: 8368 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-128', fechaEmision: '2026-02-19', fechaVencimiento: '2026-03-21', condicion: 30, monto: 13300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-117', fecha: '2026-02-18', canal: 'Al Mayor', monto: 14700, pesoOroGramos: 48.3, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 25.2, monto: 6328 }, oro14k: { gramos: 23.1, monto: 6918 }, brillanteria: { piezas: 2, monto: 1454 } },
        factura: { id: 'FAC-117', fechaEmision: '2026-02-18', fechaVencimiento: '2026-03-20', condicion: 30, monto: 14700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-101', fecha: '2026-02-14', canal: 'Al Mayor', monto: 25900, pesoOroGramos: 91.7, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 49.6, monto: 13190 }, oro14k: { gramos: 42.1, monto: 11374 }, brillanteria: { piezas: 2, monto: 1336 } },
        factura: { id: 'FAC-101', fechaEmision: '2026-02-14', fechaVencimiento: '2026-03-16', condicion: 30, monto: 25900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-065', fecha: '2026-02-11', canal: 'Al Mayor', monto: 13700, pesoOroGramos: 46.9, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 28.7, monto: 7371 }, oro14k: { gramos: 18.2, monto: 5417 }, brillanteria: { piezas: 4, monto: 912 } },
        factura: { id: 'FAC-065', fechaEmision: '2026-02-11', fechaVencimiento: '2026-03-13', condicion: 30, monto: 13700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-048', fecha: '2026-02-07', canal: 'Al Mayor', monto: 30200, pesoOroGramos: 105.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 41.3, monto: 10623 }, oro14k: { gramos: 64.3, monto: 18977 }, brillanteria: { piezas: 3, monto: 600 } },
        factura: { id: 'FAC-048', fechaEmision: '2026-02-07', fechaVencimiento: '2026-03-09', condicion: 30, monto: 30200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-034', fecha: '2026-02-06', canal: 'Al Mayor', monto: 18100, pesoOroGramos: 63.9, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 21.3, monto: 5824 }, oro14k: { gramos: 42.6, monto: 12276 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-034', fechaEmision: '2026-02-06', fechaVencimiento: '2026-03-08', condicion: 30, monto: 18100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-025', fecha: '2026-02-05', canal: 'Al Mayor', monto: 30700, pesoOroGramos: 107.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 63.1, monto: 17543 }, oro14k: { gramos: 44.8, monto: 12773 }, brillanteria: { piezas: 1, monto: 384 } },
        factura: { id: 'FAC-025', fechaEmision: '2026-02-05', fechaVencimiento: '2026-03-07', condicion: 30, monto: 30700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-013', fecha: '2026-02-04', canal: 'Al Mayor', monto: 19400, pesoOroGramos: 70.6, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 35.1, monto: 9190 }, oro14k: { gramos: 35.5, monto: 9834 }, brillanteria: { piezas: 1, monto: 376 } },
        factura: { id: 'FAC-013', fechaEmision: '2026-02-04', fechaVencimiento: '2026-03-06', condicion: 30, monto: 19400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-007', fecha: '2026-02-03', canal: 'Al Mayor', monto: 8100, pesoOroGramos: 25, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 13.5, monto: 3580 }, oro14k: { gramos: 11.5, monto: 3236 }, brillanteria: { piezas: 3, monto: 1284 } },
        factura: { id: 'FAC-007', fechaEmision: '2026-02-03', fechaVencimiento: '2026-03-05', condicion: 30, monto: 8100, montoPagado: 8100, fechaPago: '2026-02-22', estado: 'pagada', diasParaPago: 19 },
      },
      {
        id: 'CMP-210', fecha: '2026-01-20', canal: 'Al Mayor', monto: 16200, pesoOroGramos: 54.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 29.4, monto: 8115 }, oro14k: { gramos: 25.1, monto: 6907 }, brillanteria: { piezas: 2, monto: 1178 } },
        factura: { id: 'FAC-210', fechaEmision: '2026-01-20', fechaVencimiento: '2026-02-19', condicion: 30, monto: 16200, montoPagado: 8290, fechaPago: '2026-02-19', estado: 'parcial', diasParaPago: null },
      },
      {
        id: 'CMP-196', fecha: '2026-01-10', canal: 'Al Mayor', monto: 27600, pesoOroGramos: 91.3, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 32.3, monto: 8337 }, oro14k: { gramos: 59, monto: 16395 }, brillanteria: { piezas: 4, monto: 2868 } },
        factura: { id: 'FAC-196', fechaEmision: '2026-01-10', fechaVencimiento: '2026-02-09', condicion: 30, monto: 27600, montoPagado: 27600, fechaPago: '2026-02-14', estado: 'pagada', diasParaPago: 35 },
      },
      {
        id: 'CMP-182', fecha: '2026-01-05', canal: 'Al Mayor', monto: 14800, pesoOroGramos: 51.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 30.7, monto: 8288 }, oro14k: { gramos: 21.1, monto: 5818 }, brillanteria: { piezas: 2, monto: 694 } },
        factura: { id: 'FAC-182', fechaEmision: '2026-01-05', fechaVencimiento: '2026-02-04', condicion: 30, monto: 14800, montoPagado: 14800, fechaPago: '2026-01-30', estado: 'pagada', diasParaPago: 25 },
      },
      {
        id: 'CMP-245', fecha: '2025-12-22', canal: 'Al Mayor', monto: 9900, pesoOroGramos: 31, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 14.5, monto: 3827 }, oro14k: { gramos: 16.5, monto: 4599 }, brillanteria: { piezas: 2, monto: 1474 } },
        factura: { id: 'FAC-245', fechaEmision: '2025-12-22', fechaVencimiento: '2026-01-21', condicion: 30, monto: 9900, montoPagado: 9900, fechaPago: '2026-01-24', estado: 'pagada', diasParaPago: 33 },
      },
      {
        id: 'CMP-240', fecha: '2025-12-18', canal: 'Al Mayor', monto: 11000, pesoOroGramos: 34.1, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 11.9, monto: 3254 }, oro14k: { gramos: 22.2, monto: 5898 }, brillanteria: { piezas: 3, monto: 1848 } },
        factura: { id: 'FAC-240', fechaEmision: '2025-12-18', fechaVencimiento: '2026-01-17', condicion: 30, monto: 11000, montoPagado: 11000, fechaPago: '2026-01-18', estado: 'pagada', diasParaPago: 31 },
      },
      {
        id: 'CMP-234', fecha: '2025-12-10', canal: 'Al Mayor', monto: 8200, pesoOroGramos: 26.5, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 12.8, monto: 3579 }, oro14k: { gramos: 13.7, monto: 4097 }, brillanteria: { piezas: 2, monto: 524 } },
        factura: { id: 'FAC-234', fechaEmision: '2025-12-10', fechaVencimiento: '2026-01-09', condicion: 30, monto: 8200, montoPagado: 8200, fechaPago: '2026-01-12', estado: 'pagada', diasParaPago: 33 },
      },
      {
        id: 'CMP-230', fecha: '2025-12-05', canal: 'Al Mayor', monto: 24100, pesoOroGramos: 87.1, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 52.6, monto: 13899 }, oro14k: { gramos: 34.5, monto: 9699 }, brillanteria: { piezas: 1, monto: 502 } },
        factura: { id: 'FAC-230', fechaEmision: '2025-12-05', fechaVencimiento: '2026-01-04', condicion: 30, monto: 24100, montoPagado: 24100, fechaPago: '2025-12-26', estado: 'pagada', diasParaPago: 21 },
      },
    ],
  },
  {
    id: 'CLI-002',
    nombre: 'Roberto Diaz',
    tipo: 'mayorista',
    terminos: 60,
    telefono: '+1 786-555-0202',
    email: 'roberto@joyasrd.com',
    compras: [
      {
        id: 'CMP-173', fecha: '2026-02-23', canal: 'Al Mayor', monto: 11800, pesoOroGramos: 35.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 20.4, monto: 5525 }, oro14k: { gramos: 15.3, monto: 4363 }, brillanteria: { piezas: 4, monto: 1912 } },
        factura: { id: 'FAC-173', fechaEmision: '2026-02-23', fechaVencimiento: '2026-04-24', condicion: 60, monto: 11800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-161', fecha: '2026-02-22', canal: 'Al Mayor', monto: 29400, pesoOroGramos: 100, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 39.3, monto: 10226 }, oro14k: { gramos: 60.7, monto: 16558 }, brillanteria: { piezas: 4, monto: 2616 } },
        factura: { id: 'FAC-161', fechaEmision: '2026-02-22', fechaVencimiento: '2026-04-23', condicion: 60, monto: 29400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-155', fecha: '2026-02-21', canal: 'Al Mayor', monto: 28800, pesoOroGramos: 95, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 36, monto: 9610 }, oro14k: { gramos: 59, monto: 16050 }, brillanteria: { piezas: 4, monto: 3140 } },
        factura: { id: 'FAC-155', fechaEmision: '2026-02-21', fechaVencimiento: '2026-04-22', condicion: 60, monto: 28800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-140', fecha: '2026-02-20', canal: 'Al Mayor', monto: 15700, pesoOroGramos: 54.3, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 19.2, monto: 5192 }, oro14k: { gramos: 35.1, monto: 10508 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-140', fechaEmision: '2026-02-20', fechaVencimiento: '2026-04-21', condicion: 60, monto: 15700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-134', fecha: '2026-02-19', canal: 'Al Mayor', monto: 26900, pesoOroGramos: 91.1, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 35.5, monto: 9767 }, oro14k: { gramos: 55.6, monto: 16339 }, brillanteria: { piezas: 2, monto: 794 } },
        factura: { id: 'FAC-134', fechaEmision: '2026-02-19', fechaVencimiento: '2026-04-20', condicion: 60, monto: 26900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-120', fecha: '2026-02-18', canal: 'Al Mayor', monto: 15500, pesoOroGramos: 53.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 29.7, monto: 7456 }, oro14k: { gramos: 24, monto: 6240 }, brillanteria: { piezas: 4, monto: 1804 } },
        factura: { id: 'FAC-120', fechaEmision: '2026-02-18', fechaVencimiento: '2026-04-19', condicion: 60, monto: 15500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-110', fecha: '2026-02-17', canal: 'Al Mayor', monto: 29800, pesoOroGramos: 108, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 57.4, monto: 15036 }, oro14k: { gramos: 50.6, monto: 13200 }, brillanteria: { piezas: 2, monto: 1564 } },
        factura: { id: 'FAC-110', fechaEmision: '2026-02-17', fechaVencimiento: '2026-04-18', condicion: 60, monto: 29800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-096', fecha: '2026-02-14', canal: 'Al Mayor', monto: 22900, pesoOroGramos: 75.4, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 44.8, monto: 11777 }, oro14k: { gramos: 30.6, monto: 9191 }, brillanteria: { piezas: 4, monto: 1932 } },
        factura: { id: 'FAC-096', fechaEmision: '2026-02-14', fechaVencimiento: '2026-04-15', condicion: 60, monto: 22900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-092', fecha: '2026-02-13', canal: 'Al Mayor', monto: 18400, pesoOroGramos: 63, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 31.4, monto: 8547 }, oro14k: { gramos: 31.6, monto: 8887 }, brillanteria: { piezas: 3, monto: 966 } },
        factura: { id: 'FAC-092', fechaEmision: '2026-02-13', fechaVencimiento: '2026-04-14', condicion: 60, monto: 18400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-078', fecha: '2026-02-12', canal: 'Al Mayor', monto: 15700, pesoOroGramos: 52, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 22.1, monto: 5885 }, oro14k: { gramos: 29.9, monto: 8563 }, brillanteria: { piezas: 4, monto: 1252 } },
        factura: { id: 'FAC-078', fechaEmision: '2026-02-12', fechaVencimiento: '2026-04-13', condicion: 60, monto: 15700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-066', fecha: '2026-02-11', canal: 'Al Mayor', monto: 21200, pesoOroGramos: 68.7, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 30.1, monto: 8241 }, oro14k: { gramos: 38.6, monto: 11583 }, brillanteria: { piezas: 2, monto: 1376 } },
        factura: { id: 'FAC-066', fechaEmision: '2026-02-11', fechaVencimiento: '2026-04-12', condicion: 60, monto: 21200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-060', fecha: '2026-02-10', canal: 'Al Mayor', monto: 25300, pesoOroGramos: 89.4, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 53, monto: 14314 }, oro14k: { gramos: 36.4, monto: 10080 }, brillanteria: { piezas: 3, monto: 906 } },
        factura: { id: 'FAC-060', fechaEmision: '2026-02-10', fechaVencimiento: '2026-04-11', condicion: 60, monto: 25300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-045', fecha: '2026-02-07', canal: 'Al Mayor', monto: 25300, pesoOroGramos: 90.1, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 54.4, monto: 14092 }, oro14k: { gramos: 35.7, monto: 10704 }, brillanteria: { piezas: 1, monto: 504 } },
        factura: { id: 'FAC-045', fechaEmision: '2026-02-07', fechaVencimiento: '2026-04-08', condicion: 60, monto: 25300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-036', fecha: '2026-02-06', canal: 'Al Mayor', monto: 26300, pesoOroGramos: 86.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 29.8, monto: 7770 }, oro14k: { gramos: 56.7, monto: 15474 }, brillanteria: { piezas: 4, monto: 3056 } },
        factura: { id: 'FAC-036', fechaEmision: '2026-02-06', fechaVencimiento: '2026-04-07', condicion: 60, monto: 26300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-028', fecha: '2026-02-05', canal: 'Al Mayor', monto: 26800, pesoOroGramos: 99, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 41.5, monto: 10656 }, oro14k: { gramos: 57.5, monto: 15815 }, brillanteria: { piezas: 1, monto: 329 } },
        factura: { id: 'FAC-028', fechaEmision: '2026-02-05', fechaVencimiento: '2026-04-06', condicion: 60, monto: 26800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-004', fecha: '2026-02-03', canal: 'Al Mayor', monto: 11400, pesoOroGramos: 39.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 23, monto: 6436 }, oro14k: { gramos: 16.5, monto: 4649 }, brillanteria: { piezas: 1, monto: 315 } },
        factura: { id: 'FAC-004', fechaEmision: '2026-02-03', fechaVencimiento: '2026-04-04', condicion: 60, monto: 11400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-209', fecha: '2026-01-20', canal: 'Al Mayor', monto: 10800, pesoOroGramos: 33.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 11.9, monto: 3249 }, oro14k: { gramos: 22, monto: 6463 }, brillanteria: { piezas: 4, monto: 1088 } },
        factura: { id: 'FAC-209', fechaEmision: '2026-01-20', fechaVencimiento: '2026-03-21', condicion: 60, monto: 10800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-195', fecha: '2026-01-10', canal: 'Al Mayor', monto: 29600, pesoOroGramos: 99.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 59.5, monto: 15695 }, oro14k: { gramos: 40.1, monto: 10913 }, brillanteria: { piezas: 4, monto: 2992 } },
        factura: { id: 'FAC-195', fechaEmision: '2026-01-10', fechaVencimiento: '2026-03-11', condicion: 60, monto: 29600, montoPagado: 29600, fechaPago: '2026-02-17', estado: 'pagada', diasParaPago: 38 },
      },
      {
        id: 'CMP-185', fecha: '2026-01-05', canal: 'Al Mayor', monto: 24500, pesoOroGramos: 81.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 30, monto: 8178 }, oro14k: { gramos: 51.6, monto: 14646 }, brillanteria: { piezas: 4, monto: 1676 } },
        factura: { id: 'FAC-185', fechaEmision: '2026-01-05', fechaVencimiento: '2026-03-06', condicion: 60, monto: 24500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-246', fecha: '2025-12-22', canal: 'Al Mayor', monto: 17800, pesoOroGramos: 61.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 24.5, monto: 6701 }, oro14k: { gramos: 37.3, monto: 10476 }, brillanteria: { piezas: 1, monto: 623 } },
        factura: { id: 'FAC-246', fechaEmision: '2025-12-22', fechaVencimiento: '2026-02-20', condicion: 60, monto: 17800, montoPagado: 0, fechaPago: null, estado: 'vencida', diasParaPago: null },
      },
      {
        id: 'CMP-241', fecha: '2025-12-18', canal: 'Al Mayor', monto: 29800, pesoOroGramos: 107.3, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 48.6, monto: 12389 }, oro14k: { gramos: 58.7, monto: 16970 }, brillanteria: { piezas: 1, monto: 441 } },
        factura: { id: 'FAC-241', fechaEmision: '2025-12-18', fechaVencimiento: '2026-02-16', condicion: 60, monto: 29800, montoPagado: 17598, fechaPago: '2026-02-16', estado: 'parcial', diasParaPago: null },
      },
      {
        id: 'CMP-238', fecha: '2025-12-10', canal: 'Al Mayor', monto: 23000, pesoOroGramos: 78.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 34.4, monto: 9555 }, oro14k: { gramos: 44.2, monto: 12023 }, brillanteria: { piezas: 2, monto: 1422 } },
        factura: { id: 'FAC-238', fechaEmision: '2025-12-10', fechaVencimiento: '2026-02-08', condicion: 60, monto: 23000, montoPagado: 23000, fechaPago: '2026-01-29', estado: 'pagada', diasParaPago: 50 },
      },
      {
        id: 'CMP-231', fecha: '2025-12-05', canal: 'Al Mayor', monto: 29000, pesoOroGramos: 105.4, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 31.8, monto: 8834 }, oro14k: { gramos: 73.6, monto: 20166 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-231', fechaEmision: '2025-12-05', fechaVencimiento: '2026-02-03', condicion: 60, monto: 29000, montoPagado: 29000, fechaPago: '2026-02-01', estado: 'pagada', diasParaPago: 58 },
      },
    ],
  },
  {
    id: 'CLI-005',
    nombre: 'Pedro Fernandez',
    tipo: 'mayorista',
    terminos: 30,
    telefono: '+1 786-555-0505',
    email: 'pedro@mayoristasfl.com',
    compras: [
      {
        id: 'CMP-162', fecha: '2026-02-22', canal: 'Al Mayor', monto: 14000, pesoOroGramos: 49, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 22.6, monto: 6318 }, oro14k: { gramos: 26.4, monto: 7682 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-162', fechaEmision: '2026-02-22', fechaVencimiento: '2026-03-24', condicion: 30, monto: 14000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-139', fecha: '2026-02-20', canal: 'Al Mayor', monto: 5300, pesoOroGramos: 18.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 6.5, monto: 1672 }, oro14k: { gramos: 12.3, monto: 3332 }, brillanteria: { piezas: 1, monto: 296 } },
        factura: { id: 'FAC-139', fechaEmision: '2026-02-20', fechaVencimiento: '2026-03-22', condicion: 30, monto: 5300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-122', fecha: '2026-02-18', canal: 'Al Mayor', monto: 6900, pesoOroGramos: 20.5, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 12.1, monto: 3150 }, oro14k: { gramos: 8.4, monto: 2374 }, brillanteria: { piezas: 2, monto: 1376 } },
        factura: { id: 'FAC-122', fechaEmision: '2026-02-18', fechaVencimiento: '2026-03-20', condicion: 30, monto: 6900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-112', fecha: '2026-02-17', canal: 'Al Mayor', monto: 15700, pesoOroGramos: 51.9, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 19.1, monto: 4865 }, oro14k: { gramos: 32.8, monto: 9819 }, brillanteria: { piezas: 4, monto: 1016 } },
        factura: { id: 'FAC-112', fechaEmision: '2026-02-17', fechaVencimiento: '2026-03-19', condicion: 30, monto: 15700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-103', fecha: '2026-02-14', canal: 'Al Mayor', monto: 8000, pesoOroGramos: 23.3, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 10.5, monto: 2692 }, oro14k: { gramos: 12.8, monto: 3812 }, brillanteria: { piezas: 2, monto: 1496 } },
        factura: { id: 'FAC-103', fechaEmision: '2026-02-14', fechaVencimiento: '2026-03-16', condicion: 30, monto: 8000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-077', fecha: '2026-02-12', canal: 'Al Mayor', monto: 6700, pesoOroGramos: 17.7, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 8.9, monto: 2272 }, oro14k: { gramos: 8.8, monto: 2295 }, brillanteria: { piezas: 3, monto: 2133 } },
        factura: { id: 'FAC-077', fechaEmision: '2026-02-12', fechaVencimiento: '2026-03-14', condicion: 30, monto: 6700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-046', fecha: '2026-02-07', canal: 'Al Mayor', monto: 9200, pesoOroGramos: 26.5, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 11.7, monto: 3175 }, oro14k: { gramos: 14.8, monto: 4012 }, brillanteria: { piezas: 3, monto: 2013 } },
        factura: { id: 'FAC-046', fechaEmision: '2026-02-07', fechaVencimiento: '2026-03-09', condicion: 30, monto: 9200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-029', fecha: '2026-02-05', canal: 'Al Mayor', monto: 6600, pesoOroGramos: 24.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 12.8, monto: 3226 }, oro14k: { gramos: 12, monto: 3374 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-029', fechaEmision: '2026-02-05', fechaVencimiento: '2026-03-07', condicion: 30, monto: 6600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-018', fecha: '2026-02-04', canal: 'Al Mayor', monto: 5700, pesoOroGramos: 19.6, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 9.8, monto: 2678 }, oro14k: { gramos: 9.8, monto: 2692 }, brillanteria: { piezas: 1, monto: 330 } },
        factura: { id: 'FAC-018', fechaEmision: '2026-02-04', fechaVencimiento: '2026-03-06', condicion: 30, monto: 5700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-008', fecha: '2026-02-03', canal: 'Al Mayor', monto: 8700, pesoOroGramos: 29.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 10, monto: 2636 }, oro14k: { gramos: 19.7, monto: 5464 }, brillanteria: { piezas: 1, monto: 600 } },
        factura: { id: 'FAC-008', fechaEmision: '2026-02-03', fechaVencimiento: '2026-03-05', condicion: 30, monto: 8700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-225', fecha: '2026-01-28', canal: 'Al Mayor', monto: 15300, pesoOroGramos: 50, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 20, monto: 5387 }, oro14k: { gramos: 30, monto: 8935 }, brillanteria: { piezas: 2, monto: 978 } },
        factura: { id: 'FAC-225', fechaEmision: '2026-01-28', fechaVencimiento: '2026-02-27', condicion: 30, monto: 15300, montoPagado: 15300, fechaPago: '2026-02-18', estado: 'pagada', diasParaPago: 21 },
      },
      {
        id: 'CMP-219', fecha: '2026-01-25', canal: 'Al Mayor', monto: 4600, pesoOroGramos: 13, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 5, monto: 1339 }, oro14k: { gramos: 8, monto: 2250 }, brillanteria: { piezas: 3, monto: 1011 } },
        factura: { id: 'FAC-219', fechaEmision: '2026-01-25', fechaVencimiento: '2026-02-24', condicion: 30, monto: 4600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-186', fecha: '2026-01-05', canal: 'Al Mayor', monto: 13000, pesoOroGramos: 40.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 19.5, monto: 5166 }, oro14k: { gramos: 21.3, monto: 6337 }, brillanteria: { piezas: 3, monto: 1497 } },
        factura: { id: 'FAC-186', fechaEmision: '2026-01-05', fechaVencimiento: '2026-02-04', condicion: 30, monto: 13000, montoPagado: 13000, fechaPago: '2026-02-02', estado: 'pagada', diasParaPago: 28 },
      },
      {
        id: 'CMP-242', fecha: '2025-12-18', canal: 'Al Mayor', monto: 9400, pesoOroGramos: 34.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 15.2, monto: 3985 }, oro14k: { gramos: 19.6, monto: 5415 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-242', fechaEmision: '2025-12-18', fechaVencimiento: '2026-01-17', condicion: 30, monto: 9400, montoPagado: 9400, fechaPago: '2026-01-15', estado: 'pagada', diasParaPago: 28 },
      },
      {
        id: 'CMP-232', fecha: '2025-12-05', canal: 'Al Mayor', monto: 8300, pesoOroGramos: 26.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 16.6, monto: 4435 }, oro14k: { gramos: 10.3, monto: 3055 }, brillanteria: { piezas: 2, monto: 810 } },
        factura: { id: 'FAC-232', fechaEmision: '2025-12-05', fechaVencimiento: '2026-01-04', condicion: 30, monto: 8300, montoPagado: 8300, fechaPago: '2026-01-04', estado: 'pagada', diasParaPago: 30 },
      },
    ],
  },
  {
    id: 'CLI-008',
    nombre: 'Sofia Herrera',
    tipo: 'mayorista',
    terminos: 30,
    telefono: '+1 786-555-0808',
    email: 'sofia@joyasherrera.com',
    compras: [
      {
        id: 'CMP-175', fecha: '2026-02-23', canal: 'Al Mayor', monto: 19900, pesoOroGramos: 62.2, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 21.6, monto: 5803 }, oro14k: { gramos: 40.6, monto: 12193 }, brillanteria: { piezas: 4, monto: 1904 } },
        factura: { id: 'FAC-175', fechaEmision: '2026-02-23', fechaVencimiento: '2026-03-25', condicion: 30, monto: 19900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-163', fecha: '2026-02-22', canal: 'Al Mayor', monto: 10600, pesoOroGramos: 34.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 12.2, monto: 3068 }, oro14k: { gramos: 22, monto: 6338 }, brillanteria: { piezas: 2, monto: 1194 } },
        factura: { id: 'FAC-163', fechaEmision: '2026-02-22', fechaVencimiento: '2026-03-24', condicion: 30, monto: 10600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-142', fecha: '2026-02-20', canal: 'Al Mayor', monto: 21600, pesoOroGramos: 74.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 32, monto: 8684 }, oro14k: { gramos: 42.5, monto: 11396 }, brillanteria: { piezas: 2, monto: 1520 } },
        factura: { id: 'FAC-142', fechaEmision: '2026-02-20', fechaVencimiento: '2026-03-22', condicion: 30, monto: 21600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-135', fecha: '2026-02-19', canal: 'Al Mayor', monto: 26700, pesoOroGramos: 100.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 49, monto: 12261 }, oro14k: { gramos: 51.2, monto: 13713 }, brillanteria: { piezas: 3, monto: 726 } },
        factura: { id: 'FAC-135', fechaEmision: '2026-02-19', fechaVencimiento: '2026-03-21', condicion: 30, monto: 26700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-118', fecha: '2026-02-18', canal: 'Al Mayor', monto: 23900, pesoOroGramos: 80.8, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 26.7, monto: 7220 }, oro14k: { gramos: 54.1, monto: 15262 }, brillanteria: { piezas: 2, monto: 1418 } },
        factura: { id: 'FAC-118', fechaEmision: '2026-02-18', fechaVencimiento: '2026-03-20', condicion: 30, monto: 23900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-106', fecha: '2026-02-17', canal: 'Al Mayor', monto: 11700, pesoOroGramos: 39.2, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 19.2, monto: 5233 }, oro14k: { gramos: 20, monto: 5674 }, brillanteria: { piezas: 1, monto: 793 } },
        factura: { id: 'FAC-106', fechaEmision: '2026-02-17', fechaVencimiento: '2026-03-19', condicion: 30, monto: 11700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-098', fecha: '2026-02-14', canal: 'Al Mayor', monto: 9200, pesoOroGramos: 32.7, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 16.9, monto: 4677 }, oro14k: { gramos: 15.8, monto: 4178 }, brillanteria: { piezas: 1, monto: 345 } },
        factura: { id: 'FAC-098', fechaEmision: '2026-02-14', fechaVencimiento: '2026-03-16', condicion: 30, monto: 9200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-091', fecha: '2026-02-13', canal: 'Al Mayor', monto: 20700, pesoOroGramos: 70.4, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 34, monto: 9078 }, oro14k: { gramos: 36.4, monto: 9658 }, brillanteria: { piezas: 4, monto: 1964 } },
        factura: { id: 'FAC-091', fechaEmision: '2026-02-13', fechaVencimiento: '2026-03-15', condicion: 30, monto: 20700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-076', fecha: '2026-02-12', canal: 'Al Mayor', monto: 30100, pesoOroGramos: 101.9, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 50.5, monto: 14094 }, oro14k: { gramos: 51.4, monto: 14454 }, brillanteria: { piezas: 4, monto: 1552 } },
        factura: { id: 'FAC-076', fechaEmision: '2026-02-12', fechaVencimiento: '2026-03-14', condicion: 30, monto: 30100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-069', fecha: '2026-02-11', canal: 'Al Mayor', monto: 10700, pesoOroGramos: 38, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 12.7, monto: 3349 }, oro14k: { gramos: 25.3, monto: 7051 }, brillanteria: { piezas: 1, monto: 300 } },
        factura: { id: 'FAC-069', fechaEmision: '2026-02-11', fechaVencimiento: '2026-03-13', condicion: 30, monto: 10700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-058', fecha: '2026-02-10', canal: 'Al Mayor', monto: 12500, pesoOroGramos: 41.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 22.7, monto: 6072 }, oro14k: { gramos: 19.2, monto: 5572 }, brillanteria: { piezas: 4, monto: 856 } },
        factura: { id: 'FAC-058', fechaEmision: '2026-02-10', fechaVencimiento: '2026-03-12', condicion: 30, monto: 12500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-051', fecha: '2026-02-07', canal: 'Al Mayor', monto: 22800, pesoOroGramos: 80, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 35.2, monto: 9001 }, oro14k: { gramos: 44.8, monto: 12809 }, brillanteria: { piezas: 3, monto: 990 } },
        factura: { id: 'FAC-051', fechaEmision: '2026-02-07', fechaVencimiento: '2026-03-09', condicion: 30, monto: 22800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-035', fecha: '2026-02-06', canal: 'Al Mayor', monto: 15400, pesoOroGramos: 51.1, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 28, monto: 7603 }, oro14k: { gramos: 23.1, monto: 6623 }, brillanteria: { piezas: 2, monto: 1174 } },
        factura: { id: 'FAC-035', fechaEmision: '2026-02-06', fechaVencimiento: '2026-03-08', condicion: 30, monto: 15400, montoPagado: 15400, fechaPago: '2026-02-18', estado: 'pagada', diasParaPago: 12 },
      },
      {
        id: 'CMP-022', fecha: '2026-02-05', canal: 'Al Mayor', monto: 18400, pesoOroGramos: 64.7, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 39.1, monto: 10330 }, oro14k: { gramos: 25.6, monto: 7210 }, brillanteria: { piezas: 4, monto: 860 } },
        factura: { id: 'FAC-022', fechaEmision: '2026-02-05', fechaVencimiento: '2026-03-07', condicion: 30, monto: 18400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-019', fecha: '2026-02-04', canal: 'Al Mayor', monto: 21400, pesoOroGramos: 72.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 32.7, monto: 8642 }, oro14k: { gramos: 39.8, monto: 10469 }, brillanteria: { piezas: 3, monto: 2289 } },
        factura: { id: 'FAC-019', fechaEmision: '2026-02-04', fechaVencimiento: '2026-03-06', condicion: 30, monto: 21400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-002', fecha: '2026-02-03', canal: 'Al Mayor', monto: 13000, pesoOroGramos: 46.4, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 15.4, monto: 4230 }, oro14k: { gramos: 31, monto: 8770 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-002', fechaEmision: '2026-02-03', fechaVencimiento: '2026-03-05', condicion: 30, monto: 13000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-224', fecha: '2026-01-28', canal: 'Al Mayor', monto: 18700, pesoOroGramos: 67.7, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 41.2, monto: 10636 }, oro14k: { gramos: 26.5, monto: 7437 }, brillanteria: { piezas: 3, monto: 627 } },
        factura: { id: 'FAC-224', fechaEmision: '2026-01-28', fechaVencimiento: '2026-02-27', condicion: 30, monto: 18700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-215', fecha: '2026-01-25', canal: 'Al Mayor', monto: 25400, pesoOroGramos: 91.5, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 44.6, monto: 11649 }, oro14k: { gramos: 46.9, monto: 13751 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-215', fechaEmision: '2026-01-25', fechaVencimiento: '2026-02-24', condicion: 30, monto: 25400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-211', fecha: '2026-01-20', canal: 'Al Mayor', monto: 21000, pesoOroGramos: 72.3, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 40.3, monto: 11077 }, oro14k: { gramos: 32, monto: 9284 }, brillanteria: { piezas: 3, monto: 639 } },
        factura: { id: 'FAC-211', fechaEmision: '2026-01-20', fechaVencimiento: '2026-02-19', condicion: 30, monto: 21000, montoPagado: 0, fechaPago: null, estado: 'vencida', diasParaPago: null },
      },
      {
        id: 'CMP-204', fecha: '2026-01-15', canal: 'Al Mayor', monto: 28700, pesoOroGramos: 102.3, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 48.3, monto: 13087 }, oro14k: { gramos: 54, monto: 15109 }, brillanteria: { piezas: 2, monto: 504 } },
        factura: { id: 'FAC-204', fechaEmision: '2026-01-15', fechaVencimiento: '2026-02-14', condicion: 30, monto: 28700, montoPagado: 28700, fechaPago: '2026-02-22', estado: 'pagada', diasParaPago: 38 },
      },
      {
        id: 'CMP-248', fecha: '2025-12-22', canal: 'Al Mayor', monto: 25900, pesoOroGramos: 88.1, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 41, monto: 11037 }, oro14k: { gramos: 47.1, monto: 14127 }, brillanteria: { piezas: 2, monto: 736 } },
        factura: { id: 'FAC-248', fechaEmision: '2025-12-22', fechaVencimiento: '2026-01-21', condicion: 30, monto: 25900, montoPagado: 25900, fechaPago: '2026-01-11', estado: 'pagada', diasParaPago: 20 },
      },
      {
        id: 'CMP-243', fecha: '2025-12-18', canal: 'Al Mayor', monto: 17000, pesoOroGramos: 54, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 27.4, monto: 7119 }, oro14k: { gramos: 26.6, monto: 7193 }, brillanteria: { piezas: 4, monto: 2688 } },
        factura: { id: 'FAC-243', fechaEmision: '2025-12-18', fechaVencimiento: '2026-01-17', condicion: 30, monto: 17000, montoPagado: 17000, fechaPago: '2026-01-16', estado: 'pagada', diasParaPago: 29 },
      },
      {
        id: 'CMP-235', fecha: '2025-12-10', canal: 'Al Mayor', monto: 20500, pesoOroGramos: 73.9, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 44.9, monto: 12220 }, oro14k: { gramos: 29, monto: 8280 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-235', fechaEmision: '2025-12-10', fechaVencimiento: '2026-01-09', condicion: 30, monto: 20500, montoPagado: 20500, fechaPago: '2026-01-12', estado: 'pagada', diasParaPago: 33 },
      },
    ],
  },
  {
    id: 'CLI-011',
    nombre: 'Carmen Vega',
    tipo: 'mayorista',
    terminos: 30,
    telefono: '+1 786-555-1111',
    email: 'carmen@vegajewelry.com',
    compras: [
      {
        id: 'CMP-151', fecha: '2026-02-21', canal: 'Al Mayor', monto: 11600, pesoOroGramos: 44.1, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 23.5, monto: 6137 }, oro14k: { gramos: 20.6, monto: 5463 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-151', fechaEmision: '2026-02-21', fechaVencimiento: '2026-03-23', condicion: 30, monto: 11600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-145', fecha: '2026-02-20', canal: 'Al Mayor', monto: 7200, pesoOroGramos: 25, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 8, monto: 2055 }, oro14k: { gramos: 17, monto: 4732 }, brillanteria: { piezas: 1, monto: 413 } },
        factura: { id: 'FAC-145', fechaEmision: '2026-02-20', fechaVencimiento: '2026-03-22', condicion: 30, monto: 7200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-132', fecha: '2026-02-19', canal: 'Al Mayor', monto: 7100, pesoOroGramos: 21.5, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 10.9, monto: 2731 }, oro14k: { gramos: 10.6, monto: 2769 }, brillanteria: { piezas: 2, monto: 1600 } },
        factura: { id: 'FAC-132', fechaEmision: '2026-02-19', fechaVencimiento: '2026-03-21', condicion: 30, monto: 7100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-124', fecha: '2026-02-18', canal: 'Al Mayor', monto: 12900, pesoOroGramos: 40.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 24.1, monto: 6663 }, oro14k: { gramos: 16.6, monto: 4839 }, brillanteria: { piezas: 2, monto: 1398 } },
        factura: { id: 'FAC-124', fechaEmision: '2026-02-18', fechaVencimiento: '2026-03-20', condicion: 30, monto: 12900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-090', fecha: '2026-02-13', canal: 'Al Mayor', monto: 6000, pesoOroGramos: 19.9, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 12.3, monto: 3171 }, oro14k: { gramos: 7.6, monto: 2236 }, brillanteria: { piezas: 1, monto: 593 } },
        factura: { id: 'FAC-090', fechaEmision: '2026-02-13', fechaVencimiento: '2026-03-15', condicion: 30, monto: 6000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-070', fecha: '2026-02-11', canal: 'Al Mayor', monto: 7500, pesoOroGramos: 27.7, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 16, monto: 4318 }, oro14k: { gramos: 11.7, monto: 3182 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-070', fechaEmision: '2026-02-11', fechaVencimiento: '2026-03-13', condicion: 30, monto: 7500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-061', fecha: '2026-02-10', canal: 'Al Mayor', monto: 15300, pesoOroGramos: 46.4, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 20.6, monto: 5686 }, oro14k: { gramos: 25.8, monto: 7490 }, brillanteria: { piezas: 3, monto: 2124 } },
        factura: { id: 'FAC-061', fechaEmision: '2026-02-10', fechaVencimiento: '2026-03-12', condicion: 30, monto: 15300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-049', fecha: '2026-02-07', canal: 'Al Mayor', monto: 8000, pesoOroGramos: 26, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 9.1, monto: 2361 }, oro14k: { gramos: 16.9, monto: 4987 }, brillanteria: { piezas: 1, monto: 652 } },
        factura: { id: 'FAC-049', fechaEmision: '2026-02-07', fechaVencimiento: '2026-03-09', condicion: 30, monto: 8000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-038', fecha: '2026-02-06', canal: 'Al Mayor', monto: 6300, pesoOroGramos: 15.8, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 6.5, monto: 1765 }, oro14k: { gramos: 9.3, monto: 2510 }, brillanteria: { piezas: 3, monto: 2025 } },
        factura: { id: 'FAC-038', fechaEmision: '2026-02-06', fechaVencimiento: '2026-03-08', condicion: 30, monto: 6300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-023', fecha: '2026-02-05', canal: 'Al Mayor', monto: 10600, pesoOroGramos: 33.6, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 19.4, monto: 5305 }, oro14k: { gramos: 14.2, monto: 4149 }, brillanteria: { piezas: 2, monto: 1146 } },
        factura: { id: 'FAC-023', fechaEmision: '2026-02-05', fechaVencimiento: '2026-03-07', condicion: 30, monto: 10600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-017', fecha: '2026-02-04', canal: 'Al Mayor', monto: 12900, pesoOroGramos: 44.4, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 23, monto: 5767 }, oro14k: { gramos: 21.4, monto: 6021 }, brillanteria: { piezas: 4, monto: 1112 } },
        factura: { id: 'FAC-017', fechaEmision: '2026-02-04', fechaVencimiento: '2026-03-06', condicion: 30, monto: 12900, montoPagado: 12900, fechaPago: '2026-02-20', estado: 'pagada', diasParaPago: 16 },
      },
      {
        id: 'CMP-005', fecha: '2026-02-03', canal: 'Al Mayor', monto: 5900, pesoOroGramos: 16.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 9.5, monto: 2534 }, oro14k: { gramos: 7.1, monto: 2124 }, brillanteria: { piezas: 2, monto: 1242 } },
        factura: { id: 'FAC-005', fechaEmision: '2026-02-03', fechaVencimiento: '2026-03-05', condicion: 30, monto: 5900, montoPagado: 5900, fechaPago: '2026-02-21', estado: 'pagada', diasParaPago: 18 },
      },
      {
        id: 'CMP-216', fecha: '2026-01-25', canal: 'Al Mayor', monto: 12300, pesoOroGramos: 34.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 18, monto: 4811 }, oro14k: { gramos: 16.8, monto: 4489 }, brillanteria: { piezas: 4, monto: 3000 } },
        factura: { id: 'FAC-216', fechaEmision: '2026-01-25', fechaVencimiento: '2026-02-24', condicion: 30, monto: 12300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-205', fecha: '2026-01-15', canal: 'Al Mayor', monto: 13000, pesoOroGramos: 41.1, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 18.9, monto: 5173 }, oro14k: { gramos: 22.2, monto: 6535 }, brillanteria: { piezas: 2, monto: 1292 } },
        factura: { id: 'FAC-205', fechaEmision: '2026-01-15', fechaVencimiento: '2026-02-14', condicion: 30, monto: 13000, montoPagado: 13000, fechaPago: '2026-02-20', estado: 'pagada', diasParaPago: 36 },
      },
      {
        id: 'CMP-192', fecha: '2026-01-08', canal: 'Al Mayor', monto: 12300, pesoOroGramos: 42.4, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 14.3, monto: 3703 }, oro14k: { gramos: 28.1, monto: 7466 }, brillanteria: { piezas: 3, monto: 1131 } },
        factura: { id: 'FAC-192', fechaEmision: '2026-01-08', fechaVencimiento: '2026-02-07', condicion: 30, monto: 12300, montoPagado: 12300, fechaPago: '2026-01-30', estado: 'pagada', diasParaPago: 22 },
      },
      {
        id: 'CMP-181', fecha: '2026-01-05', canal: 'Al Mayor', monto: 10600, pesoOroGramos: 32.4, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 10.6, monto: 2895 }, oro14k: { gramos: 21.8, monto: 5917 }, brillanteria: { piezas: 3, monto: 1788 } },
        factura: { id: 'FAC-181', fechaEmision: '2026-01-05', fechaVencimiento: '2026-02-04', condicion: 30, monto: 10600, montoPagado: 10600, fechaPago: '2026-02-05', estado: 'pagada', diasParaPago: 31 },
      },
      {
        id: 'CMP-247', fecha: '2025-12-22', canal: 'Al Mayor', monto: 11800, pesoOroGramos: 37.4, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 12.6, monto: 3434 }, oro14k: { gramos: 24.8, monto: 6641 }, brillanteria: { piezas: 3, monto: 1725 } },
        factura: { id: 'FAC-247', fechaEmision: '2025-12-22', fechaVencimiento: '2026-01-21', condicion: 30, monto: 11800, montoPagado: 11800, fechaPago: '2026-01-15', estado: 'pagada', diasParaPago: 24 },
      },
      {
        id: 'CMP-237', fecha: '2025-12-10', canal: 'Al Mayor', monto: 10800, pesoOroGramos: 37.7, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 15.3, monto: 3849 }, oro14k: { gramos: 22.4, monto: 6509 }, brillanteria: { piezas: 1, monto: 442 } },
        factura: { id: 'FAC-237', fechaEmision: '2025-12-10', fechaVencimiento: '2026-01-09', condicion: 30, monto: 10800, montoPagado: 10800, fechaPago: '2026-01-05', estado: 'pagada', diasParaPago: 26 },
      },
    ],
  },
  {
    id: 'CLI-013',
    nombre: 'Ricardo Mendez',
    tipo: 'mayorista',
    terminos: 60,
    telefono: '+1 786-555-1313',
    email: 'ricardo@mendezjewels.com',
    compras: [
      {
        id: 'CMP-177', fecha: '2026-02-23', canal: 'Al Mayor', monto: 11800, pesoOroGramos: 38.1, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 11.8, monto: 3219 }, oro14k: { gramos: 26.3, monto: 7306 }, brillanteria: { piezas: 3, monto: 1275 } },
        factura: { id: 'FAC-177', fechaEmision: '2026-02-23', fechaVencimiento: '2026-04-24', condicion: 60, monto: 11800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-160', fecha: '2026-02-22', canal: 'Al Mayor', monto: 28600, pesoOroGramos: 108.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 64.1, monto: 16979 }, oro14k: { gramos: 44.7, monto: 11621 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-160', fechaEmision: '2026-02-22', fechaVencimiento: '2026-04-23', condicion: 60, monto: 28600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-153', fecha: '2026-02-21', canal: 'Al Mayor', monto: 13200, pesoOroGramos: 44.2, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 23.2, monto: 6416 }, oro14k: { gramos: 21, monto: 5509 }, brillanteria: { piezas: 3, monto: 1275 } },
        factura: { id: 'FAC-153', fechaEmision: '2026-02-21', fechaVencimiento: '2026-04-22', condicion: 60, monto: 13200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-143', fecha: '2026-02-20', canal: 'Al Mayor', monto: 16500, pesoOroGramos: 60.7, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 28, monto: 7106 }, oro14k: { gramos: 32.7, monto: 9394 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-143', fechaEmision: '2026-02-20', fechaVencimiento: '2026-04-21', condicion: 60, monto: 16500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-131', fecha: '2026-02-19', canal: 'Al Mayor', monto: 18100, pesoOroGramos: 62.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 28.3, monto: 7557 }, oro14k: { gramos: 34.4, monto: 9659 }, brillanteria: { piezas: 2, monto: 884 } },
        factura: { id: 'FAC-131', fechaEmision: '2026-02-19', fechaVencimiento: '2026-04-20', condicion: 60, monto: 18100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-111', fecha: '2026-02-17', canal: 'Al Mayor', monto: 18100, pesoOroGramos: 61.2, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 22.5, monto: 6295 }, oro14k: { gramos: 38.7, monto: 11427 }, brillanteria: { piezas: 1, monto: 378 } },
        factura: { id: 'FAC-111', fechaEmision: '2026-02-17', fechaVencimiento: '2026-04-18', condicion: 60, monto: 18100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-099', fecha: '2026-02-14', canal: 'Al Mayor', monto: 14100, pesoOroGramos: 52.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 24, monto: 6425 }, oro14k: { gramos: 28.2, monto: 7350 }, brillanteria: { piezas: 1, monto: 325 } },
        factura: { id: 'FAC-099', fechaEmision: '2026-02-14', fechaVencimiento: '2026-04-15', condicion: 60, monto: 14100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-088', fecha: '2026-02-13', canal: 'Al Mayor', monto: 11000, pesoOroGramos: 41.5, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 14.1, monto: 3617 }, oro14k: { gramos: 27.4, monto: 7179 }, brillanteria: { piezas: 1, monto: 204 } },
        factura: { id: 'FAC-088', fechaEmision: '2026-02-13', fechaVencimiento: '2026-04-14', condicion: 60, monto: 11000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-081', fecha: '2026-02-12', canal: 'Al Mayor', monto: 26900, pesoOroGramos: 102.3, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 37.7, monto: 9981 }, oro14k: { gramos: 64.6, monto: 16919 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-081', fechaEmision: '2026-02-12', fechaVencimiento: '2026-04-13', condicion: 60, monto: 26900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-068', fecha: '2026-02-11', canal: 'Al Mayor', monto: 22000, pesoOroGramos: 79, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 30.6, monto: 8129 }, oro14k: { gramos: 48.4, monto: 13262 }, brillanteria: { piezas: 3, monto: 609 } },
        factura: { id: 'FAC-068', fechaEmision: '2026-02-11', fechaVencimiento: '2026-04-12', condicion: 60, monto: 22000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-056', fecha: '2026-02-10', canal: 'Al Mayor', monto: 18600, pesoOroGramos: 67.2, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 31.5, monto: 8543 }, oro14k: { gramos: 35.7, monto: 9317 }, brillanteria: { piezas: 2, monto: 740 } },
        factura: { id: 'FAC-056', fechaEmision: '2026-02-10', fechaVencimiento: '2026-04-11', condicion: 60, monto: 18600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-050', fecha: '2026-02-07', canal: 'Al Mayor', monto: 13500, pesoOroGramos: 44.3, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 16.4, monto: 4401 }, oro14k: { gramos: 27.9, monto: 7287 }, brillanteria: { piezas: 4, monto: 1812 } },
        factura: { id: 'FAC-050', fechaEmision: '2026-02-07', fechaVencimiento: '2026-04-08', condicion: 60, monto: 13500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-037', fecha: '2026-02-06', canal: 'Al Mayor', monto: 14500, pesoOroGramos: 47.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 16.5, monto: 4297 }, oro14k: { gramos: 31.1, monto: 8148 }, brillanteria: { piezas: 3, monto: 2055 } },
        factura: { id: 'FAC-037', fechaEmision: '2026-02-06', fechaVencimiento: '2026-04-07', condicion: 60, monto: 14500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-016', fecha: '2026-02-04', canal: 'Al Mayor', monto: 26900, pesoOroGramos: 97.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 37.8, monto: 10467 }, oro14k: { gramos: 59.8, monto: 15856 }, brillanteria: { piezas: 1, monto: 577 } },
        factura: { id: 'FAC-016', fechaEmision: '2026-02-04', fechaVencimiento: '2026-04-05', condicion: 60, monto: 26900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-227', fecha: '2026-01-28', canal: 'Al Mayor', monto: 25700, pesoOroGramos: 87.1, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 30, monto: 8377 }, oro14k: { gramos: 57.1, monto: 16625 }, brillanteria: { piezas: 1, monto: 698 } },
        factura: { id: 'FAC-227', fechaEmision: '2026-01-28', fechaVencimiento: '2026-03-29', condicion: 60, monto: 25700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-217', fecha: '2026-01-25', canal: 'Al Mayor', monto: 12200, pesoOroGramos: 38.1, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 14.5, monto: 3765 }, oro14k: { gramos: 23.6, monto: 6830 }, brillanteria: { piezas: 3, monto: 1605 } },
        factura: { id: 'FAC-217', fechaEmision: '2026-01-25', fechaVencimiento: '2026-03-26', condicion: 60, monto: 12200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-202', fecha: '2026-01-15', canal: 'Al Mayor', monto: 20100, pesoOroGramos: 69.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 41.8, monto: 11401 }, oro14k: { gramos: 28.1, monto: 8189 }, brillanteria: { piezas: 2, monto: 510 } },
        factura: { id: 'FAC-202', fechaEmision: '2026-01-15', fechaVencimiento: '2026-03-16', condicion: 60, monto: 20100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-197', fecha: '2026-01-10', canal: 'Al Mayor', monto: 27900, pesoOroGramos: 99.2, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 37.4, monto: 9865 }, oro14k: { gramos: 61.8, monto: 18035 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-197', fechaEmision: '2026-01-10', fechaVencimiento: '2026-03-11', condicion: 60, monto: 27900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-191', fecha: '2026-01-08', canal: 'Al Mayor', monto: 22300, pesoOroGramos: 81.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 48.3, monto: 12276 }, oro14k: { gramos: 33.3, monto: 9498 }, brillanteria: { piezas: 2, monto: 526 } },
        factura: { id: 'FAC-191', fechaEmision: '2026-01-08', fechaVencimiento: '2026-03-09', condicion: 60, monto: 22300, montoPagado: 22300, fechaPago: '2026-02-20', estado: 'pagada', diasParaPago: 43 },
      },
      {
        id: 'CMP-249', fecha: '2025-12-22', canal: 'Al Mayor', monto: 13400, pesoOroGramos: 51.7, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 30.4, monto: 7764 }, oro14k: { gramos: 21.3, monto: 5636 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-249', fechaEmision: '2025-12-22', fechaVencimiento: '2026-02-20', condicion: 60, monto: 13400, montoPagado: 0, fechaPago: null, estado: 'vencida', diasParaPago: null },
      },
      {
        id: 'CMP-236', fecha: '2025-12-10', canal: 'Al Mayor', monto: 14900, pesoOroGramos: 55, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 31.3, monto: 7916 }, oro14k: { gramos: 23.7, monto: 6665 }, brillanteria: { piezas: 1, monto: 319 } },
        factura: { id: 'FAC-236', fechaEmision: '2025-12-10', fechaVencimiento: '2026-02-08', condicion: 60, monto: 14900, montoPagado: 14900, fechaPago: '2026-02-08', estado: 'pagada', diasParaPago: 60 },
      },
    ],
  },
  {
    id: 'CLI-014',
    nombre: 'Patricia Luna',
    tipo: 'mayorista',
    terminos: 30,
    telefono: '+1 786-555-1414',
    email: 'patricia@lunagold.com',
    compras: [
      {
        id: 'CMP-171', fecha: '2026-02-23', canal: 'Al Mayor', monto: 12600, pesoOroGramos: 41.3, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 25.4, monto: 6570 }, oro14k: { gramos: 15.9, monto: 4696 }, brillanteria: { piezas: 2, monto: 1334 } },
        factura: { id: 'FAC-171', fechaEmision: '2026-02-23', fechaVencimiento: '2026-03-25', condicion: 30, monto: 12600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-164', fecha: '2026-02-22', canal: 'Al Mayor', monto: 28900, pesoOroGramos: 99.4, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 53.2, monto: 14691 }, oro14k: { gramos: 46.2, monto: 12793 }, brillanteria: { piezas: 4, monto: 1416 } },
        factura: { id: 'FAC-164', fechaEmision: '2026-02-22', fechaVencimiento: '2026-03-24', condicion: 30, monto: 28900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-150', fecha: '2026-02-21', canal: 'Al Mayor', monto: 9200, pesoOroGramos: 25.3, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 14.7, monto: 3950 }, oro14k: { gramos: 10.6, monto: 2946 }, brillanteria: { piezas: 4, monto: 2304 } },
        factura: { id: 'FAC-150', fechaEmision: '2026-02-21', fechaVencimiento: '2026-03-23', condicion: 30, monto: 9200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-146', fecha: '2026-02-20', canal: 'Al Mayor', monto: 12300, pesoOroGramos: 41.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 15.7, monto: 4213 }, oro14k: { gramos: 25.5, monto: 7623 }, brillanteria: { piezas: 2, monto: 464 } },
        factura: { id: 'FAC-146', fechaEmision: '2026-02-20', fechaVencimiento: '2026-03-22', condicion: 30, monto: 12300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-130', fecha: '2026-02-19', canal: 'Al Mayor', monto: 11600, pesoOroGramos: 38.8, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 20.9, monto: 5716 }, oro14k: { gramos: 17.9, monto: 5054 }, brillanteria: { piezas: 2, monto: 830 } },
        factura: { id: 'FAC-130', fechaEmision: '2026-02-19', fechaVencimiento: '2026-03-21', condicion: 30, monto: 11600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-119', fecha: '2026-02-18', canal: 'Al Mayor', monto: 25100, pesoOroGramos: 92.3, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 45.5, monto: 11509 }, oro14k: { gramos: 46.8, monto: 12883 }, brillanteria: { piezas: 2, monto: 708 } },
        factura: { id: 'FAC-119', fechaEmision: '2026-02-18', fechaVencimiento: '2026-03-20', condicion: 30, monto: 25100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-109', fecha: '2026-02-17', canal: 'Al Mayor', monto: 10100, pesoOroGramos: 36.3, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 11.5, monto: 3037 }, oro14k: { gramos: 24.8, monto: 6575 }, brillanteria: { piezas: 2, monto: 488 } },
        factura: { id: 'FAC-109', fechaEmision: '2026-02-17', fechaVencimiento: '2026-03-19', condicion: 30, monto: 10100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-097', fecha: '2026-02-14', canal: 'Al Mayor', monto: 10500, pesoOroGramos: 37.7, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 13.9, monto: 3568 }, oro14k: { gramos: 23.8, monto: 6699 }, brillanteria: { piezas: 1, monto: 233 } },
        factura: { id: 'FAC-097', fechaEmision: '2026-02-14', fechaVencimiento: '2026-03-16', condicion: 30, monto: 10500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-089', fecha: '2026-02-13', canal: 'Al Mayor', monto: 14200, pesoOroGramos: 51.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 20.1, monto: 5298 }, oro14k: { gramos: 31.3, monto: 8227 }, brillanteria: { piezas: 3, monto: 675 } },
        factura: { id: 'FAC-089', fechaEmision: '2026-02-13', fechaVencimiento: '2026-03-15', condicion: 30, monto: 14200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-079', fecha: '2026-02-12', canal: 'Al Mayor', monto: 15000, pesoOroGramos: 55.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 23.5, monto: 6113 }, oro14k: { gramos: 31.9, monto: 8887 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-079', fechaEmision: '2026-02-12', fechaVencimiento: '2026-03-14', condicion: 30, monto: 15000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-059', fecha: '2026-02-10', canal: 'Al Mayor', monto: 16600, pesoOroGramos: 51.3, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 17.1, monto: 4749 }, oro14k: { gramos: 34.2, monto: 9460 }, brillanteria: { piezas: 3, monto: 2391 } },
        factura: { id: 'FAC-059', fechaEmision: '2026-02-10', fechaVencimiento: '2026-03-12', condicion: 30, monto: 16600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-047', fecha: '2026-02-07', canal: 'Al Mayor', monto: 22400, pesoOroGramos: 73, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 34.3, monto: 9423 }, oro14k: { gramos: 38.7, monto: 10733 }, brillanteria: { piezas: 4, monto: 2244 } },
        factura: { id: 'FAC-047', fechaEmision: '2026-02-07', fechaVencimiento: '2026-03-09', condicion: 30, monto: 22400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-039', fecha: '2026-02-06', canal: 'Al Mayor', monto: 26000, pesoOroGramos: 94.8, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 32.1, monto: 8594 }, oro14k: { gramos: 62.7, monto: 16990 }, brillanteria: { piezas: 1, monto: 416 } },
        factura: { id: 'FAC-039', fechaEmision: '2026-02-06', fechaVencimiento: '2026-03-08', condicion: 30, monto: 26000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-012', fecha: '2026-02-04', canal: 'Al Mayor', monto: 10300, pesoOroGramos: 35, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 19.5, monto: 5452 }, oro14k: { gramos: 15.5, monto: 4469 }, brillanteria: { piezas: 1, monto: 379 } },
        factura: { id: 'FAC-012', fechaEmision: '2026-02-04', fechaVencimiento: '2026-03-06', condicion: 30, monto: 10300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-003', fecha: '2026-02-03', canal: 'Al Mayor', monto: 22300, pesoOroGramos: 80.8, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 40.3, monto: 10849 }, oro14k: { gramos: 40.5, monto: 11091 }, brillanteria: { piezas: 1, monto: 360 } },
        factura: { id: 'FAC-003', fechaEmision: '2026-02-03', fechaVencimiento: '2026-03-05', condicion: 30, monto: 22300, montoPagado: 22300, fechaPago: '2026-02-20', estado: 'pagada', diasParaPago: 17 },
      },
      {
        id: 'CMP-226', fecha: '2026-01-28', canal: 'Al Mayor', monto: 14100, pesoOroGramos: 54.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 30.3, monto: 7745 }, oro14k: { gramos: 24.3, monto: 6355 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-226', fechaEmision: '2026-01-28', fechaVencimiento: '2026-02-27', condicion: 30, monto: 14100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-218', fecha: '2026-01-25', canal: 'Al Mayor', monto: 12100, pesoOroGramos: 44, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 25.5, monto: 7133 }, oro14k: { gramos: 18.5, monto: 4967 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-218', fechaEmision: '2026-01-25', fechaVencimiento: '2026-02-24', condicion: 30, monto: 12100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-212', fecha: '2026-01-20', canal: 'Al Mayor', monto: 16400, pesoOroGramos: 57, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 19.2, monto: 4900 }, oro14k: { gramos: 37.8, monto: 10722 }, brillanteria: { piezas: 2, monto: 778 } },
        factura: { id: 'FAC-212', fechaEmision: '2026-01-20', fechaVencimiento: '2026-02-19', condicion: 30, monto: 16400, montoPagado: 5011, fechaPago: '2026-02-17', estado: 'parcial', diasParaPago: null },
      },
      {
        id: 'CMP-198', fecha: '2026-01-10', canal: 'Al Mayor', monto: 16700, pesoOroGramos: 54.9, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 23.6, monto: 5985 }, oro14k: { gramos: 31.3, monto: 8519 }, brillanteria: { piezas: 3, monto: 2196 } },
        factura: { id: 'FAC-198', fechaEmision: '2026-01-10', fechaVencimiento: '2026-02-09', condicion: 30, monto: 16700, montoPagado: 16700, fechaPago: '2026-02-07', estado: 'pagada', diasParaPago: 28 },
      },
      {
        id: 'CMP-190', fecha: '2026-01-08', canal: 'Al Mayor', monto: 13000, pesoOroGramos: 47.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 27.6, monto: 7610 }, oro14k: { gramos: 20, monto: 5390 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-190', fechaEmision: '2026-01-08', fechaVencimiento: '2026-02-07', condicion: 30, monto: 13000, montoPagado: 13000, fechaPago: '2026-02-12', estado: 'pagada', diasParaPago: 35 },
      },
      {
        id: 'CMP-183', fecha: '2026-01-05', canal: 'Al Mayor', monto: 10500, pesoOroGramos: 34.7, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 19.2, monto: 5278 }, oro14k: { gramos: 15.5, monto: 4304 }, brillanteria: { piezas: 3, monto: 918 } },
        factura: { id: 'FAC-183', fechaEmision: '2026-01-05', fechaVencimiento: '2026-02-04', condicion: 30, monto: 10500, montoPagado: 10500, fechaPago: '2026-02-06', estado: 'pagada', diasParaPago: 32 },
      },
    ],
  },
  {
    id: 'CLI-015',
    nombre: 'Fernando Gutierrez',
    tipo: 'mayorista',
    terminos: 90,
    telefono: '+1 786-555-1515',
    email: 'fernando@gutierrezjoyeria.com',
    compras: [
      {
        id: 'CMP-176', fecha: '2026-02-23', canal: 'Al Mayor', monto: 10400, pesoOroGramos: 28.4, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 15.2, monto: 3940 }, oro14k: { gramos: 13.2, monto: 3756 }, brillanteria: { piezas: 4, monto: 2704 } },
        factura: { id: 'FAC-176', fechaEmision: '2026-02-23', fechaVencimiento: '2026-05-24', condicion: 90, monto: 10400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-166', fecha: '2026-02-22', canal: 'Al Mayor', monto: 5200, pesoOroGramos: 17.1, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 7.9, monto: 2096 }, oro14k: { gramos: 9.2, monto: 2508 }, brillanteria: { piezas: 2, monto: 596 } },
        factura: { id: 'FAC-166', fechaEmision: '2026-02-22', fechaVencimiento: '2026-05-23', condicion: 90, monto: 5200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-154', fecha: '2026-02-21', canal: 'Al Mayor', monto: 4700, pesoOroGramos: 16.4, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 6, monto: 1651 }, oro14k: { gramos: 10.4, monto: 3049 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-154', fechaEmision: '2026-02-21', fechaVencimiento: '2026-05-22', condicion: 90, monto: 4700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-144', fecha: '2026-02-20', canal: 'Al Mayor', monto: 15500, pesoOroGramos: 59.8, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 27.3, monto: 7062 }, oro14k: { gramos: 32.5, monto: 8438 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-144', fechaEmision: '2026-02-20', fechaVencimiento: '2026-05-21', condicion: 90, monto: 15500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-129', fecha: '2026-02-19', canal: 'Al Mayor', monto: 8100, pesoOroGramos: 28, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 13.9, monto: 3886 }, oro14k: { gramos: 14.1, monto: 4214 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-129', fechaEmision: '2026-02-19', fechaVencimiento: '2026-05-20', condicion: 90, monto: 8100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-107', fecha: '2026-02-17', canal: 'Al Mayor', monto: 7100, pesoOroGramos: 25.7, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 15.8, monto: 4069 }, oro14k: { gramos: 9.9, monto: 2713 }, brillanteria: { piezas: 1, monto: 318 } },
        factura: { id: 'FAC-107', fechaEmision: '2026-02-17', fechaVencimiento: '2026-05-18', condicion: 90, monto: 7100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-102', fecha: '2026-02-14', canal: 'Al Mayor', monto: 12500, pesoOroGramos: 38.5, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 16.1, monto: 4370 }, oro14k: { gramos: 22.4, monto: 6702 }, brillanteria: { piezas: 2, monto: 1428 } },
        factura: { id: 'FAC-102', fechaEmision: '2026-02-14', fechaVencimiento: '2026-05-15', condicion: 90, monto: 12500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-087', fecha: '2026-02-13', canal: 'Al Mayor', monto: 5000, pesoOroGramos: 13.7, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 8.1, monto: 2124 }, oro14k: { gramos: 5.6, monto: 1456 }, brillanteria: { piezas: 2, monto: 1420 } },
        factura: { id: 'FAC-087', fechaEmision: '2026-02-13', fechaVencimiento: '2026-05-14', condicion: 90, monto: 5000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-083', fecha: '2026-02-12', canal: 'Al Mayor', monto: 14400, pesoOroGramos: 45.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 25.6, monto: 7099 }, oro14k: { gramos: 19.6, monto: 5162 }, brillanteria: { piezas: 3, monto: 2139 } },
        factura: { id: 'FAC-083', fechaEmision: '2026-02-12', fechaVencimiento: '2026-05-13', condicion: 90, monto: 14400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-072', fecha: '2026-02-11', canal: 'Al Mayor', monto: 5800, pesoOroGramos: 16.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 8, monto: 2189 }, oro14k: { gramos: 8.7, monto: 2467 }, brillanteria: { piezas: 2, monto: 1144 } },
        factura: { id: 'FAC-072', fechaEmision: '2026-02-11', fechaVencimiento: '2026-05-12', condicion: 90, monto: 5800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-055', fecha: '2026-02-10', canal: 'Al Mayor', monto: 14800, pesoOroGramos: 50.7, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 23.7, monto: 6443 }, oro14k: { gramos: 27, monto: 7201 }, brillanteria: { piezas: 2, monto: 1156 } },
        factura: { id: 'FAC-055', fechaEmision: '2026-02-10', fechaVencimiento: '2026-05-11', condicion: 90, monto: 14800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-040', fecha: '2026-02-06', canal: 'Al Mayor', monto: 15700, pesoOroGramos: 58.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 34, monto: 8557 }, oro14k: { gramos: 24.8, monto: 6658 }, brillanteria: { piezas: 1, monto: 485 } },
        factura: { id: 'FAC-040', fechaEmision: '2026-02-06', fechaVencimiento: '2026-05-07', condicion: 90, monto: 15700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-024', fecha: '2026-02-05', canal: 'Al Mayor', monto: 9000, pesoOroGramos: 27.6, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 8.8, monto: 2295 }, oro14k: { gramos: 18.8, monto: 5125 }, brillanteria: { piezas: 2, monto: 1580 } },
        factura: { id: 'FAC-024', fechaEmision: '2026-02-05', fechaVencimiento: '2026-05-06', condicion: 90, monto: 9000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-014', fecha: '2026-02-04', canal: 'Al Mayor', monto: 8100, pesoOroGramos: 25.2, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 15.5, monto: 4037 }, oro14k: { gramos: 9.7, monto: 2725 }, brillanteria: { piezas: 3, monto: 1338 } },
        factura: { id: 'FAC-014', fechaEmision: '2026-02-04', fechaVencimiento: '2026-05-05', condicion: 90, monto: 8100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-006', fecha: '2026-02-03', canal: 'Al Mayor', monto: 8400, pesoOroGramos: 28, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 9.7, monto: 2668 }, oro14k: { gramos: 18.3, monto: 4811 }, brillanteria: { piezas: 3, monto: 921 } },
        factura: { id: 'FAC-006', fechaEmision: '2026-02-03', fechaVencimiento: '2026-05-04', condicion: 90, monto: 8400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-203', fecha: '2026-01-15', canal: 'Al Mayor', monto: 10400, pesoOroGramos: 39.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 19, monto: 4821 }, oro14k: { gramos: 20.7, monto: 5579 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-203', fechaEmision: '2026-01-15', fechaVencimiento: '2026-04-15', condicion: 90, monto: 10400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-189', fecha: '2026-01-08', canal: 'Al Mayor', monto: 5000, pesoOroGramos: 18.3, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 8.7, monto: 2213 }, oro14k: { gramos: 9.6, monto: 2787 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-189', fechaEmision: '2026-01-08', fechaVencimiento: '2026-04-08', condicion: 90, monto: 5000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
    ],
  },
  {
    id: 'CLI-016',
    nombre: 'Daniela Rojas',
    tipo: 'mayorista',
    terminos: 30,
    telefono: '+1 305-555-1616',
    email: 'daniela@rojasgold.com',
    compras: [
      {
        id: 'CMP-172', fecha: '2026-02-23', canal: 'Al Mayor', monto: 9200, pesoOroGramos: 21.7, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 8.1, monto: 2195 }, oro14k: { gramos: 13.6, monto: 4017 }, brillanteria: { piezas: 4, monto: 2988 } },
        factura: { id: 'FAC-172', fechaEmision: '2026-02-23', fechaVencimiento: '2026-03-25', condicion: 30, monto: 9200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-152', fecha: '2026-02-21', canal: 'Al Mayor', monto: 12900, pesoOroGramos: 42.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 17.3, monto: 4528 }, oro14k: { gramos: 25.5, monto: 7637 }, brillanteria: { piezas: 1, monto: 735 } },
        factura: { id: 'FAC-152', fechaEmision: '2026-02-21', fechaVencimiento: '2026-03-23', condicion: 30, monto: 12900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-133', fecha: '2026-02-19', canal: 'Al Mayor', monto: 10900, pesoOroGramos: 36.1, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 11.9, monto: 3012 }, oro14k: { gramos: 24.2, monto: 6524 }, brillanteria: { piezas: 2, monto: 1364 } },
        factura: { id: 'FAC-133', fechaEmision: '2026-02-19', fechaVencimiento: '2026-03-21', condicion: 30, monto: 10900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-121', fecha: '2026-02-18', canal: 'Al Mayor', monto: 5700, pesoOroGramos: 19, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 10.9, monto: 2994 }, oro14k: { gramos: 8.1, monto: 2166 }, brillanteria: { piezas: 1, monto: 540 } },
        factura: { id: 'FAC-121', fechaEmision: '2026-02-18', fechaVencimiento: '2026-03-20', condicion: 30, monto: 5700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-108', fecha: '2026-02-17', canal: 'Al Mayor', monto: 8300, pesoOroGramos: 28.8, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 15.6, monto: 4208 }, oro14k: { gramos: 13.2, monto: 3869 }, brillanteria: { piezas: 1, monto: 223 } },
        factura: { id: 'FAC-108', fechaEmision: '2026-02-17', fechaVencimiento: '2026-03-19', condicion: 30, monto: 8300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-100', fecha: '2026-02-14', canal: 'Al Mayor', monto: 14000, pesoOroGramos: 51.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 30.7, monto: 7764 }, oro14k: { gramos: 21.1, monto: 5792 }, brillanteria: { piezas: 1, monto: 444 } },
        factura: { id: 'FAC-100', fechaEmision: '2026-02-14', fechaVencimiento: '2026-03-16', condicion: 30, monto: 14000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-086', fecha: '2026-02-13', canal: 'Al Mayor', monto: 12400, pesoOroGramos: 43.1, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 22.2, monto: 5637 }, oro14k: { gramos: 20.9, monto: 6132 }, brillanteria: { piezas: 1, monto: 631 } },
        factura: { id: 'FAC-086', fechaEmision: '2026-02-13', fechaVencimiento: '2026-03-15', condicion: 30, monto: 12400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-080', fecha: '2026-02-12', canal: 'Al Mayor', monto: 15100, pesoOroGramos: 51, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 26.9, monto: 7472 }, oro14k: { gramos: 24.1, monto: 6324 }, brillanteria: { piezas: 4, monto: 1304 } },
        factura: { id: 'FAC-080', fechaEmision: '2026-02-12', fechaVencimiento: '2026-03-14', condicion: 30, monto: 15100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-071', fecha: '2026-02-11', canal: 'Al Mayor', monto: 9500, pesoOroGramos: 33, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 17.9, monto: 4523 }, oro14k: { gramos: 15.1, monto: 4211 }, brillanteria: { piezas: 2, monto: 766 } },
        factura: { id: 'FAC-071', fechaEmision: '2026-02-11', fechaVencimiento: '2026-03-13', condicion: 30, monto: 9500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-062', fecha: '2026-02-10', canal: 'Al Mayor', monto: 10000, pesoOroGramos: 29.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 12.4, monto: 3367 }, oro14k: { gramos: 17, monto: 4709 }, brillanteria: { piezas: 4, monto: 1924 } },
        factura: { id: 'FAC-062', fechaEmision: '2026-02-10', fechaVencimiento: '2026-03-12', condicion: 30, monto: 10000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-033', fecha: '2026-02-06', canal: 'Al Mayor', monto: 11500, pesoOroGramos: 41.9, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 19.5, monto: 5004 }, oro14k: { gramos: 22.4, monto: 6496 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-033', fechaEmision: '2026-02-06', fechaVencimiento: '2026-03-08', condicion: 30, monto: 11500, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-027', fecha: '2026-02-05', canal: 'Al Mayor', monto: 9700, pesoOroGramos: 31, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 14.9, monto: 4084 }, oro14k: { gramos: 16.1, monto: 4581 }, brillanteria: { piezas: 3, monto: 1035 } },
        factura: { id: 'FAC-027', fechaEmision: '2026-02-05', fechaVencimiento: '2026-03-07', condicion: 30, monto: 9700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-015', fecha: '2026-02-04', canal: 'Al Mayor', monto: 6800, pesoOroGramos: 13.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 5.2, monto: 1332 }, oro14k: { gramos: 8.4, monto: 2352 }, brillanteria: { piezas: 4, monto: 3116 } },
        factura: { id: 'FAC-015', fechaEmision: '2026-02-04', fechaVencimiento: '2026-03-06', condicion: 30, monto: 6800, montoPagado: 6800, fechaPago: '2026-02-22', estado: 'pagada', diasParaPago: 18 },
      },
      {
        id: 'CMP-001', fecha: '2026-02-03', canal: 'Al Mayor', monto: 12000, pesoOroGramos: 41.8, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 14.8, monto: 3905 }, oro14k: { gramos: 27, monto: 7539 }, brillanteria: { piezas: 2, monto: 556 } },
        factura: { id: 'FAC-001', fechaEmision: '2026-02-03', fechaVencimiento: '2026-03-05', condicion: 30, monto: 12000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
    ],
  },
  {
    id: 'CLI-017',
    nombre: 'Oscar Navarro',
    tipo: 'mayorista',
    terminos: 60,
    telefono: '+1 954-555-1717',
    email: 'oscar@navarrojewels.com',
    compras: [
      {
        id: 'CMP-174', fecha: '2026-02-23', canal: 'Al Mayor', monto: 12600, pesoOroGramos: 41.5, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 15.1, monto: 3807 }, oro14k: { gramos: 26.4, monto: 7273 }, brillanteria: { piezas: 4, monto: 1520 } },
        factura: { id: 'FAC-174', fechaEmision: '2026-02-23', fechaVencimiento: '2026-04-24', condicion: 60, monto: 12600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-167', fecha: '2026-02-22', canal: 'Al Mayor', monto: 13400, pesoOroGramos: 43.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 22, monto: 6012 }, oro14k: { gramos: 21.9, monto: 5940 }, brillanteria: { piezas: 4, monto: 1448 } },
        factura: { id: 'FAC-167', fechaEmision: '2026-02-22', fechaVencimiento: '2026-04-23', condicion: 60, monto: 13400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-156', fecha: '2026-02-21', canal: 'Al Mayor', monto: 11100, pesoOroGramos: 40.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 19.5, monto: 5063 }, oro14k: { gramos: 21.1, monto: 6037 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-156', fechaEmision: '2026-02-21', fechaVencimiento: '2026-04-22', condicion: 60, monto: 11100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-123', fecha: '2026-02-18', canal: 'Al Mayor', monto: 15200, pesoOroGramos: 54.8, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 19.6, monto: 4934 }, oro14k: { gramos: 35.2, monto: 9790 }, brillanteria: { piezas: 2, monto: 476 } },
        factura: { id: 'FAC-123', fechaEmision: '2026-02-18', fechaVencimiento: '2026-04-19', condicion: 60, monto: 15200, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-113', fecha: '2026-02-17', canal: 'Al Mayor', monto: 5300, pesoOroGramos: 15.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 7.9, monto: 2160 }, oro14k: { gramos: 7.7, monto: 2132 }, brillanteria: { piezas: 3, monto: 1008 } },
        factura: { id: 'FAC-113', fechaEmision: '2026-02-17', fechaVencimiento: '2026-04-18', condicion: 60, monto: 5300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-093', fecha: '2026-02-13', canal: 'Al Mayor', monto: 12100, pesoOroGramos: 42.3, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 15.9, monto: 4430 }, oro14k: { gramos: 26.4, monto: 7670 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-093', fechaEmision: '2026-02-13', fechaVencimiento: '2026-04-14', condicion: 60, monto: 12100, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-082', fecha: '2026-02-12', canal: 'Al Mayor', monto: 8600, pesoOroGramos: 31, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 16.1, monto: 4352 }, oro14k: { gramos: 14.9, monto: 4248 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-082', fechaEmision: '2026-02-12', fechaVencimiento: '2026-04-13', condicion: 60, monto: 8600, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-067', fecha: '2026-02-11', canal: 'Al Mayor', monto: 5400, pesoOroGramos: 19.5, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 11.8, monto: 2974 }, oro14k: { gramos: 7.7, monto: 2022 }, brillanteria: { piezas: 1, monto: 404 } },
        factura: { id: 'FAC-067', fechaEmision: '2026-02-11', fechaVencimiento: '2026-04-12', condicion: 60, monto: 5400, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-057', fecha: '2026-02-10', canal: 'Al Mayor', monto: 10800, pesoOroGramos: 33.5, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 11.2, monto: 3037 }, oro14k: { gramos: 22.3, monto: 6203 }, brillanteria: { piezas: 3, monto: 1560 } },
        factura: { id: 'FAC-057', fechaEmision: '2026-02-10', fechaVencimiento: '2026-04-11', condicion: 60, monto: 10800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-044', fecha: '2026-02-07', canal: 'Al Mayor', monto: 14700, pesoOroGramos: 54.7, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 19.2, monto: 4937 }, oro14k: { gramos: 35.5, monto: 9763 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-044', fechaEmision: '2026-02-07', fechaVencimiento: '2026-04-08', condicion: 60, monto: 14700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-026', fecha: '2026-02-05', canal: 'Al Mayor', monto: 12800, pesoOroGramos: 48.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 28.8, monto: 7463 }, oro14k: { gramos: 19.8, monto: 5337 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-026', fechaEmision: '2026-02-05', fechaVencimiento: '2026-04-06', condicion: 60, monto: 12800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-223', fecha: '2026-01-28', canal: 'Al Mayor', monto: 12300, pesoOroGramos: 45.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 16.6, monto: 4558 }, oro14k: { gramos: 28.9, monto: 7742 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-223', fechaEmision: '2026-01-28', fechaVencimiento: '2026-03-29', condicion: 60, monto: 12300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-220', fecha: '2026-01-25', canal: 'Al Mayor', monto: 15300, pesoOroGramos: 51.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 22.2, monto: 5900 }, oro14k: { gramos: 29.6, monto: 7990 }, brillanteria: { piezas: 2, monto: 1410 } },
        factura: { id: 'FAC-220', fechaEmision: '2026-01-25', fechaVencimiento: '2026-03-26', condicion: 60, monto: 15300, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-208', fecha: '2026-01-20', canal: 'Al Mayor', monto: 14900, pesoOroGramos: 49.6, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 20, monto: 5165 }, oro14k: { gramos: 29.6, monto: 7855 }, brillanteria: { piezas: 4, monto: 1880 } },
        factura: { id: 'FAC-208', fechaEmision: '2026-01-20', fechaVencimiento: '2026-03-21', condicion: 60, monto: 14900, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-199', fecha: '2026-01-10', canal: 'Al Mayor', monto: 12700, pesoOroGramos: 42.2, vendedor: 'Valentina Mora',
        desglose: { oro10k: { gramos: 15, monto: 3860 }, oro14k: { gramos: 27.2, monto: 8077 }, brillanteria: { piezas: 1, monto: 763 } },
        factura: { id: 'FAC-199', fechaEmision: '2026-01-10', fechaVencimiento: '2026-03-11', condicion: 60, monto: 12700, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
      {
        id: 'CMP-184', fecha: '2026-01-05', canal: 'Al Mayor', monto: 4000, pesoOroGramos: 10.7, vendedor: 'Diego Paredes',
        desglose: { oro10k: { gramos: 3.9, monto: 1023 }, oro14k: { gramos: 6.8, monto: 1936 }, brillanteria: { piezas: 3, monto: 1041 } },
        factura: { id: 'FAC-184', fechaEmision: '2026-01-05', fechaVencimiento: '2026-03-06', condicion: 60, monto: 4000, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
    ],
  },
  {
    id: 'CLI-003',
    nombre: 'Ana Martinez',
    tipo: 'detal',
    terminos: 0,
    telefono: '+1 305-555-0303',
    email: 'ana.mtz@gmail.com',
    compras: [
      {
        id: 'CMP-168', fecha: '2026-02-22', canal: 'Al Detal', monto: 1590, pesoOroGramos: 2.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 0.9, monto: 216 }, oro14k: { gramos: 1.8, monto: 468 }, brillanteria: { piezas: 2, monto: 906 } },
        factura: { id: 'FAC-168', fechaEmision: '2026-02-22', fechaVencimiento: '2026-02-22', condicion: 0, monto: 1590, montoPagado: 1590, fechaPago: '2026-02-22', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-136', fecha: '2026-02-19', canal: 'Al Detal', monto: 2880, pesoOroGramos: 7.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 3.2, monto: 830 }, oro14k: { gramos: 4.5, monto: 1310 }, brillanteria: { piezas: 2, monto: 740 } },
        factura: { id: 'FAC-136', fechaEmision: '2026-02-19', fechaVencimiento: '2026-02-19', condicion: 0, monto: 2880, montoPagado: 2880, fechaPago: '2026-02-19', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-104', fecha: '2026-02-14', canal: 'Al Detal', monto: 2420, pesoOroGramos: 7.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.2, monto: 1048 }, oro14k: { gramos: 3.7, monto: 960 }, brillanteria: { piezas: 1, monto: 412 } },
        factura: { id: 'FAC-104', fechaEmision: '2026-02-14', fechaVencimiento: '2026-02-14', condicion: 0, monto: 2420, montoPagado: 2420, fechaPago: '2026-02-14', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-073', fecha: '2026-02-11', canal: 'Al Detal', monto: 1540, pesoOroGramos: 3.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.2, monto: 598 }, oro14k: { gramos: 1.6, monto: 448 }, brillanteria: { piezas: 2, monto: 494 } },
        factura: { id: 'FAC-073', fechaEmision: '2026-02-11', fechaVencimiento: '2026-02-11', condicion: 0, monto: 1540, montoPagado: 1540, fechaPago: '2026-02-11', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-041', fecha: '2026-02-06', canal: 'Al Detal', monto: 3570, pesoOroGramos: 13.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 8.3, monto: 2126 }, oro14k: { gramos: 5.3, monto: 1444 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-041', fechaEmision: '2026-02-06', fechaVencimiento: '2026-02-06', condicion: 0, monto: 3570, montoPagado: 3570, fechaPago: '2026-02-06', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-009', fecha: '2026-02-03', canal: 'Al Detal', monto: 2190, pesoOroGramos: 7.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.7, monto: 745 }, oro14k: { gramos: 5.1, monto: 1445 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-009', fechaEmision: '2026-02-03', fechaVencimiento: '2026-02-03', condicion: 0, monto: 2190, montoPagado: 2190, fechaPago: '2026-02-03', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-213', fecha: '2026-01-20', canal: 'Al Detal', monto: 930, pesoOroGramos: 3.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 1.9, monto: 528 }, oro14k: { gramos: 1.5, monto: 402 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-213', fechaEmision: '2026-01-20', fechaVencimiento: '2026-01-20', condicion: 0, monto: 930, montoPagado: 930, fechaPago: '2026-01-20', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-250', fecha: '2025-12-22', canal: 'Al Detal', monto: 1360, pesoOroGramos: 4.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.4, monto: 671 }, oro14k: { gramos: 1.8, monto: 515 }, brillanteria: { piezas: 1, monto: 174 } },
        factura: { id: 'FAC-250', fechaEmision: '2025-12-22', fechaVencimiento: '2025-12-22', condicion: 0, monto: 1360, montoPagado: 1360, fechaPago: '2025-12-22', estado: 'pagada', diasParaPago: 0 },
      },
    ],
  },
  {
    id: 'CLI-007',
    nombre: 'Isabel Torres',
    tipo: 'detal',
    terminos: 0,
    telefono: '+1 786-555-0707',
    email: 'isa.torres@hotmail.com',
    compras: [
      {
        id: 'CMP-178', fecha: '2026-02-23', canal: 'Al Detal', monto: 2190, pesoOroGramos: 8.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.1, monto: 1023 }, oro14k: { gramos: 4.1, monto: 1167 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-178', fechaEmision: '2026-02-23', fechaVencimiento: '2026-02-23', condicion: 0, monto: 2190, montoPagado: 2190, fechaPago: '2026-02-23', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-147', fecha: '2026-02-20', canal: 'Al Detal', monto: 1350, pesoOroGramos: 2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 0.9, monto: 218 }, oro14k: { gramos: 1.1, monto: 306 }, brillanteria: { piezas: 2, monto: 826 } },
        factura: { id: 'FAC-147', fechaEmision: '2026-02-20', fechaVencimiento: '2026-02-20', condicion: 0, monto: 1350, montoPagado: 1350, fechaPago: '2026-02-20', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-114', fecha: '2026-02-17', canal: 'Al Detal', monto: 3450, pesoOroGramos: 11.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 7.3, monto: 1826 }, oro14k: { gramos: 4.4, monto: 1313 }, brillanteria: { piezas: 1, monto: 311 } },
        factura: { id: 'FAC-114', fechaEmision: '2026-02-17', fechaVencimiento: '2026-02-17', condicion: 0, monto: 3450, montoPagado: 3450, fechaPago: '2026-02-17', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-084', fecha: '2026-02-12', canal: 'Al Detal', monto: 1300, pesoOroGramos: 4.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 1.5, monto: 391 }, oro14k: { gramos: 3, monto: 909 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-084', fechaEmision: '2026-02-12', fechaVencimiento: '2026-02-12', condicion: 0, monto: 1300, montoPagado: 1300, fechaPago: '2026-02-12', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-052', fecha: '2026-02-07', canal: 'Al Detal', monto: 2150, pesoOroGramos: 4.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.5, monto: 640 }, oro14k: { gramos: 1.9, monto: 546 }, brillanteria: { piezas: 2, monto: 964 } },
        factura: { id: 'FAC-052', fechaEmision: '2026-02-07', fechaVencimiento: '2026-02-07', condicion: 0, monto: 2150, montoPagado: 2150, fechaPago: '2026-02-07', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-020', fecha: '2026-02-04', canal: 'Al Detal', monto: 1050, pesoOroGramos: 2.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 1.5, monto: 392 }, oro14k: { gramos: 1.4, monto: 420 }, brillanteria: { piezas: 1, monto: 238 } },
        factura: { id: 'FAC-020', fechaEmision: '2026-02-04', fechaVencimiento: '2026-02-04', condicion: 0, monto: 1050, montoPagado: 1050, fechaPago: '2026-02-04', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-221', fecha: '2026-01-25', canal: 'Al Detal', monto: 3010, pesoOroGramos: 11.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 5.8, monto: 1460 }, oro14k: { gramos: 5.7, monto: 1550 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-221', fechaEmision: '2026-01-25', fechaVencimiento: '2026-01-25', condicion: 0, monto: 3010, montoPagado: 3010, fechaPago: '2026-01-25', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-206', fecha: '2026-01-15', canal: 'Al Detal', monto: 2750, pesoOroGramos: 6.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.3, monto: 574 }, oro14k: { gramos: 4.6, monto: 1312 }, brillanteria: { piezas: 2, monto: 864 } },
        factura: { id: 'FAC-206', fechaEmision: '2026-01-15', fechaVencimiento: '2026-01-15', condicion: 0, monto: 2750, montoPagado: 2750, fechaPago: '2026-01-15', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-244', fecha: '2025-12-18', canal: 'Al Detal', monto: 2520, pesoOroGramos: 7.1, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 3.8, monto: 1020 }, oro14k: { gramos: 3.3, monto: 928 }, brillanteria: { piezas: 2, monto: 572 } },
        factura: { id: 'FAC-244', fechaEmision: '2025-12-18', fechaVencimiento: '2025-12-18', condicion: 0, monto: 2520, montoPagado: 2520, fechaPago: '2025-12-18', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-239', fecha: '2025-12-10', canal: 'Al Detal', monto: 1940, pesoOroGramos: 7.3, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.3, monto: 1132 }, oro14k: { gramos: 3, monto: 808 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-239', fechaEmision: '2025-12-10', fechaVencimiento: '2025-12-10', condicion: 0, monto: 1940, montoPagado: 1940, fechaPago: '2025-12-10', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-233', fecha: '2025-12-05', canal: 'Al Detal', monto: 1010, pesoOroGramos: 3.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 1.1, monto: 297 }, oro14k: { gramos: 2.1, monto: 585 }, brillanteria: { piezas: 1, monto: 128 } },
        factura: { id: 'FAC-233', fechaEmision: '2025-12-05', fechaVencimiento: '2025-12-05', condicion: 0, monto: 1010, montoPagado: 1010, fechaPago: '2025-12-05', estado: 'pagada', diasParaPago: 0 },
      },
    ],
  },
  {
    id: 'CLI-010',
    nombre: 'Andres Castillo',
    tipo: 'detal',
    terminos: 0,
    telefono: '+1 305-555-1010',
    email: 'andres.c@icloud.com',
    compras: [
      {
        id: 'CMP-157', fecha: '2026-02-21', canal: 'Al Detal', monto: 1410, pesoOroGramos: 5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.8, monto: 749 }, oro14k: { gramos: 2.2, monto: 661 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-157', fechaEmision: '2026-02-21', fechaVencimiento: '2026-02-21', condicion: 0, monto: 1410, montoPagado: 1410, fechaPago: '2026-02-21', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-125', fecha: '2026-02-18', canal: 'Al Detal', monto: 2670, pesoOroGramos: 10.1, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.9, monto: 1260 }, oro14k: { gramos: 5.2, monto: 1410 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-125', fechaEmision: '2026-02-18', fechaVencimiento: '2026-02-18', condicion: 0, monto: 2670, montoPagado: 2670, fechaPago: '2026-02-18', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-094', fecha: '2026-02-13', canal: 'Al Detal', monto: 1430, pesoOroGramos: 4.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.6, monto: 702 }, oro14k: { gramos: 2.2, monto: 622 }, brillanteria: { piezas: 1, monto: 106 } },
        factura: { id: 'FAC-094', fechaEmision: '2026-02-13', fechaVencimiento: '2026-02-13', condicion: 0, monto: 1430, montoPagado: 1430, fechaPago: '2026-02-13', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-063', fecha: '2026-02-10', canal: 'Al Detal', monto: 820, pesoOroGramos: 2.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 0.9, monto: 231 }, oro14k: { gramos: 1.3, monto: 343 }, brillanteria: { piezas: 2, monto: 246 } },
        factura: { id: 'FAC-063', fechaEmision: '2026-02-10', fechaVencimiento: '2026-02-10', condicion: 0, monto: 820, montoPagado: 820, fechaPago: '2026-02-10', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-030', fecha: '2026-02-05', canal: 'Al Detal', monto: 1990, pesoOroGramos: 7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 3.8, monto: 1036 }, oro14k: { gramos: 3.2, monto: 954 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-030', fechaEmision: '2026-02-05', fechaVencimiento: '2026-02-05', condicion: 0, monto: 1990, montoPagado: 1990, fechaPago: '2026-02-05', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-228', fecha: '2026-01-28', canal: 'Al Detal', monto: 3340, pesoOroGramos: 12, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 6, monto: 1517 }, oro14k: { gramos: 6, monto: 1633 }, brillanteria: { piezas: 1, monto: 190 } },
        factura: { id: 'FAC-228', fechaEmision: '2026-01-28', fechaVencimiento: '2026-01-28', condicion: 0, monto: 3340, montoPagado: 3340, fechaPago: '2026-01-28', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-200', fecha: '2026-01-10', canal: 'Al Detal', monto: 2350, pesoOroGramos: 7.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.9, monto: 799 }, oro14k: { gramos: 4.5, monto: 1199 }, brillanteria: { piezas: 2, monto: 352 } },
        factura: { id: 'FAC-200', fechaEmision: '2026-01-10', fechaVencimiento: '2026-01-10', condicion: 0, monto: 2350, montoPagado: 2350, fechaPago: '2026-01-10', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-193', fecha: '2026-01-08', canal: 'Al Detal', monto: 2470, pesoOroGramos: 8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.1, monto: 1030 }, oro14k: { gramos: 3.9, monto: 1008 }, brillanteria: { piezas: 2, monto: 432 } },
        factura: { id: 'FAC-193', fechaEmision: '2026-01-08', fechaVencimiento: '2026-01-08', condicion: 0, monto: 2470, montoPagado: 2470, fechaPago: '2026-01-08', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-187', fecha: '2026-01-05', canal: 'Al Detal', monto: 3950, pesoOroGramos: 14.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 6.6, monto: 1701 }, oro14k: { gramos: 7.9, monto: 2249 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-187', fechaEmision: '2026-01-05', fechaVencimiento: '2026-01-05', condicion: 0, monto: 3950, montoPagado: 3950, fechaPago: '2026-01-05', estado: 'pagada', diasParaPago: 0 },
      },
    ],
  },
  {
    id: 'CLI-004',
    nombre: 'Carlos Rodriguez',
    tipo: 'shopify',
    terminos: 0,
    telefono: '+1 954-555-0404',
    email: 'carlos.r@outlook.com',
    compras: [
      {
        id: 'CMP-180', fecha: '2026-02-23', canal: 'Shopify', monto: 4290, pesoOroGramos: 16, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 7.8, monto: 1944 }, oro14k: { gramos: 8.2, monto: 2346 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-180', fechaEmision: '2026-02-23', fechaVencimiento: '2026-02-23', condicion: 0, monto: 4290, montoPagado: 4290, fechaPago: '2026-02-23', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-158', fecha: '2026-02-21', canal: 'Shopify', monto: 3630, pesoOroGramos: 10.1, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 5.7, monto: 1516 }, oro14k: { gramos: 4.4, monto: 1160 }, brillanteria: { piezas: 2, monto: 954 } },
        factura: { id: 'FAC-158', fechaEmision: '2026-02-21', fechaVencimiento: '2026-02-21', condicion: 0, monto: 3630, montoPagado: 3630, fechaPago: '2026-02-21', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-138', fecha: '2026-02-19', canal: 'Shopify', monto: 1230, pesoOroGramos: 1.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 0.7, monto: 190 }, oro14k: { gramos: 1.1, monto: 296 }, brillanteria: { piezas: 2, monto: 744 } },
        factura: { id: 'FAC-138', fechaEmision: '2026-02-19', fechaVencimiento: '2026-02-19', condicion: 0, monto: 1230, montoPagado: 1230, fechaPago: '2026-02-19', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-116', fecha: '2026-02-17', canal: 'Shopify', monto: 4040, pesoOroGramos: 14.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 7.6, monto: 2078 }, oro14k: { gramos: 6.8, monto: 1962 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-116', fechaEmision: '2026-02-17', fechaVencimiento: '2026-02-17', condicion: 0, monto: 4040, montoPagado: 4040, fechaPago: '2026-02-17', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-064', fecha: '2026-02-10', canal: 'Shopify', monto: 3570, pesoOroGramos: 12, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.4, monto: 1234 }, oro14k: { gramos: 7.6, monto: 2162 }, brillanteria: { piezas: 1, monto: 174 } },
        factura: { id: 'FAC-064', fechaEmision: '2026-02-10', fechaVencimiento: '2026-02-10', condicion: 0, monto: 3570, montoPagado: 3570, fechaPago: '2026-02-10', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-042', fecha: '2026-02-06', canal: 'Shopify', monto: 2080, pesoOroGramos: 7.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 3.4, monto: 916 }, oro14k: { gramos: 4.2, monto: 1164 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-042', fechaEmision: '2026-02-06', fechaVencimiento: '2026-02-06', condicion: 0, monto: 2080, montoPagado: 2080, fechaPago: '2026-02-06', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-021', fecha: '2026-02-04', canal: 'Shopify', monto: 1680, pesoOroGramos: 4.1, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2, monto: 543 }, oro14k: { gramos: 2.1, monto: 633 }, brillanteria: { piezas: 2, monto: 504 } },
        factura: { id: 'FAC-021', fechaEmision: '2026-02-04', fechaVencimiento: '2026-02-04', condicion: 0, monto: 1680, montoPagado: 1680, fechaPago: '2026-02-04', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-222', fecha: '2026-01-25', canal: 'Shopify', monto: 1300, pesoOroGramos: 3.3, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 1.7, monto: 460 }, oro14k: { gramos: 1.6, monto: 450 }, brillanteria: { piezas: 3, monto: 390 } },
        factura: { id: 'FAC-222', fechaEmision: '2026-01-25', fechaVencimiento: '2026-01-25', condicion: 0, monto: 1300, montoPagado: 1300, fechaPago: '2026-01-25', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-214', fecha: '2026-01-20', canal: 'Shopify', monto: 5330, pesoOroGramos: 13.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 5.9, monto: 1503 }, oro14k: { gramos: 7.9, monto: 2228 }, brillanteria: { piezas: 5, monto: 1599 } },
        factura: { id: 'FAC-214', fechaEmision: '2026-01-20', fechaVencimiento: '2026-01-20', condicion: 0, monto: 5330, montoPagado: 5330, fechaPago: '2026-01-20', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-207', fecha: '2026-01-15', canal: 'Shopify', monto: 2230, pesoOroGramos: 8.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 3.7, monto: 1017 }, oro14k: { gramos: 4.5, monto: 1213 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-207', fechaEmision: '2026-01-15', fechaVencimiento: '2026-01-15', condicion: 0, monto: 2230, montoPagado: 2230, fechaPago: '2026-01-15', estado: 'pagada', diasParaPago: 0 },
      },
    ],
  },
  {
    id: 'CLI-006',
    nombre: 'Laura Sanchez',
    tipo: 'shopify',
    terminos: 0,
    telefono: '+1 305-555-0606',
    email: 'laura.s@gmail.com',
    compras: [
      {
        id: 'CMP-159', fecha: '2026-02-21', canal: 'Shopify', monto: 4200, pesoOroGramos: 14.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 5.7, monto: 1451 }, oro14k: { gramos: 9.2, monto: 2426 }, brillanteria: { piezas: 1, monto: 323 } },
        factura: { id: 'FAC-159', fechaEmision: '2026-02-21', fechaVencimiento: '2026-02-21', condicion: 0, monto: 4200, montoPagado: 4200, fechaPago: '2026-02-21', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-137', fecha: '2026-02-19', canal: 'Shopify', monto: 4460, pesoOroGramos: 13.1, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.3, monto: 1144 }, oro14k: { gramos: 8.8, monto: 2538 }, brillanteria: { piezas: 2, monto: 778 } },
        factura: { id: 'FAC-137', fechaEmision: '2026-02-19', fechaVencimiento: '2026-02-19', condicion: 0, monto: 4460, montoPagado: 4460, fechaPago: '2026-02-19', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-127', fecha: '2026-02-18', canal: 'Shopify', monto: 5300, pesoOroGramos: 15.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 6.8, monto: 1865 }, oro14k: { gramos: 8.9, monto: 2469 }, brillanteria: { piezas: 2, monto: 966 } },
        factura: { id: 'FAC-127', fechaEmision: '2026-02-18', fechaVencimiento: '2026-02-18', condicion: 0, monto: 5300, montoPagado: 5300, fechaPago: '2026-02-18', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-115', fecha: '2026-02-17', canal: 'Shopify', monto: 5340, pesoOroGramos: 19.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 7.1, monto: 1855 }, oro14k: { gramos: 12.5, monto: 3240 }, brillanteria: { piezas: 1, monto: 245 } },
        factura: { id: 'FAC-115', fechaEmision: '2026-02-17', fechaVencimiento: '2026-02-17', condicion: 0, monto: 5340, montoPagado: 5340, fechaPago: '2026-02-17', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-229', fecha: '2026-01-28', canal: 'Shopify', monto: 5950, pesoOroGramos: 22.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 11.9, monto: 3018 }, oro14k: { gramos: 10.3, monto: 2932 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-229', fechaEmision: '2026-01-28', fechaVencimiento: '2026-01-28', condicion: 0, monto: 5950, montoPagado: 5950, fechaPago: '2026-01-28', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-201', fecha: '2026-01-10', canal: 'Shopify', monto: 3960, pesoOroGramos: 10.5, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 3.5, monto: 937 }, oro14k: { gramos: 7, monto: 1875 }, brillanteria: { piezas: 2, monto: 1148 } },
        factura: { id: 'FAC-201', fechaEmision: '2026-01-10', fechaVencimiento: '2026-01-10', condicion: 0, monto: 3960, montoPagado: 3960, fechaPago: '2026-01-10', estado: 'pagada', diasParaPago: 0 },
      },
    ],
  },
  {
    id: 'CLI-009',
    nombre: 'Miguel Lopez',
    tipo: 'shopify',
    terminos: 0,
    telefono: '+1 954-555-0909',
    email: 'miguelop@gmail.com',
    compras: [
      {
        id: 'CMP-179', fecha: '2026-02-23', canal: 'Shopify', monto: 4260, pesoOroGramos: 11.3, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 6.4, monto: 1635 }, oro14k: { gramos: 4.9, monto: 1347 }, brillanteria: { piezas: 2, monto: 1278 } },
        factura: { id: 'FAC-179', fechaEmision: '2026-02-23', fechaVencimiento: '2026-02-23', condicion: 0, monto: 4260, montoPagado: 4260, fechaPago: '2026-02-23', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-148', fecha: '2026-02-20', canal: 'Shopify', monto: 4870, pesoOroGramos: 11.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 7.1, monto: 1970 }, oro14k: { gramos: 4.8, monto: 1439 }, brillanteria: { piezas: 2, monto: 1461 } },
        factura: { id: 'FAC-148', fechaEmision: '2026-02-20', fechaVencimiento: '2026-02-20', condicion: 0, monto: 4870, montoPagado: 4870, fechaPago: '2026-02-20', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-126', fecha: '2026-02-18', canal: 'Shopify', monto: 3520, pesoOroGramos: 11.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 6, monto: 1611 }, oro14k: { gramos: 5.6, monto: 1479 }, brillanteria: { piezas: 2, monto: 430 } },
        factura: { id: 'FAC-126', fechaEmision: '2026-02-18', fechaVencimiento: '2026-02-18', condicion: 0, monto: 3520, montoPagado: 3520, fechaPago: '2026-02-18', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-095', fecha: '2026-02-13', canal: 'Shopify', monto: 3020, pesoOroGramos: 9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 5.6, monto: 1466 }, oro14k: { gramos: 3.4, monto: 979 }, brillanteria: { piezas: 1, monto: 575 } },
        factura: { id: 'FAC-095', fechaEmision: '2026-02-13', fechaVencimiento: '2026-02-13', condicion: 0, monto: 3020, montoPagado: 3020, fechaPago: '2026-02-13', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-074', fecha: '2026-02-11', canal: 'Shopify', monto: 3730, pesoOroGramos: 9.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.5, monto: 1124 }, oro14k: { gramos: 5.1, monto: 1487 }, brillanteria: { piezas: 3, monto: 1119 } },
        factura: { id: 'FAC-074', fechaEmision: '2026-02-11', fechaVencimiento: '2026-02-11', condicion: 0, monto: 3730, montoPagado: 3730, fechaPago: '2026-02-11', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-054', fecha: '2026-02-07', canal: 'Shopify', monto: 2620, pesoOroGramos: 9.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 5.4, monto: 1483 }, oro14k: { gramos: 4.3, monto: 1137 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-054', fechaEmision: '2026-02-07', fechaVencimiento: '2026-02-07', condicion: 0, monto: 2620, montoPagado: 2620, fechaPago: '2026-02-07', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-032', fecha: '2026-02-05', canal: 'Shopify', monto: 5450, pesoOroGramos: 15.6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 8, monto: 2187 }, oro14k: { gramos: 7.6, monto: 2073 }, brillanteria: { piezas: 2, monto: 1190 } },
        factura: { id: 'FAC-032', fechaEmision: '2026-02-05', fechaVencimiento: '2026-02-05', condicion: 0, monto: 5450, montoPagado: 5450, fechaPago: '2026-02-05', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-010', fecha: '2026-02-03', canal: 'Shopify', monto: 4200, pesoOroGramos: 14.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 6, monto: 1577 }, oro14k: { gramos: 8.9, monto: 2469 }, brillanteria: { piezas: 1, monto: 154 } },
        factura: { id: 'FAC-010', fechaEmision: '2026-02-03', fechaVencimiento: '2026-02-03', condicion: 0, monto: 4200, montoPagado: 4200, fechaPago: '2026-02-03', estado: 'pagada', diasParaPago: 0 },
      },
    ],
  },
  {
    id: 'CLI-012',
    nombre: 'Javier Ramos',
    tipo: 'shopify',
    terminos: 0,
    telefono: '+1 954-555-1212',
    email: 'javi.ramos@yahoo.com',
    compras: [
      {
        id: 'CMP-169', fecha: '2026-02-22', canal: 'Shopify', monto: 4790, pesoOroGramos: 12.7, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 5.7, monto: 1430 }, oro14k: { gramos: 7, monto: 1923 }, brillanteria: { piezas: 5, monto: 1437 } },
        factura: { id: 'FAC-169', fechaEmision: '2026-02-22', fechaVencimiento: '2026-02-22', condicion: 0, monto: 4790, montoPagado: 4790, fechaPago: '2026-02-22', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-105', fecha: '2026-02-14', canal: 'Shopify', monto: 2380, pesoOroGramos: 6, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2.1, monto: 531 }, oro14k: { gramos: 3.9, monto: 1135 }, brillanteria: { piezas: 3, monto: 714 } },
        factura: { id: 'FAC-105', fechaEmision: '2026-02-14', fechaVencimiento: '2026-02-14', condicion: 0, monto: 2380, montoPagado: 2380, fechaPago: '2026-02-14', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-085', fecha: '2026-02-12', canal: 'Shopify', monto: 1290, pesoOroGramos: 3.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 2, monto: 511 }, oro14k: { gramos: 1.4, monto: 392 }, brillanteria: { piezas: 2, monto: 387 } },
        factura: { id: 'FAC-085', fechaEmision: '2026-02-12', fechaVencimiento: '2026-02-12', condicion: 0, monto: 1290, montoPagado: 1290, fechaPago: '2026-02-12', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-075', fecha: '2026-02-11', canal: 'Shopify', monto: 820, pesoOroGramos: 2.1, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 1, monto: 258 }, oro14k: { gramos: 1.1, monto: 316 }, brillanteria: { piezas: 4, monto: 246 } },
        factura: { id: 'FAC-075', fechaEmision: '2026-02-11', fechaVencimiento: '2026-02-11', condicion: 0, monto: 820, montoPagado: 820, fechaPago: '2026-02-11', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-053', fecha: '2026-02-07', canal: 'Shopify', monto: 5070, pesoOroGramos: 18.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 6.9, monto: 1755 }, oro14k: { gramos: 12, monto: 3315 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-053', fechaEmision: '2026-02-07', fechaVencimiento: '2026-02-07', condicion: 0, monto: 5070, montoPagado: 5070, fechaPago: '2026-02-07', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-043', fecha: '2026-02-06', canal: 'Shopify', monto: 1580, pesoOroGramos: 2.2, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 1, monto: 251 }, oro14k: { gramos: 1.2, monto: 315 }, brillanteria: { piezas: 2, monto: 1014 } },
        factura: { id: 'FAC-043', fechaEmision: '2026-02-06', fechaVencimiento: '2026-02-06', condicion: 0, monto: 1580, montoPagado: 1580, fechaPago: '2026-02-06', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-031', fecha: '2026-02-05', canal: 'Shopify', monto: 1020, pesoOroGramos: 3.9, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 1.5, monto: 397 }, oro14k: { gramos: 2.4, monto: 623 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-031', fechaEmision: '2026-02-05', fechaVencimiento: '2026-02-05', condicion: 0, monto: 1020, montoPagado: 1020, fechaPago: '2026-02-05', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-011', fecha: '2026-02-03', canal: 'Shopify', monto: 5710, pesoOroGramos: 20.8, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 11.5, monto: 3009 }, oro14k: { gramos: 9.3, monto: 2701 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-011', fechaEmision: '2026-02-03', fechaVencimiento: '2026-02-03', condicion: 0, monto: 5710, montoPagado: 5710, fechaPago: '2026-02-03', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-194', fecha: '2026-01-08', canal: 'Shopify', monto: 4720, pesoOroGramos: 12, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 4.5, monto: 1130 }, oro14k: { gramos: 7.5, monto: 2174 }, brillanteria: { piezas: 4, monto: 1416 } },
        factura: { id: 'FAC-194', fechaEmision: '2026-01-08', fechaVencimiento: '2026-01-08', condicion: 0, monto: 4720, montoPagado: 4720, fechaPago: '2026-01-08', estado: 'pagada', diasParaPago: 0 },
      },
      {
        id: 'CMP-188', fecha: '2026-01-05', canal: 'Shopify', monto: 3730, pesoOroGramos: 13.4, vendedor: 'Tienda',
        desglose: { oro10k: { gramos: 7.4, monto: 1949 }, oro14k: { gramos: 6, monto: 1781 }, brillanteria: { piezas: 0, monto: 0 } },
        factura: { id: 'FAC-188', fechaEmision: '2026-01-05', fechaVencimiento: '2026-01-05', condicion: 0, monto: 3730, montoPagado: 3730, fechaPago: '2026-01-05', estado: 'pagada', diasParaPago: 0 },
      },
    ],
  },
  {
    id: 'CLI-018',
    nombre: 'Joseito Lopecitos',
    tipo: 'mayorista',
    terminos: 30,
    telefono: '+1 786-555-1818',
    email: 'joseito@lopecitos.com',
    compras: [
      {
        id: 'CMP-250', fecha: '2026-02-24', canal: 'Al Mayor', monto: 9800, pesoOroGramos: 34.2, vendedor: 'Alejandro Ruiz',
        desglose: { oro10k: { gramos: 14.5, monto: 3720 }, oro14k: { gramos: 19.7, monto: 5380 }, brillanteria: { piezas: 2, monto: 700 } },
        factura: { id: 'FAC-250', fechaEmision: '2026-02-24', fechaVencimiento: '2026-03-26', condicion: 30, monto: 9800, montoPagado: 0, fechaPago: null, estado: 'pendiente', diasParaPago: null },
      },
    ],
  },
]

// ─── Ventas Diarias (mock) ───
export const ventasDiarias = [
  // Diciembre 2025
  { fecha: '2025-12-05', oro10k: 27465, oro14k: 33505, brillanteria: 1440, total: 62410 },
  { fecha: '2025-12-10', oro10k: 38251, oro14k: 38382, brillanteria: 2707, total: 79340 },
  { fecha: '2025-12-18', oro10k: 27767, oro14k: 36404, brillanteria: 5549, total: 69720 },
  { fecha: '2025-12-22', oro10k: 33434, oro14k: 41994, brillanteria: 4732, total: 80160 },
  // Enero 2026
  { fecha: '2026-01-02', oro10k: 800, oro14k: 1400, brillanteria: 1100, total: 3300 },
  { fecha: '2026-01-03', oro10k: 1600, oro14k: 3400, brillanteria: 500, total: 5500 },
  { fecha: '2026-01-05', oro10k: 34478, oro14k: 42988, brillanteria: 7614, total: 85080 },
  { fecha: '2026-01-06', oro10k: 1900, oro14k: 1200, brillanteria: 700, total: 3800 },
  { fecha: '2026-01-07', oro10k: 3000, oro14k: 2300, brillanteria: 300, total: 5600 },
  { fecha: '2026-01-08', oro10k: 27962, oro14k: 28323, brillanteria: 3505, total: 59790 },
  { fecha: '2026-01-09', oro10k: 1700, oro14k: 3100, brillanteria: 1400, total: 6200 },
  { fecha: '2026-01-10', oro10k: 45478, oro14k: 65013, brillanteria: 10319, total: 120810 },
  { fecha: '2026-01-13', oro10k: 800, oro14k: 2200, brillanteria: 500, total: 3500 },
  { fecha: '2026-01-14', oro10k: 1600, oro14k: 2900, brillanteria: 1200, total: 5700 },
  { fecha: '2026-01-15', oro10k: 36073, oro14k: 37937, brillanteria: 3170, total: 77180 },
  { fecha: '2026-01-16', oro10k: 2000, oro14k: 3500, brillanteria: 500, total: 6000 },
  { fecha: '2026-01-17', oro10k: 2400, oro14k: 2200, brillanteria: 1500, total: 6100 },
  { fecha: '2026-01-20', oro10k: 34537, oro14k: 43861, brillanteria: 7162, total: 85560 },
  { fecha: '2026-01-21', oro10k: 1000, oro14k: 2000, brillanteria: 1100, total: 4100 },
  { fecha: '2026-01-22', oro10k: 1000, oro14k: 1000, brillanteria: 300, total: 2300 },
  { fecha: '2026-01-23', oro10k: 3000, oro14k: 1800, brillanteria: 300, total: 5100 },
  { fecha: '2026-01-24', oro10k: 2800, oro14k: 3200, brillanteria: 400, total: 6400 },
  { fecha: '2026-01-25', oro10k: 36517, oro14k: 42277, brillanteria: 7416, total: 86210 },
  { fecha: '2026-01-27', oro10k: 2200, oro14k: 3200, brillanteria: 600, total: 6000 },
  { fecha: '2026-01-28', oro10k: 41238, oro14k: 51659, brillanteria: 2493, total: 95390 },
  { fecha: '2026-01-30', oro10k: 2200, oro14k: 2900, brillanteria: 1300, total: 6400 },
  // Febrero 2026
  { fecha: '2026-02-03', oro10k: 42169, oro14k: 54299, brillanteria: 5432, total: 101900 },
  { fecha: '2026-02-04', oro10k: 48500, oro14k: 55471, brillanteria: 10259, total: 114230 },
  { fecha: '2026-02-05', oro10k: 64522, oro14k: 62014, brillanteria: 6524, total: 133060 },
  { fecha: '2026-02-06', oro10k: 52707, oro14k: 78098, brillanteria: 10225, total: 141030 },
  { fecha: '2026-02-07', oro10k: 61891, oro14k: 84270, brillanteria: 9779, total: 155940 },
  { fecha: '2026-02-10', oro10k: 53676, oro14k: 62537, brillanteria: 12077, total: 128290 },
  { fecha: '2026-02-11', oro10k: 43074, oro14k: 51446, brillanteria: 7370, total: 101890 },
  { fecha: '2026-02-12', oro10k: 58170, oro14k: 68153, brillanteria: 8767, total: 135090 },
  { fecha: '2026-02-13', oro10k: 44070, oro14k: 53046, brillanteria: 7134, total: 104250 },
  { fecha: '2026-02-14', oro10k: 56042, oro14k: 57193, brillanteria: 8665, total: 121900 },
  { fecha: '2026-02-17', oro10k: 50662, oro14k: 61924, brillanteria: 6344, total: 118930 },
  { fecha: '2026-02-18', oro10k: 54990, oro14k: 65830, brillanteria: 10570, total: 131390 },
  { fecha: '2026-02-19', oro10k: 52026, oro14k: 70784, brillanteria: 8460, total: 131270 },
  { fecha: '2026-02-20', oro10k: 44328, oro14k: 61630, brillanteria: 5762, total: 111720 },
  { fecha: '2026-02-21', oro10k: 49760, oro14k: 69517, brillanteria: 10263, total: 129540 },
  { fecha: '2026-02-22', oro10k: 66857, oro14k: 77500, brillanteria: 11323, total: 155680 },
  { fecha: '2026-02-23', oro10k: 42271, oro14k: 56856, brillanteria: 15413, total: 114540 },
]
