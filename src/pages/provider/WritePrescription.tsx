import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  FileText, 
  Upload, 
  Plus, 
  Trash2, 
  Send, 
  Mail, 
  MessageCircle,
  Globe,
  ArrowLeft,
  User
} from 'lucide-react';

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface PatientInfo {
  id: string;
  first_name: string;
  last_name: string;
  age?: number;
  gender?: string;
  email?: string;
  phone?: string;
}

export default function WritePrescription() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [searchParams] = useSearchParams();
  const patientIdFromQuery = searchParams.get('patient');
  
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [prescriptionType, setPrescriptionType] = useState<'typed' | 'upload'>('typed');
  
  // Typed prescription fields
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  
  // Upload prescription
  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Sharing options
  const [shareViaEmail, setShareViaEmail] = useState(false);
  const [shareViaWhatsApp, setShareViaWhatsApp] = useState(false);
  const [shareOnPlatform, setShareOnPlatform] = useState(true);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    } else if (patientIdFromQuery) {
      fetchPatientInfo(patientIdFromQuery);
    }
  }, [appointmentId, patientIdFromQuery]);

  const fetchAppointmentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('user_id')
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      if (data) {
        fetchPatientInfo(data.user_id);
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      toast.error('Failed to load appointment details');
    }
  };

  const fetchPatientInfo = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, age, gender, email, phone')
        .eq('id', patientId)
        .single();

      if (error) throw error;
      setPatientInfo(data);
    } catch (error) {
      console.error('Error fetching patient info:', error);
    }
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user || !patientInfo) {
      toast.error('Missing patient or doctor information');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      // Upload image if it's an uploaded prescription
      if (prescriptionType === 'upload' && prescriptionImage) {
        const fileExt = prescriptionImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('provider-docs')
          .upload(fileName, prescriptionImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('provider-docs')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      // Save prescription to database
      const prescriptionData: {
        doctor_id: string;
        patient_id: string;
        prescription_type: string;
        diagnosis?: string | null;
        doctor_notes?: string | null;
        medicines?: unknown;
        image_url?: string | null;
        shared_via_email?: boolean;
        shared_via_whatsapp?: boolean;
        shared_on_platform?: boolean;
      } = {
        doctor_id: user.id,
        patient_id: patientInfo.id,
        prescription_type: prescriptionType,
        diagnosis: prescriptionType === 'typed' ? diagnosis : null,
        doctor_notes: prescriptionType === 'typed' ? doctorNotes : null,
        medicines: prescriptionType === 'typed' ? medicines : [],
        image_url: imageUrl,
        shared_via_email: shareViaEmail,
        shared_via_whatsapp: shareViaWhatsApp,
        shared_on_platform: shareOnPlatform,
      };

      const { error } = await supabase
        .from('prescriptions')
        .insert(prescriptionData as any);

      if (error) throw error;

      toast.success('Prescription saved successfully!');
      
      // Handle sharing
      if (shareViaEmail && patientInfo.email) {
        toast.info('Email notification will be sent to patient');
      }
      if (shareViaWhatsApp && patientInfo.phone) {
        const message = `Your prescription from Doctori AI is ready. Please check your dashboard to view it.`;
        window.open(`https://wa.me/${patientInfo.phone}?text=${encodeURIComponent(message)}`, '_blank');
      }

      navigate('/dashboard/provider');
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Write Prescription</h1>
        <p className="text-muted-foreground">Create a prescription for your patient</p>
      </div>

      {/* Patient Info Card */}
      {patientInfo && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{patientInfo.first_name} {patientInfo.last_name}</p>
              </div>
              {patientInfo.age && (
                <div>
                  <span className="text-muted-foreground">Age:</span>
                  <p className="font-medium">{patientInfo.age} years</p>
                </div>
              )}
              {patientInfo.gender && (
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <p className="font-medium capitalize">{patientInfo.gender}</p>
                </div>
              )}
              {patientInfo.email && (
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium truncate">{patientInfo.email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescription Type Tabs */}
      <Tabs value={prescriptionType} onValueChange={(v) => setPrescriptionType(v as 'typed' | 'upload')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="typed" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Type Prescription
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Image
          </TabsTrigger>
        </TabsList>

        {/* Typed Prescription */}
        <TabsContent value="typed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Enter diagnosis..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Doctor's Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or instructions..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Medicines</CardTitle>
              <Button variant="outline" size="sm" onClick={addMedicine}>
                <Plus className="h-4 w-4 mr-1" />
                Add Medicine
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicines.map((medicine, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Medicine {index + 1}</Badge>
                    {medicines.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedicine(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Medicine Name</Label>
                      <Input
                        placeholder="e.g., Paracetamol"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input
                        placeholder="e.g., 500mg"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Input
                        placeholder="e.g., 3 times daily"
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        placeholder="e.g., 7 days"
                        value={medicine.duration}
                        onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Special Instructions (Optional)</Label>
                    <Input
                      placeholder="e.g., Take after meals"
                      value={medicine.instructions || ''}
                      onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Prescription */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Prescription Image</CardTitle>
              <CardDescription>Upload a photo or scanned copy of the prescription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Prescription preview"
                      className="max-h-96 mx-auto rounded-lg"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPrescriptionImage(null);
                        setImagePreview('');
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <Label
                        htmlFor="prescription-upload"
                        className="cursor-pointer text-primary hover:underline"
                      >
                        Click to upload or drag and drop
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        PNG, JPG or PDF up to 10MB
                      </p>
                    </div>
                    <Input
                      id="prescription-upload"
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sharing Options */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Share Prescription</CardTitle>
          <CardDescription>Choose how to share this prescription with the patient</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant={shareOnPlatform ? "default" : "outline"}
              onClick={() => setShareOnPlatform(!shareOnPlatform)}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Doctori AI Dashboard
            </Button>
            <Button
              variant={shareViaEmail ? "default" : "outline"}
              onClick={() => setShareViaEmail(!shareViaEmail)}
              className="flex items-center gap-2"
              disabled={!patientInfo?.email}
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              variant={shareViaWhatsApp ? "default" : "outline"}
              onClick={() => setShareViaWhatsApp(!shareViaWhatsApp)}
              className="flex items-center gap-2"
              disabled={!patientInfo?.phone}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          <Send className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save & Share Prescription'}
        </Button>
      </div>
    </div>
  );
}
