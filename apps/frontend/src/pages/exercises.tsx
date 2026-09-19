import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Dumbbell, Zap, Target, Shield, CheckCircle2, 
  ChevronRight, Info, Plus, Sparkles, ArrowRight, Play 
} from "lucide-react";
import { 
  EXERCISE_DATABASE, 
  MUSCLE_GROUPS, 
  EQUIPMENT_TYPES, 
  MuscleGroup, 
  EquipmentType, 
  DifficultyLevel,
  ExerciseDefinition,
  searchExercises 
} from "@/lib/exercise-database";
import { ExerciseDetailModal } from "@/components/exercises/ExerciseDetailModal";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function ExercisesPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All');
  const [inspectingExercise, setInspectingExercise] = useState<ExerciseDefinition | null>(null);

  const filteredExercises = useMemo(() => {
    return searchExercises(searchQuery, {
      muscleGroup: selectedMuscle,
      equipment: selectedEquipment,
      difficulty: selectedDifficulty
    });
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedDifficulty]);

  const quickStartWorkout = (exercise: ExerciseDefinition) => {
    const prefill = encodeURIComponent(JSON.stringify([{
      id: '1',
      name: exercise.name,
      sets: [{ reps: "10", weight: "135" }, { reps: "10", weight: "135" }, { reps: "10", weight: "135" }]
    }]));
    setLocation(`/log-workout?name=${encodeURIComponent(exercise.name + ' Focus')}&exercises=${prefill}`);
  };

  const getDifficultyBadge = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Elite': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Top Header Banner */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Biomechanical Knowledge Matrix
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-wider text-white">
                Exercise <span className="text-primary text-glow">Vault</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl font-sans">
                Explore 80+ calibrated movement protocols complete with kinetic recruitment paths, form cues, and physiological adaptation profiles.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation("/planner")}
                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Synthesize Routine <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocation("/log-workout")}
                className="px-5 py-3 rounded-xl bg-primary text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all box-glow flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" /> Quick Session
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Section */}
        <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protocols by name, targeted muscle, or equipment..."
                className="w-full bg-secondary/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 font-sans transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Equipment Filter Select */}
            <div className="w-full md:w-56">
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value as any)}
                className="w-full bg-secondary/50 border border-white/10 rounded-xl py-3 px-3.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-sans"
              >
                <option value="All">All Equipment</option>
                {EQUIPMENT_TYPES.map(eq => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter Select */}
            <div className="w-full md:w-48">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="w-full bg-secondary/50 border border-white/10 rounded-xl py-3 px-3.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-sans"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Elite">Elite</option>
              </select>
            </div>
          </div>

          {/* Muscle Group Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 custom-scrollbar">
            <button
              onClick={() => setSelectedMuscle('All')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border",
                selectedMuscle === 'All'
                  ? "bg-primary text-black font-bold border-primary shadow-[0_0_12px_rgba(57,255,20,0.3)]"
                  : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/20 hover:text-white"
              )}
            >
              All Regions ({EXERCISE_DATABASE.length})
            </button>
            {MUSCLE_GROUPS.map((group) => {
              const count = EXERCISE_DATABASE.filter(e => e.muscleGroup === group).length;
              const isSelected = selectedMuscle === group;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedMuscle(group)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border",
                    isSelected
                      ? "bg-primary text-black font-bold border-primary shadow-[0_0_12px_rgba(57,255,20,0.3)]"
                      : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/20 hover:text-white"
                  )}
                >
                  {group} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground px-1">
            <span>Displaying {filteredExercises.length} Movement Protocols</span>
            {(selectedMuscle !== 'All' || selectedEquipment !== 'All' || selectedDifficulty !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedMuscle('All');
                  setSelectedEquipment('All');
                  setSelectedDifficulty('All');
                  setSearchQuery('');
                }}
                className="text-primary hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredExercises.length === 0 ? (
            <div className="p-16 rounded-2xl bg-card/20 border border-white/5 text-center space-y-3">
              <Dumbbell className="w-12 h-12 text-muted-foreground/40 mx-auto" />
              <h3 className="text-lg font-display font-bold uppercase text-white">No Protocols Matched Criteria</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Try loosening your filters or searching for broader muscle tags such as "Chest", "Back", or "Barbell".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExercises.map((exercise) => (
                <motion.div
                  key={exercise.id}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 hover:border-primary/40 hover:shadow-[0_0_25px_rgba(57,255,20,0.08)] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Tags Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {exercise.muscleGroup}
                      </span>
                      <span className={cn("text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border", getDifficultyBadge(exercise.difficulty))}>
                        {exercise.difficulty}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
                        {exercise.equipment}
                      </span>
                    </div>

                    {/* Exercise Title */}
                    <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white group-hover:text-primary transition-colors leading-snug">
                      {exercise.name}
                    </h3>

                    {/* Primary Target Muscles */}
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <Target className="w-3 h-3 text-primary" /> Target Agonists:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exercise.primaryMuscles.map((m, i) => (
                          <span key={i} className="text-[11px] font-medium text-foreground/90 bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Short Preview Benefit */}
                    {exercise.benefits[0] && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
                        {exercise.benefits[0]}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setInspectingExercise(exercise)}
                      className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5 text-primary" /> Details
                    </button>

                    <button
                      onClick={() => quickStartWorkout(exercise)}
                      className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-black font-display font-bold text-xs uppercase tracking-wider transition-all border border-primary/30 flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" /> Log Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inspecting Modal */}
      <ExerciseDetailModal
        exercise={inspectingExercise}
        isOpen={!!inspectingExercise}
        onClose={() => setInspectingExercise(null)}
        onSelect={(ex) => {
          quickStartWorkout(ex);
          setInspectingExercise(null);
        }}
        selectLabel="Quick Launch Session"
      />
    </DashboardLayout>
  );
}
