import { useState } from 'react'
import Sidebar, { type AdminSection } from '../components/Sidebar'
import CertificateTable from '../components/CertificateTable'
import PhotoTable from '../components/PhotoTable'
import ItemFormModal from '../components/ItemFormModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

import ExperienceTable from '../components/ExperienceTable'
import SkillsTable from '../components/SkillsTable'
import SocialsTable from '../components/SocialsTable'
import BadgesTable from '../components/BadgesTable'

import TextItemFormModal from '../components/TextItemFormModal'
import BadgeFormModal from '../components/BadgeFormModal'

import type { CredlyBadge } from '../../types/credly-badge'
import type {
  Certificate,
  Experience,
  Photo,
  Skill,
  Social,
} from '../../api/client'

import { useCertificates } from '../hooks/useCertificates'
import { usePhotos } from '../hooks/usePhotos'
import { useExperience } from '../hooks/useExperience'
import { useSkills } from '../hooks/useSkills'
import { useSocials } from '../hooks/useSocials'
import { useBadges } from '../hooks/useBadges'

type FormInitial = Certificate | Photo | Experience | Skill | Social | CredlyBadge | undefined

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>('certificates')

  const certificates = useCertificates()
  const photos = usePhotos()
  const experience = useExperience()
  const skills = useSkills()
  const socials = useSocials()
  const badges = useBadges()

  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const pushToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    window.setTimeout(() => setToast(null), 3200)
  }

  // Modal states
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [formInitial, setFormInitial] = useState<FormInitial>(undefined)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<FormInitial>(undefined)
  const [deleteImage, setDeleteImage] = useState(false)

  const [lightboxUrl, setLightboxUrl] = useState<string | undefined>(undefined)

  const currentLoading =
    section === 'certificates'
      ? certificates.loading
      : section === 'photos'
        ? photos.loading
        : section === 'experience'
          ? experience.loading
          : section === 'skills'
            ? skills.loading
            : section === 'socials'
              ? socials.loading
              : badges.loading

  const closeForm = () => {
    setFormOpen(false)
  }

  const openCreate = () => {
    setFormMode('create')
    setFormInitial(undefined)
    setFormOpen(true)
  }

  const openEdit = (item: FormInitial) => {
    setFormMode('edit')
    setFormInitial(item)
    setFormOpen(true)
  }

  const askDelete = (item: FormInitial) => {
    setDeleteTarget(item)
    setDeleteOpen(true)
  }

  const handlePhotoCertSubmit = async (payload: {
    certificate?: Omit<Certificate, 'imageUrl'>
    photo?: Omit<Photo, 'imageUrl'>
    imageBase64?: string
  }) => {
    try {
      if (section === 'certificates' && payload.certificate) {
        const ok = await certificates.upsert({ certificate: payload.certificate, imageBase64: payload.imageBase64 })
        if (!ok) return pushToast('err', certificates.error || 'Update failed')
        pushToast('ok', formMode === 'create' ? 'Certificate created' : 'Certificate updated')
      }

      if (section === 'photos' && payload.photo) {
        const ok = await photos.upsert({ photo: payload.photo, imageBase64: payload.imageBase64 })
        if (!ok) return pushToast('err', photos.error || 'Update failed')
        pushToast('ok', formMode === 'create' ? 'Photo created' : 'Photo updated')
      }

      setFormOpen(false)
    } catch (e) {
      pushToast('err', (e as Error).message)
    }
  }

  const handleTextSubmit = async (payload: { experience?: Experience; skill?: Skill; social?: Social }) => {
    try {
      if (section === 'experience' && payload.experience) {
        const ok = await experience.upsert({ experience: payload.experience })
        if (!ok) return pushToast('err', experience.error || 'Update failed')
        pushToast('ok', formMode === 'create' ? 'Experience created' : 'Experience updated')
      }

      if (section === 'skills' && payload.skill) {
        const ok = await skills.upsert({ skill: payload.skill })
        if (!ok) return pushToast('err', skills.error || 'Update failed')
        pushToast('ok', formMode === 'create' ? 'Skill created' : 'Skill updated')
      }

      if (section === 'socials' && payload.social) {
        const ok = await socials.upsert({ social: payload.social })
        if (!ok) return pushToast('err', socials.error || 'Update failed')
        pushToast('ok', formMode === 'create' ? 'Social created' : 'Social updated')
      }

      setFormOpen(false)
    } catch (e) {
      pushToast('err', (e as Error).message)
    }
  }

  const handleBadgeSubmit = async (payload: { badge: CredlyBadge }) => {
    try {
      const ok = await badges.upsert({ badge: payload.badge })
      if (!ok) return pushToast('err', badges.error || 'Update failed')
      pushToast('ok', formMode === 'create' ? 'Badge created' : 'Badge updated')
      setFormOpen(false)
    } catch (e) {
      pushToast('err', (e as Error).message)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    try {
      if (section === 'certificates') {
        const item = deleteTarget as Certificate
        const ok = await certificates.remove(item.id, deleteImage)
        if (!ok) return pushToast('err', certificates.error || 'Delete failed')
        pushToast('ok', 'Certificate deleted')
      } else if (section === 'photos') {
        const item = deleteTarget as Photo
        const ok = await photos.remove(item.id, deleteImage)
        if (!ok) return pushToast('err', photos.error || 'Delete failed')
        pushToast('ok', 'Photo deleted')
      } else if (section === 'experience') {
        const item = deleteTarget as Experience
        const ok = await experience.remove(item)
        if (!ok) return pushToast('err', experience.error || 'Delete failed')
        pushToast('ok', 'Experience deleted')
      } else if (section === 'skills') {
        const item = deleteTarget as Skill
        const ok = await skills.remove(item)
        if (!ok) return pushToast('err', skills.error || 'Delete failed')
        pushToast('ok', 'Skill deleted')
      } else if (section === 'socials') {
        const item = deleteTarget as Social
        const ok = await socials.remove(item)
        if (!ok) return pushToast('err', socials.error || 'Delete failed')
        pushToast('ok', 'Social deleted')
      } else if (section === 'badges') {
        const item = deleteTarget as CredlyBadge
        const ok = await badges.remove(item)
        if (!ok) return pushToast('err', badges.error || 'Delete failed')
        pushToast('ok', 'Badge deleted')
      }

      setDeleteOpen(false)
    } catch (e) {
      pushToast('err', (e as Error).message)
    }
  }

  const sectionLabel =
    section === 'certificates'
      ? 'Certificates'
      : section === 'photos'
        ? 'Photos'
        : section === 'experience'
          ? 'Experience'
          : section === 'skills'
            ? 'Skills'
            : section === 'socials'
              ? 'Socials'
              : 'Badges'

  const deleteTitle =
    section === 'certificates'
      ? 'Delete certificate?'
      : section === 'photos'
        ? 'Delete photo?'
        : section === 'experience'
          ? 'Delete experience?'
          : section === 'skills'
            ? 'Delete skill?'
            : section === 'socials'
              ? 'Delete social?'
              : 'Delete badge?'

  const deleteDesc =
    section === 'certificates'
      ? 'This will remove certificate metadata (and optionally the image file).'
      : section === 'photos'
        ? 'This will remove photo metadata (and optionally the image file).'
        : section === 'experience'
          ? 'This will remove the selected experience item.'
          : section === 'skills'
            ? 'This will remove the selected skill item.'
            : section === 'socials'
              ? 'This will remove the selected social item.'
              : 'This will remove the selected badge.'

  return (
    <div className="min-h-screen bg-base-950 text-white">
      <div className="flex flex-col md:flex-row">
        <Sidebar section={section} onSectionChange={setSection} />

        <main className="flex-1 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-semibold">{sectionLabel} Manager</div>
              <div className="text-xs text-white/60">Instant list update (optimistic + rollback)</div>
            </div>
          </div>

          {toast ? (
            <div
              className={
                toast.type === 'ok'
                  ? 'mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-200'
                  : 'mt-4 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200'
              }
            >
              {toast.msg}
            </div>
          ) : null}

          <div className="mt-5">
            {section === 'certificates' ? (
              <CertificateTable
                data={certificates.data}
                loading={currentLoading}
                categories={certificates.categories}
                onAdd={openCreate}
                onEdit={(c) => openEdit(c)}
                onDelete={(c) => {
                  setDeleteImage(false)
                  askDelete(c)
                }}
                onPreview={(url) => setLightboxUrl(url)}
              />
            ) : section === 'photos' ? (
              <PhotoTable
                data={photos.data}
                loading={currentLoading}
                onAdd={openCreate}
                onEdit={(p) => openEdit(p)}
                onDelete={(p) => {
                  setDeleteImage(false)
                  askDelete(p)
                }}
                onPreview={(url) => setLightboxUrl(url)}
              />
            ) : section === 'experience' ? (
              <ExperienceTable
                data={experience.data}
                loading={currentLoading}
                onAdd={openCreate}
                onEdit={(x) => openEdit(x)}
                onDelete={(x) => {
                  setDeleteImage(false)
                  askDelete(x)
                }}
              />
            ) : section === 'skills' ? (
              <SkillsTable
                data={skills.data}
                loading={currentLoading}
                onAdd={openCreate}
                onEdit={(x) => openEdit(x)}
                onDelete={(x) => {
                  setDeleteImage(false)
                  askDelete(x)
                }}
              />
            ) : section === 'socials' ? (
              <SocialsTable
                data={socials.data}
                loading={currentLoading}
                onAdd={openCreate}
                onEdit={(x) => openEdit(x)}
                onDelete={(x) => {
                  setDeleteImage(false)
                  askDelete(x)
                }}
              />
            ) : (
              <BadgesTable
                data={badges.data}
                loading={currentLoading}
                onAdd={openCreate}
                onEdit={(x) => openEdit(x)}
                onDelete={(x) => {
                  setDeleteImage(false)
                  askDelete(x)
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Form modal */}
      {section === 'certificates' || section === 'photos' ? (
        <ItemFormModal
          open={formOpen}
          type={section === 'certificates' ? 'certificates' : 'photos'}
          mode={formMode}
          initial={formInitial as Certificate | Photo | undefined}
          onClose={closeForm}
          onSubmit={async (payload) => {
            await handlePhotoCertSubmit(payload)
          }}
        />
      ) : section === 'badges' ? (
        <BadgeFormModal
          open={formOpen}
          mode={formMode}
          initial={formInitial as CredlyBadge | undefined}
          onClose={closeForm}
          onSubmit={async (payload) => {
            await handleBadgeSubmit(payload)
          }}
        />
      ) : (
        <TextItemFormModal
          open={formOpen}
          type={section as 'experience' | 'skills' | 'socials'}
          mode={formMode}
          initial={formInitial as Experience | Skill | Social | undefined}
          onClose={closeForm}
          onSubmit={async (payload) => {
            await handleTextSubmit(payload)
          }}
        />
      )}

      {/* Delete modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        title={deleteTitle}
        description={deleteDesc}
        confirmText="Delete"
        cancelText="Cancel"
        confirmTone="danger"
        extra={
          section === 'photos' || section === 'certificates' ? (
            <div className="text-sm text-white/70 flex items-center gap-3">
              <span>Delete image file too?</span>
              <select
                value={deleteImage ? 'yes' : 'no'}
                onChange={(e) => setDeleteImage(e.target.value === 'yes')}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          ) : undefined
        }
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          void handleConfirmDelete()
        }}
      />

      {/* Lightbox */}
      {lightboxUrl ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxUrl(undefined)}
        >
          <div className="max-w-[92vw] max-h-[88vh] rounded-2xl border border-white/10 bg-black/30 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxUrl}
              alt="preview"
              className="max-w-[92vw] max-h-[88vh] rounded-xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
