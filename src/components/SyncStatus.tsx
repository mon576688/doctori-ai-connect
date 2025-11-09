import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, RefreshCw, Check, Wifi } from 'lucide-react';
import { offlineQueue } from '@/lib/offlineQueue';

export const SyncStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      updateQueueStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const updateQueueStatus = () => {
      setQueueSize(offlineQueue.getQueueSize());
      setIsProcessing(offlineQueue.isProcessing());
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update queue status periodically
    const interval = setInterval(updateQueueStatus, 1000);

    // Initial update
    updateQueueStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Don't show anything if online and no queue
  if (isOnline && queueSize === 0 && !isProcessing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      {!isOnline && (
        <Badge variant="destructive" className="animate-pulse">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      )}
      
      {isProcessing && (
        <Badge variant="secondary">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Syncing {queueSize} {queueSize === 1 ? 'item' : 'items'}...
        </Badge>
      )}
      
      {isOnline && !isProcessing && queueSize > 0 && (
        <Badge variant="secondary">
          <Wifi className="h-3 w-3 mr-1" />
          {queueSize} pending
        </Badge>
      )}
      
      {isOnline && !isProcessing && queueSize === 0 && (
        <Badge className="bg-green-500 text-white">
          <Check className="h-3 w-3 mr-1" />
          All synced
        </Badge>
      )}
    </div>
  );
};
