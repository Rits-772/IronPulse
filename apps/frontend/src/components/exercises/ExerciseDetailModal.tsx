import { memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Dumbbell, Zap, Target, Shield, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { ExerciseDefinition } from "@/lib/exercise-database";
import { cn } from "@/lib/utils";

interface ExerciseDetailModalProps {
  exercise: ExerciseDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (exercise: ExerciseDefinition) => void;
  selectLabel?: string;
}

export const ExerciseDetailModal = memo(function ExerciseDetailModal({
  exercise,
  isOpen,
  onClose,
  onSelect,
  selectLabel = "Add to Routine"
}: ExerciseDetailModalProps) {
  if (!isOpen || !exercise || typeof document === 'undefined') return null;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Elite': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0b0c10] border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(57,255,20,0.15)] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-white/[0.02] flex items-start justify-between relative shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/30 font-bold">
                  {exercise.muscleGroup}
                </span>
                <span className={cn("text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded border font-bold", getDifficultyColor(exercise.difficulty))}>
                  {exercise.difficulty}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-white/5 text-muted-foreground border border-white/10">
                  {exercise.equipment}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {exercise.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-white">
                {exercise.name}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 min-h-0 custom-scrollbar">
            {/* Targeted Muscles Spectrum */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-primary" /> Muscle Recruitment Chain
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-primary font-bold">Primary Agonists</span>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.primaryMuscles.map((m, i) => (
                      <span key={i} className="text-xs text-white font-medium bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground font-bold">Secondary Synergists</span>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.secondaryMuscles.map((m, i) => (
                      <span key={i} className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Instructions */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary" /> Form & Biomechanical Execution
              </div>
              <div className="space-y-2">
                {exercise.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-foreground/90">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-mono text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Biomechanical Benefits */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Adaptive Physiological Advantages
              </div>
              <div className="space-y-1.5">
                {exercise.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Execution Tips */}
            {exercise.tips.length > 0 && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                <div className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" /> Neural Optimization Tips
                </div>
                {exercise.tips.map((tip, idx) => (
                  <p key={idx} className="text-xs text-foreground/80 leading-relaxed pl-5 relative before:content-['•'] before:absolute before:left-1 before:text-primary">
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Dismiss
            </button>

            {onSelect && (
              <button
                onClick={() => {
                  onSelect(exercise);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-lg bg-primary text-black font-display font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-all box-glow flex items-center gap-2"
              >
                {selectLabel} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
});
