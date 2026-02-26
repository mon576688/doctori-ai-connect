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
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation('common');
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
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('name')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData?.map(c => c.name) || []);

      const { data: providersData, error: providersError } = await supabase
        .from('providers_public')
        .select('id, first_name, last_name, name, bio, photo_url, city, provider_type, specialty, experience, consultation_fee, verified, years_experience');

      if (providersError) throw providersError;

      const providerIds = (providersData || []).map(p => p.id).filter(Boolean);
      let servicesMap: Record<string, Array<{ service_name: string; category: { name: string } }>> = {};

      if (providerIds.length > 0) {
        const { data: servicesData } = await supabase
          .from('provider_services')
          .select(`
            provider_id,
            service_name,
            service_categories!provider_services_category_id_fkey(name)
          `)
          .in('provider_id', providerIds)
          .eq('is_active', true);

        for (const s of servicesData || []) {
          const pid = s.provider_id;
          if (!servicesMap[pid]) servicesMap[pid] = [];
          servicesMap[pid].push({
            service_name: s.service_name,
            category: { name: (s.service_categories as any)?.name || 'General' }
          });
        }
      }

      const formattedProviders = (providersData || []).map((p: any) => ({
        id: p.id,
        name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.name || 'Provider',
        first_name: p.first_name,
        last_name: p.last_name,
        bio: p.bio || 'Healthcare provider',
        photo_url: p.photo_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
        phone: t('doctors.contactForAvailability'),
        services: servicesMap[p.id] || (p.specialty ? [{ service_name: p.specialty, category: { name: p.specialty } }] : [])
      }));

      setProviders(formattedProviders);
    } catch (error: any) {
      console.error('Error fetching providers:', error);
      toast({
        title: t('common.error'),
        description: t('doctors.errorLoading'),
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
    availability: t('doctors.contactForAvailability'),
    phone: provider.phone,
    image: provider.photo_url,
    bio: provider.bio,
  });

  const doctorsList = filteredProviders.map(convertToDoctor);

  const DoctorCardSkeleton = () => (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container py-8">
        <SEO 
          title={PAGE_SEO.doctors.title}
          description={PAGE_SEO.doctors.description}
          canonicalPath={PAGE_SEO.doctors.canonicalPath}
        />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="space-y-6">
            <DoctorCardSkeleton />
            <DoctorCardSkeleton />
            <DoctorCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <SEO 
        title={PAGE_SEO.doctors.title}
        description={PAGE_SEO.doctors.description}
        canonicalPath={PAGE_SEO.doctors.canonicalPath}
      />
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('doctors.title')}</h1>
          <p className="text-muted-foreground text-lg mb-6">{t('doctors.subtitle')}</p>
        </header>

        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input 
                  placeholder={t('doctors.searchPlaceholder')} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('doctors.allSpecialties')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('doctors.allSpecialties')}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder={t('doctors.anyTime')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('doctors.anyTime')}</SelectItem>
                  <SelectItem value="today">{t('doctors.availableToday')}</SelectItem>
                  <SelectItem value="tomorrow">{t('doctors.availableTomorrow')}</SelectItem>
                  <SelectItem value="week">{t('doctors.thisWeek')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 mt-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={t('doctors.anyRating')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('doctors.anyRating')}</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="medical">
                <Search className="mr-2 h-4 w-4" />
                {t('common.applyFilters')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <p className="text-muted-foreground">
            {t('doctors.showing')} {filteredProviders.length} {t('doctors.providers')} 
            {searchTerm && ` ${t('doctors.for')} "${searchTerm}"`}
          </p>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">{t('doctors.listView')}</TabsTrigger>
            <TabsTrigger value="map">{t('doctors.mapView')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6">
            {filteredProviders.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">{t('doctors.noProviders')}</p>
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
                          alt={`${doctor.name} - ${doctor.specialty} healthcare provider`}
                          className="w-24 h-24 rounded-full object-cover"
                          loading="lazy"
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
                                    +{provider.services.length - 3} {t('doctors.more')}
                                  </Badge>
                                )}
                                <Badge className="bg-purple-100 text-purple-700">✅ {t('common.verified')}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-4">{doctor.bio}</p>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">{t('doctors.servicesOffered')}:</p>
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
                            <Link to={`/booking/provider/${provider.id}`}>
                              <Button variant="medical" size="sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                {t('common.viewProfile')}
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 mr-1" />
                              {t('common.save')}
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
                  {selectedDoctor ? t('doctors.selectedProvider') : t('doctors.providersInArea')}
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
                        <Link to={`/booking/provider/${providers.find(p => convertToDoctor(p).id === selectedDoctor.id)?.id || ''}`}>
                          <Button variant="medical" size="sm" className="w-full">
                            {t('doctors.viewFullProfile')}
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="w-full">
                          <Phone className="h-3 w-3 mr-1" />
                          {t('doctors.call')} {selectedDoctor.phone}
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
                          <div className="flex items-center space-x-3">
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-sm">{doctor.name}</h4>
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
