
-- Drop ALL FK constraints referencing auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- Fix existing providers
UPDATE public.profiles SET city = 'Dhaka', provider_type = 'doctor' WHERE id = '9914e0b3-a9f0-4671-8f08-edaba6b0c1f1';
UPDATE public.profiles SET city = 'Dhaka' WHERE id = '6b158235-16ce-4170-9b21-c88867bde917';
UPDATE public.doctors SET verified = true, approved = true, consultation_fee = 1500 WHERE user_id = '6b158235-16ce-4170-9b21-c88867bde917';

-- Insert sample providers
INSERT INTO public.profiles (id, email, first_name, last_name, city, provider_type, role, approval_status, bio, phone, address)
VALUES
  (gen_random_uuid(), 'dr.rahman@doctori.bd', 'Dr. Anik', 'Rahman', 'Dhaka', 'doctor', 'provider', 'approved', 'Experienced general medicine practitioner.', '+880-1711-000001', 'Dhanmondi, Dhaka'),
  (gen_random_uuid(), 'dr.sultana@doctori.bd', 'Dr. Fatema', 'Sultana', 'Dhaka', 'doctor', 'provider', 'approved', 'Board-certified cardiologist.', '+880-1711-000002', 'Gulshan-2, Dhaka'),
  (gen_random_uuid(), 'dr.ahmed@doctori.bd', 'Dr. Kamal', 'Ahmed', 'Chittagong', 'doctor', 'provider', 'approved', 'Pediatrician for child healthcare.', '+880-1711-000003', 'Agrabad, Chittagong'),
  (gen_random_uuid(), 'dr.begum@doctori.bd', 'Dr. Nasreen', 'Begum', 'Sylhet', 'doctor', 'provider', 'approved', 'Dermatologist for skin care.', '+880-1711-000004', 'Zindabazar, Sylhet'),
  (gen_random_uuid(), 'dr.islam@doctori.bd', 'Dr. Rahim', 'Islam', 'Dhaka', 'doctor', 'provider', 'approved', 'Orthopedic surgeon.', '+880-1711-000005', 'Banani, Dhaka'),
  (gen_random_uuid(), 'dr.hasan@doctori.bd', 'Dr. Mahbub', 'Hasan', 'Chittagong', 'doctor', 'provider', 'approved', 'Neurologist.', '+880-1711-000006', 'GEC Circle, Chittagong'),
  (gen_random_uuid(), 'dr.khatun@doctori.bd', 'Dr. Salma', 'Khatun', 'Dhaka', 'doctor', 'provider', 'approved', 'Dental surgeon.', '+880-1711-000007', 'Uttara, Dhaka'),
  (gen_random_uuid(), 'dr.jahan@doctori.bd', 'Dr. Nusrat', 'Jahan', 'Sylhet', 'doctor', 'provider', 'approved', 'Gynecologist.', '+880-1711-000008', 'Amberkhana, Sylhet');

-- Create doctors entries
INSERT INTO public.doctors (user_id, specialty, license_number, experience, bio, consultation_fee, verified, approved)
SELECT p.id,
  CASE p.email
    WHEN 'dr.rahman@doctori.bd' THEN 'General Medicine'
    WHEN 'dr.sultana@doctori.bd' THEN 'Cardiology'
    WHEN 'dr.ahmed@doctori.bd' THEN 'Pediatrics'
    WHEN 'dr.begum@doctori.bd' THEN 'Dermatology'
    WHEN 'dr.islam@doctori.bd' THEN 'Orthopedics'
    WHEN 'dr.hasan@doctori.bd' THEN 'Neurology'
    WHEN 'dr.khatun@doctori.bd' THEN 'Dentistry'
    WHEN 'dr.jahan@doctori.bd' THEN 'Gynecology'
  END,
  'BMDC-' || substr(md5(p.email), 1, 5),
  CASE p.email
    WHEN 'dr.rahman@doctori.bd' THEN 10
    WHEN 'dr.sultana@doctori.bd' THEN 15
    WHEN 'dr.ahmed@doctori.bd' THEN 8
    WHEN 'dr.begum@doctori.bd' THEN 12
    WHEN 'dr.islam@doctori.bd' THEN 20
    WHEN 'dr.hasan@doctori.bd' THEN 14
    WHEN 'dr.khatun@doctori.bd' THEN 9
    WHEN 'dr.jahan@doctori.bd' THEN 11
  END,
  p.bio,
  CASE p.email
    WHEN 'dr.rahman@doctori.bd' THEN 800
    WHEN 'dr.sultana@doctori.bd' THEN 1500
    WHEN 'dr.ahmed@doctori.bd' THEN 1000
    WHEN 'dr.begum@doctori.bd' THEN 1200
    WHEN 'dr.islam@doctori.bd' THEN 1800
    WHEN 'dr.hasan@doctori.bd' THEN 1600
    WHEN 'dr.khatun@doctori.bd' THEN 700
    WHEN 'dr.jahan@doctori.bd' THEN 1300
  END,
  true, true
FROM public.profiles p WHERE p.email LIKE '%@doctori.bd';

-- Create user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'provider'::app_role
FROM public.profiles p WHERE p.email LIKE '%@doctori.bd'
ON CONFLICT (user_id, role) DO NOTHING;

-- Seed availability_dates for new providers
INSERT INTO public.availability_dates (provider_id, date, time_slot, is_available, is_booked)
SELECT d.user_id, (CURRENT_DATE + i)::date, (TIME '09:00' + (interval '1 hour' * h))::time, true, false
FROM public.doctors d JOIN public.profiles p ON p.id = d.user_id,
generate_series(1, 14) AS i, generate_series(0, 7) AS h
WHERE p.email LIKE '%@doctori.bd'
ON CONFLICT DO NOTHING;

-- Seed availability_slots for new providers
INSERT INTO public.availability_slots (provider_id, day_of_week, start_time, end_time, is_available)
SELECT d.user_id, dow, '09:00'::time, '17:00'::time, true
FROM public.doctors d JOIN public.profiles p ON p.id = d.user_id,
generate_series(0, 4) AS dow
WHERE p.email LIKE '%@doctori.bd'
ON CONFLICT DO NOTHING;

-- Re-add FK constraints as NOT VALID
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
