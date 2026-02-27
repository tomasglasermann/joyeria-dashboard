import { verifyAdmin, getActiveConnection, getSupabaseAdmin, setCorsHeaders } from './_lib/qbClient.js'
import { getRevocationEndpoint } from './_lib/discovery.js'

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

    // Revoke token with Intuit
    try {
      const credentials = Buffer.from(
        `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
      ).toString('base64')

      const revocationEndpoint = await getRevocationEndpoint()

      await fetch(revocationEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ token: connection.access_token }),
      })
    } catch (e) {
      console.error('Token revocation failed (continuing with disconnect):', e.message)
    }

    // Update connection status
    const supabase = getSupabaseAdmin()
    await supabase
      .from('qb_connections')
      .update({ status: 'disconnected', updated_at: new Date().toISOString() })
      .eq('id', connection.id)

    // Clear cache
    await supabase
      .from('qb_sync_cache')
      .delete()
      .eq('realm_id', connection.realm_id)

    return res.status(200).json({ success: true, message: 'QuickBooks desconectado' })
  } catch (error) {
    console.error('QB disconnect error:', error)
    return res.status(500).json({ error: error.message })
  }
}
