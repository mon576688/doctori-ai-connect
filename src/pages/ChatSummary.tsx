import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Calendar, 
  Phone, 
  MapPin, 
  Star, 
  Clock, 
  AlertTriangle,
  Heart,
  Download,
  Share2,
  Building2,
  Navigation,
  Stethoscope
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentLocation } from "@/lib/locationUtils";
import { formatDistance } from "@/lib/locationUtils";

interface SummaryData {
  symptoms: string[];
  specialty: string;
  urgency: "low" | "medium" | "high";
  responses: Record<string, string>;
  conversation: any[];
}

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

const ChatSummary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("chatSummary");
    if (!stored) {
      navigate("/chat");
      return;
    }

    const data: SummaryData = JSON.parse(stored);
    setSummaryData(data);
    
    // Fetch real providers from database
    fetchProviders(data.specialty);
  }, [navigate]);

  const fetchProviders = async (specialty: string) => {
    setLoading(true);
    try {
      // Try to get user's location
      const locationResult = await getCurrentLocation();
      
      let searchParams: any = {
        specialty: specialty || 'General Practice',
        limit: 6
      };

      if (locationResult.coordinates) {
        searchParams.latitude = locationResult.coordinates.latitude;
        searchParams.longitude = locationResult.coordinates.longitude;
        setSearchLocation('Your Location');
      } else if (user) {
        // Fall back to user's profile city
        const { data: profile } = await supabase
          .from('profiles')
          .select('city')
          .eq('id', user.id)
          .single();
        
        if (profile?.city) {
          searchParams.city = profile.city;
          setSearchLocation(profile.city);
        }
      }

      // Call the search-providers edge function
      const { data, error } = await supabase.functions.invoke('search-providers', {
        body: searchParams
      });

      if (error) {
        console.error('Error fetching providers:', error);
        return;
      }

      setProviders(data.providers || []);
      setHospitals(data.hospitals || []);
      if (data.searchLocation) {
        setSearchLocation(data.searchLocation);
      }
    } catch (error) {
      console.error('Error in fetchProviders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "high": return "High Priority - Seek immediate care";
      case "medium": return "Medium Priority - Schedule within 1-2 days";
      default: return "Low Priority - Schedule when convenient";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Doctori AI Health Summary',
          text: 'My health consultation summary from Doctori AI',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleStartNewChat = () => {
    sessionStorage.removeItem("chatSummary");
    navigate("/chat");
  };

  if (!summaryData) {
    return (
      <div className="min-h-screen bg-muted/20 py-8">
        <div className="container max-w-4xl mx-auto">
          <Card className="shadow-medical">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading your health summary...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <SEO title={PAGE_SEO.chatSummary.title} description={PAGE_SEO.chatSummary.description} canonicalPath={PAGE_SEO.chatSummary.canonicalPath} noIndex />
      <div className="container max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-medical">
          <CardHeader className="bg-gradient-primary text-white">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>Your Health Summary</span>
            </CardTitle>
            <p className="text-white/90 text-sm">
              Generated by Doctori AI • {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
        </Card>

        {/* Urgency Alert */}
        <Card className={`border-2 ${getUrgencyColor(summaryData.urgency)}`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Priority Level</h3>
                <p className="text-sm">{getUrgencyText(summaryData.urgency)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Symptoms & Concerns</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Primary Symptoms:</h4>
              <div className="flex flex-wrap gap-2">
                {summaryData.symptoms.length > 0 ? (
                  summaryData.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary">
                      {symptom}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">General health concerns</Badge>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Your Responses:</h4>
              <div className="space-y-2">
                {Object.entries(summaryData.responses).map(([key, value]) => (
                  <div key={key} className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assessment */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>AI Assessment & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Based on your symptoms, I recommend consulting with a <strong>{summaryData.specialty}</strong> specialist. 
                Your symptoms suggest this area of expertise would be most helpful for your concerns.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Next Steps:</h4>
              <ul className="text-sm space-y-1 pl-4">
                <li>• Schedule an appointment with a recommended doctor below</li>
                <li>• Monitor your symptoms and note any changes</li>
                <li>• Prepare a list of questions for your doctor visit</li>
                <li>• Bring this summary to your appointment</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Doctors from Database */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Recommended Healthcare Providers
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {searchLocation 
                ? `Based on your symptoms, nearby ${searchLocation}`
                : 'Based on your symptoms'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : providers.length > 0 ? (
              providers.map((provider) => (
                <Card key={provider.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={provider.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=3b82f6&color=fff`}
                        alt={provider.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">Dr. {provider.name}</h4>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="secondary">{provider.specialty}</Badge>
                              {provider.verified && (
                                <Badge className="bg-green-100 text-green-700">
                                  ✓ Verified
                                </Badge>
                              )}
                              {provider.distance !== null && (
                                <Badge variant="outline">
                                  <Navigation className="h-3 w-3 mr-1" />
                                  {formatDistance(provider.distance)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {provider.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{provider.rating}</span>
                              <span className="text-sm text-muted-foreground">
                                ({provider.reviewCount} reviews)
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                          {provider.city && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {provider.address || provider.city}
                            </div>
                          )}
                          {provider.experience && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {provider.experience} years experience
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Link to={`/booking/provider/${provider.id}`}>
                            <Button variant="default" size="sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              Book Appointment
                            </Button>
                          </Link>
                          {provider.phone && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`tel:${provider.phone}`)}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">
                  No providers found matching your criteria.
                </p>
                <Link to="/doctors">
                  <Button variant="outline">Browse All Doctors</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nearby Hospitals */}
        {hospitals.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Nearby Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hospitals.slice(0, 3).map((hospital) => (
                <Card key={hospital.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {hospital.logo_url ? (
                        <img
                          src={hospital.logo_url}
                          alt={hospital.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">{hospital.name}</h4>
                        {hospital.city && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {hospital.address || hospital.city}
                          </p>
                        )}
                        
                        <div className="flex gap-2 mt-3">
                          <Link to={`/booking/hospital/${hospital.id}`}>
                            <Button size="sm" variant="outline">
                              View Hospital
                            </Button>
                          </Link>
                          {hospital.phone && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(`tel:${hospital.phone}`)}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Download className="h-4 w-4 mr-2" />
                  Print Summary
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleStartNewChat}>
                  Start New Chat
                </Button>
                <Link to="/doctors">
                  <Button variant="default">
                    Browse All Doctors
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Disclaimer */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground text-center">
              ⚠️ <strong>Medical Disclaimer:</strong> This AI-generated summary is for informational purposes only 
              and is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with qualified healthcare providers for medical concerns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatSummary;
