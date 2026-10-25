import { useEffect, useRef } from 'react'
import SectionTitle from '../components/common/SectionTitle'
import BadgeCard from '../components/cards/BadgeCard'
import credlyBadges from '../data/credly-badges.json'
import manualBadges from '../data/manual-badges.json'
import type { CredlyBadge } from '../types/credly-badge'
import { badges as badgesConfig } from '../data/site'

export default function Badges() {
  const data = credlyBadges as { fetched_at: string; total: number; badges: CredlyBadge[] }
  const originalsMap = new Map<string, CredlyBadge>()
  for (const b of data.badges) originalsMap.set(b.id, b)
  for (const b of (manualBadges as CredlyBadge[])) originalsMap.set(b.id, b)
  const originals = Array.from(originalsMap.values())
  const items = [...originals, ...originals, ...originals]
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let x = 0
    let raf: number
    let paused = false

    const totalWidth = track.scrollWidth / 3
    const step = () => {
      if (!paused) {
        x -= 0.8
        if (x <= -totalWidth) x = 0
        track.style.transform = `translateX(${x}px)`
      }
      raf = requestAnimationFrame(step)
    }

    const parent = track.parentElement!
    const onEnter = () => { paused = true }
    const onLeave = () => { paused = false }
    parent.addEventListener('mouseenter', onEnter)
    parent.addEventListener('mouseleave', onLeave)

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      parent.removeEventListener('mouseenter', onEnter)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section id="badges" className="bg-base-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow={badgesConfig.eyebrow} title={badgesConfig.title} />

        <div className="group relative overflow-hidden py-4">
          <div ref={trackRef} className="flex gap-4" style={{ width: 'fit-content' }}>
            {items.map((badge, i) => (
              <BadgeCard key={`${badge.id}-${i}`} badge={badge} />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base-950 to-transparent" />
        </div>
      </div>
    </section>
  )
}
