import { useState } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { 
  Plus, Trash2, Loader2, Dumbbell as DumbbellIcon, 
  ChevronUp, ChevronDown, Sparkles, Bot, Play, 
  CheckCircle2, RotateCcw, X, Edit2, Copy, BookmarkPlus 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  useRoutines, useSaveRoutine, useDeleteRoutine 
} from "@/hooks/use-db-data";
import { 
  generateSmartProtocol, SplitType, TrainingGoal, ExperienceLevel, GeneratedProtocol 
} from "@/lib/protocol-generator";
import { ExerciseSelectorModal } from "@/components/exercises/ExerciseSelectorModal";
import { ExerciseDefinition } from "@/lib/exercise-database";

export default function Planner() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: routines, isLoading } = useRoutines();
  const saveRoutine = useSaveRoutine();
  const deleteRoutineMutation = useDeleteRoutine();

  // Exercise Picker State
  const [activeRoutineForExercise, setActiveRoutineForExercise] = useState<any | null>(null);

  // Custom Routine Creator Dialog State
  const [isCustomCreatorOpen, setIsCustomCreatorOpen] = useState(false);
  const [customRoutineName, setCustomRoutineName] = useState("");
  const [customRoutineTemplate, setCustomRoutineTemplate] = useState<string>("Empty");

  // Editing Routine Title Dialog State
  const [editingRoutine, setEditingRoutine] = useState<any | null>(null);
  const [editingNameVal, setEditingNameVal] = useState("");

  // Smart Protocol Generator Wizard State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedSplit, setSelectedSplit] = useState<SplitType>('Push / Pull / Legs (PPL)');
  const [selectedGoal, setSelectedGoal] = useState<TrainingGoal>('Hypertrophy');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>('Operative');
  const [selectedDays, setSelectedDays] = useState<number>(4);
  const [generatedPreview, setGeneratedPreview] = useState<GeneratedProtocol | null>(() => {
    return generateSmartProtocol({
      splitType: 'Push / Pull / Legs (PPL)',
      goal: 'Hypertrophy',
      experienceLevel: 'Operative',
      daysPerWeek: 4,
    });
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const handleOpenCustomCreator = () => {
    setCustomRoutineName("");
    setCustomRoutineTemplate("Empty");
    setIsCustomCreatorOpen(true);
  };

  const handleCreateCustomRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customRoutineName.trim() || "Custom Protocol";

    let initialExercises: string[] = [];
    if (customRoutineTemplate === "Push") {
      initialExercises = ["Barbell Flat Bench Press", "Incline Dumbbell Press", "Standing Dumbbell Lateral Raise", "Cable Tricep Rope Pushdown"];
    } else if (customRoutineTemplate === "Pull") {
      initialExercises = ["Conventional Barbell Deadlift", "Weighted Pull-Ups", "Overhand Barbell Bent-Over Row", "Standing Barbell Bicep Curl"];
    } else if (customRoutineTemplate === "Legs") {
      initialExercises = ["Barbell Back Squat", "Romanian Deadlift (RDL)", "Bulgarian Split Squat", "Standing Calf Raise"];
    } else if (customRoutineTemplate === "FullBody") {
      initialExercises = ["Barbell Back Squat", "Barbell Flat Bench Press", "Overhand Barbell Bent-Over Row", "Standing Overhead Barbell Press (OHP)"];
    }

    try {
      await saveRoutine.mutateAsync({
        name: finalName,
        exercises: initialExercises,
      });

      toast({ 
        title: "Protocol Initialized", 
        description: `Created "${finalName}" with ${initialExercises.length} movement vectors.`,
        className: "border-primary bg-background text-foreground"
      });
      setIsCustomCreatorOpen(false);
    } catch (err: any) {
      toast({ title: "Failed to create protocol", description: err.message, variant: "destructive" });
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      await deleteRoutineMutation.mutateAsync(id);
      toast({ title: "Protocol purged from vault" });
    } catch (err: any) {
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" });
    }
  };

  const duplicateRoutine = async (routine: any) => {
    try {
      await saveRoutine.mutateAsync({
        name: `${routine.name} (Clone)`,
        exercises: [...routine.exercises],
      });
      toast({ 
        title: "Protocol Cloned", 
        description: `Duplicate created in your routine vault.`,
        className: "border-primary bg-background text-foreground"
      });
    } catch (err: any) {
      toast({ title: "Duplication Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleSaveRenamedRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoutine || !editingNameVal.trim()) return;

    try {
      await saveRoutine.mutateAsync({
        ...editingRoutine,
        name: editingNameVal.trim(),
      });
      toast({ title: "Routine Renamed", description: `Updated to "${editingNameVal.trim()}".` });
      setEditingRoutine(null);
    } catch (err: any) {
      toast({ title: "Rename Failed", description: err.message, variant: "destructive" });
    }
  };

  const addSpecificExercise = async (routine: any, exercise: ExerciseDefinition) => {
    try {
      await saveRoutine.mutateAsync({
        ...routine,
        exercises: [...routine.exercises, exercise.name]
      });
      toast({ 
        title: "Movement Vector Added", 
        description: `${exercise.name} linked to ${routine.name}`,
        className: "border-primary bg-background text-foreground"
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

  const initializeWorkout = (routine: any) => {
    if (routine.exercises.length === 0) {
      toast({ title: "Routine empty", description: "Designate exercises before initialization.", variant: "destructive" });
      return;
    }
    const exercisesParam = encodeURIComponent(JSON.stringify(routine.exercises.map((e: string) => ({ 
      id: Math.random().toString(), 
      name: e, 
      sets: [{ reps: "10", weight: "135" }, { reps: "10", weight: "135" }, { reps: "10", weight: "135" }] 
    }))));
    const nameParam = encodeURIComponent(routine.name);
    setLocation(`/log-workout?exercises=${exercisesParam}&name=${nameParam}`);
  };

  const [mobileTab, setMobileTab] = useState<"parameters" | "preview">("preview");

  const updateProtocol = (
    split = selectedSplit,
    goal = selectedGoal,
    level = selectedLevel,
    days = selectedDays
  ) => {
    const protocol = generateSmartProtocol({
      splitType: split,
      goal: goal,
      experienceLevel: level,
      daysPerWeek: days,
    });
    setGeneratedPreview(protocol);
  };

  const handleSplitChange = (val: SplitType) => {
    setSelectedSplit(val);
    updateProtocol(val, selectedGoal, selectedLevel, selectedDays);
  };

  const handleGoalChange = (val: TrainingGoal) => {
    setSelectedGoal(val);
    updateProtocol(selectedSplit, val, selectedLevel, selectedDays);
  };

  const handleLevelChange = (val: ExperienceLevel) => {
    setSelectedLevel(val);
    updateProtocol(selectedSplit, selectedGoal, val, selectedDays);
  };

  const handleDaysChange = (val: number) => {
    setSelectedDays(val);
    updateProtocol(selectedSplit, selectedGoal, selectedLevel, val);
  };

  const handleGenerateProtocol = () => {
    updateProtocol();
  };

  const handleDeployGeneratedProtocol = async () => {
    if (!generatedPreview) return;
    setIsDeploying(true);

    try {
      for (const day of generatedPreview.days) {
        await saveRoutine.mutateAsync({
          name: `${day.dayName} (${day.focus.split('(')[0].trim()})`,
          exercises: day.exercises.map(e => e.name),
        });
      }

      toast({
        title: "Smart Protocol Synthesized",
        description: `Deployed ${generatedPreview.days.length} routine days to your protocol vault.`,
        className: "border-primary bg-background text-foreground",
      });

      setIsGeneratorOpen(false);
    } catch (err: any) {
      toast({
        title: "Deployment Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Top Header & Actions Banner */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Architecture & Splits Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-wider text-white">
                Workout <span className="text-primary text-glow">Planner</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl font-sans">
                Construct custom training routines or utilize the neural protocol generator to synthesize calibrated periodized splits.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  handleGenerateProtocol();
                  setIsGeneratorOpen(true);
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-black font-display font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all box-glow flex items-center gap-2"
              >
                <Bot className="w-4 h-4" /> Smart Protocol Generator
              </button>
              <button
                onClick={handleOpenCustomCreator}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-primary" /> Build Custom Routine
              </button>
            </div>
          </div>
        </div>

        {/* Routines Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-mono uppercase tracking-widest">Loading Routine Vault...</p>
          </div>
        ) : routines && routines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <motion.div
                key={routine.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 hover:border-primary/30 transition-all flex flex-col justify-between group relative overflow-hidden shadow-lg"
              >
                <div className="space-y-4">
                  {/* Routine Title Row with Action Controls */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-display font-bold uppercase tracking-wider text-white truncate group-hover:text-primary transition-colors">
                        {routine.name}
                      </h3>
                      <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">
                        {routine.exercises.length} Movements Configured
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingRoutine(routine);
                          setEditingNameVal(routine.name);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                        title="Rename Routine"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateRoutine(routine)}
                        className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Clone Routine"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteRoutine(routine.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Routine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Exercises List in Routine */}
                  <div className="space-y-2 min-h-[140px] max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                    {routine.exercises.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground/60 font-mono uppercase space-y-2">
                        <p>No movement vectors assigned.</p>
                        <button
                          onClick={() => setActiveRoutineForExercise(routine)}
                          className="text-primary hover:underline text-[11px]"
                        >
                          + Add movement from database
                        </button>
                      </div>
                    ) : (
                      routine.exercises.map((exerciseName: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] group/item transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded bg-primary/10 text-primary text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-foreground/90 truncate">
                              {exerciseName}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-60 group-hover/item:opacity-100 transition-opacity">
                            {idx > 0 && (
                              <button
                                onClick={() => reorderExercise(routine, idx, 'up')}
                                className="p-1 text-muted-foreground hover:text-white"
                                title="Move Up"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                            )}
                            {idx < routine.exercises.length - 1 && (
                              <button
                                onClick={() => reorderExercise(routine, idx, 'down')}
                                className="p-1 text-muted-foreground hover:text-white"
                                title="Move Down"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => removeExerciseFromRoutine(routine, idx)}
                              className="p-1 text-muted-foreground hover:text-rose-400 ml-1"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2">
                  <button
                    onClick={() => setActiveRoutineForExercise(routine)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary" /> Add Exercise
                  </button>

                  <button
                    onClick={() => initializeWorkout(routine)}
                    className="px-4 py-2.5 rounded-xl bg-primary text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all box-glow flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" /> Launch
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-2xl bg-card/20 border border-white/5 text-center space-y-4">
            <DumbbellIcon className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <h3 className="text-xl font-display font-bold uppercase text-white">Protocol Vault Empty</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Initialize a custom routine from scratch or generate a complete training program in seconds using the Smart Protocol Generator.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  handleGenerateProtocol();
                  setIsGeneratorOpen(true);
                }}
                className="px-6 py-3 rounded-xl bg-primary text-black font-display font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all box-glow flex items-center gap-2"
              >
                <Bot className="w-4 h-4" /> Synthesize Split
              </button>
              <button
                onClick={handleOpenCustomCreator}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Create Custom
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Selector Modal for Adding Exercises to Routine */}
      <ExerciseSelectorModal
        isOpen={!!activeRoutineForExercise}
        onClose={() => setActiveRoutineForExercise(null)}
        onSelectExercise={(ex) => {
          if (activeRoutineForExercise) {
            addSpecificExercise(activeRoutineForExercise, ex);
          }
        }}
        title={`Add to ${activeRoutineForExercise?.name || 'Protocol'}`}
      />

      {/* Custom Routine Builder Modal */}
      {typeof document !== 'undefined' && isCustomCreatorOpen && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomCreatorOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#0b0c10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <form onSubmit={handleCreateCustomRoutine}>
                <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BookmarkPlus className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">
                      Build Custom Routine
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomCreatorOpen(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      Protocol Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customRoutineName}
                      onChange={(e) => setCustomRoutineName(e.target.value)}
                      placeholder="e.g. Heavy Chest & Triceps Blitz"
                      className="w-full bg-secondary/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-sans"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      Starting Template (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'Empty', label: 'Blank Canvas' },
                        { id: 'Push', label: 'Push (Chest/Delts)' },
                        { id: 'Pull', label: 'Pull (Back/Biceps)' },
                        { id: 'Legs', label: 'Legs (Quads/Hips)' },
                        { id: 'FullBody', label: 'Full Body Blast' },
                      ].map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => setCustomRoutineTemplate(tpl.id)}
                          className={cn(
                            "py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider border transition-all text-left",
                            customRoutineTemplate === tpl.id
                              ? "bg-primary/10 border-primary text-primary font-bold shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                              : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                          )}
                        >
                          {tpl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCustomCreatorOpen(false)}
                    className="px-4 py-2 rounded-lg border border-white/10 text-muted-foreground hover:text-white text-xs font-mono uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary text-black font-display font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all box-glow"
                  >
                    Initialize Routine
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* Routine Rename Dialog */}
      {typeof document !== 'undefined' && editingRoutine && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingRoutine(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#0b0c10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <form onSubmit={handleSaveRenamedRoutine}>
                <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <h3 className="text-base font-display font-bold uppercase tracking-wider text-white">
                    Rename Protocol
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingRoutine(null)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={editingNameVal}
                    onChange={(e) => setEditingNameVal(e.target.value)}
                    className="w-full bg-secondary/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 font-sans"
                    autoFocus
                  />
                </div>
                <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingRoutine(null)}
                    className="px-4 py-2 rounded-lg border border-white/10 text-muted-foreground hover:text-white text-xs font-mono uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-black font-display font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all box-glow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* Smart Protocol Generator Modal (Adaptive Responsive Multi-Viewport Topology) */}
      {typeof document !== 'undefined' && isGeneratorOpen && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGeneratorOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative w-full max-w-5xl max-h-[92vh] h-[92vh] flex flex-col bg-[#0b0c10] border border-primary/40 rounded-2xl shadow-[0_0_50px_rgba(57,255,20,0.15)] overflow-hidden z-10"
            >
              {/* Header (Shrink-0) */}
              <div className="p-3.5 sm:p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-lg font-display font-black uppercase tracking-wider text-white">
                      Neural Protocol Synthesizer
                    </h2>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-widest hidden sm:block">
                      Algorithmic periodization & volume architecture engine
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Tab Switcher (Visible on < lg) */}
                  <div className="flex lg:hidden bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono uppercase">
                    <button
                      onClick={() => setMobileTab("parameters")}
                      className={cn(
                        "px-2.5 py-1 rounded transition-colors",
                        mobileTab === "parameters" ? "bg-primary text-black font-bold" : "text-muted-foreground"
                      )}
                    >
                      Config
                    </button>
                    <button
                      onClick={() => setMobileTab("preview")}
                      className={cn(
                        "px-2.5 py-1 rounded transition-colors",
                        mobileTab === "preview" ? "bg-primary text-black font-bold" : "text-muted-foreground"
                      )}
                    >
                      Blueprint ({generatedPreview?.days.length || 0})
                    </button>
                  </div>

                  <button
                    onClick={() => setIsGeneratorOpen(false)}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white shrink-0 ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Workspace (Side-by-Side on lg+, Tabbed on Mobile) */}
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                {/* Left Controls Sidebar (lg:col-span-4) */}
                <div
                  className={cn(
                    "p-4 sm:p-5 space-y-4 overflow-y-auto custom-scrollbar bg-white/[0.01]",
                    "lg:col-span-4 lg:block",
                    mobileTab === "parameters" ? "block" : "hidden lg:block"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em]">
                      Synthesis Parameters
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground uppercase">Live Synced</span>
                  </div>

                  {/* Split Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      Split Architecture
                    </label>
                    <select
                      value={selectedSplit}
                      onChange={(e) => handleSplitChange(e.target.value as any)}
                      className="w-full bg-secondary/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary/50 font-sans"
                    >
                      <option value="Push / Pull / Legs (PPL)">Push / Pull / Legs (PPL)</option>
                      <option value="Upper / Lower">Upper / Lower (4-Day)</option>
                      <option value="Full Body Protocol">Full Body Protocol</option>
                    </select>
                  </div>

                  {/* Primary Goal */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      Target Adaptation
                    </label>
                    <select
                      value={selectedGoal}
                      onChange={(e) => handleGoalChange(e.target.value as any)}
                      className="w-full bg-secondary/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary/50 font-sans"
                    >
                      <option value="Hypertrophy">Hypertrophy (Mass & Tone)</option>
                      <option value="Max Strength">Max Strength (Power & PRs)</option>
                      <option value="Athletic Power">Athletic Conditioning</option>
                      <option value="Fat Loss & Conditioning">Fat Loss & Volume</option>
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      Operative Tier
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => handleLevelChange(e.target.value as any)}
                      className="w-full bg-secondary/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary/50 font-sans"
                    >
                      <option value="Initiate">Initiate (Beginner Foundations)</option>
                      <option value="Operative">Operative (Intermediate Overload)</option>
                      <option value="Elite">Elite (Advanced Periodization)</option>
                    </select>
                  </div>

                  {/* Days Per Week */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      Weekly Frequency
                    </label>
                    <select
                      value={selectedDays}
                      onChange={(e) => handleDaysChange(Number(e.target.value))}
                      className="w-full bg-secondary/50 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary/50 font-sans"
                    >
                      <option value="3">3 Days / Week</option>
                      <option value="4">4 Days / Week</option>
                      <option value="5">5 Days / Week</option>
                      <option value="6">6 Days / Week</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateProtocol}
                    className="w-full mt-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-primary flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Re-synthesize Blueprint
                  </button>

                  <div className="lg:hidden pt-2">
                    <button
                      onClick={() => setMobileTab("preview")}
                      className="w-full py-2.5 rounded-xl bg-primary text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      View Generated Blueprint →
                    </button>
                  </div>
                </div>

                {/* Right Blueprint Preview & Deploy (lg:col-span-8) */}
                <div
                  className={cn(
                    "flex flex-col min-h-0 overflow-hidden bg-[#0b0c10]",
                    "lg:col-span-8 lg:flex",
                    mobileTab === "preview" ? "flex" : "hidden lg:flex"
                  )}
                >
                  {generatedPreview && (
                    <>
                      {/* Summary Subheader */}
                      <div className="p-3.5 sm:p-4 border-b border-white/5 bg-primary/5 flex items-center justify-between shrink-0 gap-3">
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-white truncate">
                            {generatedPreview.title}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                            {generatedPreview.description}
                          </p>
                        </div>
                        <span className="text-[9px] font-mono uppercase px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20 shrink-0 font-bold">
                          {generatedPreview.weeklyVolumeGuidance}
                        </span>
                      </div>

                      {/* Scrollable Days List */}
                      <div className="p-3 sm:p-4 overflow-y-auto flex-1 min-h-0 space-y-3 custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {generatedPreview.days.map((day) => (
                            <div key={day.dayNumber} className="p-3 sm:p-3.5 rounded-xl bg-card/60 border border-white/5 space-y-2 hover:border-primary/20 transition-colors">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                                <span className="text-xs font-display font-bold uppercase tracking-wider text-primary">
                                  {day.dayName}
                                </span>
                                <span className="text-[9px] font-mono uppercase text-muted-foreground">
                                  {day.exercises.length} Movements
                                </span>
                              </div>
                              <div className="space-y-1 text-xs">
                                {day.exercises.map((ex, i) => (
                                  <div key={i} className="flex items-center justify-between text-muted-foreground py-0.5">
                                    <span className="text-foreground/90 font-medium truncate pr-2 text-[11px]">
                                      {i + 1}. {ex.name}
                                    </span>
                                    <span className="font-mono text-[9px] shrink-0 text-primary/80 font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                                      {ex.sets}x{ex.reps}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sticky Bottom Actions */}
                      <div className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
                        <button
                          onClick={() => setIsGeneratorOpen(false)}
                          className="px-3.5 sm:px-4 py-2 rounded-lg border border-white/10 text-muted-foreground hover:text-white text-xs font-mono uppercase tracking-wider"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleDeployGeneratedProtocol}
                          disabled={isDeploying || !generatedPreview}
                          className="px-5 sm:px-6 py-2.5 rounded-xl bg-primary text-black font-display font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all box-glow flex items-center gap-2 disabled:opacity-50"
                        >
                          {isDeploying ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Deploying Protocol...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> Deploy to My Routines
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </DashboardLayout>
  );
}
