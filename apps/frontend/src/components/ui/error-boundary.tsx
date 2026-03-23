import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CRITICAL_SYSTEM_FAILURE:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060608] flex items-center justify-center p-6 font-rajdhani relative overflow-hidden">
          {/* Background Glitch Effects */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-card/40 backdrop-blur-3xl border border-rose-500/30 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(244,63,94,0.1)] relative z-10 text-center"
          >
            <div className="w-20 h-20 bg-rose-500/20 border border-rose-500/50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <AlertTriangle className="w-10 h-10 text-rose-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-rose-500/30 animate-ping" />
            </div>

            <h1 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-white mb-2">Protocol <span className="text-rose-500">Breach</span></h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em] mb-8 opacity-60">Critical Neural Link Failure Detected</p>
            
            <div className="bg-black/60 border border-white/5 rounded-xl p-4 mb-8 text-left">
              <div className="text-[8px] font-mono text-rose-500/60 uppercase mb-1">Diagnostic Data:</div>
              <div className="text-xs font-mono text-rose-500/80 break-all leading-relaxed">
                {this.state.error?.message || "UNKNOWN_INTERNAL_EXCEPTION"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Re-Initialize</span>
              </button>
              <button 
                onClick={() => window.location.href = "/"}
                className="flex items-center justify-center gap-2 py-4 bg-primary text-black rounded-xl hover:scale-105 transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Return Base</span>
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
