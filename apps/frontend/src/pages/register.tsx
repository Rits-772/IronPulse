import { useState } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Registration Error",
        description: "Passcodes do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (authError) {
      toast({
        title: "Registration Failed",
        description: authError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Usually Supabase triggers or a separate call creates a users profile table entry.
    // If the tables are already made, we might need to manually insert into a 'users' or 'profiles' table if it exists.
    // Assuming the user has a trigger set up for now, or just auth is enough for MVP.
    
    toast({
      title: "Success",
      description: "Subject initialized. Welcome to IronPulse.",
    });
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-accent rounded flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,212,255,0.5)]">
            <Dumbbell className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-glow-accent">New <span className="text-accent">Subject</span></h1>
          <p className="text-muted-foreground mt-2 text-sm uppercase tracking-wider">Register physical parameters</p>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Designation</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary border border-white/5 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm"
              placeholder="Display Name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Vector</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-white/5 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm"
              placeholder="athlete@ironpulse.net"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-white/5 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Confirm Passcode</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-secondary border border-white/5 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent text-black font-display font-bold text-xl uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] mt-6 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initialize Profile"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Existing subject? <Link href="/login" className="text-accent font-bold hover:underline">Authenticate</Link>
        </div>
      </motion.div>
    </div>
  );
}
