import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Fingerprint, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import GymScene from "@/components/3d/GymScene";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signInWithPassword } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signInWithPassword(email, password);

    if (error) {
      toast({
        title: "Access Denied",
        description: error.message || "Invalid credentials. Check your encryption keys.",
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Session Initialized",
        description: "Welcome back, operative.",
      });
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center px-4 relative overflow-hidden font-rajdhani">
      {/* Background Gym Scene (Mobile only) */}
      <div className="fixed inset-0 z-0 pointer-events-none lg:hidden opacity-30">
        <GymScene />
      </div>

      {/* Dynamic Background Effects (Desktop/Fallback) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2rem] shadow-2xl z-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_20px_rgba(57,255,20,0.1)]"
          >
            <Fingerprint className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-white text-glow-small">Neural<span className="text-primary tracking-tighter ml-2">Sync</span></h1>
          <p className="text-muted-foreground mt-2 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 italic">Operative Authentication Portal</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">Email Vector</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-muted-foreground/20"
                placeholder="ENTER OPERATIVE EMAIL"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Passcode</label>
              <button type="button" className="text-[9px] text-primary/60 hover:text-primary font-bold uppercase tracking-widest transition-colors">Recover?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-muted-foreground/20"
                placeholder="••••••••"
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-black font-display font-black text-lg uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(57,255,20,0.15)] flex items-center justify-center gap-3 group relative overflow-hidden mt-2"
          >
             <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]" />
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                AUTHENTICATE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            New operative candidate? 
            <Link href="/register" className="text-primary hover:underline border-b border-primary/20 pb-0.5 ml-1 transition-all">Register Sequence</Link>
          </p>
        </div>

        {/* System Status Decorative Element */}
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-40">
           <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
           </div>
           <span className="text-[7px] font-bold uppercase tracking-[0.5em] text-muted-foreground">System Active // Secure Layer 4</span>
        </div>
      </motion.div>
    </div>
  );
}
