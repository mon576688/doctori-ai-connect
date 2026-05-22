
CREATE TABLE public.directory_doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  specialty text NOT NULL,
  qualifications text,
  hospital_name text,
  chamber_address text,
  city text NOT NULL,
  area text,
  office_hours text,
  consultation_fee integer,
  phone text,
  whatsapp text,
  photo_url text,
  bio text,
  years_experience integer,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_directory_doctors_city ON public.directory_doctors(city);
CREATE INDEX idx_directory_doctors_specialty ON public.directory_doctors(specialty);
CREATE INDEX idx_directory_doctors_active ON public.directory_doctors(is_active);

ALTER TABLE public.directory_doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active directory doctors"
ON public.directory_doctors FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage directory doctors"
ON public.directory_doctors FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_directory_doctors_updated_at
BEFORE UPDATE ON public.directory_doctors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.directory_doctors
  (slug, name, specialty, qualifications, hospital_name, chamber_address, city, area, office_hours, consultation_fee, years_experience, bio, is_featured)
SELECT
  lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')),
  name, specialty, qualifications, hospital_name, chamber_address,
  'Dhaka', area, office_hours, fee, years, bio, true
FROM (VALUES
  ('Prof. Dr. Khandaker Qamrul Islam','Cardiology','MBBS, D.CARD (DU), MD (Cardiology), FACC (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed 7PM-10PM, Thu/Fri Closed',1500,25,'Professor of Cardiology at NICVD Dhaka. Specialist in interventional cardiology with FACC (USA) fellowship.'),
  ('Prof. Dr. M. Nazrul Islam','Cardiology','MBBS, FCPS, FRCP (EDIN), FCCP, FACC, FESC','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed 3-5PM & 8-10PM, Thu/Fri Closed',1500,25,'Former Director and Professor of Cardiology at NICVD Dhaka. Fellowships from Edinburgh, ACC, and ESC.'),
  ('Dr. Kamal Pasha','Interventional Cardiology','MBBS, MD (Cardiology), FAPSIC, FSCAI (USA), FACC (USA)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',2000,15,'Consultant in Interventional Cardiology at Square Hospital. FACC and FSCAI fellowships from the USA.'),
  ('Prof. Dr. Quazi Tarikul Islam','Internal Medicine','MBBS, FCPS (Medicine), FACP (USA), FRCP (Glasgow), FRCP (Edinburgh)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed 5PM-9PM, Thu/Fri Closed',1200,25,'Former Professor at Dhaka Medical College & Hospital. Fellow of ACP and Royal Colleges of Physicians of Glasgow and Edinburgh.'),
  ('Prof. Dr. Khan Abul Kalam Azad','Internal Medicine','MBBS (DMC), FCPS (Medicine), MD (Internal Medicine), FACP (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed 5PM-9PM, Thu/Fri Closed',1200,20,'Professor of Internal Medicine at Dhaka Medical College & Hospital. FACP (USA) fellowship holder.'),
  ('Prof. Dr. Muhammad Shahiduzzaman','Orthopedics','MBBS, MS (Ortho), RCO (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed 11AM-1PM, Fri Closed',1000,25,'Former Professor and Head of Orthopedic Surgery at Dhaka Medical College & Hospital. Specialist in trauma and joint surgery.'),
  ('Dr. Md. Fazlul Hoque','Orthopedics & Spine Surgery','MBBS, D.(Ortho), FA (Ortho), FAMA, Trained in Orthopedic and Spinal Surgery (UK & USA)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',1500,20,'Senior Consultant in Orthopedics and Spine Surgery at Square Hospital. Trained in UK and USA.'),
  ('Prof. Dr. Kohinoor Begum','Obstetrics & Gynecology','MBBS, FCPS (OBGYN)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed 5PM-9PM, Fri Closed',1000,20,'Professor of OBGYN at Popular Medical College & Hospital. Specialist in high-risk pregnancy.'),
  ('Prof. Dr. Sayeba Akhter','Obstetrics & Gynecology','MBBS, FCPS (BD), FCPS (PAK), FICMCH (IN), DRH (UK)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed 6:30-7:30PM, Thu/Fri Closed',1200,25,'Former Professor of OBGYN at BSMMU. Fellowships from Bangladesh, Pakistan, India and DRH from the UK.'),
  ('Dr. Nargis Fatema','Obstetrics & Gynecology','MBBS, FCPS, MS (ObsGyn)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',1200,15,'Senior Consultant in OBGYN at Square Hospital. Specialist in high-risk obstetrics and gynecological surgery.'),
  ('Prof. Dr. Md. Ashraful Islam','ENT (Ear, Nose & Throat)','MBBS, FCPS (ENT), FICS (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed Evening, Fri Closed',800,20,'Professor of ENT at Bangladesh Medical College & Hospital. FICS (USA) fellowship holder.'),
  ('Dr. Md. Nasimul Jamal','ENT & Head Neck Surgery','MBBS, DLO, FCPS (ENT), Advanced Training in Ear Microsurgery (UK)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',1000,15,'Consultant in ENT and Head & Neck Surgery at Square Hospital. Advanced ear microsurgery training in the UK.'),
  ('Prof. Dr. Sk. Md. Bahar Hussain','Gastroenterology','MBBS, FCPS (Medicine), FACP (USA), FRCP (Edinburgh), FRCP (Glasgow)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',1500,25,'Senior Consultant in Gastroenterology at Square Hospital. Fellow of ACP and Royal Colleges of Edinburgh and Glasgow.'),
  ('Prof. Dr. Faruque Ahamed','Gastroenterology','MBBS, FCPS (Medicine), MD (Gastroenterology)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat/Sun/Mon/Wed Evening, Fri Closed',1200,20,'Professor and Head of Gastroenterology at Sheikh Russel Gastroliver Institute & Hospital.'),
  ('Dr. Syeda Ishrat Jahan','Dermatology','MBBS, DDV (Singapore), MSc in Clinical Dermatology (London), MSSVD (London)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',1200,10,'Consultant Dermatologist at Square Hospital. MSc in Clinical Dermatology from London. Trained in Singapore.'),
  ('Prof. Dr. Md. Siraj Uddin','Clinical & Aesthetic Dermatology','MBBS, DDV (BSMMU), DD (Bangkok), Fellow Dermatosurgery & Laser (Bangkok), Fellow Hair Transplant Surgery (NYU USA)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',1500,20,'Senior Consultant in Clinical & Aesthetic Dermatology. Fellowship in Hair Transplant Surgery from NYU, USA.'),
  ('Prof. Dr. Kanak Kanti Barua','Neurosurgery','MBBS, FCPS (Surgery), MS (Neurosurgery), PhD, FICS (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Sat-Wed Evening, Thu/Fri Closed',2000,30,'Vice Chancellor of BSMMU and Professor & Head of Neurosurgery. PhD holder and FICS (USA) fellow.'),
  ('Dr. Sadiqa Tuqan','Endocrinology & Diabetes','MBBS, FCPS (Endocrinology and Metabolism)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',1000,10,'Associate Consultant in Endocrinology and Metabolism at Square Hospital. Specialist in diabetes and thyroid disorders.'),
  ('Prof. Dr. M A Mohit Kamal','Psychiatry & Mental Health','MBBS, M.Phil (Psychiatry), FCPS (Psychiatry), PhD (Psychiatry), FWPA (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Dhanmondi','Mon/Wed/Thu Evening, Fri Closed',1000,25,'Former Director of the National Institute of Mental Health. PhD in Psychiatry with FWPA (USA) fellowship.'),
  ('Prof. Dr. Zeena Salwa','Pediatrics','MBBS, DCH, FCPS (Paediatrics), Clinical Training in Pediatric Neurology (India), Training in EEG and Epilepsy (USA)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Panthapath','Sat-Thu 9AM-5PM, Fri Closed',1000,20,'Consultant Pediatrician at Square Hospital. Trained in Pediatric Neurology in India and EEG/Epilepsy in the USA.')
) AS t(name, specialty, qualifications, hospital_name, chamber_address, area, office_hours, fee, years, bio)
ON CONFLICT (slug) DO NOTHING;

-- Remove previously seeded fake provider accounts (in dependency order)
WITH seed_ids AS (
  SELECT id FROM auth.users WHERE email LIKE '%@doctoriai-seed.local'
)
DELETE FROM public.doctors WHERE user_id IN (SELECT id FROM seed_ids);

WITH seed_ids AS (
  SELECT id FROM auth.users WHERE email LIKE '%@doctoriai-seed.local'
)
DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM seed_ids);

WITH seed_ids AS (
  SELECT id FROM auth.users WHERE email LIKE '%@doctoriai-seed.local'
)
DELETE FROM public.profiles WHERE id IN (SELECT id FROM seed_ids);

DELETE FROM auth.users WHERE email LIKE '%@doctoriai-seed.local';
