import type { CredlyBadge } from '../../types/credly-badge'

interface BadgeCardProps {
  badge: CredlyBadge
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const isCert = badge.badge_url?.includes('certification') ?? false
  const rounded = isCert ? 'rounded-full' : 'rounded-xl2'

  return (
    <a
      href={badge.badge_url}
      target="_blank"
      rel="noreferrer"
      className={`group relative flex w-40 shrink-0 flex-col overflow-hidden border border-card-border bg-card-bg transition-shadow hover:shadow-lg ${rounded}`}
    >
      <div className={`flex aspect-square items-center justify-center bg-card-bg p-5 ${rounded}`}>
        <img
          src={badge.image_url}
          alt={badge.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-card-bg/90 pb-2 pt-4 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="rounded-lg border border-[#ef4444] px-3 py-1 text-xs text-[#ef4444]">
          Verify
        </span>
      </div>
    </a>
  )
}
