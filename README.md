# StreakLog

StreakLog is a learn-in-public streak tracker: create a shareable profile, post visual daily learning updates, and make consistency visible. Add the live URL here after deployment.

## Architecture

```text
Next.js web (Vercel) ──HTTP──> Express API (Railway) ──> Supabase Postgres
       │                                                  └─> Storage: log-images
       └──────────── public profile, dashboard and sharing
```

## Decisions

- **Monorepo + Turborepo:** shared streak and slug utilities stay consistent, with one build pipeline.
- **Supabase:** managed PostgreSQL and public image storage fit a small full-stack product without extra infrastructure.
- **Human-readable slugs:** URLs are easy to remember and naturally share in conversation.
- **Owner token instead of login:** creation is frictionless and needs no email. Ownership is device-specific, so clearing local storage removes management access.
- **Multiple logs per day:** a daily cap of ten prevents spam while still allowing learners to record intense days.

Slug collisions are handled by checking the generated slug first and then retrying up to four random four-character suffixes.

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `apps/api/.env` and `apps/web/.env.local`, then fill in Supabase values.
3. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor.
4. Start both apps with `npm run dev`. The web app is at `http://localhost:3000`; the API is at `http://localhost:4000`.

## Deployment

Deploy `apps/web` to Vercel and set its `NEXT_PUBLIC_API_URL` to the Railway service URL. Deploy `apps/api` to Railway with `apps/api` as root and `npm run build && npm run start` as the start command. Configure the listed Supabase environment variables in each platform.

## Build note

The supplied brief described both direct browser uploads and multipart API uploads. The implementation uses the latter so the service-role key and storage path logic stay server-owned; the browser sends the selected image with the log form.

## Known build quirk

In restricted Windows workspaces, Next.js can emit a non-fatal webpack cache snapshot warning during `npm run build`. The production compilation, typecheck, lint, and generated routes still complete successfully.
