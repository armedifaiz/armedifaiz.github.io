import type { CredlyBadge } from '../../types/credly-badge'

interface BadgeCardProps {
  badge: CredlyBadge
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const isCert = badge.badge_url?.includes('certification') ?? false

  return (
    <a
      href={badge.badge_url}
      target="_blank"
      rel="noreferrer"
      className={`relative flex w-40 shrink-0 flex-col overflow-hidden bg-card-bg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_-8px_rgba(239,68,68,0.4)] ${isCert ? 'rounded-full' : 'rounded-xl2'}`}
    >
      <div className={`relative flex aspect-square items-center justify-center bg-card-bg p-5 overflow-hidden ${isCert ? 'rounded-full' : 'rounded-xl2'}`}>
        <div className={`absolute inset-0 ring-1 ring-inset ring-black/5 transition-all duration-500 hover:ring-2 hover:ring-[#ef4444]/40 pointer-events-none ${isCert ? 'rounded-full' : 'rounded-xl2'}`} />
        <img
          src={badge.image_url}
          alt={badge.name}
          className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-110"
          loading="lazy"
        />
      </div>
    </a>
  )
}
