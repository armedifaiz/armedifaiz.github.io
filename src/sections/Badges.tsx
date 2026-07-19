import SectionTitle from '../components/common/SectionTitle'
import BadgeCard from '../components/cards/BadgeCard'
import credlyBadges from '../data/credly-badges.json'
import type { CredlyBadge } from '../types/credly-badge'
import { badges as badgesConfig } from '../data/site'

export default function Badges() {
  const data = credlyBadges as { fetched_at: string; total: number; badges: CredlyBadge[] }
  const originals = data.badges
  const items = [...originals, ...originals]

  return (
    <section id="badges" className="bg-base-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow={badgesConfig.eyebrow} title={badgesConfig.title} />

        <div className="group relative">
          {/* Scrolling track */}
          <div className="marquee-track flex gap-4 py-2">
            {items.map((badge, i) => (
              <BadgeCard key={`${badge.id}-${i}`} badge={badge} />
            ))}
          </div>

          {/* Edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-base-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-base-950 to-transparent" />
        </div>
      </div>

      <style>{`
        .marquee-track {
          overflow: hidden;
          animation: marquee 30s linear infinite;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
