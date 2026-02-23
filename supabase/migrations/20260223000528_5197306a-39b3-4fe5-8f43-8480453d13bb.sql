
-- =============================================
-- 1. Seed Nurse Providers (Dhaka, Chittagong, Sylhet)
-- =============================================

-- Temporarily drop FK constraints for seeding
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- Nurse 1: Dhaka
INSERT INTO public.profiles (id, email, first_name, last_name, role, provider_type, city, bio, approval_status, phone)
VALUES 
  ('a1b2c3d4-0001-4000-8000-000000000001', 'nurse.ayesha@doctori.bd', 'Ayesha', 'Begum', 'provider', 'nurse', 'Dhaka', 'Experienced home care nurse specializing in elderly care and post-operative recovery. 8 years of nursing experience.', 'approved', '+880171000001'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'nurse.rina@doctori.bd', 'Rina', 'Akter', 'provider', 'nurse', 'Dhaka', 'Specialized in pediatric home nursing and newborn care. Certified in neonatal care.', 'approved', '+880171000002'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'nurse.shamim@doctori.bd', 'Shamim', 'Hossain', 'provider', 'nurse', 'Chittagong', 'Male nurse with expertise in wound care, physiotherapy assistance, and chronic disease management.', 'approved', '+880171000003'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'nurse.tasnim@doctori.bd', 'Tasnim', 'Rahman', 'provider', 'nurse', 'Chittagong', 'Home care nurse experienced in diabetes management, insulin administration, and patient education.', 'approved', '+880171000004'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'nurse.fatima@doctori.bd', 'Fatima', 'Khatun', 'provider', 'nurse', 'Sylhet', 'Registered nurse providing home visits for IV therapy, injections, and vital sign monitoring.', 'approved', '+880171000005'),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'nurse.rafiq@doctori.bd', 'Rafiq', 'Uddin', 'provider', 'nurse', 'Sylhet', 'Experienced in geriatric nursing, palliative care, and home-based rehabilitation support.', 'approved', '+880171000006')
ON CONFLICT (id) DO NOTHING;

-- Doctors entries for nurses (with specialty as "Nursing")
INSERT INTO public.doctors (user_id, specialty, experience, bio, approved, verified, consultation_fee)
VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Home Nursing Care', 8, 'Elderly care and post-operative recovery specialist', true, true, 500),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Pediatric Nursing', 6, 'Pediatric and neonatal home care specialist', true, true, 600),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Wound Care & Physiotherapy', 10, 'Wound care and physiotherapy assistance', true, true, 450),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Diabetes Care Nursing', 7, 'Diabetes management and insulin care', true, true, 500),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'IV Therapy & Injections', 5, 'Home IV therapy and vital monitoring', true, true, 400),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'Geriatric & Palliative Care', 12, 'Geriatric and palliative home care', true, true, 550)
ON CONFLICT (user_id) DO NOTHING;

-- User roles for nurses
INSERT INTO public.user_roles (user_id, role)
VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'provider'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'provider'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'provider'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'provider'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'provider'),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'provider')
ON CONFLICT DO NOTHING;

-- Availability for nurses (next 14 days)
INSERT INTO public.availability_dates (provider_id, date, time_slot, is_available, is_booked)
SELECT 
  p.id,
  CURRENT_DATE + d.day_offset,
  make_time(h.hour, 0, 0),
  true,
  false
FROM 
  public.profiles p
  CROSS JOIN generate_series(1, 14) AS d(day_offset)
  CROSS JOIN generate_series(8, 18) AS h(hour)
WHERE p.email LIKE 'nurse.%@doctori.bd'
ON CONFLICT DO NOTHING;

-- =============================================
-- 2. Add Real Bangladesh Hospitals
-- =============================================

-- Remove the test "Dammam Hospital" and "Gazi Medical Center"
DELETE FROM public.hospitals WHERE name IN ('Dammam Hospital', 'Gazi Medical Center');

