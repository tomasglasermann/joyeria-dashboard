import { supabase } from './supabase'

// ==========================================
// PROVEEDORES
// ==========================================
export async function getProveedoresDB() {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .order('nombre')
  if (error) throw error
  return data
}

export async function upsertProveedor(nombre) {
  // Insert or get existing
  const { data: existing } = await supabase
    .from('proveedores')
    .select('id')
    .eq('nombre', nombre)
    .single()

  if (existing) return existing.id

  const { data, error } = await supabase
    .from('proveedores')
    .insert({ nombre })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

// ==========================================
// PRODUCTOS
// ==========================================
export async function getProductos({ search = '', proveedor = '', tipo = '', page = 1, pageSize = 50, sortBy = 'sku', sortDir = 'asc', hasPhoto = 'all' } = {}) {
  let query = supabase
    .from('productos')
    .select('*', { count: 'exact' })
    .eq('status', 'activo')
    .order(sortBy, { ascending: sortDir === 'asc' })
    .order('sku', { ascending: true })

  if (search) {
    query = query.or(`sku.ilike.%${search}%,descripcion.ilike.%${search}%`)
  }
  if (proveedor) {
    query = query.eq('proveedor_nombre', proveedor)
  }
  if (tipo) {
    query = query.eq('tipo', tipo)
  }
  if (hasPhoto === 'yes') {
    query = query.not('foto_url', 'is', null)
  }
  if (hasPhoto === 'no') {
    query = query.is('foto_url', null)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function getProductoBySku(sku) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('sku', sku)
  if (error) throw error
  return data
}

export async function getInventarioStats() {
  // Supabase returns max 1000 rows by default, so we paginate
  let allData = []
  let from = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('productos')
      .select('proveedor_nombre, costo, tipo, status')
      .eq('status', 'activo')
      .range(from, from + pageSize - 1)

    if (error) throw error
    if (!data || data.length === 0) break

    allData = allData.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }

  const total = allData.length
  const valorTotal = allData.reduce((sum, p) => sum + (Number(p.costo) || 0), 0)

  // Por proveedor
  const porProveedor = {}
  allData.forEach(p => {
    const prov = p.proveedor_nombre || 'Sin proveedor'
    if (!porProveedor[prov]) porProveedor[prov] = { count: 0, valor: 0 }
    porProveedor[prov].count++
    porProveedor[prov].valor += Number(p.costo) || 0
  })

  // Por tipo
  const porTipo = {}
  allData.forEach(p => {
    const tipo = p.tipo || 'Sin tipo'
    if (!porTipo[tipo]) porTipo[tipo] = 0
    porTipo[tipo]++
  })

  return { total, valorTotal, porProveedor, porTipo }
}

// ==========================================
// IMPORTAR EXCEL
// ==========================================
export async function importarExcel(rows) {
  // rows = array de { sku, costo, proveedor_nombre, tag_price, wholesale, retail, piezas }

  // 1. Get unique proveedores and upsert them
  const proveedoresUnicos = [...new Set(rows.map(r => r.proveedor_nombre).filter(Boolean))]
  const proveedorMap = {}

  for (const nombre of proveedoresUnicos) {
    proveedorMap[nombre] = await upsertProveedor(nombre)
  }

  // 2. Check which SKUs already exist in the database
  const allSkus = rows.map(r => r.sku).filter(Boolean)
  const existingMap = {} // sku → { id }

  for (let i = 0; i < allSkus.length; i += 100) {
    const batch = allSkus.slice(i, i + 100)
    const { data } = await supabase
      .from('productos')
      .select('id, sku')
      .eq('status', 'activo')
      .in('sku', batch)
    if (data) {
      for (const p of data) {
        existingMap[p.sku] = p.id
      }
    }
  }

  // 3. Split into updates (SKU exists) and inserts (new SKU)
  const toUpdate = []
  const toInsert = []

  for (const r of rows) {
    const producto = {
      sku: r.sku,
      descripcion: r.descripcion || null,
      tipo: r.tipo || null,
      quilates: r.quilates || null,
      costo: r.costo || null,
      tag_price: r.tag_price || null,
      wholesale: r.wholesale || null,
      retail: r.retail || null,
      proveedor_id: proveedorMap[r.proveedor_nombre] || null,
      proveedor_nombre: r.proveedor_nombre || null,
      piezas: r.piezas || 1,
      status: 'activo',
    }

    if (existingMap[r.sku]) {
      toUpdate.push({ id: existingMap[r.sku], ...producto })
    } else {
      toInsert.push(producto)
    }
  }

  // 4. Update existing products by ID (batch upsert on primary key)
  let updated = 0
  const batchSize = 500

  if (toUpdate.length > 0) {
    for (let i = 0; i < toUpdate.length; i += batchSize) {
      const batch = toUpdate.slice(i, i + batchSize)
      const { error } = await supabase
        .from('productos')
        .upsert(batch, { onConflict: 'id' })
      if (error) throw error
      updated += batch.length
    }
  }

  // 5. Insert new products in batches
  let inserted = 0

  if (toInsert.length > 0) {
    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize)
      const { error } = await supabase
        .from('productos')
        .insert(batch)
      if (error) throw error
      inserted += batch.length
    }
  }

  console.log(`Import: ${inserted} nuevos, ${updated} actualizados, ${proveedoresUnicos.length} proveedores`)
  return { inserted, updated, proveedores: proveedoresUnicos.length }
}

