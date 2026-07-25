export function generateSlug(name: string, primaryTopic: string): string {
  const clean = (value: string) => value.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${clean(name)}-${clean(primaryTopic)}`
}

export function generateOwnerToken(): string {
  return crypto.randomUUID()
}
