import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Fingerprint, Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { verifyOtp, supabase } = useAuth() as any; // Using supabase directly for signup
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "verify">("details");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await (supabase as any).auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      toast({
        title: "Initialization Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      // If Supabase is configured to confirm emails, it sends an OTP.
      // We switch to the verify step.
      setStep("verify");
      toast({
        title: "Phase I Complete",
        description: "Verification sequence transmitted to your email vector.",
      });
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await verifyOtp(email, otp, 'signup');

    if (error) {
      toast({
        title: "Link Terminated",
        description: "Invalid or expired sequence. Verify and retry.",
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Neural Sync Complete",
        description: "Welcome to the IronPulse network, operative.",
      });
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center px-4 relative overflow-hidden font-rajdhani">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2rem] shadow-2xl z-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-accent/20 shadow-[0_0_20px_rgba(0,212,255,0.1)]"
          >
            <ShieldCheck className="w-8 h-8 text-accent" />
          </motion.div>
          <h1 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-white">Create<span className="text-accent tracking-tighter ml-2">Identity</span></h1>
          <p className="text-muted-foreground mt-2 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 italic">Operative Registration Protocol</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "details" ? (
            <motion.form 
              key="details-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5" 
              onSubmit={handleRegister}
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">Designation</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm placeholder:text-muted-foreground/20"
                    placeholder="OPERATIVE NAME"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">Email Vector</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm placeholder:text-muted-foreground/20"
                    placeholder="ENTER EMAIL VECTOR"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">Passcode</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm placeholder:text-muted-foreground/20"
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
                className="w-full py-5 bg-accent text-black font-display font-black text-lg uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,212,255,0.15)] flex items-center justify-center gap-3 group relative overflow-hidden mt-4"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]" />
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    INITIALIZE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="verify-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6" 
              onSubmit={handleVerifyOtp}
            >
              <div className="space-y-2 text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                  <Fingerprint className="w-3 h-3" /> Step II: Verification
                </div>
                <p className="text-xs text-muted-foreground italic">Code dispatched to vector: <span className="text-white font-mono">{email}</span></p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] text-center block">Access Token</label>
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 text-center text-4xl font-display font-black tracking-[0.5em] text-accent focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted-foreground/10"
                  placeholder="000000"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-accent text-black font-display font-black text-lg uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,212,255,0.15)] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "VERIFY UPLINK"}
              </button>

              <button 
                type="button"
                onClick={() => setStep("details")}
                className="w-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-accent transition-colors text-center"
              >
                ← Return to Base
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            Existing operative? 
            <Link href="/login" className="text-accent hover:underline border-b border-accent/20 pb-0.5 ml-1 transition-all">Authenticate</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
