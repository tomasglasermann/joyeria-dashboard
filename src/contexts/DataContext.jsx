import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import * as mockData from '../data/mockData'
import * as qbService from '../services/quickbooksService'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { session } = useAuth()

  // Connection state
  const [qbConnected, setQbConnected] = useState(false)
  const [qbLoading, setQbLoading] = useState(false)
  const [qbError, setQbError] = useState(null)
  const [lastSyncAt, setLastSyncAt] = useState(null)
  const [companyName, setCompanyName] = useState(null)

  // Data state — initialized with mock data
  const [data, setData] = useState({
    clientesVentas: mockData.clientesVentas,
    kpis: mockData.kpis,
    ventasPorMaterial: mockData.ventasPorMaterial,
    ventasPorCanal6Meses: mockData.ventasPorCanal6Meses,
    ventasPorCanalDetalle: mockData.ventasPorCanalDetalle,
    ventasPorMaterial6Meses: mockData.ventasPorMaterial6Meses || [],
    distribucionMesMaterial: mockData.distribucionMesMaterial || [],
    desgloseMensual: mockData.desgloseMensual || [],
    datosMensuales: mockData.datosMensuales,
    ventasDiarias: mockData.ventasDiarias,
    ultimasOrdenes: mockData.ultimasOrdenes,
    proveedores: mockData.proveedores,
    proveedoresKPIs: mockData.proveedoresKPIs,
    deudaPorMaterial: mockData.deudaPorMaterial,
    historialOro10Dias: mockData.historialOro10Dias,
    precioOroWidget: mockData.precioOroWidget,
    reporteKPIs: mockData.reporteKPIs || {},
    mixMateriales: mockData.mixMateriales || [],
    reporteMensual: mockData.reporteMensual || {},
    vendedoresEquipo: mockData.vendedoresEquipo,
    ventasComisiones: mockData.ventasComisiones,
    clienteVendedorDefault: mockData.clienteVendedorDefault,
  })

  // Check QB connection on mount
  useEffect(() => {
    if (!session) return
    checkConnection()
  }, [session])

  async function checkConnection() {
    try {
      const status = await qbService.getQBStatus()
      setQbConnected(status.connected)
      setCompanyName(status.companyName)
      setLastSyncAt(status.lastSyncAt)
      if (status.connected) {
        await fetchAllQBData()
      }
    } catch (err) {
      console.error('QB status check failed:', err)
      // Silently fall back to mock data
    }
  }

  async function fetchAllQBData() {
    setQbLoading(true)
    setQbError(null)
    try {
      const [customersData, vendorsData, salesData] = await Promise.all([
        qbService.getQBCustomers(),
        qbService.getQBVendors(),
        qbService.getQBSalesSummary(),
      ])

      setData(prev => ({
        ...prev,
        // Customers
        clientesVentas: customersData.clientesVentas || prev.clientesVentas,
        // Vendors
        proveedores: vendorsData.proveedores || prev.proveedores,
        proveedoresKPIs: vendorsData.proveedoresKPIs || prev.proveedoresKPIs,
        deudaPorMaterial: vendorsData.deudaPorMaterial || prev.deudaPorMaterial,
        // Sales aggregates
        kpis: salesData.kpis || prev.kpis,
        ventasPorMaterial: salesData.ventasPorMaterial || prev.ventasPorMaterial,
        ventasPorCanal6Meses: salesData.ventasPorCanal6Meses || prev.ventasPorCanal6Meses,
        ventasPorCanalDetalle: salesData.ventasPorCanalDetalle || prev.ventasPorCanalDetalle,
        ventasPorMaterial6Meses: salesData.ventasPorMaterial6Meses || prev.ventasPorMaterial6Meses,
        distribucionMesMaterial: salesData.distribucionMesMaterial || prev.distribucionMesMaterial,
        datosMensuales: salesData.datosMensuales || prev.datosMensuales,
        ventasDiarias: salesData.ventasDiarias || prev.ventasDiarias,
        ultimasOrdenes: salesData.ultimasOrdenes || prev.ultimasOrdenes,
        reporteKPIs: salesData.reporteKPIs || prev.reporteKPIs,
        mixMateriales: salesData.mixMateriales || prev.mixMateriales,
        ventasComisiones: salesData.ventasComisiones || prev.ventasComisiones,
        // vendedoresEquipo & clienteVendedorDefault stay from localStorage/mock
      }))
    } catch (err) {
      console.error('QB data fetch failed:', err)
      setQbError(err.message)
      // Keep whatever data was previously loaded
    } finally {
      setQbLoading(false)
    }
  }

  const refresh = useCallback(async () => {
    if (qbConnected) await fetchAllQBData()
  }, [qbConnected])

  const resetToMock = useCallback(() => {
    setData({
      clientesVentas: mockData.clientesVentas,
      kpis: mockData.kpis,
      ventasPorMaterial: mockData.ventasPorMaterial,
      ventasPorCanal6Meses: mockData.ventasPorCanal6Meses,
      ventasPorCanalDetalle: mockData.ventasPorCanalDetalle,
      ventasPorMaterial6Meses: mockData.ventasPorMaterial6Meses || [],
      distribucionMesMaterial: mockData.distribucionMesMaterial || [],
      desgloseMensual: mockData.desgloseMensual || [],
      datosMensuales: mockData.datosMensuales,
      ventasDiarias: mockData.ventasDiarias,
      ultimasOrdenes: mockData.ultimasOrdenes,
      proveedores: mockData.proveedores,
      proveedoresKPIs: mockData.proveedoresKPIs,
      deudaPorMaterial: mockData.deudaPorMaterial,
      historialOro10Dias: mockData.historialOro10Dias,
      precioOroWidget: mockData.precioOroWidget,
      reporteKPIs: mockData.reporteKPIs || {},
      mixMateriales: mockData.mixMateriales || [],
      reporteMensual: mockData.reporteMensual || {},
      vendedoresEquipo: mockData.vendedoresEquipo,
      ventasComisiones: mockData.ventasComisiones,
      clienteVendedorDefault: mockData.clienteVendedorDefault,
    })
    setQbConnected(false)
    setCompanyName(null)
    setLastSyncAt(null)
    setQbError(null)
  }, [])

  const value = {
    ...data,
    qbConnected,
    qbLoading,
    qbError,
    lastSyncAt,
    companyName,
    refresh,
    resetToMock,
    checkConnection,
    isUsingMockData: !qbConnected,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
