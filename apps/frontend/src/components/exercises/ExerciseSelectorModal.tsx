import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Search, Filter, Dumbbell, ChevronRight, Info, Check, Plus 
} from "lucide-react";
import { 
  EXERCISE_DATABASE, 
  MUSCLE_GROUPS, 
  EQUIPMENT_TYPES, 
  MuscleGroup, 
  EquipmentType, 
  ExerciseDefinition,
  searchExercises 
} from "@/lib/exercise-database";
import { ExerciseDetailModal } from "./ExerciseDetailModal";
import { cn } from "@/lib/utils";

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: ExerciseDefinition) => void;
  title?: string;
}

export function ExerciseSelectorModal({
  isOpen,
  onClose,
  onSelectExercise,
  title = "Select Exercise Protocol"
}: ExerciseSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'All'>('All');
  const [inspectingExercise, setInspectingExercise] = useState<ExerciseDefinition | null>(null);

  const filteredExercises = useMemo(() => {
    return searchExercises(searchQuery, {
      muscleGroup: selectedMuscle,
      equipment: selectedEquipment,
      difficulty: 'All'
    });
  }, [searchQuery, selectedMuscle, selectedEquipment]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-[#0b0c10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-bold uppercase tracking-wider text-white">
                    {title}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase tracking-widest">
                    {filteredExercises.length} Protocols Available
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="p-3 sm:p-4 border-b border-white/10 bg-white/[0.01] space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 80+ exercises by name, muscle, equipment..."
                  className="w-full bg-secondary/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 font-sans transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Muscle Group Filter Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                <button
                  onClick={() => setSelectedMuscle('All')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border",
                    selectedMuscle === 'All'
                      ? "bg-primary text-black font-bold border-primary shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                      : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/20 hover:text-white"
                  )}
                >
                  All ({EXERCISE_DATABASE.length})
                </button>
                {MUSCLE_GROUPS.map((group) => {
                  const count = EXERCISE_DATABASE.filter(e => e.muscleGroup === group).length;
                  const isSelected = selectedMuscle === group;
                  return (
                    <button
                      key={group}
                      onClick={() => setSelectedMuscle(group)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border",
                        isSelected
                          ? "bg-primary text-black font-bold border-primary shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                          : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {group} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exercise List */}
            <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-2 custom-scrollbar">
              {filteredExercises.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="text-sm font-mono uppercase tracking-wider">No matching exercise protocols found</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedMuscle('All'); setSelectedEquipment('All'); }}
                    className="mt-3 text-xs text-primary underline"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-3.5 rounded-xl bg-card/40 border border-white/5 hover:border-primary/40 hover:bg-primary/[0.03] transition-all group flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-display font-bold uppercase tracking-wider text-white group-hover:text-primary transition-colors truncate">
                          {exercise.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
                          {exercise.muscleGroup}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {exercise.equipment}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                        <span className="text-foreground/70 font-medium">{exercise.primaryMuscles.join(', ')}</span>
                        {exercise.secondaryMuscles.length > 0 && (
                          <span className="opacity-50 text-[11px] hidden sm:inline">+ {exercise.secondaryMuscles.slice(0, 2).join(', ')}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setInspectingExercise(exercise)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        title="View Protocol Details & Form"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectExercise(exercise);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-primary text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all box-glow flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Inspecting Exercise Details Modal */}
      <ExerciseDetailModal
        exercise={inspectingExercise}
        isOpen={!!inspectingExercise}
        onClose={() => setInspectingExercise(null)}
        onSelect={(ex) => {
          onSelectExercise(ex);
          setInspectingExercise(null);
          onClose();
        }}
        selectLabel="Select Protocol"
      />
    </>,
    document.body
  );
}
