const params = new URLSearchParams(location.search)
const fileName = params.get('file') || 'IMG_4295.HEIC'

window.__RESULT__ = JSON.stringify({ ok: false, error: 'not-run' })

async function decodeWithLibheif(buffer) {
  const raw = window.module.exports
  const libheif = typeof raw === 'function' ? raw() : raw
  const decoder = new libheif.HeifDecoder()
  const images = decoder.decode(new Uint8Array(buffer))
  const image = images && images[0]
  if (!image) throw new Error('ERR_LIBHEIF format not supported')
  const width = image.get_width()
  const height = image.get_height()
  const imageData = new ImageData(width, height)
  await new Promise((resolve, reject) => {
    image.display(imageData, (displayData) => {
      if (!displayData) return reject(new Error('ERR_LIBHEIF decode failed'))
      resolve()
    })
  })
  return { width, height, imageData }
}

async function decodeWithHeic2any(blob) {
  const result = await window.heic2any({ blob, toType: 'image/jpeg', quality: 0.92 })
  const jpeg = Array.isArray(result) ? result[0] : result
  const bitmap = await createImageBitmap(jpeg)
  return { width: bitmap.width, height: bitmap.height, jpeg }
}

function encodeJpeg(imageData) {
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  const context = canvas.getContext('2d')
  context.putImageData(imageData, 0, 0)
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
}

;(async () => {
  try {
    const response = await fetch(fileName)
    if (!response.ok) throw new Error('fetch failed: ' + response.status)
    const buffer = await response.arrayBuffer()

    if (typeof window.heic2any === 'function') {
      const { width, height, jpeg } = await decodeWithHeic2any(new Blob([buffer], { type: 'image/heic' }))
      window.__RESULT__ = JSON.stringify({
        ok: true,
        type: jpeg.type,
        size: jpeg.size,
        width,
        height,
      })
      return
    }

    const { width, height, imageData } = await decodeWithLibheif(buffer)
    const jpeg = await encodeJpeg(imageData)
    window.__RESULT__ = JSON.stringify({
      ok: true,
      type: jpeg.type,
      size: jpeg.size,
      width,
      height,
    })
  } catch (error) {
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String(error.message)
        : String(error)
    window.__RESULT__ = JSON.stringify({ ok: false, error: message })
  }
})()