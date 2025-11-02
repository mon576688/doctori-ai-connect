import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';
import { SAUDI_CITIES, CityName } from '@/lib/bookingUtils';
import { toast } from 'sonner';

export default function LocationSelect() {
  const navigate = useNavigate();
  const { setCity, setUserLocation } = useBooking();

  const handleCitySelect = (cityName: CityName) => {
    setCity(cityName);
    const coords = SAUDI_CITIES[cityName];
    setUserLocation(coords.lat, coords.lng);
    navigate('/booking/type');
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords.latitude, position.coords.longitude);
          setCity('Current Location');
          toast.success('Location detected successfully');
          navigate('/booking/type');
        },
        (error) => {
          toast.error('Unable to get your location. Please select a city.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Where do you want to receive care?
          </h1>
          <p className="text-muted-foreground">
            Select your location to find nearby healthcare providers
          </p>
        </div>

        <Card className="p-6 mb-6">
          <Button
            onClick={handleUseCurrentLocation}
            variant="medical"
            size="lg"
            className="w-full"
          >
            <Navigation className="mr-2" />
            Use My Current Location
          </Button>
        </Card>

        <div className="space-y-3">
          {(Object.keys(SAUDI_CITIES) as CityName[]).map((city) => (
            <Card
              key={city}
              className="p-6 hover:shadow-medical transition-shadow cursor-pointer"
              onClick={() => handleCitySelect(city)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary" size={24} />
                  <span className="text-lg font-medium">{city}</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
