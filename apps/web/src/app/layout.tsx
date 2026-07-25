import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'StreakLog — learn in public', description: 'Build a public trail of what you learn, every day.' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
