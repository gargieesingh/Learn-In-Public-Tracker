'use client'
import { useEffect } from 'react'
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => { let scroll: { destroy: () => void } | undefined; void import('locomotive-scroll').then(({ default: LocomotiveScroll }) => { scroll = new LocomotiveScroll({ el: document.querySelector('[data-scroll-container]') as HTMLElement, smooth: true, multiplier: 0.9 }) }); return () => scroll?.destroy() }, [])
  return <div data-scroll-container>{children}</div>
}
