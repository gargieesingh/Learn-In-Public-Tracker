import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Turborepo launches workspace scripts from the monorepo root. Resolve this
// package's env file explicitly so local development and deployments agree.
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.')
}

export const supabase = createClient(url, serviceKey)
