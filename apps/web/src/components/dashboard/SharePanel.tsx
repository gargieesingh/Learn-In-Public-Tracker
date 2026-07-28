'use client'

import { useState } from 'react'

function CopyIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l1.93-1.93a5 5 0 0 0-7.07-7.07L10.5 5.5" /><path d="M14 11a5 5 0 0 0-7.07 0L5 12.93a5 5 0 0 0 7.07 7.07l1.43-1.43" /></svg>
}
function DiscordIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 5.5a17 17 0 0 0-4.2-1.3l-.2.4c1.5.4 2.4.9 3.3 1.6-1.4-.7-2.8-1.2-4.9-1.2s-3.5.5-4.9 1.2c.9-.7 1.9-1.3 3.3-1.6l-.2-.4A17 17 0 0 0 8 5.5C5.5 8.6 4.8 11.6 5 14.6c1.6 1.2 3.2 1.9 4.7 2.3l.6-1c-.8-.3-1.6-.7-2.3-1.2.2-.1.4-.3.6-.4 2.3 1.1 4.8 1.1 7 0 .2.1.4.3.6.4-.7.5-1.5.9-2.3 1.2l.6 1c1.5-.4 3.1-1.1 4.7-2.3.3-3.6-.6-6.6-2.6-9.1ZM10 13c-.7 0-1.2-.7-1.2-1.5S9.3 10 10 10s1.2.7 1.2 1.5S10.7 13 10 13Zm4.9 0c-.7 0-1.2-.7-1.2-1.5s.5-1.5 1.2-1.5 1.2.7 1.2 1.5-.5 1.5-1.2 1.5Z" /></svg>
}
function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.2-.2 0-.4.1-.5l.4-.5c.1-.1.2-.2.2-.4.1-.2 0-.3 0-.5s-.6-1.5-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
}
function XIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H2l8.1-9.3L1.5 2h7l4.8 6.3L18.9 2Zm-1.2 18.2h1.9L7.4 3.7H5.4l12.3 16.5Z" /></svg>
}
function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.94 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM4.75 9.5h4.4V19h-4.4V9.5ZM12.5 9.5h4.2v1.3h.06c.6-1.1 2-2.2 4-2.2 4.3 0 5.1 2.6 5.1 6v6.4h-4.4v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8h-4.4V9.5Z" /></svg>
}

type ShareTarget = {
  key: string
  label: string
  Icon: () => React.ReactElement
  bg: string
  href?: (url: string) => string
  copyText?: (url: string) => string
}

const targets: ShareTarget[] = [
  { key: 'copy', label: 'Copy link', Icon: CopyIcon, bg: 'var(--orange)', copyText: (url) => url },
  { key: 'discord', label: 'Discord', Icon: DiscordIcon, bg: '#5865F2', copyText: (url) => `Follow my learning streak: ${url}` },
  { key: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon, bg: '#25D366', href: (url) => `https://wa.me/?text=${encodeURIComponent(`Check out my learning streak: ${url}`)}` },
  { key: 'x', label: 'X', Icon: XIcon, bg: '#000000', href: (url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent('I’m learning in public. Follow my streak.')}&url=${encodeURIComponent(url)}` },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon, bg: '#0A66C2', href: (url) => `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` }
]

export function SharePanel({ url }: { url: string }) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (key: string, text: string) => { await navigator.clipboard.writeText(text); setCopied(key); window.setTimeout(() => setCopied(null), 1800) }

  return <div className="share-dialog">
    <div className="share-icons">
      {targets.map((target) => target.href
        ? <a key={target.key} href={target.href(url)} target="_blank" rel="noreferrer" className="share-icon-item"><span className="share-icon-circle" style={{ background: target.bg }}><target.Icon /></span><span className="share-icon-label">{target.label}</span></a>
        : <button key={target.key} type="button" onClick={() => void copy(target.key, target.copyText!(url))} className="share-icon-item"><span className="share-icon-circle" style={{ background: target.bg }}><target.Icon /></span><span className="share-icon-label">{copied === target.key ? 'Copied' : target.label}</span></button>)}
    </div>
    <div className="share-link-row">
      <span className="share-link-text">{url}</span>
      <button type="button" onClick={() => void copy('copy', url)} className="share-link-copy">{copied === 'copy' ? 'Copied' : 'Copy'}</button>
    </div>
  </div>
}
