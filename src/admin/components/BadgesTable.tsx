import { useMemo, useState } from 'react'
import type { CredlyBadge } from '../../types/credly-badge'

export default function BadgesTable(props: {
  data: CredlyBadge[]
  loading: boolean
  onAdd: () => void
  onEdit: (b: CredlyBadge) => void
  onDelete: (b: CredlyBadge) => void
}) {
  const { data, loading, onAdd, onEdit, onDelete } = props
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((x) => `${x.name} ${x.issuer} ${x.id}`.toLowerCase().includes(q))
  }, [data, query])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-white font-semibold">Badges</div>
          <div className="text-xs text-white/60">Manual digital badges (image URL + link)</div>
        </div>
        <button
          onClick={onAdd}
          className="rounded-xl border border-accent/50 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent-200 hover:bg-accent/25"
        >
          Add
        </button>
      </div>

      <div className="mt-4">
        <label className="text-xs text-white/60">Search</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
          placeholder="name, issuer, id..."
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        {loading ? (
          <div className="text-white/60 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-white/60 text-sm">No results.</div>
        ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-xs text-white/60">
                <th className="py-2 pr-3">Image</th>
                <th className="py-2">Badge</th>
                <th className="py-2">Issuer</th>
                <th className="py-2">Skills</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-white/10">
                  <td className="py-3 pr-3">
                    <button
                      className="rounded-xl border border-white/10 bg-white/5 p-1 hover:bg-white/10"
                      onClick={() => window.open(b.image_url, '_blank', 'noopener,noreferrer')}
                    >
                      <img src={b.image_url} alt={b.name} className="h-12 w-12 rounded-lg object-cover" />
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="text-white font-semibold text-sm">{b.name}</div>
                    <div className="text-xs text-white/50">id: {b.id}</div>
                    <div className="text-xs text-accent/80">
                      <a href={b.badge_url || b.image_url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                        open link
                      </a>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-white/70">{b.issuer || '-'}</td>
                  <td className="py-3 text-sm text-white/70">{(b.skills || []).slice(0, 3).join(', ')}{(b.skills || []).length > 3 ? '...' : ''}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(b)}
                        className="rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-xs font-semibold text-accent-200 hover:bg-accent/25"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(b)}
                        className="rounded-xl border border-red-500/50 bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
