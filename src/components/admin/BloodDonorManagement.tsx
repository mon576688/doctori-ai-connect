import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Heart, Search, Trash2, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface BloodDonor {
  id: string;
  full_name: string;
  age: number;
  blood_group: string;
  city: string;
  mobile_number: string;
  email: string | null;
  available_for_donation: boolean;
  last_donated_date: string | null;
  created_at: string;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodDonorManagement() {
  const { toast } = useToast();
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; donor: BloodDonor | null }>({
    open: false,
    donor: null,
  });

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blood_donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blood donors',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (donor: BloodDonor) => {
    try {
      const { error } = await supabase
        .from('blood_donors')
        .update({ available_for_donation: !donor.available_for_donation })
        .eq('id', donor.id);

      if (error) throw error;

      setDonors(donors.map(d => 
        d.id === donor.id 
          ? { ...d, available_for_donation: !d.available_for_donation }
          : d
      ));

      toast({
        title: 'Updated',
        description: `Donor availability updated successfully`,
      });
    } catch (error) {
      console.error('Error updating donor:', error);
      toast({
        title: 'Error',
        description: 'Failed to update donor availability',
        variant: 'destructive',
      });
    }
  };

  const deleteDonor = async (donor: BloodDonor) => {
    try {
      const { error } = await supabase
        .from('blood_donors')
        .delete()
        .eq('id', donor.id);

      if (error) throw error;

      setDonors(donors.filter(d => d.id !== donor.id));
      setDeleteDialog({ open: false, donor: null });

      toast({
        title: 'Deleted',
        description: 'Blood donor record deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting donor:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete donor record',
        variant: 'destructive',
      });
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = 
      donor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.mobile_number.includes(searchQuery);
    
    const matchesBloodGroup = bloodGroupFilter === 'all' || donor.blood_group === bloodGroupFilter;
    const matchesAvailability = 
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && donor.available_for_donation) ||
      (availabilityFilter === 'unavailable' && !donor.available_for_donation);

    return matchesSearch && matchesBloodGroup && matchesAvailability;
  });

  const stats = {
    total: donors.length,
    available: donors.filter(d => d.available_for_donation).length,
    byBloodGroup: BLOOD_GROUPS.reduce((acc, bg) => {
      acc[bg] = donors.filter(d => d.blood_group === bg).length;
      return acc;
    }, {} as Record<string, number>),
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading blood donors...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Donors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Available Now</p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map(bg => (
                <Badge key={bg} variant="outline" className="text-xs">
                  {bg}: {stats.byBloodGroup[bg] || 0}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">By Blood Group</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Blood Donors Management
          </CardTitle>
          <CardDescription>View and manage registered blood donors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {BLOOD_GROUPS.map(bg => (
                  <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredDonors.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No blood donors found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Donated</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">{donor.full_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">
                          {donor.blood_group}
                        </Badge>
                      </TableCell>
                      <TableCell>{donor.age}</TableCell>
                      <TableCell>{donor.city}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {donor.mobile_number}
                          </span>
                          {donor.email && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {donor.email}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {donor.last_donated_date 
                          ? format(new Date(donor.last_donated_date), 'MMM d, yyyy')
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={donor.available_for_donation}
                          onCheckedChange={() => toggleAvailability(donor)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDialog({ open: true, donor })}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, donor: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blood Donor Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the donor record for "{deleteDialog.donor?.full_name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.donor && deleteDonor(deleteDialog.donor)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
