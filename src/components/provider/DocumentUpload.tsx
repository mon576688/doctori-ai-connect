import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  status: string;
  review_notes: string | null;
  created_at: string;
}

const DOCUMENT_TYPES = [
  { value: 'medical_license', label: 'Medical License' },
  { value: 'degree_certificate', label: 'Degree Certificate' },
  { value: 'specialization_certificate', label: 'Specialization Certificate' },
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'id_proof', label: 'ID Proof' },
  { value: 'other', label: 'Other' }
];

export function DocumentUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_documents')
        .select('*')
        .eq('provider_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedType || !user) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${selectedType}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('provider-docs')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('provider_documents')
        .insert({
          provider_id: user.id,
          document_type: selectedType,
          file_name: selectedFile.name,
          file_path: fileName,
          file_size: selectedFile.size,
          status: 'pending'
        });

      if (dbError) throw dbError;

      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded and is pending review"
      });

      setSelectedFile(null);
      setSelectedType('');
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc: Document) => {
    if (doc.status === 'approved') {
      toast({
        title: "Cannot Delete",
        description: "Approved documents cannot be deleted",
        variant: "destructive"
      });
      return;
    }

    try {
      await supabase.storage.from('provider-docs').remove([doc.file_path]);
      await supabase.from('provider_documents').delete().eq('id', doc.id);
      
      toast({
        title: "Document Deleted",
        description: "Document has been removed"
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending Review</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Professional Documents
        </CardTitle>
        <CardDescription>
          Upload your professional credentials for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select File</Label>
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
              </p>
            </div>
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !selectedType}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Uploaded Documents</h3>
          {documents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No documents uploaded yet
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="font-medium">{doc.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {DOCUMENT_TYPES.find(t => t.value === doc.document_type)?.label}
                      </p>
                      {doc.review_notes && doc.status === 'rejected' && (
                        <p className="text-sm text-destructive mt-1">
                          {doc.review_notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    {doc.status !== 'approved' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
