'use client'
/* eslint-disable @next/next/no-img-element -- object URLs for selected file previews are not compatible with next/image optimization. */

import { useRef, useState } from 'react'
import type { Log, Tracker } from '../../types'
import { api } from '../../lib/api'

const today = () => new Date().toISOString().slice(0, 10)

export function LogForm({ tracker, ownerToken, existing, onCreated }: { tracker: Tracker; ownerToken: string; existing: Log[]; onCreated: (log: Log) => void }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState(tracker.topics[0])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const choose = (next?: File) => {
    if (!next) return
    if (!next.type.match(/^image\/(jpeg|png|gif|webp)$/) || next.size > 5 * 1024 * 1024) {
      setError('Choose a JPG, PNG, GIF, or WebP image under 5MB.')
      return
    }
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setError('')
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (content.trim().length < 20 || !file) {
      setError('Write at least 20 characters and add an image.')
      return
    }
    if (existing.some((log) => log.logged_date === today()) && !confirm('You already logged today. Add another entry?')) return
    setSaving(true)
    setError('')
    try {
      const data = new FormData()
      data.set('content', content.trim())
      data.set('topic_tag', topic)
      data.set('logged_date', today())
      data.set('image', file)
      const log = await api.createLog(tracker.slug, ownerToken, data)
      onCreated(log)
      setContent('')
      setFile(null)
      setPreview('')
      if (fileInput.current) fileInput.current.value = ''
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save your log.')
    } finally {
      setSaving(false)
    }
  }

  return <form onSubmit={submit} className="paper-card log-form">
    <div className="log-form__head"><div><h2 className="log-form__title">Log today&apos;s learning</h2><p className="log-form__copy">Write the detail future you will want to find.</p></div><span className="log-form__date">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></div>
    <label className="field-label">Topic<select value={topic} onChange={(event) => setTopic(event.target.value)} className="field-select">{tracker.topics.map((item) => <option key={item}>{item}</option>)}</select></label>
    <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={1000} rows={5} placeholder="What did you learn? Record the decision, tradeoff, or link you will want later." className="field-textarea" />
    <p className="field-count">{content.length}/1000</p>
    <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files[0]) }} onClick={() => fileInput.current?.click()} className="upload-zone"><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={(event) => choose(event.target.files?.[0])} />{preview ? <><img src={preview} alt="Selected learning log image preview" className="upload-preview" /><button type="button" onClick={(event) => { event.stopPropagation(); setFile(null); setPreview(''); if (fileInput.current) fileInput.current.value = '' }} className="remove-link mt-2">Remove image</button></> : <p>Attach a screenshot, note, diagram, or console output. JPG, PNG, GIF, or WebP up to 5MB.</p>}</div>
    {error && <p className="form-error">{error}</p>}
    <button disabled={saving} className="accent-button">{saving ? 'Logging entry...' : 'Log entry'}</button>
  </form>
}
