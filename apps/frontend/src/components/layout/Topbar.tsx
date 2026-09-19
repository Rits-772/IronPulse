import { Bell, Menu, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [searchVal, setSearchVal] = useState("");
  const [, setLocation] = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setLocation(`/exercises?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-white/5 bg-background/70 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30 ml-0 md:ml-64">
      {/* Mobile Branding */}
      <div className="flex items-center gap-3 md:hidden">
        <button 
          onClick={onMenuClick}
          className="text-foreground p-2 hover:bg-white/5 rounded-lg mr-1 border border-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <img src="/logo.svg" alt="IronPulse Logo" className="w-7 h-7 object-contain filter drop-shadow-[0_0_6px_rgba(57,255,20,0.6)]" />
        <h1 className="text-lg font-display font-black tracking-widest text-glow uppercase">
          Iron<span className="text-primary">Pulse</span>
        </h1>
      </div>

      {/* Global Movement & Protocol Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input 
            type="text" 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search 80+ movement protocols (Press Enter)..." 
            className="w-full bg-secondary/30 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs font-mono uppercase tracking-wider text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 placeholder:font-sans"
          />
        </div>
      </form>

      {/* Right Telemetry and Status */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          NEURAL LINK ONLINE
        </div>

        <button 
          onClick={() => setLocation("/settings")}
          className="relative p-2 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
          title="Notifications & Settings"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full box-glow"></span>
        </button>
      </div>
    </header>
  );
}
