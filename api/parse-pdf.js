import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a jewelry wholesale invoice/catalog PDF parser. Your job is to extract structured product data from the raw text of supplier PDFs.

The text was extracted from a PDF using pdfjs-dist with Y-position grouping, so lines are reconstructed but formatting may be imperfect. The PDF may have 1-column, 2-column, or even 3-column grid layouts where data from multiple products appears on the same line.

IMPORTANT: In multi-column catalog layouts (like Halef), data from 2-3 products is interleaved on the same text lines. For example:
"Stock No: PA10419 Model: Stock No: PA16954 Model: Stock No: PA20150 Model:"
means 3 separate products with Stock No PA10419, PA16954, and PA20150.
"D1 : 4 adt. 0,36 Ct D1 : 2 adt. 0,06 Ct Em 2 adt. 0,18 Ct"
means the first product has D1: 4 stones 0.36ct, the second has D1: 2 stones 0.06ct, the third has Em: 2 stones 0.18ct.
You must carefully separate the columns and assign data to the correct product.

Extract EVERY product/item you can find. Each product must be a JSON object with these exact fields:

{
  "sku": string,              // Product SKU/stock number exactly as written (e.g., "BGD1428 YG-6", "SEBR-45526H", "PA10419")
                              // For Halef PDFs: use the Stock No (e.g., "PA10419"), NOT the Model number
  "descripcion_raw": string,  // Original description text from the PDF for this item. Include Model if available.
  "tipo": string | null,      // One of: "Ring", "Earring", "Pendant", "Necklace", "Bracelet", "Choker", "Chain", "Bangle", or null
  "quilates": string | null,  // Gold karat formatted as "NNKT" (e.g., "14KT", "18KT", "10KT"), or null
                              // Note: "14K" should be formatted as "14KT"
  "color_oro": string | null, // One of: "Yellow Gold", "White Gold", "Rose Gold", "Tri-Color", "Two-Tone", or null
                              // Hint: Model suffix Y=Yellow, K=White, P=Rose (e.g., P3479-3Y = Yellow Gold)
  "piedras": [],              // Array of objects: {tipo: string, peso: number|null, cantidad: number|null}
                              // Stone type mapping: DIA/DIAM/D1/D2 = "Diamond", BG = "Diamond" (Baguette Diamond),
                              // RUB/Rb = "Ruby", EME/Em = "Emerald", SAP/Sp = "Sapphire",
                              // BSAP = "Blue Sapphire", PSAP = "Pink Sapphire", TSAV = "Tsavorite", TANZ = "Tanzanite",
                              // BY = "Yellow Diamond"
                              // peso = weight in carats, cantidad = number of stones
                              // Note: "adt." means number of stones (cantidad). Commas may be decimal separators (European format: 0,36 = 0.36)
  "diseno": string | null,    // Design motif if identifiable or null
  "costo": number,            // Cost/price. Use the "Carat" value if it appears to be a price/cost number.
                              // If no price is available, use 0.
  "cantidad": number,         // Quantity (default 1 if not specified)
  "proveedor": string,        // Supplier/company name extracted from the document, or use the supplier hint provided
  "peso_bruto": number|null,  // Gross weight in grams. Look for "Gram :" or "Gross Wt" or "GW".
                              // Note: European format commas (3,72 = 3.72 grams)
  "peso_oro": number|null     // Gold weight in grams if available (look for "Gold Wt", "Net Wt gold"), or null
}

RULES:
- Return ONLY a valid JSON array of products. No markdown, no explanation, no code fences.
- If no products found, return: []
- Preserve SKUs EXACTLY as written in the PDF.
- For costo: always use the final/net price. If you see original price + discounted price, use the discounted one.
- For piedras: include weight in carats (peso) and count (cantidad) when available. Sum same-type stones per product.
- For tipo: infer from description text, SKU patterns, Model codes, or section headers if not explicit.
- For color_oro: YG/Yellow = "Yellow Gold", WG/White = "White Gold", RG/Rose = "Rose Gold", TT = "Two-Tone", TRI = "Tri-Color"
- Handle European decimal format: commas as decimal separators (3,72 = 3.72, 0,36 = 0.36)
- Do NOT invent data. If a field is not present in the text, use null.
- Do NOT skip any products. Extract every single line item.
- For multi-column PDFs, carefully separate columns and match each product's stones, weight, and price correctly.`

