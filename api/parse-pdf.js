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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { text, supplier } = req.body || {}

  if (!text || text.length < 30) {
    return res.status(400).json({ error: 'PDF text is too short or empty' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
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
