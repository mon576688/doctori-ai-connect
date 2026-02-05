import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Trash2, Calendar, Clock, Pill, Stethoscope, Heart, Droplets, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';

interface Reminder {
  id: number;
  title: string;
  notes: string | null;
  reminder_time: string;
  repeat_interval: string | null;
}

const REMINDER_TYPES = [
  { value: 'medicine', label: 'Medicine', icon: Pill, color: 'text-blue-500' },
  { value: 'appointment', label: 'Doctor Appointment', icon: Stethoscope, color: 'text-green-500' },
  { value: 'checkup', label: 'Health Checkup', icon: Heart, color: 'text-red-500' },
  { value: 'water', label: 'Drink Water', icon: Droplets, color: 'text-cyan-500' },
  { value: 'exercise', label: 'Exercise', icon: Activity, color: 'text-orange-500' },
  { value: 'other', label: 'Other', icon: Bell, color: 'text-purple-500' },
];

const REPEAT_OPTIONS = [
  { value: 'none', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderType, setReminderType] = useState('medicine');
  const [repeatInterval, setRepeatInterval] = useState('none');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user?.id)
        .order('reminder_time', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reminders',
        variant: 'destructive'
      });
    }
  };

  const createReminder = async () => {
    if (!title || !reminderTime) {
      toast({
        title: 'Missing Information',
        description: 'Please provide title and time for the reminder',
        variant: 'destructive'
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to create reminders',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reminders')
        .insert({
          user_id: user.id,
          title: title.trim(),
          notes: notes.trim() || null,
          reminder_time: reminderTime,
          repeat_interval: repeatInterval !== 'none' ? repeatInterval : null
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Reminder created successfully'
      });

      setTitle('');
      setNotes('');
      setReminderTime('');
      setReminderType('medicine');
      setRepeatInterval('none');
      fetchReminders();
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create reminder',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (id: number) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Reminder deleted successfully'
      });

      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete reminder',
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4">
        <SEO 
          title={PAGE_SEO.reminders.title}
          description={PAGE_SEO.reminders.description}
          canonicalPath={PAGE_SEO.reminders.canonicalPath}
        />
        <div className="container max-w-4xl mx-auto text-center">
          <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Health Reminders</h1>
          <p className="text-muted-foreground mb-8">Please login to manage your health reminders</p>
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <SEO 
        title={PAGE_SEO.reminders.title}
        description={PAGE_SEO.reminders.description}
        canonicalPath={PAGE_SEO.reminders.canonicalPath}
      />
      <div className="container max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary p-4 rounded-full">
              <Bell className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Health Reminders</h1>
          <p className="text-xl text-muted-foreground">
            Set reminders for medications, appointments, and health routines
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Reminder Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Create New Reminder
              </CardTitle>
              <CardDescription>Set up a health reminder</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Reminder Type *</Label>
                <Select value={reminderType} onValueChange={setReminderType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REMINDER_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className={`h-4 w-4 ${type.color}`} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Reminder Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Take morning medication"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTime">Date & Time *</Label>
                <Input
                  id="reminderTime"
                  type="datetime-local"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Repeat</Label>
                <Select value={repeatInterval} onValueChange={setRepeatInterval}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select repeat interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPEAT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional details about this reminder..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
              </div>

              <Button onClick={createReminder} disabled={loading} className="w-full" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                {loading ? 'Creating...' : 'Create Reminder'}
              </Button>
            </CardContent>
          </Card>

          {/* Reminders List */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Your Reminders
                </CardTitle>
                <CardDescription>
                  {reminders.length} active reminder{reminders.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reminders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reminders yet. Create your first one!</p>
                  </div>
                ) : (
                  reminders.map((reminder) => (
                    <Card key={reminder.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{reminder.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Clock className="h-4 w-4" />
                              {format(new Date(reminder.reminder_time), 'PPP p')}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {reminder.repeat_interval && (
                                <Badge variant="secondary" className="text-xs">
                                  Repeats {reminder.repeat_interval}
                                </Badge>
                              )}
                            </div>
                            {reminder.notes && (
                              <p className="text-sm text-muted-foreground">{reminder.notes}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteReminder(reminder.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
