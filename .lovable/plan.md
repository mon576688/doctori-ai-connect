

# Fix: Bridge Availability Slots to Booking Flow

## Problem
The provider dashboard saves weekly recurring schedules to `availability_slots` (e.g., Monday 9:00-17:00). But the booking flow (`DateSelect.tsx`, `TimeSelect.tsx`) only queries `availability_dates` (specific date+time entries). Real providers who set their schedule through the dashboard have zero `availability_dates` rows, so the booking page shows "No available dates."

## Solution
Update `DateSelect.tsx` and `TimeSelect.tsx` to also check `availability_slots` when no `availability_dates` exist. This generates available dates dynamically from the provider's weekly recurring schedule.

---

## Changes

### 1. `src/pages/booking/DateSelect.tsx`
Update `fetchAvailability` to:
- First check `availability_dates` (existing logic, for providers who use specific dates)
- If none found, fall back to `availability_slots` and generate dates for the next 14 days based on the provider's weekly schedule
- Combine both sources for the calendar

```text
Logic:
1. Query availability_dates for future dates (existing)
2. Query availability_slots for the provider
3. For each slot, generate dates for the next 14 days matching that day_of_week
4. Exclude dates already in availability_dates or past dates
5. Merge into the available dates list
```

### 2. `src/pages/booking/TimeSelect.tsx`
Update `fetchTimeSlots` to:
- First check `availability_dates` for the selected date (existing)
- If none found, fall back to `availability_slots` for that day of week
- Generate 30-minute or 60-minute time slots from the start/end times
- Check against existing `appointments` to exclude already-booked times

```text
Logic:
1. Query availability_dates for selected date (existing)
2. If empty, query availability_slots where day_of_week matches
3. Generate hourly slots from start_time to end_time
4. Query appointments for that provider+date to filter out booked ones
5. Group into morning/afternoon/evening
```

### 3. `src/pages/booking/ReviewConfirm.tsx` (minor update)
When confirming a booking for a slot derived from `availability_slots` (not `availability_dates`):
- The `book_appointment_slot` function expects an `availability_dates` row to mark as booked
- Add a fallback: if no matching `availability_dates` row exists, create one on-the-fly (INSERT then mark booked), OR skip the availability_dates update for slot-based bookings
- The safest approach: create the `availability_dates` entry during booking so the slot is properly tracked

### 4. Database: Update `book_appointment_slot` function
Modify the function to handle cases where the availability comes from `availability_slots` instead of `availability_dates`:
- If no `availability_dates` row exists for the provider+date+time, create one with `is_booked = true`
- This ensures the slot is recorded and won't be double-booked

```sql
-- Updated logic inside book_appointment_slot:
-- Try to find and lock existing availability_dates row
-- If not found, check availability_slots for that day_of_week
-- If valid, INSERT a new availability_dates row as booked
-- If neither exists, raise exception
```

---

## Technical Details

### DateSelect fallback logic:
```typescript
// After checking availability_dates...
if (availableDates.length === 0) {
  // Fetch recurring weekly slots
  const { data: weeklySlots } = await supabase
    .from('availability_slots')
    .select('day_of_week, start_time, end_time')
    .eq('provider_id', id)
    .eq('is_available', true);
  
  // Generate next 14 days matching those days of week
  const generated: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = addDays(new Date(), i);
    if (weeklySlots?.some(s => s.day_of_week === d.getDay())) {
      generated.push(d);
    }
  }
  setAvailableDates(generated);
}
```

### TimeSelect fallback logic:
```typescript
// After checking availability_dates...
if (slots.length === 0 && selectedDate) {
  const dayOfWeek = selectedDate.getDay();
  const { data: weeklySlots } = await supabase
    .from('availability_slots')
    .select('start_time, end_time')
    .eq('provider_id', id)
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true);
  
  // Generate hourly time slots from each range
  // Filter out already-booked appointments
}
```

### Updated `book_appointment_slot` function:
```sql
-- Replace the strict availability_dates lookup with:
SELECT (is_available = true AND is_booked = false) INTO _is_available
FROM availability_dates
WHERE provider_id = _provider_id AND date = _date AND time_slot = _time_slot
FOR UPDATE;

IF _is_available IS NULL THEN
  -- No availability_dates row; check availability_slots
  IF EXISTS (
    SELECT 1 FROM availability_slots
    WHERE provider_id = _provider_id
      AND day_of_week = EXTRACT(DOW FROM _date)
      AND is_available = true
      AND start_time <= _time_slot
      AND end_time > _time_slot
  ) THEN
    -- Create the availability_dates row as booked
    INSERT INTO availability_dates (provider_id, date, time_slot, is_available, is_booked)
    VALUES (_provider_id, _date, _time_slot, true, true);
  ELSE
    RAISE EXCEPTION 'Time slot is no longer available';
  END IF;
ELSIF _is_available = false THEN
  RAISE EXCEPTION 'Time slot is no longer available';
ELSE
  -- Mark existing row as booked
  UPDATE availability_dates SET is_booked = true, updated_at = now()
  WHERE provider_id = _provider_id AND date = _date AND time_slot = _time_slot;
END IF;
```

### Files to modify:
1. `src/pages/booking/DateSelect.tsx` -- add availability_slots fallback
2. `src/pages/booking/TimeSelect.tsx` -- add availability_slots fallback
3. Database migration -- update `book_appointment_slot` function to handle slot-based availability

