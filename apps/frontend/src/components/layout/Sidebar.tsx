import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  BarChart2, 
  CalendarDays, 
  Dumbbell, 
  History, 
  LayoutDashboard, 
  Settings, 
  User,
  LogOut,
  Salad,
  MoreVertical,
  ChevronUp
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-db-data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

function LevelProgress({ xp }: { xp: number }) {
  const level = Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
  const currentLevelXp = Math.pow(level - 1, 2) * 100;
  const nextLevelXp = Math.pow(level, 2) * 100;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="px-4 py-4 border-t border-border mt-2 space-y-2">
      <div className="flex justify-between items-end mb-1">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Neural Rank</div>
        <div className="text-xs font-display font-bold text-primary italic">LVL {level}</div>
      </div>
      <Progress value={progress} className="h-1 bg-white/5" indicatorClassName="bg-primary shadow-[0_0_10px_#39FF14]" />
      <div className="flex justify-between text-[8px] font-mono text-muted-foreground uppercase tracking-tighter">
        <span>{xp} XP</span>
        <span>{nextLevelXp} XP</span>
      </div>
    </div>
  );
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Log Workout", href: "/log-workout", icon: Dumbbell },
  { name: "Workout History", href: "/history", icon: History },
  { name: "Progress Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Nutrition Matrix", href: "/nutrition", icon: Salad },
  { name: "Body Metrics", href: "/body-metrics", icon: Activity },
  { name: "Workout Planner", href: "/planner", icon: CalendarDays },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();

  return (
    <div className="w-64 h-screen bg-card/80 backdrop-blur-xl border-r border-border flex flex-col fixed left-0 top-0 hidden md:flex z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-black" />
        </div>
        <h1 className="text-2xl font-display font-bold tracking-widest text-foreground text-glow uppercase">
          Iron<span className="text-primary">Pulse</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-4 px-2">Training</div>
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href} className="block">
              <div className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group cursor-pointer",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="font-sans font-medium text-lg">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-5 bg-primary rounded-full box-glow" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        {profile && <LevelProgress xp={profile.xp} />}
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary/50 transition-all group border border-transparent hover:border-white/5">
              <div className="w-10 h-10 rounded-full bg-secondary border border-white/10 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-bold font-sans truncate">{profile?.full_name || user?.user_metadata?.full_name || 'Subject Alpha'}</div>
                <div className="text-[10px] text-muted-foreground font-mono truncate uppercase">{user?.email || 'Unauthorized'}</div>
              </div>
              <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" align="center" className="w-[240px] p-2 bg-card/95 backdrop-blur-2xl border-white/10 shadow-2xl rounded-2xl mb-2">
            <div className="space-y-1">
              <Link href="/settings">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">Interface Settings</span>
                </div>
              </Link>
              <div className="h-px bg-white/5 my-1" />
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">Terminate Session</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

