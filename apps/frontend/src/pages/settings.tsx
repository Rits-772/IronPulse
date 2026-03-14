import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Mail, Ruler, LogOut, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useProfile, useUpdateProfile } from "@/hooks/use-db-data";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

export default function Settings() {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    height_cm: "",
    weight_goal: "",
    body_fat_goal: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        height_cm: profile.height_cm?.toString() || "",
        weight_goal: profile.weight_goal?.toString() || "",
        body_fat_goal: profile.body_fat_goal?.toString() || ""
      });
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        username: formData.username,
        full_name: formData.full_name,
        height_cm: parseInt(formData.height_cm) || 0,
        weight_goal: parseFloat(formData.weight_goal) || 0,
        body_fat_goal: parseFloat(formData.body_fat_goal) || 0
      });
      toast({
        title: "Profile Updated",
        description: "System parameters successfully reconfigured.",
        className: "border-primary bg-background text-foreground",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold tracking-widest uppercase">System Settings</h1>
        <p className="text-muted-foreground font-sans mt-1">Configure your personal interface.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        
        {/* Profile Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card border border-white/5 rounded-xl p-6 lg:p-8"
        >
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
            <User className="w-6 h-6 text-primary" />
            <h2 className="font-display font-bold text-2xl uppercase tracking-widest">Identity Matrix</h2>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-lg px-4 py-3 font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-lg px-4 py-3 font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Mail className="w-4 h-4"/> Email Address</label>
              <input 
                type="email" 
                value={user?.email || ""} 
                disabled
                className="w-full bg-background/50 border border-white/5 rounded-lg px-4 py-3 font-mono text-muted-foreground outline-none transition-all cursor-not-allowed" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Ruler className="w-4 h-4"/> Height (CM)</label>
                <input 
                  type="number" 
                  value={formData.height_cm}
                  onChange={(e) => setFormData({...formData, height_cm: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-lg px-4 py-3 font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">Target Weight (KG)</label>
                <input 
                  type="number" 
                  value={formData.weight_goal}
                  onChange={(e) => setFormData({...formData, weight_goal: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-lg px-4 py-3 font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">Body Fat Goal (%)</label>
              <input 
                type="number" 
                value={formData.body_fat_goal}
                onChange={(e) => setFormData({...formData, body_fat_goal: e.target.value})}
                className="w-full md:w-1/2 bg-background border border-white/5 rounded-lg px-4 py-3 font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={updateProfile.isPending}
                className="bg-primary text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-primary/90 transition-all box-glow flex items-center gap-2"
              >
                {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Apply Changes
              </button>
            </div>
          </form>
        </motion.div>

        {/* Security & Danger Zone */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-card border border-white/5 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <Shield className="w-5 h-5 text-accent" />
              <h2 className="font-display font-bold text-xl uppercase tracking-widest">Security</h2>
            </div>
            <button className="w-full py-3 border border-white/10 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-all mb-3">
              Change Passcode
            </button>
            <button className="w-full py-3 border border-white/10 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-all">
              Two-Factor Auth
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-red-950/10 border border-red-500/20 rounded-xl p-6"
          >
             <h2 className="font-display font-bold text-xl text-red-500 uppercase tracking-widest mb-4">Danger Zone</h2>
             <p className="text-sm text-muted-foreground mb-6">These actions are irreversible and will wipe all neural link data.</p>
             
             <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-2">
              <LogOut className="w-4 h-4" /> Terminate Session
             </button>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}
