// ==========================================
// PDF PARSER - Extract product data from supplier PDFs
// Supports: Bright Gems, Spectrum (extendable)
// ==========================================

import * as pdfjsLib from 'pdfjs-dist'

// Use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

// ==========================================
// MAIN: Extract text from PDF file
// ==========================================
export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Group items by Y position to reconstruct lines
    const byY = {}
    content.items.forEach(item => {
      if (!item.str.trim()) return
      const y = Math.round(item.transform[5])
      if (!byY[y]) byY[y] = []
      byY[y].push({ x: item.transform[4], text: item.str })
    })

    // Sort by Y descending (top to bottom), then X within each line
    const sortedYs = Object.keys(byY).map(Number).sort((a, b) => b - a)
    const lines = sortedYs.map(y =>
      byY[y].sort((a, b) => a.x - b.x).map(item => item.text).join(' ')
    )
    pages.push(lines.join('\n'))
  }

  return pages.join('\n')
}

// ==========================================
// EXTRACT IMAGES from PDF file
// Uses proper CTM (Current Transformation Matrix) tracking to get
// accurate absolute positions for each image in page coordinates.
// Returns array of { pageNum, x, y, dataUrl, width, height }
// ==========================================
export async function extractImagesFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const images = []

  // 2D affine matrix multiplication: [a,b,c,d,e,f] format
  // Computes m1 × m2
  function multiplyMatrix(m1, m2) {
    return [
      m1[0] * m2[0] + m1[2] * m2[1],
      m1[1] * m2[0] + m1[3] * m2[1],
      m1[0] * m2[2] + m1[2] * m2[3],
      m1[1] * m2[2] + m1[3] * m2[3],
      m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
      m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
    ]
  }

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const ops = await page.getOperatorList()

    // Properly track the Current Transformation Matrix (CTM)
    // PDF transforms are CUMULATIVE: each cm operation concatenates with the CTM
    // save/restore push/pop the graphics state including the CTM
    let ctm = [1, 0, 0, 1, 0, 0] // identity matrix
    const ctmStack = []

    for (let j = 0; j < ops.fnArray.length; j++) {
      const fn = ops.fnArray[j]

      // OPS.save = 10: push graphics state
      if (fn === 10) {
        ctmStack.push([...ctm])
        continue
      }

      // OPS.restore = 11: pop graphics state
      if (fn === 11) {
        ctm = ctmStack.pop() || [1, 0, 0, 1, 0, 0]
        continue
      }

      // OPS.transform = 12: concatenate matrix with CTM
      if (fn === 12) {
        ctm = multiplyMatrix(ctm, ops.argsArray[j])
        continue
      }

      // OPS.paintImageXObject = 85, OPS.paintJpegXObject = 82
      if (fn !== 85 && fn !== 82) continue

      const imgName = ops.argsArray[j][0]

      try {
        const imgData = await new Promise((resolve, reject) => {
          page.objs.get(imgName, (data) => {
            if (data) resolve(data)
            else reject(new Error('No image data'))
          })
        })

        if (!imgData) continue

        const w = imgData.width
        const h = imgData.height

        // Filter: skip logos/icons (<50px) and backgrounds (>2000px)
        if (w < 50 || h < 50 || w > 2000 || h > 2000) continue

        // The CTM now holds the ABSOLUTE position of this image
        // ctm[4] = absolute X, ctm[5] = absolute Y in page coordinates
        const x = ctm[4]
        const y = ctm[5]

        // Render image to canvas
        const canvas = document.createElement('canvas')
        const maxDim = 400
        const scale = Math.min(maxDim / w, maxDim / h, 1)
        canvas.width = Math.round(w * scale)
        canvas.height = Math.round(h * scale)
        const ctx = canvas.getContext('2d')

        if (imgData.bitmap) {
          ctx.drawImage(imgData.bitmap, 0, 0, canvas.width, canvas.height)
        } else if (imgData.data) {
          const tmpCanvas = document.createElement('canvas')
          tmpCanvas.width = w
          tmpCanvas.height = h
          const tmpCtx = tmpCanvas.getContext('2d')
          const imgDataObj = tmpCtx.createImageData(w, h)

          if (imgData.data.length === w * h * 4) {
            imgDataObj.data.set(imgData.data)
          } else if (imgData.data.length === w * h * 3) {
            for (let px = 0; px < w * h; px++) {
              imgDataObj.data[px * 4] = imgData.data[px * 3]
              imgDataObj.data[px * 4 + 1] = imgData.data[px * 3 + 1]
              imgDataObj.data[px * 4 + 2] = imgData.data[px * 3 + 2]
              imgDataObj.data[px * 4 + 3] = 255
            }
          } else if (imgData.data.length === w * h) {
            for (let px = 0; px < w * h; px++) {
              imgDataObj.data[px * 4] = imgData.data[px]
              imgDataObj.data[px * 4 + 1] = imgData.data[px]
              imgDataObj.data[px * 4 + 2] = imgData.data[px]
              imgDataObj.data[px * 4 + 3] = 255
            }
          } else {
            continue
          }

          tmpCtx.putImageData(imgDataObj, 0, 0)
          ctx.drawImage(tmpCanvas, 0, 0, canvas.width, canvas.height)
        } else {
          continue
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        if (dataUrl.length < 1000) continue

        images.push({
          pageNum: i,
          x,
          y,
          dataUrl,
          width: w,
          height: h,
        })

      } catch (err) {
        console.warn(`Could not extract image ${imgName} on page ${i}:`, err.message)
      }
    }
  }

  console.log(`Extracted ${images.length} images. Sample positions:`,
    images.slice(0, 6).map(img => `p${img.pageNum}(${Math.round(img.x)},${Math.round(img.y)})`).join(', '))

  return images
}

