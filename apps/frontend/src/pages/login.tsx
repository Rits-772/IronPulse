import { useState, lazy, Suspense } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { loginSchema } from "@/lib/schemas";

const GymScene = lazy(() => import("@/components/3d/GymScene"));

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Zod Validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Link Established",
        description: "Welcome back, operative.",
      });
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center px-4 relative overflow-hidden font-rajdhani">
      {/* Background Gym Scene (Mobile only) */}
      <div className="fixed inset-0 z-0 pointer-events-none lg:hidden opacity-30">
        <Suspense fallback={<div className="w-full h-full bg-black/20" />}>
          <GymScene />
        </Suspense>
      </div>

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
            animate={{ scale: [1, 1.05, 1], filter: ["drop-shadow(0 0 5px rgba(255,0,0,0.2))", "drop-shadow(0 0 15px rgba(255,0,0,0.4))", "drop-shadow(0 0 5px rgba(255,0,0,0.2))"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-24 h-24 mb-6 relative"
          >
            <img 
              src="/logo.png" 
              alt="IronPulse" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          <h1 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-white">Authenticate<span className="text-primary tracking-tighter ml-2">Securely</span></h1>
          <p className="text-muted-foreground mt-2 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 italic">Operative Neural Uplink</p>
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
                placeholder="ENTER EMAIL VECTOR"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Passcode</label>
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
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white font-display font-black text-lg uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,0,0,0.15)] flex items-center justify-center gap-3 group relative overflow-hidden mt-2"
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
            New operative? 
            <Link href="/register" className="text-primary hover:underline border-b border-primary/20 pb-0.5 ml-1 transition-all">Enroll Now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
