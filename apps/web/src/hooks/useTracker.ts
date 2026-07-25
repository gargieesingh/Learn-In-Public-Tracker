'use client'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Tracker } from '../types'

export function useTracker(slug: string) {
  const [tracker, setTracker] = useState<Tracker | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reload = useCallback(async () => { setLoading(true); setError(null); try { setTracker(await api.getTracker(slug)) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load this log.') } finally { setLoading(false) } }, [slug])
  useEffect(() => { void reload() }, [reload])
  return { tracker, loading, error, reload }
}
