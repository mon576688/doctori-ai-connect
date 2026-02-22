
-- Drop availability FK constraints temporarily
ALTER TABLE public.availability_slots DROP CONSTRAINT IF EXISTS availability_slots_provider_id_fkey;
ALTER TABLE public.availability_dates DROP CONSTRAINT IF EXISTS availability_dates_provider_id_fkey;

-- Also create a doctor entry for jhon doe (9914e0b3) who is marked as provider but has no doctors row
INSERT INTO public.doctors (user_id, specialty, experience, bio, consultation_fee, verified, approved)
VALUES ('9914e0b3-a9f0-4671-8f08-edaba6b0c1f1', 'General Practice', 5, 'General practitioner in Dhaka.', 600, true, true)
ON CONFLICT DO NOTHING;

-- Seed availability_dates for next 14 days - only for providers that exist in doctors table
INSERT INTO public.availability_dates (provider_id, date, time_slot, is_available, is_booked)
SELECT 
  d.user_id,
  (CURRENT_DATE + i)::date,
  (TIME '09:00' + (interval '1 hour' * h))::time,
  true,
  false
FROM 
  public.doctors d
  JOIN public.profiles p ON p.id = d.user_id,
  generate_series(1, 14) AS i,
  generate_series(0, 7) AS h
WHERE p.approval_status = 'approved' AND d.approved = true
ON CONFLICT DO NOTHING;

-- Seed availability_slots (Mon-Fri)
INSERT INTO public.availability_slots (provider_id, day_of_week, start_time, end_time, is_available)
SELECT 
  d.user_id,
  dow,
  '09:00'::time,
  '17:00'::time,
  true
FROM 
  public.doctors d
  JOIN public.profiles p ON p.id = d.user_id,
  generate_series(0, 4) AS dow
WHERE p.approval_status = 'approved' AND d.approved = true
ON CONFLICT DO NOTHING;

-- Re-add FK constraints as NOT VALID
ALTER TABLE public.availability_slots ADD CONSTRAINT availability_slots_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.doctors(user_id) NOT VALID;
ALTER TABLE public.availability_dates ADD CONSTRAINT availability_dates_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.profiles(id) NOT VALID;

-- Add hospitals
INSERT INTO public.hospitals (name, city, address, phone, email, description, is_active)
VALUES
  ('Dhaka Medical College Hospital', 'Dhaka', 'Secretariat Road, Dhaka 1000', '+880-2-55165088', 'info@dmch.gov.bd', 'Leading government hospital.', true),
  ('Square Hospital', 'Dhaka', '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205', '+880-2-8159457', 'info@squarehospital.com', 'Premier private multi-specialty hospital.', true),
  ('Chittagong Medical College Hospital', 'Chittagong', 'KB Fazlul Kader Road, Chittagong', '+880-31-630335', 'info@cmch.gov.bd', 'Largest government hospital in Chittagong.', true),
  ('MAG Osmani Medical College Hospital', 'Sylhet', 'Medical Road, Sylhet 3100', '+880-821-716981', 'info@magomch.gov.bd', 'Premier healthcare facility in Sylhet.', true);

UPDATE public.hospitals SET city = 'Dhaka', name = 'Gazi Medical Center', address = 'Gazipur, Dhaka Division' WHERE id = '1c2ab8be-c516-4204-9d62-306b9a7c383f';
