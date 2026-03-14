import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useWorkouts, useDeleteWorkout } from "@/hooks/use-db-data";
import { Calendar, Dumbbell, Filter, Flame, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function History() {
  const { data: workouts, isLoading } = useWorkouts();
  const deleteWorkout = useDeleteWorkout();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to purge this record?")) return;
    try {
      await deleteWorkout.mutateAsync(id);
      toast({ title: "Record Purged", description: "Workout session deleted from history." });
    } catch (err: any) {
      toast({ title: "Purge Failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold tracking-widest uppercase mb-4">Training Archive</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-card border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm uppercase tracking-wider mr-4">
            <Filter className="w-4 h-4" /> Filters
          </div>
          <select className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary">
            <option>All Exercises</option>
            <option>Squat</option>
            <option>Bench Press</option>
            <option>Deadlift</option>
          </select>
          <select className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           Array(6).fill(0).map((_, i) => (
             <div key={i} className="h-64 bg-card border border-white/5 rounded-xl animate-pulse"></div>
           ))
        ) : (
          workouts?.map((workout, index) => (
            <motion.div 
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-white/5 rounded-xl p-6 hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold uppercase tracking-wider">{workout.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-bold uppercase tracking-widest">{workout.date}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(workout.id)}
                  disabled={deleteWorkout.isPending}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                >
                  {deleteWorkout.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {workout.exercises.slice(0, 3).map((ex: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{ex.name}</span>
                    <span className="text-muted-foreground font-mono font-bold">{ex.sets}x{ex.reps} @ {ex.weight}</span>
                  </div>
                ))}
                {workout.exercises.length > 3 && (
                  <div className="text-xs text-primary font-bold uppercase tracking-wider mt-2">
                    + {workout.exercises.length - 3} more
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Volume</div>
                  <div className="font-display font-bold text-xl">{workout.volume.toLocaleString()} <span className="text-xs text-muted-foreground">LBS</span></div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Duration</div>
                  <div className="font-display font-bold text-xl flex items-center gap-1">
                    {workout.duration} <span className="text-xs text-muted-foreground">MIN</span>
                    <Flame className="w-4 h-4 text-orange-500 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
