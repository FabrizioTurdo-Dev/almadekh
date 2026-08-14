import { useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface Props {
  onUpload: (file: File) => Promise<void>
}

export function AIUpload({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProcessing(true)
    await onUpload(file)
    setProcessing(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={handleClick}
        disabled={processing}
        className="text-almadekh-subdued hover:text-almadekh-teal transition-colors text-sm p-1 relative"
        title="Subir foto"
      >
        {processing ? (
          <span className="inline-block animate-spin">⏳</span>
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>
    </>
  )
}
