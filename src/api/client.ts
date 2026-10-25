export type ApiError = {
  error?: string
  detail?: string
  [k: string]: unknown
}

async function readJsonOrText(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init)
  const payload = await readJsonOrText(res)
  if (!res.ok) {
    const msg =
      typeof payload === 'string'
        ? payload
        : (payload as ApiError)?.error || (payload as ApiError)?.detail || res.statusText
    throw new Error(msg)
  }
  return payload as T
}

const base = '/api/portfolio'

export type Certificate = {
  id: string
  filename: string
  title: string
  issuer: string
  date: string
  description: string
  category: string
  imageUrl?: string
}

export type Photo = {
  id: string
  filename: string
  caption: string
  takenAt: string
  imageUrl?: string
}

export async function listCertificates(): Promise<Certificate[]> {
  return apiFetch<Certificate[]>(`${base}/certificates`)
}

export async function listPhotos(): Promise<Photo[]> {
  return apiFetch<Photo[]>(`${base}/photos`)
}

export async function upsertCertificate(params: {
  certificate: Omit<Certificate, 'imageUrl'>
  imageBase64?: string
}): Promise<{ ok: true; id: string; item: Certificate } | { ok: true; id: string }> {
  return apiFetch(`${base}/certificates/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      certificate: params.certificate,
      imageBase64: params.imageBase64,
    }),
  })
}

export async function upsertPhoto(params: {
  photo: Omit<Photo, 'imageUrl'>
  imageBase64?: string
}): Promise<{ ok: true; id: string; item: Photo } | { ok: true; id: string }> {
  return apiFetch(`${base}/photos/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      photo: params.photo,
      imageBase64: params.imageBase64,
    }),
  })
}

export async function deleteCertificate(params: { id: string; deleteImage: boolean }): Promise<{ ok: true }> {
  return apiFetch(`${base}/certificates/${encodeURIComponent(params.id)}?deleteImage=${params.deleteImage}`, {
    method: 'DELETE',
  })
}

export async function deletePhoto(params: { id: string; deleteImage: boolean }): Promise<{ ok: true }> {
  return apiFetch(`${base}/photos/${encodeURIComponent(params.id)}?deleteImage=${params.deleteImage}`, {
    method: 'DELETE',
  })
}

