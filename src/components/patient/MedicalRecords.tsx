import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, FileText, Image, Trash2, Share2, Download, Loader2, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';

const DOCUMENT_TYPES = [
  { value: 'lab_report', label: 'Lab Report' },
  { value: 'xray_imaging', label: 'X-Ray / Imaging' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'vaccination', label: 'Vaccination Record' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
];

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.docx';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface MedicalRecord {
  id: string;
  title: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  created_at: string;
}

interface Doctor {
  doctor_id: string;
  name: string;
  specialty: string;
}

export default function MedicalRecords() {
  const { profile } = useRoleBasedAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('other');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareRecordId, setShareRecordId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchRecords();
    }
  }, [profile?.id]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast({ title: 'Error', description: 'Failed to load medical records', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast({ title: 'Error', description: 'Please provide a title and select a file', variant: 'destructive' });
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({ title: 'Error', description: 'File size must be under 10MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const filePath = `${profile!.id}/${Date.now()}_${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('medical-records')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('medical_records')
        .insert({
          user_id: profile!.id,
          title: title.trim(),
          document_type: documentType,
          file_name: selectedFile.name,
          file_path: filePath,
          file_size: selectedFile.size,
          file_type: selectedFile.type,
        });

      if (dbError) throw dbError;

      toast({ title: 'Uploaded', description: 'Medical record uploaded successfully' });
      setTitle('');
      setDocumentType('other');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchRecords();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', description: error.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (record: MedicalRecord) => {
    if (!confirm(`Delete "${record.title}"? This cannot be undone.`)) return;

    try {
      await supabase.storage.from('medical-records').remove([record.file_path]);

      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', record.id);

      if (error) throw error;

      setRecords(prev => prev.filter(r => r.id !== record.id));
      toast({ title: 'Deleted', description: 'Record removed successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: 'Failed to delete record', variant: 'destructive' });
    }
  };

  const handleDownload = async (record: MedicalRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical-records')
        .createSignedUrl(record.file_path, 60);

      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      toast({ title: 'Error', description: 'Failed to download file', variant: 'destructive' });
    }
  };

  const openShareDialog = async (recordId: string) => {
    setShareRecordId(recordId);
    setSelectedDoctor('');
    setShareDialogOpen(true);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('doctor_id')
        .eq('user_id', profile!.id);

      if (error) throw error;

      const uniqueDoctorIds = [...new Set((data || []).map(a => a.doctor_id))];

      if (uniqueDoctorIds.length === 0) {
        setDoctors([]);
        return;
      }

      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', uniqueDoctorIds);

      if (pErr) throw pErr;

      const { data: doctorData, error: dErr } = await supabase
        .from('doctors')
        .select('user_id, specialty')
        .in('user_id', uniqueDoctorIds);

      if (dErr) throw dErr;

      const doctorList: Doctor[] = (profiles || []).map(p => {
        const doc = (doctorData || []).find(d => d.user_id === p.id);
        return {
          doctor_id: p.id,
          name: `Dr. ${p.first_name || ''} ${p.last_name || ''}`.trim(),
          specialty: doc?.specialty || 'General',
        };
      });

      setDoctors(doctorList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleShare = async () => {
    if (!selectedDoctor || !shareRecordId) return;

    setSharing(true);
    try {
      const { error } = await supabase
        .from('shared_medical_records')
        .insert({
          record_id: shareRecordId,
          patient_id: profile!.id,
          doctor_id: selectedDoctor,
        });

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'Already shared', description: 'This record is already shared with this doctor' });
        } else {
          throw error;
        }
      } else {
        toast({ title: 'Shared', description: 'Record shared with doctor successfully' });
      }

      setShareDialogOpen(false);
    } catch (error: any) {
      console.error('Share error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to share record', variant: 'destructive' });
    } finally {
      setSharing(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeLabel = (type: string) =>
    DOCUMENT_TYPES.find(t => t.value === type)?.label || type;

  const getFileIcon = (fileType: string | null) => {
    if (fileType?.startsWith('image/')) return <Image className="w-5 h-5 text-primary" />;
    return <FileText className="w-5 h-5 text-destructive" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Medical Record
          </CardTitle>
          <CardDescription>
            Accepted formats: PDF, JPG, PNG, DOCX (Max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Blood Test Report - Jan 2025"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button onClick={handleUpload} disabled={uploading || !selectedFile || !title.trim()}>
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            My Medical Records
          </CardTitle>
          <CardDescription>
            {records.length} document{records.length !== 1 ? 's' : ''} stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No medical records uploaded yet. Upload your first document above.
            </p>
          ) : (
            <div className="space-y-3">
              {records.map(record => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getFileIcon(record.file_type)}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{record.title}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{getTypeLabel(record.document_type)}</Badge>
                        <span>{formatFileSize(record.file_size)}</span>
                        <span>{format(new Date(record.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(record)} title="Download">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openShareDialog(record.id)} title="Share with doctor">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(record)} title="Delete" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Record With Doctor</DialogTitle>
            <DialogDescription>
              Select a doctor from your past appointments to share this record with.
            </DialogDescription>
          </DialogHeader>
          {doctors.length === 0 ? (
            <p className="text-muted-foreground text-sm">No doctors found from your appointments.</p>
          ) : (
            <div className="space-y-4">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(d => (
                    <SelectItem key={d.doctor_id} value={d.doctor_id}>
                      {d.name} - {d.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleShare} disabled={!selectedDoctor || sharing}>
                  {sharing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
