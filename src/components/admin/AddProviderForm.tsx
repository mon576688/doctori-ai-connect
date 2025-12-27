import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Building2, Loader2 } from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  city: string;
}

const SPECIALTIES = [
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Gynecology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Urology',
];

const PROVIDER_TYPES = [
  'Doctor',
  'Specialist',
  'Surgeon',
  'Consultant',
  'Therapist',
  'Nurse Practitioner',
];

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialty: string;
  provider_type: string;
  license_number: string;
  experience: string;
  bio: string;
  city: string;
  address: string;
  auto_approve: boolean;
  hospital_id: string;
}

const initialFormData: FormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  specialty: '',
  provider_type: '',
  license_number: '',
  experience: '',
  bio: '',
  city: '',
  address: '',
  auto_approve: true,
  hospital_id: '',
};

export default function AddProviderForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name, city')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // First, create the user in auth.users via signUp
      // Note: In a real scenario, you'd use an admin API or edge function
      // For now, we'll create the profile directly
      
      const providerId = crypto.randomUUID();
      
      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: providerId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        role: 'provider',
        provider_type: formData.provider_type || null,
        city: formData.city || null,
        address: formData.address || null,
        bio: formData.bio || null,
        approval_status: formData.auto_approve ? 'approved' : 'pending',
      });

      if (profileError) throw profileError;

      // Create user role
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: providerId,
        role: 'provider',
      });

      if (roleError) {
        // Rollback profile creation
        await supabase.from('profiles').delete().eq('id', providerId);
        throw roleError;
      }

      // Create doctor entry
      const { error: doctorError } = await supabase.from('doctors').insert({
        user_id: providerId,
        specialty: formData.specialty || 'General Practice',
        license_number: formData.license_number || null,
        experience: formData.experience ? parseInt(formData.experience) : null,
        bio: formData.bio || null,
        approved: formData.auto_approve,
      });

      if (doctorError) {
        // Rollback
        await supabase.from('user_roles').delete().eq('user_id', providerId);
        await supabase.from('profiles').delete().eq('id', providerId);
        throw doctorError;
      }

      // Assign to hospital if selected
      if (formData.hospital_id) {
        const { error: assignError } = await supabase
          .from('provider_hospital_assignments')
          .insert({
            provider_id: providerId,
            hospital_id: formData.hospital_id,
            is_primary: true,
          });

        if (assignError) {
          console.error('Error assigning hospital:', assignError);
          // Don't throw - provider is created, just hospital assignment failed
        }
      }

      toast({
        title: 'Success',
        description: `Provider ${formData.first_name} ${formData.last_name} has been created${formData.auto_approve ? ' and approved' : ''}`,
      });

      // Reset form
      setFormData(initialFormData);
    } catch (error: any) {
      console.error('Error creating provider:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create provider',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Service Provider
        </CardTitle>
        <CardDescription>
          Create a new healthcare provider account directly. The provider will be added to the system
          with the specified details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="provider@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider_type">Provider Type</Label>
                <Select
                  value={formData.provider_type}
                  onValueChange={(value) => setFormData({ ...formData, provider_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  placeholder="Medical license number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief professional biography"
                rows={3}
              />
            </div>
          </div>

          {/* Location & Hospital */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Location & Hospital Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Assign to Hospital (Optional)
              </Label>
              {loadingHospitals ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading hospitals...
                </div>
              ) : hospitals.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hospitals available. Add hospitals first in Hospital Management.
                </p>
              ) : (
                <Select
                  value={formData.hospital_id}
                  onValueChange={(value) => setFormData({ ...formData, hospital_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a hospital (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.name} - {hospital.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Options
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto_approve"
                checked={formData.auto_approve}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, auto_approve: checked as boolean })
                }
              />
              <Label htmlFor="auto_approve" className="cursor-pointer">
                Auto-approve this provider (skip pending review)
              </Label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setFormData(initialFormData)}>
              Reset Form
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {submitting ? 'Creating Provider...' : 'Create Provider'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
