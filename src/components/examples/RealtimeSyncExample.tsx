import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { useRealtimeReminders } from '@/hooks/useRealtimeReminders';
import { usePresence } from '@/hooks/usePresence';
import { useBroadcast } from '@/hooks/useBroadcast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, Bell, Calendar, Radio } from 'lucide-react';
import { offlineQueue } from '@/lib/offlineQueue';

/**
 * Example component demonstrating real-time sync features
 * 
 * This component shows how to:
 * 1. Use real-time hooks for appointments and reminders
 * 2. Track online users with presence
 * 3. Broadcast events
 * 4. Handle offline operations
 */
export const RealtimeSyncExample = () => {
  // Real-time data hooks
  const { appointments, loading: aptLoading } = useRealtimeAppointments('patient');
  const { reminders, loading: remLoading } = useRealtimeReminders();
  
  // Presence - see who's online
  const { onlineUsers } = usePresence('example-room');
  
  // Broadcast - send real-time events
  const { broadcast } = useBroadcast(
    'example-channel',
    (message) => {
      if (message.event === 'user-action') {
        toast.info(`User performed action: ${message.payload.action}`);
      }
    }
  );

  const handleBroadcast = () => {
    broadcast('user-action', { action: 'button-clicked' });
    toast.success('Event broadcasted to all connected users');
  };

  const handleOfflineAction = () => {
    // Simulate offline operation
    offlineQueue.add({
      type: 'insert',
      table: 'reminders',
      data: {
        user_id: 'current-user-id',
        title: 'Test Reminder',
        reminder_time: new Date().toISOString(),
      }
    });
    toast.info('Action queued for offline sync');
  };

  const userCount = Object.keys(onlineUsers).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Real-Time Sync Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates real-time synchronization across devices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Real-Time Appointments
            </CardTitle>
            <CardDescription>
              Updates automatically across all devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aptLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You have {appointments.length} appointment(s)
                </p>
                {appointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 bg-secondary rounded-lg text-sm"
                  >
                    <p className="font-medium">{apt.appointment_type}</p>
                    <p className="text-muted-foreground">
                      {new Date(apt.appointment_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Real-Time Reminders
            </CardTitle>
            <CardDescription>
              Synced across web and mobile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {remLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You have {reminders.length} reminder(s)
                </p>
                {reminders.slice(0, 3).map((reminder) => (
                  <div
                    key={reminder.id}
                    className="p-3 bg-secondary rounded-lg text-sm"
                  >
                    <p className="font-medium">{reminder.title}</p>
                    <p className="text-muted-foreground">
                      {new Date(reminder.reminder_time).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Online Users (Presence) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Online Users (Presence)
            </CardTitle>
            <CardDescription>
              See who's currently active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {userCount} {userCount === 1 ? 'user' : 'users'} online
              </Badge>
              <p className="text-sm text-muted-foreground">
                Open this page on another device to see presence tracking in action
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Broadcast Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Broadcast Events
            </CardTitle>
            <CardDescription>
              Send real-time events to all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleBroadcast} className="w-full">
              Broadcast Event
            </Button>
            <Button
              onClick={handleOfflineAction}
              variant="outline"
              className="w-full"
            >
              Test Offline Queue
            </Button>
            <p className="text-xs text-muted-foreground">
              Open browser console to see real-time events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test Real-Time Sync</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Cross-Device Testing:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Open this app on your web browser</li>
              <li>Open the same app on your mobile device</li>
              <li>Create an appointment on web → See it appear on mobile instantly</li>
              <li>Add a reminder on mobile → Watch it sync to web</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Offline Testing:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Turn off your internet connection</li>
              <li>Click "Test Offline Queue" button</li>
              <li>Turn internet back on</li>
              <li>Watch the SyncStatus component sync your changes</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Presence Testing:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Open this page in multiple browser tabs</li>
              <li>Watch the online user count increase</li>
              <li>Close tabs and see the count decrease</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
