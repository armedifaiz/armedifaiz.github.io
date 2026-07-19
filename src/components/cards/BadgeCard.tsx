import { motion } from 'framer-motion'
import type { CredlyBadge } from '../../types/credly-badge'

interface BadgeCardProps {
  badge: CredlyBadge
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const issueDate = badge.issue_date
    ? new Date(badge.issue_date + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : null

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-48 shrink-0 flex-col overflow-hidden rounded-xl2 border border-card-border bg-card-bg"
    >
      {/* Badge image - minimal padding */}
      <div className="flex aspect-square items-center justify-center bg-card-bg p-4">
        <img
          src={badge.image_url}
          alt={badge.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Info - minimal padding */}
      <div className="flex flex-1 flex-col gap-1.5 border-t border-card-border bg-card-bg p-3">
        <p className="line-clamp-2 text-xs font-medium leading-snug text-gray-900">{badge.name}</p>

        {badge.issuer && (
          <p className="text-[11px] text-gray-500">{badge.issuer}</p>
        )}

        {issueDate && (
          <p className="text-[10px] text-gray-400">Issued {issueDate}</p>
        )}

        {badge.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {badge.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-300 px-1.5 py-0.5 text-[9px] text-gray-500"
              >
                {skill}
              </span>
            ))}
            {badge.skills.length > 3 && (
              <span className="text-[9px] text-gray-400">+{badge.skills.length - 3}</span>
            )}
          </div>
        )}

        <div className="pt-1">
          <a
            href={badge.badge_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-lg border border-accent px-2.5 py-1 text-[11px] text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Verify
          </a>
        </div>
      </div>
    </motion.div>
  )
}
