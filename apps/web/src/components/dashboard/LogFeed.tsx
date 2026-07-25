'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { Log } from '../../types'
import { LogCard } from './LogCard'
const dateLabel = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
export function LogFeed({ logs, loading, isOwner, topics, onDelete }: { logs: Log[]; loading: boolean; isOwner: boolean; topics: string[]; onDelete: (id: string) => Promise<void> }) {
  useGSAP(() => { if (!loading) gsap.from('.log-card', { y: 18, opacity: 0, stagger: .06, duration: .4, ease: 'power2.out' }) }, [logs, loading])
  if (loading) return <div className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="h-48 animate-shimmer rounded-2xl bg-[linear-gradient(90deg,#151522,#24243a,#151522)] bg-[length:200%_100%]" />)}</div>
  if (!logs.length) return <div className="glass rounded-2xl p-8 text-center text-slate-400">{isOwner ? 'No logs yet. Log your first learning above! 🚀' : 'No logs yet. Check back soon!'}</div>
  let lastDate = ''; return <div className="space-y-4">{logs.map((log) => <div key={log.id}>{lastDate !== log.logged_date && (() => { lastDate = log.logged_date; return <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">{dateLabel(log.logged_date)}</p> })()}<LogCard log={log} topicIndex={Math.max(0, topics.indexOf(log.topic_tag))} isOwner={isOwner} onDelete={onDelete} /></div>)}</div>
}
