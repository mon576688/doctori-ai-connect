import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DoctorMap, { type Doctor } from "@/components/DoctorMap";
import { MapPin, Star, Clock, Phone, Calendar, Heart, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProviderWithServices {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  bio: string;
  photo_url: string;
  phone: string;
  services: Array<{
    service_name: string;
    category: {
      name: string;
    };
  }>;
}

export default function Doctors() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [providers, setProviders] = useState<ProviderWithServices[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProvidersAndCategories();
  }, []);

  const fetchProvidersAndCategories = async () => {
    try {
      // Fetch all service categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('name')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData?.map(c => c.name) || []);

      // Fetch approved providers with their services
      const { data: providersData, error: providersError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          bio,
          photo_url,
          phone,
          provider_services!provider_services_provider_id_fkey(
            service_name,
            service_categories!provider_services_category_id_fkey(
              name
            )
          )
        `)
        .eq('role', 'provider')
        .eq('approval_status', 'approved');

      if (providersError) throw providersError;

      const formattedProviders = (providersData || []).map((p: any) => ({
        id: p.id,
        name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Provider',
        first_name: p.first_name,
        last_name: p.last_name,
        bio: p.bio || 'Healthcare provider',
        photo_url: p.photo_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
        phone: p.phone || 'Contact via platform',
        services: p.provider_services?.map((s: any) => ({
          service_name: s.service_name,
          category: {
            name: s.service_categories?.name || 'General'
          }
        })) || []
      }));

      setProviders(formattedProviders);
    } catch (error: any) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(s => 
                           s.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           s.category.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesSpecialty = specialtyFilter === "all" || 
                            provider.services.some(s => s.category.name === specialtyFilter);
    
    return matchesSearch && matchesSpecialty;
  });

  const convertToDoctor = (provider: ProviderWithServices): Doctor => ({
    id: parseInt(provider.id.substring(0, 8), 16),
    name: provider.name,
    specialty: provider.services[0]?.category.name || 'General Practice',
    rating: 4.5,
    reviews: 0,
    location: 'Healthcare Center',
    address: 'Medical District',
    coordinates: [-74.006, 40.7128],
    availability: 'Contact for availability',
    phone: provider.phone,
    image: provider.photo_url,
    bio: provider.bio,
  });

  const doctorsList = filteredProviders.map(convertToDoctor);

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Healthcare Provider</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Connect with trusted healthcare professionals near you
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input 
                  placeholder="Search by name, specialty, service..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="today">Available Today</SelectItem>
                  <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 mt-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rating</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="medical">
                <Search className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} 
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6">
            {filteredProviders.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No providers found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredProviders.map((provider) => {
                const doctor = convertToDoctor(provider);
                return (
                  <Card key={provider.id} className="shadow-card hover:shadow-medical transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold">{doctor.name}</h3>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {provider.services.slice(0, 3).map((service, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {service.category.name}
                                  </Badge>
                                ))}
                                {provider.services.length > 3 && (
                                  <Badge variant="outline">
                                    +{provider.services.length - 3} more
                                  </Badge>
                                )}
                                <Badge className="bg-purple-100 text-purple-700">✅ Verified</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-4">{doctor.bio}</p>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Services Offered:</p>
                            <div className="flex flex-wrap gap-2">
                              {provider.services.map((service, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {service.service_name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {doctor.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {doctor.availability}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link to={`/doctor/${provider.id}`}>
                              <Button variant="medical" size="sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                View Profile
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
          
          <TabsContent value="map">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DoctorMap 
                  doctors={doctorsList} 
                  onDoctorSelect={setSelectedDoctor}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {selectedDoctor ? 'Selected Provider' : 'Providers in Area'}
                </h3>
                
                {selectedDoctor ? (
                  <Card className="shadow-medical">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{selectedDoctor.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {selectedDoctor.specialty}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {selectedDoctor.bio}
                      </p>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {selectedDoctor.address}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {selectedDoctor.availability}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Link to={`/doctor/${selectedDoctor.id}`}>
                          <Button variant="medical" size="sm" className="w-full">
                            View Full Profile
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="w-full">
                          <Phone className="h-3 w-3 mr-1" />
                          Call {selectedDoctor.phone}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {doctorsList.slice(0, 3).map(doctor => (
                      <Card key={doctor.id} className="shadow-card hover:shadow-medical transition-shadow cursor-pointer"
                            onClick={() => setSelectedDoctor(doctor)}>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2">
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doctor.name}</p>
                              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
