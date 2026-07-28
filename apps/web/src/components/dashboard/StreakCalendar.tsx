'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { Log } from '../../types'
import { Modal } from '../ui/Modal'
import { LogCard } from './LogCard'

type Range = 'week' | 'month' | 'year'

const iso = (value: Date) => { const date = new Date(value); date.setHours(0, 0, 0, 0); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
const label = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()

export function StreakCalendar({ logs, isOwner, topics, onDelete }: { logs: Log[]; isOwner: boolean; topics: string[]; onDelete: (id: string) => Promise<void> }) {
  const root = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [range, setRange] = useState<Range>('week')
  const now = new Date()
  const logMap = new Map<string, Log[]>()
  logs.forEach((log) => logMap.set(log.logged_date, [...(logMap.get(log.logged_date) ?? []), log]))
  const selectedLogs = selected ? logMap.get(selected) ?? [] : []
  const weekDays = Array.from({ length: 7 }, (_, index) => { const day = new Date(now); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - 6 + index); return day })
  const monthDays = Array.from({ length: daysInMonth(now.getFullYear(), now.getMonth()) }, (_, index) => new Date(now.getFullYear(), now.getMonth(), index + 1))
  const monthOffset = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  const yearMonths = Array.from({ length: 12 }, (_, month) => Array.from({ length: daysInMonth(now.getFullYear(), month) }, (_, index) => new Date(now.getFullYear(), month, index + 1)))

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo('.calendar-view', { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
    gsap.fromTo('.calendar-chip.is-active', { backgroundColor: '#93C5FD' }, { backgroundColor: '#1E3A8A', duration: 0.28, stagger: 0.012, ease: 'power1.out' })
  }, { scope: root, dependencies: [range, logs] })

  const chip = (day: Date, content: React.ReactNode, compact = false) => {
    const date = iso(day)
    const active = logMap.has(date)
    return <button key={date} onClick={() => setSelected(date)} title={label(date)} aria-label={`View entries from ${label(date)}`} className={`calendar-chip ${active ? 'is-active' : ''} ${compact ? 'is-compact' : ''}`}><span>{content}</span>{!compact && <strong>{day.getDate()}</strong>}</button>
  }
  const monthTitle = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return <>
    <section ref={root} className="activity-card">
      <div className="activity-card__head"><div><h2>Streak</h2><p>{monthTitle}</p></div><span className="activity-card__range">{range}</span></div>
      <div className="segment-toggle" role="group" aria-label="Streak time scale">{(['week', 'month', 'year'] as Range[]).map((item) => <button key={item} type="button" onClick={() => setRange(item)} className={range === item ? 'is-active' : ''}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
      {range === 'week' && <div className="calendar-view calendar-week">{weekDays.map((day) => chip(day, day.toLocaleDateString(undefined, { weekday: 'short' })))}</div>}
      {range === 'month' && <div className="calendar-view calendar-month">{Array.from({ length: monthOffset }, (_, index) => <span key={`blank-${index}`} />)}{monthDays.map((day) => chip(day, day.toLocaleDateString(undefined, { weekday: 'narrow' })))}</div>}
      {range === 'year' && <div className="calendar-view calendar-year">{yearMonths.map((days, month) => <section key={month} className="month-strip"><h3>{new Date(now.getFullYear(), month, 1).toLocaleDateString(undefined, { month: 'short' })}</h3><div className="month-strip__days">{days.map((day) => chip(day, '', true))}</div></section>)}</div>}
    </section>
    {selected && <Modal title={`Entries from ${label(selected)}`} onClose={() => setSelected(null)}>{selectedLogs.length ? <div className="space-y-3">{selectedLogs.map((log) => <LogCard key={log.id} log={log} topicIndex={Math.max(0, topics.indexOf(log.topic_tag))} isOwner={isOwner} onDelete={onDelete} />)}</div> : <p className="text-sm text-[var(--muted)]">No entries were recorded on this date.</p>}</Modal>}
  </>
}
