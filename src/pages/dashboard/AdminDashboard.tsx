import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  Award,
  FileText,
  Search,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import AdminAnalytics from '@/components/AdminAnalytics';
import ContentManagement from '@/components/admin/ContentManagement';
import BulkOperations from '@/components/admin/BulkOperations';
import UserManagement from '@/components/admin/UserManagement';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminOverview from '@/components/admin/AdminOverview';
import BookingManagement from '@/components/admin/BookingManagement';
import { DocumentReview } from '@/components/admin/DocumentReview';
import { DataExport } from '@/components/admin/DataExport';
import BloodDonorManagement from '@/components/admin/BloodDonorManagement';
import HospitalManagement from '@/components/admin/HospitalManagement';
import AddProviderForm from '@/components/admin/AddProviderForm';
import ProviderServiceManagement from '@/components/admin/ProviderServiceManagement';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  approval_status: string;
  created_at: string;
  phone?: string;
  photo_url?: string;
}

interface Provider extends User {
  bio?: string;
  specialty?: string;
  experience?: number;
  license_number?: string;
}

const tabLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  bookings: 'Bookings',
  pending: 'Pending Approvals',
  providers: 'Healthcare Providers',
  'provider-services': 'Provider Services',
  'add-provider': 'Add Provider',
  hospitals: 'Hospitals & Clinics',
  users: 'All Users',
  'user-mgmt': 'User Management',
  'blood-donors': 'Blood Donors',
  documents: 'Document Review',
  analytics: 'Analytics',
  content: 'Content Management',
  bulk: 'Bulk Operations',
  export: 'Data Export',
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Array<{ id: string; type: string; message: string; time: Date }>>([]);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [headerSearch, setHeaderSearch] = useState('');
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    provider: Provider | null;
  }>({ open: false, action: 'approve', provider: null });

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const { count: apptCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      setAppointmentsCount(apptCount || 0);

      const roleMap = new Map<string, string>();
      rolesData?.forEach(({ user_id, role }) => {
        const currentRole = roleMap.get(user_id);
        if (!currentRole ||
            (role === 'admin') ||
            (role === 'provider' && currentRole === 'user')) {
          roleMap.set(user_id, role);
        }
      });

      const regularUsers: User[] = [];
      const allProviders: Provider[] = [];

      allUsers?.forEach((user) => {
        const userRole = roleMap.get(user.id) || 'user';
        const userWithRole = { ...user, role: userRole };

        if (userRole === 'provider') {
          allProviders.push(userWithRole as Provider);
        } else {
          regularUsers.push(userWithRole);
        }
      });

      const pending = allProviders.filter(p => p.approval_status === 'pending');

      const activity = allUsers?.slice(0, 10).map(user => ({
        id: user.id,
        type: roleMap.get(user.id) === 'provider' ? 'provider' : 'user',
        message: `${user.first_name || 'User'} ${user.last_name || ''} registered`,
        time: new Date(user.created_at)
      })) || [];

      setUsers(regularUsers);
      setProviders(allProviders);
      setPendingProviders(pending);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProviderAction = async (providerId: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';

      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: newStatus })
        .eq('id', providerId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Provider has been ${action === 'approve' ? 'approved' : 'rejected'}`,
      });

      fetchData();
      setActionDialog({ open: false, action: 'approve', provider: null });
    } catch (error) {
      console.error('Error updating provider:', error);
      toast({
        title: 'Error',
        description: 'Failed to update provider status',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; icon: typeof Clock }> = {
      pending: { variant: 'secondary', icon: Clock },
      approved: { variant: 'default', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle }
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const ProviderDetailView = ({ provider }: { provider: Provider }) => (
    <ScrollArea className="h-[500px] w-full rounded-md border p-6">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={provider.photo_url} />
            <AvatarFallback className="text-lg">
              {provider.first_name?.[0]}{provider.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-2xl font-bold tracking-tight">
              {provider.first_name} {provider.last_name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(provider.approval_status)}
              <Badge variant="outline">{provider.role}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{provider.email}</span>
          </div>
          {provider.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{provider.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Registered {formatDistanceToNow(new Date(provider.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Professional Information
          </h4>

          {provider.specialty && (
            <div>
              <p className="text-sm font-medium">Specialty</p>
              <p className="text-sm text-muted-foreground">{provider.specialty}</p>
            </div>
          )}

          {provider.experience !== undefined && (
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Experience
              </p>
              <p className="text-sm text-muted-foreground">{provider.experience} years</p>
            </div>
          )}

          {provider.license_number && (
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                License Number
              </p>
              <p className="text-sm text-muted-foreground">{provider.license_number}</p>
            </div>
          )}

          {provider.bio && (
            <div>
              <p className="text-sm font-medium">Bio</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{provider.bio}</p>
            </div>
          )}
        </div>

        {provider.approval_status === 'pending' && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button
                onClick={() => setActionDialog({ open: true, action: 'approve', provider })}
                className="flex-1"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Approve Provider
              </Button>
              <Button
                onClick={() => setActionDialog({ open: true, action: 'reject', provider })}
                variant="destructive"
                className="flex-1"
              >
                <UserX className="mr-2 h-4 w-4" />
                Reject Application
              </Button>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminOverview
            stats={{
              totalUsers: users.length,
              totalProviders: providers.length,
              pendingApprovals: pendingProviders.length,
              activeProviders: providers.filter(p => p.approval_status === 'approved').length,
              totalAppointments: appointmentsCount
            }}
            recentActivity={recentActivity}
            onNavigate={setActiveTab}
          />
        );

      case 'bookings':
        return <BookingManagement />;

      case 'pending':
        return (
          <div className="space-y-4">
            {selectedProvider ? (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="tracking-tight">Provider Details</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setSelectedProvider(null)}>
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProviderDetailView provider={selectedProvider} />
                </CardContent>
              </Card>
            ) : pendingProviders.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-500/50" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm">No pending provider applications</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 tracking-tight">
                    <Clock className="h-5 w-5" />
                    Pending Provider Applications
                  </CardTitle>
                  <CardDescription>Review and approve healthcare provider registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingProviders.map((provider) => (
                        <TableRow key={provider.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={provider.photo_url} />
                                <AvatarFallback>
                                  {provider.first_name?.[0]}{provider.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {provider.first_name} {provider.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">{provider.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{provider.specialty || 'Not specified'}</TableCell>
                          <TableCell>{provider.experience ? `${provider.experience} years` : 'N/A'}</TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(provider.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedProvider(provider)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'providers':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 tracking-tight">
                <Stethoscope className="h-5 w-5" />
                All Healthcare Providers
              </CardTitle>
              <CardDescription>View all registered healthcare professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={provider.photo_url} />
                            <AvatarFallback>
                              {provider.first_name?.[0]}{provider.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {provider.first_name} {provider.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{provider.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{provider.specialty || 'Not specified'}</TableCell>
                      <TableCell>{getStatusBadge(provider.approval_status)}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(provider.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'users':
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 tracking-tight">
                <Users className="h-5 w-5" />
                All Users
              </CardTitle>
              <CardDescription>View all registered patients and users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.photo_url} />
                            <AvatarFallback>
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.approval_status)}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'analytics':
        return <AdminAnalytics />;
      case 'content':
        return <ContentManagement />;
      case 'bulk':
        return <BulkOperations />;
      case 'user-mgmt':
        return <UserManagement />;
      case 'blood-donors':
        return <BloodDonorManagement />;
      case 'documents':
        return <DocumentReview />;
      case 'export':
        return <DataExport />;
      case 'hospitals':
        return <HospitalManagement />;
      case 'add-provider':
        return <AddProviderForm />;
      case 'provider-services':
        return <ProviderServiceManagement />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="md:ml-64 p-6 pt-16 md:pt-6 space-y-6">
          {/* Skeleton header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>
          {/* Skeleton KPI cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          {/* Skeleton chart */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 rounded-xl lg:col-span-2" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        pendingCount={pendingProviders.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground">Admin</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{tabLabels[activeTab] || 'Dashboard'}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  className="h-8 w-48 pl-8 text-xs bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
                />
              </div>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Action Confirmation Dialog */}
      <AlertDialog
        open={actionDialog.open}
        onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'approve' ? 'Approve Provider' : 'Reject Provider'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionDialog.action} {actionDialog.provider?.first_name} {actionDialog.provider?.last_name}'s application?
              {actionDialog.action === 'approve'
                ? ' They will be able to access the provider dashboard.'
                : ' They will be notified of the rejection.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => actionDialog.provider && handleProviderAction(actionDialog.provider.id, actionDialog.action)}
              className={actionDialog.action === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
