

# Add Doctor Directory -- Footer Link Approach

## Rationale

The existing `/doctors` page is the primary flow for finding and booking registered platform providers. Adding a separate "Doctor Directory" prominently in the navbar would create confusion. Instead, the directory will be a secondary, informational resource -- accessible from the **footer's Quick Links** section.

## What Gets Built

A new `/doctor-directory` page that serves as a **browsable, public directory** of doctors organized by specialty, city, and hospital. It is informational (like a blog/reference page), not tied to the booking flow.

## Changes

### 1. New File: `src/pages/DoctorDirectory.tsx`

A full-page directory with:
- **Search bar** to filter by name, specialty, or city
- **Two tabs**: "By Specialty" and "By Hospital"
- **City filter chips**: Dhaka, Chittagong, Sylhet, Rajshahi, etc.
- **Specialty grid**: Cardiologist, Neurologist, Dentist, etc.
- **Doctor cards** showing photo, name, specialty, city, experience, fee
- **Hospital grouping** (when hospital tab is active)
- Data pulled from the existing `providers_public` view (no new tables needed)

### 2. Modified: `src/App.tsx`

Add route:
```
/doctor-directory -> DoctorDirectory component
```

### 3. Modified: `src/components/Footer.tsx`

Add a "Doctor Directory" link in the **Quick Links** section, right after "Find Doctors":

```
Home
Find Doctors
Doctor Directory    <-- new link
Health Blog
About Us
Contact
```

### 4. Modified: `src/locales/en/common.json` (and bn, ar, es, fr)

Add translation key:
```
"footer.doctorDirectory": "Doctor Directory"
```

## What Does NOT Change

- The **Navbar** stays unchanged -- no new nav items
- The existing `/doctors` page (provider search + booking) is untouched
- No new database tables or migrations

## Page Layout

```text
+--------------------------------------------------+
|  Doctor Directory                                 |
|  Browse doctors by specialty, city, or hospital   |
+--------------------------------------------------+
|  [Search by name, specialty, or city...]          |
+--------------------------------------------------+
|  [By Specialty]  [By Hospital]    (tabs)          |
+--------------------------------------------------+
|  Cities: [Dhaka] [Chittagong] [Sylhet] [All]      |
+--------------------------------------------------+
|  Specialty Grid (or Hospital list):               |
|  [Cardiologist] [Neurologist] [Dentist] ...       |
+--------------------------------------------------+
|  Doctor Cards Grid:                               |
|  +----+ +----+ +----+                             |
|  | Dr | | Dr | | Dr |                             |
|  +----+ +----+ +----+                             |
+--------------------------------------------------+
```

