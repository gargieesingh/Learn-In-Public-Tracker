import { randomUUID } from 'crypto'
import { Router } from 'express'
import multer from 'multer'
import { ownerAuth } from '../middleware/ownerAuth'
import { supabase } from '../supabase'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
const datePattern = /^\d{4}-\d{2}-\d{2}$/

router.post('/:slug', ownerAuth, upload.single('image'), async (req, res) => {
  const content = String(req.body.content ?? '').trim()
  const topic_tag = String(req.body.topic_tag ?? '').trim()
  const logged_date = String(req.body.logged_date ?? new Date().toISOString().slice(0, 10))
  if (content.length < 20 || content.length > 1000 || !topic_tag || !datePattern.test(logged_date)) {
    return res.status(400).json({ data: null, error: 'Provide a 20–1000 character update, a topic, and a valid date.' })
  }

  const { data: tracker } = await supabase.from('trackers').select('topics').eq('id', req.trackerId).single()
  if (!tracker?.topics.includes(topic_tag)) return res.status(400).json({ data: null, error: 'Choose one of your learning topics.' })
  const { count } = await supabase.from('logs').select('*', { count: 'exact', head: true }).eq('tracker_id', req.trackerId).eq('logged_date', logged_date)
  if ((count ?? 0) >= 10) return res.status(429).json({ data: null, error: "You've logged 10 times today. Come back tomorrow!" })

  try {
    let imageUrl = String(req.body.image_url ?? '')
    if (req.file) {
      if (!req.file.mimetype.startsWith('image/')) return res.status(400).json({ data: null, error: 'Only image files are allowed.' })
      const ext = req.file.originalname.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'jpg'
      const path = `${req.trackerId}/${randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('log-images').upload(path, req.file.buffer, { contentType: req.file.mimetype })
      if (uploadError) throw uploadError
      imageUrl = supabase.storage.from('log-images').getPublicUrl(path).data.publicUrl
    }
    if (!imageUrl) return res.status(400).json({ data: null, error: 'An image is required.' })
    const { data, error } = await supabase.from('logs').insert({ tracker_id: req.trackerId, content, topic_tag, image_url: imageUrl, logged_date }).select().single()
    if (error || !data) throw error ?? new Error('Create failed')
    return res.status(201).json({ data, error: null })
  } catch {
    return res.status(500).json({ data: null, error: 'Could not save your learning log.' })
  }
})

router.delete('/:slug/:logId', ownerAuth, async (req, res) => {
  const { data: log, error } = await supabase.from('logs').select('id, image_url').eq('id', req.params.logId).eq('tracker_id', req.trackerId).maybeSingle()
  if (error) return res.status(500).json({ data: null, error: 'Could not find log.' })
  if (!log) return res.status(404).json({ data: null, error: 'Log not found.' })
  const marker = '/log-images/'
  const path = log.image_url.includes(marker) ? log.image_url.split(marker)[1] : ''
  if (path) await supabase.storage.from('log-images').remove([path])
  const { error: deleteError } = await supabase.from('logs').delete().eq('id', log.id)
  if (deleteError) return res.status(500).json({ data: null, error: 'Could not delete log.' })
  return res.json({ data: { success: true }, error: null })
})

router.get('/:slug', async (req, res) => {
  const { data: tracker } = await supabase.from('trackers').select('id').eq('slug', req.params.slug).maybeSingle()
  if (!tracker) return res.status(404).json({ data: null, error: 'Tracker not found' })
  let query = supabase.from('logs').select('*').eq('tracker_id', tracker.id).order('logged_date', { ascending: false }).order('created_at', { ascending: false })
  if (typeof req.query.date === 'string' && datePattern.test(req.query.date)) query = query.eq('logged_date', req.query.date)
  const { data, error } = await query
  if (error) return res.status(500).json({ data: null, error: 'Could not load logs.' })
  return res.json({ data: { logs: data ?? [] }, error: null })
})

export default router
