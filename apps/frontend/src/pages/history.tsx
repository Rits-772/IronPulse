import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useWorkouts, useDeleteWorkout } from "@/hooks/use-db-data";
import { Calendar, Dumbbell, Filter, Flame, Trash2, Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function History() {
  const { data: workouts, isLoading } = useWorkouts();
  const deleteWorkout = useDeleteWorkout();
  const { toast } = useToast();

  const [selectedExercise, setSelectedExercise] = useState("ALL");
  const [dateRange, setDateRange] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueExercises = useMemo(() => {
    if (!workouts) return [];
    const set = new Set<string>();
    workouts.forEach(w => w.exercises?.forEach((ex: any) => {
      if (ex.name) set.add(ex.name);
    }));
    return Array.from(set).sort();
  }, [workouts]);

  const filteredWorkouts = useMemo(() => {
    if (!workouts) return [];
    let list = [...workouts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(w => 
        w.name.toLowerCase().includes(q) || 
        w.exercises?.some((ex: any) => ex.name?.toLowerCase().includes(q))
      );
    }

    if (selectedExercise !== "ALL") {
      list = list.filter(w => 
        w.exercises?.some((ex: any) => ex.name === selectedExercise)
      );
    }

    if (dateRange !== "ALL") {
      const now = new Date();
      list = list.filter(w => {
        const d = new Date(w.date);
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        if (dateRange === "7D") return diffDays <= 7;
        if (dateRange === "30D") return diffDays <= 30;
        if (dateRange === "90D") return diffDays <= 90;
        return true;
      });
    }

    return list;
  }, [workouts, searchQuery, selectedExercise, dateRange]);

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
        <div className="flex flex-wrap gap-3 items-center bg-card/60 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-primary font-mono font-bold text-xs uppercase tracking-wider mr-2">
            <Filter className="w-4 h-4" /> FILTERS:
          </div>

          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search session name or exercise..."
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40"
            />
          </div>

          <select 
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Movement Vectors</option>
            {uniqueExercises.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Time</option>
            <option value="7D">Past 7 Days</option>
            <option value="30D">Past 30 Days</option>
            <option value="90D">Past 90 Days</option>
          </select>

          {(searchQuery || selectedExercise !== "ALL" || dateRange !== "ALL") && (
            <button
              onClick={() => { setSearchQuery(""); setSelectedExercise("ALL"); setDateRange("ALL"); }}
              className="text-[10px] font-mono font-bold text-muted-foreground hover:text-white uppercase tracking-wider px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           Array(6).fill(0).map((_, i) => (
             <div key={i} className="h-64 bg-card border border-white/5 rounded-xl animate-pulse"></div>
           ))
        ) : filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((workout, index) => (
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
              Your mission archive has no matching sessions. Try adjusting your filter parameters or start a new workout.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
