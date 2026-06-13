## Goal
Expand the Doctor Directory with more publicly available reputed doctors across Bangladesh, strengthen SEO for `/doctor-directory`, and remove consultation fee from the UI.

## 1. Seed more doctors (data migration)
Insert ~40–50 additional reputed doctors into `directory_doctors` from publicly available chamber listings (hospital websites, public profiles). Coverage targets:

- **Dhaka** (additional): Square, United, Evercare, Apollo/Evercare, BIRDEM, BSMMU, Labaid, Ibn Sina, Popular, Anwer Khan Modern
- **Chittagong**: Chevron, Imperial, Chittagong Medical College, CSCR
- **Sylhet**: Mount Adora, Park View, Sylhet MAG Osmani Medical
- **Rajshahi**: Rajshahi Medical College Hospital, Popular Diagnostic Rajshahi
- **Khulna**: Khulna Medical College, Gazi Medical
- **Barisal**: Sher-e-Bangla Medical College
- **Mymensingh**: Mymensingh Medical College
- **Rangpur**: Rangpur Medical College, Prime Medical
- **Comilla**: Comilla Medical College, Moon Hospital

Specialties to broaden: Cardiology, Neurology, Neurosurgery, Oncology, Gastroenterology, Endocrinology, Nephrology, Urology, Orthopedics, ENT, Ophthalmology, Dermatology, Psychiatry, Pediatrics, Gynecology, Pulmonology, Rheumatology, General Surgery, Hematology.

Each row: name, specialty, qualifications, hospital_name, chamber_address, city, area, office_hours, phone (where publicly listed), bio, years_experience, is_featured (top 10 only), is_active=true. Slug auto-generated via `lower(regexp_replace(name,...))`. Use `ON CONFLICT (slug) DO NOTHING` so re-runs are safe.

No fee data is required (UI will hide it), but column stays nullable.

## 2. Hide consultation fee in the UI
In `src/pages/DoctorDirectory.tsx`, remove the fee block from `DoctorCard`. The bottom row keeps only the "Call" link (right-aligned). Remove the unused `consultation_fee` field rendering; the field stays in the interface for type safety but is unused.

## 3. SEO improvements for `/doctor-directory`
Update `<SEO>` usage on the page and register the route in `src/lib/seo.ts`:

- Add `doctorDirectory` entry in `PAGE_SEO` with:
  - `title`: "Doctor Directory Bangladesh — Reputed Specialists by City | Doctori AI"
  - `description`: "Browse a curated directory of reputed doctors across Bangladesh — Dhaka, Chittagong, Sylhet, Khulna and more. Filter by specialty and city."
  - `canonicalPath`: "/doctor-directory"
  - `keywords`: "doctor directory bangladesh, reputed doctors dhaka, chittagong specialists, bangladesh doctors list, doctor chamber address, find specialist bangladesh"
- Pass `keywords` and `canonicalPath` to the `<SEO>` component on the page.
- Add JSON-LD `MedicalBusiness`/`ItemList` schema inline in the page (via Helmet `<script type="application/ld+json">`) listing the top 20 featured doctors with `@type: Physician`, `name`, `medicalSpecialty`, `address`, `telephone`, `worksFor`. This dramatically improves rich-result eligibility.
- Add a single `<h1>` (already present) and ensure each `DoctorCard` uses semantic `<article>` with `itemScope itemType="https://schema.org/Physician"` microdata as a fallback signal.
- Add the route to `public/sitemap.xml` (and `scripts/generate-sitemap.mjs` if it drives the file) with priority 0.8.

## 4. Robots / indexability
No changes — page is already indexable.

## Technical details
- Migration file: `INSERT INTO public.directory_doctors (...) VALUES (...), (...), ... ON CONFLICT (slug) DO NOTHING;` — uses the data-insert tool (not a schema migration).
- Slug generation: `lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))` mirroring the existing seed.
- No schema change needed; the table already supports all required fields.
- TypeScript types in `src/integrations/supabase/types.ts` already match.

## Out of scope
- No booking/CTAs added (directory remains informational).
- No edits to `/doctors` (Find Doctors) page.
- No change to admin tooling for directory_doctors (can be added later if needed).

## Open question
Do you want me to also remove the `consultation_fee` **column** from the database, or just hide it in the UI for now? (Recommend: just hide — keeps data flexibility.)
