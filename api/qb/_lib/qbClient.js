import { createClient } from '@supabase/supabase-js'

// ─── Supabase Admin Client (service role for serverless functions) ───
export function getSupabaseAdmin() {
  return createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// ─── Verify user JWT from Authorization header ───
export async function verifyUser(req) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No authorization token')
  }
  const token = authHeader.replace('Bearer ', '')
  const supabase = getSupabaseAdmin()

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) throw new Error('Invalid token')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.status !== 'approved') {
    throw new Error('User not approved')
  }

  return { user, profile }
}

// ─── Verify admin role ───
export async function verifyAdmin(req) {
  const { user, profile } = await verifyUser(req)
  if (profile.role !== 'admin') {
    throw new Error('Admin access required')
  }
  return { user, profile }
}

// ─── Get active QB connection from database ───
export async function getActiveConnection() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('qb_connections')
    .select('*')
    .eq('status', 'active')
    .single()

  if (error || !data) return null
  return data
}

// ─── Refresh QB tokens ───
export async function refreshQBTokens(connection) {
  const now = new Date()

  // Check if refresh token has expired (100 day lifetime)
  if (new Date(connection.refresh_token_expires_at) < now) {
    const supabase = getSupabaseAdmin()
    await supabase
      .from('qb_connections')
      .update({ status: 'expired', updated_at: now.toISOString() })
      .eq('id', connection.id)
    throw new Error('Refresh token expired. Reconnect QuickBooks.')
  }

  const credentials = Buffer.from(
    `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: connection.refresh_token,
    }),
  })

  if (!response.ok) {
    const errBody = await response.text()
    console.error('Token refresh failed:', errBody)
    throw new Error('Failed to refresh QB token')
  }

  const tokens = await response.json()

  const supabase = getSupabaseAdmin()
  await supabase
    .from('qb_connections')
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      refresh_token_expires_at: new Date(Date.now() + tokens.x_refresh_token_expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', connection.id)

  return tokens.access_token
}

// ─── Get valid access token (auto-refresh if expired) ───
export async function getQBAccessToken() {
  const connection = await getActiveConnection()
  if (!connection) throw new Error('No active QuickBooks connection')

  // Check if access token is still valid (with 5 min buffer)
  const expiresAt = new Date(connection.token_expires_at)
  const buffer = 5 * 60 * 1000 // 5 minutes
  if (expiresAt.getTime() - buffer > Date.now()) {
    return { token: connection.access_token, realmId: connection.realm_id }
  }

  // Token expired, refresh it
  const newToken = await refreshQBTokens(connection)
  return { token: newToken, realmId: connection.realm_id }
}

// ─── Make authenticated QB API request ───
export async function qbFetch(endpoint, options = {}) {
  const { token, realmId } = await getQBAccessToken()

  const baseUrl = process.env.QB_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox-quickbooks.api.intuit.com'
    : 'https://quickbooks.api.intuit.com'

  const url = `${baseUrl}/v3/company/${realmId}/${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Try one token refresh and retry
      const connection = await getActiveConnection()
      if (connection) {
        const newToken = await refreshQBTokens(connection)
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })
        if (retryResponse.ok) return retryResponse.json()
      }
    }
    const errText = await response.text()
    throw new Error(`QB API error ${response.status}: ${errText}`)
  }

  return response.json()
}

// ─── QB Query helper ───
export async function qbQuery(query) {
  const encodedQuery = encodeURIComponent(query)
  return qbFetch(`query?query=${encodedQuery}`)
}

// ─── QB Paginated Query (fetches ALL records beyond 1000 limit) ───
export async function qbQueryAll(baseQuery, entityName) {
  const PAGE_SIZE = 1000
  let startPosition = 1
  let allResults = []

  while (true) {
    const paginatedQuery = `${baseQuery} STARTPOSITION ${startPosition} MAXRESULTS ${PAGE_SIZE}`
    const res = await qbQuery(paginatedQuery)
    const items = res?.QueryResponse?.[entityName] || []
    allResults = allResults.concat(items)

    // If we got fewer than PAGE_SIZE, we've reached the end
    if (items.length < PAGE_SIZE) break
    startPosition += PAGE_SIZE
  }

  return allResults
}

// ─── CORS headers helper ───
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
}
