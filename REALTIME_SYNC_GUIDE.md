# Real-Time Synchronization Guide

This guide explains how to use the real-time synchronization features implemented across web and mobile apps.

## 🚀 Features Implemented

### Phase 1: Database Real-Time Configuration ✅
- All critical tables enabled for real-time updates
- Tables: appointments, chat_sessions, chat_messages, availability_dates, profiles, reminders
- REPLICA IDENTITY FULL enabled for complete row data

### Phase 2: Real-Time Hooks ✅
Centralized hooks for automatic data synchronization:
- `useRealtimeAppointments` - Sync appointments
- `useRealtimeChatSessions` - Sync chat sessions
- `useRealtimeChatMessages` - Sync messages
- `useRealtimeProfile` - Sync user profile
- `useRealtimeReminders` - Sync reminders
- `useRealtimeAvailability` - Sync provider availability

### Phase 3: Optimistic Updates ✅
Built into all hooks with automatic rollback on error

### Phase 4: Cross-Platform State ✅
- `usePresence` - Track who's online
- `useBroadcast` - Send real-time events

### Phase 5: Offline Support ✅
- `offlineQueue` - Queue operations when offline
- Automatic sync when connection restored

### Phase 6: Conflict Resolution ✅
- Last-Write-Wins for most data
- Server-Always-Wins for appointments

### Phase 7: Sync Status UI ✅
- `SyncStatus` component shows sync state
- Visual feedback for offline/syncing/synced

---

## 📖 Usage Examples

### 1. Using Real-Time Appointments

```tsx
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';

function AppointmentsList() {
  const { appointments, loading } = useRealtimeAppointments('patient');
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </div>
  );
}
```

**Key Features:**
- ✅ Auto-updates when appointments change on any device
- ✅ Shows toast notifications for new appointments
- ✅ Handles INSERT, UPDATE, DELETE events
- ✅ Works for both patients and providers

### 2. Using Real-Time Chat

```tsx
import { useRealtimeChatMessages } from '@/hooks/useRealtimeChatMessages';

function ChatInterface({ sessionId }: { sessionId: string }) {
  const { messages, loading } = useRealtimeChatMessages(sessionId);
  
  return (
    <div>
      {messages.map(msg => (
        <Message key={msg.id} content={msg.content} role={msg.role} />
      ))}
    </div>
  );
}
```

**Key Features:**
- ✅ New messages appear instantly on all devices
- ✅ Automatic scrolling to latest message
- ✅ Works across web and mobile

### 3. Offline Support

```tsx
import { offlineQueue } from '@/lib/offlineQueue';

async function createReminder(reminderData) {
  // Check if online
  if (!navigator.onLine) {
    // Queue for later sync
    offlineQueue.add({
      type: 'insert',
      table: 'reminders',
      data: reminderData
    });
    toast.info('Reminder saved offline. Will sync when online.');
    return;
  }
  
  // Normal online flow
  const { error } = await supabase
    .from('reminders')
    .insert(reminderData);
  
  if (error) throw error;
}
```

**Key Features:**
- ✅ Works offline, syncs when online
- ✅ Maintains operation order
- ✅ Shows sync progress in UI
- ✅ Automatic retry on connection restore

### 4. Presence Tracking (Who's Online)

```tsx
import { usePresence } from '@/hooks/usePresence';

function OnlineUsers() {
  const { onlineUsers } = usePresence('main-lobby');
  
  const userCount = Object.keys(onlineUsers).length;
  
  return (
    <Badge>
      {userCount} users online
    </Badge>
  );
}
```

**Use Cases:**
- Show active users in chat rooms
- Display "Doctor is online" status
- Waiting room functionality

### 5. Broadcasting Events (Typing Indicators)

```tsx
import { useBroadcast } from '@/hooks/useBroadcast';

function ChatInput({ roomId }: { roomId: string }) {
  const { broadcast } = useBroadcast(
    `chat-${roomId}`,
    (message) => {
      if (message.event === 'typing') {
        console.log('User is typing:', message.payload);
      }
    }
  );
  
  const handleTyping = () => {
    broadcast('typing', { isTyping: true });
  };
  
  return <input onChange={handleTyping} />;
}
```

**Use Cases:**
- Typing indicators
- Cursor positions
- Live form updates
- Collaborative editing

---

## 🔧 Mobile App Integration

### React Native Setup

```javascript
// In your mobile app
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabase = createClient(
  'https://lhamshhjmmruybdcfivr.supabase.co',
  'your-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
```

### Background Sync (React Native)

