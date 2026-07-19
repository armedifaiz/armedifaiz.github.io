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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass flex h-full flex-col overflow-hidden rounded-xl2"
    >
      {/* Badge image */}
      <div className="flex aspect-square items-center justify-center bg-gradient-to-b from-base-800 to-base-900 p-6">
        <img
          src={badge.image_url}
          alt={badge.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="line-clamp-2 text-sm font-medium text-white leading-snug">{badge.name}</p>

        {badge.issuer && (
          <p className="text-xs text-white/40">{badge.issuer}</p>
        )}

        {badge.source && badge.source !== badge.issuer && (
          <p className="text-[11px] text-accent/60">via {badge.source}</p>
        )}

        {issueDate && (
          <p className="text-[11px] text-white/30">Issued {issueDate}</p>
        )}

        {badge.skills.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {badge.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/50"
              >
                {skill}
              </span>
            ))}
            {badge.skills.length > 4 && (
              <span className="text-[10px] text-white/30">+{badge.skills.length - 4}</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-2">
          <a
            href={badge.badge_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-lg border border-accent/30 px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent/10"
          >
            Verify Credential
          </a>
        </div>
      </div>
    </motion.div>
  )
}
