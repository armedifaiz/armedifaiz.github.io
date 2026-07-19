import { useEffect, useRef, useState } from 'react'
import SectionTitle from '../components/common/SectionTitle'
import BadgeCard from '../components/cards/BadgeCard'
import credlyBadges from '../data/credly-badges.json'
import type { CredlyBadge } from '../types/credly-badge'
import { badges as badgesConfig } from '../data/site'

export default function Badges() {
  const data = credlyBadges as { fetched_at: string; total: number; badges: CredlyBadge[] }
  const list = data.badges
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState)
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [list])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = dir === 'left' ? -300 : 300
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section id="badges" className="bg-base-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow={badgesConfig.eyebrow} title={badgesConfig.title} />

        <div className="relative">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-card-border bg-card-bg shadow-md hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-card-border bg-card-bg shadow-md hover:bg-gray-50"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Slider */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{'#badges-scroll::-webkit-scrollbar { display: none }'}</style>
            {list.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