```javascript
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

BackgroundFetch.registerTaskAsync('sync-data', {
  minimumInterval: 15 * 60, // 15 minutes
  stopOnTerminate: false,
  startOnBoot: true,
});

TaskManager.defineTask('sync-data', async () => {
  await offlineQueue.processQueue();
  return BackgroundFetch.Result.NewData;
});
```

### Deep Linking for Notifications

```javascript
import * as Notifications from 'expo-notifications';

Notifications.addNotificationResponseReceivedListener((response) => {
  const { link } = response.notification.request.content.data;
  if (link) {
    navigation.navigate(link);
  }
});
```

---

## 🧪 Testing Scenarios

### Test Real-Time Sync
1. ✅ Open app on web browser
2. ✅ Open app on mobile device
3. ✅ Book appointment on web → Should appear on mobile instantly
4. ✅ Update profile on mobile → Should update on web
5. ✅ Create reminder on web → Should sync to mobile

### Test Offline Mode
1. ✅ Turn off WiFi on mobile
2. ✅ Create/update/delete data
3. ✅ Turn WiFi back on
4. ✅ Verify data syncs automatically
5. ✅ Check SyncStatus component shows progress

### Test Conflict Resolution
1. ✅ Edit same appointment on both devices
2. ✅ Verify server version wins (last write)
3. ✅ Check user sees notification about conflict

### Test Race Conditions
1. ✅ Try to book same time slot from 2 devices
2. ✅ Verify only one succeeds
3. ✅ Other device shows "slot no longer available"

---

## ⚡ Performance Optimization

### 1. Channel Cleanup
All hooks automatically clean up channels on unmount to prevent memory leaks.

### 2. Selective Filtering
Each hook uses RLS-aware filters to only receive relevant data:
```typescript
filter: `user_id=eq.${user.id}`
```

### 3. Pagination
For large datasets, implement pagination:
```typescript
const { data } = await supabase
  .from('chat_messages')
  .select('*')
  .eq('session_id', sessionId)
  .order('created_at', { ascending: false })
  .range(0, 49); // Load 50 at a time
```

### 4. Debouncing
For typing indicators and frequent updates:
```typescript
const debouncedBroadcast = debounce((data) => {
  broadcast('typing', data);
}, 300);
```

---

## 🔐 Security

### Row Level Security (RLS)
All real-time subscriptions respect RLS policies:
- Users only receive updates for their own data
- Providers only see their appointments
- Admin-only data filtered properly

### Authentication
All hooks check user authentication:
```typescript
if (!user) {
  setData([]);
  return;
}
```

---

## 🐛 Debugging

### Enable Verbose Logging
```typescript
// In supabase client
const supabase = createClient(url, key, {
  realtime: {
    log_level: 'debug'
  }
});
```

### Check Channel Status
```typescript
channel.subscribe((status) => {
  console.log('Channel status:', status);
  // SUBSCRIBED, TIMED_OUT, CLOSED, CHANNEL_ERROR
});
```

### Monitor Queue Size
```typescript
console.log('Queue size:', offlineQueue.getQueueSize());
console.log('Processing:', offlineQueue.isProcessing());
```

---

## 📱 Platform Support

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| Real-time Updates | ✅ | ✅ | ✅ |
| Offline Queue | ✅ | ✅ | ✅ |
| Presence | ✅ | ✅ | ✅ |
| Broadcast | ✅ | ✅ | ✅ |
| Background Sync | ❌ | ✅ | ✅ |
| Push Notifications | ❌ | ✅ | ✅ |

---

## 🎯 Best Practices

1. **Always Clean Up Channels**
   ```typescript
   useEffect(() => {
     const channel = supabase.channel('...');
     // ... setup
     return () => supabase.removeChannel(channel);
   }, []);
   ```

2. **Handle Loading States**
   ```typescript
   if (loading) return <Skeleton />;
   ```

3. **Show User Feedback**
   ```typescript
   toast.success('Synced successfully');
   ```

4. **Implement Error Boundaries**
   ```tsx
   <ErrorBoundary>
     <YourComponent />
   </ErrorBoundary>
   ```

5. **Use Optimistic Updates**
   Update UI immediately, rollback on error

---

## 📚 Additional Resources

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Offline-First Apps](https://supabase.com/blog/offline-first-apps)

---

## 🆘 Common Issues

### Issue: Real-time not working
**Solution:** Check that table is in `supabase_realtime` publication
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE your_table;
```

### Issue: Not receiving updates
**Solution:** Verify RLS policies allow SELECT for authenticated users

### Issue: Duplicate messages
**Solution:** Ensure channel cleanup in useEffect return

### Issue: Queue not processing
**Solution:** Check network connectivity and browser console for errors
