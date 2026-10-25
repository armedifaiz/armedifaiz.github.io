import { useCallback, useEffect, useState } from 'react'
import { listSkills, replaceSkills, type Skill, upsertSkill } from '../../api/client'

export function useSkills() {
  const [data, setData] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await listSkills()
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
    async (args: { skill: Skill }) => {
      const previous = data
      const optimistic = args.skill

      setData((cur) => {
        const next = [...cur]
        const idx = next.findIndex((x) => x.slug === optimistic.slug)
        if (idx >= 0) next[idx] = optimistic
        else next.unshift(optimistic)
        return next
      })

      try {
        await upsertSkill({ skill: optimistic })
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
    async (skill: Skill) => {
      const previous = data
      const next = data.filter((x) => x.slug !== skill.slug)
      setData(next)

      try {
        await replaceSkills(next)
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
