import { useEffect, useMemo, useState } from 'react'
import type { CredlyBadge } from '../../types/credly-badge'

type ModalMode = 'create' | 'edit'

type Props = {
  open: boolean
  mode: ModalMode
  initial?: CredlyBadge
  onClose: () => void
  onSubmit: (payload: { badge: CredlyBadge }) => Promise<void>
}

function isSafeId(id: string) {
  return /^[a-zA-Z0-9._-]+$/.test(id)
}

export default function BadgeFormModal(props: Props) {
  const { open, mode, initial, onClose, onSubmit } = props

  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [issuer, setIssuer] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [badgeUrl, setBadgeUrl] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState('')
  const [skillsCsv, setSkillsCsv] = useState('')

  const safeIdOk = useMemo(() => (mode === 'create' ? isSafeId(id || '') : isSafeId(id || '')), [id, mode])

  useEffect(() => {
    if (!open) return
    setId(initial?.id || '')
    setName(initial?.name || '')
    setIssuer(initial?.issuer || '')
    setImageUrl(initial?.image_url || '')
    setBadgeUrl(initial?.badge_url || '')
    setDescription(initial?.description || '')
    setLevel(initial?.level || '')
    setSkillsCsv((initial?.skills || []).join(', '))
  }, [open, initial])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-base-950/70 p-5 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-white font-semibold text-lg">{mode === 'create' ? 'Add Badge' : 'Edit Badge'}</div>
            <div className="mt-1 text-sm text-white/60">Manual digital badge (image URL + link)</div>
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
              placeholder="e.g. my-badge-1"
            />
            {mode === 'create' ? (
              <div className="mt-2 text-xs text-white/55">Safe chars: [a-zA-Z0-9._-]</div>
            ) : null}
            {id && !safeIdOk ? <div className="mt-2 text-xs text-red-300">ID tidak valid</div> : null}

            <label className="mt-4 block text-sm text-white/70">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
            />

            <label className="mt-4 block text-sm text-white/70">Issuer</label>
            <input
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              placeholder="optional"
            />

            <label className="mt-4 block text-sm text-white/70">Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              placeholder="https://.../badge.png"
            />

            <label className="mt-4 block text-sm text-white/70">Badge URL (optional)</label>
            <input
              value={badgeUrl}
              onChange={(e) => setBadgeUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              placeholder="https://... (if empty, uses image URL)"
            />

            <label className="mt-4 block text-sm text-white/70">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              placeholder="optional"
            />

            <label className="mt-4 block text-sm text-white/70">Level</label>
            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              placeholder="optional"
            />

            <label className="mt-4 block text-sm text-white/70">Skills (comma-separated)</label>
            <input
              value={skillsCsv}
              onChange={(e) => setSkillsCsv(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              placeholder="optional"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Preview</div>

            <div className="mt-3 flex items-center gap-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name || 'badge'}
                  className="h-16 w-16 rounded-xl object-contain bg-base-950 border border-white/10"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-base-950 border border-white/10" />
              )}
              <div>
                <div className="font-semibold text-sm">{name || 'Badge name'}</div>
                <div className="text-xs text-white/60">{issuer || 'Issuer'}</div>
                <div className="text-xs text-white/60">id: {id || '-'}</div>
              </div>
            </div>
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
              if (!id.trim() || !safeIdOk) throw new Error('ID tidak valid')
              if (!name.trim()) throw new Error('Name wajib')
              if (!imageUrl.trim()) throw new Error('Image URL wajib')

              const skills = skillsCsv
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)

              const badge: CredlyBadge = {
                id,
                name,
                description: description || '',
                issuer: issuer || '',
                source: 'Manual',
                level: level || '',
                issue_date: '',
                expiration_date: null,
                image_url: imageUrl,
                badge_url: badgeUrl && badgeUrl.trim() !== '' ? badgeUrl : imageUrl,
                skills,
                state: 'accepted',
                verified: true,
              }

              await onSubmit({ badge })
            }}
            className="rounded-xl border border-accent/50 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent-200 hover:bg-accent/25"
          >
            {mode === 'create' ? 'Add' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
