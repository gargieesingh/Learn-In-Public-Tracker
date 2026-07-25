import type { NextFunction, Request, Response } from 'express'
import { supabase } from '../supabase'

declare global {
  namespace Express {
    interface Request { trackerId?: string }
  }
}

export async function ownerAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  const { slug } = req.params
  if (!token || !slug) return res.status(401).json({ data: null, error: 'Unauthorized' })

  const { data, error } = await supabase.from('trackers').select('id').eq('slug', slug).eq('owner_token', token).maybeSingle()
  if (error) return res.status(500).json({ data: null, error: 'Could not verify ownership' })
  if (!data) return res.status(403).json({ data: null, error: 'Forbidden' })
  req.trackerId = data.id
  next()
}
