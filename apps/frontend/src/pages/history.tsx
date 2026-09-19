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
        ) : workouts && workouts.length > 0 ? (
          workouts.map((workout, index) => (
            <motion.div 
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-primary/40 transition-all group relative overflow-hidden shadow-lg"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold uppercase tracking-wider text-white group-hover:text-primary transition-colors">{workout.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">{workout.date}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(workout.id)}
                  disabled={deleteWorkout.isPending}
                  className="p-2 text-muted-foreground hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                  title="Purge Record"
                >
                  {deleteWorkout.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {workout.exercises.slice(0, 3).map((ex: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-foreground/90 font-medium">{ex.name}</span>
                    <span className="text-primary/80 font-mono font-bold">{ex.sets}x{ex.reps} @ {ex.weight} lbs</span>
                  </div>
                ))}
                {workout.exercises.length > 3 && (
                  <div className="text-[10px] text-primary font-mono font-bold uppercase tracking-wider mt-2">
                    + {workout.exercises.length - 3} additional movements
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Volume</div>
                  <div className="font-display font-black text-xl text-white">{workout.volume.toLocaleString()} <span className="text-xs text-muted-foreground font-sans">LBS</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Duration</div>
                  <div className="font-display font-black text-xl text-white flex items-center gap-1">
                    {workout.duration} <span className="text-xs text-muted-foreground font-sans">MIN</span>
                    <Flame className="w-4 h-4 text-orange-500 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full p-16 rounded-2xl bg-card/20 border border-white/5 text-center space-y-4">
            <Dumbbell className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <h3 className="text-xl font-display font-bold uppercase text-white">No Archive Sessions Found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your mission archive is currently unpopulated. Complete and commit your first session to record neural performance metrics.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
