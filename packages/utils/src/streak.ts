export interface StreakResult {
  currentStreak: number
  longestStreak: number
  activeDates: Set<string>
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function calculateStreaks(dates: string[]): StreakResult {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0, activeDates: new Set() }

  const unique = [...new Set(dates)].sort()
  const activeDates = new Set(unique)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let currentStreak = 0
  // A streak is still active before today's first log, provided yesterday is logged.
  for (let offset = 0; offset <= 365; offset += 1) {
    const day = new Date(today)
    day.setDate(day.getDate() - offset)
    if (activeDates.has(formatDate(day))) currentStreak += 1
    else if (offset === 0) continue
    else break
  }

  let longestStreak = 1
  let run = 1
  for (let index = 1; index < unique.length; index += 1) {
    const previous = new Date(`${unique[index - 1]}T00:00:00`)
    const current = new Date(`${unique[index]}T00:00:00`)
    const difference = (current.getTime() - previous.getTime()) / 86_400_000
    if (difference === 1) {
      run += 1
      longestStreak = Math.max(longestStreak, run)
    } else run = 1
  }
  return { currentStreak, longestStreak, activeDates }
}
