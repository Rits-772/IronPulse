import { Link } from "wouter";
import { AlertCircle, ArrowLeft, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#060608] px-4 font-rajdhani relative overflow-hidden">
      {/* Ambient Grid and Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-red-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card/60 backdrop-blur-2xl border border-red-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 mx-auto flex items-center justify-center text-red-400 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
          <Terminal className="w-3 h-3" /> 404 // ROUTE DISCONNECTED
        </div>

        <h1 className="text-3xl font-display font-black uppercase tracking-wider text-white mb-2">
          Sector <span className="text-red-400 text-glow">Uncharted</span>
        </h1>

        <p className="text-xs text-muted-foreground font-mono leading-relaxed mb-8 max-w-xs mx-auto">
          The requested coordinate matrix does not exist in the IronPulse neural mainframe.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/dashboard"
            className="px-6 py-3 bg-primary text-black font-display font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all box-glow flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Command
          </Link>
          <Link 
            href="/"
            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-display font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
          >
            Main Gateway
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
