// ─── Intuit Discovery Document ───
// Fetches OAuth2.0 endpoints dynamically from Intuit's discovery document
// as recommended by Intuit for production apps.
// https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/openid-connect#discovery-document

const DISCOVERY_URL = 'https://developer.api.intuit.com/.well-known/openid_configuration'

let cachedDiscovery = null
let cacheExpiresAt = 0
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function getDiscoveryDocument() {
  if (cachedDiscovery && Date.now() < cacheExpiresAt) {
    return cachedDiscovery
  }

  const response = await fetch(DISCOVERY_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch Intuit discovery document: ${response.status}`)
  }

  cachedDiscovery = await response.json()
  cacheExpiresAt = Date.now() + CACHE_TTL
  return cachedDiscovery
}

export async function getAuthorizationEndpoint() {
  const doc = await getDiscoveryDocument()
  return doc.authorization_endpoint
}

export async function getTokenEndpoint() {
  const doc = await getDiscoveryDocument()
  return doc.token_endpoint
}

export async function getRevocationEndpoint() {
  const doc = await getDiscoveryDocument()
  return doc.revocation_endpoint
}
