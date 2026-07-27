# StreakLog v3 design plan

## Visual system

- `#F7F1E6` is the warm cream page background.
- `#FFFFFF` and `#FFFDF8` are the card surfaces.
- `#1B1B1B` is the primary text color.
- `#8C8C8C` supports secondary labels and metadata.
- `#F97316` is the active orange for buttons and logged streak days.
- `#FDBA74` is the lighter orange accent.
- `#C2410C` to `#F97316` is reserved for the landing hero background.

Typography uses Space Grotesk for headings and Inter for body copy. The interface uses rounded warm-white cards and low-opacity neutral shadows to match the chosen reference system.

## Layout

```
[orange landing hero: setup form] [overlapping log, profile, and streak cards]

[learning-log feed]               [sticky profile and streak column]
```

The landing hero explains the product through log and streak cards only. The log page keeps entries in the main feed and real profile statistics in the sticky right column.

## Streak system

Week, Month, and Year use the same filled-orange-chip convention:

- Week displays a seven-day chip row.
- Month displays a calendar grid using the same chip styles.
- Year displays twelve compact chip grids, one for each month.

Only days that have a stored log are filled orange. The profile card shows only real statistics: day streak, entries this month, and longest streak.

## Motion

- The landing card composition enters through a GSAP stagger.
- The landing setup panel eases in and drifts subtly after loading.
- Streak chip fill and view changes use short GSAP transitions.
- The owner-only composer rises from the lower right and settles into place.
- `prefers-reduced-motion` renders these elements without animation.

## Scope check

No course cards, progress bars, lesson counts, video thumbnails, watch-time charts, ranks, points, or upgrade banners are included. The floating composer remains visible only to the profile owner and preserves the existing log creation flow.
