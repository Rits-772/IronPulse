// IronPulse Offline Storage & Mutation Queue

export interface OfflineWorkout {
  id: string;
  name: string;
  date: string;
  exercises: Array<{
    id?: string;
    name: string;
    sets: Array<{ reps: string; weight: string }>;
  }>;
  notes?: string;
  timestamp: number;
}

const STORAGE_KEY = 'ironpulse_offline_workouts';

export const offlineStorage = {
  getQueue(): OfflineWorkout[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  enqueue(workout: Omit<OfflineWorkout, 'id' | 'timestamp'>): OfflineWorkout {
    const queue = this.getQueue();
    const item: OfflineWorkout = {
      ...workout,
      id: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    queue.push(item);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to write offline workout queue:', e);
    }
    return item;
  },

  dequeue(id: string): void {
    const queue = this.getQueue().filter(item => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to update offline workout queue:', e);
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getPendingCount(): number {
    return this.getQueue().length;
  }
};
