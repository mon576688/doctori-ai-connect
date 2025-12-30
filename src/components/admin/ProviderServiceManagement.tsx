import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, Search, ArrowLeft, Stethoscope } from 'lucide-react';
import { ServiceManagement } from '@/components/provider/ServiceManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string | null;
  approval_status: string;
  provider_type: string | null;
}

export default function ProviderServiceManagement() {
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [searchQuery, statusFilter, providers]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      // Get all users who have provider role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'provider');

      if (roleError) throw roleError;

      const providerIds = roleData?.map(r => r.user_id) || [];

      if (providerIds.length === 0) {
        setProviders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, photo_url, approval_status, provider_type')
        .in('id', providerIds)
        .order('first_name');

      if (error) throw error;

      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let filtered = [...providers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.first_name?.toLowerCase().includes(query) ||
        p.last_name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.approval_status === statusFilter);
    }

    setFilteredProviders(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading providers...</div>
        </CardContent>
      </Card>
    );
  }

  if (selectedProvider) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedProvider(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Providers
          </Button>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedProvider.photo_url || undefined} />
              <AvatarFallback>
                {selectedProvider.first_name?.[0]}{selectedProvider.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">
                {selectedProvider.first_name} {selectedProvider.last_name}
              </h2>
              <p className="text-sm text-muted-foreground">{selectedProvider.email}</p>
            </div>
          </div>
        </div>

        <ServiceManagement providerId={selectedProvider.id} isAdmin={true} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Provider Services Management
        </CardTitle>
        <CardDescription>
          Manage services offered by healthcare providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Providers List */}
        {filteredProviders.length === 0 ? (
          <div className="text-center py-8">
            <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No providers found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No healthcare providers have registered yet'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={provider.photo_url || undefined} />
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
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {provider.provider_type || 'Not specified'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(provider.approval_status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Manage Services
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
