
# Build the Health Information Tab

Replace the "Coming soon" placeholder in the Health tab with a fully functional health management interface using data already stored in the `profiles` table.

## What You'll Get

A comprehensive health dashboard with three sections:

1. **Health Conditions** -- Add/remove chronic conditions (e.g., Diabetes, Hypertension, Asthma) stored in `profiles.medical_conditions`
2. **Allergies** -- Add/remove allergies (e.g., Penicillin, Peanuts) stored in `profiles.allergies`
3. **Current Medications** -- Add/remove medications you're taking, stored in `profiles.medications`

Each section will show items as removable badges and have an input field to add new entries. All data saves directly to the existing `profiles` table -- no database changes needed.

## Layout

```text
Health Information Tab:
+--------------------------------------------------+
| Health Conditions                                 |
| [Diabetes] [Hypertension] [x]                    |
| [Add condition...________] [+ Add]               |
+--------------------------------------------------+
| Allergies                                         |
| [Penicillin] [Dust] [x]                          |
| [Add allergy...________]  [+ Add]                |
+--------------------------------------------------+
| Current Medications                               |
| [Metformin 500mg] [Lisinopril] [x]               |
| [Add medication..._______] [+ Add]               |
+--------------------------------------------------+
| BMI Summary                                       |
| Weight: 70kg | Height: 170cm | BMI: 24.2 (Normal)|
+--------------------------------------------------+
```

## Changes

### 1. New Component: `src/components/patient/HealthInfo.tsx`

- Three card sections for conditions, allergies, medications
- Each with badge display + input to add/remove items
- Updates `profiles` table arrays directly via Supabase client
- BMI summary section using existing weight/height from profile
- Toast notifications on save

### 2. Update: `src/pages/dashboard/UserDashboard.tsx`

- Import `HealthInfo` component
- Replace the placeholder content in the `health` TabsContent with `<HealthInfo />`

## Technical Details

- No database migration needed -- all columns (`medical_conditions`, `allergies`, `medications`) already exist as arrays in `profiles`
- RLS policies already allow users to update their own profile
- Uses optimistic UI updates with rollback on error
