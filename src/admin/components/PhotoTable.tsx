import { useMemo, useState } from 'react'
import type { Photo } from '../../api/client'

function yearOf(date: string): string {
  const m = String(date || '').match(/^(\d{4})/)
  return m?.[1] || ''
}

export default function PhotoTable(props: {
  data: Photo[]
  loading: boolean
  onAdd: () => void
  onEdit: (p: Photo) => void
  onDelete: (p: Photo) => void
  onPreview: (url?: string) => void
}) {
  const { data, loading, onAdd, onEdit, onDelete, onPreview } = props

  const [query, setQuery] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const years = useMemo(() => {
    const s = new Set<string>()
    for (const p of data) {
      const y = yearOf(p.takenAt)
      if (y) s.add(y)
    }
    return Array.from(s).sort((a, b) => b.localeCompare(a))
  }, [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((p) => {
      if (year && yearOf(p.takenAt) !== year) return false
      if (!q) return true
      const hay = `${p.caption} ${p.takenAt}`.toLowerCase()
      return hay.includes(q)
    })
  }, [data, query, year])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-white font-semibold">Photos</div>
          <div className="text-xs text-white/60">List, search, edit, delete</div>
        </div>
        <div>
          <button onClick={onAdd} className="rounded-xl border border-accent/50 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent-200 hover:bg-accent/25">
            Add
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="text-xs text-white/60">Search</label>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
            placeholder="caption"
          />
        </div>
        <div>
          <label className="text-xs text-white/60">Year</label>
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value)
              setPage(1)
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="text-xs text-white/60">{loading ? 'Loading...' : `${filtered.length} item(s)`}</div>
        </div>
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
                <th className="py-2 pr-3">Thumb</th>
                <th className="py-2">Caption</th>
                <th className="py-2">TakenAt</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((p) => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="py-3 pr-3">
                    <button
                      onClick={() => onPreview(p.imageUrl)}
                      className="rounded-xl border border-white/10 bg-white/5 p-1 hover:bg-white/10"
                    >
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.caption} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-white/5" />
                      )}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="text-white font-semibold text-sm">{p.caption}</div>
                    <div className="text-xs text-white/50">id: {p.id}</div>
                  </td>
                  <td className="py-3 text-sm text-white/70">{p.takenAt || '-'}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-xs font-semibold text-accent-200 hover:bg-accent/25"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(p)}
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

      {!loading && filtered.length > 0 ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-white/60">
            Page {page} / {pages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

