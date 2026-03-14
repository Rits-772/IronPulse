import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Save, Trash2, Dumbbell, Timer, Loader2, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useSaveWorkout } from "@/hooks/use-db-data";
import { cn } from "@/lib/utils";

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

function RestTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = (seconds: number) => {
    setTime(seconds);
    setIsActive(true);
  };

  return (
    <div className="bg-card border border-white/5 rounded-xl p-4 flex flex-col items-center gap-3">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Rest Protocol</div>
      <div className={cn(
        "text-4xl font-display font-bold tracking-tighter transition-colors",
        isActive ? "text-primary text-glow" : "text-muted-foreground"
      )}>
        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
      </div>
      <div className="flex gap-2">
        {[60, 90, 180].map((s) => (
          <button 
            key={s} 
            onClick={() => startTimer(s)}
            className="px-3 py-1 bg-secondary/50 border border-white/5 rounded text-[10px] font-bold uppercase hover:bg-primary hover:text-black transition-all"
          >
            {s}s
          </button>
        ))}
        {isActive && (
          <button 
            onClick={() => setIsActive(false)}
            className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[10px] font-bold uppercase"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}

export default function LogWorkout() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const saveWorkout = useSaveWorkout();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([
    { id: '1', name: "Barbell Squat", sets: [{ reps: "", weight: "" }] }
  ]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefillEx = params.get('exercises');
    const prefillName = params.get('name');
    
    if (prefillEx) {
      try {
        const decoded = JSON.parse(decodeURIComponent(prefillEx));
        setExercises(decoded);
      } catch (e) {
        console.error("Failed to parse prefill exercises", e);
      }
    }
    
    if (prefillName) {
      setWorkoutName(decodeURIComponent(prefillName).toUpperCase());
    }
  }, []);

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
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="w-full md:w-1/2">
              <input 
                type="text" 
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="NAME THIS SESSION"
                className="w-full bg-transparent border-none text-4xl md:text-5xl font-display font-bold uppercase tracking-tight focus:outline-none focus:ring-0 placeholder:text-muted-foreground/30 focus:text-primary transition-colors"
              />
              <div className="flex items-center gap-4 text-[10px] text-primary font-bold tracking-[0.2em] uppercase mt-2">
                <span className="flex items-center gap-1.5 opacity-60">
                  <Dumbbell className="w-3 h-3" /> 
                  {exercises.reduce((total, ex) => 
                         total + ex.sets.reduce((exTotal, s) => 
                           exTotal + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0), 0
                         ), 0
                       ).toLocaleString()} LBS DISPLACED
                </span>
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
        </div>

        <div className="lg:col-span-4 lg:row-start-1 lg:row-end-3">
          <div className="sticky top-8 space-y-6">
            <RestTimer />
            <div className="bg-card border border-white/5 rounded-xl p-6">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Session Telemetry</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Volume</span>
                    <span className="font-mono text-primary font-bold tracking-tighter">
                       {exercises.reduce((total, ex) => 
                         total + ex.sets.reduce((exTotal, s) => 
                           exTotal + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0), 0
                         ), 0
                       ).toLocaleString()} LBS
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Sets</span>
                    <span className="font-mono text-primary font-bold">
                       {exercises.reduce((acc, e) => acc + e.sets.length, 0)}
                    </span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
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
          
          <button 
            onClick={addExercise}
            className="w-full mt-6 py-4 bg-secondary/30 text-foreground/80 font-display font-bold text-xl uppercase tracking-[0.2em] rounded-xl hover:bg-secondary/50 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-6 h-6 text-primary group-hover:scale-125 transition-transform" /> Add Exercise Parameter
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
