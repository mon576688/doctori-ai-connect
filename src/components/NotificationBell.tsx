import { Bell, Calendar, MessageSquare, Info, Clock, AlertTriangle, CheckCircle, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotifications, type Notification, type NotificationFilter } from '@/hooks/useNotifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

const categoryConfig: Record<string, { icon: typeof Bell; colorClass: string; label: string }> = {
  appointment: { icon: Calendar, colorClass: 'text-blue-500 bg-blue-500/10', label: 'Appointments' },
  message: { icon: MessageSquare, colorClass: 'text-emerald-500 bg-emerald-500/10', label: 'Messages' },
  system: { icon: Info, colorClass: 'text-muted-foreground bg-muted', label: 'System' },
  reminder: { icon: Clock, colorClass: 'text-orange-500 bg-orange-500/10', label: 'Reminders' },
  admin: { icon: AlertTriangle, colorClass: 'text-purple-500 bg-purple-500/10', label: 'Admin' },
};

const typeColorMap: Record<string, string> = {
  error: 'text-destructive bg-destructive/10',
  warning: 'text-orange-500 bg-orange-500/10',
  success: 'text-emerald-500 bg-emerald-500/10',
  info: '',
};

const typeIconMap: Record<string, typeof Bell> = {
  error: AlertTriangle,
  success: CheckCircle,
};

const filters: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'appointment', label: 'Appointments' },
  { value: 'message', label: 'Messages' },
  { value: 'system', label: 'System' },
  { value: 'reminder', label: 'Reminders' },
  { value: 'admin', label: 'Admin' },
];

const getNotificationIcon = (notification: Notification) => {
  if (typeIconMap[notification.type]) return typeIconMap[notification.type];
  return categoryConfig[notification.category]?.icon || Info;
};

const getNotificationColor = (notification: Notification) => {
  if (typeColorMap[notification.type]) return typeColorMap[notification.type];
  return categoryConfig[notification.category]?.colorClass || 'text-muted-foreground bg-muted';
};

export const NotificationBell = () => {
  const {
    filteredNotifications,
    unreadCount,
    activeFilter,
    setActiveFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const navigate = useNavigate();

  const [soundEnabled, setSoundEnabled] = useState(() =>
    localStorage.getItem('notification_sound') !== 'false'
  );

  useEffect(() => {
    localStorage.setItem('notification_sound', soundEnabled ? 'true' : 'false');
  }, [soundEnabled]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    deleteNotification(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-7 px-2 text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-2 border-b overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <ScrollArea className="h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No notifications
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification);
              const colorClass = getNotificationColor(notification);

              return (
                <div
                  key={notification.id}
                  className={`group flex items-start gap-3 p-3 cursor-pointer border-b border-border/50 hover:bg-accent/50 transition-colors ${
                    !notification.is_read ? 'bg-accent/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 rounded-full p-1.5 mt-0.5 ${colorClass}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-medium text-sm leading-tight truncate">{notification.title}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.is_read && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 transition-opacity"
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-[11px] text-muted-foreground/70 mt-1 block">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
