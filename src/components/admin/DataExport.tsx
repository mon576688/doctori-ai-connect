import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';

type ExportType = 'appointments' | 'users' | 'providers' | 'reviews';

export function DataExport() {
  const { toast } = useToast();
  const [exportType, setExportType] = useState<ExportType>('appointments');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      let data: any[] = [];
      let filename = '';

      switch (exportType) {
        case 'appointments':
          const { data: appointments, error: appError } = await supabase
            .from('appointments')
            .select(`
              id,
              appointment_date,
              appointment_type,
              status,
              duration_minutes,
              notes,
              created_at
            `)
            .order('appointment_date', { ascending: false });
          if (appError) throw appError;
          data = appointments || [];
          filename = `appointments_${format(new Date(), 'yyyy-MM-dd')}`;
          break;

        case 'users':
          const { data: users, error: userError } = await supabase
            .from('profiles')
            .select(`
              id,
              email,
              first_name,
              last_name,
              phone,
              city,
              role,
              approval_status,
              created_at
            `)
            .order('created_at', { ascending: false });
          if (userError) throw userError;
          data = users || [];
          filename = `users_${format(new Date(), 'yyyy-MM-dd')}`;
          break;

        case 'providers':
          const { data: providers, error: provError } = await supabase
            .from('doctors')
            .select(`
              id,
              specialty,
              experience,
              license_number,
              consultation_fee,
              verified,
              approved,
              created_at
            `)
            .order('created_at', { ascending: false });
          if (provError) throw provError;
          data = providers || [];
          filename = `providers_${format(new Date(), 'yyyy-MM-dd')}`;
          break;

        case 'reviews':
          const { data: reviews, error: revError } = await supabase
            .from('reviews')
            .select(`
              id,
              rating,
              comment,
              is_approved,
              created_at
            `)
            .order('created_at', { ascending: false });
          if (revError) throw revError;
          data = reviews || [];
          filename = `reviews_${format(new Date(), 'yyyy-MM-dd')}`;
          break;
      }

      if (data.length === 0) {
        toast({
          title: "No Data",
          description: "No records found to export",
          variant: "destructive"
        });
        return;
      }

      let content: string;
      let mimeType: string;
      let fileExtension: string;

      if (exportFormat === 'csv') {
        // Convert to CSV
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => 
          Object.values(row).map(val => 
            typeof val === 'string' && val.includes(',') ? `"${val}"` : val
          ).join(',')
        );
        content = [headers, ...rows].join('\n');
        mimeType = 'text/csv';
        fileExtension = 'csv';
      } else {
        // JSON format
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${data.length} records`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Data Export
        </CardTitle>
        <CardDescription>
          Export data in CSV or JSON format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data Type</Label>
            <Select value={exportType} onValueChange={(v) => setExportType(v as ExportType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointments">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Appointments
                  </div>
                </SelectItem>
                <SelectItem value="users">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Users
                  </div>
                </SelectItem>
                <SelectItem value="providers">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Providers
                  </div>
                </SelectItem>
                <SelectItem value="reviews">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reviews
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as 'csv' | 'json')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel compatible)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleExport} disabled={exporting} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export Data'}
        </Button>

        <div className="text-sm text-muted-foreground">
          <p>Export includes all records for the selected data type.</p>
        </div>
      </CardContent>
    </Card>
  );
}
