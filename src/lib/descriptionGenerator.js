// ==========================================
// SHOPIFY DESCRIPTION GENERATOR
// Generates English product descriptions from parsed PDF data
// Format: Intro + MATERIALS + DETAILS
// ==========================================

// ==========================================
// GENERATE TITLE (English - for Shopify)
// Example: "Diamond Multi Shape Ring"
// ==========================================
export function generateTitle(product) {
  const parts = []

  // Stones first
  if (product.piedras?.length > 0) {
    const stones = product.piedras.map(p => p.tipo).join(' & ')
    parts.push(stones)
  }

  // Design/shape
  if (product.diseno) parts.push(product.diseno)

  // Type
  if (product.tipo) parts.push(product.tipo)

  if (parts.length > 0) return parts.join(' ')
  return product.descripcion_raw || product.sku
}

// ==========================================
// Format karat display: "14KT" -> "14k", "18KT" -> "18k"
// ==========================================
function formatKarat(quilates) {
  if (!quilates) return null
  return quilates.replace(/KT$/i, 'k').replace(/K$/i, 'k')
}

// ==========================================
// MARKETING INTRO GENERATOR
// Creates a short, attractive product description
// ==========================================
function generateIntro(product) {
  const tipo = product.tipo
  const karat = formatKarat(product.quilates)
  const color = product.color_oro
  const diseno = product.diseno
  const stones = product.piedras?.map(p => p.tipo.toLowerCase()) || []
  const hasStones = stones.length > 0

  // Build the "Handcrafted in X solid gold" part
  const goldPhrase = karat
    ? `${karat} solid ${color ? color.toLowerCase() : 'gold'}`
    : color ? color.toLowerCase() : 'solid gold'

  // Build the stones phrase
  let stonePhrase = ''
  if (hasStones) {
    const stoneNames = product.piedras.map(p => p.tipo.toLowerCase() + 's')
    if (stoneNames.length === 1) {
      stonePhrase = stoneNames[0]
    } else {
      stonePhrase = stoneNames.slice(0, -1).join(', ') + ' and ' + stoneNames[stoneNames.length - 1]
    }
  }

  // Type-specific intros with variation based on design
  const tipoLower = (tipo || 'piece').toLowerCase()

  // Pool of opening lines per type
  const openers = getOpeners(tipoLower, diseno)
  // Pick one based on a simple hash of the SKU for consistency
  const hash = simpleHash(product.sku || '')
  const opener = openers[hash % openers.length]

  // Build the crafted sentence
  let crafted = `Handcrafted in ${goldPhrase}`
  if (stonePhrase) {
    crafted += ` featuring ${stonePhrase}`
  }
  crafted += '.'

  return `${opener} ${crafted}`
}

function getOpeners(tipo, diseno) {
  const designNote = diseno ? ` ${diseno.toLowerCase()}` : ''

  const ring = [
    'A timeless piece designed to turn heads.',
    'Bold yet refined — this ring speaks for itself.',
    'Elegance meets everyday luxury.',
    'Made to be noticed, built to last.',
    'Where modern design meets classic craftsmanship.',
  ]

  const earring = [
    'The finishing touch every outfit deserves.',
    'Effortlessly elegant, undeniably eye-catching.',
    'Light, luxurious, and made for every occasion.',
    'Small details make the biggest statements.',
    'Designed to frame your face with brilliance.',
  ]

  const pendant = [
    'A statement piece that sits close to the heart.',
    'Simple yet striking — the perfect layering piece.',
    'Wear it solo or stack it — it shines either way.',
    'Subtle luxury you can carry everywhere.',
    'The centerpiece your necklace collection needs.',
  ]

  const necklace = [
    'Designed to elevate any neckline.',
    'A chain worth building your collection around.',
    'Luxurious detail from clasp to clasp.',
    'The kind of piece you never want to take off.',
    'Effortless sophistication, link by link.',
  ]

  const bracelet = [
    'Wrist candy at its finest.',
    'Stack it, solo it — it works every time.',
    'Crafted for comfort, designed for compliments.',
    'The bracelet that ties every look together.',
    'Luxury that wraps around your wrist just right.',
  ]

  const fallback = [
    'A standout piece for your collection.',
    'Crafted with precision and designed with purpose.',
    'Luxury meets everyday wearability.',
    'Fine jewelry that makes a statement.',
    'Designed to be treasured for years to come.',
  ]

  switch (tipo) {
    case 'ring': return ring
    case 'earring': return earring
    case 'pendant': return pendant
    case 'necklace': return necklace
    case 'bracelet': return bracelet
    case 'choker': return necklace
    default: return fallback
  }
}

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// ==========================================
// Build color variants string for MATERIALS
// ==========================================
function buildMaterialsLine(product) {
  const karat = formatKarat(product.quilates)
  const color = product.color_oro

  if (!karat && !color) return null

  if (karat && color) {
    const colorVariants = getColorVariants(color, karat)
    return `Available in ${colorVariants}`
  }

  if (karat) {
    return `Available in ${karat} Yellow Gold, ${karat} White Gold and ${karat} Rose Gold`
  }

  return `Available in ${color}`
}

function getColorVariants(color, karat) {
  if (color === 'Tri-Color') {
    return `${karat} Yellow Gold, ${karat} White Gold and ${karat} Rose Gold`
  }
  if (color === 'Two-Tone') {
    return `${karat} Two-Tone Gold`
  }
  return `${karat} ${color}`
}

// ==========================================
// GENERATE SHOPIFY DESCRIPTION (English)
// ==========================================
export function generateShopifyDescription(product) {
  const lines = []

  // Marketing intro
  const intro = generateIntro(product)
  lines.push(intro)

  // MATERIALS section
  const materialsLine = buildMaterialsLine(product)
  if (materialsLine) {
    lines.push('')
    lines.push('MATERIALS')
    lines.push(materialsLine)
  }

  // DETAILS section
  const details = []

  // CT Weight (total stone weight)
  if (product.piedras?.length > 0) {
    const totalCt = product.piedras.reduce((sum, p) => sum + (p.peso || 0), 0)
    if (totalCt > 0) {
      details.push(`CT Weight: ${totalCt}ct`)
    }
  }

  // Gold Weight
  if (product.peso_oro) {
    details.push(`Gold Weight: ${product.peso_oro}g`)
  }

  // Gross Weight (if no gold weight available)
  if (!product.peso_oro && product.peso_bruto) {
    details.push(`Weight: ${product.peso_bruto}g`)
  }

  // Number of stones by type
  if (product.piedras?.length > 0) {
    product.piedras.forEach(p => {
      if (p.cantidad) {
        details.push(`Number of ${p.tipo}s: ${p.cantidad}`)
      }
    })
  }

  // Stone types listed (when no weight/count details)
  if (product.piedras?.length > 0 && details.length === 0) {
    const stoneList = product.piedras.map(p => p.tipo).join(', ')
    details.push(`Stones: ${stoneList}`)
  }

  if (details.length > 0) {
    lines.push('')
    lines.push('DETAILS')
    details.forEach(d => lines.push(d))
  }

  return lines.join('\n')
}

// ==========================================
// GENERATE DESCRIPTIONS FOR BATCH
// ==========================================
export function generateDescriptionsForBatch(products) {
  return products.map(p => ({
    ...p,
    titulo_shopify: generateTitle(p),
    descripcion_shopify: generateShopifyDescription(p),
  }))
}
