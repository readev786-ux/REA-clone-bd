import { useRef, useState } from 'react'
import { UploadCloud, Loader2 } from 'lucide-react'
import { uploadMedia } from '../../lib/admin'

export function ImageDrop({
  onUploaded,
  folder = 'developments',
  label = 'Drag & drop photos, or click to browse',
  compact = false,
}: {
  onUploaded: (urls: string[]) => void
  folder?: string
  label?: string
  compact?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)
  const [error, setError] = useState('')

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError('')
    try {
      const urls = await Promise.all(
        Array.from(files)
          .filter((f) => f.type.startsWith('image/'))
          .map((f) => uploadMedia(f, folder)),
      )
      if (urls.length) onUploaded(urls)
    } catch (e) {
      setError((e as Error).message || 'Upload failed')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center transition ${
          compact ? 'p-4' : 'p-8'
        } ${over ? 'border-gold bg-gold-wash' : 'border-navy/20 bg-white hover:border-gold/60'}`}
      >
        {busy ? (
          <Loader2 className="h-6 w-6 animate-spin text-gold-deep" />
        ) : (
          <UploadCloud className="h-6 w-6 text-gold-deep" />
        )}
        <span className="text-sm font-medium text-navy-deep/80">
          {busy ? 'Uploading…' : label}
        </span>
        {!compact && <span className="text-xs text-ash">JPG / PNG / WebP — multiple allowed</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-clay">{error}</p>}
    </div>
  )
}
