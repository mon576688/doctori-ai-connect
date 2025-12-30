import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Clock, DollarSign, Package } from 'lucide-react';

interface Service {
  id: string;
  service_name: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  is_active: boolean;
  category_id: string;
  category?: { name: string };
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface ServiceManagementProps {
  providerId: string;
  isAdmin?: boolean;
}

export function ServiceManagement({ providerId, isAdmin = false }: ServiceManagementProps) {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    price: '',
    duration_minutes: '30',
    category_id: '',
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [providerId]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('provider_services')
      .select(`
        *,
        category:service_categories(name)
      `)
      .eq('provider_id', providerId)
      .order('service_name');

    if (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive"
      });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      description: '',
      price: '',
      duration_minutes: '30',
      category_id: categories[0]?.id || '',
      is_active: true
    });
    setEditingService(null);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name,
      description: service.description || '',
      price: service.price?.toString() || '',
      duration_minutes: service.duration_minutes?.toString() || '30',
      category_id: service.category_id,
      is_active: service.is_active
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.service_name.trim()) {
      toast({
        title: "Error",
        description: "Service name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category_id) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    const serviceData = {
      provider_id: providerId,
      service_name: formData.service_name.trim(),
      description: formData.description.trim() || null,
      price: formData.price ? parseFloat(formData.price) : null,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : 30,
      category_id: formData.category_id,
      is_active: formData.is_active
    };

    let error;
    if (editingService) {
      const { error: updateError } = await supabase
        .from('provider_services')
        .update(serviceData)
        .eq('id', editingService.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('provider_services')
        .insert(serviceData);
      error = insertError;
    }

    if (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: editingService ? "Service updated" : "Service added"
      });
      setDialogOpen(false);
      resetForm();
      fetchServices();
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase
      .from('provider_services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Service deleted"
      });
      fetchServices();
    }
  };

  const toggleActive = async (service: Service) => {
    const { error } = await supabase
      .from('provider_services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive"
      });
    } else {
      fetchServices();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading services...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Services
            </CardTitle>
            <CardDescription>
              Manage the services you offer to patients
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details for your service
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service_name">Service Name *</Label>
                  <Input
                    id="service_name"
                    value={formData.service_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
                    placeholder="e.g., General Consultation"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this service..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (৳)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (mins)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                      placeholder="30"
                      min="5"
                      max="240"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingService ? 'Update' : 'Add'} Service
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No services yet</h3>
            <p className="text-muted-foreground">
              Add your first service to let patients know what you offer
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  service.is_active ? 'bg-card' : 'bg-muted/50 opacity-70'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{service.service_name}</h4>
                    {!service.is_active && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {service.category?.name && (
                      <Badge variant="outline">{service.category.name}</Badge>
                    )}
                    {service.price !== null && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ৳{service.price}
                      </span>
                    )}
                    {service.duration_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.duration_minutes} mins
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={service.is_active}
                    onCheckedChange={() => toggleActive(service)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
