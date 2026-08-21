import { supabase } from './supabase'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
const HEIC_EXTENSIONS = ['heic', 'heif']
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_HEIC_FILE_SIZE = 10 * 1024 * 1024
const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.85

/**
 * Deteccion barata por tipo MIME y extension. Cuando da `false` todavia hay
 * que probar `isHeicByMagicBytes`: iOS a veces entrega el archivo sin tipo y
 * con extension `.jpg`.
 */
function isHeic(file: File): boolean {
  if (file.type === 'image/heic' || file.type === 'image/heif') return true
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  return HEIC_EXTENSIONS.includes(ext)
}

async function isHeicByMagicBytes(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, 12)
    const buf = await slice.arrayBuffer()
    const view = new Uint8Array(buf)
    // "ftyp" at offset 4, then "heic", "heix", "mif1", "msf1", "hevc"
    if (view[4] === 0x66 && view[5] === 0x74 && view[6] === 0x79 && view[7] === 0x70) {
      const brand = String.fromCharCode(view[8], view[9], view[10], view[11])
      return ['heic', 'heix', 'mif1', 'msf1', 'hevc'].includes(brand)
    }
    return false
  } catch {
    return false
  }
}

function resizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
        resolve(file)
        return
      }
      if (width > height) {
        height = Math.round((height / width) * MAX_DIMENSION)
        width = MAX_DIMENSION
      } else {
        width = Math.round((width / height) * MAX_DIMENSION)
        height = MAX_DIMENSION
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (!blob) { resolve(file); return }
        const ext = file.type === 'image/png' ? 'png' : 'jpg'
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, `.${ext}`), { type: mime }))
      }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', JPEG_QUALITY)
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

interface HeicDecodeResult {
  width: number
  height: number
  data: ArrayBuffer
}

let heicWorker: Worker | null = null
let heicRequestId = 0
let heicIdleTimer: ReturnType<typeof setTimeout> | null = null

/** Cuanto sigue vivo el worker despues de la ultima conversion. */
const HEIC_IDLE_MS = 30_000

function getHeicWorker(): Worker {
  if (heicIdleTimer) {
    clearTimeout(heicIdleTimer)
    heicIdleTimer = null
  }
  if (!heicWorker) {
    heicWorker = new Worker(new URL('./heic-worker.ts', import.meta.url), {
      type: 'module',
    })
  }
  return heicWorker
}

/**
 * El worker carga ~2MB de libheif. Conviene reusarlo entre fotos seguidas
 * (subir varias de una es lo normal), pero antes quedaba residente el resto
 * de la sesion: aca se libera cuando pasa un rato sin usarse.
 */
function scheduleHeicWorkerRelease() {
  if (heicIdleTimer) clearTimeout(heicIdleTimer)
  heicIdleTimer = setTimeout(() => {
    heicWorker?.terminate()
    heicWorker = null
    heicIdleTimer = null
  }, HEIC_IDLE_MS)
}

function decodeHeic(buffer: ArrayBuffer): Promise<HeicDecodeResult | null> {
  return new Promise((resolve) => {
    const worker = getHeicWorker()
    const id = ++heicRequestId

    const onMessage = (event: MessageEvent) => {
      const message = event.data as { id: number; error?: string } & HeicDecodeResult
      if (!message || message.id !== id) return
      worker.removeEventListener('message', onMessage)
      scheduleHeicWorkerRelease()
      if (message.error) {
        console.error('HEIC conversion error:', message.error)
        resolve(null)
        return
      }
      resolve(message)
    }

    worker.addEventListener('message', onMessage)
    worker.postMessage({ id, buffer }, [buffer])
  })
}

function heicDataToJpeg(
  result: HeicDecodeResult,
  baseName: string
): Promise<File | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = result.width
    canvas.height = result.height
    const context = canvas.getContext('2d')
    if (!context) {
      resolve(null)
      return
    }
    const imageData = new ImageData(
      new Uint8ClampedArray(result.data),
      result.width,
      result.height
    )
    context.putImageData(imageData, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null)
        return
      }
      resolve(new File([blob], `${baseName || 'photo'}.jpg`, { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.92)
  })
}

async function heicToJpeg(file: File): Promise<File | null> {
  try {
    const buffer = await file.arrayBuffer()
    const result = await decodeHeic(buffer)
    if (!result) return null
    const baseName = file.name.replace(/\.heic$/i, '').replace(/\.heif$/i, '')
    return heicDataToJpeg(result, baseName)
  } catch (error) {
    console.error('HEIC conversion error:', error)
    return null
  }
}

export async function uploadImage(
  file: File,
  folder: 'menu' | 'events' = 'menu',
  onProgress?: (step: string) => void
): Promise<string | null> {
  const heicDetected = isHeic(file) || await isHeicByMagicBytes(file)

  if (heicDetected) {
    onProgress?.('Convirtiendo HEIC...')
    if (file.size > MAX_HEIC_FILE_SIZE) {
      console.error('Upload error: HEIC file too large', file.size)
      return null
    }
    const jpeg = await heicToJpeg(file)
    if (!jpeg) return null
    file = jpeg
  }

  onProgress?.('Redimensionando...')
  file = await resizeImage(file)

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    console.error('Upload error: Invalid file type', file.type)
    return null
  }

  if (file.size > MAX_FILE_SIZE) {
    console.error('Upload error: File too large after resize', file.size)
    return null
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    console.error('Upload error: Invalid extension', ext)
    return null
  }

  onProgress?.('Subiendo imagen...')
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { data, error } = await supabase.storage
    .from('almadekh')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('almadekh')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}
