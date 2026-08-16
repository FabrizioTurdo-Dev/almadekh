import { supabase } from './supabase'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
const HEIC_EXTENSIONS = ['heic', 'heif']
const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_HEIC_FILE_SIZE = 10 * 1024 * 1024

function isHeic(file: File): boolean {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    HEIC_EXTENSIONS.includes(file.name.split('.').pop()?.toLowerCase() || '')
  )
}

interface HeicDecodeResult {
  width: number
  height: number
  data: ArrayBuffer
}

let heicWorker: Worker | null = null
let heicRequestId = 0

function getHeicWorker(): Worker {
  if (!heicWorker) {
    heicWorker = new Worker(new URL('./heic-worker.ts', import.meta.url), {
      type: 'module',
    })
  }
  return heicWorker
}

function decodeHeic(buffer: ArrayBuffer): Promise<HeicDecodeResult | null> {
  return new Promise((resolve) => {
    const worker = getHeicWorker()
    const id = ++heicRequestId

    const onMessage = (event: MessageEvent) => {
      const message = event.data as { id: number; error?: string } & HeicDecodeResult
      if (!message || message.id !== id) return
      worker.removeEventListener('message', onMessage)
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
  folder: 'menu' | 'events' = 'menu'
): Promise<string | null> {
  if (isHeic(file)) {
    if (file.size > MAX_HEIC_FILE_SIZE) {
      console.error('Upload error: File too large', file.size)
      return null
    }

    const jpeg = await heicToJpeg(file)
    if (!jpeg) return null
    file = jpeg
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    console.error('Upload error: Invalid file type', file.type)
    return null
  }

  if (file.size > MAX_FILE_SIZE) {
    console.error('Upload error: File too large', file.size)
    return null
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    console.error('Upload error: Invalid extension', ext)
    return null
  }

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
