import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Dumbbell, Github, Mail, Globe, ArrowRight, ShieldCheck, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { signInWithGoogle, signInWithGithub, signInWithOtp, verifyOtp } = useAuth();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "verify">("email");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Supabase will send OTP if configured in Dashboard -> Auth -> Providers -> Email -> Enable OTP
    const { error } = await signInWithOtp(email);
    
    if (error) {
      toast({
        title: "Transmission Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Code Transmitted",
        description: "A 6-digit access code has been sent to your terminal.",
      });
      setStep("verify");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await verifyOtp(email, otp);

    if (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid or expired access code. Request a new sequence.",
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Authentication Successful",
        description: "Synchronizing operative data...",
      });
      setLocation("/dashboard");
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      if (provider === 'google') await signInWithGoogle();
      else await signInWithGithub();
    } catch (error: any) {
      toast({
        title: "OAuth Handshake Failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center px-4 relative overflow-hidden font-rajdhani">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
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
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_20px_rgba(57,255,20,0.1)]"
          >
            <Fingerprint className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-white">Neural<span className="text-primary tracking-tighter ml-2">Sync</span></h1>
          <p className="text-muted-foreground mt-2 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60 italic">Operative Authentication Portal</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.form 
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6" 
              onSubmit={handleRequestOtp}
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">Email Vector</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                    placeholder="ENTER OPERATIVE EMAIL"
                    disabled={loading}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-black font-display font-black text-lg uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(57,255,20,0.15)] flex items-center justify-center gap-3 group"
              >
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-3 h-3" /> Sequence Dispatched
                </div>
                <p className="text-xs text-muted-foreground">Transmitting to: <span className="text-white font-mono">{email}</span></p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] text-center block">Verification Token</label>
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 text-center text-4xl font-display font-black tracking-[0.5em] text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/10"
                  placeholder="000000"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-black font-display font-black text-lg uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(57,255,20,0.15)] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "COMPLETE UPLINK"}
              </button>

              <button 
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors text-center"
              >
                ← Terminal Reset
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-bold italic"><span className="bg-card px-4 text-muted-foreground shadow-xl rounded-full border border-white/5 py-1">Cross-Platform Uplink</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <div className="w-5 h-5 flex items-center justify-center bg-white rounded-full"><Globe className="w-3 h-3 text-black" /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-primary transition-colors">Google</span>
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
          >
            <Github className="w-5 h-5 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:text-primary transition-colors">GitHub</span>
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em]">New operative candidate? <Link href="/register" className="text-primary hover:underline border-b border-primary/20 pb-0.5 ml-1">Register Sequence</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
