-- Run this file in the Supabase SQL editor before using the app.
CREATE TABLE trackers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  owner_token TEXT NOT NULL,
  name TEXT NOT NULL,
  topics TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracker_id UUID REFERENCES trackers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  topic_tag TEXT NOT NULL,
  image_url TEXT NOT NULL,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_logs_tracker_id ON logs(tracker_id);
CREATE INDEX idx_logs_logged_date ON logs(logged_date);
CREATE INDEX idx_trackers_slug ON trackers(slug);
ALTER TABLE trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read trackers" ON trackers FOR SELECT USING (true);
CREATE POLICY "Public read logs" ON logs FOR SELECT USING (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('log-images', 'log-images', true);
CREATE POLICY "Public read log images" ON storage.objects FOR SELECT USING (bucket_id = 'log-images');
CREATE POLICY "Anyone can upload log images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'log-images');