// ==========================================
// IMPORTAR PDF SPECTRUM
// ==========================================
export function parseSpectrumText(text) {
  // Parse text extracted from Spectrum PDF
  // Pattern: SKU - PRICE TYPE\nDetails...\nTotal $ AMOUNT
  const items = []
  const lines = text.split('\n')

  // Find lines matching pattern: SEBR-45526H - 13000 18KT Bracelet
  const skuPattern = /^(SE[\w-]+)\s*-\s*([\d.]+)\s+(\d+KT)\s+(\w+)/

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(skuPattern)
    if (match) {
      const item = {
        sku: match[1],
        costo: parseFloat(match[2]),
        quilates: match[3],
        tipo: match[4],
        diamantes: [],
        peso_bruto: null,
        peso_oro: null,
      }

      // Look ahead for details
      for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
        const line = lines[j].trim()
        if (line.startsWith('Gross Wt')) {
          item.peso_bruto = parseFloat(line.split(/\s+/).pop())
        } else if (line.startsWith('Gold')) {
          item.peso_oro = parseFloat(line.split(/\s+/).pop())
        } else if (line.startsWith('DIA') || line.startsWith('EME') || line.startsWith('RUB') || line.startsWith('SAP')) {
          const parts = line.split(/\s+/)
          const peso = parseFloat(parts[parts.length - 1])
          const tipo = parts.slice(0, -1).join(' ')
          if (!isNaN(peso)) {
            item.diamantes.push({ tipo, peso })
          }
        } else if (line.startsWith('Total')) {
          break
        }
      }

      items.push(item)
    }
  }

  return items
}

