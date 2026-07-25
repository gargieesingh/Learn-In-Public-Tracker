'use client'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Log } from '../types'

export function useLogs(slug: string) {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reload = useCallback(async () => { setLoading(true); try { setLogs((await api.getLogs(slug)).logs); setError(null) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load logs.') } finally { setLoading(false) } }, [slug])
  useEffect(() => { void reload() }, [reload])
  return { logs, setLogs, loading, error, reload }
}
