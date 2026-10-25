import React, { useEffect, useMemo, useState } from 'react'
import type { Certificate, Photo } from '../../api/client'

type AdminType = 'certificates' | 'photos'
type ModalMode = 'create' | 'edit'

type BaseProps = {
  open: boolean
  type: AdminType
  mode: ModalMode
  onClose: () => void
  onSubmit: (payload: {
    certificate?: Omit<Certificate, 'imageUrl'>
    photo?: Omit<Photo, 'imageUrl'>
    imageBase64?: string
  }) => Promise<void>
}

export default function ItemFormModal(props: BaseProps & { initial?: Certificate | Photo }) {
  const { open, onClose, type, mode, onSubmit } = props
  const initial = props.initial

  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [issuer, setIssuer] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const [caption, setCaption] = useState('')
  const [takenAt, setTakenAt] = useState('')

  const [filename, setFilename] = useState('')
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [fileExt, setFileExt] = useState('jpg')

  const accept = type === 'photos' ? 'image/*' : 'image/*'

  useEffect(() => {
    if (!open) return
    // Reset.
    setImageBase64(undefined)
    setPreviewUrl(undefined)
    setFilename('')
    setFileExt('jpg')

    if (type === 'certificates') {
      const c = initial as Certificate | undefined
      setId(c?.id || '')
      setTitle(c?.title || '')
      setIssuer(c?.issuer || '')
      setDate(c?.date || '')
      setCategory(c?.category || '')
      setDescription(c?.description || '')
      setFilename((c as Certificate | undefined)?.filename || '')
      setPreviewUrl(c?.imageUrl)
    } else {
      const p = initial as Photo | undefined
      setId(p?.id || '')
      setCaption(p?.caption || '')
      setTakenAt(p?.takenAt || '')
      setFilename((p as Photo | undefined)?.filename || '')
      setPreviewUrl(p?.imageUrl)
    }
  }, [open, initial, type])

  const safeIdOk = useMemo(() => /^[a-zA-Z0-9._-]+$/.test(id || ''), [id])

  function computeFilename(nextId: string, ext: string) {
    return `${nextId}_verified.${ext}`
  }

  async function handleFile(file: File) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase() || 'jpg'
    setFileExt(ext)
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    setImageBase64(dataUrl)
    setPreviewUrl(dataUrl)

    if (id) {
      setFilename(computeFilename(id, ext))
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    void handleFile(file)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-base-950/70 p-5 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-white font-semibold text-lg">
              {type === 'certificates' ? (mode === 'create' ? 'Add Certificate' : 'Edit Certificate') : mode === 'create' ? 'Add Photo' : 'Edit Photo'}
            </div>
            <div className="mt-1 text-sm text-white/60">
              Drag & drop image, preview will show instantly.
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-white/70">ID (key)</label>
            <input
              disabled={mode === 'edit'}
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              placeholder="e.g. cert-1 or myphoto"
            />
            {mode === 'create' ? (
              <div className="mt-2 text-xs text-white/55">Safe chars: [a-zA-Z0-9._-]</div>
            ) : null}
            {id && !safeIdOk ? <div className="mt-2 text-xs text-red-300">ID tidak valid (harus tanpa spasi dan hanya [a-zA-Z0-9._-])</div> : null}

            {type === 'certificates' ? (
              <>
                <label className="mt-4 block text-sm text-white/70">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />

                <label className="mt-4 block text-sm text-white/70">Issuer</label>
                <input
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm text-white/70">Date</label>
                    <input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70">Category</label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                      placeholder="Cloud / Mobile / DVCS / ..."
                    />
                  </div>
                </div>

                <label className="mt-4 block text-sm text-white/70">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  placeholder="optional"
                />
              </>
            ) : (
              <>
                <label className="mt-4 block text-sm text-white/70">Caption</label>
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />
                <label className="mt-4 block text-sm text-white/70">TakenAt</label>
                <input
                  value={takenAt}
                  onChange={(e) => setTakenAt(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  placeholder="optional"
                />
              </>
            )}
          </div>

          <div>
            <label className="text-sm text-white/70">Image</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="mt-2 flex min-h-[170px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-center"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="max-h-[180px] w-auto rounded-xl border border-white/10" />
              ) : (
                <div className="text-sm text-white/60">
                  Drop image here
                  <div className="mt-2 text-xs">or choose file</div>
                </div>
              )}

              <div className="mt-2">
                <input
                  accept={accept}
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    void handleFile(file)
                  }}
                />
              </div>
            </div>

            <div className="mt-3 text-xs text-white/55">
              Filename: <span className="text-white/80 font-semibold">{filename || '(will be set on upload)'}</span>
            </div>
            {mode === 'create' && !previewUrl ? (
              <div className="mt-2 text-xs text-red-300">Image required for create.</div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (!id || !safeIdOk) throw new Error('ID tidak valid')
              if (type === 'certificates') {
                if (!title.trim()) throw new Error('Title wajib')
                if (!issuer.trim()) throw new Error('Issuer wajib')
                if (mode === 'create' && !imageBase64) throw new Error('Image wajib')
                const ext = (filename.split('.').pop() || fileExt || 'jpg').toLowerCase()
                const nextFilename = filename || computeFilename(id, ext)
                await onSubmit({
                  certificate: {
                    id,
                    filename: nextFilename,
                    title,
                    issuer,
                    date: date || '',
                    description: description || '',
                    category: category || '',
                  },
                  imageBase64,
                })
              } else {
                if (!caption.trim()) throw new Error('Caption wajib')
                if (mode === 'create' && !imageBase64) throw new Error('Image wajib')
                const ext = (filename.split('.').pop() || fileExt || 'jpg').toLowerCase()
                const nextFilename = filename || computeFilename(id, ext)
                await onSubmit({
                  photo: {
                    id,
                    filename: nextFilename,
                    caption,
                    takenAt: takenAt || '',
                  },
                  imageBase64,
                })
              }
            }}
            className="rounded-xl border border-accent/50 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent-200 hover:bg-accent/25"
          >
            {type === 'certificates' ? (mode === 'create' ? 'Add' : 'Save') : mode === 'create' ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

