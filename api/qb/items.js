import { verifyAdmin, qbQuery, getActiveConnection, getSupabaseAdmin, setCorsHeaders } from './_lib/qbClient.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await verifyAdmin(req)

    const connection = await getActiveConnection()
    if (!connection) {
      return res.status(400).json({ error: 'No hay conexion activa con QuickBooks' })
    }

    if (req.method === 'POST') {
      // Save item mapping
      const { qbItemId, qbItemName, materialCategory } = req.body || {}

      if (!qbItemId || !materialCategory) {
        return res.status(400).json({ error: 'qbItemId y materialCategory son requeridos' })
      }

      const validCategories = ['oro10k', 'oro14k', 'brillanteria', 'otro']
      if (!validCategories.includes(materialCategory)) {
        return res.status(400).json({ error: `materialCategory debe ser uno de: ${validCategories.join(', ')}` })
      }

      const supabase = getSupabaseAdmin()
      const { error } = await supabase
        .from('qb_item_mappings')
        .upsert({
          realm_id: connection.realm_id,
          qb_item_id: qbItemId,
          qb_item_name: qbItemName || '',
          material_category: materialCategory,
        }, { onConflict: 'realm_id,qb_item_id' })

      if (error) {
        return res.status(500).json({ error: 'Error guardando mapeo' })
      }

      return res.status(200).json({ success: true })
    }

    // GET - Fetch items from QB with current mappings
    const itemsRes = await qbQuery("SELECT * FROM Item WHERE Active = true MAXRESULTS 1000")
    const items = itemsRes?.QueryResponse?.Item || []

    // Get existing mappings
    const supabase = getSupabaseAdmin()
    const { data: mappings } = await supabase
      .from('qb_item_mappings')
      .select('qb_item_id, material_category')
      .eq('realm_id', connection.realm_id)

    const mappingMap = {}
    for (const m of (mappings || [])) {
      mappingMap[m.qb_item_id] = m.material_category
    }

    // Transform items
    const transformedItems = items.map(item => ({
      id: item.Id,
      name: item.Name,
      description: item.Description || '',
      type: item.Type || '',
      unitPrice: item.UnitPrice || 0,
      materialCategory: mappingMap[item.Id] || null,
    }))

    return res.status(200).json({ items: transformedItems })
  } catch (error) {
    console.error('QB items error:', error)
    return res.status(500).json({ error: error.message })
  }
}