// ==========================================
// SKU SIMILARITY (Levenshtein + substring)
// ==========================================
function levenshtein(a, b) {
  const m = a.length, n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function normalizeSku(sku) {
  return (sku || '').toUpperCase().replace(/\s+/g, '').trim()
}

export function skuSimilarity(a, b) {
  const na = normalizeSku(a)
  const nb = normalizeSku(b)
  if (!na || !nb) return 0
  if (na === nb) return 1

  // Substring containment bonus
  if (na.includes(nb) || nb.includes(na)) {
    const shorter = Math.min(na.length, nb.length)
    const longer = Math.max(na.length, nb.length)
    return 0.7 + (0.3 * shorter / longer)
  }

  // Levenshtein-based similarity
  const maxLen = Math.max(na.length, nb.length)
  const dist = levenshtein(na, nb)
  return 1 - dist / maxLen
}

// ==========================================
// SYNC PHOTOS TO DB
// ==========================================
export async function syncPhotosToDb(photoMap) {
  // Get all product SKUs from DB (paginated to avoid 1000 row limit)
  let productos = []
  let from = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('productos')
      .select('id, sku, foto_url')
      .eq('status', 'activo')
      .range(from, from + pageSize - 1)

    if (error) throw error
    if (!data || data.length === 0) break

    productos = productos.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }

  let updated = 0
  const updates = []
  const matchedPhotoSkus = new Set()
  const matchedProductIds = new Set()

  for (const product of productos) {
    const sku = product.sku
    // Direct match
    let photo = photoMap[sku]
    let matchedKey = photo ? sku : null
    // Try removing color suffix
    if (!photo) {
      const base = sku.replace(/\s*(WG|YG|W|Y|RG)$/i, '')
      if (base !== sku) {
        photo = photoMap[base]
        matchedKey = photo ? base : null
      }
    }

    if (photo) {
      matchedPhotoSkus.add(matchedKey)
      matchedProductIds.add(product.id)
      if (photo.u !== product.foto_url) {
        updates.push({ id: product.id, foto_url: photo.u })
      }
    }
  }

  // Batch update in groups of 100
  for (let i = 0; i < updates.length; i += 100) {
    const batch = updates.slice(i, i + 100)
    for (const item of batch) {
      await supabase
        .from('productos')
        .update({ foto_url: item.foto_url })
        .eq('id', item.id)
    }
    updated += batch.length
  }

  // ==========================================
  // FUZZY MATCHING for unmatched Drive photos
  // ==========================================
  const unmatchedDriveSkus = Object.keys(photoMap).filter(k => !matchedPhotoSkus.has(k))
  const unmatchedProducts = productos.filter(p => !matchedProductIds.has(p.id))
  const partialMatches = []

  const SIMILARITY_THRESHOLD = 0.6

  for (const driveSku of unmatchedDriveSkus) {
    let bestMatch = null
    let bestScore = 0

    for (const product of unmatchedProducts) {
      const score = skuSimilarity(driveSku, product.sku)
      // Also try without color suffix
      const base = product.sku.replace(/\s*(WG|YG|W|Y|RG|DYG|TRI|YRB|YEM|WRB|WEM|WSP|YDRB|YDBSP|YBSP|YDEM|YDSQ|RB|SP)$/i, '')
      const scoreBase = base !== product.sku ? skuSimilarity(driveSku, base) : 0
      const finalScore = Math.max(score, scoreBase)

      if (finalScore > bestScore && finalScore >= SIMILARITY_THRESHOLD) {
        bestScore = finalScore
        bestMatch = product
      }
    }

    if (bestMatch) {
      partialMatches.push({
        driveSku,
        drivePhotoUrl: photoMap[driveSku].u,
        drivePath: photoMap[driveSku].p,
        suggestedProduct: { id: bestMatch.id, sku: bestMatch.sku },
        similarity: Math.round(bestScore * 100),
      })
    }
  }

  // Sort by similarity descending
  partialMatches.sort((a, b) => b.similarity - a.similarity)

  return { updated, matchedPhotoSkus: [...matchedPhotoSkus], partialMatches }
}

// ==========================================
// APPROVE PARTIAL PHOTO MATCH
// ==========================================
export async function approvePhotoMatch(productId, photoUrl) {
  const { error } = await supabase
    .from('productos')
    .update({ foto_url: photoUrl })
    .eq('id', productId)
  if (error) throw error
  return { success: true }
}

