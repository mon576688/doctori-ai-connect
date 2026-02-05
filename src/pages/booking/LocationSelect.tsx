import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useBooking } from '@/contexts/BookingContext';
import { BANGLADESH_CITIES, CityName } from '@/lib/bookingUtils';
import { BookingProgress } from '@/components/booking/BookingProgress';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';

export default function LocationSelect() {
  const navigate = useNavigate();
  const { setCity, setUserLocation } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = useMemo(() => {
    const cities = Object.keys(BANGLADESH_CITIES) as CityName[];
    if (!searchQuery.trim()) return cities;
    return cities.filter(city => 
      city.toLowerCase().replace('_', "'").includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCustomLocationSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a location');
      return;
    }
    // Use Dhaka coordinates as fallback for custom locations
    const dhakaCoords = BANGLADESH_CITIES.Dhaka;
    setCity(searchQuery.trim());
    setUserLocation(dhakaCoords.lat, dhakaCoords.lng);
    toast.info(`Searching near "${searchQuery.trim()}" - showing available providers`);
    navigate('/booking/type');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomLocationSearch();
    }
  };

  const handleCitySelect = (cityName: CityName) => {
    setCity(cityName.replace('_', "'"));
    const coords = BANGLADESH_CITIES[cityName];
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
    <div className="min-h-screen bg-background py-8 px-4">
      <SEO 
        title={PAGE_SEO.booking.title}
        description={PAGE_SEO.booking.description}
        canonicalPath="/booking/location"
      />
      <BookingProgress />
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Where do you want to receive care?
          </h1>
          <p className="text-muted-foreground">
            Select your location to find nearby healthcare providers
          </p>
        </header>

        <Card className="p-6 mb-4">
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

        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search for a city or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-24"
            />
            <Button
              onClick={handleCustomLocationSearch}
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              Search
            </Button>
          </div>
        </Card>

        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCities.map((city) => (
              <Card
                key={city}
                className="p-4 hover:shadow-medical transition-shadow cursor-pointer hover:border-primary"
                onClick={() => handleCitySelect(city)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <MapPin className="text-primary" size={24} />
                  <span className="font-medium">{city.replace('_', "'")}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            <p>No matching cities found. Press "Search" to use "{searchQuery}" as your location.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
