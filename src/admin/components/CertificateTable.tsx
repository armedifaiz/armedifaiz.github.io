import { useMemo, useState } from 'react'
import type { Certificate } from '../../api/client'

function yearOf(date: string): string {
  const m = String(date || '').match(/^(\d{4})/)
  return m?.[1] || ''
}

export default function CertificateTable(props: {
  data: Certificate[]
  loading: boolean
  categories: string[]
  onAdd: () => void
  onEdit: (c: Certificate) => void
  onDelete: (c: Certificate) => void
  onPreview: (url?: string) => void
}) {
  const { data, loading, categories, onAdd, onEdit, onDelete, onPreview } = props

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const years = useMemo(() => {
    const s = new Set<string>()
    for (const c of data) {
      const y = yearOf(c.date)
      if (y) s.add(y)
    }
    return Array.from(s).sort((a, b) => b.localeCompare(a))
  }, [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((c) => {
      if (category && c.category !== category) return false
      if (year && yearOf(c.date) !== year) return false
      if (!q) return true
      const hay = `${c.title} ${c.issuer} ${c.description} ${c.category} ${c.date}`.toLowerCase()
      return hay.includes(q)
    })
  }, [data, query, category, year])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-white font-semibold">Certificates</div>
          <div className="text-xs text-white/60">List, search, edit, delete</div>
        </div>
        <div className="flex gap-2">
          <button onClick={onAdd} className="rounded-xl border border-accent/50 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent-200 hover:bg-accent/25">
            Add
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="md:col-span-1">
          <label className="text-xs text-white/60">Search</label>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
            placeholder="title / issuer / category"
          />
        </div>
        <div>
          <label className="text-xs text-white/60">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
        <div className="flex items-end justify-start">
          <div className="text-xs text-white/60">
            {loading ? 'Loading...' : `${filtered.length} item(s)`}
          </div>
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
                <th className="py-2">Title</th>
                <th className="py-2">Issuer</th>
                <th className="py-2">Date</th>
                <th className="py-2">Category</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((c) => (
                <tr key={c.id} className="border-t border-white/10">
                  <td className="py-3 pr-3">
                    <button
                      onClick={() => onPreview(c.imageUrl)}
                      className="rounded-xl border border-white/10 bg-white/5 p-1 hover:bg-white/10"
                    >
                      {c.imageUrl ? (
                        // keep tiny thumbnail
                        <img src={c.imageUrl} alt={c.title} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-white/5" />
                      )}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="text-white font-semibold text-sm">{c.title}</div>
                    <div className="text-xs text-white/50">id: {c.id}</div>
                  </td>
                  <td className="py-3 text-sm text-white/70">{c.issuer}</td>
                  <td className="py-3 text-sm text-white/70">{c.date || '-'}</td>
                  <td className="py-3 text-sm text-white/70">{c.category || '-'}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(c)}
                        className="rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-xs font-semibold text-accent-200 hover:bg-accent/25"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(c)}
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

