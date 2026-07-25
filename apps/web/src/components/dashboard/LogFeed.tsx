'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { Log } from '../../types'
import { LogCard } from './LogCard'

const dateLabel = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
export function LogFeed({ logs, loading, isOwner, topics, onDelete }: { logs: Log[]; loading: boolean; isOwner: boolean; topics: string[]; onDelete: (id: string) => Promise<void> }) {
  useGSAP(() => { if (!loading) gsap.from('.log-card', { y: 14, opacity: 0, stagger: .05, duration: .38, ease: 'power2.out' }) }, [logs, loading])
  if (loading) return <div className="space-y-2">{[1, 2, 3].map((item) => <div key={item} className="h-28 animate-shimmer bg-[linear-gradient(90deg,#ece7df,#f7f4ef,#ece7df)] bg-[length:200%_100%]" />)}</div>
  if (!logs.length) return <div className="border-t border-[#dfd8cf] py-10 text-sm leading-6 text-[#82786f]">{isOwner ? 'Your first note will become the start of this archive.' : 'There are no learning notes here yet.'}</div>
  let lastDate = ''; return <div>{logs.map((log) => <div key={log.id}>{lastDate !== log.logged_date && (() => { lastDate = log.logged_date; return <p className="pt-5 text-xs font-medium text-[#93897f]">{dateLabel(log.logged_date)}</p> })()}<LogCard log={log} topicIndex={Math.max(0, topics.indexOf(log.topic_tag))} isOwner={isOwner} onDelete={onDelete} /></div>)}</div>
}
