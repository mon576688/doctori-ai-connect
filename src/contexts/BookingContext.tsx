import { createContext, useContext, useState, ReactNode } from 'react';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  price: number;
  photo_url: string;
  latitude: number;
  longitude: number;
  address: string;
  bio: string;
  provider_type: 'doctor' | 'hospital' | 'nurse';
  duration: number;
}

interface BookingState {
  city: string | null;
  userLatitude: number | null;
  userLongitude: number | null;
  providerType: 'doctor' | 'hospital' | 'nurse' | null;
  providerId: string | null;
  providerData: Provider | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  price: number;
  consultationType: 'online' | 'physical' | null;
}

interface BookingContextType extends BookingState {
  setCity: (city: string) => void;
  setUserLocation: (lat: number, lng: number) => void;
  setProviderType: (type: 'doctor' | 'hospital' | 'nurse') => void;
  setProvider: (id: string, data: Provider) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: string) => void;
  setConsultationType: (type: 'online' | 'physical') => void;
  resetBooking: () => void;
}

const initialState: BookingState = {
  city: null,
  userLatitude: null,
  userLongitude: null,
  providerType: null,
  providerId: null,
  providerData: null,
  selectedDate: null,
  selectedTime: null,
  price: 0,
  consultationType: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<BookingState>(initialState);

  const setCity = (city: string) => {
    setState(prev => ({ ...prev, city }));
  };

  const setUserLocation = (lat: number, lng: number) => {
    setState(prev => ({ ...prev, userLatitude: lat, userLongitude: lng }));
  };

  const setProviderType = (type: 'doctor' | 'hospital' | 'nurse') => {
    setState(prev => ({ ...prev, providerType: type }));
  };

  const setProvider = (id: string, data: Provider) => {
    setState(prev => ({ ...prev, providerId: id, providerData: data, price: data.price }));
  };

  const setSelectedDate = (date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  const setSelectedTime = (time: string) => {
    setState(prev => ({ ...prev, selectedTime: time }));
  };

  const setConsultationType = (type: 'online' | 'physical') => {
    setState(prev => ({ ...prev, consultationType: type }));
  };

  const resetBooking = () => {
    setState(initialState);
  };

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setCity,
        setUserLocation,
        setProviderType,
        setProvider,
        setSelectedDate,
        setSelectedTime,
        setConsultationType,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