// ==========================================
// EXTRACT TEXT WITH SKU POSITIONS
// Returns { text, pages, skuPositions: [{sku, page, y, x}] }
// ==========================================
export async function extractTextWithPositions(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []
  const skuPositions = []

  // Common SKU patterns across suppliers
  const skuPatterns = [
    /\b(BG[\w]+(?:\s+[\w-]+)?)\b/,   // Bright Gems: BGD1428 YG-6
    /\b(S[A-Z]{1,4}-[\w]+)\b/,        // Spectrum: SEBR-45526H
    /\b([A-Z]{2,5}\d{3,}[\w-]*)\b/,   // Generic: XX#### (PA10419, PB10590, etc.)
  ]

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Group items by Y position to reconstruct lines
    const byY = {}
    content.items.forEach(item => {
      if (!item.str.trim()) return
      const y = Math.round(item.transform[5])
      if (!byY[y]) byY[y] = []
      byY[y].push({ x: item.transform[4], text: item.str })
    })

    // Extract SKU positions from INDIVIDUAL text items (preserves X position)
    // This is critical for multi-column layouts (3 products at same Y but different X)
    content.items.forEach(item => {
      if (!item.str.trim()) return
      const itemText = item.str.trim()
      const x = item.transform[4]
      const y = Math.round(item.transform[5])

      for (const pattern of skuPatterns) {
        // Use matchAll to find ALL SKUs in this text item
        const matches = [...itemText.matchAll(new RegExp(pattern, 'g'))]
        for (const match of matches) {
          const sku = match[1]
          // Avoid duplicates
          if (!skuPositions.some(sp => sp.sku === sku && sp.page === i)) {
            skuPositions.push({ sku, page: i, y, x })
          }
        }
      }
    })

    // Sort by Y descending (top to bottom), then X within each line
    const sortedYs = Object.keys(byY).map(Number).sort((a, b) => b - a)
    const lines = sortedYs.map(y =>
      byY[y].sort((a, b) => a.x - b.x).map(item => item.text).join(' ')
    )

    pages.push(lines.join('\n'))
  }

  return { text: pages.join('\n'), pages, skuPositions }
}

