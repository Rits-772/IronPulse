import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Save, Trash2, Dumbbell, Timer, Loader2, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useSaveWorkout } from "@/hooks/use-db-data";

function CounterInput({ value, onChange, placeholder, unit }: { value: string, onChange: (val: string) => void, placeholder: string, unit?: string }) {
  const current = parseFloat(value) || 0;
  
  return (
    <div className="flex items-center bg-background border border-white/5 rounded-lg overflow-hidden focus-within:border-primary/50 transition-all group">
      <button 
        onClick={() => onChange((Math.max(0, current - 1)).toString())}
        className="px-2 py-2 hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <div className="relative flex-1">
        <input 
          type="number" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none py-2 text-center font-mono text-sm focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && value && (
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] font-bold text-muted-foreground opacity-50">{unit}</span>
        )}
      </div>
      <button 
        onClick={() => onChange((current + 1).toString())}
        className="px-2 py-2 hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

type ExerciseSet = {
  reps: string;
  weight: string;
};

type ExerciseEntry = {
  id: string;
  name: string;
  sets: ExerciseSet[];
};

export default function LogWorkout() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const saveWorkout = useSaveWorkout();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    { id: '1', name: "Barbell Squat", sets: [{ reps: "", weight: "" }] }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { id: Math.random().toString(), name: "New Exercise", sets: [{ reps: "", weight: "" }] }]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(e => {
      if (e.id === exerciseId) {
        return { ...e, sets: [...e.sets, { reps: "", weight: "" }] };
      }
      return e;
    }));
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(exercises.map(e => {
      if (e.id === exerciseId) {
        return { ...e, sets: e.sets.filter((_, i) => i !== setIndex) };
      }
      return e;
    }));
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof ExerciseSet, value: string) => {
    setExercises(exercises.map(e => {
      if (e.id === exerciseId) {
        const newSets = [...e.sets];
        newSets[setIndex][field] = value;
        return { ...e, sets: newSets };
      }
      return e;
    }));
  };

  const handleSave = async () => {
    if (!workoutName) {
      toast({ title: "Name required", description: "Designate the session before commit.", variant: "destructive" });
      return;
    }
    
    try {
      await saveWorkout.mutateAsync({
        name: workoutName,
        exercises: exercises
      });
      
      toast({
        title: "Workout Logged",
        description: "Data successfully synced to neural network.",
        className: "border-primary bg-background text-foreground",
      });
      setLocation("/dashboard");
    } catch (e: any) {
      toast({
        title: "Sync Error",
        description: e.message,
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-1/2">
            <input 
              type="text" 
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="NAME THIS SESSION"
              className="w-full bg-transparent border-none text-4xl md:text-5xl font-display font-black uppercase tracking-tight focus:outline-none focus:ring-0 placeholder:text-muted-foreground/30 text-glow"
            />
            <div className="flex items-center gap-4 text-sm text-primary font-bold tracking-widest uppercase mt-2">
              <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> 00:00:00</span>
              <span className="flex items-center gap-1"><Dumbbell className="w-4 h-4" /> 0 LBS</span>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saveWorkout.isPending}
            className="bg-primary text-black px-8 py-3 rounded-lg font-display font-bold uppercase tracking-widest text-lg flex items-center gap-2 hover:bg-primary/90 transition-all box-glow shrink-0 w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveWorkout.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Commit Log
          </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {exercises.map((exercise, exerciseIdx) => (
              <motion.div 
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-white/5 rounded-xl overflow-hidden shadow-lg"
              >
                {/* Exercise Header */}
                <div className="bg-secondary/50 p-4 border-b border-white/5 flex justify-between items-center">
                  <input 
                    type="text"
                    value={exercise.name}
                    onChange={(e) => {
                      const newExercises = [...exercises];
                      newExercises[exerciseIdx].name = e.target.value;
                      setExercises(newExercises);
                    }}
                    className="bg-transparent border-none text-xl font-display font-bold uppercase tracking-wider focus:outline-none w-full max-w-sm"
                  />
                  <button onClick={() => removeExercise(exercise.id)} className="text-muted-foreground hover:text-destructive transition-colors p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Sets */}
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">
                    <div className="col-span-2 text-center">Set</div>
                    <div className="col-span-4 text-center">LBS</div>
                    <div className="col-span-4 text-center">Reps</div>
                    <div className="col-span-2"></div>
                  </div>
                  
                  <AnimatePresence>
                    {exercise.sets.map((set, setIdx) => (
                      <motion.div 
                        key={setIdx}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-2 text-center font-bold text-muted-foreground font-mono">{setIdx + 1}</div>
                        <div className="col-span-4">
                          <CounterInput 
                            value={set.weight}
                            onChange={(val) => updateSet(exercise.id, setIdx, 'weight', val)}
                            placeholder="0"
                            unit="LBS"
                          />
                        </div>
                        <div className="col-span-4">
                          <CounterInput 
                            value={set.reps}
                            onChange={(val) => updateSet(exercise.id, setIdx, 'reps', val)}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <button onClick={() => removeSet(exercise.id, setIdx)} className="text-muted-foreground hover:text-destructive/80 transition-colors p-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <button 
                    onClick={() => addSet(exercise.id)}
                    className="w-full mt-4 py-2 border border-dashed border-white/10 text-muted-foreground rounded-lg hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Set
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button 
          onClick={addExercise}
          className="w-full mt-6 py-4 bg-secondary/50 text-foreground font-display font-bold text-xl uppercase tracking-widest rounded-xl hover:bg-secondary transition-all border border-white/5 flex items-center justify-center gap-2 group"
        >
          <Plus className="w-6 h-6 text-primary group-hover:scale-125 transition-transform" /> Add Exercise Parameter
        </button>
      </div>
    </DashboardLayout>
  );
}
