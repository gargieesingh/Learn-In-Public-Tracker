'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useOwner } from '../../../hooks/useOwner'
import { useAuth } from '../../../hooks/useAuth'
import { useTracker } from '../../../hooks/useTracker'
import { useLogs } from '../../../hooks/useLogs'
import { api } from '../../../lib/api'
import type { Log } from '../../../types'
import { LogFeed } from '../../../components/dashboard/LogFeed'
import { LogForm } from '../../../components/dashboard/LogForm'
import { SharePanel } from '../../../components/dashboard/SharePanel'
import { StreakCalendar } from '../../../components/dashboard/StreakCalendar'
import { Modal } from '../../../components/ui/Modal'

const tagClass = ['tag tag--orange', 'tag tag--peach', 'tag tag--cream']

export default function DashboardPage() {
  const params = useParams<{ slug: string }>()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const { tracker, loading: trackerLoading, error: trackerError, reload } = useTracker(slug)
  const { logs, setLogs, loading: logsLoading } = useLogs(slug)
  const { accessToken } = useAuth()
  const { isOwner, ownerToken, checked } = useOwner(slug, accessToken)
  const [shareOpen, setShareOpen] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const composer = useRef<HTMLDivElement>(null)
  const url = typeof window === 'undefined' ? '' : `${window.location.origin}/u/${slug}`
  const since = useMemo(() => tracker ? new Date(tracker.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '', [tracker])
  const entriesThisMonth = useMemo(() => { const currentMonth = new Date().toISOString().slice(0, 7); return logs.filter((log) => log.logged_date.startsWith(currentMonth)).length }, [logs])

  const closeComposer = () => {
    const element = composer.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setComposerOpen(false); return }
    gsap.to(element, { y: 22, opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: () => setComposerOpen(false) })
  }
  const openComposer = () => {
    setComposerOpen(true)
    window.setTimeout(() => {
      if (!composer.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { gsap.set(composer.current, { clearProps: 'all' }); return }
      gsap.fromTo(composer.current, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, ease: 'power2.out' })
    }, 0)
  }
  const deleteLog = async (id: string) => {
    if (!ownerToken) return
    await api.deleteLog(slug, id, ownerToken)
    setLogs((items) => items.filter((log) => log.id !== id))
    await reload()
  }
  const created = (log: Log) => {
    setLogs((items) => [log, ...items])
    void reload()
    window.setTimeout(closeComposer, 0)
  }

  if (trackerLoading) return <main className="page-shell grid place-items-center px-6 text-sm text-[var(--text-secondary)]">Loading learning log...</main>
  if (trackerError || !tracker) return <main className="page-shell grid place-items-center p-6 text-center"><div><p className="font-display text-3xl font-semibold tracking-tight">This learning log does not exist.</p><Link href="/" className="accent-button inline-block">Start a learning log</Link></div></main>

  return <main id="main-content" className="dashboard-shell">
    <header className="site-header"><div className="site-header__inner"><Link href="/" className="wordmark"><span className="wordmark__mark">L</span>Learn In Pub</Link><div className="flex items-center gap-3"><button onClick={() => setShareOpen(true)} aria-label="Share this learning log" className="share-trigger"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .06 2.12L8.9 9.71a3 3 0 1 0 0 4.58l6.16 3.59A3 3 0 1 0 18 16a3 3 0 0 0-2.94 2.4l-6.16-3.6a3 3 0 0 0 0-1.6l6.16-3.6A3 3 0 0 0 18 8Z" /></svg></button></div></div></header>
    {shareOpen && <Modal title="Share your learning log" onClose={() => setShareOpen(false)}><SharePanel url={url} /></Modal>}
    <div className="dashboard-grid">
      <section className="min-w-0">
        {checked && !isOwner && <p className="public-notice">Public view. Sign in as the owner to add or remove learning entries.</p>}
        <section className={checked && !isOwner ? 'mt-6' : ''}><div className="section-heading"><div><p className="eyebrow">{tracker.name}&apos;s public record</p><h1>Learning entries</h1><p>Dated notes from the learning log.</p></div><span className="section-count">{logs.length} entries</span></div><LogFeed logs={logs} loading={logsLoading} isOwner={isOwner} topics={tracker.topics} onDelete={deleteLog} /></section>
      </section>
      <aside className="feed-rail lg:sticky lg:top-5"><div className="feed-rail__inner"><div className="profile-top"><span className="profile-initial">{tracker.name.slice(0, 1).toUpperCase()}</span><div><h2 className="profile-title">{tracker.name}&apos;s learning log</h2><p className="profile-meta">Learning {tracker.topics[0]} since {since}</p></div></div><div className="profile-tags">{tracker.topics.map((topic, index) => <span key={topic} className={tagClass[index % tagClass.length]}>{topic}</span>)}</div><div className="profile-real-stats"><div><strong>{tracker.current_streak}</strong><span>day streak</span></div><div><strong>{entriesThisMonth}</strong><span>entries this month</span></div><div><strong>{tracker.longest_streak}</strong><span>longest streak</span></div></div></div><section className="side-card"><StreakCalendar logs={logs} isOwner={isOwner} topics={tracker.topics} onDelete={deleteLog} /></section></aside>
    </div>
    {isOwner && ownerToken && <><button onClick={composerOpen ? closeComposer : openComposer} aria-label={composerOpen ? 'Close log entry form' : 'Create a learning log entry'} className="composer-fab">{composerOpen ? '×' : '+'}</button>{composerOpen && <div className="composer-backdrop" onMouseDown={closeComposer}><div ref={composer} onMouseDown={(event) => event.stopPropagation()} className="composer-dock"><LogForm tracker={tracker} ownerToken={ownerToken} existing={logs} onCreated={created} /></div></div>}</>}
  </main>
}
