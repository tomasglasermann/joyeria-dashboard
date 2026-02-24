import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// ─── Brand Colors (RGB) ───
const GOLD = [155, 125, 46]
const TEXT_PRIMARY = [29, 29, 31]
const TEXT_SECONDARY = [72, 72, 74]
const BG_LIGHT = [245, 245, 247]
const ROW_ALT = [249, 249, 251]

// ─── Logo Cache ───
let cachedLogo = null

export async function loadLogoAsBase64() {
  if (cachedLogo) return cachedLogo
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        canvas.getContext('2d').drawImage(img, 0, 0)
        cachedLogo = canvas.toDataURL('image/png')
        resolve(cachedLogo)
      } catch (e) {
        console.warn('Logo conversion failed:', e)
        resolve(null)
      }
    }
    img.onerror = () => {
      console.warn('Logo failed to load')
      resolve(null)
    }
    img.src = '/logo-vicenza.png'
  })
}

// ─── Create PDF Document ───
export function createPDFDocument(orientation = 'portrait') {
  return new jsPDF({ orientation, unit: 'mm', format: 'a4' })
}

// ─── Header with Logo ───
export function addHeader(doc, logoBase64, reportTitle, subtitle, dateString) {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Logo
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 8, 22, 22)
    } catch (e) {
      // Fallback if logo fails
    }
  }

  // Brand name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...GOLD)
  doc.text('VICENZA MIAMI', 40, 17)

  // Report title
  doc.setFontSize(11)
  doc.setTextColor(...TEXT_SECONDARY)
  doc.text(reportTitle, 40, 24)

  // Date right-aligned
  doc.setFontSize(10)
  doc.setTextColor(...TEXT_SECONDARY)
  doc.text(dateString, pageWidth - 14, 17, { align: 'right' })

  // Subtitle right-aligned
  if (subtitle) {
    doc.setFontSize(9)
    doc.text(subtitle, pageWidth - 14, 23, { align: 'right' })
  }

  // Gold divider line
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.6)
  doc.line(14, 32, pageWidth - 14, 32)

  return 38
}

// ─── Footer on all pages ───
export function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Confidencial - Vicenza Miami', 14, pageHeight - 10)

    doc.setFont('helvetica', 'normal')
    doc.text('Pagina ' + i + ' de ' + pageCount, pageWidth - 14, pageHeight - 10, { align: 'right' })
  }
}

// ─── Section Title ───
export function addSectionTitle(doc, title, yPos) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  if (yPos > pageHeight - 35) {
    doc.addPage()
    yPos = 20
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...GOLD)
  doc.text(title, 14, yPos)

  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.3)
  doc.line(14, yPos + 1.5, pageWidth - 14, yPos + 1.5)

  return yPos + 7
}

// ─── KPI Summary Boxes ───
export function addKPIBoxes(doc, kpis, yPos) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  const gap = 4
  const boxCount = kpis.length
  const totalWidth = pageWidth - 2 * margin
  const boxWidth = (totalWidth - (boxCount - 1) * gap) / boxCount
  const boxHeight = 18

  kpis.forEach((kpi, i) => {
    const x = margin + i * (boxWidth + gap)

    // Background
    doc.setFillColor(...BG_LIGHT)
    doc.roundedRect(x, yPos, boxWidth, boxHeight, 2, 2, 'F')

    // Gold accent bar
    doc.setFillColor(...GOLD)
    doc.rect(x, yPos + 3, 1.2, boxHeight - 6, 'F')

    // Label
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...TEXT_SECONDARY)
    doc.text(kpi.label, x + 5, yPos + 6)

    // Value
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...TEXT_PRIMARY)
    doc.text(String(kpi.value), x + 5, yPos + 13)

    // Subtext
    if (kpi.subtext) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(150, 150, 150)
      doc.text(kpi.subtext, x + 5, yPos + 17)
    }
  })

  return yPos + boxHeight + 5
}

// ─── Styled Table (autoTable wrapper) ───
export function addStyledTable(doc, columns, rows, startY, options = {}) {
  const pageHeight = doc.internal.pageSize.getHeight()

  if (startY > pageHeight - 35) {
    doc.addPage()
    startY = 20
  }

  // Ensure all cell values are strings
  const safeRows = rows.map(row => row.map(cell => String(cell ?? '')))

  autoTable(doc, {
    startY,
    head: [columns],
    body: safeRows,
    margin: { left: 14, right: 14, bottom: 20 },
    styles: {
      font: 'helvetica',
      fontSize: options.fontSize || 7.5,
      cellPadding: 2,
      textColor: TEXT_PRIMARY,
      lineColor: [230, 230, 230],
      lineWidth: 0.1,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: GOLD,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: options.headerFontSize || 7.5,
    },
    alternateRowStyles: {
      fillColor: ROW_ALT,
    },
    columnStyles: options.columnStyles || {},
    foot: options.footRow ? [options.footRow.map(c => String(c ?? ''))] : undefined,
    footStyles: {
      fillColor: [235, 235, 235],
      textColor: TEXT_PRIMARY,
      fontStyle: 'bold',
      fontSize: options.fontSize || 7.5,
    },
    showHead: 'everyPage',
    ...(options.autoTableOverrides || {}),
  })

  return doc.lastAutoTable.finalY + 6
}

// ─── Format helpers ───
export function fmtMoney(n) {
  return '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// ─── Save/Download ───
export function savePDF(doc, filename) {
  doc.save(filename)
}
