'use client'

import type { Log } from '../../types'
import { LogCard } from './LogCard'

const dateLabel = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

export function LogFeed({ logs, loading, isOwner, topics, onDelete }: { logs: Log[]; loading: boolean; isOwner: boolean; topics: string[]; onDelete: (id: string) => Promise<void> }) {
  if (loading) return <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="skeleton-card" />)}</div>
  if (!logs.length) return <div className="empty-state">{isOwner ? 'No entries yet. Log what you learned today to start your streak.' : 'No entries are public here yet.'}</div>
  let lastDate = ''
  return <div className="space-y-3">{logs.map((log) => <div key={log.id}>{lastDate !== log.logged_date && (() => { lastDate = log.logged_date; return <p className="date-divider">{dateLabel(log.logged_date)}</p> })()}<LogCard log={log} topicIndex={Math.max(0, topics.indexOf(log.topic_tag))} isOwner={isOwner} onDelete={onDelete} /></div>)}</div>
}
