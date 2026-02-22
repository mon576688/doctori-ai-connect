

# Comprehensive Fix Plan: Booking Flow + Admin Dashboard

## Summary of Issues Found

### Critical: Booking Flow Shows "No Doctors Found"
- Only 2 providers exist in the database, both with unusable data:
  - "jhon doe": missing city, provider_type, specialty, consultation_fee
  - "Monir Hossain": city is "Qaryat Al Ulya" (not a Bangladesh city), verified=false
- No hospitals in Bangladesh cities (only Gazipur and Dammam)
- No `availability_dates` records exist (needed for date/time booking steps)
- The booking flow filters by city (e.g., "Dhaka") and finds nothing

### Admin Dashboard: Content Management Uses Mock Data
- `ContentManagement.tsx` has `setBlogs([]); setHealthTips([]);` -- no database tables for blogs or health tips exist
- Blog editor UI exists but save/delete functions are stubs

### Admin Dashboard: Document Review Foreign Key
- Uses `profiles!provider_documents_provider_id_fkey` join -- will work only if the FK constraint exists with that exact name (low risk but worth noting)

---

## Plan (3 Steps)

### Step 1: Seed Sample Providers and Hospitals for Bangladesh

Insert via SQL migration:

- **8 sample providers** across Dhaka, Chittagong, and Sylhet with realistic data:
  - Specialties: Cardiology, Neurology, Dentistry, Orthopedics, Dermatology, Pediatrics, General Practice, Gynecology
  - Each with city, provider_type ("doctor"), specialty, consultation_fee, bio, approval_status="approved"
  - Corresponding entries in `doctors` table with verified=true, approved=true
  - Corresponding entries in `user_roles` table with role="provider"

- **4 sample hospitals** in Dhaka, Chittagong, and Sylhet

- **Availability slots** for each provider (weekday schedules, 09:00-17:00)

- **Availability dates** for the next 14 days for each provider

This will use Supabase's `auth.users` creation via the `admin_create_provider` RPC or direct SQL inserts into profiles/doctors tables.

**Note**: Since we cannot create auth.users via SQL migration, we will insert directly into `profiles` and `doctors` tables using generated UUIDs. These will be display-only sample data (not real login accounts).

### Step 2: Create Blog Content Tables

Create two new database tables:

**`blog_posts` table:**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| title | text | NOT NULL |
| slug | text | UNIQUE, NOT NULL |
| excerpt | text | |
| content | text | |
| category | text | |
| status | text | DEFAULT 'draft' |
| author_id | uuid | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**`health_tips` table:**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| title | text | NOT NULL |
| content | text | |
| category | text | |
| icon | text | |
| priority | integer | DEFAULT 0 |
| is_active | boolean | DEFAULT true |
| created_at | timestamptz | |

RLS policies: Admin full access, public read for published/active content.

Then update `ContentManagement.tsx` to use real Supabase queries instead of mock data.

### Step 3: Fix Existing Provider Data

Update the two existing providers to have valid Bangladesh data:
- "jhon doe" (id: 9914e0b3): set city="Dhaka", provider_type="doctor", specialty="General Practice"
- "Monir Hossain" (id: 6b158235): set city="Dhaka" (from "Qaryat Al Ulya")

---

## Expected Results After Implementation

1. **Booking flow**: Selecting "Dhaka" and "Doctor" will show 3-4 providers with photos, specialties, and consultation fees
2. **Date/time selection**: Available dates and time slots will appear for the next 2 weeks
3. **Hospital booking**: Selecting "Hospital" will show hospitals in Dhaka, Chittagong, Sylhet
4. **Content Management**: Admin can create, edit, and manage blog posts and health tips from the dashboard
5. **All 14 admin sections**: Fully functional with real data

