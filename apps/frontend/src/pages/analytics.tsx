import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useProgressData, useActivityData, useMuscleDistribution, usePersonalRecords, calculate1RM } from "@/hooks/use-db-data";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { motion } from "framer-motion";
import { Brain, Zap, Target, TrendingUp } from "lucide-react";

export default function Analytics() {
  const { data: progressData } = useProgressData();
  const { data: activityData } = useActivityData();
  const { data: muscleData } = useMuscleDistribution();
  const { data: prs } = usePersonalRecords();

  // Volume logic (simplified for mockup but hook-based)
  const volumeData = progressData?.map(d => ({
    month: d.date,
    volume: (d.squat || 0) + (d.bench || 0) + (d.deadlift || 0)
  })) || [];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold tracking-widest uppercase text-glow">Deep Analytics</h1>
        <p className="text-muted-foreground font-sans mt-1">Comprehensive breakdown of your performance vectors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Strength Curve */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="col-span-1 lg:col-span-2 bg-card border border-white/5 rounded-2xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display font-bold text-2xl uppercase tracking-widest flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" /> Strength Curve
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Squat
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-accent" /> Bench
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-purple-500" /> Deadlift
               </div>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff30" tick={{fontFamily: 'Rajdhani', fontSize: 12}} />
                <YAxis stroke="#ffffff30" tick={{fontFamily: 'Rajdhani', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#222', borderRadius: '8px' }}
                  itemStyle={{ fontFamily: 'Rajdhani', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="squat" name="Squat" stroke="hsl(var(--primary))" strokeWidth={4} dot={false} activeDot={{r: 6, fill: "hsl(var(--primary))"}} />
                <Line type="monotone" dataKey="bench" name="Bench" stroke="hsl(var(--accent))" strokeWidth={4} dot={false} activeDot={{r: 6, fill: "hsl(var(--accent))"}} />
                <Line type="monotone" dataKey="deadlift" name="Deadlift" stroke="#a855f7" strokeWidth={4} dot={false} activeDot={{r: 6, fill: "#a855f7"}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Muscle Heatmap (Radar) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-card border border-white/5 rounded-2xl p-8"
        >
           <h3 className="font-display font-bold text-xl uppercase tracking-widest mb-8 flex items-center gap-3">
             <Brain className="w-5 h-5 text-accent" /> Muscle Saturation
           </h3>
           <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={muscleData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#ffffff50', fontSize: 10, fontWeight: 'bold', fontFamily: 'Rajdhani' }} />
                <Radar name="Volume" dataKey="value" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: '#222' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 1RM Oracle Predictions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-card border border-white/5 rounded-2xl p-8"
        >
           <h3 className="font-display font-bold text-xl uppercase tracking-widest mb-8 flex items-center gap-3">
             <Zap className="w-5 h-5 text-primary" /> Estimated 1RM Maxes
           </h3>
           <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
             {prs?.map((pr, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-white/5 group hover:border-primary/20 transition-all">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{pr.name}</div>
                    <div className="text-2xl font-display font-bold tracking-wider">{pr.weight} <span className="text-[10px] text-muted-foreground">LBS</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Oracle Prediction</div>
                    <div className="text-2xl font-display font-bold text-primary tracking-wider text-glow">
                      {Math.round(calculate1RM(pr.weight, 5))} <span className="text-[10px] text-primary/70 font-sans">1RM</span>
                    </div>
                  </div>
               </div>
             ))}
             {!prs?.length && <div className="text-center py-12 text-muted-foreground italic text-sm">Insufficient data for Oracle calculation</div>}
           </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
