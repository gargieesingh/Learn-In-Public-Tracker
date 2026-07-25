'use client'
import { useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
function Stat({ icon, label, value }: { icon: string; label: string; value: number }) { const [shown, setShown] = useState(0); useGSAP(() => { const number = { value: 0 }; gsap.to(number, { value, duration: 1.1, ease: 'power2.out', onUpdate: () => setShown(Math.floor(number.value)) }) }, [value]); return <article className="glass rounded-2xl p-5"><p className="text-sm text-muted">{icon} {label}</p><p className="mt-2 font-display text-3xl font-bold">{shown} <span className="text-base text-slate-400">days</span></p></article> }
export function StreakStats({ current, longest }: { current: number; longest: number }) { return <div className="grid grid-cols-2 gap-3"><Stat icon="🔥" label="Current Streak" value={current} /><Stat icon="🏆" label="Longest Streak" value={longest} /></div> }
