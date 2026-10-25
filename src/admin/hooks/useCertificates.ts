import { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteCertificate, listCertificates, upsertCertificate, type Certificate } from '../../api/client'

export function useCertificates() {
  const [data, setData] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await listCertificates()
      setData(list)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const upsert = useCallback(
    async (args: {
      certificate: Omit<Certificate, 'imageUrl'>
      imageBase64?: string
    }) => {
      const previous = data
      const optimistic: Certificate = {
        ...(args.certificate as Certificate),
      }

      // Optimistic merge by id.
      setData((cur) => {
        const next = [...cur]
        const idx = next.findIndex((x) => x.id === args.certificate.id)
        if (idx >= 0) next[idx] = optimistic
        else next.unshift(optimistic)
        return next
      })

      try {
        const res = await upsertCertificate(args)
        if ('item' in res && res.item) {
          setData((cur) => {
            const next = [...cur]
            const idx = next.findIndex((x) => x.id === res.item.id)
            if (idx >= 0) next[idx] = res.item
            else next.unshift(res.item)
            return next
          })
        }
        return true
      } catch (e) {
        setData(previous)
        setError((e as Error).message)
        return false
      }
    },
    [data],
  )

  const remove = useCallback(
    async (id: string, deleteImage: boolean) => {
      const previous = data
      setData((cur) => cur.filter((x) => x.id !== id))

      try {
        await deleteCertificate({ id, deleteImage })
        return true
      } catch (e) {
        setData(previous)
        setError((e as Error).message)
        return false
      }
    },
    [data],
  )

  const categories = useMemo(() => {
    const s = new Set<string>()
    for (const c of data) {
      if (c.category) s.add(c.category)
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b))
  }, [data])

  return { data, loading, error, refetch, upsert, remove, categories }
}

