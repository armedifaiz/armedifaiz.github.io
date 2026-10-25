export type AdminSection = 'experience' | 'skills' | 'socials' | 'photos' | 'certificates' | 'badges'

export default function Sidebar(props: {
  section: AdminSection
  onSectionChange: (s: AdminSection) => void
}) {
  const { section, onSectionChange } = props
  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-base-950/40">
      <div className="p-5">
        <div className="text-white text-lg font-semibold">Admin</div>
        <div className="mt-1 text-xs text-white/50">Portfolio CMS</div>
      </div>
      <div className="px-3 pb-5">
        <button
          onClick={() => onSectionChange('experience')}
          className={
            section === 'experience'
              ? 'w-full rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-left text-sm font-semibold text-white'
              : 'w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/5'
          }
        >
          Experience
        </button>

        <button
          onClick={() => onSectionChange('skills')}
          className={
            section === 'skills'
              ? 'mt-2 w-full rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-left text-sm font-semibold text-white'
              : 'mt-2 w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/5'
          }
        >
          Skills
        </button>

        <button
          onClick={() => onSectionChange('socials')}
          className={
            section === 'socials'
              ? 'mt-2 w-full rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-left text-sm font-semibold text-white'
              : 'mt-2 w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/5'
          }
        >
          Socials
        </button>

        <button
          onClick={() => onSectionChange('certificates')}
          className={
            section === 'certificates'
              ? 'mt-2 w-full rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-left text-sm font-semibold text-white'
              : 'mt-2 w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/5'
          }
        >
          Certificates
        </button>
        <button
          onClick={() => onSectionChange('photos')}
          className={
            section === 'photos'
              ? 'mt-2 w-full rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-left text-sm font-semibold text-white'
              : 'mt-2 w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/5'
          }
        >
          Photos
        </button>

        <button
          onClick={() => onSectionChange('badges')}
          className={
            section === 'badges'
              ? 'mt-2 w-full rounded-xl border border-accent/50 bg-accent/15 px-3 py-2 text-left text-sm font-semibold text-white'
              : 'mt-2 w-full rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-white/80 hover:bg-white/5'
          }
        >
          Badges
        </button>
      </div>
    </aside>
  )
}

