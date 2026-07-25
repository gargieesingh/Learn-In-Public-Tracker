export interface Tracker {
  id: string
  slug: string
  name: string
  topics: string[]
  created_at: string
  current_streak: number
  longest_streak: number
}

export interface Log {
  id: string
  tracker_id: string
  content: string
  topic_tag: string
  image_url: string
  logged_date: string
  created_at: string
}

export interface CreateTrackerPayload { name: string; topics: string[]; customTopic?: string }
export interface CreateLogPayload { content: string; topic_tag: string; image: File; logged_date?: string }
export interface ApiResponse<T> { data: T; error: string | null }
