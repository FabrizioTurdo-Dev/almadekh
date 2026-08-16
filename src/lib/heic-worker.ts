import libheif from 'libheif-js'

interface DecodeRequest {
  id: number
  buffer: ArrayBuffer
}

function sendToMain(message: unknown, transfer?: Transferable[]): void {
  ;(postMessage as (message: unknown, transfer?: Transferable[]) => void)(
    message,
    transfer
  )
}

self.onmessage = (event: MessageEvent<DecodeRequest>) => {
  const { id, buffer } = event.data
  try {
    const decoder = new libheif.HeifDecoder()
    const images = decoder.decode(new Uint8Array(buffer))
    const image = images && images[0]
    if (!image) {
      sendToMain({
        id,
        width: 0,
        height: 0,
        data: new ArrayBuffer(0),
        error: 'ERR_LIBHEIF format not supported',
      })
      return
    }

    const width = image.get_width()
    const height = image.get_height()
    const imageData = new ImageData(width, height)

    image.display(imageData, (displayData) => {
      if (!displayData) {
        sendToMain({
          id,
          width,
          height,
          data: new ArrayBuffer(0),
          error: 'ERR_LIBHEIF decode failed',
        })
        return
      }
      const data = displayData.data.buffer as ArrayBuffer
      sendToMain({ id, width, height, data }, [data])
    })
  } catch (error) {
    sendToMain({
      id,
      width: 0,
      height: 0,
      data: new ArrayBuffer(0),
      error: String(error),
    })
  }
}