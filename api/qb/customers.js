import { verifyUser, qbQuery, qbQueryAll, getActiveConnection, getSupabaseAdmin, setCorsHeaders } from './_lib/qbClient.js'
import { transformCustomers } from './_lib/transformers.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await verifyUser(req)

    const connection = await getActiveConnection()
    if (!connection) {
      return res.status(400).json({ error: 'No hay conexion activa con QuickBooks' })
    }

    // Check cache first
    const supabase = getSupabaseAdmin()
    const { data: cached } = await supabase
      .from('qb_sync_cache')
      .select('data, expires_at')
      .eq('realm_id', connection.realm_id)
      .eq('cache_key', 'clientesVentas')
      .single()

    if (cached && new Date(cached.expires_at) > new Date()) {
      return res.status(200).json({ clientesVentas: cached.data, fromCache: true })
    }

    // Fetch from QuickBooks (paginated - no 1000 limit)
    const [customers, invoices, receipts] = await Promise.all([
      qbQueryAll("SELECT * FROM Customer WHERE Active = true", "Customer"),
      qbQueryAll("SELECT * FROM Invoice", "Invoice"),
      qbQueryAll("SELECT * FROM SalesReceipt", "SalesReceipt"),
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

    // Transform data
    const clientesVentas = transformCustomers(customers, invoices, receipts, itemMappings)

    // Cache result (5 minutes)
    await supabase
      .from('qb_sync_cache')
      .upsert({
        realm_id: connection.realm_id,
        cache_key: 'clientesVentas',
        data: clientesVentas,
        synced_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      }, { onConflict: 'realm_id,cache_key' })

    return res.status(200).json({ clientesVentas, fromCache: false })
  } catch (error) {
    console.error('QB customers error:', error)
    return res.status(500).json({ error: error.message })
  }
}
