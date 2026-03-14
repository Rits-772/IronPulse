import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { useNutritionData, useSaveNutrition, useProfile } from "@/hooks/use-db-data";
import { Salad, Flame, Droplets, Plus, Scale, Calculator, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function Nutrition() {
  const { data: nutritionLogs, isLoading: logsLoading } = useNutritionData();
  const { data: profile } = useProfile();
  const saveNutrition = useSaveNutrition();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    water: ""
  });

  const todayLog = nutritionLogs?.[0] || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    water_ml: 0
  };

  const targets = {
    calories: profile?.weight_goal ? profile.weight_goal * 30 : 2500, // Rough estimate if no profile
    protein: profile?.weight_goal ? profile.weight_goal * 2 : 150,
    carbs: 300,
    fats: 70,
    water: 3000
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveNutrition.mutateAsync({
        calories: parseFloat(formData.calories) || 0,
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fats: parseFloat(formData.fats) || 0,
        water_ml: parseFloat(formData.water) || 0
      });

      toast({
        title: "Matrix Sync Successful",
        description: "Nutritional data synthesized and recorded.",
        className: "border-primary bg-background text-foreground",
      });
      setFormData({ calories: "", protein: "", carbs: "", fats: "", water: "" });
    } catch (err: any) {
      toast({
        title: "Sync Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const calPercentage = Math.min((Number(todayLog.calories) / targets.calories) * 100, 100);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold tracking-widest uppercase">Nutrition Matrix</h1>
        <p className="text-muted-foreground font-sans mt-1">Optimize fuel subroutines for peak output.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calorie Orbit & Macros */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-card border border-white/5 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flame className="w-32 h-32" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* SVG Calorie Orbit */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="128" cy="128" r="110"
                    stroke="currentColor" strokeWidth="12"
                    fill="transparent" className="text-secondary/20"
                  />
                  <motion.circle
                    cx="128" cy="128" r="110"
                    stroke="currentColor" strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 110}
                    initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - calPercentage / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Calories</span>
                  <span className="text-5xl font-display font-bold tracking-tighter mt-1">{todayLog.calories}</span>
                  <div className="h-px w-12 bg-white/10 my-2" />
                  <span className="text-sm font-mono text-muted-foreground">Goal: {targets.calories}</span>
                </div>
              </div>

              {/* Macro Breakdown */}
              <div className="flex-1 w-full space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary">Protein (g)</label>
                    <span className="text-sm font-mono font-bold">{todayLog.protein} / {targets.protein}</span>
                  </div>
                  <Progress value={(Number(todayLog.protein) / targets.protein) * 100} className="h-2 bg-secondary/50" />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-accent">Carbs (g)</label>
                    <span className="text-sm font-mono font-bold">{todayLog.carbs} / {targets.carbs}</span>
                  </div>
                  <Progress value={(Number(todayLog.carbs) / targets.carbs) * 100} className="h-2 bg-secondary/50" />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-purple-500">Fats (g)</label>
                    <span className="text-sm font-mono font-bold">{todayLog.fats} / {targets.fats}</span>
                  </div>
                  <Progress value={(Number(todayLog.fats) / targets.fats) * 100} className="h-2 bg-secondary/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Water Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Droplets className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hydration Level</h3>
                <div className="text-3xl font-display font-bold text-blue-400 mt-1">{todayLog.water_ml} <span className="text-sm text-muted-foreground font-sans">ML</span></div>
                <div className="mt-2 text-[10px] uppercase font-bold text-muted-foreground">Target: {targets.water} ML</div>
              </div>
            </div>

            <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Macro Calculator</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Adjust for cutting/bulking protocols</p>
                </div>
              </div>
              <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Entry Log Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-white/5 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl uppercase tracking-widest">Synthesize Feed</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Total Calories</label>
              <input 
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: e.target.value})}
                className="w-full bg-background border border-white/5 rounded-xl px-4 py-4 font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="2500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Protein (G)</label>
                <input 
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({...formData, protein: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 font-mono focus:border-primary outline-none" 
                  placeholder="150"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Carbs (G)</label>
                <input 
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 font-mono focus:border-accent outline-none" 
                  placeholder="300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Fats (G)</label>
                <input 
                  type="number"
                  value={formData.fats}
                  onChange={(e) => setFormData({...formData, fats: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 font-mono focus:border-purple-500 outline-none" 
                  placeholder="70"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Water (ML)</label>
                <input 
                  type="number"
                  value={formData.water}
                  onChange={(e) => setFormData({...formData, water: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 font-mono focus:border-blue-500 outline-none" 
                  placeholder="250"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saveNutrition.isPending}
              className="w-full mt-6 py-5 bg-primary text-black font-display font-bold text-xl uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] flex justify-center items-center gap-2"
            >
              {saveNutrition.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Commit Log
            </button>
          </form>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
