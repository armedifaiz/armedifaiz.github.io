import { useState } from 'react'
import Sidebar, { type AdminSection } from '../components/Sidebar'
import CertificateTable from '../components/CertificateTable'
import PhotoTable from '../components/PhotoTable'
import ItemFormModal from '../components/ItemFormModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import type { Certificate, Photo } from '../../api/client'
import { useCertificates } from '../hooks/useCertificates'
import { usePhotos } from '../hooks/usePhotos'

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>('certificates')

  const certificates = useCertificates()
  const photos = usePhotos()

  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const pushToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg })
    window.setTimeout(() => setToast(null), 3200)
  }

  // Modal states
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [formInitial, setFormInitial] = useState<Certificate | Photo | undefined>(undefined)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Certificate | Photo | undefined>(undefined)
  const [deleteImage, setDeleteImage] = useState(false)

  const [lightboxUrl, setLightboxUrl] = useState<string | undefined>(undefined)

  const currentLoading = section === 'certificates' ? certificates.loading : photos.loading

  const closeForm = () => {
    setFormOpen(false)
  }

  const openCreate = () => {
    setFormMode('create')
    setFormInitial(undefined)
    setFormOpen(true)
  }

  const openEdit = (item: Certificate | Photo) => {
    setFormMode('edit')
    setFormInitial(item)
    setFormOpen(true)
  }

  const askDelete = (item: Certificate | Photo) => {
    setDeleteTarget(item)
    setDeleteOpen(true)
  }

  const handleSubmit = async (payload: {
    certificate?: Omit<Certificate, 'imageUrl'>
    photo?: Omit<Photo, 'imageUrl'>
    imageBase64?: string
  }) => {
    try {
      if (section === 'certificates' && payload.certificate) {
        const ok = await certificates.upsert({ certificate: payload.certificate, imageBase64: payload.imageBase64 })
        if (!ok) {
          pushToast('err', certificates.error || 'Update failed')
          return
        }
        pushToast('ok', formMode === 'create' ? 'Certificate created' : 'Certificate updated')
      }
      if (section === 'photos' && payload.photo) {
        const ok = await photos.upsert({ photo: payload.photo, imageBase64: payload.imageBase64 })
        if (!ok) {
          pushToast('err', photos.error || 'Update failed')
          return
        }
        pushToast('ok', formMode === 'create' ? 'Photo created' : 'Photo updated')
      }
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
      } else {
        const item = deleteTarget as Photo
        const ok = await photos.remove(item.id, deleteImage)
        if (!ok) return pushToast('err', photos.error || 'Delete failed')
        pushToast('ok', 'Photo deleted')
      }
      setDeleteOpen(false)
    } catch (e) {
      pushToast('err', (e as Error).message)
    }
  }

  const sectionTypeForModal = section === 'certificates' ? 'certificates' : 'photos'

  const deleteTitle = section === 'certificates' ? 'Delete certificate?' : 'Delete photo?'
  const deleteDesc = section === 'certificates' ? 'This will remove certificate metadata (and optionally the image file).' : 'This will remove photo metadata (and optionally the image file).' 

  return (
    <div className="min-h-screen bg-base-950 text-white">
      <div className="flex">
        <Sidebar section={section} onSectionChange={setSection} />

        <main className="flex-1 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-semibold">{section === 'certificates' ? 'Certificates' : 'Photos'} Manager</div>
              <div className="text-xs text-white/60">Instant list update (optimistic + rollback)</div>
            </div>
          </div>

          {toast ? (
            <div className={toast.type === 'ok' ? 'mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-200' : 'mt-4 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200'}>
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
            ) : (
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
            )}
          </div>
        </main>
      </div>

      {/* Form modal */}
      <ItemFormModal
        open={formOpen}
        type={sectionTypeForModal}
        mode={formMode}
        initial={formInitial}
        onClose={closeForm}
        onSubmit={async (payload) => {
          await handleSubmit(payload)
        }}
      />

      {/* Delete modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        title={deleteTitle}
        description={deleteDesc}
        confirmText="Delete"
        cancelText="Cancel"
        confirmTone="danger"
        extra={
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
            <img src={lightboxUrl} alt="preview" className="max-w-[92vw] max-h-[88vh] rounded-xl object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

