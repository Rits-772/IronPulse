import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, type Variants } from "framer-motion";
import { 
  Activity, Flame, TrendingUp, Weight, Play, Dumbbell, Trophy, 
  Shield, Zap, Target, Heart, Navigation, Star, Info
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from "recharts";
import { useActivityData, useProgressData, useWorkouts, usePersonalRecords, useProfile, useMetricsData, useNutritionData } from "@/hooks/use-db-data";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import GymScene from "@/components/3d/GymScene";

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

function AttributeMeter({ label, value, max, icon: Icon, color }: { label: string, value: number, max: number, icon: any, color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-4 group">
      <div className={`p-2 rounded bg-white/5 border border-white/10 ${color.replace('bg-', 'text-')}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>{label}</span>
          <span>{value} / {max}</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${color} relative z-10`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function MetricCircle({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  progress, 
  reference, 
  color 
}: { 
  label: string, 
  value: string, 
  unit: string, 
  icon: any, 
  progress: number, 
  reference: string, 
  color: string 
}) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div variants={itemVariants} className="bg-card/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center group hover:border-primary/30 transition-all relative overflow-hidden backdrop-blur-md h-full min-h-[220px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8 text-center">{label}</h3>
      
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <svg className="w-full h-full -rotate-90">
          <circle 
            cx="64" cy="64" r={radius} 
            stroke="currentColor" strokeWidth="6" 
            fill="transparent" 
            className="text-white/5" 
          />
          <motion.circle
            cx="64" cy="64" r={radius} 
            stroke="currentColor" strokeWidth="6" 
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Icon className={`w-5 h-5 mb-2 opacity-80 ${color.replace('stroke-', 'text-')}`} />
          <span className="text-3xl font-display font-black tracking-tighter">{value}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{unit}</span>
        </div>
      </div>
      
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
        {reference}
      </div>
    </motion.div>
  );
}

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

export default function Dashboard() {
  const { user } = useAuth();
  const { data: workouts, isLoading: workoutsLoading } = useWorkouts();
  const { data: progressData, isLoading: progressLoading } = useProgressData();
  const { data: profile } = useProfile();
  const { data: metrics } = useMetricsData();
  const { data: nutritionData } = useNutritionData();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayNutrition = nutritionData?.find(n => n.date === todayStr) || { calories: 0, protein: 0, carbs: 0, fats: 0, water_ml: 0 };
  
  const calorieGoal = 2500; 
  const proteinGoal = 180;
  const waterGoal = 3000;

  const calProgress = Math.min((todayNutrition.calories / calorieGoal) * 100, 100);
  const proteinProgress = Math.min((todayNutrition.protein / proteinGoal) * 100, 100);
  const waterProgress = Math.min((todayNutrition.water_ml / waterGoal) * 100, 100);
  const latestWeight = metrics && metrics.length > 0 ? metrics[metrics.length - 1].weight : 80;
  const latestBodyFat = metrics && metrics.length > 0 ? metrics[metrics.length - 1].bodyFat : 20;

  const weeklyVolume = workouts?.reduce((acc, w) => acc + w.volume, 0) || 0;
  const sessionsCount = workouts?.length || 0;
  
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

  const radarData = [
    { subject: 'Power', A: 85, fullMark: 100 },
    { subject: 'Stamina', A: 70, fullMark: 100 },
    { subject: 'Agility', A: 60, fullMark: 100 },
    { subject: 'Speed', A: 50, fullMark: 100 },
    { subject: 'Recovery', A: 75, fullMark: 100 },
    { subject: 'Focus', A: 90, fullMark: 100 },
  ];

  const circleStats = [
    { label: "WEEKLY VOLUME", value: weeklyVolume.toLocaleString(), unit: "LBS", icon: Weight, progress: (weeklyVolume / 50000) * 100, reference: "Target: 50k LBS", color: "stroke-rose-500" },
    { label: "SESSIONS", value: sessionsCount.toString(), unit: "TOTAL", icon: Dumbbell, progress: (sessionsCount / 4) * 100, reference: "Goal: 4 per week", color: "stroke-accent" },
    { label: "STREAK", value: streak.toString(), unit: "DAYS", icon: Flame, progress: (streak / 7) * 100, reference: "Goal: 7 days", color: "stroke-orange-500" },
    { label: "DAILY CALORIES", value: todayNutrition.calories.toString(), unit: "kKal", icon: Zap, progress: calProgress, reference: `Goal: ${calorieGoal}`, color: "stroke-amber-400" },
  ];

  const horizontalStats = [
    { title: "Weight", value: latestWeight, unit: "KG", icon: Weight, color: "text-primary" },
    { title: "Body Fat", value: latestBodyFat, unit: "%", icon: Activity, color: "text-accent" },
    { title: "Strength Index", value: "+12%", unit: "MoM", icon: TrendingUp, color: "text-purple-500" },
    { title: "Hydration", value: (todayNutrition.water_ml / 1000).toFixed(1), unit: "L", icon: Navigation, color: "text-blue-500" },
  ];

  return (
    <DashboardLayout>
      {/* Mobile-only 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none lg:hidden opacity-30">
        <GymScene />
      </div>

      <div className="relative z-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-widest uppercase text-glow">Command Center</h1>
            <p className="text-muted-foreground font-sans mt-1">OPERATIVE: {user?.user_metadata?.full_name || 'Subject Alpha'} // STATUS: ONLINE</p>
          </div>
          <Link href="/log-workout" className="bg-primary text-black px-6 py-3 rounded-lg font-display font-bold uppercase tracking-widest text-lg flex items-center gap-2 hover:scale-105 transition-transform box-glow w-fit">
            <Play className="w-5 h-5 fill-black" /> Start Session
          </Link>
        </div>

        {/* RPG Hero Section */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Radar Chart Section */}
          <motion.div variants={itemVariants} className="bg-card/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-xl uppercase tracking-widest">General Information</h3>
              <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'Rajdhani' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Character Card & Attribute Bars */}
          <div className="flex flex-col gap-6">
            {/* Character Info */}
            <motion.div variants={itemVariants} className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-xl bg-black/40 border-2 border-emerald-500/50 overflow-hidden flex items-center justify-center">
                  <Dumbbell className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-black uppercase tracking-tighter text-emerald-400">{user?.user_metadata?.full_name?.split(' ')[0] || 'OPERATIVE'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-emerald-500 text-emerald-500" />)}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Elite Tier</span>
                  </div>
                </div>
              </div>
              <div className="text-right relative z-10">
                <div className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-1">Rank Status</div>
                <div className="text-4xl font-display font-black text-white leading-none">LVL {profile?.level || 1}</div>
                <div className="mt-2 flex items-center gap-2 justify-end">
                  <div className="h-1.5 w-24 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${profile?.xp ? (profile.xp % 100) : 0}%` }} />
                  </div>
                  <span className="text-[8px] font-bold text-emerald-400">{profile?.xp || 0} XP</span>
                </div>
              </div>
            </motion.div>

            {/* Attribute Bars */}
            <motion.div variants={itemVariants} className="bg-card/40 border border-white/5 rounded-2xl p-6 space-y-4 backdrop-blur-md">
              <AttributeMeter label="Core Strength" value={85} max={100} icon={Shield} color="bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
              <AttributeMeter label="Neural Drive" value={92} max={100} icon={Zap} color="bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              <AttributeMeter label="Precision" value={78} max={100} icon={Target} color="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <AttributeMeter label="Recovery" value={64} max={100} icon={Heart} color="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Circular Metrics Section */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {circleStats.map((stat, i) => (
            <MetricCircle key={i} {...stat} />
          ))}
        </motion.div>

        {/* Unified Horizontal Stats Row */}
        <motion.div 
          variants={containerVariants} initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-card/20 border border-white/5 p-4 rounded-xl backdrop-blur-sm"
        >
          {horizontalStats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="flex items-center gap-4 px-4 border-r border-white/5 last:border-0">
              <div className={`p-2 rounded bg-white/5 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.title}</div>
                <div className="text-xl font-display font-bold">{stat.value}<span className="text-[10px] ml-1 opacity-50">{stat.unit}</span></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card/40 border border-white/5 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-xl uppercase tracking-widest">Performance Matrix</h3>
              <div className="flex gap-4 text-[10px] font-bold tracking-widest">
                <span className="flex items-center gap-1 text-primary"><div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_#39FF14]" /> SQUAT</span>
                <span className="flex items-center gap-1 text-accent"><div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_5px_#39FF14]" /> BENCH</span>
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
                      contentStyle={{ backgroundColor: '#050505', borderColor: '#222', borderRadius: '8px', fontFamily: 'Rajdhani', border: '1px solid rgba(255,255,255,0.1)' }}
                      itemStyle={{ fontFamily: 'Rajdhani', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="squat" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 0}} activeDot={{r: 6, fill: "hsl(var(--primary))"}} />
                    <Line type="monotone" dataKey="bench" stroke="hsl(var(--accent))" strokeWidth={3} dot={{r: 0}} activeDot={{r: 6, fill: "hsl(var(--accent))"}} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-card/40 border border-white/5 rounded-xl p-6 flex flex-col"
          >
            <h3 className="font-display font-bold text-xl uppercase tracking-widest mb-6">Personal Records</h3>
            <div className="flex-1 space-y-4 overflow-y-auto max-h-72 pr-2 custom-scrollbar">
              <PersonalRecordsList />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-card/40 border border-white/5 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-xl uppercase tracking-widest text-glow-small">Mission Log Hub</h3>
            <Link href="/history" className="text-sm font-bold text-primary hover:underline uppercase tracking-wider">Historical Data</Link>
          </div>
          
          <div className="space-y-4">
            {workoutsLoading ? (
               <div className="py-8 text-center text-muted-foreground animate-pulse">Retrieving encrypted logs...</div>
            ) : (
              workouts?.slice(0, 3).map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-5 rounded-xl bg-secondary/20 hover:bg-secondary/40 border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-black/60 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors shadow-inner">
                      <Dumbbell className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg font-display tracking-wide">{workout.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{workout.date} // {workout.exercises.length} SUB-ROUTINES</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="font-bold font-display text-2xl text-white">{workout.volume.toLocaleString()} <span className="text-xs text-muted-foreground font-sans">LBS</span></div>
                    <div className="text-[10px] text-primary font-bold uppercase tracking-widest">{workout.duration} MIN ELAPSED</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
