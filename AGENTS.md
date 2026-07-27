# AGENTS.md — Learn-in-Public Streak Tracker (v3 — reference-matched visual system)

## 0. What changed in this version

Earlier versions of this file pushed toward an original, non-templated visual
identity (an ink/ivory/brass "logbook" concept) and explicitly warned against
cream+orange dashboard aesthetics as a generic default. That direction has
been **deliberately overridden** by the product owner, who has selected a
specific reference UI and wants it matched closely: same color system, same
profile card, same streak component pattern, same log/feed card style, same
landing composition. Follow this file as the new source of truth. Do not
reintroduce the ink/ivory/brass palette or the route-line streak motif from
earlier iterations.

You are still the implementer responsible for quality: clean spacing, real
hierarchy, working responsive behavior, and purposeful motion. "Match the
reference" does not mean sloppy or literal pixel-copy of a screenshot with no
design judgment — it means the reference is the definitive style guide for
color, type texture, and component shape, and you build the actual product
(logs + streaks, not courses + videos) inside that system.

---

## 1. Visual system — copied from reference, as the fixed style guide

**Color tokens** (match reference proportions and mood, adjust exact hex only
as needed for contrast):

- `#F7F1E6` — warm cream background (page background, matches reference)
- `#FFFFFF` / `#FFFDF8` — card surface (white to near-white, slightly warm)
- `#1B1B1B` — primary text (near-black, not pure black)
- `#8C8C8C` — secondary/muted text
- `#F97316` — primary accent orange (buttons, active states, progress fill,
  active streak day chips)
- `#FDBA74` — light orange (progress bar track ends, subtle tints, hover
  backgrounds)
- `#C2410C` → `#F97316` — orange gradient, used only for the landing hero
  background (full-bleed gradient behind floating cards), matching reference
  image 1.

**Card style:** white/cream rounded-2xl cards (roughly 16–20px radius), soft
low-opacity drop shadow (no glow, no colored shadow), generous internal
padding, thin or no border. This radius and shadow treatment is used
consistently across profile card, streak card, and log cards.

**Typography:** a clean geometric/humanist sans for everything (headings and
body both sans, matching the reference's dashboard feel — no serif display
face in this version). Bold weight for names, numbers, and card titles;
regular weight for supporting text; a slightly smaller, muted style for
metadata (dates, counts, labels).

**Iconography:** simple line/duotone icons matching the reference's icon
style (streak flame icon is acceptable here since it's part of the chosen
reference system — this supersedes the earlier "no flame emoji" rule).

---

## 2. Product structure

Three surfaces to build:

1. **Landing page** — matches reference image 1's composition.
2. **Log page** (`/u/[handle]`) — matches reference image 2/3's layout:
   right column = profile + streak, left column = log feed.
3. **Create-log flow** — floating action button + drop-up composer (kept
   from the previous spec, restyled into this new visual system).

---

## 3. Landing page (matches reference image 1)

- Full-bleed warm orange gradient background (`#C2410C` → `#F97316`,
  diagonal or radial, matching the reference's mood).
- A loose, slightly overlapping **floating card composition** sits on top of
  the gradient, mirroring the reference's arrangement:
  - One card representing "today's log" or "start your streak" (in place of
    the course-progress card) — title, a short progress/streak indicator,
    a primary action.
  - One card representing a **profile summary**: avatar, name/role or
    tagline, streak count, a couple of stat chips (days streak, entries this
    month, longest streak) — in place of the reference's points/rank stats.
  - One card representing the **weekly streak** chip row (Mon–Sun, with
    logged days highlighted in orange), same visual pattern as reference
    images 2 and 3.
  - Do NOT include: video/course thumbnails, watch-time bar charts, points/
    leaderboard rank, or an "Upgrade Now" upsell card. Replace that content
    with log/streak-relevant equivalents only, keeping the same card shapes,
    shadows, and overlapping arrangement.
- Below or alongside this composition: the actual landing copy (headline,
  short supporting line, name/topic entry to start a log) using the same
  cream background and orange accent as the rest of the app.
- The name/topic entry panel should **float**: a slow, continuous, subtle
  vertical drift (a few pixels, several seconds per cycle) plus an eased
  entrance on load, via GSAP.
- The floating card composition itself should also animate in on load —
  staggered ease-in with slight upward motion per card (GSAP timeline),
  landing in the arranged, slightly overlapping composition shown in the
  reference. This is the hero's signature motion moment.

---

## 4. Log page layout (`/u/[handle]`) — matches reference image 2/3

**Right column (sticky):**
- **Profile card**, styled exactly like the reference's profile block:
  circular avatar, name, short role/tagline-equivalent (e.g. current topic,
  or "learning {topic} since {date}"), and a row of 2–3 stat chips (days
  streak, entries this month, rank/placement is optional — omit if it has no
  real meaning for this product, since fabricated "2nd Place" style stats
  would be misleading; keep only stats that are real, like streak days and
  total entries).
- **Streak card**, styled like the reference's "Weekly Streak" block:
  a month/date selector at the top, then a row of day chips (Mon–Sun),
  each showing the date number, with **logged days filled solid orange**
  and unlogged days shown as plain outlined/light chips — exact visual
  pattern from reference images 2 and 3.
  - Add a **Week / Month / Year segmented toggle** above this chip row.
    - *Week*: the 7-day chip row exactly as in the reference.
    - *Month*: the same chip pattern expanded to a full calendar-month grid
      (weeks stacked as rows), logged days filled orange, same visual
      language.
    - *Year*: a compact 12-month overview (e.g. one small strip or mini-grid
      per month) using the same fill-when-logged convention, scaled down.
  - Use simple tab/pill controls in the orange accent for the active view,
    not a stock unstyled shadcn tab.

**Left column (main content — the log feed):**
- A vertical feed of learning-log entries, using a **card style visually
  consistent with the reference's course cards** (rounded cream/white card,
  a small topic tag/icon area top-left similar to where the reference shows
  a course category icon, a title line, and supporting text) — but the
  content is a log entry: date, topic tag, entry text, optional attached
  image thumbnail.
