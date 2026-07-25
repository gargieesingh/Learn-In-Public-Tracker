'use client'

const options = ['System Design', 'Frontend', 'Backend', 'DSA', 'AI/ML', 'Web3', 'DevOps', 'Mobile', 'Other']

export function TopicSelector({ selected, onChange, customTopic, onCustomTopic }: { selected: string[]; onChange: (topics: string[]) => void; customTopic: string; onCustomTopic: (value: string) => void }) {
  const toggle = (topic: string) => {
    if (selected.includes(topic)) onChange(selected.filter((item) => item !== topic))
    else if (selected.length < 5) onChange([...selected, topic])
  }

  return <div>
    <div className="mb-3 flex items-end justify-between gap-3"><p className="text-sm font-semibold tracking-[-.015em] text-[#211d19]">Choose your focus</p><p className="text-xs text-[#8c837a]">Select up to five</p></div>
    <div className="flex flex-wrap gap-2">{options.map((topic) => {
      const active = selected.includes(topic)
      return <button key={topic} type="button" onClick={() => toggle(topic)} className={`rounded-md border px-3 py-2 text-sm font-medium transition duration-200 active:scale-[.98] ${active ? 'border-[#211d19] bg-[#211d19] text-[#fcfaf6] shadow-[0_5px_12px_rgba(33,29,25,.14)]' : 'border-[#ded7ce] bg-transparent text-[#655e57] hover:border-[#958a7f] hover:bg-white/50'}`}><span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${active ? 'bg-[#dbaa62]' : 'bg-[#d2cbc2]'}`} />{topic}</button>
    })}</div>
    {selected.includes('Other') && <input value={customTopic} onChange={(event) => onCustomTopic(event.target.value)} maxLength={50} placeholder="Describe what you’re learning" className="mt-3 w-full rounded-lg border border-[#ded7ce] bg-white/50 px-3.5 py-3 text-sm text-[#211d19] outline-none transition placeholder:text-[#a59c92] focus:border-[#211d19] focus:bg-white" />}
  </div>
}
