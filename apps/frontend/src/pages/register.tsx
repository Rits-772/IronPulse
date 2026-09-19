import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { registerSchema } from "@/lib/schemas";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading, signUp, signInAsDemo } = useAuth();
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [isSuccessConfirmation, setIsSuccessConfirmation] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      setLocation("/dashboard");
    }
  }, [user, authLoading, setLocation]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Passcode Mismatch",
        description: "Passcode and confirmation sequence must match exactly.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '_')).toLowerCase().trim();

    // Zod Validation
    const validation = registerSchema.safeParse({ 
      email, 
      password, 
      username: cleanUsername, 
      fullName: name 
    });

    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0]?.message || "Invalid registration vector.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await signUp(email, password, {
      data: {
        full_name: name.trim(),
        username: cleanUsername,
      },
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to initialize operative identity.",
        variant: "destructive",
      });
      setLoading(false);
    } else {
      // If user session is established immediately
      if (data?.session) {
        toast({
          title: "Operative Identity Initialized",
          description: "Neural link established. Welcome to IronPulse.",
        });
        setLocation("/dashboard");
      } else {
        // Confirmation email dispatched
        setIsSuccessConfirmation(true);
        toast({
          title: "Confirmation Transmitted",
          description: "Verification link dispatched to your email vector.",
        });
        setLoading(false);
      }
    }
  };

  const handleDemoLogin = () => {
    setDemoLoading(true);
    signInAsDemo();
    toast({
      title: "Demo Operative Activated",
      description: "Sandbox protocol commenced with default telemetry profile.",
    });
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center px-4 py-8 relative overflow-hidden font-rajdhani">
      {/* Ambient Background & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card/50 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl z-10 relative overflow-hidden"
      >
        {/* Neon Border Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_#00D4FF]" />
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 mb-3 relative cursor-pointer"
            >
              <img 
                src="/logo.svg" 
                alt="IronPulse Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,212,255,0.6)]"
              />
            </motion.div>
          </Link>
          <h1 className="text-3xl font-display font-black uppercase tracking-[0.2em] text-white">
            Create <span className="text-accent text-glow">Identity</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-[10px] font-mono font-bold uppercase tracking-[0.3em] opacity-70">
            Enroll In Neural Training Protocol
          </p>
        </div>

        {isSuccessConfirmation ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 mx-auto flex items-center justify-center text-accent shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-white">
              Verification Dispatched
            </h2>
            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
              We transmitted a neural verification uplink to <span className="text-accent font-bold">{email}</span>. Click the link in your inbox to confirm your operative status and sign in.
            </p>
            <div className="pt-4">
              <Link 
                href="/login" 
                className="inline-block py-3 px-8 bg-accent text-black font-display font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-accent/90 transition-all shadow-lg"
              >
                Proceed to Login →
              </Link>
            </div>
          </motion.div>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                Operative Designation (Full Name)
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                  placeholder="e.g. Alex Vance"
                  disabled={loading || demoLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                Callsign (Username)
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted-foreground text-xs">@</span>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                  placeholder="nexus_operative"
                  disabled={loading || demoLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                Email Vector
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                  placeholder="operative@domain.com"
                  disabled={loading || demoLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                  Passcode
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-10 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                    placeholder="••••••••"
                    disabled={loading || demoLoading}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                  Confirm Passcode
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-3.5 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm placeholder:text-muted-foreground/30"
                    placeholder="••••••••"
                    disabled={loading || demoLoading}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || demoLoading}
              className="w-full py-4 bg-accent text-black font-display font-black text-base uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,212,255,0.2)] flex items-center justify-center gap-3 group relative overflow-hidden mt-3 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  INITIALIZE IDENTITY <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        {!isSuccessConfirmation && (
          <>
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#0b0c10] px-3 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                or instant evaluation
              </span>
            </div>

            {/* Demo One-Click Login */}
            <button 
              type="button"
              onClick={handleDemoLogin}
              disabled={loading || demoLoading}
              className="w-full py-3 bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/5 text-white font-display font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2 group"
            >
              {demoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
                  ENTER AS DEMO OPERATIVE
                </>
              )}
            </button>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                Existing Operative?{" "}
                <Link href="/login" className="text-accent font-bold hover:underline transition-all ml-1">
                  Authenticate Uplink →
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
