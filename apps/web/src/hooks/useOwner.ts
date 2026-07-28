'use client'

import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export function useOwner(slug: string, accessToken: string | null) {
  const [isOwner, setIsOwner] = useState(false)
  const [ownerToken, setOwnerToken] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let active = true

    const check = async () => {
      setChecked(false)
      setIsOwner(false)
      setOwnerToken(null)

      if (accessToken) {
        try {
          const { isOwner: authenticatedOwner } = await api.getOwnership(slug, accessToken)
          if (!active) return
          if (authenticatedOwner) {
            setOwnerToken(accessToken)
            setIsOwner(true)
            setChecked(true)
            return
          }
        } catch {
          // Existing browser-owned profiles can still use their legacy token.
        }
      }

      try {
        const raw = localStorage.getItem('streaklog_owner_' + slug)
        if (raw) {
          const parsed = JSON.parse(raw) as { owner_token?: string }
          if (parsed.owner_token) {
            setOwnerToken(parsed.owner_token)
            setIsOwner(true)
          }
        }
      } catch {
        localStorage.removeItem('streaklog_owner_' + slug)
      }

      if (active) setChecked(true)
    }

    void check()
    return () => { active = false }
  }, [slug, accessToken])

  return { isOwner, ownerToken, checked }
}
