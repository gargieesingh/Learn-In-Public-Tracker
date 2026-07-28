'use client'
/* eslint-disable @next/next/no-img-element -- Supabase media uses native image behavior. */

import { useState } from 'react'
import gsap from 'gsap'
import type { Log } from '../../types'

const prettyDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export function LogCard({ log, topicIndex, isOwner, onDelete }: { log: Log; topicIndex: number; isOwner: boolean; onDelete?: (id: string) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const remove = async () => {
    if (!onDelete || !confirm('Delete this log? This cannot be undone.')) return
    setDeleting(true)
    const element = document.querySelector(`[data-log-id="${log.id}"]`)
    if (element) await new Promise<void>((resolve) => gsap.to(element, { height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, duration: 0.28, onComplete: resolve }))
    await onDelete(log.id)
  }
  const tagClass = ['tag tag--orange', 'tag tag--peach', 'tag tag--cream'][topicIndex % 3]
  return <article data-log-id={log.id} className="log-card"><div className="log-card__grid"><time className="log-date">{prettyDate(log.logged_date)}</time><div className="log-body"><div className="log-card__head"><div className="min-w-0"><div className="log-meta"><span className={tagClass}>{log.topic_tag}</span><span className="log-card-date">{prettyDate(log.logged_date)}</span></div><p className={`log-copy whitespace-pre-wrap ${expanded ? '' : 'line-clamp-3'}`}>{log.content}</p></div>{isOwner && <button disabled={deleting} onClick={() => void remove()} aria-label="Delete this log" className="delete-button">Delete</button>}</div>{log.content.length > 180 && <button onClick={() => setExpanded(!expanded)} className="text-link mt-2">{expanded ? 'Show less' : 'Read more'}</button>}{imageError ? <div className="empty-state mt-4 py-6">Image unavailable</div> : <img src={log.image_url} alt={`Learning log for ${log.topic_tag}`} loading="lazy" onError={() => setImageError(true)} className="log-image" />}</div></div></article>
}
