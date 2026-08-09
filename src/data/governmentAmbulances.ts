/**
 * Government hospital / government healthcare facility emergency & ambulance
 * contact directory.
 *
 * DoctoriAI does NOT operate, provide, dispatch or guarantee ambulance services.
 * This is an information-only directory of publicly available contact details.
 *
 * DATA RULES (do not break):
 * - Only government hospitals / government healthcare facilities.
 * - No private or third-party ambulance companies.
 * - Never invent hospital names, phone numbers, availability, response times,
 *   fees or services. Leave a field out if it is not verified.
 * - Never label a number as an "Ambulance" line unless the hospital officially
 *   identifies it that way. Otherwise use a neutral label (Hospital, Emergency,
 *   Help Desk, Casualty Block ...).
 * - `source` and `lastVerified` are internal bookkeeping and are NOT rendered
 *   on the public homepage.
 */
export interface GovernmentContactNumber {
  /** Neutral, verified label, e.g. "Hospital", "Emergency", "Help Desk". */
  label: string;
  number: string;
}

export interface GovernmentAmbulance {
  hospitalName: string;
  facilityType: string;
  location: string;
  /** One or more verified contact numbers with neutral labels. */
  contacts: GovernmentContactNumber[];
  /** Optional. Omit unless verified. */
  availability?: string;
  /** Internal only — not displayed publicly. */
  source?: string;
  /** Internal only — not displayed publicly. YYYY-MM-DD */
  lastVerified?: string;
}

export const governmentAmbulances: GovernmentAmbulance[] = [
  {
    hospitalName: "Shaheed Suhrawardy Medical College Hospital",
    facilityType: "Government Hospital (fully government-owned)",
    location: "Sher-E-Bangla Nagar, Dhaka",
    contacts: [
      { label: "Hospital", number: "02-55026702" },
      { label: "Hospital", number: "01701248098" },
    ],
    source: "DGHS Central HRIS facility registry",
    lastVerified: "2026-08-09",
  },
  {
    hospitalName: "Sir Salimullah Medical College Mitford Hospital",
    facilityType: "Government Hospital",
    location: "Old Dhaka",
    contacts: [
      { label: "Emergency", number: "02-57319935" },
      { label: "Help Desk", number: "01322465805" },
      { label: "Casualty Block", number: "01742183855" },
    ],
    source: "SSMC Mitford Hospital / DGHS Central HRIS",
    lastVerified: "2026-08-09",
  },
  {
    hospitalName: "Mugda Medical College Hospital",
    facilityType: "Government Hospital (under DGHS)",
    location: "Mugda, Dhaka",
    contacts: [
      { label: "Hospital", number: "02-7273400" },
      { label: "Hospital", number: "02-7278866" },
    ],
    source: "DGHS Central HRIS facility registry",
    lastVerified: "2026-08-09",
  },
  {
    hospitalName: "Mugda Medical College",
    facilityType: "Government Medical College",
    location: "Mugda, Dhaka",
    contacts: [{ label: "Hospital", number: "02-7276032" }],
    source: "DGHS Central HRIS facility registry",
    lastVerified: "2026-08-09",
  },
];

/** Normalize a display number into a safe tel: href value. */
export const toTelHref = (value: string): string =>
  `tel:${value.replace(/[^\d+]/g, "")}`;
