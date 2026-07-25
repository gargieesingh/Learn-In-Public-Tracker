import type { ButtonHTMLAttributes } from 'react'
export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`focus-ring rounded-xl px-4 py-2.5 font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} /> }
