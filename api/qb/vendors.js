import { verifyUser, qbQuery, getActiveConnection, getSupabaseAdmin, setCorsHeaders } from './_lib/qbClient.js'
import { transformVendors, computeProveedoresKPIs } from './_lib/transformers.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await verifyUser(req)

    const connection = await getActiveConnection()
    if (!connection) {
      return res.status(400).json({ error: 'No hay conexion activa con QuickBooks' })
    }

    // Check cache
    const supabase = getSupabaseAdmin()
    const { data: cached } = await supabase
      .from('qb_sync_cache')
      .select('data, expires_at')
      .eq('realm_id', connection.realm_id)
      .eq('cache_key', 'proveedores')
      .single()

    if (cached && new Date(cached.expires_at) > new Date()) {
      return res.status(200).json({ ...cached.data, fromCache: true })
    }

    // Fetch from QuickBooks
    const [vendorsRes, billsRes, paymentsRes] = await Promise.all([
      qbQuery("SELECT * FROM Vendor WHERE Active = true MAXRESULTS 500"),
      qbQuery("SELECT * FROM Bill MAXRESULTS 1000"),
      qbQuery("SELECT * FROM BillPayment MAXRESULTS 1000"),
    ])

    const vendors = vendorsRes?.QueryResponse?.Vendor || []
    const bills = billsRes?.QueryResponse?.Bill || []
    const payments = paymentsRes?.QueryResponse?.BillPayment || []

    const proveedores = transformVendors(vendors, bills, payments)
    const { proveedoresKPIs, deudaPorMaterial } = computeProveedoresKPIs(proveedores)

    const result = { proveedores, proveedoresKPIs, deudaPorMaterial }

    // Cache (5 minutes)
    await supabase
      .from('qb_sync_cache')
      .upsert({
        realm_id: connection.realm_id,
        cache_key: 'proveedores',
        data: result,
        synced_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      }, { onConflict: 'realm_id,cache_key' })

    return res.status(200).json({ ...result, fromCache: false })
  } catch (error) {
    console.error('QB vendors error:', error)
    return res.status(500).json({ error: error.message })
  }
}
