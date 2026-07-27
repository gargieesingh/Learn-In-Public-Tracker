'use client'

const options = ['System Design', 'Frontend', 'Backend', 'DSA', 'AI/ML', 'Web3', 'DevOps', 'Mobile', 'Other']

export function TopicSelector({ selected, onChange, customTopic, onCustomTopic }: { selected: string[]; onChange: (topics: string[]) => void; customTopic: string; onCustomTopic: (value: string) => void }) {
  const toggle = (topic: string) => {
    if (selected.includes(topic)) onChange(selected.filter((item) => item !== topic))
    else if (selected.length < 5) onChange([...selected, topic])
  }

  return <div>
    <div className="topic-head"><p className="topic-title">What are you learning?</p><p className="topic-help">Choose up to five</p></div>
    <div className="topic-list">{options.map((topic) => <button key={topic} type="button" onClick={() => toggle(topic)} className={`topic-toggle ${selected.includes(topic) ? 'is-active' : ''}`}>{topic}</button>)}</div>
    {selected.includes('Other') && <input value={customTopic} onChange={(event) => onCustomTopic(event.target.value)} maxLength={50} placeholder="Describe what you are learning" className="field-input" />}
  </div>
}
