import { useMemo, useState } from 'react'
import type { Experience } from '../../api/client'
import { experienceKey } from '../../api/client'

export default function ExperienceTable(props: {
  data: Experience[]
  loading: boolean
  onAdd: () => void
  onEdit: (e: Experience) => void
  onDelete: (e: Experience) => void
}) {
  const { data, loading, onAdd, onEdit, onDelete } = props
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((x) => {
      const hay = `${x.role} ${x.organization} ${x.period} ${x.type} ${x.description}`.toLowerCase()
      return hay.includes(q)
    })
  }, [data, query])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-white font-semibold">Experience</div>
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
          placeholder="role, organization, period..."
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
                <th className="py-2 pr-3">Role</th>
                <th className="py-2">Organization</th>
                <th className="py-2">Period</th>
                <th className="py-2">Duration</th>
                <th className="py-2">Type</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((x) => (
                <tr key={experienceKey(x)} className="border-t border-white/10">
                  <td className="py-3 pr-3">
                    <div className="text-white font-semibold text-sm">{x.role}</div>
                    <div className="text-xs text-white/50">key: {experienceKey(x)}</div>
                  </td>
                  <td className="py-3 text-sm text-white/70">{x.organization}</td>
                  <td className="py-3 text-sm text-white/70">{x.period}</td>
                  <td className="py-3 text-sm text-white/70">{x.duration}</td>
                  <td className="py-3 text-sm text-white/70">{x.type}</td>
                  <td className="py-3 text-sm text-white/70">{x.description || '-'}</td>
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
