'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { api } from '../../lib/api'
import { TopicSelector } from './TopicSelector'
import { SharePanel } from '../dashboard/SharePanel'

const words = ['A record of', 'the days you', 'chose to learn.']

export function HeroSection() {
  const root = useRef<HTMLElement>(null)
  const router = useRouter()
  const [name, setName] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [customTopic, setCustomTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<{ slug: string; name: string } | null>(null)

  useGSAP(() => {
    const timeline = gsap.timeline()
    timeline.from('.landing-brand', { opacity: 0, y: -12, duration: .45, ease: 'power2.out' })
      .from('.headline-word', { opacity: 0, y: 48, stagger: .1, duration: .75, ease: 'power3.out' }, '-=.18')
      .from('.landing-copy', { opacity: 0, y: 16, duration: .45 }, '-=.35')
      .from('.focus-dial', { opacity: 0, scale: .86, duration: .55, ease: 'back.out(1.3)' }, '-=.25')
      .from('.form-card', { opacity: 0, x: 36, duration: .65, ease: 'power3.out' }, '-=.5')
    gsap.to('.ambient-orbit', { rotate: 360, duration: 34, repeat: -1, ease: 'none' })
  }, { scope: root })

  const valid = /^[a-zA-Z ]{2,50}$/.test(name.trim()) && topics.length > 0 && (!topics.includes('Other') || customTopic.trim().length > 1)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!valid) return
    setLoading(true)
    setError('')
    try {
      const tracker = await api.createTracker({ name: name.trim(), topics, customTopic })
      localStorage.setItem(`streaklog_owner_${tracker.slug}`, JSON.stringify({ owner_token: tracker.owner_token }))
      setCreated({ slug: tracker.slug, name: tracker.name })
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Could not create your page.'
      setError(message === 'Failed to fetch' ? 'The StreakLog API is offline. Set the Supabase values in apps/api/.env, then restart npm run dev.' : message)
    } finally { setLoading(false) }
  }

  const url = created ? `${window.location.origin}/u/${created.slug}` : ''
  return <main ref={root} className="relative h-[100dvh] w-full max-w-full overflow-hidden bg-[#e8e4dc] px-4 py-4 text-[#211d19] sm:px-7 sm:py-6 lg:px-10">
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute -left-40 top-[-17rem] h-[44rem] w-[44rem] rounded-full border border-[#d4ccc2]" /><div className="ambient-orbit absolute -right-28 bottom-[-18rem] h-[42rem] w-[42rem] rounded-full border border-[#d1c6ba]" /><div className="absolute bottom-[13%] left-[38%] h-px w-[38vw] rotate-[-38deg] bg-[#d5ccc1]" /><div className="absolute right-[12%] top-[17%] h-2 w-2 rounded-full bg-[#c69258]" /><div className="absolute bottom-[28%] left-[8%] h-2 w-2 rounded-full bg-[#7ca893]" /></div>
    <div className="relative mx-auto grid h-full max-w-[1460px] grid-rows-[auto_1fr]">
      <div className="landing-brand flex items-center justify-between py-2"><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-[.6rem] bg-[#211d19] font-display text-sm font-bold text-[#e4b569]">S</span><span className="font-display text-lg font-semibold tracking-[-.04em]">StreakLog</span></div><p className="hidden text-xs font-medium text-[#837a71] sm:block">A quiet place for public practice</p></div>
      <section className="grid min-h-0 items-center gap-8 py-4 lg:grid-cols-[minmax(0,1.04fr)_minmax(31rem,.76fr)] lg:gap-16 lg:py-7"><div className="relative self-center"><p className="mb-6 text-sm font-medium text-[#766c63]">Keep a trace of what you are becoming.</p><h1 className="max-w-[42rem] text-balance font-display text-[clamp(3.3rem,6.4vw,7.4rem)] font-semibold leading-[.91] tracking-[-.075em] text-[#211d19]">{words.map((word, index) => <span key={word} className={`headline-word block ${index === 2 ? 'text-[#b97453]' : ''}`}>{word}</span>)}</h1><p className="landing-copy mt-7 max-w-[35rem] text-pretty text-[clamp(1rem,1.35vw,1.22rem)] leading-relaxed text-[#6e665f]">One focused note a day is enough. Build a public archive that makes your effort visible without turning it into a performance.</p><div className="focus-dial mt-9 flex max-w-[31rem] items-center gap-5 border-t border-[#cec5bb] pt-5"><div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[conic-gradient(#b97453_0deg_258deg,#d9d1c8_258deg_360deg)]"><span className="grid h-[3.2rem] w-[3.2rem] place-items-center rounded-full bg-[#e8e4dc] text-sm font-semibold text-[#302a25]">Today</span></div><div><p className="font-display text-lg font-semibold tracking-[-.025em]">Make the next hour count.</p><p className="mt-1 text-sm leading-5 text-[#82786f]">Your learning page is ready when you are.</p></div></div></div>
        <form onSubmit={submit} className="form-card w-full rounded-[1.5rem] bg-[#f8f6f2] p-6 shadow-[0_26px_65px_rgba(74,57,42,.16)] ring-1 ring-white/80 sm:p-8"><div className="flex items-start justify-between border-b border-[#e1dad2] pb-5"><div><h2 className="font-display text-[clamp(1.8rem,2.3vw,2.5rem)] font-semibold leading-none tracking-[-.055em]">Begin your log</h2><p className="mt-2 text-sm text-[#847a70]">A public page with your name on it.</p></div><span className="mt-1 h-3 w-3 rounded-full bg-[#c69258] shadow-[0_0_0_5px_rgba(198,146,88,.15)]" /></div><div className="mt-6"><label className="block text-sm font-semibold text-[#29241f]">Your name<input value={name} onChange={(event) => setName(event.target.value.replace(/[^a-zA-Z ]/g, ''))} maxLength={50} placeholder="e.g. Rohan" className="mt-2 w-full rounded-lg border border-[#ded7ce] bg-white/55 px-3.5 py-3.5 text-[#211d19] outline-none transition placeholder:text-[#a89f95] focus:border-[#211d19] focus:bg-white" /></label><p className="mt-1.5 text-right text-xs text-[#9d9389]">{name.length}/50</p></div><div className="mt-5"><TopicSelector selected={topics} onChange={setTopics} customTopic={customTopic} onCustomTopic={setCustomTopic} /></div>{error && <p className="mt-4 rounded-lg border border-[#edc9c4] bg-[#fff1ef] p-3 text-sm text-[#a44842]">{error}</p>}<button disabled={!valid || loading} className="mt-6 flex w-full items-center justify-between rounded-lg bg-[#211d19] px-4 py-3.5 text-left font-display text-base font-semibold text-[#fcfaf6] transition duration-200 hover:-translate-y-0.5 hover:bg-[#39312a] hover:shadow-[0_12px_22px_rgba(33,29,25,.2)] active:translate-y-0 active:scale-[.99] disabled:cursor-not-allowed disabled:bg-[#aaa39c]"><span>{loading ? 'Creating your page…' : 'Create my learning log'}</span><span className="text-xl font-normal text-[#e4b569]">→</span></button><p className="mt-4 text-center text-xs text-[#968b80]">No sign-up. Your owner key stays on this device.</p></form>
      </section>
      {created && <div className="fixed inset-0 z-50 grid place-items-center bg-[#2a241e]/30 p-5 backdrop-blur-md"><section className="w-full max-w-lg rounded-[1.5rem] bg-[#f8f6f2] p-8 text-center shadow-[0_30px_90px_rgba(37,29,22,.35)] ring-1 ring-white"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#7bb19e] text-xl text-[#173e34]">✓</div><p className="mt-5 text-sm text-[#81776e]">Your learning page is ready.</p><h2 className="mt-1 font-display text-3xl font-semibold tracking-[-.05em]">Start with today.</h2><p className="my-5 break-all rounded-lg bg-[#ece7df] p-3 text-sm font-medium text-[#337c69]">{url}</p><SharePanel url={url} /><button onClick={() => router.push(`/u/${created.slug}`)} className="mt-6 w-full rounded-lg bg-[#211d19] px-5 py-3.5 font-display font-semibold text-[#fcfaf6] transition hover:bg-[#39312a]">Open my learning log</button></section></div>}
    </div>
  </main>
}
