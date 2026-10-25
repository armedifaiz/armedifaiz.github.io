import { useCallback, useEffect, useState } from 'react'
import { listBadges, replaceBadges, upsertBadge } from '../../api/client'
import type { CredlyBadge } from '../../types/credly-badge'

export function useBadges() {
  const [data, setData] = useState<CredlyBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await listBadges()
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
    async (args: { badge: CredlyBadge }) => {
      const previous = data
      const optimistic = args.badge

      setData((cur) => {
        const next = [...cur]
        const idx = next.findIndex((x) => x.id === optimistic.id)
        if (idx >= 0) next[idx] = optimistic
        else next.unshift(optimistic)
        return next
      })

      try {
        await upsertBadge({ badge: optimistic })
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
    async (badge: CredlyBadge) => {
      const previous = data
      const next = data.filter((x) => x.id !== badge.id)
      setData(next)

      try {
        await replaceBadges(next)
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
