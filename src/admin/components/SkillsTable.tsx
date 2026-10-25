import { useMemo, useState } from 'react'
import type { Skill } from '../../api/client'

function normalizeIcon(icon: string) {
  // In portfolio-data, some icons might be stored as ./images/... which breaks on /admin/.
  return icon.startsWith('./images/') ? icon.replace('./images/', '/images/') : icon
}

export default function SkillsTable(props: {
  data: Skill[]
  loading: boolean
  onAdd: () => void
  onEdit: (s: Skill) => void
  onDelete: (s: Skill) => void
}) {
  const { data, loading, onAdd, onEdit, onDelete } = props
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((x) => `${x.name} ${x.slug} ${x.icon}`.toLowerCase().includes(q))
  }, [data, query])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-white font-semibold">Skills</div>
          <div className="text-xs text-white/60">List, search, edit, delete</div>
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
          placeholder="name, slug..."
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
                <th className="py-2 pr-3">Icon</th>
                <th className="py-2">Name</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Icon URL</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((x) => (
                <tr key={x.slug} className="border-t border-white/10">
                  <td className="py-3 pr-3">
                    <img
                      src={normalizeIcon(x.icon)}
                      alt={x.name}
                      className="h-10 w-10 rounded-xl border border-white/10 bg-base-950 object-contain"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </td>
                  <td className="py-3 text-sm text-white font-semibold">{x.name}</td>
                  <td className="py-3 text-sm text-white/70">{x.slug}</td>
                  <td className="py-3 text-sm text-white/70">{x.icon}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(x)}
                        className="rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-xs font-semibold text-accent-200 hover:bg-accent/25"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(x)}
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
