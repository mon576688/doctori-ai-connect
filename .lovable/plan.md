

# Patient Medical Records -- Upload and Share Documents

## What We're Building

A new "Medical Records" tab in the User Dashboard where patients can upload, view, and manage their own medical documents (lab reports, prescriptions, imaging results, etc.). Patients can also share specific records with their doctors during appointments.

---

## Changes Overview

### 1. Create Storage Bucket for Patient Records

**Database migration** to create a `medical-records` storage bucket (private) with RLS policies so patients can only access their own files.

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-records', 'medical-records', false);

-- Patients can upload to their own folder
CREATE POLICY "Patients can upload their records"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'medical-records' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Patients can view their own files
CREATE POLICY "Patients can view their records"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'medical-records' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Patients can delete their own files
CREATE POLICY "Patients can delete their records"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'medical-records' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Providers can view records shared with them (via shared_medical_records table)
CREATE POLICY "Providers can view shared records"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'medical-records' AND EXISTS (
  SELECT 1 FROM public.shared_medical_records smr
  JOIN public.medical_records mr ON mr.id = smr.record_id
  WHERE mr.file_path = name AND smr.doctor_id = auth.uid()
));
```

### 2. Create `medical_records` Table

**Database migration:**

```sql
CREATE TABLE public.medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  file_type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Patients manage their own records
CREATE POLICY "Users can insert their records" ON public.medical_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their records" ON public.medical_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their records" ON public.medical_records
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their records" ON public.medical_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all records" ON public.medical_records
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
```

### 3. Create `shared_medical_records` Table

For sharing specific records with doctors:

```sql
CREATE TABLE public.shared_medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id uuid NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL,
  doctor_id uuid NOT NULL,
  shared_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(record_id, doctor_id)
);

ALTER TABLE public.shared_medical_records ENABLE ROW LEVEL SECURITY;

-- Patients can share their records
CREATE POLICY "Patients can share their records" ON public.shared_medical_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);

-- Patients can view their shares
CREATE POLICY "Patients can view their shares" ON public.shared_medical_records
  FOR SELECT TO authenticated USING (auth.uid() = patient_id);

-- Patients can revoke shares
CREATE POLICY "Patients can revoke shares" ON public.shared_medical_records
  FOR DELETE TO authenticated USING (auth.uid() = patient_id);

-- Providers can view records shared with them
CREATE POLICY "Providers can view shared records" ON public.shared_medical_records
  FOR SELECT TO authenticated USING (auth.uid() = doctor_id);

-- Providers can also view the medical_records that are shared with them
CREATE POLICY "Providers can view shared medical records" ON public.medical_records
  FOR SELECT TO authenticated USING (
    has_role(auth.uid(), 'provider'::app_role) AND EXISTS (
      SELECT 1 FROM public.shared_medical_records
      WHERE record_id = medical_records.id AND doctor_id = auth.uid()
    )
  );
```

### 4. New Component: `MedicalRecords.tsx`

**New file: `src/components/patient/MedicalRecords.tsx`**

Features:
- Upload area with document type selector (Lab Report, X-Ray/Imaging, Prescription, Vaccination Record, Discharge Summary, Insurance, Other)
- File list showing all uploaded records with type badge, date, file size
- View/download buttons for each record
- Delete button with confirmation
- Share dialog: select a doctor (from past appointments) to share a record with
- File size limit: 10MB, accepted formats: PDF, JPG, PNG, DOCX

### 5. Add "Medical Records" Tab to User Dashboard

**File: `src/pages/dashboard/UserDashboard.tsx`**

- Add a new tab "Records" with a folder icon between Prescriptions and Reminders
- Render the `MedicalRecords` component inside it

---

## UI Layout

```text
User Dashboard Tabs:
[Profile] [Appointments] [Prescriptions] [Records] [Reminders] [Health] [Messages]

Records Tab:
+--------------------------------------------------+
| Upload Medical Records                            |
| [Document Type: v]  [Choose File]  [Upload]       |
| Title: [______________________]                   |
| Accepted: PDF, JPG, PNG, DOCX (Max 10MB)         |
+--------------------------------------------------+
| My Medical Records                                |
|                                                    |
| [PDF] Blood Test Report - Jan 2025       [Share]  |
|       Lab Report | 1.2 MB | Jan 15, 2025 [Delete] |
|                                                    |
| [IMG] Chest X-Ray                        [Share]  |
|       X-Ray/Imaging | 3.4 MB | Dec 2024  [Delete] |
+--------------------------------------------------+
```

### Share Dialog

```text
+----------------------------------+
| Share Record With Doctor          |
|                                   |
| Select a doctor:                  |
| [Dr. Ahmed - Cardiologist    v]   |
|                                   |
| [Share]  [Cancel]                 |
+----------------------------------+
```

---

## Files to Change

1. **Database migration** -- Create `medical_records` table, `shared_medical_records` table, and `medical-records` storage bucket with RLS
2. **`src/components/patient/MedicalRecords.tsx`** -- New component for upload, list, share functionality
3. **`src/pages/dashboard/UserDashboard.tsx`** -- Add "Records" tab

## No Edge Functions Required

All operations use the Supabase client directly (storage uploads and database queries), secured by RLS policies.

