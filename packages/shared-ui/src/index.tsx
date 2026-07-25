import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-white/10 bg-white/[0.035] ${className}`} {...props} />
}

export function Badge({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>
}

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`rounded-xl px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${className}`} {...props} />
}

export function Avatar({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-mint font-display font-bold text-bg ${className}`}>{name.slice(0, 1).toUpperCase()}</span>
}
