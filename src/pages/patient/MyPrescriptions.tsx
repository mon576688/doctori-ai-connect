import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  User,
  Pill,
  Stethoscope,
  Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface Prescription {
  id: string;
  prescription_type: string;
  diagnosis: string | null;
  doctor_notes: string | null;
  medicines: Medicine[];
  image_url: string | null;
  created_at: string;
  doctor_id: string;
  doctor_info?: {
    first_name: string;
    last_name: string;
    specialty?: string;
  };
}

export default function MyPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch doctor info for each prescription
      const prescriptionsWithDoctorInfo = await Promise.all(
        (data || []).map(async (prescription) => {
          const { data: doctorProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', prescription.doctor_id)
            .single();

          const { data: doctorData } = await supabase
            .from('doctors')
            .select('specialty')
            .eq('user_id', prescription.doctor_id)
            .single();

          return {
            ...prescription,
            medicines: (prescription.medicines as unknown as Medicine[]) || [],
            doctor_info: {
              first_name: doctorProfile?.first_name || 'Unknown',
              last_name: doctorProfile?.last_name || 'Doctor',
              specialty: doctorData?.specialty,
            },
          };
        })
      );

      setPrescriptions(prescriptionsWithDoctorInfo);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (prescription: Prescription) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.text('Doctori AI', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Digital Prescription', 20, 28);

    // Line
    doc.setDrawColor(0, 102, 204);
    doc.line(20, 35, 190, 35);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Date: ${format(new Date(prescription.created_at), 'PPP')}`, 20, 45);

    // Doctor Info
    if (prescription.doctor_info) {
      doc.setFontSize(12);
      doc.text(`Dr. ${prescription.doctor_info.first_name} ${prescription.doctor_info.last_name}`, 20, 55);
      if (prescription.doctor_info.specialty) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(prescription.doctor_info.specialty, 20, 62);
      }
    }

    // Diagnosis
    if (prescription.diagnosis) {
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text('Diagnosis:', 20, 75);
      doc.setFontSize(10);
      doc.text(prescription.diagnosis, 20, 82);
    }

    // Medicines
    let yPos = prescription.diagnosis ? 95 : 75;
    doc.setFontSize(11);
    doc.text('Prescribed Medicines:', 20, yPos);
    yPos += 10;

    prescription.medicines.forEach((medicine, index) => {
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`${index + 1}. ${medicine.name} - ${medicine.dosage}`, 25, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`   Frequency: ${medicine.frequency} | Duration: ${medicine.duration}`, 25, yPos);
      if (medicine.instructions) {
        yPos += 5;
        doc.text(`   Instructions: ${medicine.instructions}`, 25, yPos);
      }
      yPos += 10;
    });

    // Doctor Notes
    if (prescription.doctor_notes) {
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text('Doctor\'s Notes:', 20, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.text(prescription.doctor_notes, 20, yPos, { maxWidth: 170 });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('This is a digitally generated prescription from Doctori AI.', 20, 280);

    doc.save(`prescription_${format(new Date(prescription.created_at), 'yyyy-MM-dd')}.pdf`);
    toast.success('Prescription downloaded!');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Prescriptions</h1>
        <p className="text-muted-foreground">View and download your medical prescriptions</p>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Prescriptions Yet</h3>
            <p className="text-muted-foreground mt-2">
              Your prescriptions from consultations will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {prescription.prescription_type === 'typed' ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-primary" />
                      )}
                      Prescription from Dr. {prescription.doctor_info?.first_name} {prescription.doctor_info?.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(prescription.created_at), 'PPP')}
                      {prescription.doctor_info?.specialty && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <Stethoscope className="h-4 w-4" />
                          {prescription.doctor_info.specialty}
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={prescription.prescription_type === 'typed' ? 'default' : 'secondary'}>
                    {prescription.prescription_type === 'typed' ? 'Digital' : 'Image'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {prescription.prescription_type === 'typed' ? (
                  <>
                    {prescription.diagnosis && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Diagnosis</h4>
                        <p className="mt-1">{prescription.diagnosis}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Medicines</h4>
                      <div className="space-y-2">
                        {prescription.medicines.slice(0, 2).map((medicine, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Pill className="h-4 w-4 text-primary" />
                            <span className="font-medium">{medicine.name}</span>
                            <span className="text-muted-foreground">- {medicine.dosage}</span>
                          </div>
                        ))}
                        {prescription.medicines.length > 2 && (
                          <p className="text-sm text-muted-foreground">
                            +{prescription.medicines.length - 2} more medicines
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Image prescription uploaded by doctor</p>
                  </div>
                )}

                <Separator />

                <div className="flex gap-2 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedPrescription(prescription)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Prescription Details</DialogTitle>
                      </DialogHeader>
                      {selectedPrescription && (
                        <div className="space-y-6 mt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                Dr. {selectedPrescription.doctor_info?.first_name} {selectedPrescription.doctor_info?.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {selectedPrescription.doctor_info?.specialty}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(selectedPrescription.created_at), 'PPP')}
                            </p>
                          </div>

                          <Separator />

                          {selectedPrescription.prescription_type === 'typed' ? (
                            <>
                              {selectedPrescription.diagnosis && (
                                <div>
                                  <h4 className="font-medium mb-2">Diagnosis</h4>
                                  <p className="text-muted-foreground">{selectedPrescription.diagnosis}</p>
                                </div>
                              )}

                              <div>
                                <h4 className="font-medium mb-3">Prescribed Medicines</h4>
                                <div className="space-y-3">
                                  {selectedPrescription.medicines.map((medicine, index) => (
                                    <div key={index} className="border rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Pill className="h-4 w-4 text-primary" />
                                        <span className="font-medium">{medicine.name}</span>
                                        <Badge variant="outline">{medicine.dosage}</Badge>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                        <div>Frequency: {medicine.frequency}</div>
                                        <div>Duration: {medicine.duration}</div>
                                      </div>
                                      {medicine.instructions && (
                                        <p className="text-sm mt-2">
                                          <strong>Instructions:</strong> {medicine.instructions}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {selectedPrescription.doctor_notes && (
                                <div>
                                  <h4 className="font-medium mb-2">Doctor's Notes</h4>
                                  <p className="text-muted-foreground">{selectedPrescription.doctor_notes}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div>
                              <h4 className="font-medium mb-3">Prescription Image</h4>
                              {selectedPrescription.image_url && (
                                <img
                                  src={selectedPrescription.image_url}
                                  alt="Prescription"
                                  className="max-w-full rounded-lg"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => downloadPDF(prescription)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
