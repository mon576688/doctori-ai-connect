import { useState, useEffect } from 'react';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stethoscope, Users, FileText, User, MessageSquare, Calendar as CalendarIcon, Video, Package } from 'lucide-react';
import { ProviderAvailability } from '@/components/ProviderAvailability';
import { AppointmentsList } from '@/components/AppointmentsList';
import { DocumentUpload } from '@/components/provider/DocumentUpload';
import { Inbox } from '@/components/messaging/Inbox';
import ConsultationAppointments from '@/components/provider/ConsultationAppointments';
import { ProfilePhotoUpload } from '@/components/provider/ProfilePhotoUpload';
import { ServiceManagement } from '@/components/provider/ServiceManagement';

const PROVIDER_TYPES = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'nurse', label: 'Nurse' }
];

interface Patient {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
}

export default function ProviderDashboard() {
  const { profile, refetchProfile } = useRoleBasedAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    address: '',
    city: '',
    provider_type: '',
    specialty: '',
    experience: '',
    license_number: '',
    photo_url: ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchProviderData();
      fetchPatients();
    }
  }, [profile]);

  const fetchProviderData = async () => {
    try {
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', profile?.id)
        .maybeSingle();

      if (doctorError) {
        throw doctorError;
      }

      setProfileData({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        phone: profile?.phone || '',
        bio: profile?.bio || doctorData?.bio || '',
        address: profile?.address || '',
        city: profile?.city || '',
        provider_type: profile?.provider_type || '',
        specialty: doctorData?.specialty || '',
        experience: doctorData?.experience?.toString() || '',
        license_number: doctorData?.license_number || '',
        photo_url: profile?.photo_url || ''
      });
    } catch (error) {
      console.error('Error fetching provider data:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_patient_assignments')
        .select(`
          patient_id,
          profiles!provider_patient_assignments_patient_id_fkey (
            id,
            name,
            email,
            age,
            gender
          )
        `)
        .eq('provider_id', profile?.id);

      if (error) throw error;

      const patientList = data?.map(assignment => ({
        id: assignment.profiles?.id || '',
        name: assignment.profiles?.name || '',
        email: assignment.profiles?.email || '',
        age: assignment.profiles?.age,
        gender: assignment.profiles?.gender
      })) || [];

      setPatients(patientList);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patient assignments",
        variant: "destructive"
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate provider_type is one of allowed values
      const validProviderTypes = ['doctor', 'hospital', 'nurse'];
      const providerType = validProviderTypes.includes(profileData.provider_type) 
        ? profileData.provider_type 
        : 'doctor';

      // Update profiles table with comprehensive data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          bio: profileData.bio,
          address: profileData.address,
          city: profileData.city,
          provider_type: providerType,
          photo_url: profileData.photo_url
        })
        .eq('id', profile?.id);

      if (profileError) throw profileError;

      // Upsert doctors table - required for availability slots FK
      const { error: doctorError } = await supabase
        .from('doctors')
        .upsert({
          user_id: profile?.id,
          bio: profileData.bio,
          specialty: profileData.specialty || 'General',
          experience: parseInt(profileData.experience) || 0,
          license_number: profileData.license_number
        }, {
          onConflict: 'user_id'
        });

      if (doctorError) throw doctorError;

      // Refetch the updated profile
      if (refetchProfile) {
        await refetchProfile();
      }
      await fetchProviderData();

      toast({
        title: "Profile updated",
        description: "Your provider profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdated = (url: string) => {
    setProfileData(prev => ({ ...prev, photo_url: url }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your practice and connect with patients
          </p>
          {profile?.approval_status === 'approved' && (
            <Badge variant="default" className="mt-2">
              ✓ Verified Provider
            </Badge>
          )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="services">
              <Package className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="availability">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Availability
            </TabsTrigger>
            <TabsTrigger value="consultations">
              <Video className="w-4 h-4 mr-2" />
              Consultations
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="patients">
              <Users className="w-4 h-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Provider Information
                </CardTitle>
                <CardDescription>
                  Update your professional profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Profile Photo Upload */}
                  <div className="flex justify-center pb-4 border-b">
                    <ProfilePhotoUpload
                      currentPhotoUrl={profileData.photo_url}
                      userId={profile?.id || ''}
                      firstName={profileData.first_name}
                      lastName={profileData.last_name}
                      onPhotoUpdated={handlePhotoUpdated}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name *</Label>
                      <Input
                        id="last_name"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+880 XXX XXX XXXX"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider_type">Provider Type *</Label>
                      <Select
                        value={profileData.provider_type}
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, provider_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVIDER_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Input
                        id="specialty"
                        value={profileData.specialty}
                        onChange={(e) => setProfileData(prev => ({ ...prev, specialty: e.target.value }))}
                        placeholder="e.g., Cardiology, Pediatrics"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={profileData.experience}
                        onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="Years of practice"
                        min="0"
                        max="50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license_number">License Number</Label>
                      <Input
                        id="license_number"
                        value={profileData.license_number}
                        onChange={(e) => setProfileData(prev => ({ ...prev, license_number: e.target.value }))}
                        placeholder="Medical license number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Complete address with street, area, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Describe your experience, specializations, and approach to patient care..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            {profile?.id && <ServiceManagement providerId={profile.id} />}
          </TabsContent>

          <TabsContent value="consultations">
            <ConsultationAppointments />
          </TabsContent>

          <TabsContent value="availability">
            <ProviderAvailability />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsList viewAs="provider" />
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigned Patients
                </CardTitle>
                <CardDescription>
                  View and manage your patient assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No patients assigned</h3>
                    <p className="text-muted-foreground">
                      Patient assignments will appear here once an admin assigns them to you
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {patients.map((patient) => (
                      <Card key={patient.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="font-semibold">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">{patient.email}</p>
                              <div className="flex gap-2">
                                {patient.age && (
                                  <Badge variant="secondary">Age: {patient.age}</Badge>
                                )}
                                {patient.gender && (
                                  <Badge variant="secondary">{patient.gender}</Badge>
                                )}
                              </div>
                            </div>
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="messages">
            <Inbox />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}