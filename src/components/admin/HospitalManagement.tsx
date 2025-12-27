import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Building2, Plus, Pencil, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Hospital {
  id: string;
  name: string;
  address: string | null;
  city: string;
  phone: string | null;
  email: string | null;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HospitalFormData {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  is_active: boolean;
}

const initialFormData: HospitalFormData = {
  name: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  description: '',
  is_active: true,
};

export default function HospitalManagement() {
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [formData, setFormData] = useState<HospitalFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; hospital: Hospital | null }>({
    open: false,
    hospital: null,
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hospitals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (hospital?: Hospital) => {
    if (hospital) {
      setEditingHospital(hospital);
      setFormData({
        name: hospital.name,
        address: hospital.address || '',
        city: hospital.city,
        phone: hospital.phone || '',
        email: hospital.email || '',
        description: hospital.description || '',
        is_active: hospital.is_active,
      });
    } else {
      setEditingHospital(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingHospital) {
        const { error } = await supabase
          .from('hospitals')
          .update({
            name: formData.name,
            address: formData.address || null,
            city: formData.city,
            phone: formData.phone || null,
            email: formData.email || null,
            description: formData.description || null,
            is_active: formData.is_active,
          })
          .eq('id', editingHospital.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Hospital updated successfully' });
      } else {
        const { error } = await supabase.from('hospitals').insert({
          name: formData.name,
          address: formData.address || null,
          city: formData.city,
          phone: formData.phone || null,
          email: formData.email || null,
          description: formData.description || null,
          is_active: formData.is_active,
        });

        if (error) throw error;
        toast({ title: 'Success', description: 'Hospital added successfully' });
      }

      setDialogOpen(false);
      fetchHospitals();
    } catch (error) {
      console.error('Error saving hospital:', error);
      toast({
        title: 'Error',
        description: 'Failed to save hospital',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.hospital) return;

    try {
      const { error } = await supabase
        .from('hospitals')
        .delete()
        .eq('id', deleteDialog.hospital.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Hospital deleted successfully' });
      setDeleteDialog({ open: false, hospital: null });
      fetchHospitals();
    } catch (error) {
      console.error('Error deleting hospital:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete hospital',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (hospital: Hospital) => {
    try {
      const { error } = await supabase
        .from('hospitals')
        .update({ is_active: !hospital.is_active })
        .eq('id', hospital.id);

      if (error) throw error;
      fetchHospitals();
    } catch (error) {
      console.error('Error toggling hospital status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update hospital status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Hospital & Clinic Management
              </CardTitle>
              <CardDescription>
                Add and manage hospitals, clinics, and healthcare facilities
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hospital
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingHospital
                        ? 'Update the hospital details below'
                        : 'Fill in the details to add a new hospital or clinic'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Hospital Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter hospital name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter full address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone number"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the facility"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_active: checked })
                        }
                      />
                      <Label htmlFor="is_active">Active (visible to users)</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Saving...' : editingHospital ? 'Update' : 'Add Hospital'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {hospitals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hospitals added yet. Click "Add Hospital" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hospitals.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{hospital.name}</p>
                        {hospital.address && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {hospital.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{hospital.city}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {hospital.phone && (
                          <p className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {hospital.phone}
                          </p>
                        )}
                        {hospital.email && (
                          <p className="text-sm flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {hospital.email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={hospital.is_active}
                        onCheckedChange={() => handleToggleActive(hospital)}
                      />
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(hospital.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(hospital)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => setDeleteDialog({ open: true, hospital })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hospital</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.hospital?.name}"? This action cannot be
              undone and will also remove all provider assignments to this hospital.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
