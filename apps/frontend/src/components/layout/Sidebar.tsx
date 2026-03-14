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
  Salad
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Log Workout", href: "/log-workout", icon: Dumbbell },
  { name: "Workout History", href: "/history", icon: History },
  { name: "Progress Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Nutrition Matrix", href: "/nutrition", icon: Salad },
  { name: "Body Metrics", href: "/body-metrics", icon: Activity },
  { name: "Workout Planner", href: "/planner", icon: CalendarDays },
];

const bottomItems = [
  { name: "Profile Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();

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

      <div className="p-4 border-t border-border">
        {bottomItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href} className="block">
              <div className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group cursor-pointer",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                <item.icon className="w-5 h-5" />
                <span className="font-sans font-medium text-lg">{item.name}</span>
              </div>
            </Link>
          );
        })}

        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group mt-1"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span className="font-sans font-medium text-lg">Sign Out</span>
        </button>
        
        <div className="mt-6 flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-secondary border border-white/10 flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold font-sans truncate">{user?.user_metadata?.full_name || 'Subject Alpha'}</div>
            <div className="text-xs text-muted-foreground font-sans truncate">{user?.email || 'Unauthorized'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