-- Insert real renowned Bangladesh hospitals
INSERT INTO public.hospitals (id, name, city, address, description, phone, email, is_active)
VALUES
  -- Dhaka
  (gen_random_uuid(), 'Bangabandhu Sheikh Mujib Medical University (BSMMU)', 'Dhaka', 'Shahbag, Dhaka 1000', 'The premier postgraduate medical institution in Bangladesh, offering specialized treatment and research facilities.', '+880-2-9661064', 'info@bsmmu.edu.bd', true),
  (gen_random_uuid(), 'National Institute of Cardiovascular Diseases (NICVD)', 'Dhaka', 'Sher-e-Bangla Nagar, Dhaka 1207', 'The largest cardiac hospital in Bangladesh providing comprehensive cardiovascular care and surgery.', '+880-2-9116757', 'info@nicvd.gov.bd', true),
  (gen_random_uuid(), 'Sir Salimullah Medical College & Mitford Hospital', 'Dhaka', 'Mitford Road, Old Dhaka 1100', 'One of the oldest government hospitals in Dhaka, serving patients since 1820 with affordable healthcare.', '+880-2-7319002', NULL, true),
  (gen_random_uuid(), 'United Hospital Limited', 'Dhaka', 'Plot 15, Road 71, Gulshan, Dhaka 1212', 'A leading private multi-specialty hospital with international-standard diagnostic and treatment facilities.', '+880-2-8836000', 'info@uhlbd.com', true),
  (gen_random_uuid(), 'Evercare Hospital Dhaka', 'Dhaka', 'Plot 81, Block E, Bashundhara R/A, Dhaka 1229', 'International JCI-accredited hospital providing world-class healthcare with modern medical technology.', '+880-2-55066200', 'info@evercarebd.com', true),
  (gen_random_uuid(), 'Ibn Sina Hospital', 'Dhaka', 'House 48, Road 9/A, Dhanmondi, Dhaka 1209', 'Trusted private hospital known for quality diagnostics, surgery, and affordable outpatient services.', '+880-2-9126625', 'info@ibnsinatrust.com', true),
  (gen_random_uuid(), 'Labaid Specialized Hospital', 'Dhaka', 'House 1, Road 4, Dhanmondi, Dhaka 1205', 'A multi-disciplinary hospital offering 24/7 emergency, diagnostic imaging, and specialized surgical care.', '+880-2-9612345', 'info@labaidgroup.com', true),
  
  -- Chittagong
  (gen_random_uuid(), 'Chattogram General Hospital', 'Chittagong', 'Anderkilla, Chittagong 4000', 'The main government general hospital in Chittagong serving millions with free and subsidized healthcare.', '+880-31-619891', NULL, true),
  (gen_random_uuid(), 'Parkview Hospital Chittagong', 'Chittagong', 'Mehedibag, Chittagong 4000', 'A renowned private hospital in Chittagong offering modern diagnostic and surgical facilities.', '+880-31-654321', 'info@parkviewhospital.com.bd', true),
  (gen_random_uuid(), 'Imperial Hospital Limited', 'Chittagong', 'Plot 1/A, O.R. Nizam Road, Chittagong 4203', 'Premium multi-specialty hospital with advanced ICU, NICU, and cardiac care units.', '+880-31-658712', 'info@imperialhospitalctg.com', true),
  
  -- Sylhet
  (gen_random_uuid(), 'Sylhet Women''s Medical College Hospital', 'Sylhet', 'Mirboxtola, Sylhet 3100', 'Specialized hospital for women''s health, obstetrics, and gynecology with affordable care.', '+880-821-716891', NULL, true),
  (gen_random_uuid(), 'Mount Adora Hospital', 'Sylhet', 'Subhanighat, Sylhet 3100', 'Modern private hospital in Sylhet with specialized departments and 24/7 emergency services.', '+880-821-723456', 'info@mountadora.com', true),
  (gen_random_uuid(), 'Jalalabad Ragib-Rabeya Medical College Hospital', 'Sylhet', 'Airport Road, Sylhet 3100', 'A well-known teaching hospital with comprehensive medical and surgical departments.', '+880-821-761234', NULL, true)
ON CONFLICT DO NOTHING;

-- Restore FK constraints
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) NOT VALID;

ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) NOT VALID;
