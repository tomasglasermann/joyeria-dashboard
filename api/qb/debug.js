export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  return res.status(200).json({
    hasClientId: !!process.env.QB_CLIENT_ID,
    hasClientSecret: !!process.env.QB_CLIENT_SECRET,
    hasRedirectUri: !!process.env.QB_REDIRECT_URI,
    hasEnvironment: !!process.env.QB_ENVIRONMENT,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    environment: process.env.QB_ENVIRONMENT || 'not set',
    redirectUri: process.env.QB_REDIRECT_URI || 'not set',
    clientIdLength: (process.env.QB_CLIENT_ID || '').length,
  })
}