// ==========================================
// MATCH PRODUCT PHOTOS BY PAGE ORDER
// Instead of cropping from rendered pages (unreliable coordinate math),
// this function extracts the actual embedded images from the PDF and
// matches them to products by their sequential order on each page.
//
// Strategy:
// 1. Extract all embedded product images (extractImagesFromPdf)
// 2. Group images by page, sort in reading order (Y desc, X asc)
// 3. Group products by page using reliable text positions, sort in reading order
// 4. Match by index: image[0] → product[0], image[1] → product[1], etc.
//
// This avoids ALL coordinate conversion issues because we never need to
// convert between PDF and canvas coordinate systems.
// ==========================================
export async function renderAndCropProductPhotos(file, productSkus, skuPositions) {
  if (!productSkus.length || !skuPositions.length) return []

  // Step 1: Extract all embedded product images from the PDF
  const allImages = await extractImagesFromPdf(file)
  if (allImages.length === 0) {
    console.log('No embedded images found in PDF for photo matching')
    return []
  }

  // Step 2: Group images by page number (keep extraction order as fallback)
  const imagesByPage = {}
  for (const img of allImages) {
    if (!imagesByPage[img.pageNum]) imagesByPage[img.pageNum] = []
    imagesByPage[img.pageNum].push(img)
  }

  // Step 3: Map each product SKU to its page using reliable text positions
  const productsByPage = {}
  for (const sku of productSkus) {
    // Try exact match first
    let pos = skuPositions.find(sp =>
      sp.sku === sku || sp.sku.replace(/\s/g, '') === sku.replace(/\s/g, '')
    )
    // Try partial match
    if (!pos) {
      pos = skuPositions.find(sp => sku.includes(sp.sku) || sp.sku.includes(sku))
    }
    if (!pos) continue

    if (!productsByPage[pos.page]) productsByPage[pos.page] = []
    // Avoid duplicate SKUs on same page
    if (!productsByPage[pos.page].some(p => p.sku === sku)) {
      productsByPage[pos.page].push({ sku, x: pos.x, y: pos.y })
    }
  }

  // Step 4: Remove non-product images (logos, headers, watermarks)
  // Detect repeated images that appear on every page with identical dimensions
  const pageNums = Object.keys(imagesByPage).map(Number).sort((a, b) => a - b)
  if (pageNums.length > 1) {
    // Check if the FIRST image on every page has identical dimensions (likely a logo/header)
    const firstImgs = pageNums.map(p => imagesByPage[p]?.[0]).filter(Boolean)
    if (firstImgs.length >= pageNums.length) {
      const fw = firstImgs[0].width, fh = firstImgs[0].height
      const allSameFirst = firstImgs.every(img =>
        Math.abs(img.width - fw) < 5 && Math.abs(img.height - fh) < 5
      )
      // Only remove if it resolves a count mismatch (more images than products)
      const samplePage = pageNums[0]
      const imgCount = imagesByPage[samplePage]?.length || 0
      const prodCount = productsByPage[samplePage]?.length || 0
      if (allSameFirst && imgCount > prodCount) {
        console.log(`🔍 Removing repeated first image (${fw}x${fh}) from each page (logo/header)`)
        for (const p of pageNums) {
          if (imagesByPage[p]?.length > 0) imagesByPage[p].shift()
        }
      }
    }

    // Check if the LAST image on every page has identical dimensions (likely a footer/watermark)
    const lastImgs = pageNums.map(p => {
      const imgs = imagesByPage[p]
      return imgs?.[imgs.length - 1]
    }).filter(Boolean)
    if (lastImgs.length >= pageNums.length) {
      const lw = lastImgs[0].width, lh = lastImgs[0].height
      const allSameLast = lastImgs.every(img =>
        Math.abs(img.width - lw) < 5 && Math.abs(img.height - lh) < 5
      )
      const samplePage = pageNums[0]
      const imgCount = imagesByPage[samplePage]?.length || 0
      const prodCount = productsByPage[samplePage]?.length || 0
      if (allSameLast && imgCount > prodCount) {
        console.log(`🔍 Removing repeated last image (${lw}x${lh}) from each page (footer/watermark)`)
        for (const p of pageNums) {
          if (imagesByPage[p]?.length > 0) imagesByPage[p].pop()
        }
      }
    }
  }

  // Step 5: If still a count mismatch on pages, filter outlier-sized images
  // Product photos in catalogs tend to have similar dimensions
  for (const [page, imgs] of Object.entries(imagesByPage)) {
    const prods = productsByPage[page]
    if (!prods || imgs.length <= prods.length) continue

    // Calculate median image area
    const areas = imgs.map(img => img.width * img.height)
    const sortedAreas = [...areas].sort((a, b) => a - b)
    const medianArea = sortedAreas[Math.floor(sortedAreas.length / 2)]

    // Remove images whose area is very different from median (>4x or <0.25x)
    const filtered = imgs.filter((img, i) => {
      const area = areas[i]
      const ratio = area / medianArea
      if (ratio < 0.25 || ratio > 4) {
        console.log(`🔍 Removing outlier image on page ${page}: ${img.width}x${img.height} (ratio ${ratio.toFixed(1)} vs median)`)
        return false
      }
      return true
    })

    if (filtered.length >= prods.length) {
      imagesByPage[page] = filtered
    }
  }

  // Step 6: Sort products in reading order within each page
  // Reading order = top-to-bottom (higher Y first in PDF coords), left-to-right within same row
  for (const prods of Object.values(productsByPage)) {
    prods.sort((a, b) => {
      // Group into rows: items within 15 PDF units are same row
      if (Math.abs(a.y - b.y) > 15) return b.y - a.y  // higher Y = higher on page = comes first
      return a.x - b.x  // same row: left to right
    })
  }

  // Step 7: Sort images in reading order within each page
  // Use their coordinates for RELATIVE ordering (even if absolute values are imperfect,
  // the relative order within the same page should be preserved)
  for (const imgs of Object.values(imagesByPage)) {
    if (imgs.length <= 1) continue
    // Check if coordinates have meaningful variation (not all clustered at 0,0)
    const yRange = Math.max(...imgs.map(i => i.y)) - Math.min(...imgs.map(i => i.y))
    const xRange = Math.max(...imgs.map(i => i.x)) - Math.min(...imgs.map(i => i.x))

    if (yRange > 20 || xRange > 20) {
      // Coordinates have meaningful variation - sort in reading order
      imgs.sort((a, b) => {
        // Use larger threshold for images (they're bigger than text items)
        if (Math.abs(a.y - b.y) > 50) return b.y - a.y  // higher Y first
        return a.x - b.x  // left to right
      })
    }
    // else: coordinates are unreliable (all clustered), keep extraction order
  }

  // Step 8: Match products to images by index within each page
  const photos = []
  let totalProducts = 0
  let totalImages = 0

  for (const [page, products] of Object.entries(productsByPage)) {
    const pageImages = imagesByPage[page] || []
    totalProducts += products.length
    totalImages += pageImages.length

    console.log(`📄 Page ${page}: ${products.length} products, ${pageImages.length} images`)
    console.log(`  Products: ${products.map(p => p.sku).join(', ')}`)
    if (pageImages.length > 0) {
      console.log(`  Images: ${pageImages.map((img, i) => `#${i}(${Math.round(img.x)},${Math.round(img.y)} ${img.width}x${img.height})`).join(', ')}`)
    }

    if (products.length !== pageImages.length) {
      console.warn(`  ⚠️ Count mismatch on page ${page}: ${products.length} products vs ${pageImages.length} images`)
    }

    const count = Math.min(products.length, pageImages.length)
    for (let i = 0; i < count; i++) {
      photos.push({
        sku: products[i].sku,
        dataUrl: pageImages[i].dataUrl,
      })
    }
  }

  console.log(`✅ Matched ${photos.length} product photos (${totalProducts} products, ${totalImages} images across ${Object.keys(productsByPage).length} pages)`)
  return photos
}

// Legacy function - kept for non-catalog suppliers
export function matchImagesToProducts(products, images, skuPositions) {
  return products
}

// ==========================================
// DETECT SUPPLIER from PDF text
// ==========================================
export function detectSupplier(text) {
  const t = text.toLowerCase()
  if (t.includes('bright gems')) return 'bright_gems'
  if (t.includes('spectrum')) return 'spectrum'
  if (t.includes('simon franco')) return 'simon_franco'
  if (t.includes('taka')) return 'taka'
  if (t.includes('halef')) return 'halef'
  if (t.includes('daoro')) return 'daoro'
  if (t.includes('super gems')) return 'super_gems'
  if (t.includes('gogreen')) return 'gogreen'

  // Detect Spectrum by SKU pattern (SE*, SF*, ST* prefixes with dash)
  if (/\bSE[A-Z]{1,3}-\d/.test(text) && /Total\s*\$/.test(text) && /Gross\s*Wt/.test(text)) {
    return 'spectrum'
  }

  // Detect Halef by catalog pattern (Stock No + Model + Gram + 14K + adt.)
  if (/Stock No:/.test(text) && /Model:/.test(text) && /Gram\s*:/.test(text) && /\badt\./.test(text)) {
    return 'halef'
  }

  return 'unknown'
}

// ==========================================
// EXTRACT structured data from description text
// ==========================================
function extractFromDescription(desc) {
  const upper = desc.toUpperCase()

  // Quilates
  let quilates = null
  const ktMatch = upper.match(/(\d+)\s*K(?:T|ARAT)?/i)
  if (ktMatch) quilates = ktMatch[1] + 'KT'

  // Color oro
  let color_oro = null
  if (/\bYELLOW\s*GOLD\b/i.test(upper) || /\bYG\b/.test(upper)) color_oro = 'Yellow Gold'
  else if (/\bWHITE\s*GOLD\b/i.test(upper) || /\bWG\b/.test(upper)) color_oro = 'White Gold'
  else if (/\bROSE\s*GOLD\b/i.test(upper) || /\bRG\b/.test(upper)) color_oro = 'Rose Gold'
  else if (/\bTRI\s*COLOR\b/i.test(upper) || /\b3\s*TONE\b/i.test(upper) || /\bTRI\b/.test(upper)) color_oro = 'Tri-Color'
  else if (/\bTWO\s*TONE\b/i.test(upper)) color_oro = 'Two-Tone'
  else if (/\bGOLD\b/i.test(upper)) color_oro = 'Gold'

  // Tipo de pieza
  let tipo = null
  if (/\bRING\b/i.test(upper) || /\bBAND\b/i.test(upper)) tipo = 'Ring'
  else if (/\bEARRING/i.test(upper) || /\bEARING/i.test(upper) || /\bSTUDS?\b/i.test(upper) || /\bHUGGI/i.test(upper) || /\bHOOP\b/i.test(upper)) tipo = 'Earring'
  else if (/\bPENDANT\b/i.test(upper)) tipo = 'Pendant'
  else if (/\bNECKLACE\b/i.test(upper) || /\bCHAIN\b/i.test(upper) && /\bNECK/i.test(upper)) tipo = 'Necklace'
  else if (/\bBRACELET\b/i.test(upper) || /\bHAND\s*CHAIN\b/i.test(upper)) tipo = 'Bracelet'
  else if (/\bCHOKER\b/i.test(upper)) tipo = 'Choker'

  // Piedras
  const piedras = []
  if (/\bDIAMOND/i.test(upper)) piedras.push({ tipo: 'Diamond' })
  if (/\bRUBY\b/i.test(upper) || /\bRB\b/.test(upper)) piedras.push({ tipo: 'Ruby' })
  if (/\bEMERALD\b/i.test(upper) || /\bEM\b/.test(upper)) piedras.push({ tipo: 'Emerald' })
  if (/\bSAPPHIRE\b/i.test(upper) || /\bSP\b/.test(upper)) piedras.push({ tipo: 'Sapphire' })
  if (/\bBLUE\s*SAPPHIRE\b/i.test(upper) || /\bBSP\b/.test(upper) || /\bBS\b/.test(upper)) {
    // Replace generic sapphire with blue sapphire
    const idx = piedras.findIndex(p => p.tipo === 'Sapphire')
    if (idx >= 0) piedras[idx].tipo = 'Blue Sapphire'
    else piedras.push({ tipo: 'Blue Sapphire' })
  }
  if (/\bPINK\s*SAPPHIRE\b/i.test(upper)) {
    const idx = piedras.findIndex(p => p.tipo === 'Sapphire')
    if (idx >= 0) piedras[idx].tipo = 'Pink Sapphire'
    else piedras.push({ tipo: 'Pink Sapphire' })
  }

  // Diseño
  let diseno = null
  if (/\bBUTTERFLY\b/i.test(upper)) diseno = 'Butterfly'
  else if (/\bSNAKE\b/i.test(upper)) diseno = 'Snake'
  else if (/\bHEART\b/i.test(upper)) diseno = 'Heart'
  else if (/\bFLOWER\b/i.test(upper) || /\bCLOVER\b/i.test(upper)) diseno = 'Flower'
  else if (/\bBOW\b/i.test(upper)) diseno = 'Bow'
  else if (/\bFEATHER\b/i.test(upper)) diseno = 'Feather'
  else if (/\bDRAGONFLY\b/i.test(upper)) diseno = 'Dragonfly'
  else if (/\bSTARFISH\b/i.test(upper)) diseno = 'Starfish'
  else if (/\bMOON\b/i.test(upper)) diseno = 'Moon'
  else if (/\bSTAR\b/i.test(upper)) diseno = 'Star'
  else if (/\bARROW\b/i.test(upper)) diseno = 'Arrow'
  else if (/\bLEAF\b/i.test(upper)) diseno = 'Leaf'
  else if (/\bTENNIS\b/i.test(upper)) diseno = 'Tennis'
  else if (/\bOVAL\b/i.test(upper)) diseno = 'Oval'
  else if (/\bPEAR\b/i.test(upper)) diseno = 'Pear'
  else if (/\bPEACOCK\b/i.test(upper)) diseno = 'Peacock'
  else if (/\bEVIL\s*EYE\b/i.test(upper)) diseno = 'Evil Eye'
  else if (/\bCROSS\b/i.test(upper)) diseno = 'Cross'
  else if (/\bZIGZAG\b/i.test(upper) || /\bBAGUETTE\b/i.test(upper)) diseno = 'Baguette'
  else if (/\bETERN/i.test(upper)) diseno = 'Eternity'
  else if (/\bBEZEL\b/i.test(upper)) diseno = 'Bezel'

  return { quilates, color_oro, tipo, piedras, diseno }
}

// ==========================================
// BRIGHT GEMS PARSER
// ==========================================
export function parseBrightGems(text) {
  const items = []
  const lines = text.split('\n').join(' ').split(/(?=\d+\s+(?:[A-Z\d]|BGLR|BGD|BGR|BGP|BGER|BGVE|BGVN|BGBR|BGNK|BG\s))/g)

  // More reliable: find product patterns
  // Pattern: description on one part, SKU on next, then qty, rates, amount
  // Let's use regex to find SKU patterns typical for Bright Gems
  const fullText = text.split('\n').join(' ')

  // Find all SKU-like patterns for Bright Gems: BG*, then description before it
  const skuPattern = /(?:^|\n|×\s*\d+\s+\$[\d,.]+\s+\$[\d,.]+\s+\$[\d,.]+\s+)(\d+)\s+([\w\s,.'()-]+?)\s*(BG[\w]+(?:\s*[\w-]+)?)\s*×\s*(\d+)/g

  // Simpler approach: split by line numbers and extract
  // The PDF text has patterns like:
  // "1 14KT YELLOW GOLD TENNIS DIAMOND RING - Yellow Gold / 6 BGD1428 YG-6 × 1 $594.00 $450.00 $450.00"

  // Let's try to match each product entry
  const productPattern = /(\d{1,3})\s+(.*?)\s+(BG[\w]+[\w\s-]*?)\s*×\s*(\d+)\s+\$?([\d,.]+)\s+\$?([\d,.]+)\s+\$?([\d,.]+)/g

  let match
  const allText = text.replace(/\n/g, ' ')

  while ((match = productPattern.exec(allText)) !== null) {
    const lineNum = parseInt(match[1])
    const descripcion_raw = match[2].trim()
    const sku = match[3].trim()
    const cantidad = parseInt(match[4])
    const precioOriginal = parseFloat(match[5].replace(',', ''))
    const precioDescuento = parseFloat(match[6].replace(',', ''))
    const total = parseFloat(match[7].replace(',', ''))

    // Skip if line number is unreasonably high (might be part of address/phone)
    if (lineNum > 200) continue

    // Extract structured data from description
    const extracted = extractFromDescription(descripcion_raw)

    items.push({
      sku,
      descripcion_raw,
      tipo: extracted.tipo,
      quilates: extracted.quilates,
      color_oro: extracted.color_oro,
      piedras: extracted.piedras,
      diseno: extracted.diseno,
      costo: precioDescuento,
      cantidad,
      proveedor: 'Bright Gems',
    })
  }

  // Also try simpler pattern for items without full pricing (lines 102-121 in the PDF)
  const simplePattern = /(\d{1,3})\s+(BG[\w\s]+?)\s+([\w\s,.'()-]+?)×\s*(\d+)\s+\$?([\d,.]+)\s+\$?([\d,.]+)/g
  while ((match = simplePattern.exec(allText)) !== null) {
    const sku = match[2].trim()
    // Check if this SKU was already found
    if (items.some(i => i.sku === sku)) continue

    const descripcion_raw = match[3].trim()
    const cantidad = parseInt(match[4])
    const precio = parseFloat(match[5].replace(',', ''))

    const extracted = extractFromDescription(descripcion_raw)

    items.push({
      sku,
      descripcion_raw,
      tipo: extracted.tipo,
      quilates: extracted.quilates,
      color_oro: extracted.color_oro,
      piedras: extracted.piedras,
      diseno: extracted.diseno,
      costo: precio,
      cantidad,
      proveedor: 'Bright Gems',
    })
  }

  return items
}

// ==========================================
// SPECTRUM PARSER
// 2-column PDF layout. Each product has a detail block, then SKU line.
// Strategy: collect all tokens (SKUs, Totals, Gross Wt, Gold, stones)
// in order, then pair them by index.
// ==========================================
export function parseSpectrum(text) {
  const allText = text.replace(/\n/g, ' ')

  // Step 1: Find ALL SKU entries in order
  // Match: SKU - PRICE optionally followed by KT Type
  const skuRegex = /(S[A-Z]{1,4}-[\w]+)\s*-\s*([\d,.]+)(?:\s+(\d+KT)\s+(\w+))?/g
  const skuEntries = []
  let m
  while ((m = skuRegex.exec(allText)) !== null) {
    skuEntries.push({
      sku: m[1],
      listPrice: parseFloat(m[2].replace(',', '')),
      quilates: m[3] || null,
      tipo: m[4] || null,
      idx: m.index,
    })
  }

  // For SKUs without type, look backwards in the text for "NNkKT Type"
  for (const entry of skuEntries) {
    if (!entry.quilates) {
      const before = allText.substring(Math.max(0, entry.idx - 60), entry.idx)
      // Find the LAST "karat type" before this SKU
      const typeMatches = [...before.matchAll(/(\d+KT)\s+(\w+)/g)]
      if (typeMatches.length > 0) {
        const last = typeMatches[typeMatches.length - 1]
        entry.quilates = last[1]
        entry.tipo = last[2]
      }
    }
  }

  // Step 2: Find ALL "Total $ AMOUNT" values in order
  const totals = []
  const totalRegex = /Total\s*\$\s*([\d,.]+)/g
  while ((m = totalRegex.exec(allText)) !== null) {
    totals.push({ amount: parseFloat(m[1].replace(',', '')), idx: m.index })
  }

  // Step 3: Find ALL Gross Wt values in order
  const grossWts = []
  const grossRegex = /Gross\s*Wt\s+([\d.]+)/g
  while ((m = grossRegex.exec(allText)) !== null) {
    grossWts.push({ value: parseFloat(m[1]), idx: m.index })
  }

  // Step 4: Find ALL Gold weight values in order
  const goldWts = []
  const goldRegex = /Gold\s+([\d.]+)/g
  while ((m = goldRegex.exec(allText)) !== null) {
    goldWts.push({ value: parseFloat(m[1]), idx: m.index })
  }

  // Step 5: Find ALL stone entries grouped into blocks
  // Stones appear between "Details" and "Total" for each product
  // We group stones by finding them between consecutive Total markers
  const stoneRegex = /(DIA|EME|RUB|SAP)\s+[\w]+\s+([\d.]+)/g
  const allStones = []
  while ((m = stoneRegex.exec(allText)) !== null) {
    let stoneType = 'Diamond'
    if (m[1] === 'EME') stoneType = 'Emerald'
    else if (m[1] === 'RUB') stoneType = 'Ruby'
    else if (m[1] === 'SAP') stoneType = 'Sapphire'
    allStones.push({ tipo: stoneType, peso: parseFloat(m[2]), idx: m.index })
  }

  // Step 6: Pair by index - in the 2-column layout, tokens appear in reading order
  // Total[0] → SKU[0], Total[1] → SKU[1], etc.
  const items = []

  for (let i = 0; i < skuEntries.length; i++) {
    const entry = skuEntries[i]

    const myTotal = totals[i] || null
    const myGross = grossWts[i] || null
    const myGold = goldWts[i] || null

    // For stones, group them between consecutive Total markers
    const stoneStart = i > 0 && totals[i - 1] ? totals[i - 1].idx : 0
    const stoneEnd = myTotal ? myTotal.idx + 20 : entry.idx
    const myStones = allStones.filter(s => s.idx > stoneStart && s.idx < stoneEnd)

    // Merge stones of same type (sum weights)
    const merged = {}
    myStones.forEach(s => {
      if (!merged[s.tipo]) merged[s.tipo] = { tipo: s.tipo, peso: 0 }
      merged[s.tipo].peso += s.peso
    })
    const piedras = Object.values(merged).map(p => ({ ...p, peso: Math.round(p.peso * 100) / 100 }))

    const stoneDesc = piedras.length > 0 ? piedras.map(p => p.tipo).join(' & ') + ' ' : ''
    const descripcion_raw = `${entry.quilates || ''} ${stoneDesc}${entry.tipo || ''}`.trim()

    items.push({
      sku: entry.sku,
      descripcion_raw,
      costo: myTotal ? myTotal.amount : entry.listPrice,
      quilates: entry.quilates,
      tipo: entry.tipo,
      color_oro: null,
      piedras,
      diseno: null,
      peso_bruto: myGross ? myGross.value : null,
      peso_oro: myGold ? myGold.value : null,
      cantidad: 1,
      proveedor: 'Spectrum',
    })
  }

  return items
}

// ==========================================
// GENERIC PARSER - Try to extract SKUs and descriptions from any PDF
// ==========================================
export function parseGeneric(text) {
  const items = []
  const allText = text.replace(/\n/g, ' ')

  // Try to find any SKU-like patterns followed by descriptions
  // This is a best-effort parser for unknown formats
  const genericPattern = /([A-Z]{2,}[\w-]+(?:\s+[A-Z]{1,3})?)\s+.*?×\s*(\d+)\s+\$?([\d,.]+)/g

  let match
  while ((match = genericPattern.exec(allText)) !== null) {
    const sku = match[1].trim()
    const cantidad = parseInt(match[2])
    const precio = parseFloat(match[3].replace(',', ''))

    items.push({
      sku,
      descripcion_raw: '',
      tipo: null,
      quilates: null,
      color_oro: null,
      piedras: [],
      diseno: null,
      costo: precio,
      cantidad,
      proveedor: 'Unknown',
    })
  }

  return items
}

// ==========================================
// MAIN PARSE FUNCTION
// ==========================================
export function parsePdfText(text, supplier = null) {
  const detectedSupplier = supplier || detectSupplier(text)

  switch (detectedSupplier) {
    case 'bright_gems':
      return parseBrightGems(text)
    case 'spectrum':
      return parseSpectrum(text)
    default:
      return parseGeneric(text)
  }
}
