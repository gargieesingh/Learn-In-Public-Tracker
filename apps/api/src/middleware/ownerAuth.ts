import type { NextFunction, Request, Response } from 'express'
import { supabase } from '../supabase'

declare global {
  namespace Express {
    interface Request {
      trackerId?: string
      userId?: string
    }
  }
}

function bearerToken(req: Request) {
  return req.headers.authorization?.replace(/^Bearer\s+/i, '')
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = bearerToken(req)
  if (!token) return res.status(401).json({ data: null, error: 'Sign in with Google to continue.' })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ data: null, error: 'Your session has expired. Sign in with Google again.' })

  req.userId = data.user.id
  next()
}

export async function ownerAuth(req: Request, res: Response, next: NextFunction) {
  const token = bearerToken(req)
  const { slug } = req.params
  if (!token || !slug) return res.status(401).json({ data: null, error: 'Unauthorized' })

  const { data: authData } = await supabase.auth.getUser(token)
  const query = supabase.from('trackers').select('id').eq('slug', slug)
  const { data, error } = authData.user
    ? await query.eq('owner_id', authData.user.id).maybeSingle()
    : await query.eq('owner_token', token).maybeSingle()

  if (error) return res.status(500).json({ data: null, error: 'Could not verify ownership' })
  if (!data) return res.status(403).json({ data: null, error: 'Forbidden' })
  req.trackerId = data.id
  next()
}
