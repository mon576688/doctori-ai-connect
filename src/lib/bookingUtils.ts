// Haversine formula for calculating distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

// Group time slots by period
export const groupTimeSlots = (
  slots: string[]
): {
  morning: string[];
  afternoon: string[];
  evening: string[];
} => {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  slots.forEach((slot) => {
    const hour = parseInt(slot.split(':')[0]);
    if (hour >= 6 && hour < 12) {
      morning.push(slot);
    } else if (hour >= 12 && hour < 18) {
      afternoon.push(slot);
    } else {
      evening.push(slot);
    }
  });

  return { morning, afternoon, evening };
};

// Format price with currency
export const formatPrice = (amount: number, currency: string = 'BDT'): string => {
  return `৳${amount.toLocaleString()}`;
};

// City coordinates for Bangladesh
export const BANGLADESH_CITIES = {
  Dhaka: { lat: 23.8103, lng: 90.4125 },
  Chittagong: { lat: 22.3569, lng: 91.7832 },
  Sylhet: { lat: 24.8949, lng: 91.8687 },
  Rajshahi: { lat: 24.3636, lng: 88.6241 },
  Khulna: { lat: 22.8456, lng: 89.5403 },
  Barisal: { lat: 22.7010, lng: 90.3535 },
  Rangpur: { lat: 25.7439, lng: 89.2752 },
  Mymensingh: { lat: 24.7471, lng: 90.4203 },
  Comilla: { lat: 23.4607, lng: 91.1809 },
  Gazipur: { lat: 23.9999, lng: 90.4203 },
  Narayanganj: { lat: 23.6238, lng: 90.5000 },
  Cox_Bazar: { lat: 21.4272, lng: 92.0058 },
};

// Alias for backward compatibility
export const SAUDI_CITIES = BANGLADESH_CITIES;

// Generate a unique Jitsi meeting link for consultations
export const generateJitsiLink = (appointmentId: string): string => {
  const hash = Math.random().toString(36).substring(2, 8);
  return `https://meet.jit.si/doctoriai-${appointmentId.slice(0, 8)}-${hash}`;
};

export type CityName = keyof typeof BANGLADESH_CITIES;

// Booking steps for progress indicator
export const BOOKING_STEPS = [
  { id: 'location', label: 'Location', path: '/booking/location' },
  { id: 'type', label: 'Service Type', path: '/booking/type' },
  { id: 'providers', label: 'Select Provider', path: '/booking/providers' },
  { id: 'schedule', label: 'Select Date', path: '/booking/schedule' },
  { id: 'time', label: 'Select Time', path: '/booking/time' },
  { id: 'review', label: 'Review & Confirm', path: '/booking/review' },
];

export const getCurrentStep = (pathname: string): number => {
  if (pathname.includes('/booking/location') || pathname === '/booking') return 0;
  if (pathname.includes('/booking/type')) return 1;
  if (pathname.includes('/booking/providers')) return 2;
  if (pathname.includes('/booking/provider/')) return 2;
  if (pathname.includes('/booking/hospital/')) return 2;
  if (pathname.includes('/booking/schedule/')) return 3;
  if (pathname.includes('/booking/time/')) return 4;
  if (pathname.includes('/booking/review')) return 5;
  if (pathname.includes('/booking/confirmed')) return 5;
  return 0;
};