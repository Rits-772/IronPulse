import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, type Variants } from "framer-motion";
import { Activity, Flame, TrendingUp, Weight, Play, Dumbbell, Trophy } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useActivityData, useProgressData, useWorkouts, usePersonalRecords, useProfile, useMetricsData, useNutritionData } from "@/hooks/use-db-data";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function PersonalRecordsList() {
  const { data: records, isLoading } = usePersonalRecords();

  if (isLoading) return <div className="text-center py-4 text-muted-foreground animate-pulse">Scanning records...</div>;
  if (!records || records.length === 0) return <div className="text-center py-4 text-muted-foreground text-xs uppercase tracking-widest italic opacity-50">No PRs detected in historical data</div>;

  return (
    <div className="space-y-3">
      {records.slice(0, 5).map((record, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-white/5 group hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            <Trophy className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="font-bold text-sm uppercase tracking-wider">{record.name}</span>
          </div>
          <div className="font-display font-bold text-lg">
            {record.weight} <span className="text-[10px] text-muted-foreground">LBS</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function GoalProgressBar({ label, current, target, unit, color }: { label: string, current: number, target: number, unit: string, color: string }) {
  const progress = Math.min(Math.max((current / target) * 100, 0), 100);
  // For weight, progress might be inverse (higher is further from goal if cutting)
  // Let's assume a simple progress toward a target number for now.
  const displayProgress = target > current ? (current / target) * 100 : (target / current) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</label>
        <span className="text-xs font-mono font-bold">
          {current}/{target} <span className="text-muted-foreground text-[10px]">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: activityData, isLoading: activityLoading } = useActivityData();
  const { data: progressData, isLoading: progressLoading } = useProgressData();
  const { data: workouts, isLoading: workoutsLoading } = useWorkouts();
  const { data: profile } = useProfile();
  const { data: metrics } = useMetricsData();
  const { data: nutritionData } = useNutritionData();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayNutrition = nutritionData?.find(n => n.date === todayStr) || { calories: 0, protein: 0, carbs: 0, fats: 0, water_ml: 0 };
  
  const calorieGoal = 2500; // Default goal
  const proteinGoal = 180;
  const waterGoal = 3000;

  const calProgress = Math.min((todayNutrition.calories / calorieGoal) * 100, 100);
  const proteinProgress = Math.min((todayNutrition.protein / proteinGoal) * 100, 100);
  const waterProgress = Math.min((todayNutrition.water_ml / waterGoal) * 100, 100);

  const latestWeight = metrics && metrics.length > 0 ? metrics[metrics.length - 1].weight : 80;
  const latestBodyFat = metrics && metrics.length > 0 ? metrics[metrics.length - 1].bodyFat : 20;

  const weeklyVolume = workouts?.reduce((acc, w) => acc + w.volume, 0) || 0;
  const sessionsCount = workouts?.length || 0;
  
  // Basic streak calculation (days in a row with a workout)
  const calculateStreak = (workouts: any[]) => {
    if (!workouts || workouts.length === 0) return 0;
    const dates = workouts.map(w => w.date).sort().reverse();
    let streak = 1;
    let current = new Date(dates[0]);
    
    for (let i = 1; i < dates.length; i++) {
      const next = new Date(dates[i]);
      const diff = (current.getTime() - next.getTime()) / (1000 * 3600 * 24);
      if (diff === 1) {
        streak++;
        current = next;
      } else if (diff > 1) {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak(workouts || []);

  const stats = [
    { title: "Weekly Volume", value: weeklyVolume.toLocaleString(), unit: "LBS", icon: Weight, color: "text-primary", bg: "bg-primary/10" },
    { title: "Active Streak", value: streak.toString(), unit: "DAYS", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Sessions/Week", value: sessionsCount.toString(), unit: "AVG", icon: Activity, color: "text-accent", bg: "bg-accent/10" },
    { title: "Strength Index", value: "+12%", unit: "MoM", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Neural Rank", value: `LVL ${profile?.level || 1}`, unit: `${profile?.xp || 0} XP`, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-widest uppercase">Command Center</h1>
          <p className="text-muted-foreground font-sans mt-1">Welcome back, {user?.user_metadata?.full_name || 'Subject Alpha'}. Ready to push limits?</p>
        </div>
        <Link href="/log-workout" className="bg-primary text-black px-6 py-3 rounded-lg font-display font-bold uppercase tracking-widest text-lg flex items-center gap-2 hover:scale-105 transition-transform box-glow w-fit">
          <Play className="w-5 h-5 fill-black" /> Start Session
        </Link>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-card border border-white/5 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold tracking-wider">{stat.value}</span>
              <span className="text-sm font-bold text-muted-foreground">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-white/5 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-xl uppercase tracking-widest">Performance Matrix</h3>
            <div className="flex gap-2 text-[10px] font-bold tracking-tighter">
              <span className="flex items-center gap-1 text-primary"><div className="w-2 h-2 bg-primary rounded-full" /> SQUAT</span>
              <span className="flex items-center gap-1 text-accent"><div className="w-2 h-2 bg-accent rounded-full" /> BENCH</span>
            </div>
          </div>
          <div className="h-72 w-full">
            {progressLoading ? (
              <div className="w-full h-full flex items-center justify-center"><Activity className="animate-spin text-primary" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff30" tick={{fontFamily: 'Rajdhani', fontSize: 10}} />
                  <YAxis stroke="#ffffff30" tick={{fontFamily: 'Rajdhani', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050505', borderColor: '#222', borderRadius: '4px', fontFamily: 'Rajdhani', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ fontFamily: 'Rajdhani', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="squat" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{r: 4, fill: "hsl(var(--primary))"}} />
                  <Line type="monotone" dataKey="bench" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} activeDot={{r: 4, fill: "hsl(var(--accent))"}} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-white/5 rounded-xl p-6 flex flex-col"
        >
          <h3 className="font-display font-bold text-xl uppercase tracking-widest mb-6">Personal Records</h3>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-72 pr-2 custom-scrollbar">
            <PersonalRecordsList />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-card border border-white/5 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-xl uppercase tracking-widest">Neural Data Sync</h3>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-6">
            <GoalProgressBar 
              label="Weight Target" 
              current={latestWeight} 
              target={profile?.weight_goal || 75} 
              unit="KG" 
              color="bg-primary" 
            />
            <GoalProgressBar 
              label="Body Fat Goal" 
              current={latestBodyFat} 
              target={profile?.body_fat_goal || 12} 
              unit="%" 
              color="bg-accent" 
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-card border border-white/5 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-xl uppercase tracking-widest">Fuel Status</h3>
            <Link href="/nutrition" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Manage Fuel</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 relative flex items-center justify-center">
               <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary/20" />
                <motion.circle
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 58}
                  initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - calProgress / 100) }}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-display font-bold tracking-tighter">{Math.round(calProgress)}%</span>
                <span className="text-[8px] text-muted-foreground uppercase">Cals</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
               <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1 text-muted-foreground">
                    <span>Protein</span>
                    <span>{Math.round(proteinProgress)}%</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${proteinProgress}%` }} />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1 text-muted-foreground">
                    <span>Hydration</span>
                    <span>{todayNutrition.water_ml / 1000}L / {waterGoal / 1000}L</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${waterProgress}%` }} />
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-white/5 rounded-xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display font-bold text-xl uppercase tracking-widest">Recent Logs</h3>
          <Link href="/history" className="text-sm font-bold text-primary hover:underline uppercase tracking-wider">View All</Link>
        </div>
        
        <div className="space-y-3">
          {workoutsLoading ? (
             <div className="py-8 text-center text-muted-foreground">Loading records...</div>
          ) : (
            workouts?.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary border border-transparent hover:border-white/5 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-colors">
                    <Dumbbell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{workout.name}</h4>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{workout.date} • {workout.exercises.length} Exercises</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-bold font-display text-xl">{workout.volume.toLocaleString()} <span className="text-xs text-muted-foreground">LBS</span></div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{workout.duration} MIN</div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
