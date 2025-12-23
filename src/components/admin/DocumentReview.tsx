import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  provider_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  status: string;
  created_at: string;
  provider: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}

const DOCUMENT_TYPES: Record<string, string> = {
  medical_license: 'Medical License',
  degree_certificate: 'Degree Certificate',
  specialization_certificate: 'Specialization Certificate',
  experience_letter: 'Experience Letter',
  id_proof: 'ID Proof',
  other: 'Other'
};

export function DocumentReview() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [reviewDialog, setReviewDialog] = useState<{open: boolean; doc: Document | null; action: 'approve' | 'reject' | null}>({
    open: false,
    doc: null,
    action: null
  });
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('provider_documents')
        .select(`
          *,
          profiles!provider_documents_provider_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setDocuments((data || []).map(d => ({
        ...d,
        provider: d.profiles || { first_name: null, last_name: null, email: null }
      })));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!reviewDialog.doc || !reviewDialog.action) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('provider_documents')
        .update({
          status: reviewDialog.action === 'approve' ? 'approved' : 'rejected',
          review_notes: reviewNotes || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reviewDialog.doc.id);

      if (error) throw error;

      toast({
        title: reviewDialog.action === 'approve' ? "Document Approved" : "Document Rejected",
        description: `The document has been ${reviewDialog.action === 'approve' ? 'approved' : 'rejected'}`
      });

      setReviewDialog({ open: false, doc: null, action: null });
      setReviewNotes('');
      fetchDocuments();
    } catch (error) {
      console.error('Error reviewing document:', error);
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const viewDocument = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('provider-docs')
        .createSignedUrl(doc.file_path, 3600);

      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: "Error",
        description: "Failed to open document",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Review
        </CardTitle>
        <CardDescription>
          Review and verify provider documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Documents Table */}
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">Loading...</p>
        ) : documents.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No documents found
          </p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{doc.file_name}</p>
                    {getStatusBadge(doc.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {DOCUMENT_TYPES[doc.document_type] || doc.document_type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Provider: {doc.provider.first_name} {doc.provider.last_name} ({doc.provider.email})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {format(new Date(doc.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => viewDocument(doc)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {doc.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => setReviewDialog({ open: true, doc, action: 'approve' })}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setReviewDialog({ open: true, doc, action: 'reject' })}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={reviewDialog.open} onOpenChange={(open) => !open && setReviewDialog({ open: false, doc: null, action: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'} Document
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {reviewDialog.action === 'approve'
                  ? 'Are you sure you want to approve this document?'
                  : 'Please provide a reason for rejection:'}
              </p>
              <Textarea
                placeholder={reviewDialog.action === 'approve' ? 'Optional notes...' : 'Reason for rejection...'}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewDialog({ open: false, doc: null, action: null })}>
                Cancel
              </Button>
              <Button
                onClick={handleReview}
                disabled={processing || (reviewDialog.action === 'reject' && !reviewNotes.trim())}
                variant={reviewDialog.action === 'approve' ? 'default' : 'destructive'}
              >
                {processing ? 'Processing...' : reviewDialog.action === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
