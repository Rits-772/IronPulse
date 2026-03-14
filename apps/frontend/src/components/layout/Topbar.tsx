import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-20 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 ml-0 md:ml-64">
      <div className="flex items-center gap-4 md:hidden">
        <button 
          onClick={onMenuClick}
          className="text-foreground p-2 hover:bg-secondary rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-display font-bold tracking-widest text-glow uppercase">
          Iron<span className="text-primary">Pulse</span>
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search workouts, exercises..." 
            className="w-full bg-secondary/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm font-sans text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full box-glow"></span>
        </button>
      </div>
    </header>
  );
}
