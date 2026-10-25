import { useCallback, useEffect, useState } from 'react'
import {
  experienceKey,
  listExperience,
  replaceExperience,
  type Experience,
  upsertExperience,
} from '../../api/client'

export function useExperience() {
  const [data, setData] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await listExperience()
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
    async (args: { experience: Experience }) => {
      const previous = data
      const optimistic = args.experience
      const k = experienceKey(args.experience)

      setData((cur) => {
        const next = [...cur]
        const idx = next.findIndex((x) => experienceKey(x) === k)
        if (idx >= 0) next[idx] = optimistic
        else next.unshift(optimistic)
        return next
      })

      try {
        await upsertExperience({ experience: optimistic })
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
    async (experience: Experience) => {
      const previous = data
      const k = experienceKey(experience)
      const next = data.filter((x) => experienceKey(x) !== k)
      setData(next)

      try {
        await replaceExperience(next)
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
