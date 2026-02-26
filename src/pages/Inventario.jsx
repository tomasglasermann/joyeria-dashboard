import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  Search,
  Upload,
  Package,
  DollarSign,
  Truck,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Gem,
  Image,
  Trash2,
  Camera,
  RefreshCw,
  ChevronsUpDown,
  FileText,
  Copy,
  Download,
  Eye,
  Save,
  Sparkles,
  ImagePlus,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import {
  getProductos,
  getInventarioStats,
  importarExcel,
  deleteAllProductos,
  syncPhotosToDb,
  updateProductDescriptions,
  uploadProviderPhotos,
  getProviderPhotos,
  uploadManualPhoto,
  findProductsBySkus,
} from '../lib/inventarioService'
import { extractTextFromPdf, extractTextWithPositions, renderAndCropProductPhotos, parsePdfText, detectSupplier } from '../lib/pdfParser'
import { generateDescriptionsForBatch } from '../lib/descriptionGenerator'
import defaultPhotoMap from '../data/photoMap'

const PAGE_SIZE = 50

const PROVEEDOR_COLORS = {
  'Taka': '#9B7D2E',
  'Simon Franco': '#5B8DB8',
  'Lau': '#34A853',
  'Bright Gems': '#E8453C',
  'Melee': '#8B5CF6',
  'Halef': '#F59E0B',
  'Super Gems 1': '#EC4899',
  'Super Gems 2': '#EC4899',
  'Spectrum': '#06B6D4',
  'Spectrum 2': '#06B6D4',
  'GoGreen': '#10B981',
  'Daoro': '#F97316',
}

function fmtMoney(v) {
  return '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function lookupPhoto(sku, map) {
  if (!sku) return null
  const match = map[sku]
  if (match) return match
  // Try removing trailing color suffix (W, Y, WG, YG)
  const base = sku.replace(/\s*(WG|YG|W|Y|RG)$/i, '')
  if (base !== sku && map[base]) return map[base]
  return null
}

