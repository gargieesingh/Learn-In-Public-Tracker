'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useOwner } from '../../../hooks/useOwner'
import { useTracker } from '../../../hooks/useTracker'
import { useLogs } from '../../../hooks/useLogs'
import { api } from '../../../lib/api'
import type { Log } from '../../../types'
import { Badge, topicColors } from '../../../components/ui/Badge'
import { LogFeed } from '../../../components/dashboard/LogFeed'
import { LogForm } from '../../../components/dashboard/LogForm'
import { SharePanel } from '../../../components/dashboard/SharePanel'
import { StreakCalendar } from '../../../components/dashboard/StreakCalendar'
import { StreakStats } from '../../../components/dashboard/StreakStats'

export default function DashboardPage() {
  const params = useParams<{ slug: string }>(); const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug; const { tracker, loading: trackerLoading, error: trackerError, reload } = useTracker(slug); const { logs, setLogs, loading: logsLoading } = useLogs(slug); const { isOwner, ownerToken, checked } = useOwner(slug); const [shareOpen, setShareOpen] = useState(false)
  const url = typeof window === 'undefined' ? '' : `${window.location.origin}/u/${slug}`
  const since = useMemo(() => tracker ? new Date(tracker.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '', [tracker])
  const deleteLog = async (logId: string) => { if (!ownerToken) return; await api.deleteLog(slug, logId, ownerToken); setLogs((previous) => previous.filter((log) => log.id !== logId)); await reload() }
  const created = (log: Log) => { setLogs((previous) => [log, ...previous]); void reload() }
  if (trackerLoading) return <main className="grid min-h-screen place-items-center bg-bg text-slate-400">Loading learning log…</main>
  if (trackerError || !tracker) return <main className="grid min-h-screen place-items-center bg-bg p-6 text-center"><div><p className="font-display text-3xl font-bold">This learning log doesn’t exist yet.</p><Link href="/" className="mt-5 inline-block rounded-xl bg-accent px-5 py-3 font-bold">Start your own →</Link></div></main>
  const gradient = `linear-gradient(135deg, ${topicColors[tracker.slug.length % topicColors.length]}, ${topicColors[(tracker.slug.length + 3) % topicColors.length]})`
  return <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,rgba(108,99,255,.13),transparent_38%),#0A0A0F] px-4 py-7 sm:px-7"><div className="mx-auto max-w-5xl"><header className="glass rounded-3xl p-5 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div className="flex gap-4"><div style={{ background: gradient }} className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold text-bg">{tracker.name.slice(0, 1).toUpperCase()}</div><div><h1 className="font-display text-2xl font-bold sm:text-3xl">{tracker.name}&apos;s Learning Log</h1><div className="mt-2 flex flex-wrap gap-2">{tracker.topics.map((topic, index) => <Badge key={topic} index={index}>{topic}</Badge>)}</div><p className="mt-3 text-sm text-muted">Learning since: {since}</p></div></div><button onClick={() => setShareOpen(!shareOpen)} className="h-fit rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold transition hover:border-mint">Share ↗</button></div>{shareOpen && <div className="mt-5 border-t border-white/10 pt-5"><SharePanel url={url} /></div>}</header>{checked && !isOwner && <p className="mt-4 rounded-xl border border-mint/20 bg-mint/5 p-3 text-center text-sm text-mint">Viewing public mode — lost access? Open StreakLog on your original device.</p>}<section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.35fr]"><div className="space-y-5"><StreakStats current={tracker.current_streak} longest={tracker.longest_streak} /><StreakCalendar logs={logs} isOwner={isOwner} topics={tracker.topics} onDelete={deleteLog} /></div><div>{isOwner && ownerToken && <div className="mb-7"><LogForm tracker={tracker} ownerToken={ownerToken} existing={logs} onCreated={created} /></div>}<h2 className="mb-4 font-display text-2xl font-bold">Learning logs</h2><LogFeed logs={logs} loading={logsLoading} isOwner={isOwner} topics={tracker.topics} onDelete={deleteLog} /></div></section></div></main>
}
