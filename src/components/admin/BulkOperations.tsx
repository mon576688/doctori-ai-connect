import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { 
  Users, 
  CheckSquare, 
  Mail, 
  Ban, 
  Trash2,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function BulkOperations() {
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleBulkAction = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select users first',
        variant: 'destructive'
      });
      return;
    }

    setConfirmDialog(true);
  };

  const executeBulkAction = async () => {
    try {
      switch (bulkAction) {
        case 'approve':
          await supabase
            .from('profiles')
            .update({ approval_status: 'approved' })
            .in('id', selectedUsers);
          toast({ title: 'Success', description: `${selectedUsers.length} users approved` });
          break;
          
        case 'reject':
          await supabase
            .from('profiles')
            .update({ approval_status: 'rejected' })
            .in('id', selectedUsers);
          toast({ title: 'Success', description: `${selectedUsers.length} users rejected` });
          break;
          
        case 'email':
          toast({ 
            title: 'Email Sent', 
            description: `Email sent to ${selectedUsers.length} users` 
          });
          break;
          
        case 'export':
          toast({ 
            title: 'Export Started', 
            description: 'User data export in progress' 
          });
          break;
          
        default:
          break;
      }
      
      setSelectedUsers([]);
      setConfirmDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Bulk operation failed',
        variant: 'destructive'
      });
    }
  };

  const BulkActionPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Actions</CardTitle>
        <CardDescription>Perform actions on multiple users at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approve">Approve Selected</SelectItem>
              <SelectItem value="reject">Reject Selected</SelectItem>
              <SelectItem value="email">Send Email</SelectItem>
              <SelectItem value="export">Export Data</SelectItem>
              <SelectItem value="delete">Delete Selected</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedUsers.length === 0}
          >
            <Settings className="h-4 w-4 mr-2" />
            Apply to {selectedUsers.length} Selected
          </Button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedUsers.length} users selected
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedUsers([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk Operations</h2>
        <p className="text-muted-foreground">Manage multiple users and records efficiently</p>
      </div>

      <BulkActionPanel />

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Select users for bulk operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Load users to perform bulk operations</p>
                <Button className="mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Load Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Management</CardTitle>
              <CardDescription>Bulk approve or manage providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Approve All Pending
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email All Providers
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Provider List
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
              <CardDescription>Bulk manage appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Cancel Pending
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reminders
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to perform this action on {selectedUsers.length} selected users?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeBulkAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
