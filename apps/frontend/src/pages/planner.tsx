import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { Plus, GripVertical, Settings2, Trash2, Loader2, Search, Filter, ChevronRight, Dumbbell as DumbbellIcon, Target, ChevronUp, ChevronDown, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useRoutines, useSaveRoutine, useDeleteRoutine, useUpdateProfile, useCreatePost } from "@/hooks/use-db-data";

const EXERCISE_DATABASE = {
  "Chest": ["Barbell Bench Press", "Incline Dumbbell Press", "Cable Fly", "Dumbbell Press", "Chest Press Machine"],
  "Back": ["Deadlift", "Barbell Row", "Lat Pulldown", "Seated Row", "Pull Ups", "Face Pull"],
  "Shoulders": ["Overhead Press", "Lateral Raise", "Front Raise", "Rear Delt Fly"],
  "Legs": ["Barbell Squat", "Leg Press", "Romanian Deadlift", "Leg Extension", "Leg Curl", "Calf Raise"],
  "Arms": ["Bicep Curl", "Hammer Curl", "Tricep Pushdown", "Skull Crusher", "Dips"],
  "Core": ["Plank", "Crunch", "Leg Raise", "Russian Twist"]
};

export default function Planner() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: routines, isLoading } = useRoutines();
  const saveRoutine = useSaveRoutine();
  const deleteRoutineMutation = useDeleteRoutine();

  const [isAddingToRoutine, setIsAddingToRoutine] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addRoutine = async () => {
    try {
      await saveRoutine.mutateAsync({
        name: "New Routine",
        exercises: []
      });
      toast({ title: "New routine created" });
    } catch (err: any) {
      toast({ title: "Failed to create routine", description: err.message, variant: "destructive" });
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      await deleteRoutineMutation.mutateAsync(id);
      toast({ title: "Routine deleted" });
    } catch (err: any) {
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" });
    }
  };

  const addSpecificExercise = async (routine: any, exerciseName: string) => {
    try {
      await saveRoutine.mutateAsync({
        ...routine,
        exercises: [...routine.exercises, exerciseName]
      });
      toast({ title: "Exercise added", description: `${exerciseName} added to ${routine.name}` });
      setIsAddingToRoutine(null);
    } catch (err: any) {
      toast({ title: "Failed to add", description: err.message, variant: "destructive" });
    }
  };

  const addExerciseToRoutine = (routineId: string) => {
    setIsAddingToRoutine(routineId);
    setSelectedCategory(Object.keys(EXERCISE_DATABASE)[0]);
  };

  const removeExerciseFromRoutine = async (routine: any, exerciseIndex: number) => {
    try {
      await saveRoutine.mutateAsync({
        ...routine,
        exercises: routine.exercises.filter((_: any, i: number) => i !== exerciseIndex)
      });
    } catch (err: any) {
      toast({ title: "Failed to remove exercise", description: err.message, variant: "destructive" });
    }
  };

  const reorderExercise = async (routine: any, index: number, direction: 'up' | 'down') => {
    const newExercises = [...routine.exercises];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newExercises.length) return;
    
    [newExercises[index], newExercises[newIndex]] = [newExercises[newIndex], newExercises[index]];
    
    try {
      await saveRoutine.mutateAsync({
        ...routine,
        exercises: newExercises
      });
    } catch (err: any) {
      toast({ title: "Reorder failed", variant: "destructive" });
    }
  };

  const createPostMutation = useCreatePost();
  const shareRoutine = async (routine: any) => {
    try {
      await createPostMutation.mutateAsync({
        content: `Sharing my training architecture: ${routine.name}. Targeted for operational efficiency.`,
        type: 'ROUTINE',
        routine_id: routine.id
      });
      toast({ 
        title: "Sync Established", 
        description: `${routine.name} published to The Grid.`,
        className: "border-primary bg-background text-foreground"
      });
    } catch (err: any) {
      toast({ title: "Sync Error", description: err.message, variant: "destructive" });
    }
  };
  const updateRoutineName = async (routine: any, newName: string) => {
    if (routine.name === newName) return;
    try {
      await saveRoutine.mutateAsync({
        ...routine,
        name: newName
      });
    } catch (err: any) {
      // Quiet fail
    }
  };

  const initializeWorkout = (routine: any) => {
    if (routine.exercises.length === 0) {
      toast({ title: "Routine empty", description: "Designate exercises before initialization.", variant: "destructive" });
      return;
    }
    // Pass routine name and exercises via query params (limited but works for simple case)
    // In a real app we'd use a more robust state management or routine_id param
    const exercisesParam = encodeURIComponent(JSON.stringify(routine.exercises.map((e: string) => ({ 
      id: Math.random().toString(), 
      name: e, 
      sets: [{ reps: "", weight: "" }] 
    }))));
    const nameParam = encodeURIComponent(routine.name);
    setLocation(`/log-workout?exercises=${exercisesParam}&name=${nameParam}`);
  };

  return (
    <DashboardLayout>
      {/* Exercise Selection Modal Overlay */}
      {isAddingToRoutine && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/90 backdrop-blur-xl border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-white/5 bg-secondary/30 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-primary text-glow">Select Exercise</h2>
                <p className="text-xs text-muted-foreground uppercase font-sans tracking-wider">Reinforce your routine architecture</p>
              </div>
              <button onClick={() => setIsAddingToRoutine(null)} className="text-muted-foreground hover:text-white transition-colors">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="p-4 bg-background/50 border-b border-white/5 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Scan database..." 
                  className="w-full bg-secondary/50 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden min-h-[400px]">
              <div className="w-32 border-r border-white/5 bg-secondary/20 overflow-y-auto custom-scrollbar">
                {Object.keys(EXERCISE_DATABASE).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest transition-all",
                      selectedCategory === cat ? "bg-primary/20 text-primary border-r-2 border-primary" : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 gap-2 custom-scrollbar">
                {selectedCategory && (EXERCISE_DATABASE as any)[selectedCategory]
                  .filter((ex: string) => ex.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((ex: string) => (
                    <button 
                      key={ex}
                      onClick={() => {
                        const routine = routines?.find(r => r.id === isAddingToRoutine);
                        if (routine) addSpecificExercise(routine, ex);
                      }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-white/5 hover:border-primary/30 hover:bg-secondary/60 transition-all group text-left"
                    >
                      <span className="font-sans font-bold text-sm tracking-wide">{ex}</span>
                      <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))
                }
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative z-10 gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-widest uppercase text-glow">Routine Architect</h1>
          <p className="text-muted-foreground font-sans mt-1 text-sm">Design and modify your training vectors for maximum efficiency.</p>
        </div>
        <button 
          onClick={addRoutine}
          className="bg-primary/20 text-primary border border-primary/50 px-6 py-2.5 rounded-lg font-bold uppercase tracking-tighter text-xs flex items-center gap-2 hover:bg-primary/30 transition-all box-glow"
        >
          <Plus className="w-4 h-4" /> New Routine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-96 bg-card border border-white/5 rounded-xl animate-pulse"></div>
          ))
        ) : (
          routines?.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")).map((routine, idx) => (
            <motion.div 
              key={routine.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden shadow-lg flex flex-col group/card hover:border-primary/20 hover:shadow-primary/5 transition-all"
            >
              <div className="bg-secondary/80 p-4 border-b border-white/5 flex justify-between items-center group">
                <div className="flex-1">
                  <input 
                    type="text" 
                    defaultValue={routine.name}
                    onBlur={(e) => updateRoutineName(routine, e.target.value)}
                    className="bg-transparent font-display font-bold text-xl uppercase tracking-wider focus:outline-none focus:text-primary transition-colors w-full"
                  />
                  <div className="text-[9px] font-bold text-primary/60 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                    <Target className="w-2.5 h-2.5" /> Target Group: {routine.exercises.length > 0 ? "Integrated Protocol" : "Inert"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => shareRoutine(routine)}
                    className="text-muted-foreground hover:text-primary opacity-40 group-hover:opacity-100 transition-opacity p-1"
                    title="Publish to The Grid"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteRoutine(routine.id)} className="text-muted-foreground hover:text-destructive opacity-40 group-hover:opacity-100 transition-opacity p-1">
                    {deleteRoutineMutation.isPending && deleteRoutineMutation.variables === routine.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 space-y-2 overflow-y-auto min-h-[150px] max-h-[300px] custom-scrollbar">
                {routine.exercises.map((ex, i) => (
                  <div key={i} className="flex flex-col gap-1 bg-background/40 backdrop-blur-sm border border-white/5 p-3 rounded-lg group/item hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col -space-y-1">
                        <button 
                          onClick={() => reorderExercise(routine, i, 'up')}
                          className={cn(
                            "text-white/5 hover:text-primary transition-all p-0.5",
                            i === 0 && "opacity-0 pointer-events-none"
                          )}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => reorderExercise(routine, i, 'down')}
                          className={cn(
                            "text-white/5 hover:text-primary transition-all p-0.5",
                            i === routine.exercises.length - 1 && "opacity-0 pointer-events-none"
                          )}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold font-sans text-xs tracking-tight">{ex}</span>
                      <button 
                        onClick={() => removeExerciseFromRoutine(routine, i)}
                        className="ml-auto opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-red-500 transition-all p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-4 ml-6">
                      <div className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">Sets: <span className="text-primary font-bold">3</span></div>
                      <div className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">Reps: <span className="text-primary font-bold">8-12</span></div>
                    </div>
                  </div>
                ))}
                
                {routine.exercises.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <DumbbellIcon className="w-8 h-8 opacity-10 mb-2" />
                    <div className="italic text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">No Modules Active</div>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <button 
                  onClick={() => addExerciseToRoutine(routine.id)}
                  className="w-full py-2.5 border border-dashed border-white/5 text-[10px] text-muted-foreground rounded-lg hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Plus className="w-3 h-3" /> Add Component
                </button>
                
                <div className="h-px bg-white/5" />
                
                <button 
                  onClick={() => initializeWorkout(routine)}
                  className="w-full py-3 bg-primary text-black font-display font-black uppercase tracking-[0.15em] rounded transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] box-glow text-xs flex items-center justify-center gap-2 group"
                >
                  <DumbbellIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Initialize Workout
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
