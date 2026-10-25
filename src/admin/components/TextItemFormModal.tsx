import { useEffect, useMemo, useState } from 'react'
import type { Experience, Skill, Social } from '../../api/client'

type AdminType = 'experience' | 'skills' | 'socials'
type ModalMode = 'create' | 'edit'

type Props = {
  open: boolean
  type: AdminType
  mode: ModalMode
  initial?: Experience | Skill | Social
  onClose: () => void
  onSubmit: (payload: { experience?: Experience; skill?: Skill; social?: Social }) => Promise<void>
}

export default function TextItemFormModal(props: Props) {
  const { open, type, mode, onClose, onSubmit } = props
  const initial = props.initial

  const [role, setRole] = useState('')
  const [organization, setOrganization] = useState('')
  const [period, setPeriod] = useState('')
  const [duration, setDuration] = useState('')
  const [experienceType, setExperienceType] = useState('')
  const [description, setDescription] = useState('')

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [icon, setIcon] = useState('')

  const [platform, setPlatform] = useState('')
  const [url, setUrl] = useState('')

  // Basic “required” validation in the UI.
  const isIdOk = useMemo(() => true, [])

  useEffect(() => {
    if (!open) return

    setRole('')
    setOrganization('')
    setPeriod('')
    setDuration('')
    setExperienceType('')
    setDescription('')

    setName('')
    setSlug('')
    setIcon('')

    setPlatform('')
    setUrl('')

    if (type === 'experience') {
      const x = initial as Experience | undefined
      setRole(x?.role || '')
      setOrganization(x?.organization || '')
      setPeriod(x?.period || '')
      setDuration(x?.duration || '')
      setExperienceType(x?.type || '')
      setDescription(x?.description || '')
    }

    if (type === 'skills') {
      const x = initial as Skill | undefined
      setName(x?.name || '')
      setSlug(x?.slug || '')
      setIcon(x?.icon || '')
    }

    if (type === 'socials') {
      const x = initial as Social | undefined
      setPlatform(x?.platform || '')
      setUrl(x?.url || '')
      setIcon(x?.icon || '')
    }
  }, [open, initial, type])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-base-950/70 p-5 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-white font-semibold text-lg">
              {type === 'experience'
                ? mode === 'create'
                  ? 'Add Experience'
                  : 'Edit Experience'
                : type === 'skills'
                  ? mode === 'create'
                    ? 'Add Skill'
                    : 'Edit Skill'
                  : mode === 'create'
                    ? 'Add Social'
                    : 'Edit Social'}
            </div>
            <div className="mt-1 text-sm text-white/60">Instant list update (optimistic + rollback)</div>
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
            {type === 'experience' ? (
              <>
                <label className="text-sm text-white/70">Role (key)</label>
                <input
                  disabled={mode === 'edit'}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />

                <label className="mt-4 block text-sm text-white/70">Organization</label>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />

                <label className="mt-4 block text-sm text-white/70">Period (key)</label>
                <input
                  disabled={mode === 'edit'}
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm text-white/70">Duration</label>
                    <input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70">Type</label>
                    <input
                      value={experienceType}
                      onChange={(e) => setExperienceType(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
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
            ) : null}

            {type === 'skills' ? (
              <>
                <label className="block text-sm text-white/70">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                />

                <label className="mt-4 block text-sm text-white/70">Slug (key)</label>
                <input
                  disabled={mode === 'edit'}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  placeholder="e.g. python, typescript"
                />

                <label className="mt-4 block text-sm text-white/70">Icon URL</label>
                <input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  placeholder="https://... or /images/..."
                />

                <div className="mt-2 text-xs text-white/55">
                  Tip: kalau pakai nilai <span className="text-white/80 font-semibold">./images/... </span>, admin akan menampilkannya dengan path <span className="text-white/80 font-semibold">/images/...</span>.
                </div>
              </>
            ) : null}

            {type === 'socials' ? (
              <>
                <label className="block text-sm text-white/70">Platform (key)</label>
                <input
                  disabled={mode === 'edit'}
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  placeholder="github, linkedin, instagram"
                />

                <label className="mt-4 block text-sm text-white/70">URL</label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  placeholder="https://..."
                />

                <label className="mt-4 block text-sm text-white/70">Icon key</label>
                <input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  placeholder="github, linkedin, instagram"
                />
              </>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Preview</div>

            {type === 'experience' ? (
              <div className="mt-3 space-y-1">
                <div className="font-semibold text-sm">{role || 'Role'}</div>
                <div className="text-xs text-white/60">{organization || 'Organization'} • {period || 'Period'}</div>
                <div className="text-xs text-white/60">{duration || 'Duration'} • {experienceType || 'Type'}</div>
              </div>
            ) : null}

            {type === 'skills' ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={icon.startsWith('./images/') ? icon.replace('./images/', '/images/') : icon}
                    alt={name || 'icon'}
                    className="h-6 w-6 rounded-lg object-contain bg-base-950"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <div>
                    <div className="font-semibold text-sm">{name || 'Skill name'}</div>
                    <div className="text-xs text-white/60">slug: {slug || 'slug'}</div>
                  </div>
                </div>
              </div>
            ) : null}

            {type === 'socials' ? (
              <div className="mt-3 space-y-2">
                <div className="font-semibold text-sm">{platform || 'platform'}</div>
                <div className="text-xs text-white/60">{url || 'url'}</div>
                <div className="text-xs text-white/60">icon key: {icon || '-'}</div>
              </div>
            ) : null}

            {!isIdOk ? <div className="mt-3 text-xs text-red-300">Invalid key</div> : null}
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
              if (type === 'experience') {
                if (!role.trim()) throw new Error('Role wajib')
                if (!organization.trim()) throw new Error('Organization wajib')
                if (!period.trim()) throw new Error('Period wajib')
                if (!duration.trim()) throw new Error('Duration wajib')
                if (!experienceType.trim()) throw new Error('Type wajib')
                await onSubmit({
                  experience: {
                    role,
                    organization,
                    period,
                    duration,
                    type: experienceType,
                    description: description || '',
                  },
                })
              }

              if (type === 'skills') {
                if (!name.trim()) throw new Error('Name wajib')
                if (!slug.trim()) throw new Error('Slug wajib')
                if (!icon.trim()) throw new Error('Icon wajib')
                await onSubmit({
                  skill: {
                    name,
                    slug,
                    icon,
                  },
                })
              }

              if (type === 'socials') {
                if (!platform.trim()) throw new Error('Platform wajib')
                if (!url.trim()) throw new Error('URL wajib')
                if (!icon.trim()) throw new Error('Icon key wajib')
                await onSubmit({
                  social: {
                    platform,
                    url,
                    icon,
                  },
                })
              }
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
