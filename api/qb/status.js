import { verifyUser, getActiveConnection, setCorsHeaders } from './_lib/qbClient.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await verifyUser(req)

    const connection = await getActiveConnection()

    if (!connection) {
      return res.status(200).json({
        connected: false,
        companyName: null,
        lastSyncAt: null,
        realmId: null,
      })
    }

    return res.status(200).json({
      connected: true,
      companyName: connection.company_name,
      lastSyncAt: connection.last_sync_at,
      realmId: connection.realm_id,
      connectedAt: connection.connected_at,
    })
  } catch (error) {
    console.error('QB status error:', error)
    return res.status(401).json({ error: error.message })
  }
}
