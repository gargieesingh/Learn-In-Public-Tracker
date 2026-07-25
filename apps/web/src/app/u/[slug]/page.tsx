'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useOwner } from '../../../hooks/useOwner'
import { useTracker } from '../../../hooks/useTracker'
import { useLogs } from '../../../hooks/useLogs'
import { api } from '../../../lib/api'
import type { Log } from '../../../types'
import { LogFeed } from '../../../components/dashboard/LogFeed'
import { LogForm } from '../../../components/dashboard/LogForm'
import { SharePanel } from '../../../components/dashboard/SharePanel'
import { StreakCalendar } from '../../../components/dashboard/StreakCalendar'
import { StreakStats } from '../../../components/dashboard/StreakStats'

export default function DashboardPage() {
  const params = useParams<{ slug: string }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const { tracker, loading: trackerLoading, error: trackerError, reload } = useTracker(slug)
  const { logs, setLogs, loading: logsLoading } = useLogs(slug)
  const { isOwner, ownerToken, checked } = useOwner(slug)
  const [shareOpen, setShareOpen] = useState(false)
  const root = useRef<HTMLElement>(null)
  const url = typeof window === 'undefined' ? '' : `${window.location.origin}/u/${slug}`
  const since = useMemo(() => tracker ? new Date(tracker.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '', [tracker])
  useGSAP(() => { gsap.from('.dashboard-enter', { y: 18, opacity: 0, stagger: .08, duration: .5, ease: 'power2.out' }) }, { scope: root })
  const deleteLog = async (logId: string) => { if (!ownerToken) return; await api.deleteLog(slug, logId, ownerToken); setLogs((previous) => previous.filter((log) => log.id !== logId)); await reload() }
  const created = (log: Log) => { setLogs((previous) => [log, ...previous]); void reload() }
  if (trackerLoading) return <main className="grid min-h-[100dvh] place-items-center bg-[#f4f1eb] text-sm text-[#80766d]">Loading learning log…</main>
  if (trackerError || !tracker) return <main className="grid min-h-[100dvh] place-items-center bg-[#f4f1eb] p-6 text-center"><div><p className="font-display text-3xl font-semibold tracking-[-.05em] text-[#29241f]">This learning log does not exist.</p><Link href="/" className="mt-5 inline-block bg-[#29241f] px-5 py-3 text-sm font-semibold text-white">Start your own →</Link></div></main>
  return <main ref={root} className="min-h-[100dvh] overflow-x-hidden bg-[#f4f1eb] px-5 py-5 text-[#29241f] sm:px-8 sm:py-7 lg:px-12"><div className="mx-auto max-w-[1540px]"><header className="dashboard-enter flex items-center justify-between border-b border-[#dcd4ca] pb-5"><Link href="/" className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-[.6rem] bg-[#29241f] font-display text-sm font-semibold text-[#e3b56d]">S</span><span className="font-display text-lg font-semibold tracking-[-.04em]">StreakLog</span></Link><div className="flex items-center gap-4"><button onClick={() => setShareOpen(!shareOpen)} className="text-sm font-medium text-[#5e564e] transition hover:text-[#527c67]">Share</button><span className="grid h-8 w-8 place-items-center rounded-full bg-[#527c67] text-sm font-semibold text-white">{tracker.name.slice(0, 1).toUpperCase()}</span></div></header>{shareOpen && <div className="dashboard-enter border-b border-[#dcd4ca] py-4"><SharePanel url={url} /></div>}{checked && !isOwner && <p className="dashboard-enter border-b border-[#dcd4ca] py-3 text-sm text-[#7a7168]">Public view. Access to edit this log stays on its original device.</p>}<section className="grid lg:grid-cols-[minmax(15rem,.84fr)_minmax(22rem,1.1fr)_minmax(20rem,1fr)]"><aside className="dashboard-enter py-10 lg:border-r lg:border-[#dcd4ca] lg:pr-10"><p className="text-sm font-medium text-[#867c72]">Learning since {since}</p><h1 className="mt-3 max-w-md text-balance font-display text-[clamp(2.8rem,4.2vw,5.1rem)] font-semibold leading-[.92] tracking-[-.07em]">{tracker.name}&apos;s<br />learning log</h1><div className="mt-10"><StreakStats current={tracker.current_streak} longest={tracker.longest_streak} /></div><div className="mt-10"><StreakCalendar logs={logs} isOwner={isOwner} topics={tracker.topics} onDelete={deleteLog} /></div><p className="mt-10 max-w-xs border-t border-[#dfd8cf] pt-5 text-sm leading-6 text-[#81776d]">Consistency is the quiet record of your effort.</p></aside><section className="dashboard-enter py-10 lg:border-r lg:border-[#dcd4ca] lg:px-10">{isOwner && ownerToken ? <LogForm tracker={tracker} ownerToken={ownerToken} existing={logs} onCreated={created} /> : <div className="border-y border-[#dfd8cf] py-7"><h2 className="font-display text-2xl font-semibold tracking-[-.045em]">A public record</h2><p className="mt-3 max-w-sm text-sm leading-6 text-[#7d7369]">This page is shared in public mode. Follow the notes and the rhythm behind them.</p><div className="mt-9 h-36 border-b border-[#dfd8cf] bg-[linear-gradient(135deg,transparent_0%,transparent_49.5%,#e1d8ce_50%,transparent_50.5%)]" /></div>}</section><section className="dashboard-enter py-10 lg:pl-10"><div className="flex items-baseline justify-between border-b border-[#dfd8cf] pb-4"><div><h2 className="font-display text-2xl font-semibold tracking-[-.045em]">Learning notes</h2><p className="mt-1 text-sm text-[#857a70]">The latest work, in order.</p></div><span className="text-xs text-[#93897f]">{logs.length} entries</span></div><LogFeed logs={logs} loading={logsLoading} isOwner={isOwner} topics={tracker.topics} onDelete={deleteLog} /></section></section></div></main>
}
