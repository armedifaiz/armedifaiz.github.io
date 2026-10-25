import React from 'react'

export default function DeleteConfirmModal(props: {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onCancel: () => void
  onConfirm: () => void
  confirmTone?: 'danger' | 'default'
  extra?: React.ReactNode
}) {
  const {
    open,
    title,
    description,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onCancel,
    onConfirm,
    confirmTone = 'danger',
    extra,
  } = props

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-base-900/60 p-5 backdrop-blur">
        <div className="text-white font-semibold">{title}</div>
        {description ? <div className="mt-2 text-sm text-white/60">{description}</div> : null}

        <div className="mt-5 flex items-center justify-end gap-3">
          {extra ? <div className="mr-auto">{extra}</div> : null}
          <button
            onClick={onCancel}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={
              confirmTone === 'danger'
                ? 'rounded-xl border border-red-500/50 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/20'
                : 'rounded-xl border border-accent/50 bg-accent/15 px-4 py-2 text-sm font-semibold text-accent-200 hover:bg-accent/20'
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

