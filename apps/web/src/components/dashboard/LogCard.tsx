'use client'
/* eslint-disable @next/next/no-img-element -- Supabase media uses native image behavior and a click-to-expand treatment. */

import { useState } from 'react'
import gsap from 'gsap'
import type { Log } from '../../types'

const prettyDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
export function LogCard({ log, topicIndex, isOwner, onDelete }: { log: Log; topicIndex: number; isOwner: boolean; onDelete?: (id: string) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false); const [imageError, setImageError] = useState(false); const [deleting, setDeleting] = useState(false)
  const remove = async () => { if (!onDelete || !confirm('Delete this log? This cannot be undone.')) return; setDeleting(true); const element = document.querySelector(`[data-log-id="${log.id}"]`); if (element) await new Promise<void>((resolve) => gsap.to(element, { height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, duration: .28, onComplete: resolve })); await onDelete(log.id) }
  const accent = ['#527c67', '#bd694b', '#bf9350', '#718595'][topicIndex % 4]
  return <article data-log-id={log.id} className="log-card grid grid-cols-[3.7rem_minmax(0,1fr)] gap-4 border-b border-[#e2dbd2] py-5 last:border-b-0"><time className="pt-0.5 text-sm font-medium leading-5 text-[#80766d]">{prettyDate(log.logged_date)}</time><div className="min-w-0"><div className="flex items-start justify-between gap-3"><div><span style={{ color: accent }} className="text-xs font-semibold">{log.topic_tag}</span><p className={`mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[#403a35] ${expanded ? '' : 'line-clamp-3'}`}>{log.content}</p></div>{isOwner && <button disabled={deleting} onClick={() => void remove()} aria-label="Delete this log" className="rounded-md px-2 py-1 text-xs text-[#9a6b60] transition hover:bg-[#f7e8e4]">Delete</button>}</div>{log.content.length > 180 && <button onClick={() => setExpanded(!expanded)} className="mt-2 text-xs font-semibold text-[#527c67]">{expanded ? 'Show less' : 'Read more'}</button>}{imageError ? <div className="mt-4 grid h-24 place-items-center bg-[#eee9e2] text-xs text-[#8b8177]">Image unavailable</div> : <img src={log.image_url} alt={`Learning log for ${log.topic_tag}`} loading="lazy" onError={() => setImageError(true)} className="mt-4 h-28 w-full cursor-zoom-in object-cover transition hover:opacity-90" onClick={(event) => { const image = event.currentTarget; image.classList.toggle('h-28'); image.classList.toggle('h-auto') }} />}</div></article>
}
