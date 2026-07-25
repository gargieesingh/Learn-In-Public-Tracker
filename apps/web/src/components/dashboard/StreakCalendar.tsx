'use client'

import { useMemo, useState } from 'react'
import type { Log } from '../../types'
import { Modal } from '../ui/Modal'
import { LogCard } from './LogCard'

const iso = (value: Date) => { const date = new Date(value); date.setHours(0, 0, 0, 0); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
const label = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })

export function StreakCalendar({ logs, isOwner, topics, onDelete }: { logs: Log[]; isOwner: boolean; topics: string[]; onDelete: (id: string) => Promise<void> }) {
  const [selected, setSelected] = useState<string | null>(null)
  const today = iso(new Date())
  const days = useMemo(() => { const end = new Date(); end.setHours(0, 0, 0, 0); end.setDate(end.getDate() - ((end.getDay() + 6) % 7)); return Array.from({ length: 84 }, (_, index) => { const day = new Date(end); day.setDate(end.getDate() - 83 + index); return day }) }, [])
  const logMap = new Map<string, Log[]>()
  logs.forEach((log) => logMap.set(log.logged_date, [...(logMap.get(log.logged_date) ?? []), log]))
  const selectedLogs = selected ? logMap.get(selected) ?? [] : []
  return <><section className="border-t border-[#dfd8cf] pt-6"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-xl font-semibold tracking-[-.04em] text-[#29241f]">12-week rhythm</h2><p className="mt-1 text-sm text-[#877d73]">A dot for every day you showed up.</p></div><span className="mt-2 flex items-center gap-1.5 text-xs text-[#7b736a]"><i className="h-2 w-2 rounded-full bg-[#527c67]" /> logged</span></div><div className="mt-6 grid grid-cols-7 gap-x-1 gap-y-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`} className="text-center text-[10px] font-semibold text-[#9b9187]">{day}</span>)}{days.map((day) => { const date = iso(day); const active = logMap.has(date); return <button key={date} onClick={() => setSelected(date)} title={label(date)} className="group flex aspect-square items-center justify-center"><i className={`h-3 w-3 rounded-full border transition duration-200 group-hover:scale-125 ${active ? 'border-[#527c67] bg-[#527c67]' : 'border-[#d9d1c8] bg-transparent'} ${date === today ? 'ring-2 ring-[#d7a65c] ring-offset-2 ring-offset-[#f6f3ee]' : ''}`} /></button> })}</div></section>{selected && <Modal title={`Notes from ${label(selected)}`} onClose={() => setSelected(null)}>{selectedLogs.length ? <div className="space-y-3">{selectedLogs.map((log) => <LogCard key={log.id} log={log} topicIndex={Math.max(0, topics.indexOf(log.topic_tag))} isOwner={isOwner} onDelete={onDelete} />)}</div> : <p className="text-[#776e65]">No learning log was added on this day.</p>}</Modal>}</>
}
