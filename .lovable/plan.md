# Separate Doctor Directory from Find Doctors

## Goal

- **Find Doctors (`/doctors`)** — only doctors who registered on Doctori AI (bookable, chat, prescriptions, etc.). Powered by `providers_public`.
- **Doctor Directory (`/doctor-directory`)** — a curated public listing of reputed doctors from across Bangladesh (read-only info: name, specialty, qualifications, chamber/hospital, city, office hours, fees, phone). Not bookable on the platform.

Today both pages read from `providers_public`, and the 20 seeded "Dhaka doctors" we just added live as fake registered providers. We will move that curated content into its own table so the two surfaces are truly separate.

## Changes

### 1. New table: `directory_doctors`

Public, read-only curated dataset. Fields:
- name, slug
- specialty, qualifications (text)
- hospital / chamber name, address, city, area
- office hours (text), consultation fee (int, BDT)
- phone, whatsapp (optional)
- photo_url (optional), bio
- years_experience, is_featured, is_active

RLS:
- Anyone can SELECT where `is_active = true`
- Only admins can INSERT / UPDATE / DELETE

### 2. Remove the seeded fake providers

Delete the 20 `@doctoriai-seed.local` accounts from `auth.users` (cascades to profiles, user_roles, doctors) so Find Doctors is back to only real registrants. Re-insert the same 20 Dhaka doctors (plus room for more cities) into `directory_doctors`.

### 3. Frontend

- `src/pages/DoctorDirectory.tsx` — switch query from `providers_public` to `directory_doctors`. Keep current UI (search, city filter, specialty tabs). Remove hospitals/booking CTAs; show "View Profile" + "Call" actions only. Update copy: "Reputed doctors across Bangladesh — informational listing, not bookable on Doctori AI."
- `src/pages/Doctors.tsx` — unchanged logic (still `providers_public`), update empty-state copy to clarify these are Doctori AI registered providers.
- Navbar: keep "Find Doctors" → `/doctors`. Add "Doctor Directory" link under Resources/Explore (or footer) → `/doctor-directory`.
- `DoctorDirectory` detail click → a lightweight modal/profile card (no `/doctor/:id` booking route). New `src/pages/DirectoryDoctorProfile.tsx` (optional, read-only) at `/doctor-directory/:slug`.

### 4. Admin

Add a simple admin screen `src/components/admin/DirectoryManagement.tsx` to add/edit/delete `directory_doctors` rows. Linked from AdminSidebar.

### 5. SEO

- DoctorDirectory: schema.org `MedicalBusiness` list, title "Doctor Directory Bangladesh — Reputed Doctors by Specialty & City".
- Doctors: keep existing SEO.

## Technical notes

```text
directory_doctors
  id uuid pk
  slug text unique
  name text
  specialty text
  qualifications text
  hospital_name text
  chamber_address text
  city text
  area text
  office_hours text
  consultation_fee int
  phone text
  whatsapp text
  photo_url text
  bio text
  years_experience int
  is_featured bool default false
  is_active bool default true
  created_at, updated_at
```

Migration order:
1. Create `directory_doctors` + RLS + updated_at trigger.
2. Seed the 20 Dhaka doctors (and structure for more).
3. Delete the seeded auth users (`email like '%@doctoriai-seed.local'`).

## Out of scope

- No changes to booking, appointments, prescriptions, or messaging flow.
- No new auth roles.
