import { getSupabaseAdmin } from './_lib/qbClient.js'
import { getTokenEndpoint } from './_lib/discovery.js'

export default async function handler(req, res) {
  try {
    const { code, state, realmId } = req.query

    if (!code || !realmId) {
      return res.redirect(302, '/configuracion?qb=error&msg=missing_params')
    }

    // Validate state parameter (CSRF protection)
    const cookies = parseCookies(req.headers.cookie || '')
    if (cookies.qb_state && cookies.qb_state !== state) {
      return res.redirect(302, '/configuracion?qb=error&msg=invalid_state')
    }

    // Exchange authorization code for tokens
    const credentials = Buffer.from(
      `${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`
    ).toString('base64')

    const redirectUri = process.env.QB_REDIRECT_URI || 'https://vicenza-tan.vercel.app/api/qb/callback'

    const tokenEndpoint = await getTokenEndpoint()

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text()
      console.error('Token exchange failed:', errBody)
      return res.redirect(302, '/configuracion?qb=error&msg=token_exchange_failed')
    }

    const tokens = await tokenResponse.json()

    // Fetch company info from QB
    const baseUrl = process.env.QB_ENVIRONMENT === 'sandbox'
      ? 'https://sandbox-quickbooks.api.intuit.com'
      : 'https://quickbooks.api.intuit.com'

    let companyName = 'QuickBooks Company'
    try {
      const companyResponse = await fetch(
        `${baseUrl}/v3/company/${realmId}/companyinfo/${realmId}`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Accept': 'application/json',
          },
        }
      )
      if (companyResponse.ok) {
        const companyData = await companyResponse.json()
        companyName = companyData.CompanyInfo?.CompanyName || companyName
      }
    } catch (e) {
      console.error('Failed to fetch company info:', e.message)
    }

    // Store tokens in Supabase
    const supabase = getSupabaseAdmin()
    const now = new Date()

    // Deactivate any existing connections for this realm
    await supabase
      .from('qb_connections')
      .update({ status: 'disconnected', updated_at: now.toISOString() })
      .eq('realm_id', realmId)
      .eq('status', 'active')

    // Insert new connection
    const { error: insertError } = await supabase
      .from('qb_connections')
      .insert({
        realm_id: realmId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        refresh_token_expires_at: new Date(Date.now() + tokens.x_refresh_token_expires_in * 1000).toISOString(),
        company_name: companyName,
        status: 'active',
        connected_at: now.toISOString(),
      })

    if (insertError) {
      console.error('Failed to save QB connection:', insertError)
      return res.redirect(302, '/configuracion?qb=error&msg=db_error')
    }

    // Clear state cookie
    res.setHeader('Set-Cookie', 'qb_state=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0')

    return res.redirect(302, `/configuracion?qb=connected&company=${encodeURIComponent(companyName)}`)
  } catch (error) {
    console.error('QB callback error:', error)
    return res.redirect(302, '/configuracion?qb=error&msg=unexpected')
  }
}

function parseCookies(cookieString) {
  const cookies = {}
  cookieString.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=')
    if (name) cookies[name] = rest.join('=')
  })
  return cookies
}
