import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Building2,
  Users,
  ArrowLeft,
  Stethoscope,
  Clock,
  Shield,
  Ambulance,
  HeartPulse,
  Star
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookingProgress } from '@/components/booking/BookingProgress';

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  logo_url: string;
}

interface AssignedProvider {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  photo_url: string;
  provider_type: string;
  bio: string;
  specialty?: string;
}

export default function HospitalProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [providers, setProviders] = useState<AssignedProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        // Fetch hospital details
        const { data: hospitalData, error: hospitalError } = await supabase
          .from('hospitals')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (hospitalError) throw hospitalError;

        if (!hospitalData) {
          toast.error('Hospital not found');
          navigate('/booking/providers');
          return;
        }

        setHospital({
          id: hospitalData.id,
          name: hospitalData.name,
          address: hospitalData.address || '',
          city: hospitalData.city,
          phone: hospitalData.phone || '',
          email: hospitalData.email || '',
          description: hospitalData.description || '',
          logo_url: hospitalData.logo_url || '/placeholder.svg',
        });

        // Fetch assigned providers
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('provider_hospital_assignments')
          .select(`
            provider_id,
            profiles:provider_id (
              id,
              name,
              first_name,
              last_name,
              photo_url,
              provider_type,
              bio
            )
          `)
          .eq('hospital_id', id);

        if (assignmentsError) throw assignmentsError;

        // Also fetch doctor info for specialty
        const providerIds = assignmentsData?.map(a => a.provider_id) || [];
        
        let doctorsMap: Record<string, string> = {};
        if (providerIds.length > 0) {
          const { data: doctorsData } = await supabase
            .from('doctors')
            .select('user_id, specialty')
            .in('user_id', providerIds);
          
          doctorsData?.forEach(d => {
            doctorsMap[d.user_id] = d.specialty;
          });
        }

        const formattedProviders: AssignedProvider[] = (assignmentsData || [])
          .filter(a => a.profiles)
          .map((a: any) => ({
            id: a.profiles.id,
            name: a.profiles.name || `${a.profiles.first_name || ''} ${a.profiles.last_name || ''}`.trim(),
            first_name: a.profiles.first_name || '',
            last_name: a.profiles.last_name || '',
            photo_url: a.profiles.photo_url || '/placeholder.svg',
            provider_type: a.profiles.provider_type || 'Doctor',
            bio: a.profiles.bio || '',
            specialty: doctorsMap[a.profiles.id] || 'General Practice',
          }));

        setProviders(formattedProviders);
      } catch (error) {
        console.error('Error fetching hospital data:', error);
        toast.error('Failed to load hospital details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHospitalData();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hospital Not Found</h1>
          <Link to="/booking/providers">
            <Button variant="medical">Back to Providers</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sample facilities - in production these would come from database
  const facilities = [
    { icon: Ambulance, name: 'Emergency Services', available: true },
    { icon: HeartPulse, name: 'ICU', available: true },
    { icon: Stethoscope, name: 'Outpatient Department', available: true },
    { icon: Shield, name: 'Pharmacy', available: true },
  ];

  // Sample services
  const services = [
    'General Medicine',
    'Surgery',
    'Pediatrics',
    'Gynecology',
    'Cardiology',
    'Orthopedics',
    'Dermatology',
    'ENT',
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <BookingProgress />
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/booking/providers" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Providers
        </Link>

        {/* Hospital Header */}
        <Card className="shadow-medical mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
                {hospital.logo_url !== '/placeholder.svg' ? (
                  <img
                    src={hospital.logo_url}
                    alt={hospital.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-primary" />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{hospital.name}</h1>
                <Badge variant="secondary" className="mb-4">Hospital</Badge>
                
                {hospital.description && (
                  <p className="text-muted-foreground mb-4">{hospital.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {hospital.address && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{hospital.address}, {hospital.city}</span>
                    </div>
                  )}
                  {hospital.phone && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone className="h-4 w-4 text-secondary" />
                      <a href={`tel:${hospital.phone}`} className="hover:text-primary">
                        {hospital.phone}
                      </a>
                    </div>
                  )}
                  {hospital.email && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Mail className="h-4 w-4 text-accent" />
                      <a href={`mailto:${hospital.email}`} className="hover:text-primary">
                        {hospital.email}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Open 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers">
              <Users className="h-4 w-4 mr-2" />
              Medical Staff ({providers.length})
            </TabsTrigger>
            <TabsTrigger value="services">
              <Stethoscope className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="facilities">
              <Building2 className="h-4 w-4 mr-2" />
              Facilities
            </TabsTrigger>
          </TabsList>

          {/* Providers Tab */}
          <TabsContent value="providers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Medical Staff & Specialists
                </CardTitle>
              </CardHeader>
              <CardContent>
                {providers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No medical staff assigned to this hospital yet.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {providers.map((provider) => (
                      <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={provider.photo_url}
                              alt={provider.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{provider.name}</h3>
                              <Badge variant="outline" className="mb-1">
                                {provider.provider_type}
                              </Badge>
                              {provider.specialty && (
                                <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                              )}
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">4.8</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => navigate(`/booking/provider/${provider.id}`)}
                          >
                            View Profile & Book
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Medical Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {services.map((service, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-muted/50 text-center hover:bg-muted transition-colors"
                    >
                      <Stethoscope className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">{service}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Hospital Facilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {facilities.map((facility, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border bg-card text-center"
                    >
                      <facility.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">{facility.name}</p>
                      <Badge variant={facility.available ? "default" : "secondary"} className="mt-2">
                        {facility.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Ready to book an appointment?</h3>
                <p className="text-muted-foreground">Choose a doctor from our medical staff above</p>
              </div>
              {hospital.phone && (
                <Button variant="medical" size="lg" asChild>
                  <a href={`tel:${hospital.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Hospital
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
