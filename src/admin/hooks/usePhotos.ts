import { useCallback, useEffect, useState } from 'react'
import { deletePhoto, listPhotos, upsertPhoto, type Photo } from '../../api/client'

export function usePhotos() {
  const [data, setData] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await listPhotos()
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
    async (args: { photo: Omit<Photo, 'imageUrl'>; imageBase64?: string }) => {
      const previous = data
      const optimistic: Photo = {
        ...(args.photo as Photo),
      }

      setData((cur) => {
        const next = [...cur]
        const idx = next.findIndex((x) => x.id === args.photo.id)
        if (idx >= 0) next[idx] = optimistic
        else next.unshift(optimistic)
        return next
      })

      try {
        const res = await upsertPhoto(args)
        if ('item' in res && res.item) {
          setData((cur) => {
            const next = [...cur]
            const idx = next.findIndex((x) => x.id === res.item.id)
            if (idx >= 0) next[idx] = res.item
            else next.unshift(res.item)
            return next
          })
        }
        return { ok: true as const }
      } catch (e) {
        setData(previous)
        const msg = (e as Error).message
        setError(msg)
        return { ok: false as const, error: msg }
      }
    },
    [data],
  )

  const remove = useCallback(
    async (id: string, deleteImage: boolean) => {
      const previous = data
      setData((cur) => cur.filter((x) => x.id !== id))
      try {
        await deletePhoto({ id, deleteImage })
        return { ok: true as const }
      } catch (e) {
        setData(previous)
        const msg = (e as Error).message
        setError(msg)
        return { ok: false as const, error: msg }
      }
    },
    [data],
  )

  return { data, loading, error, refetch, upsert, remove }
}