// ==========================================
// PHOTO IDENTIFICATION PROMPT
// ==========================================
const PHOTO_ID_PROMPT = `You are analyzing a screenshot of a jewelry supplier catalog page. The page shows a grid of products, each with a SKU code, a product photo, and pricing/details.

Your job is to identify each product's SKU and the bounding box of its PHOTO (not the text, not the barcode - just the product photo).

Return a JSON array where each item has:
{
  "sku": "THE_SKU_CODE",
  "crop": {
    "x_pct": number,   // Left edge as percentage of image width (0-100)
    "y_pct": number,   // Top edge as percentage of image height (0-100)
    "w_pct": number,   // Width as percentage of image width
    "h_pct": number    // Height as percentage of image height
  }
}

RULES:
- Return ONLY a valid JSON array. No markdown, no explanation, no code fences.
- The crop region should include ONLY the product photo - exclude the SKU text above, prices below, and barcodes.
- Include a small margin around each photo (1-2%) to avoid cutting edges.
- Read the SKU exactly as written (e.g., "10054EW-385N", "21578RY-500N").
- Process ALL products visible in the image, row by row, left to right.`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const { mode } = req.body || {}

  // ==========================================
  // MODE: identify-photos (Claude Vision)
  // ==========================================
  if (mode === 'identify-photos') {
    const { image } = req.body
    if (!image) {
      return res.status(400).json({ error: 'No image provided' })
    }

    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      // Extract base64 data and media type
      const base64Match = image.match(/^data:(image\/\w+);base64,(.+)$/)
      if (!base64Match) {
        return res.status(400).json({ error: 'Invalid image format. Expected data URL.' })
      }

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        temperature: 0,
        system: PHOTO_ID_PROMPT,
        messages: [{
          role: 'user',
          content: [{
            type: 'image',
            source: {
              type: 'base64',
              media_type: base64Match[1],
              data: base64Match[2],
            },
          }, {
            type: 'text',
            text: 'Identify all products and their photo bounding boxes in this catalog page.',
          }],
        }],
      })

      const responseText = message.content[0].text.trim()
      let jsonText = responseText
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }

      let products
      try {
        products = JSON.parse(jsonText)
      } catch (parseErr) {
        console.error('Photo ID JSON parse failed. Raw:', responseText.substring(0, 500))
        return res.status(500).json({ success: false, error: 'AI returned invalid JSON' })
      }

      if (!Array.isArray(products)) {
        return res.status(500).json({ success: false, error: 'AI returned non-array' })
      }

      const validated = products.filter(p => p.sku && p.crop).map(p => ({
        sku: String(p.sku).trim(),
        crop: {
          x_pct: Math.max(0, Math.min(100, Number(p.crop.x_pct) || 0)),
          y_pct: Math.max(0, Math.min(100, Number(p.crop.y_pct) || 0)),
          w_pct: Math.max(1, Math.min(100, Number(p.crop.w_pct) || 25)),
          h_pct: Math.max(1, Math.min(100, Number(p.crop.h_pct) || 25)),
        },
      }))

      return res.status(200).json({
        success: true,
        products: validated,
        count: validated.length,
        tokens: {
          input: message.usage?.input_tokens,
          output: message.usage?.output_tokens,
        },
      })
    } catch (err) {
      console.error('Photo identify error:', err.message)
      return res.status(500).json({ success: false, error: err.message || 'Unknown error' })
    }
  }

  // ==========================================
  // DEFAULT MODE: Parse PDF text
  // ==========================================
  const { text, supplier } = req.body || {}

  if (!text || text.length < 30) {
    return res.status(400).json({ error: 'PDF text is too short or empty' })
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const userMessage = supplier && supplier !== 'unknown'
      ? `This PDF is from supplier: ${supplier.replace('_', ' ')}\n\nExtract all products from this PDF text:\n\n${text}`
      : `Extract all products from this PDF text:\n\n${text}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const responseText = message.content[0].text.trim()

    let jsonText = responseText
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    let products
    try {
      products = JSON.parse(jsonText)
    } catch (parseErr) {
      console.error('JSON parse failed. Raw:', responseText.substring(0, 300))
      return res.status(500).json({ success: false, error: 'AI returned invalid JSON' })
    }

    if (!Array.isArray(products)) {
      return res.status(500).json({ success: false, error: 'AI returned non-array' })
    }

    const validated = products.map(p => ({
      sku: String(p.sku || '').trim(),
      descripcion_raw: String(p.descripcion_raw || '').trim(),
      tipo: p.tipo || null,
      quilates: p.quilates || null,
      color_oro: p.color_oro || null,
      piedras: Array.isArray(p.piedras) ? p.piedras.map(s => ({
        tipo: String(s.tipo || ''),
        peso: s.peso ? Number(s.peso) : null,
        cantidad: s.cantidad ? Number(s.cantidad) : null,
      })).filter(s => s.tipo) : [],
      diseno: p.diseno || null,
      costo: Number(p.costo) || 0,
      cantidad: Math.max(1, Number(p.cantidad) || 1),
      proveedor: String(p.proveedor || supplier || 'Unknown').trim(),
      peso_bruto: p.peso_bruto != null ? Number(p.peso_bruto) : null,
      peso_oro: p.peso_oro != null ? Number(p.peso_oro) : null,
    })).filter(p => p.sku)

    return res.status(200).json({
      success: true,
      products: validated,
      count: validated.length,
      model: message.model,
      tokens: {
        input: message.usage?.input_tokens,
        output: message.usage?.output_tokens,
      },
    })

  } catch (err) {
    console.error('AI parse error:', err.message)
    return res.status(500).json({ success: false, error: err.message || 'Unknown error' })
  }
}