- No progress bars (logs aren't "% complete"), no lesson counts, no "resume"
  buttons — replace those reference-only elements with what's actually true
  for a log entry (date, topic, short entry preview, maybe a small "read
  more" if entries are long).
- Keep the existing empty-state copy/behavior for a feed with zero entries.

---

## 5. Floating create-log control (owner view only)

- Circular floating action button, bottom-right corner, styled in the
  primary orange, visible only to the profile owner.
- Clicking it opens a **drop-up panel** anchored to that corner (rises from
  bottom-right, not a centered modal), styled as a cream/white rounded card
  matching the rest of the system, containing: topic select, entry textarea
  with character count, attachment dropzone, submit button (solid orange).
- Animate open/close with GSAP: a clean rise-and-settle on open, reverse on
  close — no bounce, no fade+scale combo.
- On submit: close the panel, prepend the new entry to the left-column feed,
  update the streak chips/stat numbers (mark today's chip as logged).

---

## 6. Motion — where GSAP shows up

- Landing hero: staggered card entrance (Section 3) + the floating name/
  topic panel drift.
- Log page: streak chips can do a quick, subtle fill-in animation (color
  transitions to orange) when a day becomes logged, rather than popping
  instantly.
- View-toggle (Week/Month/Year): cross-fade or a short slide between views,
  not a hard cut.
- Create-log drop-up: rise/settle open and close (Section 5).
- Everywhere else: keep motion minimal. Don't add hover-glow, bounce, or
  scroll-triggered fade-ups on every card — the reference's own aesthetic is
  clean and calm aside from these deliberate moments; match that restraint
  even while matching its color and shape language.

---

## 7. Technical stack & implementation rules

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS.
- **Component primitives:** shadcn/ui is fine for structural primitives
  (dialog/sheet for the drop-up, dropdown, form, tooltip), but restyle every
  visual token to the palette in Section 1 — don't ship shadcn's default
  colors, focus rings, or button styles unmodified.
- **Motion:** GSAP for all animation described above. Locomotive Scroll is
  optional and only worth adding if there's a genuine scroll-driven moment
  on the landing page; don't add it just for ambient smoothness.
- **Accessibility & quality floor (non-negotiable):**
  - Responsive down to mobile (375px): the right column (profile+streak)
    should stack above or below the feed on small screens, not shrink
    illegibly.
  - Visible keyboard focus states styled in the orange accent, not left as
    shadcn's default ring.
  - Respect `prefers-reduced-motion`: disable card entrance stagger, floating
    drift, and streak fill-in animation; use instant/opacity-only fallback.
  - Text contrast on both cream and white surfaces must meet WCAG AA.

---

## 8. Copy & voice

Keep it plain and direct, written from the user's side of the screen:
"Log today's learning," not "Submit entry." Stat labels should describe real
things only — "Day streak," "Entries this month," "Longest streak" — do not
invent competitive stats (points, rank, leaderboard placement) that have no
real backing data, even though the reference includes them; that's one part
of the reference we don't copy, since it would be showing fake information.
Empty states are a plain invitation ("No entries yet. Log what you learned
today to start your streak."), not a mascot-voiced "Oops!" message.

---

## 9. Before you show me anything

1. Does the color system match Section 1's tokens throughout (cream + white
   cards + orange accent), with no leftover ink/ivory/brass from earlier
   iterations?
2. Does the streak card show Week, Month, and Year views, all using the
   same filled-chip convention?
3. Is the profile card showing only real, non-fabricated stats?
4. Does the landing page's floating card composition and floating entry
   panel both animate in smoothly, matching the reference's overlapping
   layout?
5. Is the create-log control a bottom-right floating button opening a
   bottom-anchored drop-up, animated with GSAP, and hidden for non-owners?
6. Screenshot (or describe) the rendered result and check it against this
   file before calling it done.