'use client'
import { useEffect } from 'react'
export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => { const key = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }, [onClose])
  return <div onMouseDown={onClose} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"><section onMouseDown={(event) => event.stopPropagation()} className="glass max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="font-display text-xl font-bold">{title}</h2><button aria-label="Close modal" onClick={onClose} className="text-2xl text-muted hover:text-white">×</button></div>{children}</section></div>
}
