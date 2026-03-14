import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useMetricsData, useSaveMetrics } from "@/hooks/use-db-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Activity, Target, Save, Loader2, Upload, Image, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export default function BodyMetrics() {
  const { data: metrics } = useMetricsData();
  const { toast } = useToast();
  const saveMetrics = useSaveMetrics();
  
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    leftArm: "",
    rightArm: ""
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Photo Matrix Updated",
        description: "Visual data successfully synced to neural storage.",
      });
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: "Check if 'progress-photos' bucket exists in your Supabase dashboard.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMetrics.mutateAsync({
        weight_kg: parseFloat(formData.weight) || 0,
        body_fat: parseFloat(formData.bodyFat) || 0,
        chest_cm: parseFloat(formData.chest) || 0,
        waist_cm: parseFloat(formData.waist) || 0,
        arms_cm: (parseFloat(formData.leftArm) + parseFloat(formData.rightArm)) / 2 || 0, // Averaging arms for now as per schema singular arms_cm
      });

      toast({
        title: "Metrics Updated",
        description: "New biometric data recorded in the system.",
        className: "border-accent bg-background text-foreground",
      });
      
      setFormData({ weight: "", bodyFat: "", chest: "", waist: "", leftArm: "", rightArm: "" });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold tracking-widest uppercase">Biometrics</h1>
        <p className="text-muted-foreground font-sans mt-1">Track physiological adaptations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="col-span-1 bg-card border border-white/5 rounded-xl p-6 h-fit"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-display font-bold text-2xl uppercase tracking-widest text-glow-accent">Record Data</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Body Weight (LBS)</label>
              <input 
                type="number" step="0.1" 
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full bg-background border border-white/5 rounded-lg px-4 py-3 font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="0.0" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Body Fat (%)</label>
              <input 
                type="number" step="0.1" 
                value={formData.bodyFat}
                onChange={(e) => setFormData({...formData, bodyFat: e.target.value})}
                className="w-full bg-background border border-white/5 rounded-lg px-4 py-3 font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="0.0" 
              />
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Circumference (IN)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Chest</label>
                  <input 
                    type="number" 
                    value={formData.chest}
                    onChange={(e) => setFormData({...formData, chest: e.target.value})}
                    className="w-full bg-background border border-white/5 rounded-lg px-3 py-2 font-mono focus:border-accent outline-none" placeholder="0" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Waist</label>
                  <input 
                    type="number" 
                    value={formData.waist}
                    onChange={(e) => setFormData({...formData, waist: e.target.value})}
                    className="w-full bg-background border border-white/5 rounded-lg px-3 py-2 font-mono focus:border-accent outline-none" placeholder="0" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Left Arm</label>
                  <input 
                    type="number" 
                    value={formData.leftArm}
                    onChange={(e) => setFormData({...formData, leftArm: e.target.value})}
                    className="w-full bg-background border border-white/5 rounded-lg px-3 py-2 font-mono focus:border-accent outline-none" placeholder="0" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Right Arm</label>
                  <input 
                    type="number" 
                    value={formData.rightArm}
                    onChange={(e) => setFormData({...formData, rightArm: e.target.value})}
                    className="w-full bg-background border border-white/5 rounded-lg px-3 py-2 font-mono focus:border-accent outline-none" placeholder="0" 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saveMetrics.isPending}
              className="w-full mt-6 py-4 bg-accent text-black font-display font-bold text-xl uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {saveMetrics.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Entry
            </button>
          </form>
        </motion.div>

        {/* Visual Progress */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="col-span-1 bg-card border border-white/5 rounded-xl p-6 h-fit"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl uppercase tracking-widest text-glow">Photo Evidence</h3>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square w-full border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden relative"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
              accept="image/*" 
            />
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="text-center px-4">
                  <p className="font-bold uppercase tracking-widest text-sm">Upload Matrix Photo</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
            Visual tracking permits neural verification of physical adaptations. Photos are stored in restricted access buffers.
          </p>
        </motion.div>

        {/* Charts */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card border border-white/5 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-xl uppercase tracking-widest flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" /> Weight Trend
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" tick={{fontFamily: 'Rajdhani'}} />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#ffffff50" tick={{fontFamily: 'Rajdhani'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                  <Line type="monotone" dataKey="weight" name="Weight (lbs)" stroke="hsl(var(--accent))" strokeWidth={4} dot={{r: 5, fill: "hsl(var(--accent))"}} activeDot={{r: 8, fill: "#fff"}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card border border-white/5 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-xl uppercase tracking-widest flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Body Fat %
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" tick={{fontFamily: 'Rajdhani'}} />
                  <YAxis domain={[10, 25]} stroke="#ffffff50" tick={{fontFamily: 'Rajdhani'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                  <Line type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="hsl(var(--primary))" strokeWidth={4} dot={{r: 5, fill: "hsl(var(--primary))"}} activeDot={{r: 8, fill: "#fff"}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}
