import { verifyUser, getActiveConnection, getSupabaseAdmin, setCorsHeaders } from './_lib/qbClient.js'
import { computeAggregates } from './_lib/transformers.js'

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
      .eq('cache_key', 'salesSummary')
      .single()

    if (cached && new Date(cached.expires_at) > new Date()) {
      return res.status(200).json({ ...cached.data, fromCache: true })
    }

    // Get clientesVentas from cache or customers endpoint
    const { data: clientesCache } = await supabase
      .from('qb_sync_cache')
      .select('data')
      .eq('realm_id', connection.realm_id)
      .eq('cache_key', 'clientesVentas')
      .single()

    if (!clientesCache?.data) {
      return res.status(400).json({
        error: 'Sincroniza los clientes primero. Los datos de resumen dependen de los clientes.'
      })
    }

    const clientesVentas = clientesCache.data
    const aggregates = computeAggregates(clientesVentas)

    // Cache (5 minutes)
    await supabase
      .from('qb_sync_cache')
      .upsert({
        realm_id: connection.realm_id,
        cache_key: 'salesSummary',
        data: aggregates,
        synced_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      }, { onConflict: 'realm_id,cache_key' })

    return res.status(200).json({ ...aggregates, fromCache: false })
  } catch (error) {
    console.error('QB sales summary error:', error)
    return res.status(500).json({ error: error.message })
  }
}
