

# Reduce Unused JavaScript (~541 KiB) and Fix Lighthouse Issues

## Problem
The entire app ships as one 812 KiB bundle because ~35 page components are eagerly imported in `App.tsx`. Only ~10 are lazy-loaded. This means every visitor downloads admin dashboards, booking flows, prescription pages, etc. on first load.

## Plan

### 1. Lazy-load all page components in `App.tsx`
Convert every remaining static `import` for pages to `lazy(() => import(...))`. This includes:
- `Index`, `Chat`, `ChatSummary`, `Doctors`, `DoctorProfile`, `Medicine`
- `Blog`, `BlogPost`, `About`, `Contact`
- `Register`, `ProviderRegister`, `Login`, `ForgotPassword`, `ResetPassword`
- `UserDashboard`, `ProviderDashboard`, `ProviderPendingPage`, `AdminDashboard`, `Dashboard`
- `BMICalculator`, `Reminders`, `BloodDonation`
- `LocationSelect`, `ProviderTypeSelect`, `ProviderList`, `ProviderProfile`, `HospitalProfile`, `DateSelect`, `TimeSelect`, `ReviewConfirm`, `Confirmed`
- `WritePrescription`, `MyPrescriptions`
- `TermsAndConditions`, `PrivacyPolicy`, `DoctorVerificationPolicy`
- `NotFound`

Keep `Layout` as a static import since it's needed on every route.

### 2. Improve the Suspense fallback
Replace the bare `<div>Loading...</div>` with a centered spinner/skeleton for better UX and CLS.

### 3. Fix accessibility issues mentioned in the audit
- **Buttons without accessible names**: Add `aria-label` to icon-only buttons (social links in Footer, ChatWidget toggle, etc.)
- **Links without discernible names**: Add `aria-label` to icon-only links
- **Color contrast**: Review and adjust low-contrast text colors
- **Heading order**: Ensure headings follow sequential order (no skipping from h2 to h4)

### 4. Add explicit width/height to images
Add `width` and `height` attributes to key images (especially above-the-fold) to prevent layout shifts.

### Files Modified
- **`src/App.tsx`** — Convert all page imports to lazy, improve fallback
- **`src/components/Footer.tsx`** — Add `aria-label` to social icon links/buttons
- **`src/components/ChatWidget.tsx`** — Add `aria-label` to toggle button
- **`src/pages/Index.tsx`** — Fix heading order, image dimensions if needed

### Expected Impact
- Bundle will be split into ~30+ chunks loaded on demand
- Initial JS payload should drop from ~812 KiB to ~200-300 KiB
- Accessibility score improvement from fixing button/link names and contrast

