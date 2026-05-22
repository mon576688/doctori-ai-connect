
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _role app_role;
  _provider_type text;
BEGIN
  _role := COALESCE(
    (NEW.raw_user_meta_data ->> 'role')::app_role,
    'user'::app_role
  );

  _provider_type := NULLIF(lower(COALESCE(NEW.raw_user_meta_data ->> 'provider_type', '')), '');
  IF _role = 'provider' AND (_provider_type IS NULL OR _provider_type NOT IN ('doctor','hospital','nurse')) THEN
    _provider_type := 'doctor';
  END IF;

  INSERT INTO public.profiles (
    id, email, first_name, last_name, role, provider_type, approval_status
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    (_role::text)::user_role,
    CASE WHEN _role = 'provider' THEN _provider_type ELSE NULL END,
    CASE WHEN _role = 'provider' THEN 'pending'::approval_status ELSE 'approved'::approval_status END
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  IF _role = 'provider' THEN
    INSERT INTO public.doctors (
      user_id, specialty, license_number, experience, bio
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'specialty', 'General Practice'),
      NEW.raw_user_meta_data ->> 'license_number',
      COALESCE((NEW.raw_user_meta_data ->> 'experience')::integer, 0),
      NEW.raw_user_meta_data ->> 'bio'
    );
  END IF;

  RETURN NEW;
END;
$function$;

DO $$
DECLARE
  d RECORD;
  pid uuid;
  slug text;
  email text;
  full_bio text;
  first_nm text;
  last_nm text;
