import { useState, useEffect } from 'react';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, User, Heart, Weight, Ruler, MessageSquare, FileText, Trash2, Droplets, Activity, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppointmentsList } from '@/components/AppointmentsList';
import { Inbox } from '@/components/messaging/Inbox';
import { useNavigate } from 'react-router-dom';
import MedicalRecords from '@/components/patient/MedicalRecords';

interface Reminder {
  id: number;
  title: string;
  reminder_time: string;
  repeat_interval?: string;
  notes?: string;
}

export default function UserDashboard() {
  const { profile, refetchProfile } = useRoleBasedAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    blood_group: '',
    bio: '',
    health_info: {}
  });
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [newReminder, setNewReminder] = useState({
    title: '',
    reminder_time: '',
    repeat_interval: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
        blood_group: profile.blood_group || '',
        bio: profile.bio || '',
        health_info: {}
      });
      fetchReminders();
      fetchAppointmentCount();
    }
  }, [profile]);

  const fetchAppointmentCount = async () => {
    try {
      const { count } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile?.id)
        .eq('status', 'scheduled');
      setAppointmentCount(count || 0);
    } catch (error) {
      console.error('Error fetching appointment count:', error);
    }
  };

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', profile?.id)
        .order('reminder_time', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: "Error",
        description: "Failed to load reminders",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReminder = async (id: number) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReminders(prev => prev.filter(r => r.id !== id));
      toast({ title: "Reminder deleted" });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({ title: "Error", description: "Failed to delete reminder", variant: "destructive" });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: profileData.name,
        age: profileData.age ? parseInt(profileData.age) : null,
        gender: profileData.gender as 'male' | 'female' | 'other' | null,
        weight: profileData.weight ? parseFloat(profileData.weight) : null,
        height: profileData.height ? parseFloat(profileData.height) : null,
        blood_group: profileData.blood_group as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null,
        bio: profileData.bio || null,
        health_info: profileData.health_info
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      refetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async () => {
    if (!newReminder.title || !newReminder.reminder_time) {
      toast({
        title: "Error",
        description: "Title and reminder time are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('reminders')
        .insert({
          user_id: profile?.id,
          title: newReminder.title,
          reminder_time: newReminder.reminder_time,
          repeat_interval: newReminder.repeat_interval || null,
          notes: newReminder.notes || null
        });

      if (error) throw error;

      toast({
        title: "Reminder added",
        description: "Your reminder has been created successfully.",
      });

      setNewReminder({ title: '', reminder_time: '', repeat_interval: '', notes: '' });
      setShowReminderDialog(false);
      fetchReminders();
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast({
        title: "Error",
        description: "Failed to add reminder",
        variant: "destructive"
      });
    }
  };

  const bmi = profileData.weight && profileData.height
    ? (parseFloat(profileData.weight) / Math.pow(parseFloat(profileData.height) / 100, 2)).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Welcome Card */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Welcome{profileData.name ? `, ${profileData.name}` : ''}! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your health profile and stay on top of your wellness journey
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                Upcoming: {appointmentCount}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
                <Clock className="w-3.5 h-3.5" />
                Reminders: {reminders.length}
              </Badge>
              {profileData.blood_group && (
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
                  <Droplets className="w-3.5 h-3.5" />
                  {profileData.blood_group}
                </Badge>
              )}
              {bmi && (
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
                  <Activity className="w-3.5 h-3.5" />
                  BMI: {bmi}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="prescriptions">
              <FileText className="w-4 h-4 mr-2" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="records">
              <FolderOpen className="w-4 h-4 mr-2" />
              Records
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Clock className="w-4 h-4 mr-2" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="health">
              <Heart className="w-4 h-4 mr-2" />
              Health Info
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Enter your age"
                        min="1"
                        max="120"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select 
                        value={profileData.gender} 
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blood_group">Blood Group</Label>
                      <Select 
                        value={profileData.blood_group} 
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, blood_group: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="weight"
                          type="number"
                          value={profileData.weight}
                          onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                          placeholder="Enter weight"
                          className="pl-10"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="height"
                          type="number"
                          value={profileData.height}
                          onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                          placeholder="Enter height"
                          className="pl-10"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsList viewAs="patient" />
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  My Prescriptions
                </CardTitle>
                <CardDescription>
                  View prescriptions shared by your doctors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/patient/prescriptions')} variant="outline">
                  View All Prescriptions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records">
            <MedicalRecords />
          </TabsContent>

          <TabsContent value="reminders">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Health Reminders</h2>
                  <p className="text-muted-foreground">Stay on track with your health goals</p>
                </div>
                <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reminder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Reminder</DialogTitle>
                      <DialogDescription>
                        Create a reminder to help you stay on track with your health routine
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminder-title">Title</Label>
                        <Input
                          id="reminder-title"
                          value={newReminder.title}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Take medication"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder-time">Date & Time</Label>
                        <Input
                          id="reminder-time"
                          type="datetime-local"
                          value={newReminder.reminder_time}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, reminder_time: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder-repeat">Repeat</Label>
                        <Select
                          value={newReminder.repeat_interval}
                          onValueChange={(value) => setNewReminder(prev => ({ ...prev, repeat_interval: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select repeat interval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No repeat</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder-notes">Notes</Label>
                        <Textarea
                          id="reminder-notes"
                          value={newReminder.notes}
                          onChange={(e) => setNewReminder(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Additional notes..."
                        />
                      </div>
                      <Button onClick={handleAddReminder} className="w-full">
                        Add Reminder
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {reminders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No reminders yet</h3>
                        <p className="text-muted-foreground">Create your first reminder to get started</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  reminders.map((reminder) => (
                    <Card key={reminder.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{reminder.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(reminder.reminder_time).toLocaleString()}
                            </p>
                            {reminder.repeat_interval && (
                              <Badge variant="secondary">{reminder.repeat_interval}</Badge>
                            )}
                            {reminder.notes && (
                              <p className="text-sm text-muted-foreground">{reminder.notes}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteReminder(reminder.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Health Information
                </CardTitle>
                <CardDescription>
                  Manage your health conditions, allergies, and medications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Health info management</h3>
                  <p className="text-muted-foreground">Coming soon - Advanced health tracking features</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Inbox />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
