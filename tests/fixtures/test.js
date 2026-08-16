window.__RESULT__ = JSON.stringify({ ok: false, error: 'not-run' })

;(async () => {
  try {
    const response = await fetch('sample.heic')
    if (!response.ok) throw new Error('fetch failed: ' + response.status)
    const blob = await response.blob()
    const file = new File([blob], 'sample.heic', { type: 'image/heic' })
    const result = await window.heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    })
    const jpeg = Array.isArray(result) ? result[0] : result
    window.__RESULT__ = JSON.stringify({
      ok: true,
      type: jpeg.type,
      size: jpeg.size,
    })
  } catch (error) {
    window.__RESULT__ = JSON.stringify({
      ok: false,
      error: String(error),
    })
  }
})()