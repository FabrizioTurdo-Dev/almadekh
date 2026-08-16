declare module 'libheif-js' {
  interface HeifImage {
    get_width(): number
    get_height(): number
    display(
      imageData: ImageData,
      callback: (imageData: ImageData | null) => void
    ): void
  }

  interface HeifDecoder {
    decode(buffer: Uint8Array): HeifImage[]
  }

  const libheif: {
    HeifDecoder: new () => HeifDecoder
    HeifImage: new () => HeifImage
  }

  export default libheif
}