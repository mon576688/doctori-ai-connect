/**
 * Government hospital / government healthcare facility ambulance contact directory.
 *
 * DoctoriAI does NOT operate, provide, dispatch or guarantee ambulance services.
 * This is an information-only directory of publicly available contact details.
 *
 * DATA RULES (do not break):
 * - Only government hospitals / government healthcare facilities.
 * - No private or third-party ambulance companies.
 * - Never invent hospital names, phone numbers, availability, response times,
 *   fees or services. Leave a field out if it is not verified.
 * - `source` and `lastVerified` are internal bookkeeping and are NOT rendered
 *   on the public homepage.
 */
export interface GovernmentAmbulance {
  hospitalName: string;
  facilityType: string;
  location: string;
  ambulanceContact: string;
  /** Optional. Omit unless verified. */
  availability?: string;
  /** Internal only — not displayed publicly. */
  source?: string;
  /** Internal only — not displayed publicly. YYYY-MM-DD */
  lastVerified?: string;
}

/**
 * Add verified entries here. Example shape (commented out on purpose so that
 * no unverified information is ever shown):
 *
 * {
 *   hospitalName: "Government Hospital Name",
 *   facilityType: "Government Hospital",
 *   location: "Dhaka",
 *   ambulanceContact: "01XXXXXXXXX",
 *   availability: "Contact hospital for availability",
 *   source: "Official/public government information",
 *   lastVerified: "YYYY-MM-DD",
 * }
 */
export const governmentAmbulances: GovernmentAmbulance[] = [];

/** Normalize a display number into a safe tel: href value. */
export const toTelHref = (value: string): string =>
  `tel:${value.replace(/[^\d+]/g, "")}`;