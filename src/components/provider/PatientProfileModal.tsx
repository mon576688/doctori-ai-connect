import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Heart,
  AlertTriangle,
  Pill,
  Droplet,
  MessageCircle,
} from 'lucide-react';

interface PatientProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
  address: string | null;
  city: string | null;
  medical_conditions: string[] | null;
  allergies: string[] | null;
  medications: string[] | null;
  emergency_contact: string | null;
}

interface PatientProfileModalProps {
  patientId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PatientProfileModal({
  patientId,
  open,
  onOpenChange,
}: PatientProfileModalProps) {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId && open) {
      fetchPatientProfile();
    }
  }, [patientId, open]);

  const fetchPatientProfile = async () => {
    if (!patientId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!profile) return 'P';
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || 'P';
  };

  const fullName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Patient'
    : 'Unknown Patient';

  const openWhatsApp = () => {
    if (profile?.phone) {
      const phone = profile.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`, '_blank');
    }
  };

  const openCall = () => {
    if (profile?.phone) {
      window.open(`tel:${profile.phone}`, '_blank');
    }
  };

  const openEmail = () => {
    if (profile?.email) {
      window.open(`mailto:${profile.email}`, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Profile
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : profile ? (
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.photo_url || undefined} alt={fullName} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{fullName}</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.gender && (
                      <Badge variant="secondary" className="capitalize">
                        {profile.gender}
                      </Badge>
                    )}
                    {profile.age && (
                      <Badge variant="secondary">{profile.age} years</Badge>
                    )}
                    {profile.blood_group && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Droplet className="h-3 w-3" />
                        {profile.blood_group}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap">
                {profile.phone && (
                  <>
                    <Button size="sm" variant="outline" onClick={openCall}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" onClick={openWhatsApp}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </>
                )}
                {profile.email && (
                  <Button size="sm" variant="outline" onClick={openEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                )}
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                )}
                {(profile.address || profile.city) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {[profile.address, profile.city].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                {profile.emergency_contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>Emergency: {profile.emergency_contact}</span>
                  </div>
                )}
              </div>

              {/* Medical Info */}
              {(profile.medical_conditions?.length || profile.allergies?.length || profile.medications?.length) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">Medical Information</h4>

                    {profile.medical_conditions && profile.medical_conditions.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Heart className="h-4 w-4 text-red-500" />
                          Medical Conditions
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {profile.medical_conditions.map((condition, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.allergies && profile.allergies.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Allergies
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {profile.allergies.map((allergy, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-orange-500 text-orange-600">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.medications && profile.medications.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Pill className="h-4 w-4 text-blue-500" />
                          Current Medications
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {profile.medications.map((medication, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {medication}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Patient profile not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}