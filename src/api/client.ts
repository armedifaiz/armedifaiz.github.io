import type { CredlyBadge } from '../types/credly-badge'

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

// Important: call the backend directly from the browser.
// Worker-to-worker proxying currently returns Cloudflare error code 1042.
const base = 'https://portfolio-backend.armedifaiz.workers.dev/api/portfolio'

type OkResponse = { ok: true }

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

export type Experience = {
  role: string
  organization: string
  period: string
  duration: string
  type: string
  description: string
}

export type Skill = {
  name: string
  slug: string
  icon: string
}

export type Social = {
  platform: string
  url: string
  icon: string
}

export function experienceKey(x: Experience) {
  return `${x.role}|${x.period}`
}

export function skillKey(x: Skill) {
  return x.slug
}

export function socialKey(x: Social) {
  return x.platform
}

export function badgeKey(x: CredlyBadge) {
  return x.id
}

// --------------------
// Read endpoints
// --------------------

export async function listCertificates(): Promise<Certificate[]> {
  return apiFetch<Certificate[]>(`${base}/certificates`)
}

export async function listPhotos(): Promise<Photo[]> {
  return apiFetch<Photo[]>(`${base}/photos`)
}

export async function listExperience(): Promise<Experience[]> {
  return apiFetch<Experience[]>(`${base}/experience`)
}

export async function listSkills(): Promise<Skill[]> {
  return apiFetch<Skill[]>(`${base}/skills`)
}

export async function listSocials(): Promise<Social[]> {
  return apiFetch<Social[]>(`${base}/socials`)
}

export async function listBadges(): Promise<CredlyBadge[]> {
  return apiFetch<CredlyBadge[]>(`${base}/badges`)
}

// --------------------
// Upsert endpoints
// --------------------

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

export async function upsertExperience(params: { experience: Experience }): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: params.experience }),
  })
}

export async function upsertSkill(params: { skill: Skill }): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: params.skill }),
  })
}

export async function upsertSocial(params: { social: Social }): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/socials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: params.social }),
  })
}

export async function upsertBadge(params: { badge: CredlyBadge }): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/badges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: params.badge }),
  })
}

// --------------------
// Delete / Replace endpoints
// --------------------

export async function deleteCertificate(params: { id: string; deleteImage: boolean }): Promise<OkResponse> {
  return apiFetch<OkResponse>(
    `${base}/certificates/${encodeURIComponent(params.id)}?deleteImage=${params.deleteImage}`,
    {
      method: 'DELETE',
    },
  )
}

export async function deletePhoto(params: { id: string; deleteImage: boolean }): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/photos/${encodeURIComponent(params.id)}?deleteImage=${params.deleteImage}`, {
    method: 'DELETE',
  })
}

// For resources without per-item DELETE, we implement per-item deletion by:
// 1) optimistically filtering the item
// 2) PUT the full remaining document back.
export async function replaceExperience(items: Experience[]): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/experience`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  })
}

export async function replaceSkills(items: Skill[]): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/skills`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  })
}

export async function replaceSocials(items: Social[]): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/socials`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  })
}

export async function replaceBadges(items: CredlyBadge[]): Promise<OkResponse> {
  return apiFetch<OkResponse>(`${base}/badges`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  })
}
