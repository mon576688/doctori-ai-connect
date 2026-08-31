# Online Prescription Toolkit for Doctors

Upgrade the existing "Write Prescription" page into a real prescribing tool: medicine autocomplete from our own medicine database, reusable templates, interaction/allergy warnings, and a printable PDF. Patients get tappable medicine details on each prescribed item.

## 1. Medicine database

New `medicines` table (searchable, public read):

- brand name, generic name, strength, dosage form (tablet/capsule/syrup/injection)
- manufacturer, indications, common adult dose, side effects, warnings
- flags: `is_active`, `requires_prescription`

Seeded with a first batch of widely used Bangladesh brands (paracetamol, omeprazole, amoxicillin, metformin, losartan, cetirizine, azithromycin, etc.) grouped by generic so alternatives resolve automatically. Search uses a trigram index on brand + generic so typing 3 letters returns results instantly.

New `medicine_interactions` table: generic-A / generic-B pairs with severity (minor / moderate / major) and a plain-language note. Seeded with well-documented pairs only.

## 2. Medicine autocomplete in the prescription form

Each medicine row in `WritePrescription` gets a combobox instead of a plain text input:

- type 3+ characters → dropdown of matching brands with generic + strength shown
- picking one auto-fills name, strength, and a suggested dosage/frequency the doctor can edit
- free text is still allowed, so nothing is blocked if a brand is missing
- selected medicine stores its generic id, which powers warnings, alternatives, and patient details

## 3. Templates and favourites

New `prescription_templates` table owned by each doctor (RLS: doctor sees only their own):

- name, optional specialty label, diagnosis, notes, medicines list
- "Save as template" button on the prescription form
- "Load template" dropdown at the top of the form — fills diagnosis, notes, and all medicine rows in one click
- template manager (rename / delete) inside the provider dashboard

## 4. Interaction and allergy warnings

Live warning panel above the submit button:

- **Interactions**: any two selected medicines whose generics appear in `medicine_interactions` → colour-coded alert with severity and note
- **Allergy conflicts**: match selected generics/brands against the patient's `allergies` array on their profile → red alert
- **Duplicate therapy**: two rows with the same generic → warning
- Warnings are advisory: the doctor can acknowledge and still save (acknowledgement recorded on the prescription row)

## 5. Printable PDF prescription

New `prescriptionPdfService` (jsPDF, same as the existing report service):

- header with doctor name, specialty, qualifications, license no.
- patient name, age, gender, date, prescription id
- Rx table: medicine, strength, dosage, frequency, duration, instructions
- diagnosis, doctor notes, signature line
- footer disclaimer that this is a digital record generated via Doctori AI
- Download / Print buttons on both the doctor's prescription view and the patient's `MyPrescriptions` page

## 6. Patient side: medicine details

On `MyPrescriptions`, each prescribed medicine becomes tappable:

- sheet/dialog with generic name, what it is used for, how to take it, common side effects, warnings
- "Same-generic brands" list so the patient can buy an available equivalent
- clear note that details are informational and the doctor's instructions come first

## Technical notes

- Migration creates `medicines`, `medicine_interactions`, `prescription_templates` with GRANTs then RLS: medicines/interactions readable by `anon` + `authenticated`, writable by admins only; templates scoped to `auth.uid()` as the owning doctor.
- Add `interaction_ack jsonb` and `template_id uuid` columns to `prescriptions`.
- Medicine search via a `search_medicines(_q text)` SQL function (stable, trigram-backed) called from the client — no AI cost per keystroke.
- Existing `medicine-lookup` edge function and `medicine_cache` stay untouched; the new table is the source for prescribing.
- All new copy added to `en` and `bn` locale files.
