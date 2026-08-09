# Government Hospital Ambulance Information Section

Add an information-only ambulance contact directory at the very end of the homepage, directly above the footer. DoctoriAI is presented purely as the information platform — no booking, no dispatch, no operating claims.

## What gets built

**1. Reusable data file** — `src/data/governmentAmbulances.ts`

A typed array so more facilities can be added later:

```text
hospitalName | facilityType | location | ambulanceContact
availability | source | lastVerified
```

- `source` and `lastVerified` are stored but not rendered publicly (source stays internal).
- Any field that is unknown is omitted from the card rather than guessed — no invented names, numbers, availability, response times, fees, or services.
- Only government hospitals / government healthcare facilities. No private or third-party ambulance companies.
- The file ships with only the entries you provide. Until you paste the verified list, it stays empty and the section renders a short neutral line ("Verified government ambulance contacts are being added.") instead of fake cards.

**2. Section component** — `src/components/GovernmentAmbulanceSection.tsx`

- Heading: Government Hospital Ambulance Services
- Supporting text: "Find ambulance contact information for government hospitals and healthcare facilities. Contact the hospital directly to check ambulance availability and service details."
- Disclaimer block (existing standardized highlighter style): "DoctoriAI does not provide or dispatch ambulances..."
- Cards, each with: "Government Healthcare Facility" label chip, hospital name, location with pin icon, ambulance contact number shown prominently, availability line when known, and a large **Call Ambulance** button wired to `tel:`.
- Bottom **Emergency Notice**: "For a medical emergency, contact the appropriate emergency service or the hospital directly. DoctoriAI does not dispatch ambulances or provide emergency transportation." Clear and calm, not alarming.

**3. Homepage placement** — `src/pages/Index.tsx`

Inserted after the final CTA section, immediately before the footer. No other homepage section is touched.

## Design

- Semantic design tokens only (no hardcoded colors), matching the clean white / medical-blue system and card + subtle border treatment already used on the homepage.
- Lucide `Ambulance`, `MapPin`, `Phone`, `ShieldAlert` icons.
- Mobile-first: single stacked column on small screens, 2–3 columns from `md` up; phone number in a large tap-friendly row; full-width `Call Ambulance` button with a comfortable touch target; disclaimer stays visible above the cards.
- Accessible contrast, `aria-label` on each call link naming the hospital.

## Technical notes

- Pure frontend and presentation: one new data file, one new component, one insertion line in `Index.tsx`. No database, no edge function, no booking logic.
- Phone links normalized to digits/`+` for the `tel:` href while the display string stays as written.
- English/Bengali: the section uses the existing `home` namespace keys added for headings and notices, so it follows the current language switch.

## What I need from you

Paste the verified list of government hospitals with name, location, ambulance contact number, and (optionally) availability wording. I will seed exactly those entries and nothing more.
