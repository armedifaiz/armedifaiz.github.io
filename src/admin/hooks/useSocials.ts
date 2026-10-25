import { useCallback, useEffect, useState } from 'react'
import { listSocials, replaceSocials, type Social, upsertSocial } from '../../api/client'

export function useSocials() {
  const [data, setData] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await listSocials()
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
    async (args: { social: Social }) => {
      const previous = data
      const optimistic = args.social

      setData((cur) => {
        const next = [...cur]
        const idx = next.findIndex((x) => x.platform === optimistic.platform)
        if (idx >= 0) next[idx] = optimistic
        else next.unshift(optimistic)
        return next
      })

      try {
        await upsertSocial({ social: optimistic })
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
    async (social: Social) => {
      const previous = data
      const next = data.filter((x) => x.platform !== social.platform)
      setData(next)

      try {
        await replaceSocials(next)
        return true
      } catch (e) {
        setData(previous)
        setError((e as Error).message)
        return false
      }
    },
    [data],
  )

  return { data, loading, error, refetch, upsert, remove }
}