// ==========================================
// UPDATE PRODUCT DESCRIPTIONS FROM PDF
// ==========================================
export async function updateProductDescriptions(items) {
  let updated = 0
  let notFound = 0
  const notFoundSkus = []

  for (const item of items) {
    if (!item.sku) continue

    // Try exact SKU match
    const { data: products } = await supabase
      .from('productos')
      .select('id, sku, descripcion, tipo, quilates')
      .eq('status', 'activo')
      .eq('sku', item.sku)

    // Try without color suffix if no exact match
    let matched = products && products.length > 0 ? products : null
    if (!matched) {
      const base = item.sku.replace(/\s*(WG|YG|W|Y|RG|DYG|TRI|YRB|YEM|WRB|WEM|WSP|YDRB|YDBSP|YBSP|YDEM|YDSQ|RB|SP)$/i, '').trim()
      if (base !== item.sku) {
        const { data: altProducts } = await supabase
          .from('productos')
          .select('id, sku, descripcion, tipo, quilates')
          .eq('status', 'activo')
          .ilike('sku', `${base}%`)
        matched = altProducts && altProducts.length > 0 ? altProducts : null
      }
    }

    if (!matched || matched.length === 0) {
      notFound++
      notFoundSkus.push(item.sku)
      continue
    }

    // Update each matched product
    for (const product of matched) {
      const updateData = {}

      // Only update fields that are empty in the DB
      if (!product.descripcion && item.descripcion_raw) {
        updateData.descripcion = item.descripcion_raw
      }
      if (!product.tipo && item.tipo) {
        updateData.tipo = item.tipo
      }
      if (!product.quilates && item.quilates) {
        updateData.quilates = item.quilates
      }
      if (item.titulo_shopify) {
        updateData.titulo_shopify = item.titulo_shopify
      }
      if (item.descripcion_shopify) {
        updateData.descripcion_shopify = item.descripcion_shopify
      }
      if (item.color_oro) {
        updateData.color_oro = item.color_oro
      }
      if (item.diseno) {
        updateData.diseno = item.diseno
      }
      if (item.piedras && item.piedras.length > 0) {
        updateData.diamantes = item.piedras
      }
      if (item.peso_bruto) {
        updateData.peso_bruto = item.peso_bruto
      }
      if (item.peso_oro) {
        updateData.peso_oro = item.peso_oro
      }

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('productos')
          .update(updateData)
          .eq('id', product.id)

        if (!error) updated++
      }
    }
  }

  return { updated, notFound, notFoundSkus }
}

// ==========================================
// UPLOAD PROVIDER PHOTOS FROM PDF
// ==========================================
export async function uploadProviderPhotos(items) {
  let uploaded = 0
  let skipped = 0

  for (const item of items) {
    if (!item.sku || !item._imageDataUrl) {
      skipped++
      continue
    }

    // Find the product in DB by SKU
    let matched = null
    const { data: products } = await supabase
      .from('productos')
      .select('id, sku')
      .eq('status', 'activo')
      .eq('sku', item.sku)

    matched = products && products.length > 0 ? products[0] : null

    // Try without color suffix
    if (!matched) {
      const base = item.sku.replace(/\s*(WG|YG|W|Y|RG|DYG|TRI|YRB|YEM|WRB|WEM|WSP|YDRB|YDBSP|YBSP|YDEM|YDSQ|RB|SP)$/i, '').trim()
      if (base !== item.sku) {
        const { data: altProducts } = await supabase
          .from('productos')
          .select('id, sku')
          .eq('status', 'activo')
          .ilike('sku', `${base}%`)
        matched = altProducts && altProducts.length > 0 ? altProducts[0] : null
      }
    }

    if (!matched) {
      skipped++
      continue
    }

    try {
      // Convert data URL to blob
      const response = await fetch(item._imageDataUrl)
      const blob = await response.blob()

      // Upload to Supabase Storage
      const filePath = `proveedor/${item.sku.replace(/\s+/g, '_')}.jpg`

      const { error: uploadError } = await supabase
        .storage
        .from('producto-fotos')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true, // overwrite if exists
        })

      if (uploadError) {
        console.error(`Upload error for ${item.sku}:`, uploadError.message)
        skipped++
        continue
      }

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('producto-fotos')
        .getPublicUrl(filePath)

      const publicUrl = urlData?.publicUrl
      if (!publicUrl) {
        skipped++
        continue
      }

      // Check if this product already has a provider photo
      const { data: existingPhotos } = await supabase
        .from('producto_fotos')
        .select('id')
        .eq('producto_id', matched.id)
        .eq('tipo', 'proveedor')

      if (existingPhotos && existingPhotos.length > 0) {
        // Update existing
        await supabase
          .from('producto_fotos')
          .update({ url: publicUrl, nombre_archivo: filePath })
          .eq('id', existingPhotos[0].id)
      } else {
        // Insert new
        await supabase
          .from('producto_fotos')
          .insert({
            producto_id: matched.id,
            url: publicUrl,
            tipo: 'proveedor',
            nombre_archivo: filePath,
          })
      }

      uploaded++
    } catch (err) {
      console.error(`Photo upload error for ${item.sku}:`, err.message)
      skipped++
    }
  }

  return { uploaded, skipped }
}

