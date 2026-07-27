'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { api } from '../../lib/api'
import { TopicSelector } from './TopicSelector'
import { SharePanel } from '../dashboard/SharePanel'

export function HeroSection() {
  const root = useRef<HTMLElement>(null)
  const router = useRouter()
  const [name, setName] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [customTopic, setCustomTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<{ slug: string; name: string } | null>(null)
  const week = useMemo(() => Array.from({ length: 7 }, (_, index) => { const day = new Date(); day.setDate(day.getDate() - 3 + index); return day }), [])

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timeline = gsap.timeline()
    timeline.from('.hero-card', { y: 28, opacity: 0, duration: 0.6, stagger: 0.14, ease: 'power2.out' })
      .fromTo('.landing-float', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, ease: 'power2.out' }, 0.18)
      .to('.landing-float', { y: -5, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
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
      const message = cause instanceof Error ? cause.message : 'Page creation did not complete.'
      setError(message === 'Failed to fetch' ? 'The StreakLog API is offline. Set the Supabase values in apps/api/.env, then restart npm run dev.' : message)
    } finally { setLoading(false) }
  }

  const url = created ? `${window.location.origin}/u/${created.slug}` : ''
  const previewName = name.trim() || 'Your name'
  const previewTopic = topics.find((topic) => topic !== 'Other') || 'Learning in public'

  return <main ref={root} id="main-content" className="landing-page">
    <header className="site-header"><div className="site-header__inner"><div className="wordmark"><span className="wordmark__mark">S</span>StreakLog</div><span className="utility-label">learn in public</span></div></header>
    <div className="landing-shell">
      <section className="landing-copy"><p className="eyebrow">A public learning record</p><h1 className="landing-title">Show the work.<br />Keep the streak.</h1><p className="landing-description">Create a page for the small things you learned today. Each entry keeps a visible record of the days you showed up.</p>
        <form onSubmit={submit} className="landing-form landing-float"><h2>Start a learning log</h2><p>Pick a focus and create your public page.</p><label className="field-label">Your name<input value={name} onChange={(event) => setName(event.target.value.replace(/[^a-zA-Z ]/g, ''))} maxLength={50} placeholder="Rohan Verma" className="field-input" /></label><p className="field-count">{name.length}/50</p><TopicSelector selected={topics} onChange={setTopics} customTopic={customTopic} onCustomTopic={setCustomTopic} />{error && <p className="form-error">{error}</p>}<button disabled={!valid || loading} className="accent-button">{loading ? 'Creating your page...' : 'Start my streak'}</button><p className="landing-form__note">No account required. This device keeps your owner key.</p></form>
      </section>
      <section className="hero-cards" aria-label="StreakLog preview">
        <article className="hero-card hero-card--today"><p className="hero-card__label">Today&apos;s log</p><h2 className="hero-card__title">Write one useful thing down.</h2><p className="hero-card__copy">A decision, a pattern, or a link for future you.</p><div className="mini-track"><i /></div><p className="mini-action">Start with today</p></article>
        <article className="hero-card hero-card--profile"><div className="hero-profile"><span className="avatar">{previewName.slice(0, 1).toUpperCase()}</span><div><h3>{previewName}</h3><p>{previewTopic}</p></div></div><div className="hero-stats"><div className="hero-stat"><strong>0</strong><span>day streak</span></div><div className="hero-stat"><strong>0</strong><span>entries this month</span></div><div className="hero-stat"><strong>0</strong><span>longest streak</span></div></div></article>
        <article className="hero-card hero-card--week"><p className="hero-card__label">Weekly streak</p><div className="week-row">{week.map((day, index) => <span key={day.toISOString()} className={`week-chip ${index < 3 ? 'is-active' : ''}`}><span>{day.toLocaleDateString(undefined, { weekday: 'short' })}</span><strong>{day.getDate()}</strong></span>)}</div></article>
      </section>
    </div>
    {created && <div className="modal-backdrop"><section className="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="created-title"><h2 id="created-title" className="modal-title">Your streak page is live</h2><p className="mt-2 text-sm text-[var(--muted)]">Share the page when you are ready to log the first day.</p><p className="field-input break-all font-mono text-sm">{url}</p><div className="mt-5"><SharePanel url={url} /></div><button onClick={() => router.push(`/u/${created.slug}`)} className="accent-button mt-5 w-full">Go to my learning log</button></section></div>}
  </main>
}
