import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { useNutritionData, useSaveNutrition, useProfile } from "@/hooks/use-db-data";
import { Salad, Flame, Droplets, Plus, Scale, Calculator, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

  const [showCalculator, setShowCalculator] = useState(false);
  const [calcData, setCalcData] = useState({
    age: "25",
    gender: "male",
    activity: "1.55", // Moderately Active
    goal: "maintenance" // maintenance, cut, bulk
  });

  const calculateTDEE = () => {
    if (!profile?.weight_goal || !profile?.height_cm) return 2500;
    
    // Mifflin-St Jeor Equation
    let bmr = (10 * profile.weight_goal) + (6.25 * profile.height_cm) - (5 * Number(calcData.age));
    bmr = calcData.gender === "male" ? bmr + 5 : bmr - 161;
    
    let tdee = bmr * Number(calcData.activity);
    
    if (calcData.goal === "cut") tdee -= 500;
    if (calcData.goal === "bulk") tdee += 500;
    
    return Math.round(tdee);
  };

  const calculatedTDEE = calculateTDEE();

  const targets = {
    calories: calculatedTDEE,
    protein: profile?.weight_goal ? Math.round(profile.weight_goal * 2.2) : 150, // 2.2g per kg
    carbs: Math.round((calculatedTDEE * 0.45) / 4), // 45% carbs
    fats: Math.round((calculatedTDEE * 0.25) / 9), // 25% fats
    water: 3500
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

  const recommendations = {
    eat: ["Liquid Egg Whites", "Chicken Breast", "Atlantic Salmon", "Greek Yogurt", "Spinach & Kale", "Sweet Potato"],
    moderate: ["Red Meat", "Whole Grain Pasta", "Avocados", "Raw Almonds", "Olive Oil"],
    avoid: ["Refined Sugars", "Trans Fats", "Excessive Sodium", "Highly Processed Oils", "Liquid Calories"]
  };

  return (
    <DashboardLayout>
      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card w-full max-w-md border border-white/10 rounded-2xl p-8 relative"
          >
            <button 
              onClick={() => setShowCalculator(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              <Plus className="w-6 h-6 rotate-45" />
            </button>
            <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-primary mb-6">Biometric Calibration</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Subject Age</label>
                  <input 
                    type="number" value={calcData.age} 
                    onChange={(e) => setCalcData({...calcData, age: e.target.value})}
                    className="w-full bg-secondary/50 border border-white/5 rounded-lg px-4 py-2 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Subject Gender</label>
                  <select 
                    value={calcData.gender} 
                    onChange={(e) => setCalcData({...calcData, gender: e.target.value})}
                    className="w-full bg-secondary/50 border border-white/5 rounded-lg px-4 py-2 focus:border-primary outline-none text-white text-sm"
                  >
                    <option value="male">MALE</option>
                    <option value="female">FEMALE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Activity Multiplier</label>
                <select 
                  value={calcData.activity} 
                  onChange={(e) => setCalcData({...calcData, activity: e.target.value})}
                  className="w-full bg-secondary/50 border border-white/5 rounded-lg px-4 py-2 focus:border-primary outline-none text-white text-sm"
                >
                  <option value="1.2">SEDENTARY (Office/Minimal)</option>
                  <option value="1.375">LIGHTLY ACTIVE (1-3 days)</option>
                  <option value="1.55">MODERATELY ACTIVE (3-5 days)</option>
                  <option value="1.725">VERY ACTIVE (6-7 days)</option>
                  <option value="1.9">EXTRA ACTIVE (Hyper-training)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Directive Protocol</label>
                <div className="grid grid-cols-3 gap-2">
                  {['cut', 'maintenance', 'bulk'].map(goal => (
                    <button
                      key={goal}
                      onClick={() => setCalcData({...calcData, goal})}
                      className={cn(
                        "px-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all",
                        calcData.goal === goal 
                          ? "bg-primary text-black border-primary box-glow" 
                          : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-sans">Projected TDEE Vector</span>
                  <div className="text-4xl font-display font-black text-primary mt-1">{calculatedTDEE} <span className="text-sm">KCAL</span></div>
                </div>
                <button 
                  onClick={() => setShowCalculator(false)}
                  className="w-full mt-6 py-3 bg-primary/20 text-primary border border-primary/50 text-xs font-black uppercase tracking-[0.2em] rounded-lg hover:bg-primary/30 transition-all"
                >
                  Accept Calibration
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold tracking-widest uppercase text-glow">Nutrition Matrix</h1>
        <p className="text-muted-foreground font-sans mt-1">Optimize fuel subroutines for peak output.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calorie Orbit & Macros */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-card border border-white/5 rounded-2xl p-8 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flame className="w-32 h-32" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* SVG Calorie Orbit */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="128" cy="128" r="110"
                    stroke="currentColor" strokeWidth="6"
                    fill="transparent" className="text-secondary/20"
                  />
                  <motion.circle
                    cx="128" cy="128" r="110"
                    stroke="currentColor" strokeWidth="8"
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
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em]">Kcal Intake</span>
                  <span className="text-6xl font-display font-black tracking-tighter mt-1 text-white">{todayLog.calories}</span>
                  <div className="h-px w-12 bg-white/10 my-3" />
                  <span className="text-xs font-mono text-muted-foreground opacity-60">Vector Goal: {targets.calories}</span>
                </div>
              </div>

              {/* Macro Breakdown */}
              <div className="flex-1 w-full space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Protein (g)</label>
                    <span className="text-xs font-mono font-bold">{todayLog.protein} / {targets.protein}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${Math.min((Number(todayLog.protein) / targets.protein) * 100, 100)}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-accent">Carbs (g)</label>
                    <span className="text-xs font-mono font-bold">{todayLog.carbs} / {targets.carbs}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${Math.min((Number(todayLog.carbs) / targets.carbs) * 100, 100)}%` }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-purple-500">Fats (g)</label>
                    <span className="text-xs font-mono font-bold">{todayLog.fats} / {targets.fats}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${Math.min((Number(todayLog.fats) / targets.fats) * 100, 100)}%` }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card/40 border border-white/5 rounded-2xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Droplets className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hydration Level</h3>
                <div className="text-3xl font-display font-black text-blue-400 mt-1">{todayLog.water_ml} <span className="text-xs text-muted-foreground font-sans uppercase">ML</span></div>
                <div className="mt-2 text-[8px] uppercase font-black text-muted-foreground opacity-60 tracking-wider">Target: {targets.water} ML</div>
              </div>
            </div>

            <div 
              onClick={() => setShowCalculator(true)}
              className="bg-card/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Biometric Calculator</h3>
                  <p className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wider">Recalibrate fuel targets</p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </motion.div>

        {/* Entry Log Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-card/40 border border-white/5 rounded-2xl p-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-black text-xl uppercase tracking-widest text-glow-small">Synthesize Feed</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Total Calories</label>
              <input 
                type="number" value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: e.target.value})}
                className="w-full bg-background border border-white/5 rounded-xl px-4 py-4 font-mono text-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:opacity-20" 
                placeholder="2500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Protein (G)</label>
                <input 
                  type="number" value={formData.protein}
                  onChange={(e) => setFormData({...formData, protein: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 font-mono focus:border-primary outline-none text-sm" 
                  placeholder="150"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Carbs (G)</label>
                <input 
                  type="number" value={formData.carbs}
                  onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 font-mono focus:border-accent outline-none text-sm" 
                  placeholder="300"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Fats (G)</label>
                <input 
                  type="number" value={formData.fats}
                  onChange={(e) => setFormData({...formData, fats: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 font-mono focus:border-purple-500 outline-none text-sm" 
                  placeholder="70"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 block">Water (ML)</label>
                <input 
                  type="number" value={formData.water}
                  onChange={(e) => setFormData({...formData, water: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl px-4 py-3 font-mono focus:border-blue-500 outline-none text-sm" 
                  placeholder="250"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={saveNutrition.isPending}
              className="w-full mt-6 py-5 bg-primary text-black font-display font-black text-xl uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)] flex justify-center items-center gap-2"
            >
              {saveNutrition.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Commit Log
            </button>
          </form>
        </motion.div>
      </div>

      {/* Nutritional Directives */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 mb-20"
      >
        <div className="flex items-center gap-3 mb-8">
          <Salad className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-display font-black uppercase tracking-widest text-glow">Nutritional Directives</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card/40 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">High Priority (Eat)</h3>
            <ul className="space-y-3">
              {recommendations.eat.map(food => (
                <li key={food} className="flex items-center gap-2 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                  <div className="w-1 h-1 bg-primary rounded-full" /> {food}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card/40 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
            <h3 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-4">Conditional (Moderate)</h3>
            <ul className="space-y-3">
              {recommendations.moderate.map(food => (
                <li key={food} className="flex items-center gap-2 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                  <div className="w-1 h-1 bg-orange-500 rounded-full" /> {food}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card/40 border-rose-500/20 border rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
            <h3 className="text-rose-500 font-black uppercase tracking-widest text-xs mb-4">Hazardous (Avoid)</h3>
            <ul className="space-y-3">
              {recommendations.avoid.map(food => (
                <li key={food} className="flex items-center gap-2 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                  <div className="w-1 h-1 bg-rose-500 rounded-full" /> {food}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
