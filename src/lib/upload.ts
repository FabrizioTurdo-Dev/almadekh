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

async function heicToJpeg(file: File): Promise<File | null> {
  try {
    const heic2any = (await import('heic2any')).default
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    })

    const blob = Array.isArray(result) ? result[0] : result
    const baseName = file.name.replace(/\.heic$/i, '').replace(/\.heif$/i, '')
    return new File([blob], `${baseName || 'photo'}.jpg`, { type: 'image/jpeg' })
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
