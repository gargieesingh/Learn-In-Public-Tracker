import type { ApiResponse, CreateTrackerPayload, Log, Tracker } from '../types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)
  const body = await response.json().catch(() => ({ error: 'Something went wrong.' })) as ApiResponse<T>
  if (!response.ok || body.error) throw new Error(body.error ?? 'Request failed.')
  return body.data
}

export const api = {
  createTracker: (payload: CreateTrackerPayload) => request<{ slug: string; owner_token: string; name: string; topics: string[] }>('/api/trackers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  getTracker: (slug: string) => request<Tracker>(`/api/trackers/${encodeURIComponent(slug)}`),
  getLogs: (slug: string, date?: string) => request<{ logs: Log[] }>(`/api/logs/${encodeURIComponent(slug)}${date ? `?date=${date}` : ''}`),
  createLog: (slug: string, ownerToken: string, payload: FormData) => request<Log>(`/api/logs/${encodeURIComponent(slug)}`, { method: 'POST', headers: { Authorization: `Bearer ${ownerToken}` }, body: payload }),
  deleteLog: (slug: string, logId: string, ownerToken: string) => request<{ success: true }>(`/api/logs/${encodeURIComponent(slug)}/${logId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${ownerToken}` } })
}
