'use client'

import { useState } from 'react'

const targets = [
  { label: 'Copy link', copyText: (url: string) => url, copiedLabel: 'Copied' },
  { label: 'Discord', copyText: (url: string) => `Follow my learning streak: ${url}`, copiedLabel: 'Copied for Discord' },
  { label: 'WhatsApp', href: (url: string) => `https://wa.me/?text=${encodeURIComponent(`Check out my learning streak: ${url}`)}` },
  { label: 'Twitter/X', href: (url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent('I’m learning in public. Follow my streak.')}&url=${encodeURIComponent(url)}` },
  { label: 'LinkedIn', href: (url: string) => `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
]

export function SharePanel({ url }: { url: string }) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (label: string, text: string) => { await navigator.clipboard.writeText(text); setCopied(label); window.setTimeout(() => setCopied(null), 1800) }
  return <div className="share-panel">{targets.map((target) => target.href ? <a key={target.label} href={target.href(url)} target="_blank" rel="noreferrer" className="share-chip">{target.label}</a> : <button key={target.label} onClick={() => void copy(target.label, target.copyText(url))} className="share-chip">{copied === target.label ? target.copiedLabel : target.label}</button>)}</div>
}
