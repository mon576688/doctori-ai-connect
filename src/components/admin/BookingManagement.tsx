import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Calendar, Clock, User, Stethoscope, Search, Filter, MoreVertical, Eye, XCircle, CheckCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_type: string | null;
  status: string | null;
  notes: string | null;
  duration_minutes: number | null;
  created_at: string;
  patient?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    photo_url: string | null;
  };
  doctor?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    photo_url: string | null;
  };
}

export default function BookingManagement() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'cancel' | 'complete' | null;
    appointment: Appointment | null;
  }>({ open: false, action: null, appointment: null });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false });

      if (appointmentsError) throw appointmentsError;

      // Fetch patient and doctor profiles
      const userIds = [...new Set([
        ...(appointmentsData?.map(a => a.user_id) || []),
        ...(appointmentsData?.map(a => a.doctor_id) || [])
      ])];

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, photo_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedAppointments = appointmentsData?.map(appointment => ({
        ...appointment,
        patient: profileMap.get(appointment.user_id),
        doctor: profileMap.get(appointment.doctor_id)
      })) || [];

      setAppointments(enrichedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load appointments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Appointment ${newStatus}`,
      });

      fetchAppointments();
      setActionDialog({ open: false, action: null, appointment: null });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update appointment',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      scheduled: { variant: 'default', color: 'bg-blue-500' },
      completed: { variant: 'secondary', color: 'bg-green-500' },
      cancelled: { variant: 'destructive', color: 'bg-red-500' },
      pending: { variant: 'outline', color: 'bg-yellow-500' }
    };
    
    const config = variants[status || 'pending'] || variants.pending;
    
    return (
      <Badge variant={config.variant} className="capitalize">
        {status || 'pending'}
      </Badge>
    );
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading appointments...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Management
          </CardTitle>
          <CardDescription>
            Manage all appointments and bookings across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{appointments.length}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {appointments.filter(a => a.status === 'scheduled').length}
              </p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {appointments.filter(a => a.status === 'cancelled').length}
              </p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </div>

          {/* Table */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={appointment.patient?.photo_url || ''} />
                            <AvatarFallback>
                              {appointment.patient?.first_name?.[0]}
                              {appointment.patient?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {appointment.patient?.first_name} {appointment.patient?.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.patient?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={appointment.doctor?.photo_url || ''} />
                            <AvatarFallback>
                              {appointment.doctor?.first_name?.[0]}
                              {appointment.doctor?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(appointment.appointment_date), 'hh:mm a')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {appointment.appointment_type || 'Consultation'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedAppointment(appointment)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {appointment.status === 'scheduled' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => setActionDialog({ 
                                    open: true, 
                                    action: 'complete', 
                                    appointment 
                                  })}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => setActionDialog({ 
                                    open: true, 
                                    action: 'cancel', 
                                    appointment 
                                  })}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <AlertDialog 
        open={actionDialog.open} 
        onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'complete' ? 'Complete Appointment' : 'Cancel Appointment'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'complete' 
                ? 'Are you sure you want to mark this appointment as completed?'
                : 'Are you sure you want to cancel this appointment? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (actionDialog.appointment && actionDialog.action) {
                  handleStatusUpdate(
                    actionDialog.appointment.id,
                    actionDialog.action === 'complete' ? 'completed' : 'cancelled'
                  );
                }
              }}
              className={actionDialog.action === 'cancel' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
