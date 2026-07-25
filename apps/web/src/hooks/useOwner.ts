'use client'
import { useEffect, useState } from 'react'

export function useOwner(slug: string) {
  const [isOwner, setIsOwner] = useState(false)
  const [ownerToken, setOwnerToken] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`streaklog_owner_${slug}`)
      if (raw) {
        const parsed = JSON.parse(raw) as { owner_token?: string }
        if (parsed.owner_token) { setOwnerToken(parsed.owner_token); setIsOwner(true) }
      }
    } catch { localStorage.removeItem(`streaklog_owner_${slug}`) }
    setChecked(true)
  }, [slug])
  return { isOwner, ownerToken, checked }
}
