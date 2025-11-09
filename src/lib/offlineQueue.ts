import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QueuedOperation {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

class OfflineQueue {
  private queue: QueuedOperation[] = [];
  private processing = false;
  private storageKey = 'offline_queue';

  constructor() {
    this.loadFromStorage();
    this.setupOnlineListener();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      console.log('Connection restored, processing queue...');
      this.processQueue();
    });
  }

  add(operation: Omit<QueuedOperation, 'id' | 'timestamp'>) {
    const op: QueuedOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this.queue.push(op);
    this.saveToStorage();
    console.log('Operation added to queue:', op);
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    toast.info(`Syncing ${this.queue.length} operations...`);

    let successCount = 0;
    let errorCount = 0;

    while (this.queue.length > 0) {
      const operation = this.queue[0];
      try {
        await this.executeOperation(operation);
        this.queue.shift();
        successCount++;
        this.saveToStorage();
      } catch (error) {
        console.error('Failed to sync operation:', error);
        errorCount++;
        // Stop processing on error to maintain order
        break;
      }
    }

    this.processing = false;

    if (successCount > 0) {
      toast.success(`Synced ${successCount} operations`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to sync ${errorCount} operations`);
    }
  }

  private async executeOperation(op: QueuedOperation) {
    console.log('Executing operation:', op);

    if (op.type === 'insert') {
      const { error } = await supabase.from(op.table as any).insert(op.data);
      if (error) throw error;
    } else if (op.type === 'update') {
      const { error } = await supabase
        .from(op.table as any)
        .update(op.data)
        .eq('id', op.data.id);
      if (error) throw error;
    } else if (op.type === 'delete') {
      const { error } = await supabase
        .from(op.table as any)
        .delete()
        .eq('id', op.data.id);
      if (error) throw error;
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }

  clear() {
    this.queue = [];
    this.saveToStorage();
  }
}

export const offlineQueue = new OfflineQueue();