BEGIN
  FOR d IN
    SELECT * FROM (VALUES
      ('Prof. Dr. Khandaker Qamrul Islam','Cardiology','MBBS, D.CARD (DU), MD (Cardiology), FACC (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed 7PM-10PM, Thu/Fri Closed',1500,25,'Professor of Cardiology at NICVD Dhaka. Specialist in interventional cardiology with FACC (USA) fellowship.'),
      ('Prof. Dr. M. Nazrul Islam','Cardiology','MBBS, FCPS, FRCP (EDIN), FCCP, FACC, FESC','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed 3-5PM & 8-10PM, Thu/Fri Closed',1500,25,'Former Director and Professor of Cardiology at NICVD Dhaka. Fellowships from Edinburgh, ACC, and ESC.'),
      ('Dr. Kamal Pasha','Interventional Cardiology','MBBS, MD (Cardiology), FAPSIC, FSCAI (USA), FACC (USA)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',2000,15,'Consultant in Interventional Cardiology at Square Hospital. FACC and FSCAI fellowships from the USA.'),
      ('Prof. Dr. Quazi Tarikul Islam','Internal Medicine','MBBS, FCPS (Medicine), FACP (USA), FRCP (Glasgow), FRCP (Edinburgh)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed 5PM-9PM, Thu/Fri Closed',1200,25,'Former Professor at Dhaka Medical College & Hospital. Fellow of ACP and Royal Colleges of Physicians of Glasgow and Edinburgh.'),
      ('Prof. Dr. Khan Abul Kalam Azad','Internal Medicine','MBBS (DMC), FCPS (Medicine), MD (Internal Medicine), FACP (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed 5PM-9PM, Thu/Fri Closed',1200,20,'Professor of Internal Medicine at Dhaka Medical College & Hospital. FACP (USA) fellowship holder.'),
      ('Prof. Dr. Muhammad Shahiduzzaman','Orthopedics','MBBS, MS (Ortho), RCO (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed 11AM-1PM, Fri Closed',1000,25,'Former Professor and Head of Orthopedic Surgery at Dhaka Medical College & Hospital. Specialist in trauma and joint surgery.'),
      ('Dr. Md. Fazlul Hoque','Orthopedics & Spine Surgery','MBBS, D.(Ortho), FA (Ortho), FAMA, Trained in Orthopedic and Spinal Surgery (UK & USA)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',1500,20,'Senior Consultant in Orthopedics and Spine Surgery at Square Hospital. Trained in UK and USA.'),
      ('Prof. Dr. Kohinoor Begum','Obstetrics & Gynecology','MBBS, FCPS (OBGYN)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed 5PM-9PM, Fri Closed',1000,20,'Professor of OBGYN at Popular Medical College & Hospital. Specialist in high-risk pregnancy.'),
      ('Prof. Dr. Sayeba Akhter','Obstetrics & Gynecology','MBBS, FCPS (BD), FCPS (PAK), FICMCH (IN), DRH (UK)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed 6:30-7:30PM, Thu/Fri Closed',1200,25,'Former Professor of OBGYN at BSMMU. Fellowships from Bangladesh, Pakistan, India and DRH from the UK.'),
      ('Dr. Nargis Fatema','Obstetrics & Gynecology','MBBS, FCPS, MS (ObsGyn)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',1200,15,'Senior Consultant in OBGYN at Square Hospital. Specialist in high-risk obstetrics and gynecological surgery.'),
      ('Prof. Dr. Md. Ashraful Islam','ENT (Ear, Nose & Throat)','MBBS, FCPS (ENT), FICS (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed Evening, Fri Closed',800,20,'Professor of ENT at Bangladesh Medical College & Hospital. FICS (USA) fellowship holder.'),
      ('Dr. Md. Nasimul Jamal','ENT & Head Neck Surgery','MBBS, DLO, FCPS (ENT), Advanced Training in Ear Microsurgery (UK)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',1000,15,'Consultant in ENT and Head & Neck Surgery at Square Hospital. Advanced ear microsurgery training in the UK.'),
      ('Prof. Dr. Sk. Md. Bahar Hussain','Gastroenterology','MBBS, FCPS (Medicine), FACP (USA), FRCP (Edinburgh), FRCP (Glasgow)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',1500,25,'Senior Consultant in Gastroenterology at Square Hospital. Fellow of ACP and Royal Colleges of Edinburgh and Glasgow.'),
      ('Prof. Dr. Faruque Ahamed','Gastroenterology','MBBS, FCPS (Medicine), MD (Gastroenterology)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat/Sun/Mon/Wed Evening, Fri Closed',1200,20,'Professor and Head of Gastroenterology at Sheikh Russel Gastroliver Institute & Hospital.'),
      ('Dr. Syeda Ishrat Jahan','Dermatology','MBBS, DDV (Singapore), MSc in Clinical Dermatology (London), MSSVD (London)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',1200,10,'Consultant Dermatologist at Square Hospital. MSc in Clinical Dermatology from London. Trained in Singapore.'),
      ('Prof. Dr. Md. Siraj Uddin','Clinical & Aesthetic Dermatology','MBBS, DDV (BSMMU), DD (Bangkok), Fellow Dermatosurgery & Laser (Bangkok), Fellow Hair Transplant Surgery (NYU USA)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',1500,20,'Senior Consultant in Clinical & Aesthetic Dermatology. Fellowship in Hair Transplant Surgery from NYU, USA.'),
      ('Prof. Dr. Kanak Kanti Barua','Neurosurgery','MBBS, FCPS (Surgery), MS (Neurosurgery), PhD, FICS (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Sat-Wed Evening, Thu/Fri Closed',2000,30,'Vice Chancellor of BSMMU and Professor & Head of Neurosurgery. PhD holder and FICS (USA) fellow.'),
      ('Dr. Sadiqa Tuqan','Endocrinology & Diabetes','MBBS, FCPS (Endocrinology and Metabolism)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',1000,10,'Associate Consultant in Endocrinology and Metabolism at Square Hospital. Specialist in diabetes and thyroid disorders.'),
      ('Prof. Dr. M A Mohit Kamal','Psychiatry & Mental Health','MBBS, M.Phil (Psychiatry), FCPS (Psychiatry), PhD (Psychiatry), FWPA (USA)','Popular Diagnostic Center, Dhanmondi','House 16, Road 2, Dhanmondi R/A, Dhaka-1205','Mon/Wed/Thu Evening, Fri Closed',1000,25,'Former Director of the National Institute of Mental Health. PhD in Psychiatry with FWPA (USA) fellowship.'),
      ('Prof. Dr. Zeena Salwa','Pediatrics','MBBS, DCH, FCPS (Paediatrics), Clinical Training in Pediatric Neurology (India), Training in EEG and Epilepsy (USA)','Square Hospital, Panthapath','18/F, West Panthapath, Dhaka-1205','Sat-Thu 9AM-5PM, Fri Closed',1000,20,'Consultant Pediatrician at Square Hospital. Trained in Pediatric Neurology in India and EEG/Epilepsy in the USA.')
    ) AS t(name, specialty, qualification, clinic_name, address, office_hours, fee, years, bio)
  LOOP
    IF EXISTS (SELECT 1 FROM public.profiles WHERE name = d.name AND role = 'provider') THEN
      CONTINUE;
    END IF;

    pid := gen_random_uuid();
    slug := lower(regexp_replace(d.name, '[^a-zA-Z0-9]+', '.', 'g'));
    slug := regexp_replace(slug, '^\.+|\.+$', '', 'g');
    email := slug || '@doctoriai-seed.local';
    first_nm := split_part(d.name, ' ', 1);
    last_nm := regexp_replace(d.name, '^\S+\s', '');
    full_bio := d.bio || E'\n\nQualifications: ' || d.qualification ||
                E'\nClinic: ' || d.clinic_name || ', ' || d.address ||
                E'\nOffice Hours: ' || d.office_hours ||
                E'\nConsultation Fee: ৳' || d.fee::text;

    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_sso_user
    ) VALUES (
      pid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      email, crypt(gen_random_uuid()::text, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'role','provider',
        'provider_type','doctor',
        'first_name', first_nm,
        'last_name', last_nm,
        'specialty', d.specialty,
        'experience', d.years,
        'bio', full_bio
      ),
      false
    );

    UPDATE public.profiles SET
      name = d.name,
      bio = full_bio,
      city = 'Dhaka',
      address = d.address,
      approval_status = 'approved'
    WHERE id = pid;

    UPDATE public.doctors SET
      years_experience = d.years,
      consultation_fee = d.fee,
      verified = true,
      approved = true
    WHERE user_id = pid;
  END LOOP;
END $$;
