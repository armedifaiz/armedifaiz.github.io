import { useCallback, useEffect, useMemo, useState } from 'react'
import { listBadges, replaceBadges, upsertBadge } from '../../api/client'
import type { CredlyBadge } from '../../types/credly-badge'

import credlyBadges from '../../data/credly-badges.json'
import manualBadges from '../../data/manual-badges.json'

export function useBadges() {
  const [data, setData] = useState<CredlyBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fallbackBadges = useMemo(() => {
    const fromCredly = (credlyBadges as unknown as { badges: CredlyBadge[] }).badges || []
    const fromManual = manualBadges as unknown as CredlyBadge[]
    const map = new Map<string, CredlyBadge>()
    for (const b of fromCredly) map.set(b.id, b)
    for (const b of fromManual) map.set(b.id, b)
    return Array.from(map.values())
  }, [])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await listBadges()
      if (Array.isArray(list) && list.length > 0) setData(list)
      else setData(fallbackBadges)
    } catch (e) {
      // If backend read fails, still show local badges so admin can function.
      setError((e as Error).message)
      setData(fallbackBadges)
    } finally {
      setLoading(false)
    }
  }, [fallbackBadges])

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
