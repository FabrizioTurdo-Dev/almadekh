import { useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface Props {
  onUpload: (file: File) => Promise<void>
  progress?: string
}

export function AIUpload({ onUpload, progress }: Props) {
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

  const isBusy = processing || !!progress

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={handleClick}
        disabled={isBusy}
        className="text-almadekh-subdued hover:text-almadekh-teal transition-colors text-sm p-1 relative"
        title={progress || 'Subir foto'}
      >
        {isBusy ? (
          <span className="inline-block animate-spin">⏳</span>
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </button>
    </>
  )
}
