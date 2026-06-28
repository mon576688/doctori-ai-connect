import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Briefcase, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  Heart,
  Share2,
  Award,
  Users,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Camera
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/bookingUtils';
import { toast } from 'sonner';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { useAuth } from '@/hooks/useAuth';
import { SimilarDoctors } from '@/components/booking/SimilarDoctors';

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setProvider } = useBooking();
  const { user } = useAuth();
  const [provider, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        // Use providers_public view (no RLS restrictions) for basic info
        const { data, error } = await supabase
          .from('providers_public')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Fetch services separately (also publicly accessible)
        const { data: servicesData } = await supabase
          .from('provider_services')
          .select('service_name, price, description, duration_minutes')
          .eq('provider_id', id!)
          .eq('is_active', true);

        const services = servicesData || [];

        const formattedProvider = {
          id: data.id,
          name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Provider',
          bio: data.bio || 'No bio available. This provider has not added a description yet.',
          photo_url: data.photo_url || '/placeholder.svg',
          latitude: 0,
          longitude: 0,
          address: 'Address not provided',
          city: data.city || '',
          provider_type: data.provider_type || 'Healthcare Provider',
          phone: 'Not provided',
          email: 'Not provided',
          specialty: data.specialty || services[0]?.service_name || 'General Practice',
          price: data.consultation_fee || services[0]?.price || 0,
          duration: services[0]?.duration_minutes || 30,
          experience: data.years_experience || data.experience || 5,
          rating: 4.8,
          reviews: 0,
          services: services,
          languages: ['English', 'Bengali'],
          education: ['Medical Degree', 'Board Certified'],
          certifications: ['Licensed Healthcare Provider'],
          hours: {
            saturday: '9:00 AM - 5:00 PM',
            sunday: '9:00 AM - 5:00 PM',
            monday: '9:00 AM - 5:00 PM',
            tuesday: '9:00 AM - 5:00 PM',
            wednesday: '9:00 AM - 5:00 PM',
            thursday: '9:00 AM - 5:00 PM',
            friday: 'Closed'
          }
        };

        setProviderData(formattedProvider);
      } catch (error) {
        console.error('Error fetching provider:', error);
        toast.error('Failed to load provider details');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProvider();
    }
  }, [id, navigate]);

  const handleBookAppointment = () => {
    if (provider) {
      setProvider(provider.id, provider);
      navigate(`/booking/schedule/${provider.id}`);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProviderData((prev: any) => ({ ...prev, photo_url: publicUrl }));
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
          <Link to="/doctors">
            <Button variant="medical">Back to Providers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/doctors" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Providers
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <Card className="shadow-medical">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative mx-auto md:mx-0">
                    <img
                      src={provider.photo_url}
                      alt={provider.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                    />
                    {isOwnProfile && (
                      <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-background/50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{provider.name}</h1>
                        <div className="flex gap-2 flex-wrap justify-center md:justify-start mb-2">
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {provider.specialty}
                          </Badge>
                          <Badge variant="outline">{provider.provider_type}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-medium">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{provider.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Award className="h-4 w-4 text-primary" />
                        <span>{provider.experience}+ years experience</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Users className="h-4 w-4 text-secondary" />
                        <span>Languages: {provider.languages.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{provider.city || provider.address}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Available for booking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Education & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Education</h4>
                  <ul className="space-y-1">
                    {provider.education.map((item: string, index: number) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-secondary mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  <ul className="space-y-1">
                    {provider.certifications.map((item: string, index: number) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-primary mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Services Offered */}
            {provider.services.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    Services Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {provider.services.map((service: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{service.service_name}</h4>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            {formatPrice(service.price)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {service.duration_minutes} min
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Office Hours */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(provider.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between py-2 border-b border-border/50">
                      <span className="font-medium capitalize">{day}</span>
                      <span className="text-muted-foreground">{hours as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    Patient Reviews
                  </CardTitle>
                  {user && !isOwnProfile && (
                    <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Write Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <ReviewForm 
                          providerId={provider.id} 
                          onSuccess={() => setShowReviewDialog(false)} 
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ReviewsList providerId={provider.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="shadow-medical sticky top-4">
              <CardHeader>
                <CardTitle className="text-center">Book Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {formatPrice(provider.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">Consultation Fee</div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button 
                    variant="medical" 
                    className="w-full" 
                    onClick={handleBookAppointment}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  
                  {provider.phone !== 'Not provided' && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`tel:${provider.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call {provider.phone}
                      </a>
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Heart className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">{provider.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-secondary" />
                  <span className="text-sm">{provider.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-accent mt-0.5" />
                  <span className="text-sm">{provider.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-semibold text-destructive mb-2">Medical Emergency?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    For urgent medical care, call 999 or visit your nearest emergency room.
                  </p>
                  <Button variant="destructive" size="sm" className="w-full" asChild>
                    <a href="tel:999">Emergency Services</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {provider && (
          <SimilarDoctors
            currentDoctorId={provider.id}
            specialty={provider.specialty}
            city={provider.city}
          />
        )}
      </div>
    </div>
  );
}
