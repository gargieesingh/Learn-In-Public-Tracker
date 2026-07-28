# StreakLog

StreakLog is a learn-in-public streak tracker. Create one public profile, post visual daily learning updates, and share the visible record with a link.

## Architecture

```text
Next.js web (Vercel) -> Express API (Railway) -> Supabase Postgres + Auth + Storage
```

## Decisions

- **Monorepo + Turborepo:** shared streak and slug utilities stay consistent in one build pipeline.
- **Supabase:** managed PostgreSQL, Auth, and public image storage suit a compact full-stack application.
- **Public by URL:** anyone can view a learning profile, its entries, and its streak without signing in.
- **Google authentication for ownership:** Google sign-in gives each profile a stable private owner identity. Only that owner can create or remove logs.
- **One profile per account:** returning users are sent to their existing learning profile rather than receiving a duplicate random slug.
- **Human-readable slugs:** URLs are easy to share. Different people with the same name and topic get distinct URLs if a collision occurs.
- **Multiple logs per day:** a daily cap of ten prevents spam while still allowing learners to record intense days.

## Local setup

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `apps/api/.env` and `apps/web/.env.local`, then fill in the Supabase values.
3. For a new project, run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor. For an existing project, also run [supabase/migrations/20260728_google_auth.sql](supabase/migrations/20260728_google_auth.sql) once.
4. Start both apps with `npm run dev`. The web app is at `http://localhost:3000`; the API is at `http://localhost:4000`.

## Google sign-in setup

1. In Google Cloud Console, create an OAuth web client and add this authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`.
2. In Supabase, open **Authentication → Providers → Google**, enable it, and add the Google client ID and client secret.
3. In Supabase **Authentication → URL Configuration**, set the Site URL to `http://localhost:3000` locally and add `http://localhost:3000/**` to Redirect URLs. Add your deployed HTTPS URL and its `/**` variant before deploying.

The browser sends the signed-in user’s Supabase access token to the API. The API verifies that token with Supabase before creating a profile or changing logs. Legacy device owner tokens continue to work for profiles created before this upgrade on the browser that created them.

## Deployment

Deploy `apps/web` to Vercel and set `NEXT_PUBLIC_API_URL` to the Railway API URL. Deploy `apps/api` to Railway with `apps/api` as root and `npm run build && npm run start` as the start command. Configure the listed Supabase environment variables in each platform and add the deployed web URL to Supabase Auth redirect URLs.
