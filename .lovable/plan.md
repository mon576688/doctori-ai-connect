## Goal

Surface the existing `SimilarDoctors` component in two more places in the booking flow, in addition to where it already lives.

## Where it will appear

1. **Provider Profile** (`/booking/provider/:id`) — already in place, no change.
2. **Time Select** (`/booking/time/:id`) — new. Rendered below the time-slot grid so users who can't find a suitable time can switch to a similar doctor.
3. **Doctor List** (`/booking/providers`) — new. Rendered at the bottom of the list, only when the user has at least one provider in view (uses the first/top provider as the reference for "similar to").

## Behavior per page

- **Time Select**: pass `currentDoctorId`, `specialty`, and `city` from the currently selected provider (already loaded in `BookingContext` / page state). Heading: "Other doctors you can book".
- **Doctor List**: pass the top-listed provider's `id`, `specialty`, and the selected `city` from `BookingContext`. Heading: "Similar doctors nearby". Hidden when the list is empty or still loading.
- Clicking a card uses the existing `setProvider()` + `navigate('/booking/provider/:id')` behavior already implemented inside `SimilarDoctors`.

## Technical notes

- No new component or DB work — reuse `src/components/booking/SimilarDoctors.tsx` as-is.
- Edit `src/pages/booking/TimeSelect.tsx`: import `SimilarDoctors`, render it after the time-slot section using the page's existing provider data.
- Edit `src/pages/booking/ProviderList.tsx`: import `SimilarDoctors`, render it after the provider grid using the first provider in the result set as the reference.
- No changes to `BookingContext`, routes, or the component's props/queries.

## Out of scope

- Date Select page (not requested).
- Filter UI or new matching criteria.
- Any styling changes to the `SimilarDoctors` card itself.
