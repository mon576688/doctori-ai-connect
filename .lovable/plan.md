
# Link Footer "Download Our Apps" Buttons to Install Page

## Overview
Replace the two non-functional "Google Play Store" and "Apple App Store" buttons in the footer with a single "Install App" button (or two buttons) that link to the existing `/install` page, where users get platform-specific guidance for adding the PWA to their home screen.

## Changes

### `src/components/Footer.tsx`
- Wrap both buttons (or replace them) with `<Link to="/install">` from react-router-dom
- Update button labels to "Install on Android" and "Install on iOS" (or a single "Install App" button)
- Remove the "Coming soon to mobile platforms" text since the install feature is live
- Update the section description to reflect PWA installation instead of app store downloads

### `src/locales/en/common.json`
- Update `footer.googlePlay` to `"Install on Android"` 
- Update `footer.appStore` to `"Install on iOS"`
- Update `footer.comingSoon` to `"Available now — add to your home screen!"`
- Update `footer.getOnMobile` to `"Install Doctori AI on your device"`

### Other locale files (bn, es, fr, ar)
- Update the same 4 keys with translated equivalents in each locale file

## Technical Details
- Uses existing `Link` component (already imported in Footer.tsx) to navigate to `/install`
- The `/install` page already handles platform detection and provides iOS/Android-specific instructions
- No new dependencies needed
