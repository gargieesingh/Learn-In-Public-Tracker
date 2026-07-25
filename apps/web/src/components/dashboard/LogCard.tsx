'use client'
/* eslint-disable @next/next/no-img-element -- remote Supabase URLs and click-to-expand behavior use native images deliberately. */
import { useState } from 'react'
import gsap from 'gsap'
import type { Log } from '../../types'
import { Badge } from '../ui/Badge'

const prettyDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
export function LogCard({ log, topicIndex, isOwner, onDelete }: { log: Log; topicIndex: number; isOwner: boolean; onDelete?: (id: string) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false); const [imageError, setImageError] = useState(false); const [deleting, setDeleting] = useState(false)
  const remove = async () => { if (!onDelete || !confirm('Delete this log? This cannot be undone.')) return; setDeleting(true); const element = document.querySelector(`[data-log-id="${log.id}"]`); if (element) await new Promise<void>((resolve) => { gsap.to(element, { height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, duration: .3, onComplete: resolve }) }); await onDelete(log.id) }
  return <article data-log-id={log.id} className="log-card glass overflow-hidden rounded-2xl p-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Badge index={topicIndex}>{log.topic_tag}</Badge><span className="text-xs text-muted">• {prettyDate(log.logged_date)}</span></div>{isOwner && <button disabled={deleting} onClick={() => void remove()} aria-label="Delete this log" className="rounded-lg p-2 text-muted transition hover:bg-red-500/15 hover:text-red-300">🗑</button>}</div><p className={`mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-200 ${expanded ? '' : 'line-clamp-3'}`}>{log.content}</p>{log.content.length > 180 && <button onClick={() => setExpanded(!expanded)} className="mt-2 text-xs font-bold text-mint">{expanded ? 'Show less' : 'Read more'}</button>}{imageError ? <div className="mt-4 grid h-44 place-items-center rounded-xl bg-white/5 text-sm text-muted">Image unavailable</div> : <img src={log.image_url} alt={`Learning log for ${log.topic_tag}`} loading="lazy" onError={() => setImageError(true)} className="mt-4 h-56 w-full cursor-zoom-in rounded-xl object-cover" onClick={(event) => { const image = event.currentTarget; image.classList.toggle('h-56'); image.classList.toggle('h-auto') }} />}</article>
}