// ==========================================
// UPLOAD MANUAL PHOTO (single product)
// ==========================================
// ==========================================
// FIND PRODUCTS BY SKU ARRAY (for screenshot import)
// ==========================================
export async function findProductsBySkus(skus) {
  if (!skus || skus.length === 0) return {}

  const skuMap = {} // sku → { id, sku }
  const batchSize = 100

  for (let i = 0; i < skus.length; i += batchSize) {
    const batch = skus.slice(i, i + batchSize)
    const { data } = await supabase
      .from('productos')
      .select('id, sku')
      .eq('status', 'activo')
      .in('sku', batch)

    if (data) {
      for (const p of data) skuMap[p.sku] = p
    }
  }

  return skuMap
}

export async function uploadManualPhoto(productId, sku, file) {
  const filePath = `proveedor/${sku.replace(/\s+/g, '_')}.jpg`

  // 1. Upload to storage
  const { error: uploadError } = await supabase
    .storage
    .from('producto-fotos')
    .upload(filePath, file, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    })
  if (uploadError) throw uploadError

  // 2. Get public URL
  const { data: urlData } = supabase
    .storage
    .from('producto-fotos')
    .getPublicUrl(filePath)
  const publicUrl = urlData?.publicUrl
  if (!publicUrl) throw new Error('No se pudo obtener la URL publica')

  // 3. Upsert in producto_fotos table
  const { data: existing } = await supabase
    .from('producto_fotos')
    .select('id')
    .eq('producto_id', productId)
    .eq('tipo', 'proveedor')

  if (existing && existing.length > 0) {
    await supabase
      .from('producto_fotos')
      .update({ url: publicUrl, nombre_archivo: filePath })
      .eq('id', existing[0].id)
  } else {
    await supabase
      .from('producto_fotos')
      .insert({
        producto_id: productId,
        url: publicUrl,
        tipo: 'proveedor',
        nombre_archivo: filePath,
      })
  }

  return { success: true, url: publicUrl }
}

// ==========================================
// GET PROVIDER PHOTOS FOR PRODUCTS
// ==========================================
export async function getProviderPhotos(productIds) {
  if (!productIds || productIds.length === 0) return {}

  // Fetch in batches (Supabase has .in() limit)
  const batchSize = 100
  const allPhotos = []

  for (let i = 0; i < productIds.length; i += batchSize) {
    const batch = productIds.slice(i, i + batchSize)
    const { data, error } = await supabase
      .from('producto_fotos')
      .select('producto_id, url, tipo')
      .in('producto_id', batch)
      .eq('tipo', 'proveedor')

    if (!error && data) {
      allPhotos.push(...data)
    }
  }

  // Build map: producto_id → url
  const photoMap = {}
  for (const photo of allPhotos) {
    photoMap[photo.producto_id] = photo.url
  }

  return photoMap
}

// ==========================================
// DELETE ALL (for re-import)
// ==========================================
export async function deleteAllProductos() {
  const { error } = await supabase
    .from('productos')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all
  if (error) throw error
}
