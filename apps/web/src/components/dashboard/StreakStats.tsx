'use client'

import { useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  const [shown, setShown] = useState(0)
  useGSAP(() => { const number = { value: 0 }; gsap.to(number, { value, duration: 1.05, ease: 'power2.out', onUpdate: () => setShown(Math.floor(number.value)) }) }, [value])
  return <article className="border-t border-[#dfd8cf] pt-4"><p className="text-sm font-medium text-[#776e65]">{label}</p><p style={{ color: accent }} className="mt-2 font-display text-5xl font-semibold leading-none tracking-[-.07em] tabular-nums">{shown}</p><p className="mt-2 text-xs text-[#92887e]">days in a row</p></article>
}

export function StreakStats({ current, longest }: { current: number; longest: number }) {
  return <div className="grid grid-cols-2 gap-6"><Stat label="Current streak" value={current} accent="#527c67" /><Stat label="Longest streak" value={longest} accent="#bd694b" /></div>
}
