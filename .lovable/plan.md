

# Fix Confirmation Page Consultation Type & Nurse-Specific Options

## Problem 1: Confirmation Page Always Shows "Online/Zoom"

The `Confirmed.tsx` page reads `consultationType` from URL search params with a default of `'video'` (line 29), completely ignoring the actual selection stored in BookingContext. The `ReviewConfirm.tsx` navigates to `/booking/confirmed` without passing the selected type as a query parameter. So the confirmation page always shows "Video Call" + "Zoom Meeting".

## Problem 2: Nurse Category Shows Wrong Visit Options

The review page (`ReviewConfirm.tsx`) shows "Online Consultation" and "Physical Visit (Chamber)" for all provider types including nurses. Nurses should have "House Visit" and "Online Consultation (Zoom)" instead of "Physical Visit (Chamber)".

## Solution

### 1. Pass consultation type to Confirmed page via BookingContext

In `ReviewConfirm.tsx`, the navigation already works -- the `consultationType` is already in BookingContext. The issue is `Confirmed.tsx` reads from search params instead of context.

**File: `src/pages/booking/Confirmed.tsx`**
- Read `consultationType` from `useBooking()` instead of search params
- Conditionally render the "Consultation Details" card:
  - If **physical/house visit**: Show "Physical Visit" or "House Visit" badge, show the address/location, and tips about arriving on time
  - If **online**: Show Video/Audio badge, platform info, and internet connection tips
- Remove the hardcoded `searchParams.get('type') || 'video'` and `searchParams.get('platform') || 'zoom'` defaults

### 2. Show nurse-specific consultation options in ReviewConfirm

**File: `src/pages/booking/ReviewConfirm.tsx`**
- Check `providerData.provider_type === 'nurse'`
- For nurses, change the radio options:
  - "House Visit" (nurse visits patient's home) instead of "Physical Visit (Chamber)"
  - "Online Consultation" remains the same
- For doctors/hospitals, keep the existing "Online Consultation" and "Physical Visit (Chamber)" options

### Files to Modify

1. **`src/pages/booking/Confirmed.tsx`** -- Use BookingContext for consultation type; conditionally render online vs physical confirmation details
2. **`src/pages/booking/ReviewConfirm.tsx`** -- Show nurse-specific labels ("House Visit" vs "Physical Visit (Chamber)")

