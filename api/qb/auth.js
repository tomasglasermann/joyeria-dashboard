import { setCorsHeaders } from './_lib/qbClient.js'
import { getAuthorizationEndpoint } from './_lib/discovery.js'
import crypto from 'crypto'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  // Debug: check if env vars exist
  if (req.query.debug === '1') {
    return res.status(200).json({
      hasClientId: !!process.env.QB_CLIENT_ID,
      clientIdPrefix: process.env.QB_CLIENT_ID ? process.env.QB_CLIENT_ID.substring(0, 6) + '...' : 'MISSING',
      hasClientSecret: !!process.env.QB_CLIENT_SECRET,
      redirectUri: process.env.QB_REDIRECT_URI || 'NOT SET',
    })
  }

  try {
    const clientId = process.env.QB_CLIENT_ID
    if (!clientId) {
      console.error('QB_CLIENT_ID is not set!')
      return res.status(500).json({ error: 'QB_CLIENT_ID no está configurado en el servidor' })
    }

    // Generate state parameter for CSRF protection
    const state = crypto.randomBytes(16).toString('hex')

    const redirectUri = process.env.QB_REDIRECT_URI || `${req.headers.origin || 'https://vicenza-tan.vercel.app'}/api/qb/callback`

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'com.intuit.quickbooks.accounting',
      state,
    })

    const authorizationEndpoint = await getAuthorizationEndpoint()
    const authUrl = `${authorizationEndpoint}?${params.toString()}`

    console.log('QB Auth redirect:', { clientIdPrefix: clientId.substring(0, 6), redirectUri })

    // Set state in cookie for validation on callback
    res.setHeader('Set-Cookie', `qb_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`)

    return res.redirect(302, authUrl)
  } catch (error) {
    console.error('QB auth error:', error)
    return res.status(500).json({ error: 'Error iniciando autenticacion con QuickBooks' })
  }
}
