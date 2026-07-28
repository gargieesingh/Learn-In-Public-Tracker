import { Router } from 'express'
import { calculateStreaks, generateSlug } from '@streaklog/utils'
import { requireAuth } from '../middleware/ownerAuth'
import { supabase } from '../supabase'

const router = Router()
const namePattern = /^[a-zA-Z ]{2,50}$/

async function generateUniqueSlug(base: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = attempt === 0 ? '' : '-' + Math.random().toString(36).slice(2, 6)
    const slug = base + suffix
    const { data, error } = await supabase.from('trackers').select('id').eq('slug', slug).maybeSingle()
    if (error) throw error
    if (!data) return slug
  }
  throw new Error('Could not generate a unique URL. Please try again.')
}

router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('trackers')
    .select('slug, name, topics')
    .eq('owner_id', req.userId)
    .maybeSingle()
  if (error) return res.status(500).json({ data: null, error: 'Could not look up your learning log.' })
  return res.json({ data, error: null })
})

router.post('/', requireAuth, async (req, res) => {
  const { name, topics, customTopic } = req.body as { name?: string; topics?: string[]; customTopic?: string }
  const normalizedTopics = Array.isArray(topics)
    ? topics.map((topic) => topic === 'Other' && customTopic?.trim() ? customTopic.trim() : topic).filter(Boolean)
    : []

  if (!name || !namePattern.test(name.trim()) || normalizedTopics.length < 1 || normalizedTopics.length > 5) {
    return res.status(400).json({ data: null, error: 'Enter a name (2-50 letters) and choose between 1 and 5 topics.' })
  }

  try {
    const { data: existing, error: existingError } = await supabase
      .from('trackers')
      .select('slug, name, topics')
      .eq('owner_id', req.userId)
      .maybeSingle()
    if (existingError) throw existingError
    if (existing) return res.json({ data: { ...existing, existing: true }, error: null })

    const slug = await generateUniqueSlug(generateSlug(name, normalizedTopics[0]))
    const { data, error } = await supabase
      .from('trackers')
      .insert({ slug, owner_id: req.userId, name: name.trim(), topics: normalizedTopics })
      .select('slug, name, topics')
      .single()
    if (error || !data) throw error ?? new Error('Could not create tracker')
    return res.status(201).json({ data: { ...data, existing: false }, error: null })
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : ''
    if (message.includes("Could not find the table 'public.trackers'")) {
      return res.status(503).json({ data: null, error: 'StreakLog database setup is incomplete. Run supabase/schema.sql in the Supabase SQL Editor, then try again.' })
    }
    return res.status(500).json({ data: null, error: 'Could not create your learning log. Please try again.' })
  }
})

router.get('/:slug/ownership', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('trackers')
    .select('id')
    .eq('slug', req.params.slug)
    .eq('owner_id', req.userId)
    .maybeSingle()
  if (error) return res.status(500).json({ data: null, error: 'Could not verify ownership.' })
  return res.json({ data: { isOwner: Boolean(data) }, error: null })
})

router.get('/:slug', async (req, res) => {
  const { data: tracker, error } = await supabase.from('trackers').select('id, slug, name, topics, created_at').eq('slug', req.params.slug).maybeSingle()
  if (error) return res.status(500).json({ data: null, error: 'Could not load learning log.' })
  if (!tracker) return res.status(404).json({ data: null, error: 'Tracker not found' })

  const { data: logs, error: logError } = await supabase.from('logs').select('logged_date').eq('tracker_id', tracker.id)
  if (logError) return res.status(500).json({ data: null, error: 'Could not calculate streak.' })
  const streaks = calculateStreaks((logs ?? []).map((log) => log.logged_date))
  return res.json({ data: { ...tracker, current_streak: streaks.currentStreak, longest_streak: streaks.longestStreak }, error: null })
})

export default router
