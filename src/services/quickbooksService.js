import { supabase } from '../lib/supabase'

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  }
}

export async function getQBStatus() {
  const res = await fetch('/api/qb/status', { headers: await getAuthHeaders() })
  if (!res.ok) throw new Error('Error verificando estado de QuickBooks')
  return res.json()
}

export async function getQBCustomers() {
  const res = await fetch('/api/qb/customers', { headers: await getAuthHeaders() })
  if (!res.ok) throw new Error('Error obteniendo clientes de QuickBooks')
  return res.json()
}

export async function getQBVendors() {
  const res = await fetch('/api/qb/vendors', { headers: await getAuthHeaders() })
  if (!res.ok) throw new Error('Error obteniendo proveedores de QuickBooks')
  return res.json()
}

export async function getQBSalesSummary() {
  const res = await fetch('/api/qb/sales-summary', { headers: await getAuthHeaders() })
  if (!res.ok) throw new Error('Error obteniendo resumen de ventas')
  return res.json()
}

export async function triggerSync() {
  const res = await fetch('/api/qb/sync', {
    method: 'POST',
    headers: await getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Error sincronizando con QuickBooks')
  return res.json()
}

export async function disconnectQB() {
  const res = await fetch('/api/qb/disconnect', {
    method: 'POST',
    headers: await getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Error desconectando QuickBooks')
  return res.json()
}

export async function getQBItems() {
  const res = await fetch('/api/qb/items', { headers: await getAuthHeaders() })
  if (!res.ok) throw new Error('Error obteniendo items de QuickBooks')
  return res.json()
}

export async function saveItemMapping(qbItemId, qbItemName, materialCategory) {
  const res = await fetch('/api/qb/items', {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ qbItemId, qbItemName, materialCategory }),
  })
  if (!res.ok) throw new Error('Error guardando mapeo de item')
  return res.json()
}
