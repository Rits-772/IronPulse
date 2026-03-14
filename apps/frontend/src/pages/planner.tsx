import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, GripVertical, Settings2, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRoutines, useSaveRoutine, useDeleteRoutine } from "@/hooks/use-db-data";

const AVAILABLE_EXERCISES = [
  "Barbell Bench Press", "Overhead Press", "Incline Dumbbell Press", "Tricep Pushdown",
  "Deadlift", "Barbell Row", "Lat Pulldown", "Bicep Curl",
  "Barbell Squat", "Leg Press", "Romanian Deadlift", "Calf Raise",
  "Cable Fly", "Lateral Raise", "Face Pull", "Hammer Curl",
  "Front Squat", "Hip Thrust", "Leg Extension", "Leg Curl",
  "Dumbbell Press", "Skull Crusher", "Preacher Curl", "Shrug",
];

export default function Planner() {
  const { toast } = useToast();
  const { data: routines, isLoading } = useRoutines();
  const saveRoutine = useSaveRoutine();
  const deleteRoutineMutation = useDeleteRoutine();

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

  const addExerciseToRoutine = async (routine: any) => {
    const unused = AVAILABLE_EXERCISES.filter(e => !routine.exercises.includes(e));
    if (unused.length === 0) {
      toast({ title: "All exercises already added" });
      return;
    }
    const next = unused[Math.floor(Math.random() * unused.length)];
    try {
      await saveRoutine.mutateAsync({
        ...routine,
        exercises: [...routine.exercises, next]
      });
    } catch (err: any) {
      toast({ title: "Failed to add exercise", description: err.message, variant: "destructive" });
    }
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

  const updateRoutineName = async (routine: any, newName: string) => {
    try {
      await saveRoutine.mutateAsync({
        ...routine,
        name: newName
      });
    } catch (err: any) {
      // Quiet fail or debounced update would be better in real app
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-widest uppercase">Routine Architect</h1>
          <p className="text-muted-foreground font-sans mt-1">Design and modify your training vectors.</p>
        </div>
        <button 
          onClick={addRoutine}
          className="bg-primary/20 text-primary border border-primary/50 px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-primary/30 transition-all box-glow"
        >
          <Plus className="w-4 h-4" /> New Routine
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-96 bg-card border border-white/5 rounded-xl animate-pulse"></div>
          ))
        ) : (
          routines?.map((routine, idx) => (
            <motion.div 
              key={routine.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-white/5 rounded-xl overflow-hidden shadow-lg flex flex-col"
            >
              <div className="bg-secondary/80 p-4 border-b border-white/5 flex justify-between items-center group">
                <input 
                  type="text" 
                  defaultValue={routine.name}
                  onBlur={(e) => updateRoutineName(routine, e.target.value)}
                  className="bg-transparent font-display font-bold text-2xl uppercase tracking-wider focus:outline-none focus:text-primary transition-colors w-full"
                />
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteRoutine(routine.id)} className="text-muted-foreground hover:text-destructive">
                    {deleteRoutineMutation.isPending && deleteRoutineMutation.variables === routine.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 space-y-2">
                {routine.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 bg-background border border-white/5 p-3 rounded-lg group hover:border-primary/30 transition-colors">
                    <GripVertical className="w-4 h-4 text-white/10 cursor-grab group-hover:text-white/30" />
                    <span className="font-bold font-sans">{ex}</span>
                    <button 
                      onClick={() => removeExerciseFromRoutine(routine, i)}
                      className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={() => addExerciseToRoutine(routine)}
                  className="w-full mt-4 py-3 border border-dashed border-white/10 text-muted-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Exercise
                </button>
              </div>
              
              <div className="p-4 border-t border-white/5 bg-secondary/30">
                <button className="w-full py-2 bg-primary text-black font-bold uppercase tracking-widest rounded transition-all hover:bg-primary/90 box-glow text-sm">
                  Start Routine
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