export default function Inventario() {
  // State
  const [productos, setProductos] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroProveedor, setFiltroProveedor] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [page, setPage] = useState(1)
  const [showImport, setShowImport] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [importError, setImportError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [lightboxUrl, setLightboxUrl] = useState(null)
  const [photoMapState, setPhotoMapState] = useState(defaultPhotoMap)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [showUnmatched, setShowUnmatched] = useState(false)
  const [sortBy, setSortBy] = useState('sku')
  const [sortDir, setSortDir] = useState('asc')
  const [filterFoto, setFilterFoto] = useState('all')
  const [openFilter, setOpenFilter] = useState(null)
  const filterRef = useRef(null)

  // PDF Import state
  const [showPdfImport, setShowPdfImport] = useState(false)
  const [pdfParsing, setPdfParsing] = useState(false)
  const [pdfProducts, setPdfProducts] = useState([])
  const [pdfSupplier, setPdfSupplier] = useState('')
  const [pdfFileName, setPdfFileName] = useState('')
  const [pdfSaving, setPdfSaving] = useState(false)
  const [pdfSaveResult, setPdfSaveResult] = useState(null)
  const [copiedSku, setCopiedSku] = useState(null)
  const [showNotFoundSkus, setShowNotFoundSkus] = useState(false)
  const [aiParsing, setAiParsing] = useState(false)
  const [aiChunkProgress, setAiChunkProgress] = useState(null) // { done, total }
  const [parsedWithAI, setParsedWithAI] = useState(false)
  const [providerPhotos, setProviderPhotos] = useState({})
  const [uploadingPhotoId, setUploadingPhotoId] = useState(null)

  const getPhotoUrl = useCallback((sku) => {
    const match = lookupPhoto(sku, photoMapState)
    return match ? match.u : null
  }, [photoMapState])

  const getPhotoCategory = useCallback((sku) => {
    const match = lookupPhoto(sku, photoMapState)
    return match ? match.p : null
  }, [photoMapState])

  const totalPhotosMatched = Object.keys(photoMapState).length

  // ==========================================
  // SYNC PHOTOS HANDLER
  // ==========================================
  const handleSyncPhotos = async () => {
    setSyncing(true)
    setSyncResult(null)
    setShowUnmatched(false)

    try {
      const resp = await fetch('/api/sync-photos')
      const data = await resp.json()

      if (!data.success) throw new Error(data.error || 'Error al sincronizar')

      // Update local state
      setPhotoMapState(data.photoMap)

      // Update Supabase with foto_url for matched products
      const { updated, matchedPhotoSkus } = await syncPhotosToDb(data.photoMap)

      // Compute unmatched photos (in Drive but no product SKU in DB)
      const matchedSet = new Set(matchedPhotoSkus)
      const unmatched = Object.entries(data.photoMap)
        .filter(([sku]) => !matchedSet.has(sku))
        .map(([sku, info]) => ({ sku, url: info.u, path: info.p }))

      setSyncResult({
        totalPhotos: data.totalPhotos,
        uniqueSkus: data.uniqueSkus,
        dbUpdated: updated,
        unmatched,
      })
    } catch (err) {
      console.error('Sync error:', err)
      setSyncResult({ error: err.message })
    } finally {
      setSyncing(false)
    }
  }

  // ==========================================
  // PDF IMPORT HANDLER
  // ==========================================
  const handlePdfImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setPdfParsing(true)
    setPdfProducts([])
    setPdfSaveResult(null)
    setPdfFileName(file.name)
    setParsedWithAI(false)
    setAiChunkProgress(null)

    try {
      // Step 1: Extract text first (fast)
      const textResult = await extractTextWithPositions(file)
      const { text, pages: pdfPages, skuPositions } = textResult
      const supplier = detectSupplier(text)
      setPdfSupplier(supplier)

      let items = []

      // Step 2: AI parsing with parallel chunking
      // Split pages into chunks of 2 to avoid serverless function timeout (60s)
      // Each chunk gets its own API call running in parallel
      try {
        setAiParsing(true)
        const PAGES_PER_CHUNK = 2
        const supplierHint = supplier !== 'unknown' ? supplier : null

        if (pdfPages.length <= PAGES_PER_CHUNK) {
          // Small PDF - single request
          const resp = await fetch('/api/parse-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, supplier: supplierHint }),
          })
          if (resp.ok) {
            const data = await resp.json()
            if (data.success && data.products?.length > 0) {
              items = data.products
              setParsedWithAI(true)
              console.log(`AI parsed ${data.count} products (${data.model}, ${data.tokens?.input}+${data.tokens?.output} tokens)`)
            }
          }
        } else {
          // Large PDF - split into chunks and process in parallel
          const chunks = []
          for (let i = 0; i < pdfPages.length; i += PAGES_PER_CHUNK) {
            const chunkPages = pdfPages.slice(i, i + PAGES_PER_CHUNK)
            chunks.push(chunkPages.join('\n'))
          }

          console.log(`Splitting ${pdfPages.length} pages into ${chunks.length} chunks for parallel AI parsing`)
          setAiChunkProgress({ done: 0, total: chunks.length })

          let chunksDone = 0
          const chunkPromises = chunks.map((chunkText, idx) =>
            fetch('/api/parse-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: chunkText, supplier: supplierHint }),
            })
              .then(resp => resp.ok ? resp.json() : null)
              .then(data => {
                chunksDone++
                setAiChunkProgress({ done: chunksDone, total: chunks.length })
                if (data?.success && data.products?.length > 0) {
                  console.log(`Chunk ${idx + 1}/${chunks.length}: ${data.products.length} products`)
                  return data.products
                }
                console.warn(`Chunk ${idx + 1}/${chunks.length}: no products returned`)
                return []
              })
              .catch(err => {
                chunksDone++
                setAiChunkProgress({ done: chunksDone, total: chunks.length })
                console.warn(`Chunk ${idx + 1}/${chunks.length} failed:`, err.message)
                return []
              })
          )

          const chunkResults = await Promise.all(chunkPromises)
          const allProducts = chunkResults.flat()

          // Deduplicate by SKU (in case page boundaries split a product)
          const seen = new Set()
          items = allProducts.filter(p => {
            if (seen.has(p.sku)) return false
            seen.add(p.sku)
            return true
          })

          if (items.length > 0) {
            setParsedWithAI(true)
            console.log(`AI parsed ${items.length} total products from ${chunks.length} parallel chunks`)
          }
        }
      } catch (aiError) {
        console.warn('AI parsing failed, using local parser:', aiError.message)
      } finally {
        setAiParsing(false)
        setAiChunkProgress(null)
      }

      // Fallback to local regex parser if AI returned nothing
      if (items.length === 0) {
        items = parsePdfText(text, supplier)
        setParsedWithAI(false)
      }

      // Step 4: Render PDF pages and crop product photos
      // This uses the reliable text positions to locate each product's photo
      // by rendering the actual page and cropping the region above the SKU text
      if (items.length > 0) {
        try {
          const productSkus = items.map(p => p.sku).filter(Boolean)
          const croppedPhotos = await renderAndCropProductPhotos(file, productSkus, skuPositions)
          if (croppedPhotos.length > 0) {
            console.log(`Cropped ${croppedPhotos.length} product photos from PDF pages`)
            // Apply cropped photos to products by SKU
            for (const photo of croppedPhotos) {
              const idx = items.findIndex(p =>
                p.sku === photo.sku ||
                p.sku?.replace(/\s/g, '') === photo.sku?.replace(/\s/g, '')
              )
              if (idx >= 0) {
                items[idx] = { ...items[idx], _imageDataUrl: photo.dataUrl }
              }
            }
            const withImages = items.filter(p => p._imageDataUrl).length
            console.log(`Applied ${withImages}/${items.length} product photos`)
          }
        } catch (imgErr) {
          console.warn('Photo cropping failed:', imgErr.message)
        }
      }

      const withDescriptions = generateDescriptionsForBatch(items)
      setPdfProducts(withDescriptions)
      setShowPdfImport(true)
    } catch (err) {
      console.error('PDF parse error:', err)
      setImportError('Error al leer el PDF: ' + err.message)
    } finally {
      setPdfParsing(false)
      setAiParsing(false)
      e.target.value = ''
    }
  }

  const handleSaveDescriptions = async () => {
    if (pdfProducts.length === 0) return
    setPdfSaving(true)
    setPdfSaveResult(null)

    try {
      const result = await updateProductDescriptions(pdfProducts)

      // Upload provider photos if any products have images
      const productsWithImages = pdfProducts.filter(p => p._imageDataUrl)
      let photoResult = null
      if (productsWithImages.length > 0) {
        try {
          photoResult = await uploadProviderPhotos(productsWithImages)
          console.log(`Uploaded ${photoResult.uploaded} provider photos`)
        } catch (photoErr) {
          console.warn('Photo upload failed:', photoErr.message)
        }
      }

      setPdfSaveResult({ ...result, photosUploaded: photoResult?.uploaded || 0 })
      loadData()
    } catch (err) {
      console.error('Save descriptions error:', err)
      setPdfSaveResult({ error: err.message })
    } finally {
      setPdfSaving(false)
    }
  }

  const handleCopyDescription = (product) => {
    const text = `${product.titulo_shopify}\n\n${product.descripcion_shopify}`
    navigator.clipboard.writeText(text)
    setCopiedSku(product.sku)
    setTimeout(() => setCopiedSku(null), 2000)
  }

  // ==========================================
  // MANUAL PHOTO UPLOAD
  // ==========================================
  const handleManualPhotoUpload = async (product, file) => {
    if (!file || !product?.id) return
    if (!file.type.startsWith('image/')) return

    setUploadingPhotoId(product.id)
    try {
      const result = await uploadManualPhoto(product.id, product.sku, file)
      // Update providerPhotos state immediately so photo appears without reload
      setProviderPhotos(prev => ({ ...prev, [product.id]: result.url + '?t=' + Date.now() }))
    } catch (err) {
      console.error('Error subiendo foto:', err)
      alert('Error al subir foto: ' + err.message)
    } finally {
      setUploadingPhotoId(null)
    }
  }

  // ==========================================
  // BULK SCREENSHOT IMPORT - AI identifies & crops photos
  // ==========================================
  const [screenshotProcessing, setScreenshotProcessing] = useState(false)
  const [screenshotProgress, setScreenshotProgress] = useState(null) // { step, detail, done, total }

  const handleScreenshotImport = async (file) => {
    if (!file || !file.type.startsWith('image/')) return

    setScreenshotProcessing(true)
    setScreenshotProgress({ step: 'Preparando imagen...', detail: '', done: 0, total: 0 })

    try {
      // 1. Load original image (full resolution for cropping later)
      const originalDataUrl = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })

      const fullImg = await new Promise((resolve) => {
        const i = new window.Image()
        i.onload = () => resolve(i)
        i.src = originalDataUrl
      })

      // 2. Resize for API call (max 1500px to stay under Vercel 4.5MB body limit)
      const MAX_DIM = 1500
      let apiDataUrl = originalDataUrl
      if (fullImg.width > MAX_DIM || fullImg.height > MAX_DIM) {
        const scale = Math.min(MAX_DIM / fullImg.width, MAX_DIM / fullImg.height)
        const resizeCanvas = document.createElement('canvas')
        resizeCanvas.width = Math.round(fullImg.width * scale)
        resizeCanvas.height = Math.round(fullImg.height * scale)
        const rCtx = resizeCanvas.getContext('2d')
        rCtx.drawImage(fullImg, 0, 0, resizeCanvas.width, resizeCanvas.height)
        apiDataUrl = resizeCanvas.toDataURL('image/jpeg', 0.85)
      }

      setScreenshotProgress({ step: 'Analizando imagen con IA...', detail: `${Math.round(apiDataUrl.length / 1024)}KB`, done: 0, total: 0 })

      // 3. Send to Claude Vision to identify products & crop regions
      const resp = await fetch('/api/parse-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'identify-photos', image: apiDataUrl }),
      })

      if (!resp.ok) {
        const errText = await resp.text()
        throw new Error(`API error ${resp.status}: ${errText}`)
      }

      const result = await resp.json()
      if (!result.success || !result.products?.length) {
        alert(`No se identificaron productos. ${result.error || ''}`)
        setScreenshotProcessing(false)
        setScreenshotProgress(null)
        return
      }

      setScreenshotProgress({ step: 'Recortando y subiendo fotos...', detail: `${result.count} productos`, done: 0, total: result.products.length })

      // 4. Crop from FULL resolution image (not the resized one)
      const img = fullImg

      // 5. Find ALL matching products in DB (not just current page)
      const allSkus = result.products.map(p => p.sku)
      const dbProductMap = await findProductsBySkus(allSkus)

      let uploaded = 0
      let skipped = 0

      for (const product of result.products) {
        // Find matching product in DB
        const dbProduct = dbProductMap[product.sku]

        if (!dbProduct) {
          skipped++
          setScreenshotProgress(prev => ({ ...prev, done: uploaded + skipped, detail: `${product.sku} no encontrado` }))
          continue
        }

        // 4. Crop the photo region using canvas
        const crop = product.crop
        const sx = Math.round(img.width * crop.x_pct / 100)
        const sy = Math.round(img.height * crop.y_pct / 100)
        const sw = Math.round(img.width * crop.w_pct / 100)
        const sh = Math.round(img.height * crop.h_pct / 100)

        const canvas = document.createElement('canvas')
        const maxDim = 500
        const scale = Math.min(maxDim / sw, maxDim / sh, 1)
        canvas.width = Math.round(sw * scale)
        canvas.height = Math.round(sh * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))
        const cropFile = new File([blob], `${product.sku}.jpg`, { type: 'image/jpeg' })

        // 5. Upload using existing function
        try {
          const uploadResult = await uploadManualPhoto(dbProduct.id, dbProduct.sku, cropFile)
          setProviderPhotos(prev => ({ ...prev, [dbProduct.id]: uploadResult.url + '?t=' + Date.now() }))
          uploaded++
        } catch (err) {
          console.error(`Error uploading ${product.sku}:`, err)
          skipped++
        }

        setScreenshotProgress(prev => ({ ...prev, done: uploaded + skipped, detail: `${product.sku} ✓` }))
      }

      setScreenshotProgress({ step: 'Completado', detail: `${uploaded} fotos subidas${skipped > 0 ? `, ${skipped} omitidas` : ''}`, done: uploaded + skipped, total: result.products.length })

      // Auto-clear after 4 seconds
      setTimeout(() => {
        setScreenshotProcessing(false)
        setScreenshotProgress(null)
      }, 4000)

    } catch (err) {
      console.error('Screenshot import error:', err)
      alert('Error procesando captura: ' + err.message)
      setScreenshotProcessing(false)
      setScreenshotProgress(null)
    }
  }

  const handleExportDescriptionsCsv = () => {
    if (pdfProducts.length === 0) return
    const headers = ['SKU', 'Title', 'Description', 'Type', 'Karat', 'Color', 'Stones', 'Design', 'Cost']
    const rows = pdfProducts.map(p => [
      p.sku,
      p.titulo_shopify || '',
      (p.descripcion_shopify || '').replace(/\n/g, ' | '),
      p.tipo || '',
      p.quilates || '',
      p.color_oro || '',
      (p.piedras || []).map(s => s.tipo).join(', '),
      p.diseno || '',
      p.costo || '',
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shopify-descriptions-${pdfSupplier || 'products'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [prodResult, statsResult] = await Promise.all([
        getProductos({ search, proveedor: filtroProveedor, tipo: filtroTipo, page, pageSize: PAGE_SIZE, sortBy, sortDir, hasPhoto: filterFoto }),
        page === 1 && !search && !filtroProveedor && !filtroTipo ? getInventarioStats() : Promise.resolve(null),
      ])
      setProductos(prodResult.data || [])
      setTotalCount(prodResult.count || 0)
      if (statsResult) setStats(statsResult)

      // Load provider photos for these products
      if (prodResult.data?.length > 0) {
        const ids = prodResult.data.map(p => p.id).filter(Boolean)
        if (ids.length > 0) {
          getProviderPhotos(ids).then(photos => {
            setProviderPhotos(prev => ({ ...prev, ...photos }))
          }).catch(() => {}) // silently fail
        }
      }
    } catch (err) {
      console.error('Error loading inventario:', err)
    } finally {
      setLoading(false)
    }
  }, [search, filtroProveedor, filtroTipo, page, sortBy, sortDir, filterFoto])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Keep selectedProduct in sync when productos reload
  useEffect(() => {
    if (selectedProduct) {
      const updated = productos.find(p => p.id === selectedProduct.id)
      if (updated) setSelectedProduct(updated)
    }
  }, [productos])

  // Clipboard paste: Cmd+V to upload screenshot when modal is open
  useEffect(() => {
    if (!selectedProduct) return
    const handlePaste = (e) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            e.preventDefault()
            handleManualPhotoUpload(selectedProduct, file)
          }
          break
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [selectedProduct])

  // Sort handler
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
    setPage(1)
  }

  // Click-outside to close filter dropdown
  useEffect(() => {
    if (!openFilter) return
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openFilter])

  // Debounced search
  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Proveedores list from stats
  const proveedoresList = useMemo(() => {
    if (!stats) return []
    return Object.entries(stats.porProveedor)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([nombre, data]) => ({ nombre, ...data }))
  }, [stats])

  // Tipos list from stats
  const tiposList = useMemo(() => {
    if (!stats) return []
    return Object.entries(stats.porTipo)
      .sort((a, b) => b[1] - a[1])
      .map(([tipo, count]) => ({ tipo, count }))
  }, [stats])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // ==========================================
  // IMPORT HANDLER
  // ==========================================
  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImporting(true)
    setImportResult(null)
    setImportError(null)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(sheet)

      if (jsonData.length === 0) {
        throw new Error('El archivo está vacío')
      }

      // Map columns from QuickBooks export
      const rows = jsonData
        .filter(row => row['Product/Service Name'])
        .map(row => ({
          sku: String(row['Product/Service Name'] || '').trim(),
          costo: Number(row['Purchase Cost'] || 0),
          proveedor_nombre: String(row['Company'] || '').trim() || null,
          tag_price: Number(row['Tag Price'] || 0),
          wholesale: Number(row['Wholesale'] || 0),
          retail: Number(row['Retail'] || 0),
          piezas: Number(row['Piezas'] || 1) || 1,
        }))

      if (rows.length === 0) {
        throw new Error('No se encontraron productos válidos. Verifica que el Excel tenga la columna "Product/Service Name".')
      }

      const result = await importarExcel(rows)
      setImportResult(result)

      // Reload data
      setPage(1)
      setSearch('')
      setSearchInput('')
      setFiltroProveedor('')
      setFiltroTipo('')
      loadData()
    } catch (err) {
      console.error('Import error:', err)
      setImportError(err.message)
    } finally {
      setImporting(false)
      e.target.value = '' // reset file input
    }
  }

  // ==========================================
  // DELETE ALL HANDLER
  // ==========================================
  const handleDeleteAll = async () => {
    if (!confirm('¿Estás seguro? Esto eliminará TODOS los productos del inventario.')) return
    try {
      setLoading(true)
      await deleteAllProductos()
      setPage(1)
      loadData()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Error al eliminar: ' + err.message)
    }
  }

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="space-y-8">
      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-8"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={lightboxUrl}
              alt="Producto"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Inventario</h2>
          <p className="text-[15px] text-[#48484a] mt-1">
            {totalCount > 0
              ? `${totalCount.toLocaleString()} piezas en inventario · ${totalPhotosMatched} con foto`
              : 'Importa tu inventario para comenzar'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalCount > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-[#FF3B30] bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar
            </button>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-[#8B5CF6] bg-purple-50 hover:bg-purple-100 rounded-xl cursor-pointer transition-colors">
            <FileText className="w-4 h-4" />
            {pdfParsing ? 'Leyendo PDF...' : 'Importar PDF'}
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfImport}
              className="hidden"
              disabled={pdfParsing}
            />
          </label>
          <label className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl cursor-pointer transition-colors ${
            screenshotProcessing ? 'text-[#9B7D2E] bg-amber-100' : 'text-[#34A853] bg-green-50 hover:bg-green-100'
          }`}>
            <ImagePlus className={`w-4 h-4 ${screenshotProcessing ? 'animate-pulse' : ''}`} />
            {screenshotProcessing ? (screenshotProgress?.step || 'Procesando...') : 'Importar Fotos'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => { const f = e.target.files[0]; if (f) handleScreenshotImport(f); e.target.value = '' }}
              className="hidden"
              disabled={screenshotProcessing}
            />
          </label>
          <button
            onClick={handleSyncPhotos}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-[#06B6D4] bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar Fotos'}
          </button>
          <label className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-[#9B7D2E] hover:bg-[#876C28] rounded-xl cursor-pointer transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            Importar Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Import Status */}
      {importing && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          <p className="text-[14px] text-blue-700 font-medium">Importando inventario...</p>
        </div>
      )}

      {importResult && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-[14px] text-green-700 font-medium">
              {importResult.inserted > 0 ? `${importResult.inserted.toLocaleString()} nuevos` : ''}
              {importResult.inserted > 0 && importResult.updated > 0 ? ', ' : ''}
              {importResult.updated > 0 ? `${importResult.updated.toLocaleString()} actualizados` : ''}
              {' '}de {importResult.proveedores} proveedores
            </p>
          </div>
          <button onClick={() => setImportResult(null)} className="text-green-400 hover:text-green-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screenshot Import Progress */}
      {screenshotProcessing && screenshotProgress && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            {screenshotProgress.step === 'Completado' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
            )}
            <p className="text-[14px] text-green-700 font-medium">{screenshotProgress.step}</p>
            {screenshotProgress.detail && (
              <span className="text-[12px] text-green-500">{screenshotProgress.detail}</span>
            )}
          </div>
          {screenshotProgress.total > 0 && (
            <div className="w-full bg-green-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(screenshotProgress.done / screenshotProgress.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {importError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-[14px] text-red-700 font-medium">{importError}</p>
          </div>
          <button onClick={() => setImportError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sync Result */}
      {syncResult && !syncResult.error && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-cyan-500" />
              <p className="text-[14px] text-cyan-700 font-medium">
                {syncResult.totalPhotos} fotos encontradas · {syncResult.uniqueSkus} SKUs · {syncResult.dbUpdated} productos actualizados en la base de datos
              </p>
            </div>
            <button onClick={() => { setSyncResult(null); setShowUnmatched(false) }} className="text-cyan-400 hover:text-cyan-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {syncResult.unmatched?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-cyan-200">
              <button
                onClick={() => setShowUnmatched(!showUnmatched)}
                className="flex items-center gap-2 text-[13px] font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                {syncResult.unmatched.length} fotos sin coincidencia en inventario
                {showUnmatched
                  ? <ChevronUp className="w-4 h-4" />
                  : <ChevronDown className="w-4 h-4" />
                }
              </button>
            </div>
          )}
        </div>
      )}

      {syncResult?.error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-[14px] text-red-700 font-medium">Error al sincronizar: {syncResult.error}</p>
          </div>
          <button onClick={() => setSyncResult(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Unmatched Photos Panel */}
      {showUnmatched && syncResult?.unmatched?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f0f0f5] flex items-center justify-between">
            <div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                Fotos sin Coincidencia
              </h3>
              <p className="text-[13px] text-[#48484a] mt-0.5">
                {syncResult.unmatched.length} fotos de Google Drive que no coinciden con ningun SKU en la base de datos
              </p>
            </div>
            <button
              onClick={() => setShowUnmatched(false)}
              className="p-1.5 rounded-lg hover:bg-[#f5f5f7]"
            >
              <X className="w-4 h-4 text-[#48484a]" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {Object.entries(
              syncResult.unmatched.reduce((groups, item) => {
                const category = item.path.split('/')[0] || 'Otros'
                if (!groups[category]) groups[category] = []
                groups[category].push(item)
                return groups
              }, {})
            )
              .sort((a, b) => b[1].length - a[1].length)
              .map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold text-[#48484a] uppercase tracking-wider">
                      {category}
                    </span>
                    <span className="text-[11px] text-[#aeaeb2]">
                      ({items.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {items.map((item) => (
                      <div
                        key={item.sku}
                        className="group relative bg-[#f5f5f7] rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setLightboxUrl(item.url.replace('=s400', '=s1200'))}
                      >
                        <div className="aspect-square">
                          <img
                            src={item.url}
                            alt={item.sku}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] font-semibold text-[#1d1d1f] truncate">
                            {item.sku}
                          </p>
                          <p className="text-[10px] text-[#aeaeb2] truncate">
                            {item.path}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* PDF Import Results */}
      {showPdfImport && pdfProducts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#f0f0f5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Sparkles className="w-[18px] h-[18px] text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                    Descripciones Shopify
                  </h3>
                  <p className="text-[13px] text-[#48484a] mt-0.5">
                    {pdfProducts.length} productos extraidos de <span className="font-medium">{pdfFileName}</span>
                    {pdfSupplier !== 'unknown' && (
                      <span className="ml-1">· Proveedor: <span className="font-medium capitalize">{pdfSupplier.replace('_', ' ')}</span></span>
                    )}
                    {parsedWithAI && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-medium">
                        <Sparkles className="w-3 h-3" />
                        Parsed con IA
                      </span>
                    )}
                    {pdfProducts.filter(p => p._imageDataUrl).length > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[11px] font-medium">
                        <Camera className="w-3 h-3" />
                        {pdfProducts.filter(p => p._imageDataUrl).length} fotos
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportDescriptionsCsv}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-[#48484a] bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar CSV
                </button>
                <button
                  onClick={handleSaveDescriptions}
                  disabled={pdfSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-colors disabled:opacity-50"
                >
                  {pdfSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {pdfSaving ? 'Guardando...' : 'Guardar en Base de Datos'}
                </button>
                <button
                  onClick={() => { setShowPdfImport(false); setPdfProducts([]); setPdfSaveResult(null) }}
                  className="p-1.5 rounded-lg hover:bg-[#f5f5f7]"
                >
                  <X className="w-4 h-4 text-[#48484a]" />
                </button>
              </div>
            </div>

            {/* Save Result */}
            {pdfSaveResult && !pdfSaveResult.error && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-[13px] text-green-700 font-medium">
                    {pdfSaveResult.updated} productos actualizados
                    {pdfSaveResult.photosUploaded > 0 && (
                      <span className="ml-1 text-purple-600">· {pdfSaveResult.photosUploaded} fotos subidas</span>
                    )}
                    {pdfSaveResult.notFound > 0 && (
                      <button
                        onClick={() => setShowNotFoundSkus(!showNotFoundSkus)}
                        className="ml-1 text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 transition-colors"
                      >
                        · {pdfSaveResult.notFound} SKUs no encontrados
                        {showNotFoundSkus
                          ? <ChevronUp className="w-3.5 h-3.5 inline" />
                          : <ChevronDown className="w-3.5 h-3.5 inline" />
                        }
                      </button>
                    )}
                  </p>
                </div>
                {showNotFoundSkus && pdfSaveResult.notFoundSkus?.length > 0 && (
                  <div className="mt-2.5 pt-2.5 border-t border-green-200">
                    <p className="text-[11px] font-semibold text-amber-700 uppercase mb-2">SKUs no encontrados en inventario:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pdfSaveResult.notFoundSkus.map(sku => (
                        <span key={sku} className="text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                          {sku}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {pdfSaveResult?.error && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-[13px] text-red-700 font-medium">Error: {pdfSaveResult.error}</p>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0 bg-[#fafafa] z-10">
                <tr className="border-b border-[#f0f0f5]">
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">#</th>
                  <th className="text-center py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider w-12">Foto</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">SKU</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Titulo Shopify</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider min-w-[300px]">Descripcion Shopify</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Tipo</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Quilates</th>
                  <th className="text-right py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Costo</th>
                  <th className="text-center py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider w-16">Copiar</th>
                </tr>
              </thead>
              <tbody>
                {pdfProducts.map((p, idx) => (
                  <tr key={p.sku + idx} className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors">
                    <td className="py-3 px-4 text-[#aeaeb2]">{idx + 1}</td>
                    <td className="py-3 px-4 text-center">
                      {p._imageDataUrl ? (
                        <img
                          src={p._imageDataUrl}
                          alt={p.sku}
                          className="w-10 h-10 rounded-lg object-cover inline-block ring-1 ring-[#06B6D4]/30"
                        />
                      ) : (
                        <span className="text-[#d1d1d6]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1d1d1f]">{p.sku}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#8B5CF6]">{p.titulo_shopify}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[12px] text-[#424245] leading-relaxed whitespace-pre-line max-w-[400px]">
                        {p.descripcion_shopify}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {p.tipo && (
                        <span className="text-[11px] font-medium text-[#48484a] bg-[#f5f5f7] px-2 py-0.5 rounded-md">
                          {p.tipo}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#48484a]">{p.quilates || '—'}</td>
                    <td className="py-3 px-4 text-right font-medium text-[#1d1d1f]">{fmtMoney(p.costo)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleCopyDescription(p)}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedSku === p.sku
                            ? 'bg-green-50 text-green-500'
                            : 'hover:bg-[#f5f5f7] text-[#aeaeb2] hover:text-[#48484a]'
                        }`}
                        title="Copiar titulo + descripcion"
                      >
                        {copiedSku === p.sku ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* PDF Parsing Indicator */}
      {pdfParsing && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          <div>
            <p className="text-[14px] text-purple-700 font-medium">
              {aiParsing ? 'Analizando PDF con IA...' : 'Leyendo PDF...'}
            </p>
            {aiParsing && aiChunkProgress && (
              <p className="text-[12px] text-purple-500 mt-0.5">
                Procesando bloque {aiChunkProgress.done}/{aiChunkProgress.total} en paralelo...
              </p>
            )}
            {aiParsing && !aiChunkProgress && (
              <p className="text-[12px] text-purple-500 mt-0.5">Claude esta extrayendo los productos automaticamente</p>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF8E7] flex items-center justify-center">
                <Package className="w-[18px] h-[18px] text-[#9B7D2E]" />
              </div>
              <span className="text-[13px] font-medium text-[#48484a]">Total Piezas</span>
            </div>
            <p className="text-[24px] font-bold text-[#1d1d1f]">{stats.total.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#EDF4FB] flex items-center justify-center">
                <DollarSign className="w-[18px] h-[18px] text-[#5B8DB8]" />
              </div>
              <span className="text-[13px] font-medium text-[#48484a]">Valor Total (Costo)</span>
            </div>
            <p className="text-[24px] font-bold text-[#1d1d1f]">{fmtMoney(stats.valorTotal)}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                <Truck className="w-[18px] h-[18px] text-[#34A853]" />
              </div>
              <span className="text-[13px] font-medium text-[#48484a]">Proveedores</span>
            </div>
            <p className="text-[24px] font-bold text-[#1d1d1f]">{Object.keys(stats.porProveedor).length}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FF] flex items-center justify-center">
                <Camera className="w-[18px] h-[18px] text-[#06B6D4]" />
              </div>
              <span className="text-[13px] font-medium text-[#48484a]">Fotos Vinculadas</span>
            </div>
            <p className="text-[24px] font-bold text-[#1d1d1f]">{totalPhotosMatched}</p>
          </div>
        </div>
      )}

      {/* Distribution by Provider */}
      {stats && proveedoresList.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Distribucion por Proveedor</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {proveedoresList.map(p => (
              <button
                key={p.nombre}
                onClick={() => {
                  setFiltroProveedor(filtroProveedor === p.nombre ? '' : p.nombre)
                  setPage(1)
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  filtroProveedor === p.nombre
                    ? 'border-[#9B7D2E] bg-[#FFF8E7]'
                    : 'border-[#f0f0f5] hover:border-[#d1d1d6] bg-[#fafafa]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PROVEEDOR_COLORS[p.nombre] || '#9B7D2E' }}
                  />
                  <span className="text-[12px] font-semibold text-[#1d1d1f] truncate">{p.nombre}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-[#48484a]">{p.count} piezas</span>
                  <span className="text-[11px] font-medium text-[#9B7D2E]">{fmtMoney(p.valor)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {stats && stats.total > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
            <input
              type="text"
              placeholder="Buscar por SKU o descripcion..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-[13px] font-medium text-[#1d1d1f] bg-white rounded-xl outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 shadow-sm transition-all"
            />
          </div>
          {tiposList.length > 0 && (
            <select
              value={filtroTipo}
              onChange={(e) => { setFiltroTipo(e.target.value); setPage(1) }}
              className="px-4 py-3 text-[13px] font-medium text-[#1d1d1f] bg-white rounded-xl outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 shadow-sm appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="">Todos los tipos</option>
              {tiposList.map(t => (
                <option key={t.tipo} value={t.tipo}>{t.tipo} ({t.count})</option>
              ))}
            </select>
          )}
          {filtroProveedor && (
            <button
              onClick={() => { setFiltroProveedor(''); setPage(1) }}
              className="flex items-center gap-1.5 px-4 py-3 text-[12px] font-semibold text-[#9B7D2E] bg-[#FFF8E7] rounded-xl"
            >
              <Filter className="w-3.5 h-3.5" />
              {filtroProveedor}
              <X className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && stats && stats.total === 0 && (
        <div className="bg-white rounded-2xl p-16 shadow-sm text-center">
          <FileSpreadsheet className="w-16 h-16 text-[#d1d1d6] mx-auto mb-4" />
          <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-2">No hay productos en el inventario</h3>
          <p className="text-[14px] text-[#48484a] mb-6 max-w-md mx-auto">
            Exporta tu inventario de QuickBooks como Excel y subelo aqui para comenzar.
            El archivo debe tener las columnas: Product/Service Name, Purchase Cost, Company.
          </p>
          <label className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#9B7D2E] hover:bg-[#876C28] rounded-xl cursor-pointer transition-colors shadow-sm">
            <Upload className="w-4 h-4" />
            Subir Excel de QuickBooks
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Products Grid with Photos */}
      {productos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#f0f0f5]">
                  {/* FOTO */}
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider w-16 relative">
                    <button
                      onClick={() => setOpenFilter(openFilter === 'foto' ? null : 'foto')}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                        filterFoto !== 'all'
                          ? 'border-[#9B7D2E] bg-[#FFF8E7] text-[#9B7D2E]'
                          : 'border-transparent hover:border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#48484a]'
                      }`}
                    >
                      <span>Foto</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {openFilter === 'foto' && (
                      <div ref={filterRef} className="absolute top-full left-2 mt-1 bg-white rounded-xl shadow-lg border border-[#e5e5ea] z-50 min-w-[170px] py-1.5" onClick={(e) => e.stopPropagation()}>
                        <p className="px-3 py-1.5 text-[10px] font-bold text-[#aeaeb2] uppercase tracking-wider">Filtrar por foto</p>
                        {[
                          { value: 'all', label: 'Todos' },
                          { value: 'yes', label: 'Con foto' },
                          { value: 'no', label: 'Sin foto' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => { setFilterFoto(opt.value); setPage(1); setOpenFilter(null) }}
                            className={`w-full text-left px-3 py-2 text-[13px] transition-colors ${
                              filterFoto === opt.value
                                ? 'bg-[#FFF8E7] text-[#9B7D2E] font-semibold'
                                : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </th>

                  {/* SKU */}
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('sku')}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                        sortBy === 'sku'
                          ? 'border-[#9B7D2E] bg-[#FFF8E7] text-[#9B7D2E]'
                          : 'border-transparent hover:border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#48484a]'
                      }`}
                    >
                      <span>SKU</span>
                      {sortBy === 'sku' && sortDir === 'asc' && <ChevronUp className="w-3.5 h-3.5" />}
                      {sortBy === 'sku' && sortDir === 'desc' && <ChevronDown className="w-3.5 h-3.5" />}
                      {sortBy !== 'sku' && <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />}
                    </button>
                  </th>

                  {/* PROVEEDOR */}
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider relative">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSort('proveedor_nombre')}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                          sortBy === 'proveedor_nombre'
                            ? 'border-[#9B7D2E] bg-[#FFF8E7] text-[#9B7D2E]'
                            : 'border-transparent hover:border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#48484a]'
                        }`}
                      >
                        <span>Proveedor</span>
                        {sortBy === 'proveedor_nombre' && sortDir === 'asc' && <ChevronUp className="w-3.5 h-3.5" />}
                        {sortBy === 'proveedor_nombre' && sortDir === 'desc' && <ChevronDown className="w-3.5 h-3.5" />}
                        {sortBy !== 'proveedor_nombre' && <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />}
                      </button>
                      <button
                        onClick={() => setOpenFilter(openFilter === 'proveedor' ? null : 'proveedor')}
                        className={`p-1.5 rounded-lg border transition-all ${
                          filtroProveedor
                            ? 'border-[#9B7D2E] bg-[#FFF8E7] text-[#9B7D2E]'
                            : 'border-transparent hover:border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#86868b]'
                        }`}
                      >
                        <Filter className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {openFilter === 'proveedor' && (
                      <div ref={filterRef} className="absolute top-full left-2 mt-1 bg-white rounded-xl shadow-lg border border-[#e5e5ea] z-50 min-w-[220px] py-1.5" onClick={(e) => e.stopPropagation()}>
                        <p className="px-3 py-1.5 text-[10px] font-bold text-[#aeaeb2] uppercase tracking-wider">Filtrar por proveedor</p>
                        <div className="max-h-[260px] overflow-y-auto">
                          <button
                            onClick={() => { setFiltroProveedor(''); setPage(1); setOpenFilter(null) }}
                            className={`w-full text-left px-3 py-2 text-[13px] transition-colors ${
                              !filtroProveedor
                                ? 'bg-[#FFF8E7] text-[#9B7D2E] font-semibold'
                                : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                            }`}
                          >
                            Todos
                          </button>
                          {proveedoresList.map(p => (
                            <button
                              key={p.nombre}
                              onClick={() => { setFiltroProveedor(p.nombre); setPage(1); setOpenFilter(null) }}
                              className={`w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center gap-2 ${
                                filtroProveedor === p.nombre
                                  ? 'bg-[#FFF8E7] text-[#9B7D2E] font-semibold'
                                  : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                              }`}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: PROVEEDOR_COLORS[p.nombre] || '#9B7D2E' }}
                              />
                              {p.nombre}
                              <span className="text-[#aeaeb2] ml-auto text-[12px]">({p.count})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </th>

                  {/* COSTO */}
                  <th className="text-right py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('costo')}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ml-auto ${
                        sortBy === 'costo'
                          ? 'border-[#9B7D2E] bg-[#FFF8E7] text-[#9B7D2E]'
                          : 'border-transparent hover:border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#48484a]'
                      }`}
                    >
                      <span>Costo</span>
                      {sortBy === 'costo' && sortDir === 'asc' && <ChevronUp className="w-3.5 h-3.5" />}
                      {sortBy === 'costo' && sortDir === 'desc' && <ChevronDown className="w-3.5 h-3.5" />}
                      {sortBy !== 'costo' && <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />}
                    </button>
                  </th>

                  {/* TAG PRICE */}
                  <th className="text-right py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('tag_price')}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ml-auto ${
                        sortBy === 'tag_price'
                          ? 'border-[#9B7D2E] bg-[#FFF8E7] text-[#9B7D2E]'
                          : 'border-transparent hover:border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#48484a]'
                      }`}
                    >
                      <span>Tag Price</span>
                      {sortBy === 'tag_price' && sortDir === 'asc' && <ChevronUp className="w-3.5 h-3.5" />}
                      {sortBy === 'tag_price' && sortDir === 'desc' && <ChevronDown className="w-3.5 h-3.5" />}
                      {sortBy !== 'tag_price' && <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />}
                    </button>
                  </th>

                  {/* WHOLESALE */}
                  <th className="text-right py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('wholesale')}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ml-auto ${
                        sortBy === 'wholesale'
                          ? 'border-[#9B7D2E] bg-[#FFF8E7] text-[#9B7D2E]'
                          : 'border-transparent hover:border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#48484a]'
                      }`}
                    >
                      <span>Wholesale</span>
                      {sortBy === 'wholesale' && sortDir === 'asc' && <ChevronUp className="w-3.5 h-3.5" />}
                      {sortBy === 'wholesale' && sortDir === 'desc' && <ChevronDown className="w-3.5 h-3.5" />}
                      {sortBy !== 'wholesale' && <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />}
                    </button>
                  </th>

                  {/* RETAIL */}
                  <th className="text-right py-3 px-4 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('retail')}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all ml-auto ${
                        sortBy === 'retail'
                          ? 'border-[#9B7D2E] bg-[#FFF8E7] text-[#9B7D2E]'
                          : 'border-transparent hover:border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#48484a]'
                      }`}
                    >
                      <span>Retail</span>
                      {sortBy === 'retail' && sortDir === 'asc' && <ChevronUp className="w-3.5 h-3.5" />}
                      {sortBy === 'retail' && sortDir === 'desc' && <ChevronDown className="w-3.5 h-3.5" />}
                      {sortBy !== 'retail' && <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => {
                  const photoUrl = p.foto_url || getPhotoUrl(p.sku) || providerPhotos[p.id]
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(selectedProduct?.id === p.id ? null : p)}
                      className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] cursor-pointer transition-colors"
                    >
                      <td className="py-2 px-4">
                        {photoUrl ? (
                          <div
                            className="w-11 h-11 rounded-lg overflow-hidden bg-[#f5f5f7] cursor-zoom-in relative group"
                            onClick={(e) => { e.stopPropagation(); setLightboxUrl(photoUrl.replace('=s400', '=s1200')) }}
                          >
                            <img
                              src={photoUrl}
                              alt={p.sku}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d1d6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>' }}
                            />
                            {/* Hover overlay for re-upload */}
                            <label
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Upload className="w-3.5 h-3.5 text-white" />
                              <input type="file" accept="image/*" className="hidden"
                                onChange={(e) => { const f = e.target.files[0]; if (f) handleManualPhotoUpload(p, f); e.target.value = '' }} />
                            </label>
                          </div>
                        ) : (
                          <label
                            className="w-11 h-11 rounded-lg bg-[#f5f5f7] flex items-center justify-center cursor-pointer hover:bg-[#e8e8ed] transition-colors group"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {uploadingPhotoId === p.id ? (
                              <Loader2 className="w-4 h-4 text-[#9B7D2E] animate-spin" />
                            ) : (
                              <ImagePlus className="w-4 h-4 text-[#d1d1d6] group-hover:text-[#9B7D2E] transition-colors" />
                            )}
                            <input type="file" accept="image/*" className="hidden"
                              onChange={(e) => { const f = e.target.files[0]; if (f) handleManualPhotoUpload(p, f); e.target.value = '' }} />
                          </label>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#1d1d1f]">{p.sku}</span>
                        {p.tipo && (
                          <span className="ml-2 text-[11px] font-medium text-[#48484a] bg-[#f5f5f7] px-2 py-0.5 rounded-md">
                            {p.tipo}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: PROVEEDOR_COLORS[p.proveedor_nombre] || '#9B7D2E' }}
                          />
                          <span className="text-[#424245]">{p.proveedor_nombre || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-[#1d1d1f]">{fmtMoney(p.costo)}</td>
                      <td className="py-3 px-4 text-right text-[#48484a]">{fmtMoney(p.tag_price)}</td>
                      <td className="py-3 px-4 text-right text-[#48484a]">{fmtMoney(p.wholesale)}</td>
                      <td className="py-3 px-4 text-right text-[#48484a]">{fmtMoney(p.retail)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0f0f5]">
              <span className="text-[12px] text-[#48484a]">
                Mostrando {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalCount)} de {totalCount.toLocaleString()}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-[#f5f5f7] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 text-[12px] font-medium text-[#1d1d1f]">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-[#f5f5f7] disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (() => {
        const currentIdx = productos.findIndex(p => p.id === selectedProduct.id)
        const hasPrev = currentIdx > 0
        const hasNext = currentIdx < productos.length - 1
        const goToPrev = (e) => { e.stopPropagation(); if (hasPrev) setSelectedProduct(productos[currentIdx - 1]) }
        const goToNext = (e) => { e.stopPropagation(); if (hasNext) setSelectedProduct(productos[currentIdx + 1]) }
        return (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-6"
            onClick={() => setSelectedProduct(null)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSelectedProduct(null)
              if (e.key === 'ArrowLeft' && hasPrev) setSelectedProduct(productos[currentIdx - 1])
              if (e.key === 'ArrowRight' && hasNext) setSelectedProduct(productos[currentIdx + 1])
            }}
            tabIndex={-1}
            ref={(el) => el?.focus()}
          >
            {/* Prev Arrow */}
            <button
              onClick={goToPrev}
              disabled={!hasPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-20 disabled:cursor-default transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5 text-[#1d1d1f]" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={goToNext}
              disabled={!hasNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-20 disabled:cursor-default transition-all z-10"
            >
              <ChevronRight className="w-5 h-5 text-[#1d1d1f]" />
            </button>

            {/* Modal Card */}
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-4 border-b border-[#f0f0f5] flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{selectedProduct.sku}</h3>
                  {selectedProduct.tipo && (
                    <span className="text-[11px] font-medium text-[#48484a] bg-[#f5f5f7] px-2 py-0.5 rounded-md">
                      {selectedProduct.tipo}
                    </span>
                  )}
                  <span className="text-[12px] text-[#aeaeb2]">
                    {currentIdx + 1} / {productos.length}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-lg hover:bg-[#f5f5f7] transition-colors"
                >
                  <X className="w-4 h-4 text-[#48484a]" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex gap-6">
                  {/* Photos Column - always visible */}
                  <div className="flex flex-col gap-3 flex-shrink-0">
                    {/* Professional Photo */}
                    {(selectedProduct.foto_url || getPhotoUrl(selectedProduct.sku)) && (
                      <div>
                        <p className="text-[10px] font-semibold text-[#9B7D2E] uppercase mb-1.5 flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          Profesional
                        </p>
                        <div
                          className="w-44 h-44 rounded-2xl overflow-hidden bg-[#f5f5f7] cursor-zoom-in ring-2 ring-[#9B7D2E]/20"
                          onClick={() => setLightboxUrl((selectedProduct.foto_url || getPhotoUrl(selectedProduct.sku)).replace('=s400', '=s1200'))}
                        >
                          <img
                            src={selectedProduct.foto_url || getPhotoUrl(selectedProduct.sku)}
                            alt={selectedProduct.sku}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Provider Photo */}
                    {providerPhotos[selectedProduct.id] && (
                      <div>
                        <p className="text-[10px] font-semibold text-[#06B6D4] uppercase mb-1.5 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Proveedor
                        </p>
                        <div
                          className="w-44 h-44 rounded-2xl overflow-hidden bg-[#f5f5f7] cursor-zoom-in ring-2 ring-[#06B6D4]/20 relative group"
                          onClick={() => setLightboxUrl(providerPhotos[selectedProduct.id])}
                        >
                          <img
                            src={providerPhotos[selectedProduct.id]}
                            alt={`${selectedProduct.sku} proveedor`}
                            className="w-full h-full object-cover"
                          />
                          {/* Re-upload overlay */}
                          <label
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Upload className="w-5 h-5 text-white" />
                            <input type="file" accept="image/*" className="hidden"
                              onChange={(e) => { const f = e.target.files[0]; if (f) handleManualPhotoUpload(selectedProduct, f); e.target.value = '' }} />
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Upload Zone */}
                    <div>
                      <p className="text-[10px] font-semibold text-[#34A853] uppercase mb-1.5 flex items-center gap-1">
                        <ImagePlus className="w-3 h-3" />
                        Subir Foto
                      </p>
                      <label
                        className={`w-44 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                          uploadingPhotoId === selectedProduct.id
                            ? 'border-[#9B7D2E] bg-[#FFF8E7]'
                            : 'border-[#d1d1d6] hover:border-[#9B7D2E] hover:bg-[#FFF8E7]/50'
                        }`}
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#9B7D2E]', 'bg-[#FFF8E7]') }}
                        onDragLeave={(e) => { e.currentTarget.classList.remove('border-[#9B7D2E]', 'bg-[#FFF8E7]') }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove('border-[#9B7D2E]', 'bg-[#FFF8E7]')
                          const file = e.dataTransfer.files[0]
                          if (file) handleManualPhotoUpload(selectedProduct, file)
                        }}
                      >
                        {uploadingPhotoId === selectedProduct.id ? (
                          <Loader2 className="w-6 h-6 text-[#9B7D2E] animate-spin" />
                        ) : (
                          <>
                            <ImagePlus className="w-6 h-6 text-[#aeaeb2] mb-1.5" />
                            <span className="text-[11px] text-[#aeaeb2] font-medium">Click o arrastra</span>
                            <span className="text-[10px] text-[#d1d1d6]">JPG, PNG o Cmd+V</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => { const f = e.target.files[0]; if (f) handleManualPhotoUpload(selectedProduct, f); e.target.value = '' }} />
                      </label>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">SKU</p>
                        <p className="text-[14px] font-medium text-[#1d1d1f]">{selectedProduct.sku}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Proveedor</p>
                        <p className="text-[14px] font-medium text-[#1d1d1f]">{selectedProduct.proveedor_nombre || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Tipo</p>
                        <p className="text-[14px] font-medium text-[#1d1d1f]">{selectedProduct.tipo || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Categoria</p>
                        <p className="text-[14px] font-medium text-[#1d1d1f]">{getPhotoCategory(selectedProduct.sku) || '—'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Costo</p>
                        <p className="text-[14px] font-bold text-[#1d1d1f]">{fmtMoney(selectedProduct.costo)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Tag Price</p>
                        <p className="text-[14px] font-medium text-[#9B7D2E]">{fmtMoney(selectedProduct.tag_price)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Wholesale</p>
                        <p className="text-[14px] font-medium text-[#5B8DB8]">{fmtMoney(selectedProduct.wholesale)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Retail</p>
                        <p className="text-[14px] font-medium text-[#34A853]">{fmtMoney(selectedProduct.retail)}</p>
                      </div>

                      {selectedProduct.peso_bruto && (
                        <div>
                          <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Peso Bruto</p>
                          <p className="text-[14px] font-medium text-[#1d1d1f]">{selectedProduct.peso_bruto}g</p>
                        </div>
                      )}
                      {selectedProduct.peso_oro && (
                        <div>
                          <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-1">Peso Oro</p>
                          <p className="text-[14px] font-medium text-[#1d1d1f]">{selectedProduct.peso_oro}g</p>
                        </div>
                      )}
                    </div>

                    {/* Diamantes */}
                    {selectedProduct.diamantes && selectedProduct.diamantes.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-[#f0f0f5]">
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-3">Diamantes</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.diamantes.map((d, i) => (
                            <span key={i} className="text-[12px] font-medium text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1.5 rounded-lg">
                              {d.tipo}: {d.peso}ct
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shopify Description */}
                    {(selectedProduct.titulo_shopify || selectedProduct.descripcion_shopify) && (
                      <div className="mt-5 pt-5 border-t border-[#f0f0f5]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                            <p className="text-[11px] font-semibold text-[#8B5CF6] uppercase">Shopify</p>
                          </div>
                          <button
                            onClick={() => {
                              const text = `${selectedProduct.titulo_shopify || ''}\n\n${selectedProduct.descripcion_shopify || ''}`
                              navigator.clipboard.writeText(text)
                              setCopiedSku(selectedProduct.sku)
                              setTimeout(() => setCopiedSku(null), 2000)
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-all ${
                              copiedSku === selectedProduct.sku
                                ? 'bg-green-50 text-green-600'
                                : 'text-[#48484a] hover:bg-[#f5f5f7]'
                            }`}
                          >
                            {copiedSku === selectedProduct.sku ? (
                              <><CheckCircle2 className="w-3.5 h-3.5" /> Copiado</>
                            ) : (
                              <><Copy className="w-3.5 h-3.5" /> Copiar</>
                            )}
                          </button>
                        </div>
                        {selectedProduct.titulo_shopify && (
                          <p className="text-[15px] font-semibold text-[#1d1d1f] mb-2">{selectedProduct.titulo_shopify}</p>
                        )}
                        {selectedProduct.descripcion_shopify && (
                          <p className="text-[13px] text-[#424245] leading-relaxed whitespace-pre-line">{selectedProduct.descripcion_shopify}</p>
                        )}
                      </div>
                    )}

                    {/* Descripcion raw */}
                    {selectedProduct.descripcion && (
                      <div className="mt-5 pt-5 border-t border-[#f0f0f5]">
                        <p className="text-[11px] font-semibold text-[#48484a] uppercase mb-2">Descripcion PDF</p>
                        <p className="text-[13px] text-[#424245] leading-relaxed">{selectedProduct.descripcion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#9B7D2E] animate-spin" />
        </div>
      )}
    </div>
  )
}
