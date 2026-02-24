export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')

  // Source 1: metals.live (free, no key)
  try {
    const response = await fetch('https://api.metals.live/v1/spot')
    if (response.ok) {
      const data = await response.json()
      const gold = data.find(m => m.metal === 'gold')
      if (gold && gold.price > 0) {
        return res.status(200).json({
          price: gold.price,
          source: 'Kitco (metals.live)',
          timestamp: new Date().toISOString(),
        })
      }
    }
  } catch (e) {
    console.error('metals.live failed:', e.message)
  }

  // Source 2: goldprice.org
  try {
    const response = await fetch('https://data-asg.goldprice.org/dbXRates/USD')
    if (response.ok) {
      const data = await response.json()
      if (data?.items?.[0]?.xauPrice) {
        return res.status(200).json({
          price: data.items[0].xauPrice,
          source: 'GoldPrice.org',
          timestamp: new Date().toISOString(),
        })
      }
    }
  } catch (e) {
    console.error('goldprice.org failed:', e.message)
  }

  return res.status(500).json({ error: 'No se pudo obtener el precio del oro' })
}
