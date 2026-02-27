import { verifyAdmin, qbQuery, qbQueryAll, getActiveConnection, getSupabaseAdmin, setCorsHeaders } from './_lib/qbClient.js'
import { transformCustomers, transformVendors, computeProveedoresKPIs, computeAggregates } from './_lib/transformers.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await verifyAdmin(req)

    const connection = await getActiveConnection()
    if (!connection) {
      return res.status(400).json({ error: 'No hay conexion activa con QuickBooks' })
    }

    const supabase = getSupabaseAdmin()

    // Clear existing cache
    await supabase
      .from('qb_sync_cache')
      .delete()
      .eq('realm_id', connection.realm_id)

    // Fetch all data from QB with pagination (no 1000 limit)
    const [customers, invoices, receipts, vendors, bills, billPayments] = await Promise.all([
      qbQueryAll("SELECT * FROM Customer WHERE Active = true", "Customer"),
      qbQueryAll("SELECT * FROM Invoice", "Invoice"),
      qbQueryAll("SELECT * FROM SalesReceipt", "SalesReceipt"),
      qbQueryAll("SELECT * FROM Vendor WHERE Active = true", "Vendor"),
      qbQueryAll("SELECT * FROM Bill", "Bill"),
      qbQueryAll("SELECT * FROM BillPayment", "BillPayment"),
    ])

    // Get item mappings
    const { data: mappingsData } = await supabase
      .from('qb_item_mappings')
      .select('qb_item_id, material_category')
      .eq('realm_id', connection.realm_id)

    const itemMappings = {}
    for (const m of (mappingsData || [])) {
      itemMappings[m.qb_item_id] = m.material_category
    }

    // Transform all data
    const clientesVentas = transformCustomers(customers, invoices, receipts, itemMappings)
    const proveedores = transformVendors(vendors, bills, billPayments)
    const { proveedoresKPIs, deudaPorMaterial } = computeProveedoresKPIs(proveedores)
    const aggregates = computeAggregates(clientesVentas)

    // Update KPIs with vendor data
    aggregates.kpis.deudaProveedores = proveedoresKPIs.deudaTotal

    const now = new Date()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Cache all transformed data
    await Promise.all([
      supabase.from('qb_sync_cache').upsert({
        realm_id: connection.realm_id,
        cache_key: 'clientesVentas',
        data: clientesVentas,
        synced_at: now.toISOString(),
        expires_at: expiresAt,
      }, { onConflict: 'realm_id,cache_key' }),

      supabase.from('qb_sync_cache').upsert({
        realm_id: connection.realm_id,
        cache_key: 'proveedores',
        data: { proveedores, proveedoresKPIs, deudaPorMaterial },
        synced_at: now.toISOString(),
        expires_at: expiresAt,
      }, { onConflict: 'realm_id,cache_key' }),

      supabase.from('qb_sync_cache').upsert({
        realm_id: connection.realm_id,
        cache_key: 'salesSummary',
        data: aggregates,
        synced_at: now.toISOString(),
        expires_at: expiresAt,
      }, { onConflict: 'realm_id,cache_key' }),
    ])

    // Update last_sync_at
    await supabase
      .from('qb_connections')
      .update({ last_sync_at: now.toISOString(), updated_at: now.toISOString() })
      .eq('id', connection.id)

    return res.status(200).json({
      success: true,
      syncedAt: now.toISOString(),
      stats: {
        clientes: clientesVentas.length,
        facturas: invoices.length,
        recibos: receipts.length,
        proveedores: proveedores.length,
      },
    })
  } catch (error) {
    console.error('QB sync error:', error)
    return res.status(500).json({ error: error.message })
  }
}
