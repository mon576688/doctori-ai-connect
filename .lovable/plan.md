## Goal

Expand the public `/doctor-directory` with ~150 additional reputed, publicly-listed doctors from Bangladesh so the page ranks for many more long-tail "doctor + specialty + city/hospital" searches. This page stays purely informational (no booking, no fees) and is fully separate from `/doctors` (the bookable Doctori AI provider list).

## What I'll do

A single `supabase--insert` data INSERT into `directory_doctors` — no schema changes, no frontend changes.

### Coverage targets (~150 rows)

Spread across all 8 divisions and major hospitals, with broad specialty coverage:

**Dhaka (~55)**
- Square Hospital, United Hospital, Evercare, Apollo Imperial, Labaid Specialized, Ibn Sina, Popular Diagnostic, Anwer Khan Modern, BIRDEM, BSMMU, Dhaka Medical College, Holy Family Red Crescent, Bangabandhu Sheikh Mujib Medical, Bangladesh Specialized Hospital, Asgar Ali Hospital, Green Life, City Hospital, Central Hospital

**Chittagong (~25)**
- Chevron, Imperial, CSCR, Parkview, Max Hospital, Metropolitan, Chattogram Medical College, Southern Medical, Royal Hospital

**Sylhet (~15)**
- Mount Adora (Akhalia + Nayasarak), Park View Medical, North East Medical, Sylhet MAG Osmani Medical College, Ibn Sina Sylhet, Jalalabad Ragib-Rabeya Medical

**Rajshahi (~12)**
- Rajshahi Medical College, Popular Diagnostic Rajshahi, Islami Bank Hospital, Rajshahi Royal Hospital

**Khulna (~12)**
- Khulna Medical College, Gazi Medical, Ad-din Akij Medical, City Medical, Khulna Shishu

**Barisal (~8)**
- Sher-e-Bangla Medical College, Barisal Sadar, Mukto Akash

**Mymensingh (~8)**
- Mymensingh Medical College, Community Based Medical College, Swadesh Hospital

**Rangpur (~8)**
- Rangpur Medical College, Prime Medical, Rangpur Community Medical

**Comilla / others (~7)**
- Comilla Medical College, Moon Hospital, Trust Medical Cumilla, Bogura Mohammad Ali Hospital, Jashore Sadar, Faridpur Medical College

### Specialty breadth

Cardiology, Cardiac Surgery, Neurology, Neurosurgery, Oncology, Hematology, Gastroenterology, Hepatology, Endocrinology, Nephrology, Urology, Orthopedics, Rheumatology, ENT, Ophthalmology, Dermatology, Plastic Surgery, Psychiatry, Pediatrics, Neonatology, Gynecology & Obstetrics, Pulmonology, General Surgery, General Medicine, Vascular Surgery, Colorectal Surgery, Dentistry.

### Row content (per doctor)

`name`, `specialty`, `qualifications`, `hospital_name`, `chamber_address`, `city`, `area`, `office_hours`, `phone`, `bio` (2–3 lines), `years_experience`, `slug` (auto via `lower(regexp_replace(name,...))`), `is_featured = false` (we already featured top 10), `is_active = true`. `consultation_fee` left NULL (UI hides it anyway).

### Safety

- Uses `ON CONFLICT (slug) DO NOTHING` so re-runs are idempotent and won't duplicate previously seeded doctors.
- All data is from publicly listed chamber directories (hospital websites, public listings). No private contact info beyond publicly advertised chamber numbers.

## What I'm NOT doing in this step

- No per-doctor profile pages (`/doctor-directory/[slug]`) — happy to do that as a follow-up; it would give the biggest additional SEO lift.
- No schema changes.
- No edits to `DoctorDirectory.tsx`, `seo.ts`, or `sitemap.xml`.
- No changes to `/doctors` (bookable providers).
