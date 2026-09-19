import { lazy, Suspense, useEffect, useState } from "react";
import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Loader2, WifiOff, Wifi } from "lucide-react";
import { offlineStorage } from "@/lib/offline-storage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Lazy-loaded Pages for Route Code-Splitting & Rapid Initial Load
const Landing = lazy(() => import("@/pages/landing"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const LogWorkout = lazy(() => import("@/pages/log-workout"));
const Exercises = lazy(() => import("@/pages/exercises"));
const History = lazy(() => import("@/pages/history"));
const Analytics = lazy(() => import("@/pages/analytics"));
const Nutrition = lazy(() => import("@/pages/nutrition"));
const BodyMetrics = lazy(() => import("@/pages/body-metrics"));
const Planner = lazy(() => import("@/pages/planner"));
const Settings = lazy(() => import("@/pages/settings"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-xs font-display font-bold uppercase tracking-[0.3em] text-primary/80 animate-pulse">
          INITIALIZING PROTOCOL...
        </p>
      </div>
    </div>
  );
}

function OfflineSyncManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      toast({
        title: "Neural Uplink Restored",
        description: "Back online. Syncing pending offline workouts...",
        className: "border-primary bg-background text-foreground",
      });

      // Synchronize offline queue
      const queue = offlineStorage.getQueue();
      if (queue.length > 0 && user) {
        for (const item of queue) {
          try {
            // Save session
            const { data: sessionData, error: sessionError } = await supabase
              .from('workout_sessions')
              .insert({
                user_id: user.id,
                workout_name: item.name,
                workout_date: item.date,
                notes: item.notes || null,
              })
              .select()
              .single();

            if (sessionError) throw sessionError;

            // Save exercises if any
            if (item.exercises && item.exercises.length > 0) {
              const exercisesToInsert: any[] = [];
              for (const ex of item.exercises) {
                // Find or insert exercise
                let exId: string | null = null;
                const { data: existingEx } = await supabase
                  .from('exercises')
                  .select('id')
                  .eq('name', ex.name)
                  .single();

                if (existingEx) {
                  exId = existingEx.id;
                } else {
                  const { data: newEx } = await supabase
                    .from('exercises')
                    .insert({ name: ex.name, muscle_group: 'Full Body' })
                    .select('id')
                    .single();
                  if (newEx) exId = newEx.id;
                }

                if (exId) {
                  ex.sets.forEach((s) => {
                    exercisesToInsert.push({
                      session_id: sessionData.id,
                      exercise_id: exId,
                      sets: 1,
                      reps: parseInt(s.reps) || 0,
                      weight: parseFloat(s.weight) || 0,
                    });
                  });
                }
              }

              if (exercisesToInsert.length > 0) {
                await supabase.from('workout_exercises').insert(exercisesToInsert);
              }
            }

            // Remove successfully synced item from queue
            offlineStorage.dequeue(item.id);
          } catch (err) {
            console.error('Failed to sync offline item:', item, err);
          }
        }
        queryClient.invalidateQueries({ queryKey: ['workouts'] });
        queryClient.invalidateQueries({ queryKey: ['history'] });
        queryClient.invalidateQueries({ queryKey: ['progress'] });
        toast({
          title: "Offline Sync Complete",
          description: "All pending sessions safely recorded in the database.",
          className: "border-primary bg-background text-foreground",
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode Active",
        description: "Zero reception detected. Workouts will be cached locally and synced upon reconnect.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check on load
    if (navigator.onLine && offlineStorage.getPendingCount() > 0) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center gap-2 text-xs font-mono tracking-wider backdrop-blur-md shadow-lg animate-pulse">
      <WifiOff className="w-3.5 h-3.5" />
      <span>OFFLINE CACHE ACTIVE ({offlineStorage.getPendingCount()} QUEUED)</span>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {/* Protected Area */}
        <Route path="/dashboard">
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        </Route>
        <Route path="/log-workout">
          <ProtectedRoute><LogWorkout /></ProtectedRoute>
        </Route>
        <Route path="/exercises">
          <ProtectedRoute><Exercises /></ProtectedRoute>
        </Route>
        <Route path="/history">
          <ProtectedRoute><History /></ProtectedRoute>
        </Route>
        <Route path="/analytics">
          <ProtectedRoute><Analytics /></ProtectedRoute>
        </Route>
        <Route path="/body-metrics">
          <ProtectedRoute><BodyMetrics /></ProtectedRoute>
        </Route>
        <Route path="/planner">
          <ProtectedRoute><Planner /></ProtectedRoute>
        </Route>
        <Route path="/nutrition">
          <ProtectedRoute><Nutrition /></ProtectedRoute>
        </Route>
        <Route path="/settings">
          <ProtectedRoute><Settings /></ProtectedRoute>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  useEffect(() => {
    // Register Service Worker for PWA installability & offline caching
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('[SW] Registration failed:', err);
        });
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
                <OfflineSyncManager />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
