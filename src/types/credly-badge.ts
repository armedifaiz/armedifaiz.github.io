export interface CredlyBadge {
  id: string
  name: string
  description: string
  issuer: string
  source: string
  level: string
  issue_date: string
  expiration_date: string | null
  image_url: string
  badge_url: string
  skills: string[]
  state: string
  verified: boolean
}
