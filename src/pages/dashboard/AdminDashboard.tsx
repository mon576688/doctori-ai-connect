import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  FileText
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

export default function AdminDashboard() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    provider: Provider | null;
  }>({ open: false, action: 'approve', provider: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch all user roles from user_roles table
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Create a map of user_id to primary role
      const roleMap = new Map<string, string>();
      rolesData?.forEach(({ user_id, role }) => {
        const currentRole = roleMap.get(user_id);
        // Priority: admin > provider > user
        if (!currentRole || 
            (role === 'admin') ||
            (role === 'provider' && currentRole === 'user')) {
          roleMap.set(user_id, role);
        }
      });

      // Separate users and providers based on role from user_roles table
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

      setUsers(regularUsers);
      setProviders(allProviders);
      setPendingProviders(pending);
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
    const variants: Record<string, { variant: any; icon: any }> = {
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

  const StatsCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

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
            <h3 className="text-2xl font-bold">
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, providers, and system settings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={users.length}
          icon={Users}
          description="Registered patients"
        />
        <StatsCard
          title="Total Providers"
          value={providers.length}
          icon={Stethoscope}
          description="Healthcare professionals"
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingProviders.length}
          icon={Clock}
          description="Awaiting review"
        />
        <StatsCard
          title="Active Providers"
          value={providers.filter(p => p.approval_status === 'approved').length}
          icon={CheckCircle}
          description="Approved professionals"
        />
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Approvals ({pendingProviders.length})
          </TabsTrigger>
          <TabsTrigger value="providers">
            All Providers ({providers.length})
          </TabsTrigger>
          <TabsTrigger value="users">
            Users ({users.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {selectedProvider ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Provider Details</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedProvider(null)}>
                    Back to List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ProviderDetailView provider={selectedProvider} />
              </CardContent>
            </Card>
          ) : pendingProviders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No pending provider applications
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Pending Provider Applications</CardTitle>
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
                        <TableCell>{provider.experience ? `${provider.experience} years` : 'N/A'}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(provider.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedProvider(provider)}
                            >
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Healthcare Providers</CardTitle>
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
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>View all patient accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
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
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'approve' ? 'Approve Provider' : 'Reject Application'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'approve'
                ? `Are you sure you want to approve ${actionDialog.provider?.first_name} ${actionDialog.provider?.last_name} as a healthcare provider?`
                : `Are you sure you want to reject ${actionDialog.provider?.first_name} ${actionDialog.provider?.last_name}'s application?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => actionDialog.provider && handleProviderAction(actionDialog.provider.id, actionDialog.action)}
              className={actionDialog.action === 'reject' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
