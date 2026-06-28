## Goal

On the provider booking page (`/booking/provider/:id`), add a **Similar Doctors** section that helps users find an alternative when the current doctor's schedule doesn't fit. Each suggested card shows the doctor's next available appointment slot so users can quickly pick someone else.

## Scope

- Source: **bookable providers only** (live `providers_public` view / `doctors` + `profiles` data already used in booking).
- Match: **same specialty** + **same city** as the current doctor (area preferred when available, otherwise city-wide).
- Exclude the currently viewed doctor.
- Limit: up to **6 similar doctors**, ordered by soonest next-available slot, then rating, then experience.
- Card shows: photo, name, specialty, city/area, rating, and **"Next available: <day, date, time>"** badge.
- Clicking a card navigates to that doctor's booking provider profile (same route, new id) and resets the relevant booking context to that doctor.

## UX

```text
┌──────────────────────────────────────────────────────────────┐
│ Current Doctor Profile (existing content)                    │
│ ... bio, schedule, Book Appointment CTA ...                  │
└──────────────────────────────────────────────────────────────┘

── Similar Doctors ─────────────────────────────────────────────
Same specialty in <City>. Different schedules so you can find a
time that works.

┌────────────┐ ┌────────────┐ ┌────────────┐
│  [photo]   │ │  [photo]   │ │  [photo]   │
│ Dr. Name   │ │ Dr. Name   │ │ Dr. Name   │
│ Cardiology │ │ Cardiology │ │ Cardiology │
│ Dhaka·Gulshan│ │ Dhaka·Banani│ │ Dhaka·Uttara│
│ ★ 4.8 · 12y│ │ ★ 4.6 · 9y │ │ ★ 4.9 · 18y│
│ ─────────  │ │ ─────────  │ │ ─────────  │
│ Next: Tue, │ │ Next: Wed, │ │ Next:      │
│ 3:00 PM    │ │ 10:30 AM   │ │ Today 6 PM │
│ [View →]   │ │ [View →]   │ │ [View →]   │
└────────────┘ └────────────┘ └────────────┘
```

- Horizontal scroll on mobile; 3-up grid on desktop.
- If no similar doctors found, hide the section entirely (no empty state).
- If a similar doctor has no future availability in the next 30 days, show **"Schedule on request"** instead of a date.

## Technical Implementation

1. **New component** `src/components/booking/SimilarDoctors.tsx`
   - Props: `currentDoctorId`, `specialty`, `city`, `area?`.
   - Fetches similar providers from `providers_public` (same source used in `ProviderList`) filtered by specialty + city, excluding `currentDoctorId`, limit 12 (oversample so we can rank by next slot).
   - For each candidate, compute next available slot by querying:
     - `availability_dates` for the next 30 days where `is_available = true AND is_booked = false`, take earliest.
     - Fallback to `availability_slots` (recurring weekly) → derive the next matching weekday + earliest hour, then exclude already-booked `appointments` on that date.
   - Sort candidates by next-slot timestamp ascending; secondary sort by rating desc, then experience desc.
   - Slice to top 6.
   - Renders a horizontally scrollable list of cards using existing shadcn `Card` + `Badge` components and the project's medical-blue accent.

2. **Wire into `src/pages/booking/ProviderProfile.tsx`**
   - Render `<SimilarDoctors />` below the existing profile content, above the footer area.
   - Pass `providerData.specialty`, `providerData.city/area`, and the route `id`.

3. **Navigation behavior**
   - Card "View →" / whole-card click calls `setProvider(newId, newProviderData)` from `BookingContext` and `navigate(\`/booking/provider/\${newId}\`)`.
   - `useEffect` in `ProviderProfile` already refetches on `id` change, so the page swaps cleanly.

4. **Performance**
   - Single query for candidate doctors, then a batched query for `availability_dates` across all candidate ids (`provider_id IN (...)`) for the next 30 days — avoids N+1.
   - Memoize the computed "next slot" map.

5. **No DB schema changes** — uses existing `providers_public`, `availability_dates`, `availability_slots`, and `appointments` tables.

## Out of Scope

- Adding directory_doctors (info-only) to suggestions.
- Filter UI (specialty/city pickers) on the similar list.
- Showing similar doctors anywhere other than the provider profile page.
