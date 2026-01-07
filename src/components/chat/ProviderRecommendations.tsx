import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Star, 
  Phone, 
  Calendar,
  Building2,
  Stethoscope,
  Navigation
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistance } from "@/lib/locationUtils";

interface Provider {
  id: string;
  name: string;
  photo_url: string | null;
  specialty: string;
  consultation_fee: number | null;
  experience: number | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  distance: number | null;
  rating: number | null;
  reviewCount: number;
  verified: boolean;
}

interface Hospital {
  id: string;
  name: string;
  logo_url: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  distance: number | null;
}

interface ProviderRecommendationsProps {
  providers: Provider[];
  hospitals: Hospital[];
  specialty: string;
  isLoading: boolean;
  searchLocation: string;
}

const ProviderRecommendations = ({
  providers,
  hospitals,
  specialty,
  isLoading,
  searchLocation
}: ProviderRecommendationsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (providers.length === 0 && hospitals.length === 0) {
    return (
      <Card className="mt-4 bg-muted/50">
        <CardContent className="p-6 text-center">
          <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No providers found matching your criteria. Please check back later or browse all doctors.
          </p>
          <Link to="/doctors">
            <Button variant="outline" className="mt-4">
              Browse All Doctors
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Doctors Section */}
      {providers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Recommended Doctors for {specialty}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchLocation && `Near ${searchLocation}`}
              </p>
            </div>
            <Link to="/doctors">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.slice(0, 4).map((provider) => (
              <Card key={provider.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={provider.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=3b82f6&color=fff`}
                      alt={provider.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold truncate">Dr. {provider.name}</h4>
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {provider.specialty}
                            </Badge>
                            {provider.verified && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {provider.distance !== null && (
                          <Badge variant="outline" className="flex-shrink-0">
                            <Navigation className="h-3 w-3 mr-1" />
                            {formatDistance(provider.distance)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        {provider.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {provider.rating} ({provider.reviewCount})
                          </span>
                        )}
                        {provider.experience && (
                          <span>{provider.experience} yrs exp</span>
                        )}
                      </div>
                      
                      {provider.city && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {provider.city}
                        </p>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Link to={`/booking/provider/${provider.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            <Calendar className="h-3 w-3 mr-1" />
                            Book
                          </Button>
                        </Link>
                        {provider.phone && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`tel:${provider.phone}`)}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Hospitals Section */}
      {hospitals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Nearby Hospitals
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.slice(0, 4).map((hospital) => (
              <Card key={hospital.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {hospital.logo_url ? (
                      <img
                        src={hospital.logo_url}
                        alt={hospital.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{hospital.name}</h4>
                      
                      {hospital.city && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {hospital.address || hospital.city}
                        </p>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Link to={`/booking/hospital/${hospital.id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            View Hospital
                          </Button>
                        </Link>
                        {hospital.phone && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`tel:${hospital.phone}`)}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderRecommendations;
