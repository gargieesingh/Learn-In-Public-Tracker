'use client'

export function StreakStats({ current, longest }: { current: number; longest: number }) {
  return <div className="streak-stats">
    <section className="streak-stat"><p className="streak-stat__label">Your streak</p><p className="streak-stat__number">{current}<span className="streak-stat__unit">days</span></p><p className="streak-stat__copy">Consecutive days with an entry.</p></section>
    <section className="streak-stat"><p className="streak-stat__label">Longest route</p><p className="streak-stat__number">{longest}<span className="streak-stat__unit">days</span></p><p className="streak-stat__copy">Your longest recorded run.</p></section>
  </div>
}
