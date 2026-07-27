'use client'

import { useEffect } from 'react'

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => { const key = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }, [onClose])
  return <div onMouseDown={onClose} className="modal-backdrop"><section onMouseDown={(event) => event.stopPropagation()} className="modal-sheet"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="modal-title">{title}</h2><button aria-label="Close modal" onClick={onClose} className="modal-close">×</button></div>{children}</section></div>
}
