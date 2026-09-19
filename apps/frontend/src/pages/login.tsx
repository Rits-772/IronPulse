import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginSchema } from "@/lib/schemas";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading, signIn, resetPassword } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      setLocation("/dashboard");
    }
  }, [user, authLoading, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0]?.message || "Invalid input vector.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid email vector or passcode sequence.",
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Neural Uplink Synchronized",
        description: "Welcome back to IronPulse, Operative.",
      });
      setLocation("/dashboard");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);

    const { error } = await resetPassword(resetEmail);
    if (error) {
      toast({
        title: "Reset Transmission Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Recovery Uplink Dispatched",
        description: "Passcode recovery transmission sent to your email vector.",
      });
      setIsResetOpen(false);
      setResetEmail("");
    }
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center px-4 relative overflow-hidden font-rajdhani">
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card/50 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl z-10 relative overflow-hidden"
      >
        {/* Neon Accent Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#39FF14]" />
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 mb-4 relative cursor-pointer"
            >
              <img 
                src="/logo.svg" 
                alt="IronPulse Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(57,255,20,0.6)]"
              />
            </motion.div>
          </Link>
          <h1 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-white">
            Authenticate <span className="text-primary text-glow">Uplink</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-70">
            Authorized Personnel Only
          </p>
        </div>

        {/* Security Badge */}
        <div className="mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <p className="text-[11px] font-mono text-muted-foreground leading-snug">
            Protected neural gateway. Only operatives with verified accounts may establish connection.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
              Email Vector
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                placeholder="operative@domain.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Passcode
              </label>
              <button 
                type="button" 
                onClick={() => setIsResetOpen(true)}
                className="text-[9px] font-mono font-bold text-primary/80 hover:text-primary transition-colors uppercase tracking-widest"
              >
                Forgot Passcode?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                placeholder="••••••••••••"
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
            className="w-full py-4 bg-primary text-black font-display font-black text-base uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all box-glow flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 mt-2"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                AUTHENTICATE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center pt-4 border-t border-white/5">
          <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
            Unregistered Subject?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline transition-all ml-1">
              Enroll New Operative →
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Forgot Password Dialog */}
      <AnimatePresence>
        {isResetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-black uppercase tracking-wider text-white">
                  Reset Passcode
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your registered email vector. A cryptographic recovery token will be dispatched.
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input 
                  type="email" 
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="operative@domain.com"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary"
                />
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsResetOpen(false)}
                    className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={resetLoading}
                    className="flex-1 py-2.5 bg-primary text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary/90 flex items-center justify-center gap-1"
                  >
                    {resetLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Transmit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
