import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = url && key ? createClient(url, key) : null

export async function uploadLogImage(file: File, trackerId: string): Promise<string> {
  if (!supabase) throw new Error('Image storage has not been configured.')
  const extension = file.name.split('.').pop() || 'jpg'
  const path = `${trackerId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('log-images').upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from('log-images').getPublicUrl(path).data.publicUrl
}
