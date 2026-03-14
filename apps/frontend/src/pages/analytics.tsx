import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useProgressData, useActivityData } from "@/hooks/use-db-data";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export default function Analytics() {
  const { data: progressData } = useProgressData();
  const { data: activityData } = useActivityData();

  // Mock volume data
  const volumeData = [
    { month: 'Jan', volume: 120000 },
    { month: 'Feb', volume: 145000 },
    { month: 'Mar', volume: 132000 },
    { month: 'Apr', volume: 168000 },
    { month: 'May', volume: 185000 },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold tracking-widest uppercase">Deep Analytics</h1>
        <p className="text-muted-foreground font-sans mt-1">Comprehensive breakdown of your performance vectors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Strength Curve */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="col-span-1 lg:col-span-2 bg-card border border-white/5 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-2xl uppercase tracking-widest">Strength Curve</h3>
            <select className="bg-background border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none">
              <option>Big 3 Totals</option>
              <option>Upper Body</option>
              <option>Lower Body</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#ffffff50" tick={{fontFamily: 'Rajdhani'}} />
                <YAxis stroke="#ffffff50" tick={{fontFamily: 'Rajdhani'}} />
                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                <Line type="monotone" dataKey="squat" name="Squat" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: "hsl(var(--primary))"}} />
                <Line type="monotone" dataKey="bench" name="Bench Press" stroke="hsl(var(--accent))" strokeWidth={3} dot={{r: 4, fill: "hsl(var(--accent))"}} />
                <Line type="monotone" dataKey="deadlift" name="Deadlift" stroke="#a855f7" strokeWidth={3} dot={{r: 4, fill: "#a855f7"}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Volume Over Time */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-white/5 rounded-xl p-6"
        >
           <h3 className="font-display font-bold text-xl uppercase tracking-widest mb-6">Aggregate Volume (LBS)</h3>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" tick={{fontFamily: 'Rajdhani'}} />
                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Frequency */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-white/5 rounded-xl p-6"
        >
           <h3 className="font-display font-bold text-xl uppercase tracking-widest mb-6">Session Frequency</h3>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff50" tick={{fontFamily: 'Rajdhani'}} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                <Bar dataKey="workouts" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
