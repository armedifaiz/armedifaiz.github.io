import SectionTitle from '../components/common/SectionTitle'
import BadgeCard from '../components/cards/BadgeCard'
import credlyBadges from '../data/credly-badges.json'
import type { CredlyBadge } from '../types/credly-badge'
import { badges as badgesConfig } from '../data/site'

export default function Badges() {
  const data = credlyBadges as { fetched_at: string; total: number; badges: CredlyBadge[] }
  const list = data.badges

  return (
    <section id="badges" className="bg-base-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle eyebrow={badgesConfig.eyebrow} title={badgesConfig.title} />

        {list.length === 0 ? (
          <p className="text-sm text-white/40">
            No badges yet. Run <code className="text-accent">node scripts/fetch-credly-badges.js</code> to fetch them.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {list.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
