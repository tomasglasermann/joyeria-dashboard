// Serverless function: Crawl Google Drive public folders and return photo map
// Called from the dashboard to sync photos with inventory SKUs

const MAIN_FOLDER_ID = '1zBvAMvaAvlIyel3ve8SKHhzJfK6r5hTo'

async function getFolderContents(folderId, folderName = 'root') {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}`
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const html = await resp.text()

    const folders = []
    const files = []

    // Parse entries: id="entry-FILE_ID" ... class="flip-entry-title">NAME<
    const entryRegex = /id="entry-([A-Za-z0-9_-]+)"([\s\S]*?)class="flip-entry-title"[^>]*>([^<]+)</g
    let match

    while ((match = entryRegex.exec(html)) !== null) {
      const fileId = match[1]
      const section = match[2]
      const name = match[3].trim()

      if (name === '.DS_Store') continue

      const isFolder = section.includes('drive-sprite-folder')

      if (isFolder) {
        folders.push({ id: fileId, name, path: folderName })
      } else {
        // Remove extension for SKU
        const sku = name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
        files.push({
          id: fileId,
          filename: name,
          sku,
          path: folderName,
          url: `https://lh3.googleusercontent.com/d/${fileId}=s400`
        })
      }
    }

    return { folders, files }
  } catch (err) {
    console.error(`Error fetching ${folderName}:`, err.message)
    return { folders: [], files: [] }
  }
}

async function crawlAllFolders() {
  const allFiles = []

  // Get main folder
  const main = await getFolderContents(MAIN_FOLDER_ID, 'root')

  for (const folder of main.folders) {
    // Level 1: Category (Bracelet, Ring, etc.)
    const level1 = await getFolderContents(folder.id, folder.name)
    allFiles.push(...level1.files)

    for (const sub of level1.folders) {
      // Level 2: Color (White, Yellow, Rose)
      const path2 = `${folder.name}/${sub.name}`
      const level2 = await getFolderContents(sub.id, path2)
      allFiles.push(...level2.files)

      for (const deep of level2.folders) {
        // Level 3: Gemstone (Diamond, Emerald, Ruby, Sapphire)
        const path3 = `${path2}/${deep.name}`
        const level3 = await getFolderContents(deep.id, path3)
        allFiles.push(...level3.files)
      }
    }
  }

  return allFiles
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  try {
    console.log('Starting Google Drive photo sync...')
    const photos = await crawlAllFolders()

    // Build SKU → photo map
    const photoMap = {}
    for (const photo of photos) {
      const skuClean = photo.sku.split(' - ')[0].trim()
      if (!photoMap[skuClean]) {
        photoMap[skuClean] = {
          u: photo.url,
          p: photo.path
        }
      }
    }

    console.log(`Sync complete: ${photos.length} photos, ${Object.keys(photoMap).length} unique SKUs`)

    return res.status(200).json({
      success: true,
      totalPhotos: photos.length,
      uniqueSkus: Object.keys(photoMap).length,
      photoMap
    })
  } catch (err) {
    console.error('Sync error:', err)
    return res.status(500).json({
      success: false,
      error: err.message
    })
  }
}
