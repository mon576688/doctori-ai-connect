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
export const formatPrice = (amount: number, currency: string = 'SAR'): string => {
  return `${amount} ${currency}`;
};

// City coordinates for Saudi Arabia
export const SAUDI_CITIES = {
  Riyadh: { lat: 24.7136, lng: 46.6753 },
  Jeddah: { lat: 21.5433, lng: 39.1728 },
  Dammam: { lat: 26.4207, lng: 50.0888 },
  Mecca: { lat: 21.4225, lng: 39.8262 },
};

export type CityName = keyof typeof SAUDI_CITIES;
