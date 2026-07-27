import type { Metadata } from 'next'
import './globals.css'
/* eslint-disable @next/next/no-page-custom-font -- Typography intentionally loads once at the root layout. */

export const metadata: Metadata = { title: 'StreakLog | learn in public', description: 'Build a public trail of what you learn, every day.' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet" /></head><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>
}
