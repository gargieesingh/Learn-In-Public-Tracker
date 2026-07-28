-- Run this migration once for an existing StreakLog database.
-- Existing public profiles remain readable. Their original device owner token
-- remains valid until the owner creates or claims a Google-authenticated profile.

ALTER TABLE trackers
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE trackers
  ALTER COLUMN owner_token DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_trackers_owner_id
  ON trackers(owner_id)
  WHERE owner_id IS NOT NULL;

DROP POLICY IF EXISTS "Anyone can upload log images" ON storage.objects;
